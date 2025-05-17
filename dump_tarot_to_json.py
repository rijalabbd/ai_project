# dump_tarot_to_json.py
import json
from tarot import TAROT_DECK

with open('tarot.json', 'w', encoding='utf-8') as f:
    json.dump(TAROT_DECK, f, ensure_ascii=False, indent=2)
