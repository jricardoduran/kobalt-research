(function(root){
'use strict';
function ok(x,m){if(!x)throw new Error(m)}
function value(obj,path){return String(path).split('.').reduce((v,k)=>v==null?undefined:v[k],obj)}
async function decodeRecord(rid,bytes){
 const d=await K5Reader.decode(bytes);ok(d.rid===rid,'RID inconsistente: '+rid);ok(d.type===2,'Continuidad UI requiere K5 JSON (T=2)');
 let event;try{event=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(d.body))}catch(_){throw new Error('BODY JSON inválido: '+rid)}
 ok(event&&event.v===1,'Envelope v1 inválido: '+rid);ok(event.prev===null||/^[0-9a-f]{64}$/.test(event.prev),'prev inválido: '+rid);ok(typeof event.op==='string'&&event.op,'op ausente: '+rid);ok(event.data&&typeof event.data==='object','data ausente: '+rid);
 return{rid,bytes:d.bytes,event};
}
async function walk(head,get,onRecord){
 let rid=String(head||'').trim().toLowerCase();ok(/^[0-9a-f]{64}$/.test(rid),'head inválido');const rev=[],seen=new Set();
 while(rid){ok(!seen.has(rid),'ciclo en prev: '+rid);seen.add(rid);const bytes=await get(rid);ok(bytes,'falta registro: '+rid);const rec=await decodeRecord(rid,bytes);if(onRecord)await onRecord(rec);rev.push(rec);rid=rec.event.prev}
 const records=rev.reverse();ok(records.length>0,'continuidad vacía');const genesis=records[0];ok(genesis.event.prev===null&&genesis.event.op==='continuity.define','génesis inválido');const spec=genesis.event.data;ok(Array.isArray(spec.views),'views ausente');return{head:String(head).toLowerCase(),genesisRid:genesis.rid,title:spec.title||genesis.rid.slice(0,12),spec,records};
}
function project(walked){
 const data=walked.records.slice(1),views=walked.spec.views.map(v=>{ok(v&&typeof v.id==='string'&&typeof v.event==='string','vista inválida');ok(v.mode==='append'||v.mode==='latestByKey','modo no soportado: '+v.mode);const matched=data.filter(r=>r.event.op===v.event);let rows;if(v.mode==='append')rows=matched.map(r=>({...r.event.data,__rid:r.rid}));else{ok(typeof v.key==='string'&&v.key,'latestByKey requiere key');const m=new Map();for(const r of matched){const k=value(r.event.data,v.key);ok(k!==undefined&&k!==null,'key ausente en '+v.id);m.set(String(k),{...r.event.data,__rid:r.rid})}rows=[...m.values()]}return{...v,rows}});
 return{...walked,views,stats:{records:walked.records.length,dataEvents:data.length,materialValid:true}};
}
root.KhipuContinuity=Object.freeze({decodeRecord,walk,project,value});
})(globalThis);
