import sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'work/python-deps'))
import cv2
import numpy as np
from PIL import Image
OUT=ROOT/'outputs/layer-review'
for name in ['desktop','mobile']:
 rgb=np.array(Image.open(ROOT/f'outputs/hero-breeze/src/assets/{name}-original.jpg').convert('RGB'))
 mask=np.array(Image.open(OUT/f'{name}-grabcut-mask.png'))
 expanded=cv2.dilate((mask>0).astype('uint8')*255,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(17,17)))
 for label,method in [('telea',cv2.INPAINT_TELEA),('ns',cv2.INPAINT_NS)]:
  result=cv2.inpaint(rgb,expanded,5,method)
  Image.fromarray(result).save(OUT/f'{name}-background-{label}.jpg',quality=95)
  print(f'{name} {label} filled pixels {int((expanded>0).sum())}',flush=True)
 # Manual alternative: borrow cloud texture at the same elevation from the left.
 # Blend through a wide inner transition, preserving EVERY pixel outside the mask.
 h,w=mask.shape
 yy,xx=np.indices((h,w))
 # Only this verified cloud donor is used: no garment, rope, pins or bubbles.
 source=Image.open(ROOT/'outputs/hero-breeze/src/assets/desktop-original.jpg').convert('RGB')
 donor=np.array(source.crop((250,480,750,930)).resize((w,h),Image.Resampling.BICUBIC))
 dist=cv2.distanceTransform(expanded,cv2.DIST_L2,5)
 alpha=np.clip(dist/35,0,1)[:,:,None]
 # Navier-Stokes boundary gives way to copied texture well inside the garment.
 ns=cv2.inpaint(rgb,expanded,5,cv2.INPAINT_NS)
 manual=(ns*(1-alpha)+donor*alpha).astype('uint8')
 manual[expanded==0]=rgb[expanded==0]
 Image.fromarray(manual).save(OUT/f'{name}-background-manual.jpg',quality=95)
