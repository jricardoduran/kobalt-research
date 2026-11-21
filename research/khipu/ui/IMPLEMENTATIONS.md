# Mapa de implementaciones — Khipu UI

## Khipu Qhaway (KQ)

Perfil efímero / observación directa.

Implementación experimental ya probada:
- `research/khipu/k5/continuity-ui/`

Nombre canónico desde 2026-11-21:
- `research/khipu/ui/qhaway/`

Flujo:

`Source -> Verify(K5.1) -> Reconstruct -> Project -> UI`

## Khipu Yuyay (KY)

Perfil con memoria local / incorporación.

Nombre canónico:
- `research/khipu/ui/yuyay/`

Componentes persistidos bajo esa ruta:
- IndexedDB store;
- adaptador de fuente local;
- adaptador de fuente PHP/HTTP;
- documentación de arquitectura y pruebas.

Flujo:

`Source -> Verify(K5.1) -> IndexedDB(uiName) -> Re-read+Verify -> Reconstruct -> Project -> UI`

Qhaway y Yuyay son perfiles hermanos; ninguno sustituye al otro.
