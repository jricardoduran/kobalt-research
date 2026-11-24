# Kobalt Kernel 10.1 — EXPAND y TRAJECTORY

**Fecha:** 2026-11-24, America/Bogota (UTC−5)  
**Estatuto:** nota conceptual de decisión para 10.1; no implica una implementación nueva.  
**Base material:** `Kobalt_Kernel_10.0.0/kernel.js`, perfil experimental KOB10/1; Qipu 1.0.0.

## 1. Descubrimiento

Una trayectoria finita de registros inmutables Γ = (r₀,…,rₙ₋₁) puede manifestarse como un índice exacto de celdas EMIT(Qᵢ), donde Qᵢ = ContentIdᵥ(rᵢ). EXPAND ya permite recuperar esos registros en orden, conservando la multiplicidad. Por tanto, TRAJECTORY no amplía necesariamente la expresividad referencial del kernel. Su utilidad es hacer explícitas las leyes de constitución y proporcionar una representación especializada eficiente.

La Cell conserva su formato de 36 bytes (descriptor de 4 bytes + referente de 32). El nombre físico Nᵥ(Cell) se deriva de la Cell completa y tiene 32 bytes en KOB10/1; no debe confundirse con la Cell. Q identifica contenido exacto bajo una vista; I identifica una realidad longitudinal.

## 2. Dos preguntas independientes

EXPAND(Q): obtener todas las referencias de una composición exacta, en orden. TRAJECTORY(I): reconocer una secuencia constitutiva bajo una identidad longitudinal estable. La primera es una ley de exploración; la segunda, una ley de reconocimiento de extensiones.

Un EXPAND es inmutable como índice exacto, aunque su evaluación puede variar si contiene FOLLOW o TRAJECTORY. Para una trayectoria de EMIT, el índice es un corte exacto. Su evolución necesita otro mecanismo: FOLLOW(I) puede seleccionar el último índice publicado, pero no garantiza por sí mismo que los índices sucesivos sean extensiones conservativas. Hace falta imponer Jₙ ⪯ Jₙ₊₁, conservar el orden y los registros anteriores, e interpretar sus tratamientos mediante contratos.

TRAJECTORY reconoce secuencias completas K5B y compara prefijos de candidatos reconocidos. Las divergencias se exponen como FORK. El máximo observado no garantiza actualidad global. El recorrido constitutivo es independiente de la localización de los registros y del reconocimiento de sus bytes.

## 3. Equivalencia semántica condicionada

Sea J(Γ) = [EMIT(Q₀), …, EMIT(Qₙ₋₁)]. Si los materiales están disponibles, sus identidades verifican, su orden y multiplicidad se preservan, y ambos perfiles usan los mismos registros y contratos, entonces:

    R(EXPAND(ContentId(J(Γ)))) = [r₀, …, rₙ₋₁]
    concat(R(EXPAND(ContentId(J(Γ))))) = Encode(Γ)
    Fold_C(Γ) = Fold_C(Decode(concat(R(EXPAND(ContentId(J(Γ)))))))

La igualdad es de contenido o resultado constitutivo, no de representación física, identidad, costo, disponibilidad ni mecanismo de actualización. No se puede sustituir TRAJECTORY por EXPAND sin conservar la ley de extensión. Repetir un registro idéntico en dos posiciones puede significar dos hechos legítimos; deduplicar bytes no significa deduplicar posiciones.

## 4. Comparación material real

Experimento ejecutado en Node con Web Crypto y el kernel 10.0.0 real. Se usaron los 37 registros de `Qipu.Ejemplos.frames()`, todos distintos, vista Clear, Source de memoria y registros K5B completos en ambas representaciones. No es un benchmark de tiempo ni un experimento de red.

| Medida | FOLLOW → EXPAND → EMIT por registro | TRAJECTORY |
|---|---:|---:|
| Bytes de registros | 1.578 | 1.578 |
| CellVector del índice exacto | 1.332 | 0 |
| Sobres de los 37 registros | 4.353 | — |
| Sobre EXPAND | 1.407 | — |
| Sobre FOLLOW con una celda | 111 | — |
| Sobre TRAJECTORY | — | 1.653 |
| Total de sobres para un corte | 5.871 | 1.653 |
| Consultas a la Source en frío | 39 | 1 |

Los 37 materiales emitidos, concatenados, coincidieron byte por byte con la trayectoria nativa. El costo de la representación indexada es aproximadamente 3,55 veces el de la nativa en este ejemplo. No se cuentan nombres externos, protocolos, índices de almacenamiento, réplicas ni cachés. Se conservó K5B deliberadamente en ambas alternativas; no es el mínimo teórico de un índice de registros exactos. Con reutilización de materiales o acceso a pocos registros, la comparación puede favorecer EXPAND. Una actualización nativa tampoco es necesariamente incremental en red: el 10.0.0 publica un cuerpo completo, aunque el modelo permita implementar segmentos y deltas.

## 5. Qué mecanismos de Qipu puede absorber el kernel

- H de K4B/K5B: si cada registro es un objeto EMIT y su Q compromete los bytes completos, el hash interno puede resultar redundante para esa comprobación externa. No son la misma función ni necesariamente los mismos bytes. H continúa siendo útil en un flujo autónomo, concatenado o local. En vista Keyed, Q es derivado con clave, mientras el H de Qipu es SHA-256 del registro enmarcado y separado por dominio.
- W y L: las fronteras del material EMIT pueden sustituir el framing por registro cuando hay un objeto por hecho. En una secuencia compacta, siguen siendo necesarias para reconocer fronteras y truncamientos.
- T: el descriptor EMIT de la Cell indica cómo explorar, no cómo interpretar un hecho. El tratamiento constitutivo (crear entidad, asignar, diferencial, etc.) se mantiene en su contrato o en un contexto explícito.
- K2P: la representación posicional sigue siendo útil en ambos casos. Los hashes no sustituyen la referencia contextual compacta (tabla, vector, posición).
- Fold, tablas, vectores, asignaciones y diferenciales: no emergen automáticamente de EXPAND; son leyes de constitución que deben permanecer explícitas.

Una variante sin H interno y con framing proporcionado por EMIT requiere especificar un perfil distinto; no se ha implementado ni probado en esta nota. Ningún hash por sí solo prueba autoría, autorización, completitud o posición histórica. El índice ordenado compromete posiciones y multiplicidad; una trayectoria reconocida compromete su prefijo bajo las reglas correspondientes.

## 6. Complementariedad y economía

Mantener TRAJECTORY nativo facilita recorrer localmente una secuencia de registros pequeños y derivar posiciones sin una referencia autónoma de 36 bytes por registro. EXPAND facilita distribuir y recuperar selectivamente objetos exactos, reutilizarlos entre composiciones, organizar segmentos y verificar cortes. No es obligatorio elegir una sola representación universal.

Una trayectoria puede manifestarse en red mediante EMIT de un corte exacto, EMIT de vectores derivados, EXPAND de segmentos exactos o EXPAND de registros exactos; FOLLOW puede publicar la manifestación actual. Un índice EXPAND puede contener directamente una Cell TRAJECTORY para abrir una trayectoria viva. La elección depende de las preguntas y costos reales.

Un snapshot completo publicado en cada append puede producir costo histórico cuadrático si se retienen todas las copias. Lo mismo ocurre con índices planos completos repetidos. La segmentación, el intercambio incremental y, si se justifica, índices persistentes jerárquicos pueden reducir ese costo. No son requisitos ontológicos de TRAJECTORY.

## 7. Decisión propuesta para 10.1

Conservar cuatro operadores y la Cell de 36 bytes:

| Operador | Referente | Ley |
|---|---|---|
| EMIT | Q exacto | Entregar material exacto |
| EXPAND | Q exacto | Continuar por todas las celdas |
| FOLLOW | I longitudinal | Continuar por la última celda reconocida |
| TRAJECTORY | I longitudinal | Reconocer el prefijo constitutivo y terminar la exploración referencial |

TRAJECTORY es una especialización nativa de secuencias constitutivas que el kernel ya podía manifestar mediante composiciones. No constituye una cuarta forma de ramificación; es la segunda clase de hoja. EXPAND sigue siendo general. Los mecanismos Qipu siguen definiendo cómo emergen los espacios posicionales. No convertir una equivalencia de expresividad en una obligación de representación física.

La versión 10.1 debe conservar como ejemplo de utilidad la equivalencia entre EXPAND de EMIT y TRAJECTORY, con sus costos, invariantes y límites. Pruebas futuras: cortes exactos, registros repetidos, pérdida de un material, extensión, bifurcación, igualdad de derivados en ambas formas y transferencia incremental de segmentos. No se modifica el kernel 10.0.0 con esta nota.

**Principio:** el kernel ya podía expresar la trayectoria; TRAJECTORY hace explícita su naturaleza constitutiva y evita pagar por referencias autónomas donde el contexto posicional ya las determina. La flexibilidad de EXPAND y la economía de TRAJECTORY son complementarias.
