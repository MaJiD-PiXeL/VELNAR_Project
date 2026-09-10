"""
Sakhtane icon haye extension (16/48/128) az ruye khode logo e asli e VELNAR,
bedune hich sadeh-sazi ya jaygozini - hamun tasviri ke tarahi shode, faghat
resize shode baraye har andaze.

Manba: assets/logo-source.png (crop shode va gushehash transparent shode
az ruye faile asli).

Ejra: pip install Pillow && python3 scripts/generate_icons.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "assets", "logo-source.png")
OUT_DIR = os.path.join(ROOT, "extension", "icons")
SIZES = [16, 48, 128]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    if not os.path.exists(SOURCE):
        raise SystemExit(f"Source logo not found at {SOURCE}")

    logo = Image.open(SOURCE).convert("RGBA")
    for size in SIZES:
        out_path = os.path.join(OUT_DIR, f"icon{size}.png")
        logo.resize((size, size), Image.LANCZOS).save(out_path)
        print(f"saved {out_path}")


if __name__ == "__main__":
    main()
