"""Export review candidates; metadata distinguishes annotation from measurement."""
import json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'work/python-deps'))
import numpy as np
from PIL import Image
CFG=json.loads(Path(__file__).with_name('contours.json').read_text())
OUT=ROOT/'outputs/hero-breeze/public/hero'; OUT.mkdir(parents=True,exist_ok=True)
for name,c in CFG.items():
 im=Image.open(ROOT/f'outputs/hero-breeze/src/assets/{name}-original.jpg').convert('RGB')
 mask=Image.open(ROOT/f'outputs/layer-review/{name}-grabcut-mask.png')
 w,h=im.size; l,t,r,b=mask.getbbox(); box=[max(0,l-16),max(0,t-16),min(w,r+16),min(h,b+16)]
 shirt=im.convert('RGBA'); shirt.putalpha(mask); shirt=shirt.crop(box)
 # WebP convention stores straight alpha; WebGL premultiplies once on upload.
 # Lossless preserves source interior RGB and avoids broad differences at rest.
 shirt.save(OUT/f'{name}-shirt.webp',lossless=True,method=6)
 bg=Image.open(ROOT/f'outputs/layer-review/{name}-background-manual.jpg')
 bg.save(OUT/f'{name}-background.webp',quality=85,method=6)
 arr=np.array(mask); yy,xx=np.where(arr>127)
 # Project human-annotated landmark hints onto actual segmented pixels.
 def nearest(p):
  i=np.argmin((xx-p[0])**2+(yy-p[1])**2)
  return [int(xx[i]),int(yy[i])]
 pins=[nearest(p) for p in c['anchors']]; sleeves=[nearest(p) for p in c['sleeves']]
 hem=[]
 for x in range(int(xx.min()),int(xx.max())+1,12):
  ys=np.where(arr[:,x]>127)[0]
  if len(ys) and ys.max()>h*.7: hem.append([x,int(ys.max())])
 meta={'imageSize':[w,h],'crop':box,'bboxNormalized':[l/w,t/h,(r-l)/w,(b-t)/h],
  'pins':pins,'sleeves':sleeves,'hem':hem,'landmarkMethod':'manual hints projected onto segmented pixels; hem is bottommost mask pixel per sampled column',
  'backgroundApproved':False,'alphaStorage':'straight; UNPACK_PREMULTIPLY_ALPHA_WEBGL on upload'}
 (OUT/f'{name}.json').write_text(json.dumps(meta,indent=2))
 print(json.dumps({'variant':name,'crop':box,'backgroundBytes':(OUT/f'{name}-background.webp').stat().st_size,'shirtBytes':(OUT/f'{name}-shirt.webp').stat().st_size}),flush=True)
