import os
import re
from tarot import TAROT_DECK

IMAGES_DIR = "./images"

def slugify(text: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '_', text.lower()).strip('_')
    return slug  # tanpa “.png”

def main():
    if not os.path.isdir(IMAGES_DIR):
        print(f"❌ Folder tidak ditemukan: {IMAGES_DIR}")
        return

    for filename in os.listdir(IMAGES_DIR):
        if not filename.lower().startswith("dall·e") or not filename.lower().endswith(".png"):
            continue

        name, ext = os.path.splitext(filename)
        file_slug = slugify(name)
        matched = False

        for card in TAROT_DECK:
            card_slug = slugify(card['name'])  # ex: "page_of_swords"
            if card_slug in file_slug:
                new_name = card_slug + ext
                src = os.path.join(IMAGES_DIR, filename)
                dst = os.path.join(IMAGES_DIR, new_name)
                if os.path.exists(dst):
                    print(f"⚠️  Lewati — '{new_name}' sudah ada.")
                else:
                    os.rename(src, dst)
                    print(f"✅ Renamed: '{filename}' → '{new_name}'")
                matched = True
                break

        if not matched:
            print(f"❓ Unmatched: '{filename}' — perlu rename manual.")

    print("\n🎉 Selesai. Periksa folder 'images/' untuk file baru.")

if __name__ == "__main__":
    main()
