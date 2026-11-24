# Kobalt Kernel 10 — consolidación conceptual 2026-11-24

**Estado:** implementación experimental 10.0.0; reflexión 10.1, no nueva versión de código. Partimos de KOB2 9.0.1 y Qipu 1.0.0. La arquitectura se deriva de las propiedades matemáticas, no de convenciones tradicionales. La prueba verifica la propiedad; no la inventa.

## Gramática y estructuras

Cell = descriptor uint32be + referente de 32 bytes (36 bytes). El nombre de almacenamiento derivado de la Cell es distinto de la Cell. EMIT(0,Q) entrega material exacto; EXPAND(1,Q) interpreta un CellVector ordenado y recorre sus elementos; FOLLOW(2,I) reconoce ReferenceHistory y continúa desde la última celda; TRAJECTORY(3,I) reconoce una RecordSequence constitutiva, terminal en la exploración referencial. Los slots son los del perfil experimental 10.0.0. Q e I son preguntas diferentes. No se asume compatibilidad de nombres/envelopes con 9.0.1.

Continuidad: punto de entrada a una realidad que puede evolucionar; EMIT es el caso estático. EXPAND exacto puede contener referencias longitudinales, por lo que su evaluación puede cambiar sin cambiar el índice. FOLLOW conserva referencias declaradas, no necesariamente snapshots transitivamente exactos. TRAJECTORY conserva un prefijo de registros. El recorrido referencial termina en EMIT o TRAJECTORY si el grafo explorado es finito, acíclico y completo; vacío, ausencia, bifurcación y límites son resultados distintos, no materiales inventados. Rutas terminales de profundidad máxima d: 2^(d+1)-2; no es el número de árboles arbitrarios.

## Constitución y optimización

Qipu: K2P (naturales/contextos posicionales), K4B (registro autodelimitado verificable), K5B (tratamiento contractual). El recorrido de registros constituye tablas, entidades y vectores: S[n+1]=F_C(S[n],r[n]). Las posiciones (tabla,vector,entidad) son contextuales, estables y no reutilizadas. La lógica de dominio no se introduce en el núcleo. Una trayectoria puede manifestarse como EXPAND de EMIT de registros o segmentos. Eso representa el orden, pero no impone crecimiento por prefijo ni el tratamiento constitutivo. TRAJECTORY especializa estas garantías y economiza referencias autónomas. Véase EXPAND_TRAJECTORY.md. Identidad material no equivale a identidad de ocurrencia: dos hechos iguales pueden ocupar dos posiciones distintas.

## Teorema de composición: la topología expresa garantías

Sea V_j(n) la derivación del vector j del prefijo n. Dos publicaciones coexisten:
- Independiente: EXPAND([FOLLOW(I_j)]). Cada I_j tiene su historia de realizaciones EMIT(Q_j). Cambiar stock no exige cambiar el índice ni otros vectores. Un consumidor puede resolver solo I_stock. No se garantiza un corte común.
- Consolidada: FOLLOW(I_catalogo) -> EXPAND([EMIT(Q_j(n))]). El publicador deriva todos los vectores de un mismo corte n, escribe primero sus materiales exactos, luego el índice exacto, finalmente la referencia vigente. Se garantiza selección conjunta del manifiesto reconocido, no disponibilidad simultánea de todas las Sources ni atomicidad distribuida.
- Ambas reutilizan los mismos objetos exactos. Un consumidor puede mantener suscripciones a las dos topologías. La tienda consulta un catálogo consolidado; la bodega sigue stock; el POS lee los vectores pertinentes. El catálogo no constituye ventas ni inventario.
- Un vector sin cambio puede reutilizar su Q anterior, incluso en un corte nuevo. Longitudes iguales no prueban coherencia temporal; asociar explícitamente corte, contrato y esquema cuando corresponda.

## Distribución: leer, escribir y suscribirse son relaciones diferentes

Para cada componente lógico c, una configuración externa puede declarar R(c): conjunto de instancias Source consultables; W_material(c): destinos de objetos exactos; W_head(c): destinos de historias/actualidades; S(nodo): referencias que el nodo desea observar. La vista, el nombre derivado y el perfil completan el contexto. No se presume una API universal entre proveedores. La topología no determina por sí sola la disponibilidad, el transporte, la frecuencia de actualización ni la autorización de escritura.

Ejemplo: un nodo comercio anexa hechos a IndexedDB y respalda su trayectoria. Un optimizador lee el prefijo y publica EMIT de stock en una Source de derivados, extiende FOLLOW del stock solo después de depositar el material y publica el índice consolidado cuando el conjunto está listo. Una bodega lee I_stock, una tienda lee I_catalogo. Los destinos pueden ser distintos. Reintentos idempotentes por identidad/posición; preservar el último corte completo ante fallos. Una actualización de cabeza puede producir referencias no disponibles en una réplica retrasada; el consumidor debe distinguir ausencia de material de inexistencia del hecho.

La tabla de rutas puede constituirse mediante una trayectoria de configuración y derivarse como vector, sin introducir un quinto operador. Autoridad se estudiará en un flujo separado; no confundir permiso con destino.

## Atlas

- [README del kernel](README.html): fundamentos e invariantes.
- [Laboratorio combinatorio](laboratorio.html): cuatro operadores, exploración acotada, binarios y Qipu.
- [Atlas 01 — derivados](atlas/01_derivados.html): actualidades independientes/consolidadas; usa el kernel real.
- [Atlas 02 — topologías y distribución](atlas/02_topologias.html): ejemplo conceptual de coexistencia, suscripción y destinos.
- [Nota EXPAND/TRAJECTORY](EXPAND_TRAJECTORY.md): equivalencia de representación y especialización.

Las comprobaciones anteriores se ejecutaron con JS/Web Crypto y memoria; no se afirma verificación gráfica/IndexedDB real ni una migración completa desde 9.0.1. El Atlas 02 es una demostración conceptual, no transporte real. Pendientes de investigación: publicación incremental, cortes verificables, coherencia de derivados, topologías multi-Source, integración de mecanismos históricos. No convertir estos pendientes en nuevas primitivas por anticipado.
