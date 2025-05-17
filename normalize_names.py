import os, re

IMAGES_DIR = "./images"
MAJOR = {
    "fool":"the_fool", "magician":"the_magician", "high_priestess":"the_high_priestess",
    "empress":"the_empress", "emperor":"the_emperor", "hierophant":"the_hierophant",
    "lovers":"the_lovers", "chariot":"the_chariot", "strength":"strength",
    "hermit":"the_hermit", "fortune":"wheel_of_fortune", "justice":"justice",
    "hanged":"the_hanged_man", "death":"death", "temperance":"temperance",
    "devil":"the_devil", "tower":"the_tower", "star":"the_star",
    "moon":"the_moon", "sun":"the_sun", "judgement":"judgement",
    "world":"the_world"
}

for fname in os.listdir(IMAGES_DIR):
    if not fname.lower().endswith(".png"): continue
    base, ext = os.path.splitext(fname)
    # buang prefix
    name = re.sub(r'^(major_arcana_|minor_arcana_)', '', base)
    # map Major Arcana ke slug "the_..." bila perlu
    if base.startswith("major_arcana_") and name in MAJOR:
        name = MAJOR[name]
    # minor_arcana already "ace_of_cups", "two_of_swords", dst.
    src = os.path.join(IMAGES_DIR, fname)
    dst = os.path.join(IMAGES_DIR, name + ext)
    if src != dst:
        print(f"Renaming {fname} → {name + ext}")
        os.rename(src, dst)
