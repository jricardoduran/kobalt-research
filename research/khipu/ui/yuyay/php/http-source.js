(function(root){
'use strict';
async function json(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}
async function sync(uiName,continuity,onProgress){
 const c=encodeURIComponent(continuity||'comercio');
 const h=await json('../api/source.php?mode=head&continuity='+c); let n=0;
 const result=await KobaltContinuity.reconstruct(h.head,async rid=>{const r=await fetch('../api/source.php?mode=record&continuity='+c+'&rid='+rid,{cache:'no-store'});if(r.status===404)return null;if(!r.ok)throw new Error('HTTP '+r.status);return new Uint8Array(await r.arrayBuffer());},async rec=>{await KobaltUIStore.putVerifiedObject(uiName,rec);n++;if(onProgress)onProgress(n,rec.rid);});
 await KobaltUIStore.commitRoot(uiName,result,{kind:'php-http',continuity}); return {stored:n,head:result.head};
}
root.KobaltHttpSource=Object.freeze({sync});
})(globalThis);
