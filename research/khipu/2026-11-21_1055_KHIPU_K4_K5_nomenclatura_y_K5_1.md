# KOBALT — Familia Khipu: K4, K5 y perfil K5.1

**Fecha:** 2026-11-21 10:55 (UTC-5, America/Bogotá)  
**Estado:** nomenclatura y contrato de implementación  
**Código:** Khipu-5 / K5.1

## 1. Por qué “Khipu”

`Khipu` (también escrito `quipu`) es una palabra quechua asociada a “nudo” y al sistema andino de registro de información mediante cuerdas anudadas. El nombre se adopta aquí como metáfora técnica: un Khipu material “ata” en una única unidad la información necesaria para delimitar, tramitar y verificar un cuerpo binario.

El nombre no pretende identificar el mecanismo moderno con el sistema histórico andino; es una denominación inspirada en su función de registro.

## 2. Taxonomía

### RAV

**Registro Autodelimitado Verificable** es una propiedad/clase conceptual, no un único formato.

Un mecanismo es RAV cuando una unidad puede delimitarse y verificarse localmente sin necesitar registros vecinos, índice externo ni orden global.

### Khipu-4 — K4

Familia de cuatro campos:

`K4 = [W][L][B][H]`

Preguntas:

- `W`: ¿cómo leo la longitud?
- `L`: ¿cuánto cuerpo pertenece al registro?
- `B`: ¿qué material exacto contiene?
- `H`: ¿permanece íntegro el registro declarado?

Propiedad distintiva: **cuerpo opaco autodelimitado y verificable**.

Los perfiles históricos RAV/VBLF-A pertenecen conceptualmente a esta familia, sin afirmar que todos sean bit-a-bit idénticos entre sí.

### Khipu-5 — K5

Familia tipada de cinco campos:

`K5 = [T][W][L][B][H]`

Añade una primera pregunta irreducible:

- `T`: ¿cómo debe tramitarse/procesarse `B`?

Propiedad distintiva: **cuerpo nativo tipado, autodelimitado y verificable**.

`T` identifica representación/codec material, no semántica de dominio.

Un JSON de Producto y un JSON de Contrato pueden compartir el mismo `T=JSON`.

## 3. Perfil K5.1

Primer perfil binario implementado:

`K5.1 = [T16][W8][LEN_k][BODY_L][HASH256][PAD0]`

con:

`k = W + 1 = max(1, bit_length(L))`

- `T16`: código de procesamiento uint16 big-endian.
- `W8`: ancho de `LEN` menos uno.
- `LEN_k`: longitud del BODY en bits.
- `BODY_L`: bytes nativos; K5.1 exige `L mod 8 = 0`.
- `HASH256`: SHA-256 del empaquetado canónico de `T16 || W8 || LEN_k || BODY_L`.
- `PAD0`: cero a siete bits cero para alinear el siguiente K5 a frontera de byte.

El hash comienza inmediatamente después del BODY. El padding usado al convertir el prefijo bit-level en bytes para SHA-256 no se inserta físicamente entre BODY y HASH.

## 4. Cuerpo nativo

La propiedad fuerte de K5 es:

`Extract(K5) = BODY`

Si `T=JSON`, `BODY` debe poder guardarse directamente como `.json` y ser JSON real cuando la representación sea válida.

Si `T=WEBP`, `BODY` es el WebP nativo.

La extensión externa es una proyección operacional de `T`; no es autoridad por sí misma.

## 5. Registro inicial de tipos K5.1

El perfil implementado reserva códigos estables iniciales:

- `0x0000`: binario opaco → `.bin`
- `0x0001`: texto UTF-8 → `.txt`
- `0x0002`: JSON → `.json`
- `0x0003`: JavaScript → `.js`
- `0x0004`: PHP → `.php`
- `0x0010`: PNG → `.png`
- `0x0011`: JPEG → `.jpg`
- `0x0012`: WebP → `.webp`
- `0x0020`: PDF → `.pdf`
- `0x0030`: ZIP → `.zip`
- `0x0040`: WASM → `.wasm`

Un código desconocido no vuelve inválido materialmente al K5. Puede producir:

`MaterialValid = true`

pero:

`ProcessorAvailable = false`.

La asignación de un código ya publicado no debe cambiar de significado.

## 6. Atomicidad de reconocimiento

K5 distingue atomicidad física de **atomicidad de reconocimiento**.

Un K5 se reconoce materialmente solo si todas sus condiciones materiales son simultáneamente válidas:

`MaterialValid(R) = ValidTField ∧ ValidW ∧ CanonicalLEN ∧ CompleteBODY ∧ ValidHASH ∧ CanonicalPAD`

Si cualquiera falla:

`¬MaterialValid(R) => ABORT(R)`

No se acepta parcialmente, no se adivina tipo o longitud y no se corrige silenciosamente el cuerpo.

## 7. Tres niveles

1. **MaterialValid**: verifica estructura y hash; universal y binario.
2. **RepresentationValid_T**: comprueba si BODY realmente cumple el codec declarado cuando existe un procesador local.
3. **SemanticValid_C**: comprueba el contrato de dominio en una capa posterior.

Por tanto:

`MaterialValid != RepresentationValid != SemanticValid`.

## 8. Qué compromete el hash

En K5.1:

`H = SHA256(CanonicalPack(T,W,L,B))`

Esto hace que alterar `T`, `W`, `L` o `B` sin actualizar el compromiso invalide el registro.

Una precisión: el hash interno demuestra coherencia/integridad material frente al compromiso almacenado. Si un actor cambia todos los campos y vuelve a calcular `H`, ha creado otro K5 materialmente válido. La continuidad, autoridad o una referencia externa a su `rid` debe decidir si ese nuevo registro es el registro reconocido.

El `rid` de implementación es:

`rid = SHA256(recordBytes completos)`.

Así, cualquier cambio material produce una identidad material distinta.

## 9. Flujos

### Escritura

`BODY nativo -> escoger T -> calcular W/L -> calcular H(T,W,L,B) -> ensamblar K5 -> readback/verify -> COMMIT`

Si falla cualquier paso material conocido:

`ABORT_CREATE`.

### Lectura universal

`leer T -> W -> LEN -> BODY -> HASH -> recalcular HASH -> MATERIAL_VALID / ABORT`.

No exige procesar BODY.

### Procesamiento opcional

`MATERIAL_VALID -> resolver procesador(T) -> extraer BODY -> RepresentationValid / VALID_BUT_OPAQUE`.

### Semántica

`RepresentationValid -> Contract -> SemanticValid / Rejected / Pending`.

## 10. Idea central

**K4** responde cómo delimitar y verificar un cuerpo opaco.

**K5** añade la declaración verificable de cómo tramitar ese cuerpo y mantiene el cuerpo en su representación nativa.

**K5.1** es el primer perfil concreto y comprobable de K5.