(function(root){
'use strict';
const RE=/^([0-9a-f]{8})_([0-9a-f]{16})_([0-9a-f]{8})$/;
function hexInt(v,width,label){
  if(!Number.isInteger(v)||v<0) throw new Error(label+' inválido');
  const max=2**(width*4);
  if(v>=max) throw new Error(label+' fuera de rango');
  return v.toString(16).padStart(width,'0');
}
function nodeHex(v){
  const s=typeof v==='bigint'?v.toString(16):String(v).toLowerCase().replace(/^0x/,'');
  if(!/^[0-9a-f]+$/.test(s)||s.length>16) throw new Error('nodeId inválido');
  return s.padStart(16,'0');
}
function make(userId,nodeId,localId){return `${hexInt(userId,8,'userId')}_${nodeHex(nodeId)}_${hexInt(localId,8,'localId')}`}
function parse(id){const m=String(id).match(RE);if(!m)throw new Error('KS1 inválido: '+id);return Object.freeze({id:String(id),userId:Number.parseInt(m[1],16),userHex:m[1],nodeId:m[2],localId:Number.parseInt(m[3],16),localHex:m[3]})}
function belongs(id,userId,nodeId){const p=parse(id);return p.userId===userId&&p.nodeId===nodeHex(nodeId)}
function toBytes(id){const p=parse(id),out=new Uint8Array(16);let u=p.userId>>>0;out[0]=u>>>24;out[1]=u>>>16;out[2]=u>>>8;out[3]=u;let n=BigInt('0x'+p.nodeId);for(let i=11;i>=4;i--){out[i]=Number(n&255n);n>>=8n}let l=p.localId>>>0;out[12]=l>>>24;out[13]=l>>>16;out[14]=l>>>8;out[15]=l;return out}
function fromBytes(b){b=b instanceof Uint8Array?b:new Uint8Array(b);if(b.length!==16)throw new Error('KS1 binario debe tener 16 bytes');const u=(b[0]*0x1000000+(b[1]<<16)+(b[2]<<8)+b[3])>>>0;let n=0n;for(let i=4;i<12;i++)n=(n<<8n)|BigInt(b[i]);const l=(b[12]*0x1000000+(b[13]<<16)+(b[14]<<8)+b[15])>>>0;return make(u,n,l)}
root.KhipuSuti=Object.freeze({VERSION:'KS1',make,parse,belongs,toBytes,fromBytes,nodeHex});
})(globalThis);
