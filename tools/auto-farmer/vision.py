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


def _sample_points(image, bar: Bar) -> list[tuple[int, int]]:
    """Points to read, ordered from the bar's anchored end towards the empty end."""
    if bar.vertical:
        length, fixed = image.height, image.width // 2
    else:
        length, fixed = image.width, image.height // 2

    steps = min(bar.samples, length)
    if steps < 1:
        return []

    offsets = [min(int(i * length / steps), length - 1) for i in range(steps)]
    if bar.direction in ("right_to_left", "bottom_to_top"):
        offsets.reverse()
    return [(fixed, o) if bar.vertical else (o, fixed) for o in offsets]


def bar_fill_fraction(bar: Bar) -> float:
    """Return how full `bar` is, from 0.0 (empty) to 1.0 (full).

    Samples a line of pixels down the middle of the bar — across for horizontal
    bars, down for vertical ones — and compares each to the configured fill
    colour. In "contiguous" mode the walk starts at the anchored end and stops
    at the first non-matching sample, which ignores stray UI pixels past the
    end of the fill.
    """
    left, top, width, height = bar.region
    image = _grab((left, top, width, height)).convert("RGB")
    points = _sample_points(image, bar)
    if not points:
        return 0.0

    if bar.mode == "count":
        hits = sum(1 for p in points if _matches(image.getpixel(p), bar.color, bar.tolerance))
        return hits / len(points)

    filled = 0
    for point in points:
        if not _matches(image.getpixel(point), bar.color, bar.tolerance):
            break
        filled += 1
    return filled / len(points)
