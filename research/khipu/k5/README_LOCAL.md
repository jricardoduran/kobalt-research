# Khipu-5 / K5.1 — prueba local

Abre `index.html` directamente en Safari/Chrome/Firefox. No usa Node, npm, CDN ni servidor.

## Prueba mínima

1. Deja `T = json`.
2. Pulsa **Crear y verificar K5**.
3. Debe aparecer `MATERIAL_VALID`.
4. Pulsa **Extraer cuerpo nativo**: el archivo descargado termina en `.json` y su contenido es JSON real.
5. Pulsa **Descargar .k5`; luego vuelve a cargar ese archivo en “Abrir un .k5”.
6. Pulsa **Pruebas internas**: debe dar `SELFTEST PASS`.

La prueba interna altera T, BODY y HASH por separado y exige que los tres casos aborten.

## Contrato

`K5.1 = [T16][W8][LEN_k][BODY_L][HASH256][PAD0]`

- `k=W+1=max(1,bit_length(L))`.
- `L` se expresa en bits.
- K5.1 exige BODY byte-aligned.
- `HASH256 = SHA-256(CanonicalPack(T16 || W8 || LEN_k || BODY_L))`.
- el HASH comienza inmediatamente después de BODY;
- el padding final solo alinea el próximo K5 a frontera de byte y debe ser cero.

La validación material no parsea JSON ni ejecuta JS/PHP. La comprobación de representación es posterior y opcional.
