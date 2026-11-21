# RAV / VBLF-A v1 — contrato material

`R = W_8 || LEN_k || BODY_L || HASH_256 || PAD`

- `W_8`: entero sin signo de 8 bits.
- `k = W + 1`.
- `LEN_k`: entero sin signo big-endian a nivel de bits; representa `L`, número de bits de BODY.
- Canonicidad: `k = max(1, bit_length(L))`.
- BODY contiene exactamente `L` bits. El perfil v1 exige `L mod 8 = 0` y `L >= 16`.
- Los primeros 16 bits de BODY son una coordenada `uint16` big-endian; el residuo es payload opaco para RAV.
- `HASH_256`: SHA-256 del empaquetado canónico de los tres primeros componentes. Para alimentar SHA-256, ese prefijo bit-level se rellena con ceros hasta frontera de byte. Ese relleno no aparece entre BODY y HASH.
- `PAD`: 0–7 bits cero para alinear el siguiente RAV a frontera de byte.

La longitud física se deriva como `ceil((8+k+L+256)/8)`. `rid = SHA-256(recordBytes)`.

Un perfil futuro requiere otro contrato; no debe reinterpretar registros v1.
