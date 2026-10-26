const fs=require('node:fs');const path=require('node:path');
(async()=>{
 const dir=path.resolve('public/fonts');fs.mkdirSync(dir,{recursive:true});
 const headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'};
 for(const [family,file] of [['Plus Jakarta Sans','plus-jakarta-sans'],['Manrope','manrope']]){
  const css=await fetch(`https://fonts.googleapis.com/css2?family=${family.replaceAll(' ','+')}:wght@400;500;600;700&display=swap`,{headers}).then(r=>{if(!r.ok)throw Error(r.status);return r.text()});
  const latin=[...css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)].at(-1)?.[1];
  if(!latin)throw Error('Latin font face missing');
  const url=latin.match(/url\(([^)]+)\)/)[1];const result=await fetch(url);if(!result.ok)throw Error(result.status);
  const data=Buffer.from(await result.arrayBuffer());fs.writeFileSync(path.join(dir,`${file}-latin.woff2`),data);
  console.log(family,data.length,'bytes');
  const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${file.replaceAll('-','')}/OFL.txt`);if(license.ok)fs.writeFileSync(path.join(dir,`${file}-LICENSE.txt`),await license.text());
 }
})().catch(e=>{console.error(e);process.exitCode=1});
