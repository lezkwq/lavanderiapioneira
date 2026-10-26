import { motionGLSL } from './motion';
import { SceneMotion, sceneGLSL, type SceneMetadata } from './sceneMotion';
export type Metadata = { imageSize:[number,number]; crop:[number,number,number,number]; sleeves:[number,number][] };
const common=`precision highp float;
layout(location=0) in vec2 uv;
uniform vec4 projection;
uniform vec4 crop;
out vec2 texUV;
vec4 project(vec2 p){return vec4(p.x*projection.x+projection.z,p.y*projection.y+projection.w,0,1);}
`;
const bgVS=`#version 300 es
${common}
void main(){texUV=uv;gl_Position=project(uv);}`;
const bgFS=`#version 300 es
precision highp float;
in vec2 texUV;out vec4 color;
uniform sampler2D originalTex;uniform sampler2D backgroundTex;uniform sampler2D shirtTex;uniform vec4 crop;
${sceneGLSL}
void main(){
 vec2 source=sceneUV(texUV);
 vec2 q=(source-crop.xy)/crop.zw;
 float a=0.0;
 if(all(greaterThanEqual(q,vec2(0)))&&all(lessThanEqual(q,vec2(1))))a=texture(shirtTex,q).a;
 color=mix(texture(originalTex,source),texture(backgroundTex,source),a);
}`;
const shirtVS=`#version 300 es
${common}
uniform float tau;uniform vec4 sleeves;out float light;
${motionGLSL}
void main(){
 texUV=uv;
 vec2 d=displacement(uv);
 float e=.002;
 float divergence=(displacement(uv+vec2(e,0)).x-d.x+displacement(uv+vec2(0,e)).y-d.y)/e;
 light=clamp(divergence*.11,-.035,.035);
 gl_Position=project(crop.xy+(uv+d)*crop.zw);
}`;
const shirtFS=`#version 300 es
precision highp float;in vec2 texUV;in float light;out vec4 color;uniform sampler2D shirtTex;
void main(){vec4 c=texture(shirtTex,texUV);c.rgb*=1.0+light;
 c.rgb+=vec3(-.08,-.025,.04)*max(0.0,-light)*c.a;color=c;}`;

export class BreezeRenderer {
 private gl:WebGL2RenderingContext;
 private programs:WebGLProgram[]=[];
 private textures:WebGLTexture[]=[];
 private buffers:WebGLBuffer[]=[];
 private vaos:WebGLVertexArrayObject[]=[];
 private time:WebGLUniformLocation|null=null;
 private count=0;
 private crop:Float32Array;
 private projection=new Float32Array(4);
 private dpr=1;
 private scene:SceneMotion;
 private bubbleTime:WebGLUniformLocation|null=null;
 private cloudTime:WebGLUniformLocation|null=null;
 private bubblePass:WebGLUniformLocation|null=null;
 private bubbleCount=0;
 constructor(private canvas:HTMLCanvasElement,private meta:Metadata,images:HTMLImageElement[],mobile:boolean,scene:SceneMetadata,private sceneEnabled=true){
  const gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true});
  if(!gl)throw Error('WebGL2 unavailable');
  this.gl=gl;this.dpr=Math.min(devicePixelRatio,mobile?1.5:2);
  this.scene=new SceneMotion(scene);
  this.bubbleCount=scene.bubbles.length;
  const [iw,ih]=meta.imageSize,[l,t,r,b]=meta.crop;
  this.crop=new Float32Array([l/iw,t/ih,(r-l)/iw,(b-t)/ih]);
  try{
   this.programs=[this.program(bgVS,bgFS),this.program(shirtVS,shirtFS)];
   images.forEach((im,i)=>{
    const tex=gl.createTexture()!;this.textures.push(tex);gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,i===4?gl.NEAREST:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,i===4?gl.NEAREST:gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
   });
   this.vaos.push(this.mesh(1,1),this.mesh(32,40));this.count=32*40*6;
   for(const p of this.programs){
    gl.useProgram(p);gl.uniform4fv(gl.getUniformLocation(p,'crop'),this.crop);
    gl.uniform1i(gl.getUniformLocation(p,'originalTex'),0);gl.uniform1i(gl.getUniformLocation(p,'backgroundTex'),1);gl.uniform1i(gl.getUniformLocation(p,'shirtTex'),2);
   }
   const bg=this.programs[0];gl.useProgram(bg);
   gl.uniform1i(gl.getUniformLocation(bg,'sceneControlTex'),3);
   gl.uniform1i(gl.getUniformLocation(bg,'bubbleIndexTex'),4);
   gl.uniform2f(gl.getUniformLocation(bg,'imageSize'),iw,ih);
   gl.uniform1f(gl.getUniformLocation(bg,'sceneEnabled'),sceneEnabled?1:0);
   gl.uniform4fv(gl.getUniformLocation(bg,'bubbles[0]'),this.scene.geometry);
   this.bubbleTime=gl.getUniformLocation(bg,'bubbleOffsets[0]');this.cloudTime=gl.getUniformLocation(bg,'cloudOffsets');
   this.bubblePass=gl.getUniformLocation(bg,'bubblePass');
   const p=this.programs[1];gl.useProgram(p);
   const a=meta.sleeves[0],z=meta.sleeves[1];
   gl.uniform4f(gl.getUniformLocation(p,'sleeves'),(a[0]-l)/(r-l),(a[1]-t)/(b-t),(z[0]-l)/(r-l),(z[1]-t)/(b-t));
   this.time=gl.getUniformLocation(p,'tau');this.resize();
  }catch(error){this.destroy();throw error;}
 }
 private program(vs:string,fs:string){
  const gl=this.gl,p=gl.createProgram()!;const shaders:WebGLShader[]=[];
  try{
   for(const [kind,source] of [[gl.VERTEX_SHADER,vs],[gl.FRAGMENT_SHADER,fs]] as const){
    const s=gl.createShader(kind)!;shaders.push(s);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s)||'shader');gl.attachShader(p,s);
   }
   gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p)||'link');return p;
  }catch(error){gl.deleteProgram(p);throw error;}finally{for(const s of shaders)gl.deleteShader(s);}
 }
 private mesh(cols:number,rows:number){
  const gl=this.gl,vao=gl.createVertexArray()!;gl.bindVertexArray(vao);
  const vertices=new Float32Array((cols+1)*(rows+1)*2);let k=0;
  for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){vertices[k++]=x/cols;vertices[k++]=y/rows;}
  const indices=new Uint16Array(cols*rows*6);k=0;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;indices[k++]=a;indices[k++]=b;indices[k++]=a+1;indices[k++]=a+1;indices[k++]=b;indices[k++]=b+1;}
  const v=gl.createBuffer()!,i=gl.createBuffer()!;this.buffers.push(v,i);
  gl.bindBuffer(gl.ARRAY_BUFFER,v);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,i);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);return vao;
 }
 resize(){
  const gl=this.gl,w=this.canvas.clientWidth,h=this.canvas.clientHeight;
  if(!w||!h)return;
  this.canvas.width=Math.round(w*this.dpr);this.canvas.height=Math.round(h*this.dpr);gl.viewport(0,0,this.canvas.width,this.canvas.height);
  const [iw,ih]=this.meta.imageSize,scale=Math.max(w/iw,h/ih),dw=iw*scale,dh=ih*scale;
  this.projection[0]=2*dw/w;this.projection[1]=-2*dh/h;
  this.projection[2]=-1+2*(w-dw)/w;this.projection[3]=1-2*(h-dh)*.695/h;
  for(const p of this.programs){gl.useProgram(p);gl.uniform4fv(gl.getUniformLocation(p,'projection'),this.projection);}
 }
 reduceDpr(){if(this.dpr<=1)return;this.dpr=Math.max(1,this.dpr-.25);this.resize();}
 draw(seconds:number){
  const gl=this.gl;
  gl.disable(gl.BLEND);gl.useProgram(this.programs[0]);
  this.scene.update(seconds);gl.uniform2fv(this.bubbleTime,this.scene.offsets);gl.uniform4fv(this.cloudTime,this.scene.clouds);
  gl.disable(gl.SCISSOR_TEST);gl.uniform1f(this.bubblePass,0);
  gl.bindVertexArray(this.vaos[0]);gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
  if(this.sceneEnabled){
   // Re-evaluate the identical field only in small bubble rectangles. Overlaps
   // produce identical opaque pixels; no crossfade, seams or duplicated rims.
   gl.uniform1f(this.bubblePass,1);gl.enable(gl.SCISSOR_TEST);
   const width=this.canvas.width,height=this.canvas.height,iw=this.meta.imageSize[0],ih=this.meta.imageSize[1];
   for(let i=0;i<this.bubbleCount;i++){
    const x=this.scene.geometry[i*4]+this.scene.offsets[i*2],y=this.scene.geometry[i*4+1]+this.scene.offsets[i*2+1],r=this.scene.geometry[i*4+2]+46;
    const left=Math.max(0,Math.floor(((x-r)/iw*this.projection[0]+this.projection[2]+1)*width*.5));
    const right=Math.min(width,Math.ceil(((x+r)/iw*this.projection[0]+this.projection[2]+1)*width*.5));
    const top=Math.max(0,Math.floor((1-((y-r)/ih*this.projection[1]+this.projection[3]))*height*.5));
    const bottom=Math.min(height,Math.ceil((1-((y+r)/ih*this.projection[1]+this.projection[3]))*height*.5));
    if(right>left&&bottom>top){gl.scissor(left,height-bottom,right-left,bottom-top);gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);}
   }
   gl.disable(gl.SCISSOR_TEST);
  }
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  gl.useProgram(this.programs[1]);gl.uniform1f(this.time,(((seconds%8)+8)%8)/8);gl.bindVertexArray(this.vaos[1]);gl.drawElements(gl.TRIANGLES,this.count,gl.UNSIGNED_SHORT,0);
 }
 getDpr(){return this.dpr;}
 destroy(){const gl=this.gl;for(const t of this.textures)gl.deleteTexture(t);for(const b of this.buffers)gl.deleteBuffer(b);for(const v of this.vaos)gl.deleteVertexArray(v);for(const p of this.programs)gl.deleteProgram(p);}
}
