(function(root){
  'use strict';
  const VERSION=1;
  function normalizeUiName(v){
    const s=String(v||'ui').trim();
    if(!s) throw new Error('uiName vacío');
    if(s.length>120) throw new Error('uiName demasiado largo');
    return s;
  }
  function dbName(uiName){ return 'kobalt.ui.v2::'+normalizeUiName(uiName); }
  function open(uiName){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(dbName(uiName),VERSION);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains('objects')) db.createObjectStore('objects',{keyPath:'rid'});
        if(!db.objectStoreNames.contains('meta')) db.createObjectStore('meta',{keyPath:'key'});
      };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  }
  async function putVerifiedObject(uiName,rec){
    const db=await open(uiName);
    try{
      await new Promise((resolve,reject)=>{
        const tx=db.transaction('objects','readwrite');
        tx.objectStore('objects').put({rid:rec.rid,bytes:rec.bytes.buffer.slice(rec.bytes.byteOffset,rec.bytes.byteOffset+rec.bytes.byteLength),type:rec.decoded.type,continuity:rec.event.continuity,storedAt:Date.now()});
        tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error||new Error('IDB abort'));
      });
    } finally { db.close(); }
  }
  async function commitRoot(uiName,result,source){
    const db=await open(uiName);
    try{
      await new Promise((resolve,reject)=>{
        const tx=db.transaction('meta','readwrite'), s=tx.objectStore('meta');
        s.put({key:'active',head:result.head,continuity:result.continuity,title:result.title,records:result.records.length,source:source||null,committedAt:Date.now()});
        tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error||new Error('IDB abort'));
      });
    } finally { db.close(); }
  }
  async function getActive(uiName){
    const db=await open(uiName);
    try{return await new Promise((resolve,reject)=>{const r=db.transaction('meta').objectStore('meta').get('active');r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}
    finally{db.close();}
  }
  async function getObject(uiName,rid){
    const db=await open(uiName);
    try{return await new Promise((resolve,reject)=>{const r=db.transaction('objects').objectStore('objects').get(rid);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);});}
    finally{db.close();}
  }
  async function countObjects(uiName){
    const db=await open(uiName);
    try{return await new Promise((resolve,reject)=>{const r=db.transaction('objects').objectStore('objects').count();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
    finally{db.close();}
  }
  async function clear(uiName){
    const name=dbName(uiName);
    return await new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('IndexedDB bloqueado'));});
  }
  async function reconstruct(uiName){
    const active=await getActive(uiName); if(!active) throw new Error('IndexedDB de esta UI no tiene continuidad activa');
    const result=await KobaltContinuity.reconstruct(active.head,async rid=>{const obj=await getObject(uiName,rid);return obj?new Uint8Array(obj.bytes):null;});
    const cachedObjects=await countObjects(uiName);
    return {...result,cache:{uiName:normalizeUiName(uiName),dbName:dbName(uiName),cachedObjects,active}};
  }
  root.KobaltUIStore=Object.freeze({normalizeUiName,dbName,putVerifiedObject,commitRoot,getActive,getObject,countObjects,clear,reconstruct});
})(globalThis);
