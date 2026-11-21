# Khipu Yuyay (KY)

`Yuyay` se usa aquí por su sentido de memoria/recordar.

Perfil local-first: incorpora una continuidad verificada a IndexedDB y la UI renderiza exclusivamente desde esa memoria local.

## Flujo

`Source -> Verify(K5.1) -> IDB(uiName) -> Re-read + Verify -> Reconstruct -> Project -> Render`

## Invariantes

- La respuesta de la fuente nunca se entrega directamente a `render()`.
- Cada K5 se verifica antes de persistirse.
- `activeHead` solo se confirma al terminar correctamente todo el recorrido.
- La UI solo proyecta registros alcanzables desde `activeHead`.
- Una importación fallida no desplaza la continuidad activa anterior.
- `uiName` determina el namespace: `kobalt.ui.v2::<uiName>`.
- Cambiar el nombre de UI permite probar una instancia limpia e independiente.

Se conservan aquí las variantes fuente local y fuente PHP/HTTP.
