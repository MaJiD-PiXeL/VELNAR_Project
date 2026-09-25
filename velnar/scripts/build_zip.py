"""
Package kardane pooshe extension/ be ye zip amade baraye Chrome Web Store.
Ejra: python3 scripts/build_zip.py
Khoruji: dist/velnar-extension.zip
"""
import os
import json
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "extension")
DIST_DIR = os.path.join(ROOT, "dist")
OUT_ZIP = os.path.join(DIST_DIR, "velnar-extension.zip")


def build():
    os.makedirs(DIST_DIR, exist_ok=True)
    with open(os.path.join(SRC_DIR, "manifest.json"), encoding="utf-8-sig") as source:
        manifest = json.load(source)
    if len(manifest["description"]) > 132:
        raise ValueError("Manifest description exceeds 132 characters")
    pending = OUT_ZIP + ".tmp"
    with zipfile.ZipFile(pending, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _dirs, files in os.walk(SRC_DIR):
            _dirs.sort()
            for name in sorted(files):
                full_path = os.path.join(root, name)
                # masiro nesbi negah midarim ta manifest.json dagigh ru rishe zip biad
                arcname = os.path.relpath(full_path, SRC_DIR)
                zf.write(full_path, arcname)
    os.replace(pending, OUT_ZIP)

    print(f"built: {OUT_ZIP}")


if __name__ == "__main__":
    build()
