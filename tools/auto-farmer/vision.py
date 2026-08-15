"""Reads how full an on-screen resource bar is."""

from __future__ import annotations

from config import Bar

_screenshot = None


def _grab(region: tuple[int, int, int, int]):
    """Screenshot a region as a PIL image, importing the backend on first use."""
    global _screenshot
    if _screenshot is None:
        try:
            import pyautogui
        except ImportError as exc:  # pragma: no cover - depends on install
            raise RuntimeError(
                "Screen reading needs pyautogui: pip install -r requirements.txt"
            ) from exc
        _screenshot = pyautogui.screenshot
    return _screenshot(region=region)


def _matches(pixel, color: tuple[int, int, int], tolerance: int) -> bool:
    return all(abs(pixel[i] - color[i]) <= tolerance for i in range(3))


def bar_fill_fraction(bar: Bar) -> float:
    """Return how full `bar` is, from 0.0 (empty) to 1.0 (full).

    Samples a row of pixels across the middle of the bar and compares each to
    the configured fill colour. In "contiguous" mode the walk starts at the
    bar's origin and stops at the first non-matching sample, which ignores
    stray UI pixels past the end of the fill.
    """
    left, top, width, height = bar.region
    image = _grab((left, top, width, height)).convert("RGB")
    row = image.height // 2
    steps = min(bar.samples, image.width)
    if steps < 1:
        return 0.0

    columns = [min(int(i * image.width / steps), image.width - 1) for i in range(steps)]
    if bar.direction == "right_to_left":
        columns.reverse()

    if bar.mode == "count":
        hits = sum(
            1 for x in columns if _matches(image.getpixel((x, row)), bar.color, bar.tolerance)
        )
        return hits / steps

    filled = 0
    for x in columns:
        if not _matches(image.getpixel((x, row)), bar.color, bar.tolerance):
            break
        filled += 1
    return filled / steps
