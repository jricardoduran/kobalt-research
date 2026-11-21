# Khipu UI — perfiles Qhaway y Yuyay

**Estado:** nomenclatura canónica desde 2026-11-21.

Las dos variantes son perfiles hermanos. Yuyay no reemplaza a Qhaway.

## Khipu Qhaway (KQ)

Perfil **efímero / observación directa**.

`Source -> Verify K5 -> Reconstruct -> Project -> UI`

La UI reconstruye desde la fuente en cada lectura. No existe una memoria local obligatoria. Al desaparecer la fuente o recargarse sin volver a leerla, la proyección no tiene por qué persistir.

Propiedad central: **la fuente es necesaria para cada reconstrucción**.

## Khipu Yuyay (KY)

Perfil **con memoria local / incorporación**.

`Source -> Verify K5 -> IndexedDB(uiName) -> Re-read + Verify -> Reconstruct -> Project -> UI`

La fuente nunca llega directamente al render. Cada K5 se verifica y se persiste; solo después de validar el recorrido completo se actualiza `activeHead`. La UI vuelve a leer IndexedDB, vuelve a verificar los K5 alcanzables y proyecta únicamente desde esa memoria local.

Namespace actual:

`kobalt.ui.v2::<uiName>`

Cambiar `uiName` crea otra memoria local independiente.

Propiedad central: **la fuente sirve para incorporar; IndexedDB sirve para reconstruir la UI**.

## Invariante común

Ambos perfiles usan K5.1, `head + prev` y el mismo metacontrato de continuidad UI. Los datos de Producto/Venta no están hardcodeados en la UI; las vistas emergen de la continuidad.

Formalmente:

- Qhaway: `UI = Project(Reconstruct(Source))`.
- Yuyay: `UI_u = Project(Reconstruct(Reachable(IDB_u, activeHead_u)))`.

En Yuyay, objetos verificados pueden quedar cacheados durante una importación fallida, pero una continuidad nueva no se vuelve activa hasta que el recorrido completo termina correctamente.
