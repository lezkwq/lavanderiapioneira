const sharp = require('C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const source=path.resolve(__dirname,'../docs/pioneira-profile-original.png');
  const mask=Buffer.from('<svg width="1080" height="1080"><circle cx="540" cy="540" r="534" fill="white"/></svg>');
  const symbol=await sharp(source).resize(1080,1080).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
  await sharp(symbol).resize(384,384).png({compressionLevel:9}).toFile(path.resolve(__dirname,'../public/brand/pioneira-symbol.png'));
  const output=path.resolve(__dirname,'../public/icons');
  fs.mkdirSync(output,{recursive:true});
  for(const size of [16,32,48,180,192,512])await sharp(symbol).resize(size,size).png().toFile(path.join(output,`pioneira-${size}.png`));
  const sizes=[16,32,48],images=sizes.map(size=>fs.readFileSync(path.join(output,`pioneira-${size}.png`)));
  const header=Buffer.alloc(6+sizes.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
  sizes.forEach((size,index)=>{const entry=6+index*16;header[entry]=size;header[entry+1]=size;header.writeUInt16LE(1,entry+4);header.writeUInt16LE(32,entry+6);header.writeUInt32LE(images[index].length,entry+8);header.writeUInt32LE(offset,entry+12);offset+=images[index].length;});
  fs.writeFileSync(path.resolve(output,'../favicon.ico'),Buffer.concat([header,...images]));
  console.log('Símbolo P e favicons gerados da imagem enviada.');
})().catch(error=>{console.error(error);process.exitCode=1;});
