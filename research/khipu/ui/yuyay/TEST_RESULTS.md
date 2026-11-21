# Resultados de prueba — Continuidad UI v2

**Fecha:** 2026-11-21 11:29 UTC-5

## Resultado funcional

PASS en las pruebas ejecutables disponibles:

- PHP 8.4.24: sintaxis PASS.
- Fuente PHP: 7 K5, 3 productos, 2 ventas.
- API PHP `head`: devuelve el RID esperado.
- API PHP `record`: devuelve exactamente los mismos bytes `.k5` del filesystem.
- JavaScript: sintaxis PASS.
- Persistencia con backend IndexedDB simulado contra la misma API usada por producción:
  - 7 K5 verificados y guardados;
  - reconstrucción posterior usa solo el store local;
  - 3 productos / 2 ventas;
  - `uiName` distinto queda aislado y vacío;
  - una sincronización corrupta aborta y no reemplaza el `activeHead` anterior.

## Limitación del entorno

El Chromium disponible en este entorno aplica una política que bloquea navegación local y niega `indexedDB.open()` en `about:blank` con `SecurityError`. Por ello no se afirma una prueba end-to-end de IndexedDB real en este Chromium.

El código productivo usa la API IndexedDB nativa. La prueba JS utilizó un mock mínimo de la misma superficie (`open`, object stores, transactions, `put/get/count`, `deleteDatabase`) para verificar el flujo y sus invariantes.

## Invariante probado

`Source -> Verify -> Stage(IDB) -> CommitHead -> Re-read(IDB) -> Project -> Render`

La UI no recibe ni renderiza el resultado de la reconstrucción de la fuente. Después del commit llama nuevamente a `KobaltUIStore.reconstruct(uiName)` y renderiza únicamente ese resultado.
