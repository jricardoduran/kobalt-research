# Khipu-5 / K5.1 — PHP

## Prueba rápida

Por consola:

```bash
php verify.php
```

Debe devolver `"ok": true` y crear `test-vectors.json`.

En servidor PHP, abre `index.php`. Puedes crear un K5 desde texto/archivo, verificarlo y extraer el BODY con su extensión nativa.

## Contrato

`K5.1 = [T16][W8][LEN_k][BODY_L][HASH256][PAD0]`

`HASH256 = SHA-256(CanonicalPack(T16 || W8 || LEN_k || BODY_L))`.

La verificación material no depende de parsear el formato T.
