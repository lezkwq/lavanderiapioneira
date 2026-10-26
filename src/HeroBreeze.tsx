import { useEffect, useRef, useState } from 'react';
import desktop from './assets/desktop-original.jpg';
import mobile from './assets/mobile-original.jpg';
import { BreezeRenderer, type Metadata } from './renderer';
import type { SceneMetadata } from './sceneMotion';
import { HeroInterface } from './HeroInterface';

type Debug = {phase:number;frames:number;running:boolean;ready:boolean;variant:string;error:string;dpr:number;activeEngines:number;setTime:(seconds:number|null)=>void;frameTimes:Float32Array;sampleCount:number};
declare global {interface Window {__hero?:Debug;__setHeroTime?:(seconds:number|null)=>void;}}
const choose=()=>innerWidth>=innerHeight?'desktop':'mobile';
const asset=(variant:string,suffix:string)=>`${import.meta.env.BASE_URL}hero/${variant}${suffix}`;
async function image(src:string){const im=new Image();im.src=src;await im.decode();return im;}

export function HeroBreeze(){
 const [variant,setVariant]=useState(choose);
 const root=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{let timer=0;const resize=()=>{clearTimeout(timer);timer=window.setTimeout(()=>setVariant(choose()),150);};window.addEventListener('resize',resize);window.addEventListener('orientationchange',resize);return()=>{clearTimeout(timer);window.removeEventListener('resize',resize);window.removeEventListener('orientationchange',resize);};},[]);
 useEffect(()=>{
  const el=canvas.current!,hero=root.current!,media=matchMedia('(prefers-reduced-motion: reduce)');
  let disposed=false,renderer:BreezeRenderer|null=null,raf=0,last=0,phase=0,visible=false,lost=false,initializing=false;
  const query=new URLSearchParams(location.search).get('t');
  let frozen:number|null=query!==null&&Number.isFinite(Number(query))?Number(query):null;
  let sum=0,number=0,elapsed=0;
  const debug:Debug={phase:0,frames:0,running:false,ready:false,variant,error:'',dpr:1,activeEngines:0,frameTimes:new Float32Array(2400),sampleCount:0,setTime:(seconds)=>{frozen=seconds;if(seconds!==null)phase=((seconds%8)+8)%8;last=0;sync();}};
  window.__hero=debug;window.__setHeroTime=debug.setTime;
  const show=(value:boolean)=>{el.dataset.visible=String(value);};
  const stop=()=>{if(raf)cancelAnimationFrame(raf);raf=0;last=0;debug.running=false;};
  const paint=()=>{if(renderer){renderer.draw(phase);debug.phase=phase;debug.frames++;debug.dpr=renderer.getDpr();}};
  const tick=(now:number)=>{
   raf=0;
   if(disposed||!renderer||lost||!visible||media.matches||document.hidden||frozen!==null){sync();return;}
   // Analytic animation needs real active elapsed time, not a physics dt cap.
   // Visibility/offscreen/reduced-motion pauses already reset `last`.
   if(last){const dt=now-last;phase=(phase+dt/1000)%8;
    debug.frameTimes[debug.sampleCount%2400]=dt;debug.sampleCount++;
    sum+=dt;number++;elapsed+=dt;
    if(elapsed>=1000){if(sum/number>20)renderer.reduceDpr();sum=0;number=0;elapsed=0;}
   }
   last=now;paint();raf=requestAnimationFrame(tick);debug.running=true;
  };
  function sync(){
   stop();
   if(disposed||lost||!renderer||media.matches||!visible){show(false);return;}
   paint();show(true);
   if(!document.hidden&&frozen===null){raf=requestAnimationFrame(tick);debug.running=true;}
  }
  async function initialize(){
   if(initializing||disposed||media.matches)return;initializing=true;
   try{
    const [metadata,images,scene]=await Promise.all([
     fetch(asset(variant,'.json')).then(r=>{if(!r.ok)throw Error('metadata');return r.json() as Promise<Metadata>;}),
     Promise.all([image(variant==='desktop'?desktop:mobile),image(asset(variant,'-background.webp')),image(asset(variant,'-shirt.webp')),image(asset(variant,'-scene.webp')),image(asset(variant,'-bubble-index.png'))]),
     fetch(asset(variant,'-scene.json')).then(r=>{if(!r.ok)throw Error('scene metadata');return r.json() as Promise<SceneMetadata>;})
    ]);
    if(disposed||lost)return;
    renderer?.destroy();renderer=new BreezeRenderer(el,metadata,images,variant==='mobile',scene,new URLSearchParams(location.search).get('sceneMotion')!=='0');debug.activeEngines=1;debug.ready=true;
    phase=0;paint(); // Mandatory first frame at rest, before revealing the canvas.
    if(frozen!==null)phase=((frozen%8)+8)%8;
    sync();
   }catch(error){debug.error=String(error);debug.ready=false;show(false);renderer?.destroy();renderer=null;debug.activeEngines=0;}
   finally{initializing=false;}
  }
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0});io.observe(hero);
  const visibility=()=>sync();
  const reduced=()=>{if(media.matches){stop();show(false);}else if(renderer)sync();else void initialize();};
  const resize=()=>{renderer?.resize();sync();};
  const onLost=(event:Event)=>{event.preventDefault();lost=true;stop();show(false);debug.ready=false;renderer?.destroy();renderer=null;debug.activeEngines=0;};
  const onRestored=()=>{lost=false;void initialize();};
  document.addEventListener('visibilitychange',visibility);media.addEventListener('change',reduced);window.addEventListener('resize',resize);
  el.addEventListener('webglcontextlost',onLost);el.addEventListener('webglcontextrestored',onRestored);
  void initialize();
  return()=>{disposed=true;stop();io.disconnect();document.removeEventListener('visibilitychange',visibility);media.removeEventListener('change',reduced);window.removeEventListener('resize',resize);el.removeEventListener('webglcontextlost',onLost);el.removeEventListener('webglcontextrestored',onRestored);renderer?.destroy();debug.activeEngines=0;show(false);if(window.__hero===debug){delete window.__hero;delete window.__setHeroTime;}};
 },[variant]);
 return <main ref={root} id="inicio" className="hero isolate" aria-label="White Lavanderia"><img src={variant==='desktop'?desktop:mobile} alt="Camiseta branca presa a um varal, com céu azul, nuvens e bolhas de sabão" fetchPriority="high"/><canvas ref={canvas} aria-hidden="true"/><HeroInterface /></main>;
}
