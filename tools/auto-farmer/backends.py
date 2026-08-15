"""Sending keystrokes and reading the focused window, per platform.

Most games read keyboard input through DirectInput on Windows, which ignores
the SendInput calls pyautogui makes for characters. pydirectinput uses scancodes
instead and works in those games, so it is preferred when available.
"""

from __future__ import annotations

import subprocess
import sys
import time


class InputBackend:
    """Presses keys. `name` is shown at startup so the choice is visible."""

    name = "none"

    def press(self, key: str, hold_seconds: float) -> None:
        raise NotImplementedError


class DryRunBackend(InputBackend):
    name = "dry-run (no keys sent)"

    def press(self, key: str, hold_seconds: float) -> None:
        return


class DirectInputBackend(InputBackend):
    name = "pydirectinput (Windows scancodes)"

    def __init__(self) -> None:
        import pydirectinput

        pydirectinput.PAUSE = 0
        pydirectinput.FAILSAFE = False
        self._mod = pydirectinput

    def press(self, key: str, hold_seconds: float) -> None:
        self._mod.keyDown(key)
        time.sleep(hold_seconds)
        self._mod.keyUp(key)


class PyAutoGuiBackend(InputBackend):
    name = "pyautogui"

    def __init__(self) -> None:
        import pyautogui

        pyautogui.PAUSE = 0
        # The corner-of-screen failsafe would raise mid-run; the stop hotkey is
        # the intended way out.
        pyautogui.FAILSAFE = False
        self._mod = pyautogui

    def press(self, key: str, hold_seconds: float) -> None:
        self._mod.keyDown(key)
        time.sleep(hold_seconds)
        self._mod.keyUp(key)


def make_input_backend(preference: str = "auto", dry_run: bool = False) -> InputBackend:
    """Build an input backend. `preference` is auto, pydirectinput or pyautogui."""
    if dry_run:
        return DryRunBackend()

    if preference == "pydirectinput":
        return DirectInputBackend()
    if preference == "pyautogui":
        return PyAutoGuiBackend()
    if preference != "auto":
        raise ValueError(f"unknown backend: {preference}")

    if sys.platform == "win32":
        try:
            return DirectInputBackend()
        except ImportError:
            pass
    try:
        return PyAutoGuiBackend()
    except ImportError as exc:
        raise RuntimeError(
            "No input backend available: pip install -r requirements.txt"
        ) from exc


def _active_window_title_windows() -> str:
    import ctypes

    user32 = ctypes.windll.user32
    handle = user32.GetForegroundWindow()
    length = user32.GetWindowTextLengthW(handle)
    buffer = ctypes.create_unicode_buffer(length + 1)
    user32.GetWindowTextW(handle, buffer, length + 1)
    return buffer.value


def _active_window_title_macos() -> str:
    script = (
        'tell application "System Events" to get name of first '
        "application process whose frontmost is true"
    )
    result = subprocess.run(
        ["osascript", "-e", script], capture_output=True, text=True, timeout=2
    )
    return result.stdout.strip()


def _active_window_title_linux() -> str:
    result = subprocess.run(
        ["xdotool", "getactivewindow", "getwindowname"],
        capture_output=True,
        text=True,
        timeout=2,
    )
    return result.stdout.strip()


class WindowWatcher:
    """Tells us whether the game window is focused.

    Polling the OS on every tick is wasteful, so results are cached briefly.
    If the platform lookup is unavailable the watcher reports "focused" rather
    than blocking the run, and says so once at startup.
    """

    def __init__(self, title_contains: str, cache_seconds: float = 0.5) -> None:
        self.title_contains = title_contains.lower()
        self.cache_seconds = cache_seconds
        self.available = True
        self.reason = ""
        self._checked_at = 0.0
        self._cached = True

        if not self.title_contains:
            self.available = False
            self.reason = "no window_title_contains set — focus is not checked"
            return

        try:
            self.title()
        except Exception as exc:  # noqa: BLE001 - any lookup failure degrades the same way
            self.available = False
            self.reason = f"cannot read the focused window ({exc})"

    def title(self) -> str:
        if sys.platform == "win32":
            return _active_window_title_windows()
        if sys.platform == "darwin":
            return _active_window_title_macos()
        return _active_window_title_linux()

    def is_focused(self) -> bool:
        if not self.available:
            return True
        now = time.monotonic()
        if now - self._checked_at < self.cache_seconds:
            return self._cached
        self._checked_at = now
        try:
            self._cached = self.title_contains in self.title().lower()
        except Exception:  # noqa: BLE001 - transient lookup failures shouldn't stop the run
            self._cached = True
        return self._cached
