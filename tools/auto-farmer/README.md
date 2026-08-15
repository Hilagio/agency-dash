# Auto-farmer

A key-rotation bot for repetitive grinding: it presses your skill keys on their
cooldowns and drinks a potion when a health/mana bar drops below a threshold it
reads off the screen.

It is standalone — no connection to the Next.js app in this repo. Everything
lives in this folder.

> Automating input is against the terms of service of most online games. Where
> and whether you run this is your call.

## Install

```bash
cd tools/auto-farmer
python3 -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp config.example.json config.json
```

## Set it up

1. **Find the window title** (optional but recommended — the bot then only
   presses keys while the game is focused, so it never types into your browser):

   ```bash
   python calibrate.py window
   ```

   Put a distinctive part of the title into `window_title_contains`.

2. **List your rotation.** Edit the `actions` array: one entry per key, with the
   skill's real cooldown. `priority` decides who wins when several are ready at
   once — higher fires first. Set `after_seconds` for skills with a cast time or
   animation lock.

3. **Point it at your health bar.** Run:

   ```bash
   python calibrate.py pick
   ```

   Hover over the **left edge** of the health bar's coloured fill and note
   `x`, `y` and `rgb` → that's `x1`, `y1` and `color`. Then hover over the
   **right edge at full health** → `x2`, `y2`. Verify with:

   ```bash
   python calibrate.py bar --name "hp potion"
   ```

   It prints the live fill percentage. Take damage and watch it drop. If the
   number jumps around, widen `tolerance`; if it reads 100% while you're hurt,
   check that `y1`/`y2` sit inside the bar and not on its border.

4. **Dry run first** — the loop and bar checks run, but no keys are sent:

   ```bash
   python farmer.py --dry-run --verbose --duration 2
   ```

5. **Go:**

   ```bash
   python farmer.py --config config.json
   ```

   You get a 5-second countdown to focus the game. **F12 stops, F11
   pauses/resumes**, and Ctrl+C in the terminal always works. On exit it prints
   how many times each key fired.

## Config reference

| Field | Meaning |
| --- | --- |
| `backend` | `auto`, `pydirectinput` or `pyautogui`. See the platform notes below. |
| `window_title_contains` | Only act while the focused window title contains this. Empty = always act. |
| `global_cooldown_seconds` | Minimum gap between any two key presses. |
| `tick_seconds` | How often the loop re-evaluates. `0.05` is plenty. |
| `max_runtime_minutes` | Auto-stop after this long. `0` = until you stop it. |
| `hotkeys.stop` / `hotkeys.pause` | Hotkey names, e.g. `f12`, `f9`, `esc`. |

**Actions and potions** take the same fields — the only difference is that a
potion has a `bar` and fires on a condition instead of purely on a timer.

| Field | Meaning |
| --- | --- |
| `name` | Label used in logs and stats. |
| `key` | Key to press, e.g. `1`, `f`, `space`. |
| `cooldown_seconds` | Minimum wait before this action can fire again. |
| `priority` | Higher wins when several are ready. Potions sit above the rotation. |
| `enabled` | Set `false` to keep an entry around without using it. |
| `after_seconds` | Extra pause after pressing — cast time or animation lock. |
| `hold_seconds` | Hold the key this long instead of a randomised tap. |
| `initial_delay_seconds` | Delay the first press after start (handy for buffs). |
| `threshold` | Potions: fire at or below this fraction, e.g. `0.55` = 55%. |

**Bar** describes the rectangle to read:

| Field | Meaning |
| --- | --- |
| `x1`,`y1`,`x2`,`y2` | Screen coords of the fill, from left edge to right edge at full. |
| `color` | `[r, g, b]` of the filled part. |
| `tolerance` | Per-channel wiggle room. Raise it for gradient bars. |
| `mode` | `contiguous` (default, smooth bars) or `count` (segmented/pip bars). |
| `direction` | `left_to_right` (default) or `right_to_left` for bars that drain the other way. |

**Humanize** keeps the timing from being perfectly uniform:
`cooldown_jitter_pct` (±% on every cooldown), `press_duration_range` (how long
each key is held) and `breaks` (occasional idle pauses — off by default).

## Platform notes

- **Windows** — most games read DirectInput and ignore the events pyautogui
  sends. `pydirectinput` is installed automatically and picked by `auto`. If
  keys still do nothing, run the terminal as Administrator: a game running
  elevated won't accept input from an unelevated process.
- **macOS** — grant your terminal both **Accessibility** and **Screen
  Recording** in System Settings → Privacy & Security, then restart it.
  Without Screen Recording the bar always reads as full.
- **Linux** — X11 works; `calibrate.py window` needs `xdotool`
  (`apt install xdotool`). Under Wayland, screenshots and synthetic key events
  are blocked for ordinary apps — log into an X11 session instead.

## Fullscreen games

Screen reading and key injection are both more reliable in **borderless
windowed** mode than in exclusive fullscreen. If the bar reads as black or the
keys don't land, switch the game's display mode first.

## Tests

```bash
python test_farmer.py
```

Screenshots are stubbed, so this runs headless and needs no dependencies.
