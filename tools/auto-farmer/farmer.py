#!/usr/bin/env python3
"""Auto-farmer: presses a configured key rotation and drinks potions on cue.

    python farmer.py --config config.json
    python farmer.py --config config.json --dry-run --verbose

Stop at any time with the stop hotkey (default F12) or Ctrl+C in this terminal.
"""

from __future__ import annotations

import argparse
import random
import sys
import time

from backends import WindowWatcher, make_input_backend
from config import Action, Config, ConfigError, load_config
from vision import bar_fill_fraction


def log(message: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {message}", flush=True)


class Controls:
    """Global stop / pause driven by hotkeys, with Ctrl+C as the fallback."""

    def __init__(self, stop_key: str, pause_key: str) -> None:
        self.stop = False
        self.paused = False
        self.stop_key = stop_key
        self.pause_key = pause_key
        self.available = False
        self._listener = None

    def start(self) -> None:
        try:
            from pynput import keyboard
        except ImportError:
            log("pynput not installed — hotkeys are off, use Ctrl+C to stop")
            return

        def resolve(name: str):
            name = name.strip().lower()
            special = getattr(keyboard.Key, name, None)
            if special is not None:
                return special
            return keyboard.KeyCode.from_char(name)

        wanted_stop = resolve(self.stop_key)
        wanted_pause = resolve(self.pause_key)

        def on_press(key):
            if key == wanted_stop:
                self.stop = True
                log("stop hotkey pressed")
            elif key == wanted_pause:
                self.paused = not self.paused
                log("paused" if self.paused else "resumed")

        try:
            self._listener = keyboard.Listener(on_press=on_press)
            self._listener.start()
            self.available = True
        except Exception as exc:  # noqa: BLE001 - headless/permission failures vary by OS
            log(f"hotkeys unavailable ({exc}) — use Ctrl+C to stop")

    def shutdown(self) -> None:
        if self._listener is not None:
            self._listener.stop()


class Farmer:
    def __init__(self, config: Config, dry_run: bool = False, verbose: bool = False):
        self.config = config
        self.verbose = verbose
        self.backend = make_input_backend(config.backend, dry_run=dry_run)
        self.window = WindowWatcher(config.window_title_contains)
        self.controls = Controls(config.stop_hotkey, config.pause_hotkey)
        self.gcd_ready_at = 0.0
        self.started_at = 0.0
        self.blocked_notice = False
        self.next_break_at = float("inf")

    # -- scheduling ------------------------------------------------------

    def jittered(self, seconds: float) -> float:
        pct = self.config.humanize.cooldown_jitter_pct
        if pct <= 0:
            return seconds
        return max(0.0, seconds * (1.0 + random.uniform(-pct, pct)))

    def press_duration(self, action: Action) -> float:
        if action.hold_seconds is not None:
            return action.hold_seconds
        low, high = self.config.humanize.press_duration_range
        return random.uniform(low, high)

    def should_fire(self, action: Action, now: float) -> bool:
        """Cooldown is up — check any bar condition attached to the action."""
        if action.bar is None:
            return True
        try:
            fraction = bar_fill_fraction(action.bar)
        except Exception as exc:  # noqa: BLE001 - a bad read shouldn't kill the run
            log(f"could not read the bar for '{action.name}': {exc}")
            # Back off so a broken config doesn't spam this every tick.
            action.next_ready_at = now + 5.0
            return False
        if fraction <= action.threshold:
            log(f"{action.name}: bar at {fraction:.0%} (threshold {action.threshold:.0%})")
            return True
        return False

    def fire(self, action: Action, now: float) -> None:
        hold = self.press_duration(action)
        self.backend.press(action.key, hold)
        action.presses += 1
        action.next_ready_at = now + self.jittered(action.cooldown_seconds)
        # Hold the rest of the group back too, so a single dip in the bar
        # doesn't drain every potion slot at once.
        group_cooldown = self.config.groups.get(action.group)
        if group_cooldown:
            for other in self.config.all_actions:
                if other.group == action.group:
                    other.next_ready_at = max(other.next_ready_at, now + group_cooldown)
        self.gcd_ready_at = (
            time.monotonic() + self.config.global_cooldown_seconds + action.after_seconds
        )
        if self.verbose:
            log(f"pressed '{action.key}' for {action.name}")

    def schedule_break(self, now: float) -> None:
        breaks = self.config.humanize.breaks
        if not breaks.enabled:
            self.next_break_at = float("inf")
            return
        low, high = breaks.every_minutes_range
        self.next_break_at = now + random.uniform(low, high) * 60.0

    def take_break(self, now: float) -> None:
        low, high = self.config.humanize.breaks.duration_seconds_range
        duration = random.uniform(low, high)
        log(f"taking a {duration:.0f}s break")
        deadline = time.monotonic() + duration
        while time.monotonic() < deadline and not self.controls.stop:
            time.sleep(min(0.2, deadline - time.monotonic()))
        self.schedule_break(time.monotonic())

    # -- main loop -------------------------------------------------------

    def run(self, countdown: int = 5) -> int:
        config = self.config
        log(f"input backend: {self.backend.name}")
        if self.window.available:
            log(f"only acting while the focused window matches '{config.window_title_contains}'")
        elif self.window.reason:
            log(f"window check off: {self.window.reason}")

        self.controls.start()
        if self.controls.available:
            log(
                f"hotkeys: {config.stop_hotkey.upper()} = stop, "
                f"{config.pause_hotkey.upper()} = pause/resume"
            )

        for remaining in range(countdown, 0, -1):
            log(f"starting in {remaining}s — focus the game window")
            time.sleep(1)

        now = time.monotonic()
        self.started_at = now
        self.gcd_ready_at = now
        for action in config.all_actions:
            action.next_ready_at = now + action.initial_delay_seconds
        self.schedule_break(now)
        deadline = (
            now + config.max_runtime_minutes * 60.0
            if config.max_runtime_minutes > 0
            else float("inf")
        )
        log("running")

        try:
            while not self.controls.stop:
                now = time.monotonic()
                if now >= deadline:
                    log("max runtime reached")
                    break
                if self.controls.paused:
                    time.sleep(config.tick_seconds)
                    continue
                if now >= self.next_break_at:
                    self.take_break(now)
                    continue
                if not self.window.is_focused():
                    if not self.blocked_notice:
                        log("game window lost focus — holding")
                        self.blocked_notice = True
                    time.sleep(0.2)
                    continue
                if self.blocked_notice:
                    log("game window focused again — resuming")
                    self.blocked_notice = False
                if now < self.gcd_ready_at:
                    time.sleep(min(config.tick_seconds, self.gcd_ready_at - now))
                    continue

                # Potions first, then the rotation; higher priority wins, and
                # ties go to whichever came off cooldown earliest.
                ready = [
                    a
                    for a in config.all_actions
                    if a.enabled and now >= a.next_ready_at
                ]
                ready.sort(key=lambda a: (-a.priority, a.next_ready_at))
                for action in ready:
                    if self.should_fire(action, now):
                        self.fire(action, now)
                        break
                else:
                    time.sleep(config.tick_seconds)
        except KeyboardInterrupt:
            log("interrupted")
        finally:
            self.controls.shutdown()

        self.report()
        return 0

    def report(self) -> None:
        elapsed = max(time.monotonic() - self.started_at, 1e-6)
        minutes = elapsed / 60.0
        log(f"ran for {int(elapsed // 60)}m {int(elapsed % 60)}s")
        rows = [a for a in self.config.all_actions if a.presses]
        if not rows:
            log("no keys were pressed")
            return
        width = max(len(a.name) for a in rows)
        for action in sorted(rows, key=lambda a: -a.presses):
            print(
                f"  {action.name.ljust(width)}  {action.presses:>6} presses"
                f"  ({action.presses / minutes:.1f}/min)"
            )


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", default="config.json", help="path to the config file")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="run the loop and the bar checks without sending any keys",
    )
    parser.add_argument("--verbose", action="store_true", help="log every key press")
    parser.add_argument(
        "--countdown",
        type=int,
        default=5,
        help="seconds to wait before starting, so you can focus the game",
    )
    parser.add_argument(
        "--duration",
        type=float,
        default=None,
        help="stop after this many minutes (overrides max_runtime_minutes)",
    )
    args = parser.parse_args(argv)

    try:
        config = load_config(args.config)
    except ConfigError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    if args.duration is not None:
        config.max_runtime_minutes = args.duration

    try:
        farmer = Farmer(config, dry_run=args.dry_run, verbose=args.verbose)
    except (RuntimeError, ImportError, ValueError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    return farmer.run(countdown=max(args.countdown, 0))


if __name__ == "__main__":
    sys.exit(main())
