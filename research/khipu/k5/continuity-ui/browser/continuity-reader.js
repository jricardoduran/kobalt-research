(function(root){
'use strict';
function ok(x,m){if(!x)throw new Error(m)}
function value(o,p){return String(p).split('.').reduce((v,k)=>v==null?undefined:v[k],o)}
async function reconstruct(head,resolve){
 const back=[],seen=new Set(); let rid=head,name=null;
 while(rid){
  ok(!seen.has(rid),'ciclo'); seen.add(rid);
  const bytes=await resolve(rid); ok(bytes,'falta '+rid);
  const d=await Khipu5.decode(bytes); ok(d.rid===rid,'rid inconsistente'); ok(d.type===2,'se requiere JSON');
  const e=JSON.parse(Khipu5.text(d.body,true)); ok(e.v===1,'envelope'); name??=e.continuity; ok(e.continuity===name,'continuidad mezclada');
  back.push({rid,event:e}); rid=e.prev;
 }
 const records=back.reverse(), g=records[0]?.event;
 ok(g&&g.prev===null&&g.op==='continuity.define','génesis inválido');
 ok(g.data?.metaContract==='kobalt.continuity.ui.v1','metacontrato');
 const views=g.data.views.map(v=>{
  const matched=records.slice(1).filter(r=>r.event.op===v.event); let rows;
  if(v.mode==='append') rows=matched.map(r=>({...r.event.data,__rid:r.rid}));
  else if(v.mode==='latestByKey'){const m=new Map();for(const r of matched)m.set(String(value(r.event.data,v.key)),{...r.event.data,__rid:r.rid});rows=[...m.values()]}
  else throw new Error('modo '+v.mode);
  return {...v,rows};
 });
 return {head,continuity:name,title:g.data.title||name,records,views};
}
root.KobaltContinuity=Object.freeze({reconstruct,value});
})(globalThis);
