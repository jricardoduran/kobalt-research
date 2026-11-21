export const RAV = (() => {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  function assert(c, m) { if (!c) throw new Error(m); }
  function utf8(s) { return enc.encode(String(s)); }
  function text(b) { return dec.decode(b); }
  function hex(b) { return Array.from(b, x => x.toString(16).padStart(2, '0')).join(''); }
  function unhex(h) {
    const s = String(h).trim();
    assert(/^[0-9a-f]*$/i.test(s) && s.length % 2 === 0, 'hex inválido');
    const out = new Uint8Array(s.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(s.slice(i * 2, i * 2 + 2), 16);
    return out;
  }
  function concat(...parts) {
    const n = parts.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(n); let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
  }
  function u16(n) { assert(Number.isInteger(n) && n >= 0 && n <= 65535, 'slot fuera de uint16'); return Uint8Array.of((n >>> 8) & 255, n & 255); }
  function readU16(b) { assert(b.length >= 2, 'body sin slot'); return (b[0] << 8) | b[1]; }
  function equal(a, b) { if (a.length !== b.length) return false; let x = 0; for (let i = 0; i < a.length; i++) x |= a[i] ^ b[i]; return x === 0; }
  async function sha256(bytes) { return new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)); }
  function bitLength(n) { let x = BigInt(n); if (x === 0n) return 1; let k = 0; while (x) { x >>= 1n; k++; } return k; }

  class BitWriter {
    constructor() { this.bits = []; }
    writeUInt(value, width) {
      let v = BigInt(value); assert(width >= 0, 'width inválido');
      if (width === 0) return;
      assert(v >= 0n && v < (1n << BigInt(width)), 'entero no cabe');
      for (let i = width - 1; i >= 0; i--) this.bits.push(Number((v >> BigInt(i)) & 1n));
    }
    writeBytes(bytes) { for (const x of bytes) this.writeUInt(BigInt(x), 8); }
    appendBits(bits) { this.bits.push(...bits); }
    toBytes() {
      const out = new Uint8Array(Math.ceil(this.bits.length / 8));
      for (let i = 0; i < this.bits.length; i++) if (this.bits[i]) out[i >> 3] |= 1 << (7 - (i & 7));
      return out;
    }
  }

  class BitReader {
    constructor(bytes, bitLimit = bytes.length * 8) { this.bytes = bytes; this.pos = 0; this.limit = bitLimit; }
    readBit() { assert(this.pos < this.limit, 'RAV truncado'); const p = this.pos++; return (this.bytes[p >> 3] >> (7 - (p & 7))) & 1; }
    readUInt(width) { let v = 0n; for (let i = 0; i < width; i++) v = (v << 1n) | BigInt(this.readBit()); return v; }
    readBits(width) { const a = []; for (let i = 0; i < width; i++) a.push(this.readBit()); return a; }
    readBytesFromBits(bitCount) {
      assert(bitCount % 8 === 0, 'payload del perfil v3 debe ser byte-aligned');
      const w = new BitWriter(); for (let i = 0; i < bitCount; i++) w.bits.push(this.readBit()); return w.toBytes();
    }
  }

  async function encode(slot, payload) {
    const p = payload instanceof Uint8Array ? payload : new Uint8Array(payload);
    const body = concat(u16(slot), p);
    const L = BigInt(body.length * 8);
    const k = bitLength(L);
    assert(k <= 256, 'L excede perfil VBLF-A v1');
    const W = k - 1;
    const prefix = new BitWriter();
    prefix.writeUInt(BigInt(W), 8); prefix.writeUInt(L, k); prefix.writeBytes(body);
    const digest = await sha256(prefix.toBytes());
    const record = new BitWriter(); record.appendBits(prefix.bits); record.writeBytes(digest);
    const bytes = record.toBytes();
    const rid = hex(await sha256(bytes));
    return { bytes, rid, slot, payload: p, bodyBits: Number(L), k, W, hash: hex(digest), bitLength: record.bits.length };
  }

  async function decode(bytes) {
    const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    assert(b.length >= 34, 'RAV demasiado corto');
    const r = new BitReader(b);
    const W = Number(r.readUInt(8)); const k = W + 1;
    assert(k >= 1 && k <= 256, 'k inválido');
    const Lbig = r.readUInt(k); assert(Lbig <= BigInt(Number.MAX_SAFE_INTEGER), 'payload demasiado grande para probeta');
    const L = Number(Lbig);
    assert(k === bitLength(Lbig), 'LEN no canónico');
    assert(L >= 16 && L % 8 === 0, 'body debe tener slot y ser byte-aligned');
    const expectedBits = 8 + k + L + 256;
    const expectedBytes = Math.ceil(expectedBits / 8);
    assert(b.length === expectedBytes, `longitud física inválida: ${b.length} != ${expectedBytes}`);
    const body = r.readBytesFromBits(L);
    const digest = r.readBytesFromBits(256);
    while (r.pos < b.length * 8) assert(r.readBit() === 0, 'padding final no canónico');
    const prefix = new BitWriter(); prefix.writeUInt(BigInt(W), 8); prefix.writeUInt(Lbig, k); prefix.writeBytes(body);
    const expectedHash = await sha256(prefix.toBytes());
    assert(equal(digest, expectedHash), 'hash lógico inválido');
    const slot = readU16(body); const payload = body.slice(2);
    const rid = hex(await sha256(b));
    return { bytes: b, rid, slot, payload, bodyBits: L, k, W, hash: hex(digest), bitLength: expectedBits };
  }

  async function decodeAt(stream, byteOffset = 0) {
    const s = stream instanceof Uint8Array ? stream : new Uint8Array(stream);
    assert(byteOffset >= 0 && byteOffset < s.length, 'offset inválido');
    const tail = s.slice(byteOffset);
    const r = new BitReader(tail);
    const W = Number(r.readUInt(8)); const k = W + 1;
    const L = Number(r.readUInt(k));
    const totalBytes = Math.ceil((8 + k + L + 256) / 8);
    assert(totalBytes <= tail.length, 'stream truncado');
    const record = tail.slice(0, totalBytes);
    const decoded = await decode(record);
    return { ...decoded, consumedBytes: totalBytes, nextByteOffset: byteOffset + totalBytes };
  }

  async function pack(records) { return concat(...records.map(x => x instanceof Uint8Array ? x : x.bytes)); }

  function canonicalJson(value) {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonicalJson(value[k])).join(',') + '}';
  }

  return { utf8, text, hex, unhex, concat, sha256, canonicalJson, encode, decode, decodeAt, pack };
})();
