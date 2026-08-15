#!/usr/bin/env python3
"""Checks for the config parsing, bar reading and scheduling. Run: python test_farmer.py

Deliberately dependency-free — screenshots are stubbed, so this runs anywhere,
including headless.
"""

from __future__ import annotations

import json
import sys
import tempfile
from pathlib import Path

import vision
from config import Action, Bar, Config, ConfigError, load_config
from farmer import Farmer

RED = (178, 34, 34)
BLACK = (10, 10, 10)


class FakeImage:
    """Stands in for the PIL image a screenshot returns."""

    def __init__(self, pixels: list[tuple[int, int, int]], height: int = 10):
        self._pixels = pixels
        self.width = len(pixels)
        self.height = height

    def convert(self, _mode):
        return self

    def getpixel(self, xy):
        return self._pixels[xy[0]]


def stub_screen(filled: int, total: int = 100, fill=RED, empty=BLACK) -> None:
    pixels = [fill if i < filled else empty for i in range(total)]
    vision._screenshot = lambda region: FakeImage(pixels)


def make_bar(**overrides) -> Bar:
    data = {"x1": 0, "y1": 0, "x2": 100, "y2": 10, "color": list(RED), "tolerance": 20}
    data.update(overrides)
    return Bar.from_dict(data, "test")


def test_bar_fill_fraction():
    bar = make_bar(samples=100)
    stub_screen(filled=50)
    assert abs(vision.bar_fill_fraction(bar) - 0.5) < 0.02

    stub_screen(filled=100)
    assert vision.bar_fill_fraction(bar) == 1.0

    stub_screen(filled=0)
    assert vision.bar_fill_fraction(bar) == 0.0


def test_contiguous_ignores_pixels_past_the_gap():
    """Stray UI pixels beyond the fill must not count as health."""
    pixels = [RED] * 30 + [BLACK] * 60 + [RED] * 10
    vision._screenshot = lambda region: FakeImage(pixels)

    contiguous = make_bar(samples=100, mode="contiguous")
    assert abs(vision.bar_fill_fraction(contiguous) - 0.3) < 0.02

    counted = make_bar(samples=100, mode="count")
    assert abs(vision.bar_fill_fraction(counted) - 0.4) < 0.02


def test_right_to_left_bar():
    pixels = [BLACK] * 75 + [RED] * 25
    vision._screenshot = lambda region: FakeImage(pixels)
    bar = make_bar(samples=100, direction="right_to_left")
    assert abs(vision.bar_fill_fraction(bar) - 0.25) < 0.02


def test_tolerance():
    near_red = (178 + 15, 34 + 15, 34 - 15)
    stub_screen(filled=100, fill=near_red)
    assert vision.bar_fill_fraction(make_bar(samples=100, tolerance=20)) == 1.0
    assert vision.bar_fill_fraction(make_bar(samples=100, tolerance=5)) == 0.0


def test_bar_region_normalises_corners():
    bar = make_bar(x1=380, x2=120, y1=74, y2=64)
    assert bar.region == (120, 64, 260, 10)


def test_config_rejects_bad_values():
    def loads(payload) -> None:
        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as handle:
            json.dump(payload, handle)
            path = handle.name
        try:
            load_config(path)
        finally:
            Path(path).unlink()

    cases = [
        ({"actions": [{"name": "a", "key": "1"}]}, "missing cooldown"),
        ({"actions": [{"name": "a", "key": "1", "cooldown_seconds": -1}]}, "negative cooldown"),
        ({"actions": []}, "no actions at all"),
        (
            {
                "actions": [{"name": "a", "key": "1", "cooldown_seconds": 1, "threshold": 4}],
            },
            "threshold out of range",
        ),
        (
            {
                "actions": [{"name": "a", "key": "1", "cooldown_seconds": 1}],
                "humanize": {"press_duration_range": [0.5, 0.1]},
            },
            "inverted range",
        ),
    ]
    for payload, label in cases:
        try:
            loads(payload)
        except ConfigError:
            continue
        raise AssertionError(f"config should have been rejected: {label}")


def test_config_example_parses():
    config = load_config(Path(__file__).with_name("config.example.json"))
    assert config.actions and config.potions
    hp = next(p for p in config.potions if p.bar is not None)
    assert hp.priority > max(a.priority for a in config.actions)


def test_should_fire_respects_threshold():
    farmer = Farmer(Config(actions=[], potions=[]), dry_run=True)
    potion = Action(
        name="hp", key="5", cooldown_seconds=10, threshold=0.5, bar=make_bar(samples=100)
    )

    stub_screen(filled=80)
    assert farmer.should_fire(potion, now=0.0) is False

    stub_screen(filled=40)
    assert farmer.should_fire(potion, now=0.0) is True


def test_unreadable_bar_backs_off_instead_of_raising():
    farmer = Farmer(Config(actions=[], potions=[]), dry_run=True)
    potion = Action(name="hp", key="5", cooldown_seconds=1, bar=make_bar())

    def boom(region):
        raise RuntimeError("no screen")

    vision._screenshot = boom
    assert farmer.should_fire(potion, now=100.0) is False
    assert potion.next_ready_at > 100.0


def test_potion_wins_over_rotation():
    """A ready potion must beat a ready attack, whatever order they appear in."""
    attack = Action(name="attack", key="1", cooldown_seconds=1.0, priority=10)
    potion = Action(name="hp", key="5", cooldown_seconds=10, priority=100)
    config = Config(actions=[attack], potions=[potion])

    ready = [a for a in config.all_actions if a.enabled]
    ready.sort(key=lambda a: (-a.priority, a.next_ready_at))
    assert ready[0] is potion


def test_jitter_stays_in_bounds():
    config = Config(actions=[], potions=[])
    config.humanize.cooldown_jitter_pct = 0.1
    farmer = Farmer(config, dry_run=True)
    for _ in range(200):
        value = farmer.jittered(10.0)
        assert 9.0 <= value <= 11.0

    config.humanize.cooldown_jitter_pct = 0.0
    assert farmer.jittered(10.0) == 10.0


def main() -> int:
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    failed = 0
    for test in tests:
        try:
            test()
        except Exception as exc:  # noqa: BLE001 - test runner reports everything
            failed += 1
            print(f"FAIL {test.__name__}: {exc}")
        else:
            print(f"ok   {test.__name__}")
    print(f"\n{len(tests) - failed}/{len(tests)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
