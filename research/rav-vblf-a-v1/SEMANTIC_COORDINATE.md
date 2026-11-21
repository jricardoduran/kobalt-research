# Coordenada semántica fuera del RAV

RAV/VBLF-A v1 mantiene una coordenada de interpretación de 16 bits al inicio de BODY. Una variante conceptual futura puede hacer el RAV completamente agnóstico:

`RAV(B) = W || LEN || B || HASH`

y colocar la interpretación en una referencia separada:

`TypedRef = (InterpretationSlot, rid(RAV(B)))`.

La propiedad mínima que debe conservarse es la **vinculación verificable entre la coordenada semántica y la identidad material exacta**.

Esto separa responsabilidades:

- RAV: delimitación, completitud, integridad e identidad material.
- TypedRef: interpretación.
- relaciones/estructuras: orden, causalidad y composición.

No se modifica el contrato v1. Cualquier realización futura debe usar un nuevo contrato/versión y no reinterpretar bytes históricos.
