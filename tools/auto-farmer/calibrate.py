#!/usr/bin/env python3
"""Helpers for filling in the config: pixel coords, bar readings, window titles.

    python calibrate.py pick                       # hover over a pixel, read x/y/RGB
    python calibrate.py bar --name hp_potion       # live fill % for a configured bar
    python calibrate.py window                     # title of the focused window
"""

from __future__ import annotations

import argparse
import sys
import time

from backends import WindowWatcher
from config import ConfigError, load_config
from vision import bar_fill_fraction


def cmd_pick(args) -> int:
    import pyautogui

    print("Move the mouse over the pixel you want. Ctrl+C to quit.\n")
    print("For a health bar: read the LEFT edge of the fill, then the RIGHT edge")
    print("at full health. Those become x1/y1 and x2/y2, and the RGB becomes color.\n")
    try:
        while True:
            x, y = pyautogui.position()
            r, g, b = pyautogui.pixel(x, y)[:3]
            print(f"\r x={x:<6} y={y:<6} rgb=({r:>3}, {g:>3}, {b:>3})   ", end="", flush=True)
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\n")
    return 0


def cmd_bar(args) -> int:
    try:
        config = load_config(args.config)
    except ConfigError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    named = {a.name: a for a in config.all_actions if a.bar is not None}
    if not named:
        print("error: no action in the config has a 'bar' block", file=sys.stderr)
        return 2

    action = named.get(args.name) if args.name else next(iter(named.values()))
    if action is None:
        print(
            f"error: no bar named '{args.name}'. Available: {', '.join(named)}",
            file=sys.stderr,
        )
        return 2

    print(f"Watching '{action.name}' (fires at or below {action.threshold:.0%}). Ctrl+C to quit.\n")
    try:
        while True:
            fraction = bar_fill_fraction(action.bar)
            bar = "#" * int(fraction * 30)
            state = "WOULD FIRE" if fraction <= action.threshold else "ok"
            print(f"\r {fraction:>6.1%} |{bar:<30}| {state:<10}", end="", flush=True)
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\n")
    return 0


def cmd_window(args) -> int:
    watcher = WindowWatcher("x")  # any non-empty value enables the lookup
    print("Focus the game, then read the title below. Ctrl+C to quit.\n")
    try:
        while True:
            try:
                title = watcher.title()
            except Exception as exc:  # noqa: BLE001 - report rather than crash
                title = f"<unavailable: {exc}>"
            print(f"\r {title[:100]:<100}", end="", flush=True)
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\n")
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--interval", type=float, default=0.2, help="refresh seconds")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("pick", help="print the pixel under the cursor")

    bar = sub.add_parser("bar", help="print a configured bar's fill live")
    bar.add_argument("--config", default="config.json")
    bar.add_argument("--name", default=None, help="which action's bar to watch")

    sub.add_parser("window", help="print the focused window title")

    args = parser.parse_args(argv)
    return {"pick": cmd_pick, "bar": cmd_bar, "window": cmd_window}[args.command](args)


if __name__ == "__main__":
    sys.exit(main())
