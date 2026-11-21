(function(root){
'use strict';
const VERSION=1;
function uiName(v){const s=String(v||'ui').trim();if(!s||s.length>120)throw new Error('uiName inválido');return s}
function dbName(v){return 'khipu.yuyay::'+uiName(v)}
function open(v){return new Promise((res,rej)=>{const r=indexedDB.open(dbName(v),VERSION);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('objects'))d.createObjectStore('objects');if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function put(v,rid,bytes){const d=await open(v);try{await new Promise((res,rej)=>{const t=d.transaction('objects','readwrite');t.objectStore('objects').put(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),rid);t.oncomplete=res;t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('IDB abort'))})}finally{d.close()}}
async function get(v,rid){const d=await open(v);try{return await new Promise((res,rej)=>{const r=d.transaction('objects').objectStore('objects').get(rid);r.onsuccess=()=>res(r.result?new Uint8Array(r.result):null);r.onerror=()=>rej(r.error)})}finally{d.close()}}
async function setHead(v,head){const d=await open(v);try{await new Promise((res,rej)=>{const t=d.transaction('meta','readwrite');t.objectStore('meta').put(head,'activeHead');t.oncomplete=res;t.onerror=()=>rej(t.error);t.onabort=()=>rej(t.error||new Error('IDB abort'))})}finally{d.close()}}
async function getHead(v){const d=await open(v);try{return await new Promise((res,rej)=>{const r=d.transaction('meta').objectStore('meta').get('activeHead');r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}finally{d.close()}}
async function clear(v){return new Promise((res,rej)=>{const r=indexedDB.deleteDatabase(dbName(v));r.onsuccess=res;r.onerror=()=>rej(r.error);r.onblocked=()=>rej(new Error('IndexedDB bloqueado'))})}
async function importSource(v,source,onProgress){const head=await source.head();let n=0;await KhipuContinuity.walk(head,source.get,async rec=>{await put(v,rec.rid,rec.bytes);n++;if(onProgress)onProgress(n,rec.rid)});await setHead(v,head);return{head,stored:n}}
async function load(v){const head=await getHead(v);if(!head)throw new Error('Esta UI no tiene activeHead');const walked=await KhipuContinuity.walk(head,rid=>get(v,rid));return KhipuContinuity.project(walked)}
root.KhipuYuyay=Object.freeze({uiName,dbName,put,get,setHead,getHead,clear,importSource,load});
})(globalThis);
