"""Compare manual contour and GrabCut; never silently approve an asset."""
import sys, json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[4]
deps = ROOT / 'work/python-deps'
if not deps.exists():
 deps = next((ROOT / 'work/tmp').glob('pip-target-*/lib/python'))
sys.path.insert(0, str(deps))
import cv2
import numpy as np
from PIL import Image, ImageDraw
CONFIG = json.loads(Path(__file__).with_name('contours.json').read_text())
OUT = ROOT / 'outputs/layer-review'
OUT.mkdir(parents=True, exist_ok=True)

def polygon_mask(size, points):
 im=Image.new('L',(size[0]*4,size[1]*4)); d=ImageDraw.Draw(im)
 d.polygon([(int(x*4),int(y*4)) for x,y in points],fill=255)
 return np.array(im.resize(size,Image.Resampling.LANCZOS))

for name,cfg in CONFIG.items():
 source=ROOT / f'outputs/hero-breeze/src/assets/{name}-original.jpg'
 im=Image.open(source).convert('RGB'); rgb=np.array(im)
 manual=polygon_mask(im.size,cfg['polygon'])
 hard=(manual>127).astype('uint8')
 kernel=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(41,41))
 inner=cv2.erode(hard,kernel); outer=cv2.dilate(hard,kernel)
 markers=np.full(hard.shape,cv2.GC_BGD,dtype='uint8')
 markers[outer>0]=cv2.GC_PR_BGD; markers[hard>0]=cv2.GC_PR_FGD
 markers[inner>0]=cv2.GC_FGD
 cv2.grabCut(cv2.cvtColor(rgb,cv2.COLOR_RGB2BGR),markers,None,np.zeros((1,65)),np.zeros((1,65)),5,cv2.GC_INIT_WITH_MASK)
 grab=np.where((markers==cv2.GC_FGD)|(markers==cv2.GC_PR_FGD),255,0).astype('uint8')
 count,labels,stats,_=cv2.connectedComponentsWithStats(grab)
 largest=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
 grab=np.where(labels==largest,255,0).astype('uint8')
 # Fill enclosed false-negative holes; exterior concavities remain open.
 flood=grab.copy(); cv2.floodFill(flood,None,(0,0),255)
 grab=cv2.bitwise_or(grab,cv2.bitwise_not(flood))
 grab=np.minimum(grab,cv2.dilate(manual,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9))))
 # Conservative outer matte: the previous tight cut left JPEG edge pixels behind.
 grab=cv2.dilate(grab,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
 grab=cv2.GaussianBlur(grab,(3,3),.5)
 pins=np.zeros(hard.shape,dtype='uint8')
 for pin in cfg['pins']: pins=np.maximum(pins,polygon_mask(im.size,pin))
 pins=cv2.dilate(pins,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
 for method,mask in [('manual',manual),('grabcut',grab)]:
  mask=(mask.astype(float)*(1-pins/255.)).astype('uint8')
  Image.fromarray(mask).save(OUT/f'{name}-{method}-mask.png')
  red=rgb.astype(float).copy(); a=(mask/255.*.45)[:,:,None]
  overlay=(red*(1-a)+np.array([255,0,0])*a).astype('uint8')
  Image.fromarray(overlay).save(OUT/f'{name}-{method}-overlay.jpg',quality=95)
  rgba=np.dstack((rgb,mask)); cut=Image.fromarray(rgba)
  check=np.indices(hard.shape).sum(axis=0)//16%2*40+150
  bg=np.repeat(check[:,:,None],3,axis=2)
  comp=rgb*(mask[:,:,None]/255)+bg*(1-mask[:,:,None]/255)
  Image.fromarray(comp.astype('uint8')).save(OUT/f'{name}-{method}-checker.jpg',quality=95)
 print(json.dumps({'variant':name,'manual_pixels':int((manual>127).sum()),'grabcut_pixels':int((grab>127).sum()),'changed_pixels':int(((manual>127)!=(grab>127)).sum())}),flush=True)

