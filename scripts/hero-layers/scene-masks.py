"""Local motion controls only. Does not modify existing garment assets."""
import sys,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
sys.path.insert(0,str(ROOT/'work/python-deps'))
import cv2
import numpy as np
from PIL import Image,ImageDraw

config={
 'desktop':{'bubbles':[[715,214,60,12,17,0],[910,299,77,8,14,.8],[817,458,40,8,13,1.9],[984,630,48,9,15,2.7],[1642,329,55,0,4,3.4],[1618,246,11,4,8,4.1]],'rope':[[470,0],[1035,211],[1530,165],[1672,114]],'sun':[155,125]},
 'mobile':{'bubbles':[[143,755,69,12,20,0],[302,846,67,9,18,.8],[230,986,33,8,15,1.9],[347,1114,40,9,18,2.7],[709,665,49,10,17,3.4],[885,558,18,7,13,4.1],[660,593,12,6,11,4.9],[384,514,11,6,10,5.6],[935,885,48,0,4,1.2],[901,819,10,5,9,2.3],[714,1417,19,7,14,3.7]],'rope':[[0,586],[421,762],[831,748],[941,718]],'sun':[80,140]}
}
for name,c in config.items():
 src=ROOT/f'outputs/hero-breeze/src/assets/{name}-original.jpg'
 rgb=np.array(Image.open(src).convert('RGB'));h,w=rgb.shape[:2]
 # Cloud confidence from actual brightness/chroma, blurred into broad patches.
 f=rgb.astype(float)/255
 white=np.clip((f[:,:,0]-.37)/.38,0,1)*np.clip(1-(f[:,:,2]-f[:,:,0])/.48,0,1)
 clouds=cv2.GaussianBlur(white.astype('float32'),(0,0),18)
 protection=Image.new('L',(w,h));d=ImageDraw.Draw(protection)
 d.line([tuple(p) for p in c['rope']],fill=255,width=16)
 pins=json.loads(Path(__file__).with_name('contours.json').read_text())[name]['pins']
 for poly in pins:d.polygon([tuple(p) for p in poly],fill=255)
 # Keep all original garment pixels and their immediate surroundings fixed.
 garment=np.array(Image.open(ROOT/f'outputs/layer-review/{name}-grabcut-mask.png'))
 guard=cv2.dilate((garment>0).astype('uint8')*255,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(25,25)))
 structure=np.array(protection)
 fixed=np.maximum(structure,guard)
 fixed=np.maximum(fixed/255,cv2.GaussianBlur(fixed,(0,0),5)/255)
 yy,xx=np.indices((h,w));sx,sy=c['sun']
 sun=1-np.clip((np.sqrt(((xx-sx)/300)**2+((yy-sy)/320)**2)-.4)/.6,0,1)
 fixed=np.maximum(fixed,sun)
 # Bubble interiors are rigid; suppress cloud flow in their entire neighborhood.
 for x,y,r,*_ in c['bubbles']:
  distance=np.sqrt((xx-x)**2+(yy-y)**2)
  clouds*=np.clip((distance-r-24)/32,0,1)
 mask=np.zeros((h,w,3),dtype='uint8')
 mask[:,:,0]=np.clip(clouds*(1-fixed)*255,0,255).astype('uint8')
 structure=np.maximum(structure/255,cv2.GaussianBlur(structure,(0,0),5)/255)
 mask[:,:,1]=np.clip(np.maximum(structure,sun)*255,0,255).astype('uint8')
 out=ROOT/'outputs/hero-breeze/public/hero'
 Image.fromarray(mask).save(out/f'{name}-scene.webp',lossless=True,method=6)
 # Conservative per-tile candidate list. Same field, no full-screen bubble scan.
 lw,lh=(w+7)//8,(h+7)//8
 ly,lx=np.indices((lh,lw));lx=(lx+.5)*w/lw;ly=(ly+.5)*h/lh
 ids=np.zeros((lh,lw,4),dtype='uint8');counts=np.zeros((lh,lw),dtype='int32')
 for index,(x,y,r,ax,ay,phase) in enumerate(c['bubbles']):
  reach=r+45+np.hypot(1.55*ax,1.8*ay)+12
  active=(lx-x)**2+(ly-y)**2<reach**2
  rows,cols=np.where(active)
  if np.any(counts[active]>=4):raise RuntimeError('More than four candidates; increase lookup capacity')
  ids[rows,cols,counts[active]]=index+1
  counts[active]+=1
 if counts.max()>3:raise RuntimeError('RGB lookup supports three candidates')
 Image.fromarray(ids[:,:,:3]).save(out/f'{name}-bubble-index.png')
 print(name,'max tile candidates',int(counts.max()),'index bytes',(out/f'{name}-bubble-index.png').stat().st_size,flush=True)
 # Human-observed coordinates are versioned above; not inferred measurements.
 (out/f'{name}-scene.json').write_text(json.dumps({'bubbles':c['bubbles'],'imageSize':[w,h]},indent=2))
 debug=np.dstack((mask[:,:,0],np.zeros((h,w),dtype='uint8'),mask[:,:,1]))
 Image.fromarray(debug).save(ROOT/f'outputs/layer-review/{name}-scene-control.png')
 print(name,'scene control bytes',(out/f'{name}-scene.webp').stat().st_size,flush=True)
