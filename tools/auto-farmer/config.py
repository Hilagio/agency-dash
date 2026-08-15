"""Config loading and validation for the auto-farmer."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path


class ConfigError(Exception):
    """Raised when a config file is missing required fields or has bad values."""


@dataclass
class Bar:
    """A rectangular on-screen resource bar (health, mana, stamina, ...)."""

    x1: int
    y1: int
    x2: int
    y2: int
    color: tuple[int, int, int]
    tolerance: int = 40
    samples: int = 40
    # "contiguous" walks from the bar's origin and stops at the first gap (best
    # for smooth bars). "count" totals every matching sample (best for segmented
    # or pip-style bars).
    mode: str = "contiguous"
    # Where the fill is anchored, i.e. the end that stays coloured as the bar
    # drains. Vertical HUD bars are usually "bottom_to_top".
    direction: str = "left_to_right"

    @property
    def vertical(self) -> bool:
        return self.direction in ("top_to_bottom", "bottom_to_top")

    @property
    def region(self) -> tuple[int, int, int, int]:
        """(left, top, width, height) with the corners normalised."""
        left, right = sorted((self.x1, self.x2))
        top, bottom = sorted((self.y1, self.y2))
        return left, top, max(right - left, 1), max(bottom - top, 1)

    @classmethod
    def from_dict(cls, data: dict, where: str) -> "Bar":
        for key in ("x1", "y1", "x2", "y2", "color"):
            if key not in data:
                raise ConfigError(f"{where}: bar is missing '{key}'")
        color = tuple(data["color"])
        if len(color) < 3:
            raise ConfigError(f"{where}: bar color must be [r, g, b]")
        mode = data.get("mode", "contiguous")
        if mode not in ("contiguous", "count"):
            raise ConfigError(f"{where}: bar mode must be 'contiguous' or 'count'")
        direction = data.get("direction", "left_to_right")
        directions = ("left_to_right", "right_to_left", "top_to_bottom", "bottom_to_top")
        if direction not in directions:
            raise ConfigError(f"{where}: bar direction must be one of {', '.join(directions)}")
        return cls(
            x1=int(data["x1"]),
            y1=int(data["y1"]),
            x2=int(data["x2"]),
            y2=int(data["y2"]),
            color=(int(color[0]), int(color[1]), int(color[2])),
            tolerance=int(data.get("tolerance", 40)),
            samples=max(int(data.get("samples", 40)), 4),
            mode=mode,
            direction=direction,
        )


@dataclass
class Action:
    """One key in the rotation, or one potion."""

    name: str
    key: str
    cooldown_seconds: float
    priority: int = 0
    enabled: bool = True
    hold_seconds: float | None = None
    # Wait this long after pressing before anything else fires (cast time,
    # animation lock). Counted on top of the global cooldown.
    after_seconds: float = 0.0
    # Potion-only: fire when the bar drops to or below this fraction (0..1).
    bar: Bar | None = None
    threshold: float = 0.5
    # Delay the first press by this many seconds after start.
    initial_delay_seconds: float = 0.0
    # Actions sharing a group name also share a cooldown (see Config.groups),
    # so three HP potion slots don't all empty into one dip in the bar.
    group: str = ""

    # Runtime state.
    next_ready_at: float = field(default=0.0, repr=False)
    presses: int = field(default=0, repr=False)

    @classmethod
    def from_dict(cls, data: dict, where: str) -> "Action":
        for key in ("name", "key", "cooldown_seconds"):
            if key not in data:
                raise ConfigError(f"{where}: action is missing '{key}'")
        cooldown = float(data["cooldown_seconds"])
        if cooldown < 0:
            raise ConfigError(f"{where}: cooldown_seconds must be >= 0")
        threshold = float(data.get("threshold", 0.5))
        if not 0.0 <= threshold <= 1.0:
            raise ConfigError(f"{where}: threshold must be between 0 and 1")
        bar = data.get("bar")
        return cls(
            name=str(data["name"]),
            key=str(data["key"]),
            cooldown_seconds=cooldown,
            priority=int(data.get("priority", 0)),
            enabled=bool(data.get("enabled", True)),
            hold_seconds=(
                float(data["hold_seconds"]) if data.get("hold_seconds") else None
            ),
            after_seconds=float(data.get("after_seconds", 0.0)),
            bar=Bar.from_dict(bar, f"{where}.{data['name']}") if bar else None,
            threshold=threshold,
            initial_delay_seconds=float(data.get("initial_delay_seconds", 0.0)),
            group=str(data.get("group", "")),
        )


@dataclass
class Breaks:
    """Occasional idle pauses so the timing pattern isn't perfectly uniform."""

    enabled: bool = False
    every_minutes_range: tuple[float, float] = (12.0, 25.0)
    duration_seconds_range: tuple[float, float] = (20.0, 70.0)


@dataclass
class Humanize:
    cooldown_jitter_pct: float = 0.08
    press_duration_range: tuple[float, float] = (0.04, 0.09)
    breaks: Breaks = field(default_factory=Breaks)


@dataclass
class Config:
    actions: list[Action]
    potions: list[Action]
    backend: str = "auto"
    window_title_contains: str = ""
    tick_seconds: float = 0.05
    global_cooldown_seconds: float = 0.35
    stop_hotkey: str = "f12"
    pause_hotkey: str = "f11"
    humanize: Humanize = field(default_factory=Humanize)
    # Stop on their own after this long. 0 = run until stopped.
    max_runtime_minutes: float = 0.0
    # group name -> seconds every member waits after any one of them fires.
    groups: dict[str, float] = field(default_factory=dict)

    @property
    def all_actions(self) -> list[Action]:
        return self.potions + self.actions


def _range(data: dict, key: str, fallback: tuple[float, float], where: str):
    raw = data.get(key)
    if raw is None:
        return fallback
    if not isinstance(raw, (list, tuple)) or len(raw) != 2:
        raise ConfigError(f"{where}: '{key}' must be [min, max]")
    low, high = float(raw[0]), float(raw[1])
    if low > high:
        raise ConfigError(f"{where}: '{key}' min is greater than max")
    return low, high


def load_config(path: str | Path) -> Config:
    path = Path(path)
    if not path.exists():
        raise ConfigError(
            f"config not found: {path}\n"
            "Copy config.example.json and edit it to match your keybinds."
        )
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ConfigError(f"{path}: invalid JSON — {exc}") from exc

    actions = [Action.from_dict(a, "actions") for a in data.get("actions", [])]
    potions = [Action.from_dict(p, "potions") for p in data.get("potions", [])]
    if not actions and not potions:
        raise ConfigError(f"{path}: define at least one action or potion")

    hum = data.get("humanize", {})
    breaks_raw = hum.get("breaks", {})
    humanize = Humanize(
        cooldown_jitter_pct=float(hum.get("cooldown_jitter_pct", 0.08)),
        press_duration_range=_range(
            hum, "press_duration_range", (0.04, 0.09), "humanize"
        ),
        breaks=Breaks(
            enabled=bool(breaks_raw.get("enabled", False)),
            every_minutes_range=_range(
                breaks_raw, "every_minutes_range", (12.0, 25.0), "humanize.breaks"
            ),
            duration_seconds_range=_range(
                breaks_raw, "duration_seconds_range", (20.0, 70.0), "humanize.breaks"
            ),
        ),
    )

    groups = {str(k): float(v) for k, v in data.get("groups", {}).items()}
    for action in actions + potions:
        if action.group and action.group not in groups:
            raise ConfigError(
                f"action '{action.name}' uses group '{action.group}', "
                "which is not defined in 'groups'"
            )

    hotkeys = data.get("hotkeys", {})
    return Config(
        actions=actions,
        potions=potions,
        backend=str(data.get("backend", "auto")),
        window_title_contains=str(data.get("window_title_contains", "")),
        tick_seconds=max(float(data.get("tick_seconds", 0.05)), 0.01),
        global_cooldown_seconds=float(data.get("global_cooldown_seconds", 0.35)),
        stop_hotkey=str(hotkeys.get("stop", "f12")),
        pause_hotkey=str(hotkeys.get("pause", "f11")),
        humanize=humanize,
        max_runtime_minutes=float(data.get("max_runtime_minutes", 0.0)),
        groups=groups,
    )
