# Kobalt Comercio — especificación conceptual canónica

**Fecha:** 2026-11-22
**Estado:** documento canónico vigente para terminología, mecanismos, flujos e implicaciones. Debe leerse antes que la historia de investigación.

---

## 0. Propósito

Este documento fija un vocabulario estable y una arquitectura conceptual completa para Comercio.

Objetivo central:

> Persistir únicamente causas, definiciones y relaciones irreducibles; permitir que posiciones, tablas, vectores, matrices, JSON, bases de datos, índices y UIs emerjan como consecuencias deterministas y materializaciones reconstruibles.

Frase guía:

**No se almacena una estructura porque resulte cómoda si esa estructura ya es consecuencia del recorrido de la continuidad.**

---

## 1. Vocabulario estricto

### 1.1 Registro material

Un registro material es un átomo físico verificable, por ejemplo Khipu K5.1.

`K5.1 = [T16][W8][LEN_k][BODY_L][HASH256][PAD0]`

Responsabilidad:

- delimitar bytes;
- reconocer codec material;
- verificar integridad/coherencia exacta.

No significa por sí mismo Product, Sale, Authority ni Continuity.

### 1.2 Hecho semántico

Es el significado obtenido al interpretar un registro material bajo un contrato ya reconocido.

`SemanticFact = Decode(Contract, MaterialRecord)`

### 1.3 Hecho constitutivo

Es un hecho semántico reconocido por la autoridad/contrato correspondiente como parte de la realidad compartida.

`ConstitutiveFact ⊆ SemanticFact`

### 1.4 Trayectoria nodal

`Gamma_n` es la historia lineal, append-only, single-writer y offline-native de un nodo.

Responde:

> ¿Qué hizo, propuso, recibió o incorporó este nodo y en qué orden local?

No es la continuidad.

### 1.5 Coproducto

`L = coproduct_n Gamma_n`

Reúne evidencia de múltiples trayectorias preservando procedencia y órdenes locales.

No decide, no admite, no rechaza y no inventa un orden global.

### 1.6 Continuidad

`C` es la estructura causal y constitutiva compartida.

Contiene o hace alcanzables:

- contratos reconocidos;
- hechos constitutivos;
- referencias exactas necesarias;
- relaciones causales;
- relaciones de autoridad;
- relaciones de orden solo donde tengan significado.

`C != GlobalLog`

La continuidad puede ser parcialmente ordenada.

### 1.7 Corte

`C_h` es una visión/corte reconocido de continuidad suficiente para evaluar o reconstruir hasta cierto punto.

### 1.8 Clase de entidad

`K` identifica una clase reconocida, por ejemplo Product o Sale.

### 1.9 Admisión constitutiva de entidad

`Admit_K(E)` es el hecho constitutivo que reconoce que la identidad E pertenece a la clase K dentro de esa continuidad.

No contiene por necesidad una posición.

### 1.10 Orden constitutivo de una clase

Para algunas clases necesitamos coordenadas estables. En ese caso la continuidad debe inducir un orden canónico sobre sus admisiones:

`prec_K` sobre `{ Admit_K(E) }`.

Este orden:

- pertenece a la semántica constitutiva de C;
- no es el orden de llegada por red;
- no es el orden de enumeración del filesystem;
- no es una tabla externa;
- puede materializarse como una cadena/trayectoria semántica específica;
- debe ser suficiente para que cualquier lector correcto obtenga la misma secuencia.

### 1.11 Secuencia constitutiva derivada

Ordenando las admisiones de K por `prec_K` obtenemos:

`S_K(C_h) = (E_0,E_1,...,E_m)`.

Esta secuencia es derivada de C.

### 1.12 Posición

`pos_K(E_i)=i`.

**La posición es una consecuencia de `S_K`, no un hecho declarado.**

### 1.13 Tabla

`T_K` es una materialización útil de `S_K` y sus índices.

Puede contener:

- vector slot→identity;
- mapa identity→slot;
- longitud;
- índices auxiliares.

**La tabla no produce el slot. La tabla materializa una posición que ya es consecuencia del orden constitutivo.**

### 1.14 Parámetro

Un parámetro es una dimensión semántica reconocida aplicable a una clase de entidad.

`A : K ⇀ D_A`

### 1.15 Vector

Un vector es una materialización/proyección de un parámetro sobre la secuencia de entidades:

`V_A[i] = CurrentValue(E_i,A)`.

### 1.16 Materialización

`M_h = Project(C_h)`

Es cualquier estado derivado guardado para consulta rápida: tablas, vectores, matrices, índices, snapshots, JSON cache, SQLite, etc.

Materialización exacta no significa autoridad causal.

---

## 2. Axioma fundamental: la posición es consecuencia

Forma canónica:

`Position = Consequence(ConstitutiveOrder)`

Repetición deliberada:

**La posición es consecuencia, no hecho.**

**La continuidad constituye una identidad dentro de un orden canónico de admisiones; el recorrido deriva su posición.**

**No se escribe `slot=i`; se escribe la causa constitutiva que hace inevitable que el índice sea i.**

**La atomicidad protege el avance del orden constitutivo, no una segunda escritura redundante del slot.**

**La tabla es posterior: materializa la secuencia derivada y puede guardar el slot como cache, no como verdad independiente.**

### 2.1 Ejemplo

Si C induce para Product:

`Admit(P_A) prec_Product Admit(P_B) prec_Product Admit(P_C)`

entonces:

`S_Product(C_h)=(P_A,P_B,P_C)`

y:

`pos_Product(P_C)=2`.

No existe necesidad de persistir `slot=2` en `Admit(P_C)`.

### 2.2 Condición de canonicidad

Para una misma continuidad/corte y los mismos contratos:

`same C_h => same S_K(C_h) => same pos_K(E)`.

Si dos lectores correctos pueden obtener posiciones diferentes, entonces la continuidad aún no contiene suficiente relación constitutiva para producir coordenadas canónicas.

### 2.3 No circularidad

Incorrecto:

`slot emerge del orden de la tabla`.

Correcto:

`continuidad -> orden constitutivo de admisiones -> secuencia derivada -> posición -> tabla materializada`.

---

## 3. Autocontención

La continuidad debe ser autocontenida en sentido causal y semántico:

`Meaning(C)=Interpret(Closure(Roots(C)))`.

Esto significa que al recorrer la clausura de referencias reconocidas debe poder descubrirse todo lo necesario para interpretar su propia evolución:

- contratos;
- clases de entidad;
- definiciones de parámetros;
- relaciones;
- admisiones;
- órdenes constitutivos necesarios;
- hechos de negocio;
- material exacto referenciado.

Autocontenida no significa monolítica.

Los bytes pueden residir en múltiples storages. Lo prohibido es que una semántica mutable imprescindible solo exista en una DB o código externo no referenciado.

---

## 4. App

Definición:

`App = Genesis + InitialContracts + InitialCapabilities`.

Una App es una continuidad inicialmente preparada con una gramática capaz de reconocer y constituir ciertas clases de realidad.

Para CommerceApp inicialmente queremos, como mínimo:

- Product;
- Sale;
- ParameterDefinition;
- RelationDefinition;
- EntityRequest;
- Assignment/VectorPatchProposal;
- AuthorityResponse;
- SaleRequest;
- SaleAdmission;
- InventoryMovement.

Al habilitar CommerceApp para un comercio se crea/accede a una continuidad propia:

`CommerceApp -> C_Tenant^0`.

Por eso:

`AppBase != TenantContinuity`

y:

`AppBase != FinalSchema`.

---

## 5. Multi-tenant

Una misma App puede originar:

`C_A, C_B, C_C, ...`

Cada continuidad posee:

- su propia historia;
- autoridad reconocida;
- entidades;
- parámetros custom;
- relaciones propias;
- materializaciones.

El tenant puede ser la propia continuidad, no una columna global repetida en cada registro.

---

## 6. Entidad mínima

Principio:

`Entity = Identity`.

Los atributos no son parte necesaria de la identidad.

Crear localmente una entidad significa primero producir una identidad y registrar una propuesta en `Gamma_n`.

Constituirla significa que la autoridad reconoce esa identidad como miembro de una clase K dentro de C.

Solo después, si K posee orden constitutivo canónico, su posición puede derivarse.

---

## 7. Parámetros y estructura emergente

Los atributos son dimensiones independientes.

Para Product:

`SKU, Name, Price, SalePrice, Material, ...`

pueden existir como ParameterDefinitions.

Un producto observado es:

`View(P_i)={ (A,V_A[i]) | existe valor }`.

El objeto Product completo no necesita existir como estructura primaria.

Su forma emerge al consultar una coordenada a través de las dimensiones reconocidas.

---

## 8. Definition precedes Use

Ley general:

`Definition(x) prec Use(x)`.

Ejemplos:

`Define(Material) prec Set(P,Material,Algodon)`

`Admit(Product P) prec Admit(Sale referring P)`.

Un nodo offline puede registrar ambas propuestas localmente si preserva la dependencia; autoridad las resolverá causalmente al reconectar.

---

## 9. Customización

Customizar un comercio es extender su continuidad.

Ejemplo offline:

`ParameterRequest(Material)`

`ProductRequest(P)`

`Assign(P,Material,Algodon)`.

Cuando vuelve red:

1. autoridad evalúa Material;
2. si se constituye, Material entra en el vocabulario compartido;
3. luego puede evaluarse Product;
4. luego Assignment dependiente.

Una customización no necesita ALTER TABLE.

Produce nueva semántica y después nuevas proyecciones.

---

## 10. Relaciones entre parámetros

Los parámetros pueden definir un espacio admisible.

Ejemplo:

`SalePrice <= Price`.

Dadas transformaciones propuestas F sobre un estado S, clasificamos:

`Independent | Sequenciable(order) | AtomicBatch | Conflict(alternatives) | Invalid`.

Ejemplo desde `(Price=100,SalePrice=80)` hacia `(70,60)`:

`SalePrice:=60` debe preceder `Price:=70` para mantener todos los estados intermedios admisibles.

La relación matemática puede inducir causalidad mínima necesaria.

---

## 11. Autoridad

Ley de colocación:

`Place(F)=primer punto con información suficiente + capacidad legítima de producir el efecto`.

Ejemplo duplicados:

`SameSKU + SimilarAttributes => probableSameProduct`

pertenece a autoridad, porque un nodo aislado no dispone necesariamente de evidencia global ni capacidad de decidir identidad comercial.

La complejidad de autoridad no debe propagarse a nodos.

---

## 12. Autoridad bidireccional

`Resolve_A(q,C_h) -> (rho_q,DeltaC)`.

`rho_q` responde al nodo originador.

`DeltaC` es la transformación opcional de continuidad.

Una solicitud rechazada puede producir:

`rho_q=Rejected(...)`

y:

`DeltaC=empty`.

El nodo incorpora la respuesta en su propia trayectoria y puede reconstruir offline qué pasó.

---

## 13. Local y red

Regla:

`Network -> Verify -> PersistLocal -> InterpretLocal`.

La red transporta evidencia. La interpretación se hace desde el ámbito local reconocido.

También la autoridad sigue esta regla.

Local no significa necesariamente navegador; significa el ámbito de evidencia desde donde el componente interpreta.

---

## 14. Atomicidad

### 14.1 Material

K5.1 permite verificar que un átomo leído coincide con su declaración exacta.

### 14.2 Lógica

Se requiere cuando separar Check de Commit puede producir una realidad imposible.

### 14.3 Física

Es la propiedad concreta del storage/protocolo que realiza la atomicidad lógica.

### 14.4 Para posiciones

No hacemos:

`assign slot i`.

Hacemos conceptualmente:

`CheckHead(ConstitutiveOrder_K,h) + Append(Admit_K(E))`

como transición atómica.

Después:

`pos_K(E)=index(S_K(C_h'))`.

**Atomicidad de append -> unicidad de posición derivada.**

---

## 15. Productos

### 15.1 Local

`ProductId -> ProductRequest -> proposed assignments -> Gamma_n`.

No existe aún posición compartida.

### 15.2 Autoridad

Evalúa contratos, reglas de dominio y dependencias.

Si admite:

`Admit_Product(P)`

se incorpora al orden constitutivo canónico de Product.

### 15.3 Recorrido

Al reconstruir ese orden:

`S_Product=(P_0,...,P_i)`

entonces:

`pos_Product(P_i)=i`.

### 15.4 Parámetros

Assignments/patches posteriores actualizan dimensiones como Price, Name, Material.

---

## 16. Ventas

Una venta nace localmente:

`SaleRequest(S,ProductRef,Quantity)`.

Autoridad valida:

- producto constituido;
- estado habilitado;
- cantidad válida;
- stock suficiente;
- conflictos concurrentes.

Si se admite, se constituye SaleAdmitted.

Si las ventas necesitan coordenadas estables, la misma doctrina aplica: el orden constitutivo de las admisiones Sale produce la secuencia y sus posiciones.

---

## 17. Stock

Stock es un vector derivado, no una celda soberana.

`V_Stock = Fold(InventoryMovements, SaleAdmitted, Returns, Adjustments, ...)`.

Una venta no escribe directamente `Stock:=Stock-1` como verdad primaria.

Constituye una causa; la proyección recalcula.

---

## 18. Vectores

Para parámetro A sobre clase K:

`V_A^h[i]=CurrentValue_h(S_K(C_h)[i],A)`.

El índice i tiene significado porque `S_K(C_h)` ya fue derivada canónicamente.

Los vectores pueden ser:

- densos;
- dispersos;
- bitmaps;
- pools de strings + offsets;
- referencias hash;
- otros codecs.

Semántica y representación permanecen separadas.

---

## 19. Materializaciones incrementales

Una vez recorrido C hasta h:

`M_h=Project(C_h)`.

Puede contener:

- `S_K`/tablas materializadas;
- identity→position;
- vectores;
- índices;
- snapshots;
- estructuras auxiliares.

Si C avanza:

`M_h' = FoldDelta(M_h,DeltaC_h->h')`.

No es necesario replegar toda la historia.

Condiciones:

- snapshot ligado al corte h;
- continuidad causal desde h;
- verificación de nuevos registros;
- estabilidad de posiciones históricas.

---

## 20. Tabla derivada

En este documento `tabla` significa una materialización del espacio de coordenadas ya derivado.

No significa un objeto primario dentro de C.

Para Product:

`T_Product = Materialize(S_Product)`.

Puede guardarse en local/servidor para lectura rápida.

Si se borra:

`T_Product = Derive(C_h)`

otra vez.

---

## 21. JSON, DB, matrices y APIs

Son proyecciones.

JSON vertical de producto i:

`JSON(P_i,Q)=Format_Q(id=P_i,{A:V_A[i] para A en Q})`.

Matriz densa:

`M[j,i]=V_Aj[i]` si existe valor, y una convención como null si la exportación lo exige.

SQLite, CSV, PostgreSQL, APIs o UI pueden materializar la misma continuidad de formas diferentes.

Ninguna forma derivada se convierte automáticamente en autoridad.

---

## 22. Catálogo

El catálogo necesita solo las proyecciones que consume, por ejemplo:

`Name, Price, SalePrice, Images, Enabled, Stock`.

Lee materializaciones locales.

No necesita recorrer toda la continuidad para cada render.

Su estado preferente puede ser `M_h`, siempre ligado a h.

---

## 23. POS

El POS:

- lee productos/stock desde materializaciones locales;
- crea SaleRequest local;
- publica cuando hay red;
- incorpora AuthorityResponse;
- no decide reglas globales;
- no modifica stock directamente.

---

## 24. UI metaestructural

Una UI general puede preguntar a C:

- EntityKinds;
- ParameterDefinitions;
- RelationDefinitions;
- órdenes constitutivos/coordenadas disponibles;
- tablas/materializaciones;
- contratos;
- estado actual.

Puede permitir:

- proponer parámetro;
- proponer relación;
- crear producto;
- crear venta;
- inspeccionar materializaciones.

La UI propone; autoridad constituye.

---

## 25. Método canónico de diseño

Para cada nueva funcionalidad:

1. ¿qué identidad nace?;
2. ¿qué hecho/propuesta nace localmente?;
3. ¿qué contrato la interpreta?;
4. ¿qué definiciones deben preceder su uso?;
5. ¿qué clase de entidad toca?;
6. ¿necesita esa clase coordenadas estables?;
7. si sí, ¿qué orden constitutivo dentro de C las hace canónicas?;
8. ¿qué parámetros/vectores toca?;
9. ¿qué relaciones/invariantes existen?;
10. ¿las transformaciones son independientes, secuenciables, atómicas, conflictivas o inválidas?;
11. ¿dónde existe información suficiente para decidir?;
12. ¿qué responde autoridad al nodo?;
13. ¿qué entra realmente en C?;
14. ¿qué posiciones emergen del recorrido?;
15. ¿qué materializaciones pueden guardarse?;
16. ¿qué vista necesita la UI?;
17. ¿qué puede borrarse y reconstruirse?

---

## 26. Reglas de lenguaje para evitar confusión

Usar:

- `orden constitutivo de las admisiones Product dentro de C`;
- `secuencia Product derivada del orden constitutivo`;
- `posición derivada`;
- `tabla Product materializada`;
- `vector Price proyectado sobre posiciones Product`.

Evitar:

- `la tabla asigna slots`;
- `la autoridad guarda el slot`;
- `el orden de la tabla crea la posición`;
- `la DB contiene la verdad`;
- `el JSON es el producto`.

---

## 27. Ecuaciones canónicas

`App = Genesis(Contracts)`

`C = ConstitutiveClosure(...)`

`A_K(C_h) = {admisiones constitutivas de K}`

`prec_K = orden constitutivo canónico inducido por C`

`S_K(C_h) = sort(A_K(C_h),prec_K)`

`pos_K(E)=index(E,S_K(C_h))`

`T_K = Materialize(S_K)`

`V_A[i]=CurrentValue(S_K[i],A)`

`M_h=Project(C_h)`

`M_h'=FoldDelta(M_h,DeltaC)`

`UI=Query(M_h)`

`UI -> LocalProposal -> Authority -> (Response,DeltaC)`

---

## 28. Síntesis final

**La continuidad es la causa.**

**El orden constitutivo específico de una clase, cuando existe, es parte de la semántica de esa continuidad.**

**La secuencia de entidades emerge de ese orden.**

**La posición emerge de la secuencia.**

**La tabla materializa la secuencia y sus posiciones.**

**Los vectores usan esas posiciones estables.**

**Los snapshots guardan tablas y vectores para evitar reprocesar historia.**

**JSON, matrices, DB y UIs son consultas/materializaciones sobre esas estructuras derivadas.**

Y la frase que debe permanecer visible:

> **No se escribe la posición. Se constituye el orden que la hace inevitable.**