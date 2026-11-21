# RAV / VBLF-A v1

Implementación de referencia del mecanismo genérico de **Registro Autodelimitado Verificable (RAV)** en navegador JavaScript y PHP.

Un RAV es una unidad material cuya frontera e integridad pueden verificarse localmente sin índice, vecino, predecesor ni orden global. La estructura matemática o semántica construida con los registros queda fuera de este mecanismo.

## Formato

`R = W_8 || LEN_k || BODY_L || HASH_256 || PAD`

con `k=W+1=max(1,bit_length(L))`. El perfil v1 utiliza BODY byte-aligned y reserva sus primeros 16 bits para una coordenada de interpretación `uint16`. El hash es SHA-256 del empaquetado canónico de `W || LEN || BODY`; el padding final solo alinea el próximo registro.

## Implementaciones

- `rav.js`: navegador/WebCrypto.
- `rav.php`: PHP 8+.
- `test-vectors.json`: vectores conocidos comunes a ambas implementaciones.
- `verify.html`: prueba mínima en navegador.
- `verify.php`: prueba mínima en PHP.

Las implementaciones comerciales o de continuidad de Kobalt no forman parte de esta carpeta.
