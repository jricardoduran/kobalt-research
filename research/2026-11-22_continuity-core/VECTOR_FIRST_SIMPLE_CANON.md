# Continuity Core — canon simple vector-first

**Fecha:** 2026-11-23
**Estado:** punto de reinicio canónico. Esta versión simplifica y corrige formulaciones anteriores demasiado orientadas a JSON/records.

## 0. Tesis

Continuity Core no necesita JSON, tablas ni una base de datos como ontología.

La forma mínima es:

`trayectorias locales -> autoridad/continuidad -> estado vectorial -> proyecciones`

Formalmente:

`⊔ Γ_n -> C_h -> 𝕍_h -> {UI, Table, JSON, SQL, API, Catalog, Index, Snapshot}`.

JSON es una posible salida. No es un paso intermedio obligatorio.

---

## 1. Qué es irreducible

El Core necesita conservar únicamente aquello que no puede reconstruirse exactamente:

1. definiciones semánticas constituidas;
2. admisiones de identidades;
3. assignments/eventos no derivables;
4. relaciones/decisiones de autoridad necesarias;
5. causalidad mínima entre esos hechos.

Todo estado reproducible es derivación.

Regla:

**Persistir causas y semántica irreducibles; derivar actualidad y representaciones.**

---

## 2. Bootstrap universal mínimo

El runtime conoce una gramática universal pequeña:

`DefineEntity`
`DefineParameter`
`DefineRelation`
`AdmitEntity`
`Assign`

más tipos/evoluciones generales reconocidos.

No conoce Product, Sale, Price, Stock, Task o Book.

La App constituye esos nombres y significados usando la gramática universal.

---

## 3. Entidad: una base de identidades

Definir una entidad `K` crea una clase reconocida, no una tabla física.

`DefineEntity(K,label)`.

Sus elementos constituidos forman una base ordenada:

`S_K = [E_0,E_1,...,E_n]`.

La coordenada de un elemento es:

`pos_K(E_i)=i`.

Esta posición se deriva del orden constitutivo reconocido.

**La posición es consecuencia, no un campo que se escribe.**

---

## 4. Parámetro: una dimensión sobre esa base

Un parámetro `A` de `K` se define una sola vez:

`DefineParameter(A, host=K, valueType=D_A, evolution=F_A, label)`.

Semánticamente:

`A : K ⇀ D_A`.

Definir A induce inmediatamente un vector lógico:

`V_A[i] = CurrentValue(S_K[i],A)`.

Si no existe valor para una coordenada:

`V_A[i]=⊥`.

No hace falta escribir físicamente esos `⊥`.

---

## 5. Estado vectorial

El estado operacional natural del Core en un corte `h` es:

`𝕍_h = ({S_K}, {P_K}, {V_A}, R_h)`

donde:

- `S_K` = base de identidades de cada entidad;
- `P_K` = parámetros reconocidos para K;
- `V_A` = vector actual de cada parámetro;
- `R_h` = relaciones vigentes entre parámetros/entidades.

El metaestado también puede materializarse vectorialmente. No hace falta un documento de schema soberano.

`Schema_h = ProjectDefinitions(C_h)`.

---

## 6. Crear una entidad

Acción humana:

`Crear entidad Producto`.

Flujo:

`local action -> propuesta DefineEntity(K_Product,'Producto') -> Γ_n -> Authority -> C_h' -> 𝕍_h'`.

Resultado operacional:

`S_Product=[]`

`P_Product=[]`.

No se crea JSON, tabla ni registro de producto.

---

## 7. Crear un parámetro

Acción:

`Añadir Precio : FixedPoint(2), Assignment`.

Flujo:

`DefineParameter(A_Price,Product,FixedPoint(2),Assignment)`
` -> Γ_n -> Authority -> C_h' -> 𝕍_h'`.

Si ya existen tres productos:

`S_Product=[P0,P1,P2]`

entonces lógicamente:

`V_Price=[⊥,⊥,⊥]`.

No se reescriben P0/P1/P2.

---

## 8. Crear un elemento

Acción:

`Nuevo producto`.

El hecho irreducible inicial es:

`AdmitEntity(Product,P3)`.

Después:

`S_Product'=[...,P3]`

y:

`pos_Product(P3)=|S_Product|-1`

cuando el contrato constitutivo de esa base es extensión estable por prefijo.

Todos los parámetros existentes adquieren conceptualmente una nueva coordenada `⊥`, sin escribirla.

---

## 9. Asignar un valor

Acción:

`Price(P3)=50000`.

Hecho:

`Assign(P3,A_Price,50000)`.

El Core resuelve:

`i=pos_Product(P3)`

y actualiza la materialización:

`V_Price[i]=50000`.

La identidad `P3` pertenece a la causalidad; la coordenada `i` pertenece a la materialización.

---

## 10. El producto completo no es un objeto primario

Una ficha de producto es una sección transversal de los vectores:

`Section_K(i) = { A -> V_A[i] | A∈P_K, V_A[i]≠⊥ }`.

Por tanto un producto actual puede verse como objeto, pero ese objeto es una proyección.

Regla:

**Una entidad no es un objeto con campos; es una identidad en una base, y sus campos son valores de dimensiones vectoriales en esa coordenada.**

---

## 11. JSON, tabla y SQL son proyectores

JSON actual de un elemento:

`JSON(E_i)=Serialize(Section_K(i))`.

Tabla:

`Table_K[i,j]=V_{A_j}[i]`.

SQL/SQLite:

`SQL_K = Materialize(S_K,{V_A})`.

Catálogo, API, formulario, índices y reportes se derivan igual.

Por eso:

`JSON != Core`

`Table != Core`

`SQL != Core`.

Son vistas del estado vectorial.

---

## 12. Nuevo elemento vs nuevo parámetro

Simetría fundamental:

`nuevo elemento -> extiende S_K`

`nuevo parámetro -> extiende P_K y crea V_A`.

Ninguna operación exige migrar las demás dimensiones.

Si se añade `Material` después de 500 productos:

`V_Material` existe lógicamente sobre las 500 coordenadas con `⊥` donde no hay valor.

---

## 13. Tipos y evolución

ValueTypes iniciales:

`Text | Boolean | Integer | FixedPoint | Enum | DateTime | Reference | BlobReference | Set | List`.

Evolutions iniciales:

`Assignment | Fold | Derived | State`.

Separación obligatoria:

`Value semantics != Evolution semantics != Physical codec`.

Todos exponen la misma interfaz actual:

`V_A[i]=CurrentValue(S_K[i],A)`.

---

## 14. Referencias

Una referencia semántica usa identidad:

`ProductRef : Sale -> Product`.

Una materialización local puede convertir después:

`ProductIdentity -> pos_Product(ProductIdentity)`.

Por tanto:

`semantic reference != positional encoding`.

Las posiciones solo pueden usarse cuando el contexto/base/corte que les da significado está fijado.

---

## 15. Relaciones como álgebra sobre vectores

### Invariant

Precio/descuento:

`∀i: V_Discount[i]=⊥ OR 0<=V_Discount[i]<=V_Price[i]`.

Una propuesta multi-cambio se acepta solo si existe una resolución válida (`Independent`, `Sequenciable`, `AtomicBatch`, etc.).

### Derivation/Fold

Ventas:

`V_ProductRef^Sale`
`V_Quantity^Sale`.

Stock puede derivarse:

`V_Stock = V_Opening + V_Inputs - FoldByRef(V_ProductRef^Sale,V_Quantity^Sale) + V_Returns`.

No se escribe un segundo hecho `stock -= q`.

---

## 16. Trayectoria local sin JSON

Cada nodo posee una trayectoria append-only:

`Γ_n=(r_0,r_1,...,r_m)`.

`r_i` es una realización tipada por contratos ya reconocidos. No tiene que ser un objeto JSON.

Una realización compacta puede ser binaria o vectorial, por ejemplo conceptualmente:

`Assign = [opAssign, entityRef, parameterRef, encodedValue]`.

El contexto/contrato determina cómo decodificarla.

JSON puede existir únicamente como codec de depuración/exportación.

---

## 17. Posición local de trayectoria

En `Γ_n`, la posición `i` ya representa el orden local.

No debe repetirse dentro del payload si el Storage ya conserva inequívocamente la secuencia.

De la trayectoria pueden derivarse:

`RecordHash_n[i]=H(r_i)`

`PrefixHash_n[i]=H(PrefixHash_n[i-1] || i || RecordHash_n[i])`.

Posición localiza; hash verifica.

Hash no crea orden ni Authority.

---

## 18. Continuidad desde múltiples trayectorias

Evidencia disponible:

`E = ⨿ Γ_n`.

El coproducto conserva procedencia y orden local. No inventa orden total global.

Los nodos escriben propuestas/hechos en su trayectoria local.

Authority constituye cuáles pasan a formar parte de `C` y añade solo las relaciones causales/ordenadoras necesarias.

`C != Γ_A`

y:

`C != concatenación de Γ_n`.

Continuidad es la realidad causal constituida reconocible a partir de esas evidencias.

---

## 19. Authority sin duplicar el hecho

Para máxima simplicidad, una decisión de Authority debe referenciar la causa local, no copiar su contenido.

Ejemplo:

`q @ (node42,17)`

`Decision_A(ref=(node42,17), ACCEPT, constraints/order)`.

Si se acepta, C reconoce el hecho referenciado.

Si se rechaza, la propuesta sigue existiendo en Γ_node42 pero no constituye realidad de App.

Esto evita guardar dos veces la misma causa.

---

## 20. Flujo maestro de escritura

`Action`
` -> encode using current contracts`
` -> append proposal/fact to Γ_n`
` -> local coordinate (n,i)`
` -> Authority evaluates against C_h / 𝕍_h`
` -> Decision_A(ref=(n,i), accept|reject, minimal causal relations)`
` -> C_h'`
` -> FoldVectorDelta(𝕍_h,ΔC)`
` -> 𝕍_h'`
` -> project UI`.

Ni JSON ni una tabla relacional participan en la semántica del flujo.

---

## 21. Flujo maestro de lectura

`local trajectory evidence`
` -> verify material/prefix`
` -> recognize Authority decisions`
` -> reconstruct C_h`
` -> fold to 𝕍_h`
` -> answer from vectors`
` -> project only requested representation`.

Normalmente la App consulta `𝕍_h`, no recorre C completa en cada interacción.

---

## 22. Local-first

Creación:

`action -> Γ_n(local) -> pending/outbox`.

Recepción:

`network -> verify -> persist local trajectory evidence -> reconstruct/advance C -> advance 𝕍`.

Regla:

**La red transporta evidencia; el nodo interpreta desde evidencia persistida localmente.**

---

## 23. Incrementalidad

Replay completo:

`𝕍_h=FoldVectors(C_h)`.

Delta:

`𝕍_h'=FoldVectorDelta(𝕍_h,ΔC)`.

Ley:

`FoldVectorDelta(FoldVectors(C_h),ΔC)=FoldVectors(C_h')`.

Para un Assign normal, el delta puede tocar una sola coordenada de un solo vector más sus dependencias derivadas.

---

## 24. Qué se puede cachear

Por rendimiento pueden persistirse:

`𝕍_h`, mapas `identity->position`, índices de búsqueda, snapshots, JSON, SQLite, tablas, bitmaps.

Todos son borrables si su procedencia/corte es conocido.

`DerivedCache != CausalAuthority`.

---

## 25. Estado operacional vs historia

`C_h` conserva historia/semántica causal.

`𝕍_h` conserva la actualidad operacional derivada.

Regla central:

**La continuidad conserva significado y causas; los vectores conservan operacionalmente la actualidad; las demás estructuras son vistas.**

---

## 26. Flujo mínimo para la primera probeta

1. `DefineEntity(Product)`.
2. `DefineParameter(Name,Product,Text,Assignment)`.
3. `DefineParameter(Price,Product,FixedPoint,Assignment)`.
4. `AdmitEntity(Product,P0)`.
5. `Assign(P0,Name,'Camisa')`.
6. `Assign(P0,Price,50000)`.
7. comprobar `S_Product=[P0]`.
8. comprobar `V_Name=['Camisa']`.
9. comprobar `V_Price=[50000]`.
10. derivar Table y JSON y verificar que al borrarlos se reconstruyen iguales.

Después:

11. añadir P1 y comprobar extensión por coordenada.
12. añadir un parámetro nuevo y comprobar que no se reescribe ninguna entidad.
13. añadir Invariant Price/Discount.
14. añadir Sale + Stock FoldByRef.
15. repetir con dos nodos y Authority para comprobar mapeo local->continuidad.

---

## 27. Criterios de falsación

El diseño falla si:

- crear una entidad exige schema JSON;
- añadir un parámetro obliga a reescribir elementos antiguos;
- crear un elemento obliga a escribir `null` para todos los parámetros;
- JSON/SQL se vuelve necesario para interpretar C;
- una posición local se usa globalmente sin contexto;
- Authority copia causas cuando basta referenciarlas;
- el stock se escribe además de la venta que lo determina;
- borrar una materialización derivada impide reconstruir la actualidad.

---

## 28. Fórmula canónica

`⊔ Γ_n`
`  -> Authority + causal relations`
`  -> C_h`
`  -> FoldVectors`
`  -> 𝕍_h`
`  -> Projection_X`
`  -> X`.

Donde X puede ser JSON, SQL, Table, UI, API, Catalog, SearchIndex o Snapshot.

**JSON deja de ser arquitectura y vuelve a ser lo que siempre debió ser: una representación opcional.**

---

## 29. Precisión prioritaria — la trayectoria constituye coordenadas

Esta regla tiene prioridad conceptual y debe repetirse deliberadamente:

[
\boxed{\text{la trayectoria/continuidad constituida genera coordenadas}}
]

No tomamos objetos tradicionales y luego los convertimos a vectores por optimización.

El flujo correcto es:

[
\boxed{
\text{constitución}
\rightarrow
\text{posición estable}
\rightarrow
\text{vectores}
\rightarrow
\text{representaciones}
}
]

En una trayectoria local:

[
\Gamma_n=(r_0,r_1,\ldots,r_m)
]

la posición (i) ya expresa orden local. No es metadata decorativa.

En una entidad (K), las admisiones constituidas producen:

[
S_K=[E_0,E_1,\ldots,E_n]
]

y:

[
pos_K(E_i)=i.
]

Los parámetros reutilizan esas coordenadas:

[
V_A[i]=CurrentValue(S_K[i],A).
]

Por tanto, no hay que repetir la identidad (E_i) en cada valor cuando la base/corte están fijados.

La precisión sobre autoridad es:

[
\boxed{
\text{Authority legitima la incorporación;}
\quad
\text{el orden constitutivo produce la coordenada.}
}
]

La posición sola no concede Authority, pero una vez constituido el hecho su posición es parte de la información estructural.

## 30. Representación real vs representaciones derivadas

La geometría operacional natural es:

[
\boxed{
\text{bases ordenadas} + \text{vectores alineados}
}
]

y no un conjunto de objetos JSON.

El estado operacional:

[
\mathbb V_h=(\{S_K\},\{P_K\},\{V_A\},R_h).
]

Después:

[
\mathbb V_h\rightarrow JSON
]

[
\mathbb V_h\rightarrow Table
]

[
\mathbb V_h\rightarrow SQL
]

[
\mathbb V_h\rightarrow UI/API/Catalog/Index.
]

Por tanto:

**JSON no es una estructura intermedia obligatoria.**

**JSON es una serialización opcional de una sección vectorial.**

Regla de no-regresión:

> Si una implementación empieza a tratar JSON, una tabla SQL o un objeto de dominio como la representación soberana, volver a (C_h\rightarrow\mathbb V_h\rightarrow Projection).
