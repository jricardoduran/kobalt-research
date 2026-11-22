# Kobalt — plan de probetas para mecanismos generales de continuidad

**Fecha:** 2026-11-22
**Objetivo:** verificar mecanismos generales antes de volver a Commerce.

---

## Principio de las probetas

Cada probeta debe aislar una sola propiedad conceptual y mostrar:

1. hechos causales de entrada;
2. relaciones/contratos disponibles;
3. recorrido de continuidad;
4. metaestado K_h;
5. estado S_h;
6. consecuencias derivadas;
7. materializaciones;
8. criterio explícito de falsación.

No comenzar por una UI de negocio. La UI debe hacer visible el mecanismo.

---

## P0 — Explorador de continuidad

### Pregunta

¿Puede un lector genérico descubrir la estructura de una continuidad sin conocer Product/Price/etc. de antemano?

### Escenario

Continuidad con:

- dos EntityKinds;
- tres ParameterDefinitions;
- una RelationDefinition;
- varias EntityAdmissions;
- varios Assignments.

### UI

Panel izquierdo: registros/hechos recorridos.

Panel central: K_h incremental.

Panel derecho: S_h/materializaciones.

Controles:

- avanzar 1 hecho;
- avanzar hasta head;
- reiniciar;
- mostrar dependencias.

### Debe mostrar

`registro -> interpretación -> actualización de K/S -> consecuencia`.

### Falsación

Si la UI necesita una lista hardcodeada de las entidades/parámetros del fixture para reconstruirlos, falla.

---

## P1 — Posición derivada

### Pregunta

¿Dos lectores que reciben los mismos hechos físicos en distinto orden de almacenamiento derivan exactamente las mismas posiciones?

### Escenario

Admisiones E_A,E_B,E_C con un orden constitutivo canónico distinto del orden físico de entrega.

### UI

Mostrar en paralelo:

- orden físico;
- relaciones constitutivas;
- S_K derivada;
- pos_K.

Permitir barajar orden físico.

### Invariante

`same C_h -> same S_K -> same positions`.

### Falsación

Una barajada física cambia un slot.

---

## P2 — Entidad nueva + parámetro existente

### Escenario

`Parameter A` ya está definido.

Nodo local crea E y propone `Assign(E,A,v)`.

### Dependencias

`Admit(E) prec Assign(E,A,v)`.

### Debe verse

Antes de admisión no existe posición compartida.

Después de admisión emerge `pos(E)`.

Después el vector materializado puede escribir `V_A[pos(E)]=v` sin almacenar identity en cada celda.

---

## P3 — Parámetro nuevo + entidad existente

### Escenario

E ya está constituida.

Nodo offline propone `DefineParameter(A)` y `Assign(E,A,v)`.

### Dependencia

`DefineParameter(A) prec Assign(E,A,v)`.

### Debe verse

Al admitirse A, conceptualmente aparece la proyección `V_A`; físicamente puede seguir sin materializarse hasta que la UI la solicite.

---

## P4 — Entidad nueva + parámetro nuevo offline

### Pregunta

¿Necesitamos imponer un orden producto→parámetro o parámetro→producto?

### Escenario

Nodo crea:

`EntityRequest(E)`

`ParameterRequest(A)`

`Assignment(E,A,v)`.

### Grafo causal

`EntityRequest(E) -> Assignment`

`ParameterRequest(A) -> Assignment`.

Las dos primeras son independientes.

### UI

Visualizador DAG + topological sort.

### Invariante

Autoridad puede resolver E/A en cualquier orden compatible; Assignment solo después de ambos.

### Falsación

El sistema exige un orden total que los contratos no justifican.

---

## P5 — Templates de vector: números

### Objetivo

Separar valor semántico y representación.

### Fixtures

- Unsigned(8);
- Unsigned(16);
- FixedPoint(32,2);
- Boolean.

### UI

Mostrar:

- dominio semántico;
- valores;
- vector lógico;
- codec material;
- bytes/bits estimados.

### Prueba

Cambiar codec sin cambiar valores semánticos.

### Falsación

Un cambio de codec altera la interpretación de dominio.

---

## P6 — Enum con tabla de opciones

### Escenario

Definir clase de opciones O y valores O0...Om.

Definir parámetro A=Enum(O).

### Materialización

`V_A[i]` puede almacenar posición de opción.

### UI

Mostrar opción por identidad/nombre y representación compacta por posición.

### Invariante

`OptionIdentity != OptionPosition`, igual que entidades.

---

## P7 — Reference vector

### Escenario

Clase A referencia entidades de clase B.

`Parameter RefB : A -> B`.

### Prueba

Semánticamente guardar B_id; materialización puede usar `pos_B` si el corte B requerido está disponible.

### Falsación

Un slot de B se interpreta sin poder reconstruir S_B correspondiente.

---

## P8 — Texto / blob references

### Escenario

Parameter Description.

Comparar:

- string inline;
- hash/ref a blob;
- string pool + offsets.

### Objetivo

Mostrar que una misma semántica admite múltiples codecs.

---

## P9 — Assigned vector vs derived vector

### Escenario

`Price` = LatestAuthorizedAssignment.

`Balance/Stock` = SumMovements - Uses.

### UI

Ambos se muestran como `slot->value`.

Pero panel causal revela folds distintos.

### Invariante

`CommonVectorInterface != CommonCausality`.

---

## P10 — Relaciones y secuenciación

### Escenario

`B <= A`.

Estado `(A=100,B=80)`.

Propuesta `(A=70,B=60)`.

### Motor

Clasificar:

`Sequenciable(B:=60, A:=70)`.

### Variante

Crear caso donde solo lote atómico sea válido.

### Variante

Crear caso con múltiples alternativas válidas que requiera autoridad.

---

## P11 — Atomicidad de append constitutivo

### Escenario

Dos autoridades/procesos intentan incorporar simultáneamente dos admisiones en el mismo orden K.

### Objetivo

Demostrar que se protege el head/append, no un campo slot.

### Resultado

Una incorporación avanza el orden; la otra relee y continúa.

Las posiciones emergen posteriormente.

---

## P12 — Snapshot + delta

### Escenario

Construir continuidad con N hechos.

Derivar `M_h` en h.

Añadir k hechos.

Comparar:

`FullReplay(C_h')`

con:

`FoldDelta(M_h,Delta)`.

### Invariante

Resultados byte/semánticamente equivalentes según contrato de materialización.

---

## P13 — Exportaciones múltiples

### Mismo estado

Derivar:

- JSON por entidad;
- matriz densa con null;
- vector columnar;
- CSV;
- tabla tipo SQL.

### Objetivo

Mostrar que el formato de salida es una pregunta, no la ontología.

---

## P14 — Offline / online / servidor

### Objetivo

Eliminar la falsa oposición local=cliente y remoto=servidor.

### Escenario

Tres nodos:

- browser offline;
- browser online;
- authority PHP/server.

Cada uno mantiene trayectoria/evidencia local.

### UI

Mostrar para cada nodo:

- local evidence;
- connectivity;
- outgoing obligations;
- acquired-but-not-yet-persisted material;
- recognized local state.

### Invariante

Ningún nodo interpreta material remoto como verdad antes de verify+persist local.

---

## P15 — Continuidad no es trayectoria global

### Escenario

Dos trayectorias nodales independientes + una fibra constitutiva autorizada + relaciones causales.

### UI

Representar grafo parcial y, por separado, cada fibra lineal.

### Objetivo

Mostrar que una fibra autorizada puede ordenar admisiones sin convertir toda C en un log total.

---

## Orden recomendado

`P0 -> P1 -> P2 -> P3 -> P4 -> P5/P6/P7/P8 -> P9 -> P10 -> P11 -> P12 -> P13 -> P14 -> P15`

Las primeras cinco fijan ontología y causalidad.

Las siguientes cuatro fijan familias de vector.

Las restantes fijan relaciones, atomicidad, incrementalidad y distribución.

---

## Criterio para volver a Commerce

Volver a diseñar Commerce cuando podamos expresar Price, Quantity, Description, Tax, Images, Enabled y Stock **sin crear mecanismos estructurales específicos para sus nombres de negocio**, únicamente componiendo mecanismos generales probados.
