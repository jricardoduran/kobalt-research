(function (root) {
  'use strict';

  const VERSION = 'K5.1';
  const HASH_NAME = 'SHA-256';

  const TYPES = Object.freeze({
    0x0000: Object.freeze({ code: 0x0000, name: 'binary', extension: '.bin', mime: 'application/octet-stream' }),
    0x0001: Object.freeze({ code: 0x0001, name: 'utf8-text', extension: '.txt', mime: 'text/plain; charset=utf-8' }),
    0x0002: Object.freeze({ code: 0x0002, name: 'json', extension: '.json', mime: 'application/json' }),
    0x0003: Object.freeze({ code: 0x0003, name: 'javascript', extension: '.js', mime: 'text/javascript' }),
    0x0004: Object.freeze({ code: 0x0004, name: 'php', extension: '.php', mime: 'application/x-httpd-php' }),
    0x0010: Object.freeze({ code: 0x0010, name: 'png', extension: '.png', mime: 'image/png' }),
    0x0011: Object.freeze({ code: 0x0011, name: 'jpeg', extension: '.jpg', mime: 'image/jpeg' }),
    0x0012: Object.freeze({ code: 0x0012, name: 'webp', extension: '.webp', mime: 'image/webp' }),
    0x0020: Object.freeze({ code: 0x0020, name: 'pdf', extension: '.pdf', mime: 'application/pdf' }),
    0x0030: Object.freeze({ code: 0x0030, name: 'zip', extension: '.zip', mime: 'application/zip' }),
    0x0040: Object.freeze({ code: 0x0040, name: 'wasm', extension: '.wasm', mime: 'application/wasm' })
  });

  const KNOWN_VECTORS = Object.freeze([
    Object.freeze({ type:2, bodyHex:'7b2261223a312c2262223a327d', recordHex:'000206d0f644c24474625844c4447464fbfd0795227105b299d1f2a1bb697b9cfdb836111f907f425a5991a924df1cfe26', rid:'959e1d8d4e2bc9d4c408a13b6493024bfd6e6d74c15ee31c06103f5d88ec20e0', hash:'fe83ca913882d94ce8f950ddb4bdce7edc1b088fc83fa12d2cc8d4926f8e7f13' }),
    Object.freeze({ type:3, bodyHex:'636f6e736f6c652e6c6f6728224b3522293b', recordHex:'00030790636f6e736f6c652e6c6f6728224b3522293be18a742b5d0351383ee58776577cc84f8222294a905556c972ffaeb579a56644', rid:'94e3552b4a2039495d61dac6a677ce7579b0db123c6bcca3ab3abc3fb5d0818a', hash:'e18a742b5d0351383ee58776577cc84f8222294a905556c972ffaeb579a56644' }),
    Object.freeze({ type:0, bodyHex:'00ff10', recordHex:'000004c007f884d23333b9262dfbf2b79e1cad24c3d5fbac320758bc6eec2f89477a3dc0316048', rid:'6990d5cc2a72ea131241dd2346fd2475a091f19f5f19ac114fd9d73f05df2199', hash:'9a46667724c5bf7e56f3c395a4987abf758640eb178ddd85f128ef47b8062c09' }),
    Object.freeze({ type:65000, bodyHex:'646573636f6e6f6369646f207065726f206d6174657269616c6d656e74652076c3a16c69646f', recordHex:'fde808983232b9b1b7b737b1b4b237903832b9379036b0ba32b934b0b636b2b73a32903b61d0b634b237c0b53a01a1b8b1dbfa713975bab17ea9e98ff7345cbadba948f4cad625b685c400', rid:'819c290e3984de190c4d4badadffde7922c3ad43a22266d1b5bb4e5d647a8eac', hash:'816a7403437163b7f4e272eb7562fd53d31fee68b975b75291e995ac4b6d0b88' })
  ]);

  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function utf8(value) { return enc.encode(String(value)); }
  function text(bytes, fatal = false) {
    return new TextDecoder('utf-8', { fatal }).decode(bytes);
  }
  function hex(bytes) {
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }
  function unhex(value) {
    const s = String(value).trim();
    assert(/^[0-9a-f]*$/i.test(s) && s.length % 2 === 0, 'hex inválido');
    const out = new Uint8Array(s.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
    return out;
  }
  function concat(...parts) {
    const size = parts.reduce((n, p) => n + p.length, 0);
    const out = new Uint8Array(size);
    let offset = 0;
    for (const p of parts) { out.set(p, offset); offset += p.length; }
    return out;
  }
  function equal(a, b) {
    if (a.length !== b.length) return false;
    let d = 0;
    for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
    return d === 0;
  }
  function bitLength(value) {
    let n = BigInt(value);
    if (n === 0n) return 1;
    let k = 0;
    while (n) { n >>= 1n; k++; }
    return k;
  }

  function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
  function sha256Pure(input) {
    const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
    const K = new Uint32Array([
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ]);
    const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const bitLen = BigInt(bytes.length) * 8n;
    const total = Math.ceil((bytes.length + 1 + 8) / 64) * 64;
    const msg = new Uint8Array(total);
    msg.set(bytes);
    msg[bytes.length] = 0x80;
    let x = bitLen;
    for (let i = 0; i < 8; i++) { msg[total - 1 - i] = Number(x & 0xffn); x >>= 8n; }
    const w = new Uint32Array(64);
    for (let offset = 0; offset < total; offset += 64) {
      for (let i = 0; i < 16; i++) {
        const j = offset + i * 4;
        w[i] = ((msg[j] << 24) | (msg[j+1] << 16) | (msg[j+2] << 8) | msg[j+3]) >>> 0;
      }
      for (let i = 16; i < 64; i++) {
        const s0 = (rotr(w[i-15],7) ^ rotr(w[i-15],18) ^ (w[i-15] >>> 3)) >>> 0;
        const s1 = (rotr(w[i-2],17) ^ rotr(w[i-2],19) ^ (w[i-2] >>> 10)) >>> 0;
        w[i] = (w[i-16] + s0 + w[i-7] + s1) >>> 0;
      }
      let a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for (let i = 0; i < 64; i++) {
        const S1 = (rotr(e,6) ^ rotr(e,11) ^ rotr(e,25)) >>> 0;
        const ch = ((e & f) ^ (~e & g)) >>> 0;
        const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = (rotr(a,2) ^ rotr(a,13) ^ rotr(a,22)) >>> 0;
        const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
        const t2 = (S0 + maj) >>> 0;
        h=g; g=f; f=e; e=(d+t1)>>>0; d=c; c=b; b=a; a=(t1+t2)>>>0;
      }
      H[0]=(H[0]+a)>>>0; H[1]=(H[1]+b)>>>0; H[2]=(H[2]+c)>>>0; H[3]=(H[3]+d)>>>0;
      H[4]=(H[4]+e)>>>0; H[5]=(H[5]+f)>>>0; H[6]=(H[6]+g)>>>0; H[7]=(H[7]+h)>>>0;
    }
    const out = new Uint8Array(32);
    for (let i=0;i<8;i++) { out[i*4]=H[i]>>>24; out[i*4+1]=(H[i]>>>16)&255; out[i*4+2]=(H[i]>>>8)&255; out[i*4+3]=H[i]&255; }
    return out;
  }

  async function sha256(bytes) {
    const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (root.crypto && root.crypto.subtle && typeof root.crypto.subtle.digest === 'function') {
      try { return new Uint8Array(await root.crypto.subtle.digest('SHA-256', b)); } catch (_) {}
    }
    return sha256Pure(b);
  }

  class BitWriter {
    constructor() { this.bits = []; }
    writeUInt(value, width) {
      let v = BigInt(value);
      assert(Number.isInteger(width) && width >= 0, 'ancho inválido');
      if (width === 0) return;
      assert(v >= 0n && v < (1n << BigInt(width)), 'entero no cabe en el ancho');
      for (let i = width - 1; i >= 0; i--) this.bits.push(Number((v >> BigInt(i)) & 1n));
    }
    writeBytes(bytes) { for (const b of bytes) this.writeUInt(b, 8); }
    appendBits(bits) { this.bits.push(...bits); }
    toBytes() {
      const out = new Uint8Array(Math.ceil(this.bits.length / 8));
      for (let i=0;i<this.bits.length;i++) if (this.bits[i]) out[i>>3] |= 1 << (7-(i&7));
      return out;
    }
  }

  class BitReader {
    constructor(bytes, bitLimit = bytes.length * 8) { this.bytes = bytes; this.pos = 0; this.limit = bitLimit; }
    readBit() {
      assert(this.pos < this.limit, 'registro truncado');
      const p = this.pos++;
      return (this.bytes[p >> 3] >> (7-(p&7))) & 1;
    }
    readUInt(width) { let v=0n; for(let i=0;i<width;i++) v=(v<<1n)|BigInt(this.readBit()); return v; }
    readBytes(bitCount) {
      assert(bitCount % 8 === 0, 'K5.1 exige cuerpo byte-aligned');
      const w = new BitWriter();
      for (let i=0;i<bitCount;i++) w.bits.push(this.readBit());
      return w.toBytes();
    }
  }

  function typeInfo(typeCode) {
    const code = Number(typeCode);
    return TYPES[code] || Object.freeze({ code, name: 'unknown', extension: '.bin', mime: 'application/octet-stream', unknown: true });
  }

  async function encode(typeCode, body) {
    const T = Number(typeCode);
    assert(Number.isInteger(T) && T >= 0 && T <= 0xffff, 'T debe ser uint16');
    const B = body instanceof Uint8Array ? body : new Uint8Array(body);
    const L = BigInt(B.length) * 8n;
    const k = bitLength(L);
    assert(k <= 256, 'L excede el perfil K5.1');
    const W = k - 1;

    const prefix = new BitWriter();
    prefix.writeUInt(T, 16);
    prefix.writeUInt(W, 8);
    prefix.writeUInt(L, k);
    prefix.writeBytes(B);
    const digest = await sha256(prefix.toBytes());

    const record = new BitWriter();
    record.appendBits(prefix.bits);
    record.writeBytes(digest);
    const bytes = record.toBytes();
    const rid = hex(await sha256(bytes));

    return {
      version: VERSION, bytes, rid, type: T, typeInfo: typeInfo(T), body: B,
      bodyBits: Number(L), W, k, hash: hex(digest), bitLength: record.bits.length,
      physicalBytes: bytes.length
    };
  }

  async function decode(recordBytes) {
    const bytes = recordBytes instanceof Uint8Array ? recordBytes : new Uint8Array(recordBytes);
    assert(bytes.length >= 36, 'K5 demasiado corto');
    const r = new BitReader(bytes);
    const T = Number(r.readUInt(16));
    const W = Number(r.readUInt(8));
    const k = W + 1;
    assert(k >= 1 && k <= 256, 'W/k inválido');
    const Lbig = r.readUInt(k);
    assert(k === bitLength(Lbig), 'LEN no canónico');
    assert(Lbig <= BigInt(Number.MAX_SAFE_INTEGER), 'L demasiado grande para esta implementación');
    const L = Number(Lbig);
    assert(L % 8 === 0, 'K5.1 exige cuerpo byte-aligned');
    const expectedBits = 16 + 8 + k + L + 256;
    const expectedBytes = Math.ceil(expectedBits / 8);
    assert(bytes.length === expectedBytes, `longitud física inválida: ${bytes.length} != ${expectedBytes}`);
    const B = r.readBytes(L);
    const digest = r.readBytes(256);
    while (r.pos < bytes.length * 8) assert(r.readBit() === 0, 'padding final no canónico');

    const prefix = new BitWriter();
    prefix.writeUInt(T, 16);
    prefix.writeUInt(W, 8);
    prefix.writeUInt(Lbig, k);
    prefix.writeBytes(B);
    const expectedHash = await sha256(prefix.toBytes());
    assert(equal(digest, expectedHash), 'HASH inválido');
    const rid = hex(await sha256(bytes));

    return {
      version: VERSION, bytes, rid, type: T, typeInfo: typeInfo(T), body: B,
      bodyBits: L, W, k, hash: hex(digest), bitLength: expectedBits,
      physicalBytes: bytes.length, materialValid: true
    };
  }

  async function decodeAt(stream, byteOffset = 0) {
    const bytes = stream instanceof Uint8Array ? stream : new Uint8Array(stream);
    assert(Number.isInteger(byteOffset) && byteOffset >= 0 && byteOffset < bytes.length, 'offset inválido');
    const tail = bytes.slice(byteOffset);
    const r = new BitReader(tail);
    r.readUInt(16);
    const W = Number(r.readUInt(8));
    const k = W + 1;
    assert(k >= 1 && k <= 256, 'W/k inválido');
    const L = Number(r.readUInt(k));
    const totalBytes = Math.ceil((16 + 8 + k + L + 256) / 8);
    assert(totalBytes <= tail.length, 'stream truncado');
    const decoded = await decode(tail.slice(0, totalBytes));
    return { ...decoded, consumedBytes: totalBytes, nextByteOffset: byteOffset + totalBytes };
  }

  function pack(records) {
    return concat(...records.map(x => x instanceof Uint8Array ? x : x.bytes));
  }

  function quickCheckRepresentation(typeCode, body) {
    const info = typeInfo(typeCode);
    const B = body instanceof Uint8Array ? body : new Uint8Array(body);
    try {
      switch (Number(typeCode)) {
        case 0x0000: return { known: true, valid: true, level: 'opaque', reason: 'binario opaco' };
        case 0x0001: text(B, true); return { known: true, valid: true, level: 'utf8' };
        case 0x0002: JSON.parse(text(B, true)); return { known: true, valid: true, level: 'json-parse' };
        case 0x0003:
        case 0x0004: text(B, true); return { known: true, valid: true, level: 'utf8-only', reason: 'no ejecuta ni valida sintaxis completa' };
        case 0x0010: return { known:true, valid: B.length>=8 && hex(B.slice(0,8))==='89504e470d0a1a0a', level:'magic' };
        case 0x0011: return { known:true, valid: B.length>=3 && B[0]===0xff && B[1]===0xd8 && B[2]===0xff, level:'magic' };
        case 0x0012: return { known:true, valid: B.length>=12 && text(B.slice(0,4))==='RIFF' && text(B.slice(8,12))==='WEBP', level:'magic' };
        case 0x0020: return { known:true, valid: B.length>=5 && text(B.slice(0,5))==='%PDF-', level:'magic' };
        case 0x0030: return { known:true, valid: B.length>=4 && B[0]===0x50 && B[1]===0x4b && [0x03,0x05,0x07].includes(B[2]) && [0x04,0x06,0x08].includes(B[3]), level:'magic' };
        case 0x0040: return { known:true, valid: B.length>=4 && hex(B.slice(0,4))==='0061736d', level:'magic' };
        default: return { known:false, valid:null, level:'unavailable', reason:`sin procesador local para T=${typeCode}` };
      }
    } catch (e) {
      return { known: !info.unknown, valid: false, level: 'decode', reason: e.message };
    }
  }

  async function selfTest() {
    const cases = [
      { type:0x0002, body:utf8('{"a":1,"b":2}') },
      { type:0x0003, body:utf8('console.log("K5");') },
      { type:0x0000, body:Uint8Array.of(0x00,0xff,0x10) },
      { type:65000, body:utf8('desconocido pero materialmente válido') }
    ];
    const results=[];
    for (const c of cases) {
      const e=await encode(c.type,c.body); const d=await decode(e.bytes);
      assert(d.type===c.type && equal(d.body,c.body),'roundtrip K5');
      const row={type:c.type,hex:hex(e.bytes),rid:e.rid,hash:e.hash,W:e.W,k:e.k,bodyHex:hex(c.body)};
      const known=KNOWN_VECTORS[results.length];
      assert(row.type===known.type && row.bodyHex===known.bodyHex && row.hex===known.recordHex && row.rid===known.rid && row.hash===known.hash, 'vector conocido K5.1 no coincide');
      results.push(row);
    }
    const recs = await Promise.all(cases.slice(0,3).map(c=>encode(c.type,c.body)));
    const stream=pack(recs); let offset=0,count=0;
    while(offset<stream.length){const d=await decodeAt(stream,offset);offset=d.nextByteOffset;count++;}
    assert(count===3 && offset===stream.length,'stream framing');

    const json = await encode(0x0002, utf8('{"ok":true}'));
    assert(JSON.parse(text((await decode(json.bytes)).body)).ok===true,'JSON nativo extraíble');

    const corruptedType=json.bytes.slice(); corruptedType[1]^=1;
    let typeFailed=false; try{await decode(corruptedType);}catch(_){typeFailed=true;} assert(typeFailed,'corrupción T debe fallar');
    const corruptedBody=json.bytes.slice(); corruptedBody[Math.min(5,corruptedBody.length-2)]^=1;
    let bodyFailed=false; try{await decode(corruptedBody);}catch(_){bodyFailed=true;} assert(bodyFailed,'corrupción B debe fallar');
    const corruptedHash=json.bytes.slice(); corruptedHash[corruptedHash.length-2]^=1;
    let hashFailed=false; try{await decode(corruptedHash);}catch(_){hashFailed=true;} assert(hashFailed,'corrupción H debe fallar');

    return { ok:true, version:VERSION, vectors:results, streamBytes:stream.length };
  }

  root.Khipu5 = Object.freeze({
    VERSION, HASH_NAME, TYPES, KNOWN_VECTORS, utf8, text, hex, unhex, concat, equal,
    sha256, sha256Pure, typeInfo, encode, decode, decodeAt, pack,
    quickCheckRepresentation, selfTest
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
