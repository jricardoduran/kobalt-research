# Khipu UI — clean core

**Fecha:** 2026-11-21 12:24 UTC-5

Esta revisión reduce Qhaway/Yuyay a responsabilidades irreducibles.

## Flujo compartido

- K5: verifica/abre el átomo material.
- Source: solo `head() -> rid` y `get(rid) -> bytes|null`.
- Walk: recorre `head -> prev`, verifica K5, RID, faltantes y ciclos.
- Project: deriva vistas desde los registros recorridos.
- Render: solo DOM.

Qhaway:

`Source -> Walk -> Project -> Render`

Yuyay:

`Source -> Walk -> put(rid,bytes) -> commit(activeHead)`

y para mostrar:

`activeHead + IndexedDB -> Walk -> Project -> Render`

Estado local irreducible de Yuyay:

`Cache_u = (Objects_u, activeHead_u)`

con `Objects_u : rid -> bytes`.

## Simplificaciones

1. Walk ya no proyecta.
2. JSON se parsea una sola vez.
3. IndexedDB guarda solo `rid -> bytes` y `activeHead`.
4. `manifest.json` sale del runtime.
5. Se elimina `continuity` repetido en cada evento.
6. Se elimina `metaContract` redundante del génesis.
7. Source queda reducido a `head/get`.
8. El runtime UI usa un lector K5 material; MIME/extensiones/encoder/self-tests no pertenecen a esta capa.
9. K5.1 conserva `H` y `RID=SHA256(recordBytes)` por compatibilidad. La posible `RID=H` exige una versión futura K5.2.

## Atomicidad Yuyay

Los objetos K5 válidos pueden quedar cacheados durante una importación parcial, pero `activeHead` solo cambia cuando el recorrido completo terminó correctamente:

`cache parcial != continuidad activa`.

Una importación corrupta no sustituye el head anterior.
