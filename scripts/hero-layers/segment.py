"""Offline segmentation experiment. Dependencies live in workspace work/python-deps."""
import os, sys, json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / 'work/python-deps'))
os.environ['U2NET_HOME'] = str(ROOT / 'work/models')
os.environ['NUMBA_CACHE_DIR'] = str(ROOT / 'work/numba-cache')
from PIL import Image
from rembg import new_session, remove
OUT = ROOT / 'outputs/layer-review'
OUT.mkdir(parents=True, exist_ok=True)
SOURCES = {
 'desktop': str(ROOT / 'outputs/hero-breeze/src/assets/desktop-original.jpg'),
 'mobile': str(ROOT / 'outputs/hero-breeze/src/assets/mobile-original.jpg'),
}
if __name__ == '__main__':
 session = new_session('isnet-general-use', providers=['CPUExecutionProvider'])
 for name, source in SOURCES.items():
  original = Image.open(source).convert('RGB')
  mask = remove(original, session=session, only_mask=True)
  mask.save(OUT / f'{name}-isnet-mask.png')
  red = Image.new('RGB', original.size, 'red')
  overlay = Image.composite(red, original, mask.point(lambda p: round(p * .45)))
  overlay.save(OUT / f'{name}-isnet-overlay.jpg', quality=95)
  print(json.dumps({'variant':name, 'size':original.size, 'mask_bbox':mask.getbbox()}), flush=True)
