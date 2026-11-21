(function(root){
  'use strict';
  function basename(path){return String(path).split('/').pop();}
  async function parseFiles(fileList){
    const files=Array.from(fileList||[]), headFile=files.find(f=>basename(f.name)==='head.txt');
    if(!headFile) throw new Error('Falta head.txt');
    const head=(await headFile.text()).trim().toLowerCase();
    if(!/^[0-9a-f]{64}$/.test(head)) throw new Error('head inválido');
    const byRid=new Map();
    for(const f of files){const m=basename(f.name).match(/^([0-9a-f]{64})\.k5$/i);if(m)byRid.set(m[1].toLowerCase(),f);}
    return {head,byRid};
  }
  async function sync(uiName,fileList,onProgress){
    const src=await parseFiles(fileList);
    let n=0;
    const result=await KobaltContinuity.reconstruct(src.head,async rid=>{
      const f=src.byRid.get(rid); if(!f)return null; return new Uint8Array(await f.arrayBuffer());
    },async rec=>{
      await KobaltUIStore.putVerifiedObject(uiName,rec); n++; if(onProgress)onProgress(n,rec.rid);
    });
    await KobaltUIStore.commitRoot(uiName,result,{kind:'local-folder'});
    return {stored:n,head:result.head};
  }
  root.KobaltLocalSource=Object.freeze({parseFiles,sync});
})(globalThis);
