#!/usr/bin/env python3
"""Optimize hardcover box images for the website.

Usage:
  python scripts/optimize-hardcover-images.py input-folder
  python scripts/optimize-hardcover-images.py input-folder --output images/hardcover-boxes-optimized

The script keeps the original pixel dimensions by default, converts images to
JPG, strips metadata, and uses web-friendly JPEG compression.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}


def output_name(source: Path) -> str:
    return f"{source.stem}.jpg"


def optimize_image(source: Path, destination: Path, quality: int) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)

        if image.mode in {"RGBA", "LA"}:
            background = Image.new("RGB", image.size, "white")
            alpha = image.getchannel("A") if "A" in image.getbands() else None
            background.paste(image.convert("RGBA"), mask=alpha)
            image = background
        else:
            image = image.convert("RGB")

        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(
            destination,
            "JPEG",
            quality=quality,
            optimize=True,
            progressive=True,
            subsampling="4:2:0",
        )


def main() -> int:
    parser = argparse.ArgumentParser(description="Optimize images for hardcover boxes gallery.")
    parser.add_argument("input", type=Path, help="Folder containing new source images.")
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("images/hardcover-boxes-optimized"),
        help="Output folder. Default: images/hardcover-boxes-optimized",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=82,
        help="JPEG quality, 1-95. Default: 82",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing optimized files.",
    )
    args = parser.parse_args()

    if not args.input.is_dir():
        raise SystemExit(f"Input folder does not exist: {args.input}")

    images = sorted(
        path for path in args.input.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    if not images:
        raise SystemExit("No supported images found.")

    optimized = 0
    skipped = 0

    for source in images:
        destination = args.output / output_name(source)
        if destination.exists() and not args.overwrite:
            print(f"skip existing: {destination}")
            skipped += 1
            continue

        optimize_image(source, destination, args.quality)
        before_kb = source.stat().st_size / 1024
        after_kb = destination.stat().st_size / 1024
        print(f"optimized: {source.name} -> {destination.name} ({before_kb:.0f}KB -> {after_kb:.0f}KB)")
        optimized += 1

    print(f"Done. Optimized: {optimized}. Skipped: {skipped}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
