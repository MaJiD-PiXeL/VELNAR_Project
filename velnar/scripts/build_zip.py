"""
Package kardane pooshe extension/ be ye zip amade baraye Chrome Web Store.
Ejra: python3 scripts/build_zip.py
Khoruji: dist/velnar-extension.zip
"""
import os
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "extension")
DIST_DIR = os.path.join(ROOT, "dist")
OUT_ZIP = os.path.join(DIST_DIR, "velnar-extension.zip")


def build():
    os.makedirs(DIST_DIR, exist_ok=True)
    if os.path.exists(OUT_ZIP):
        os.remove(OUT_ZIP)

    with zipfile.ZipFile(OUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, _dirs, files in os.walk(SRC_DIR):
            for name in files:
                full_path = os.path.join(root, name)
                # masiro nesbi negah midarim ta manifest.json dagigh ru rishe zip biad
                arcname = os.path.relpath(full_path, SRC_DIR)
                zf.write(full_path, arcname)

    print(f"built: {OUT_ZIP}")


if __name__ == "__main__":
    build()
