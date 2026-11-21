# Continuidad UI v2 — IndexedDB como única fuente de render

**Fecha:** 2026-11-21 11:29 UTC-5

## Invariante

La UI jamás renderiza una proyección obtenida directamente de la fuente.

`Source -> Verify(K5) -> Stage in IndexedDB(uiName) -> CommitHead -> Read IndexedDB -> Verify(K5) -> Project -> Render`

Cada registro se guarda inmediatamente después de ser materialmente válido. Sin embargo, los registros staged no se vuelven continuidad activa hasta que se alcanza y valida el génesis completo. El cambio de `activeHead` es el commit lógico local.

Por ello, un fallo a mitad de importación puede dejar objetos deduplicables en caché, pero no sustituye la continuidad activa anterior.

## Namespace de UI

`DB(uiName) = kobalt.ui.v2::<uiName>`

El nombre es parámetro. Por defecto se deriva de la carpeta de la UI; también puede fijarse por `?ui=...`. Cambiarlo crea un espacio IndexedDB independiente y permite repetir la prueba desde cero sin borrar otras instancias.

## Consecuencia

La fuente responde qué material nuevo existe. IndexedDB responde qué conoce localmente esta instancia de UI. La interfaz solo observa esta segunda capa.
