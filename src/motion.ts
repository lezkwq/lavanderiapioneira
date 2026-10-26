// Fractions of cropped garment width/height. All temporal terms have period 8 s.
export const BREEZE = { period:8, amplitudeX:0.20, amplitudeY:0.05, flutter2:0.012, flutter3:0.007, sleeveLeft:0.032, sleeveRight:0.012, hem:0.011 } as const;
export const motionGLSL = `
const float PI=3.141592653589793;
float gust(float t){return pow(abs(sin(PI*t)),3.0);}
vec2 displacement(vec2 q){
 if(tau==0.0) return vec2(0.0);
 float v=q.y;
 float w=smoothstep(0.15,1.0,v);
 float g=gust(tau-.06*v)-gust(-.06*v);
 float ph=2.0*PI*(1.3*q.x+.9*v);
 float f=(${BREEZE.flutter2}*(sin(4.0*PI*tau-ph)-sin(-ph))
         +${BREEZE.flutter3}*(sin(6.0*PI*tau-ph)-sin(-ph)))*pow(w,1.5)*(.3+.7*g);
 vec2 d=vec2(-${BREEZE.amplitudeX}*w*g,-${BREEZE.amplitudeY}*pow(w,1.5)*g)+vec2(.6*f,f);
 float left=exp(-dot((q-sleeves.xy)/vec2(.15,.17),(q-sleeves.xy)/vec2(.15,.17)));
 float right=exp(-dot((q-sleeves.zw)/vec2(.15,.17),(q-sleeves.zw)/vec2(.15,.17)));
 float s=sin(2.0*PI*tau)*.18+g;
 d+=vec2(-.35,-1.0)*${BREEZE.sleeveLeft}*left*s*w;
 d+=vec2(.15,-1.0)*${BREEZE.sleeveRight}*right*g*w;
 float hem=(sin(4.0*PI*tau-6.0*q.x)-sin(-6.0*q.x))*${BREEZE.hem}*smoothstep(.68,1.0,v)*g;
 d.y+=hem;
 return d;
}`;
