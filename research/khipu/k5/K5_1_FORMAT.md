# Khipu-5 · K5.1 wire format

`[T16][W8][LEN_k][BODY_L][HASH256][PAD0]`

- `T16`: codec/formato material, uint16 big-endian.
- `k = W + 1 = max(1, bit_length(L))`.
- `LEN_k`: longitud de BODY en bits.
- K5.1 exige `L mod 8 = 0`.
- `HASH256 = SHA-256(CanonicalPack(T16 || W8 || LEN_k || BODY_L))`.
- HASH sigue inmediatamente a BODY.
- `PAD0`: bits cero hasta la siguiente frontera de byte.
- `rid = SHA-256(recordBytes)`.

`MaterialValid` no exige disponer del procesador de T.
