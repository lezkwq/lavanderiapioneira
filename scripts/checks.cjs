const {spawnSync}=require('node:child_process');
for(const [script,...args] of [['node_modules/typescript/bin/tsc','-b'],['node_modules/vite/bin/vite.js','build'],['node_modules/eslint/bin/eslint.js','.']]){
 console.log(`COMMAND: node ${script} ${args.join(' ')}`);
 const r=spawnSync(process.execPath,[script,...args],{stdio:'inherit'});
 console.log(`EXIT: ${r.status}`);if(r.status!==0)process.exit(r.status||1);
}
