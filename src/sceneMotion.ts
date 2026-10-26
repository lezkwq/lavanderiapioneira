/** Independent background motion. Garment motion lives exclusively in motion.ts. */
export const MAX_BUBBLES = 12;
export type SceneMetadata = {imageSize:[number,number]; bubbles:number[][]};
export class SceneMotion {
 readonly geometry=new Float32Array(MAX_BUBBLES*4);
 readonly offsets=new Float32Array(MAX_BUBBLES*2);
 readonly clouds=new Float32Array(4);
 constructor(private meta:SceneMetadata){
  for(let i=0;i<meta.bubbles.length;i++)this.geometry.set(meta.bubbles[i].slice(0,3),i*4);
 }
 update(seconds:number){
  const phase=(((seconds%8)+8)%8)/8,theta=2*Math.PI*phase;
  for(let i=0;i<this.meta.bubbles.length;i++){
   const b=this.meta.bubbles[i],p=b[5],k=b[2]<22?2:1,t=theta*k;
   this.offsets[i*2]=b[3]*(.65*(Math.sin(t+p)-Math.sin(p))+.25*Math.sin(2*t));
   this.offsets[i*2+1]=-b[4]*(.55*(1-Math.cos(t))+.35*(Math.sin(t+p)-Math.sin(p)));
  }
  this.clouds[0]=5*Math.sin(theta)+1.5*(1-Math.cos(theta));
  this.clouds[1]=.65*Math.sin(theta);
  this.clouds[2]=2.5*(Math.sin(theta+.8)-Math.sin(.8));
  this.clouds[3]=.45*Math.sin(2*theta);
 }
}
export const sceneGLSL=`
uniform sampler2D sceneControlTex;
uniform sampler2D bubbleIndexTex;
uniform vec2 imageSize;
uniform vec4 bubbles[${MAX_BUBBLES}];
uniform vec2 bubbleOffsets[${MAX_BUBBLES}];
uniform vec4 cloudOffsets;
uniform float sceneEnabled;
uniform float bubblePass;
vec2 sceneUV(vec2 uv){
 if(sceneEnabled==0.0)return uv;
 vec2 controls=texture(sceneControlTex,uv).rg;
 vec2 pixel=uv*imageSize;
 vec2 flow=vec2(0);
 if(bubblePass>0.5){
  ivec3 candidates=ivec3(floor(texture(bubbleIndexTex,uv).rgb*255.0+.5))-ivec3(1);
  for(int slot=0;slot<3;slot++){
  int i=candidates[slot];
  if(i<0||i>=${MAX_BUBBLES})continue;
  float r=bubbles[i].z;
  if(r<=0.0)continue;
  vec2 delta=pixel-bubbles[i].xy-bubbleOffsets[i];
  // Rigid translation across the complete bubble; blend only into nearby sky.
  float weight=1.0-smoothstep((r+4.0)*(r+4.0),(r+45.0)*(r+45.0),dot(delta,delta));
  flow+=weight*bubbleOffsets[i];
  }
 }
 vec2 cloud=cloudOffsets.xy*(.5+.8*uv.y)+cloudOffsets.zw*(1.0-uv.y);
 flow+=cloud*controls.r;
 return uv-flow*(1.0-controls.g)/imageSize;
}`;
