# Continuity Core — Especificación conceptual consolidada

**Fecha:** 2026-11-22
**Estado:** versión conceptual consolidada; fuente canónica de la línea principal.

## 0. Propósito

Continuity Core define cómo una App reconstruye y evoluciona su propia realidad a partir de una continuidad autocontenida.

Su pregunta central es:

`Dada C_h, ¿qué lenguaje, estado y materializaciones emergen; y qué transformaciones pueden constituirse sin romper sus contratos?`

Continuity Core no es login, Dashboard, Storage, red, UI de negocio ni una base de datos.

---

## 1. Frontera del Core

Flujo externo:

`Genesis -> DashboardShell -> UserDashboardConfig -> EnabledApps -> AppSelection | C_app -> ContinuityCore -> M_h -> AppUI`

La barra marca la frontera.

Continuity Core comienza cuando ya tenemos la continuidad específica de una App:

`ContinuityCore(C_app)`.

Quedan fuera del Core:

- login/Génesis;
- navegación de Dashboard;
- theme;
- listado de Apps;
- Storage UI;
- vocabulario específico de Commerce.

---

## 2. Una sola continuidad autocontenida por App

Una App concreta usa inicialmente una sola continuidad:

`C_app`.

En ella conviven:

- metahechos: definiciones de entidades, parámetros, relaciones y contratos;
- hechos de dominio: admisiones, assignments y eventos.

No se separan schema y datos por defecto.

Regla:

**Una continuidad por realidad que necesita evolución causal independiente.**

---

## 3. Reconstrucción simultánea de lenguaje y estado

Al recorrer un corte `C_h` reconstruimos:

`(K_h,S_h)`

donde:

- `K_h` = metaestado vigente;
- `S_h` = estado de dominio vigente.

`K_h` contiene, entre otras cosas:

- EntityKinds;
- ParameterDefinitions;
- RelationDefinitions;
- contratos/folds disponibles.

`S_h` contiene:

- elementos admitidos;
- assignments/eventos reconocidos;
- valores actuales derivados;
- consecuencias actuales.

Cada hecho aplica:

`(K_i,S_i)=Step(K_(i-1),S_(i-1),r_i)`.

Frase canónica:

**Al recorrer la continuidad reconstruimos a la vez los datos y el lenguaje con el que los datos siguientes pueden interpretarse.**

---

## 4. Bootstrap mínimo

No existe interpretación desde cero absoluto.

El runtime necesita un bootstrap pequeño y estable capaz de:

1. delimitar/verificar material;
2. reconocer raíces/referencias;
3. interpretar el metalenguaje de definiciones;
4. aplicar causalidad/recorrido general.

`BootstrapKernel << AppSemantics`.

El bootstrap no conoce Product, Sale, Price o Task.

---

## 5. Hechos causales mínimos

Biblioteca inicial:

`DefineEntity`
`DefineParameter`
`DefineRelation`
`AdmitEntity`
`Assign`

y, cuando una semántica lo exija:

`AdmitEvent`.

Lecturas/proyecciones no constituyen hechos.

---

## 6. Entidades

Definición:

**Un tipo de entidad es una clase creciente de elementos identificables sobre los que pueden definirse parámetros.**

Ejemplo:

`DefineEntity(K_product,label='Producto')`.

Identidad y etiqueta son distintas:

`Identity(K) != Label(K)`.

Renombrar Producto→Artículo no cambia la entidad.

---

## 7. Admisión y posiciones

Para una clase `K`: 

`A_K(C_h)=admisiones constitutivas de K visibles en h`.

Sea `prec_K` el orden constitutivo canónico requerido para K.

`S_K(C_h)=sort(A_K(C_h),prec_K)`.

`pos_K(E)=index(E,S_K)`.

Leyes:

**La posición es consecuencia, no hecho.**

**No se escribe el slot; se constituye el orden que lo hace inevitable.**

La tabla física es posterior:

`T_K=Materialize(S_K)`.

---

## 8. Parámetros

Definición:

**Un parámetro es una dimensión definida sobre los elementos de una entidad.**

`A:K partial-> D_A`.

Definición conceptual mínima:

`ParameterDefinition=(id,host,valueType,evolution)`.

Relaciones y hints de UI/representación se mantienen separados.

---

## 9. Tipos de valor iniciales

Biblioteca base:

`Text`
`Boolean`
`Integer`
`FixedPoint(scale)`
`Enum(options)`
`DateTime`
`Reference(TargetKind)`
`BlobReference`
`Set(T)`
`List(T)`.

Defaults razonables:

`absence=bottom`
`cardinality=0..1` cuando aplique
`representation=Auto`.

`bottom != 0 != false != ''` salvo contrato explícito.

---

## 10. Evolución de un parámetro

Separar valor de causalidad:

`ParameterSemantics != EvolutionSemantics != VectorCodec`.

Familias iniciales:

### Assignment

`Current_A(E)=LatestAuthorizedAssignment(E,A)`.

Ejemplos: Name, Price, Enabled.

### Fold

`Current_A(E)=Fold(events_E)`.

Ejemplos: Balance, Stock.

### Derived

`Current_A(E)=f(C_h,E)`.

Ejemplos: EffectivePrice.

### State

`State_(h+1)=Transition(State_h,event)`.

Ejemplos: OrderStatus.

Regla:

`CommonVectorInterface != CommonCausality`.

---

## 11. Vectores lógicos

Dado `S_K=(E_0,E_1,...,E_n)`: 

`V_A^h[i]=CurrentValue_h(S_K[i],A)`.

Por tanto:

**Definir un parámetro induce un vector lógico.**

No obliga a almacenar un array físico.

Ejemplo:

`S_Product=(P0,P1,P2)`
`V_Price=[50000,120000,80000]`.

Si se define luego Color:

`V_Color=[bottom,bottom,bottom]`

sin reescribir P0/P1/P2.

---

## 12. Schema como proyección

No existe un `schema.json` soberano.

`Schema_h=Project_definitions(C_h)`.

El schema es la proyección vigente de definiciones constituidas.

Frase:

**La estructura también es historia.**

---

## 13. Relaciones

No existe una sola bolsa vaga llamada Relation.

Familias iniciales:

### Reference

Conecta un parámetro con una entidad objetivo.

`ProductRef:Sale->Product`.

### Invariant

Restringe combinaciones de valores actuales.

`DiscountPrice=bottom OR 0<=DiscountPrice<=Price`.

### Derivation

Define una consecuencia reproducible.

`Stock <- Sales + InventoryMovements + Returns`.

### AdmissionGuard

Condición que debe cumplirse antes de constituir un hecho.

`CanAdmitSale(s,C_h) iff Stock_h(ProductRef(s)) >= Quantity(s)`.

---

## 14. Resolución de transformaciones

Una colección de transformaciones se clasifica como:

`Independent`
`Sequenciable(order)`
`AtomicBatch`
`Conflict(alternatives)`
`Invalid`.

Regla:

**Solo imponer el mínimo orden necesario para mantener invariantes.**

Ejemplo precio/descuento:

Estado inicial:

`Price=100, Discount=80`.

Objetivo:

`Price=70, Discount=60`.

Price primero sería inválido; Discount primero preserva el invariante.

Resultado:

`Sequenciable(Discount -> Price)`.

No existe un handler específico de precios.

---

## 15. Venta y stock

Venta es una causa:

`Sale(ProductRef,Quantity)`.

Stock es una consecuencia:

`Stock_h(P)=Opening(P)+Inputs_h(P)-Outputs_h(P)-Sales_h(P)+Returns_h(P)`.

Una venta admitida cambia el conjunto causal observado por el fold.

No se hace una segunda escritura soberana `stock -= q`.

Regla:

**Persistir causas irreducibles; derivar consecuencias reproducibles.**

---

## 16. Guarda y atomicidad de venta

Antes de admitir:

`Stock_h(P)>=Quantity(s)`.

Authority protege como unidad lógica:

`CheckCurrentStock + AdmitSale`.

Si Stock=1 y llegan dos ventas de 1, ambas no pueden constituirse desde el mismo estado observado.

La atomicidad protege la admisión causal/CAS, no una celda Stock.

---

## 17. Autoridad y propuestas

Los nodos pueden crear propuestas localmente.

`UI -> LocalProposal -> Authority_C -> DeltaC | Rejection`.

Definición práctica:

**Authority_C es la capacidad reconocida de constituir extensiones de C.**

Separaciones:

`WriteLocal != MayPropose != MayConstitute != CanPutBytes`.

La respuesta a una propuesta puede ser durable aunque no produzca `DeltaC`.

---

## 18. Flujo de creación de entidad

`UI: Crear entidad 'Producto'`
` -> LocalProposal DefineEntity(K,label)`
` -> Authority valida`
` -> constituye DeltaC`
` -> FoldDelta`
` -> K_h' contiene K`
` -> UI proyecta 'Producto · 0 elementos · 0 parámetros'`.

---

## 19. Flujo de creación de parámetro

`UI: Añadir Precio : FixedPoint(2)`
` -> DefineParameter(A,host=Product,valueType=FixedPoint(2),evolution=Assignment)`
` -> Authority`
` -> DeltaC`
` -> K_h' reconoce A`
` -> V_A lógico aparece sobre S_Product`.

Si ya existen tres productos:

`V_A=[bottom,bottom,bottom]`.

---

## 20. Flujo de creación de elemento

`UI: Nuevo Producto`
` -> AdmitEntity(Product,P0)`
` -> Authority`
` -> DeltaC`
` -> S_Product'`
` -> pos_Product(P0) deriva automáticamente`.

Los valores del formulario producen assignments separados:

`Assign(P0,Name,'Camisa')`
`Assign(P0,Price,50000)`.

---

## 21. Flujo de cambio de valor

`UI: Price(P0)=60000`
` -> Proposal Assign(P0,Price,60000)`
` -> validar existencia de Product/P0/Price`
` -> validar ValueType`
` -> evaluar Relations/Invariant/Guards aplicables`
` -> Authority`
` -> DeltaC`
` -> FoldDelta`
` -> V_Price actualizado`.

---

## 22. Flujo de definición de relación

`UI/metaeditor -> DefineRelation(R, refs, semantics)`
` -> Authority`
` -> DeltaC`
` -> K_h' incorpora R`.

A partir de ese corte, nuevas transformaciones sujetas a R deben respetarla.

---

## 23. UI derivada

Metáfora humana:

`Entidad ~= tabla`
`Elemento ~= fila`
`Parámetro ~= columna`
`Valor ~= celda`.

Pero la tabla es una vista.

`ParameterDefinitions -> default FormUI`.

`ParameterDefinitions + LogicalVectors -> TableUI`.

`ParameterSemantic != Widget`.

Una UI puede cambiar checkbox por switch sin alterar continuidad.

---

## 24. API conceptual mínima

`CreateEntity(label)`
`AddParameter(entity,type,label)`
`CreateElement(entity)`
`SetValue(element,parameter,value)`
`ReadEntity(entity)`.

Equivalencia:

`CreateEntity -> DefineEntity`
`AddParameter -> DefineParameter`
`CreateElement -> AdmitEntity`
`SetValue -> Assign`
`ReadEntity -> Project`.

**5 operaciones UI = 4 causas + 1 proyección.**

---

## 25. Materialización

`M_h=Project(C_h)` puede contener:

- S_K;
- identity->position;
- vectores lógicos/materializados;
- índices;
- tablas/matrices;
- snapshots;
- JSON/SQLite u otras vistas.

`DerivedCache != CausalAuthority`.

`LogicalVector != PhysicalVector`.

Perfiles físicos posibles:

`dense | sparse | bitmap | fixed-width | dictionary | blob refs`.

---

## 26. Incrementalidad

Full replay:

`M_h=Project(C_h)`.

Actualización:

`M_h'=FoldDelta(M_h,DeltaC)`.

Ley obligatoria:

`FoldDelta(Project(C_h),DeltaC)==Project(C_h')`.

Snapshots son optimizaciones derivadas ligadas a un corte/head.

---

## 27. Determinismo

Para mismo bootstrap/contratos y mismo `C_h`: 

`same C_h -> same K_h`
`same C_h -> same S_K`
`same C_h -> same positions`
`same C_h -> same logical vectors`.

El orden físico de Storage no debe cambiar la semántica.

---

## 28. Local-first

`Local(X)` es la evidencia reconocida desde la que X interpreta.

Entrada de red:

`receive -> verify -> persist local -> interpret/query local`.

Salida:

`propose/constitute local -> persist -> pending publication -> transmit/confirm`.

Regla:

**La red incorpora o comunica evidencia; la interpretación ocurre desde evidencia local reconocida.**

---

## 29. Source, Storage y verificación

`Source(Name)->candidate materials`.

`Storage` retiene bytes.

`Verification` comprueba materialidad/contexto.

`Authority` determina constitución.

Separaciones:

`MaterialValid != Authorized != Current`.

`CanPutBytes != Authority`.

Una Source corrupta puede afectar disponibilidad o entregar candidatos rechazables sin adquirir poder semántico.

---

## 30. Audience, Projection y View

La continuidad fuente de una App normalmente usa la audiencia mínima necesaria.

Política preferida cuando no existe finalidad pública positiva:

`C_app -> Keyed(d_domain)`.

Audiencias externas reciben derivados:

`D_a=Projection_a(C_app)`.

Después:

`Audience=Everyone -> Clear`.

`Audience=Group G -> Keyed(d_G)`.

Leyes:

`Projection = what exits`.
`View = who can evaluate/read it`.
`Authority = who can constitute source reality`.

**La privacidad conserva opciones; la publicidad consume opciones.**

---

## 31. Derivados

Ejemplo:

`C_commerce @ Keyed(d_commerce)`
` -> D_catalog @ Clear`
` -> D_affiliates @ Keyed(d_aff)`
` -> D_partner @ Keyed(d_partner)`.

Un derivado puede reducir granularidad:

`private Stock=17 + causes`
`network Stock=17`
`public Available=true`.

Una nueva audiencia no amplía automáticamente la audiencia de la fuente.

---

## 32. AppDefinition y Template

Una App concreta no necesita separar schema y datos.

Puede existir una continuidad de template únicamente si tiene identidad/evolución/audiencia propias:

`C_template -> C_instance`.

`AppDefinition != AppInstance`.

El template aporta contratos iniciales; la instancia continúa constituyendo extensiones.

---

## 33. Tres Apps de prueba

### Commerce

`Product(Name,Price,DiscountPrice,Enabled,Stock)`
`Sale(ProductRef,Quantity)`.

### Tasks

`Project(Name,Active)`
`Task(Title,Status,Priority,ProjectRef)`.

### Library

`Book(Title,Author,Available)`
`Loan(BookRef,Borrower,Date)`.

Las tres deben usar exactamente los mismos mecanismos del Core.

Criterio fuerte:

una cuarta App no prevista debe poder crearse sin modificar Continuity Core.

---

## 34. KOB2 como substrate, no semántica

Continuity Core mantiene semántica independiente.

Dos realizaciones experimentales:

`Clean/native substrate`
`KOB2-backed substrate`.

Prueba diferencial:

`same logical C -> same K_h,S_K,positions,vectors,relations,projections`.

KOB2 puede aportar framing, View, identidad, Envelope, Recognition, Resolution y Closure sin convertirse en la ontología de Product/Parameter/Relation.

---

## 35. Qué no debe entrar al Core

- reglas específicas llamadas PriceHandler/StockHandler;
- hardcode de Product/Sale;
- slots declarados como autoridad;
- schema externo mutable imprescindible;
- confianza en Storage;
- ACL como sustituto de Authority;
- UI widgets como semántica;
- codec físico como significado;
- una continuidad distinta por cada concepto sin autonomía causal.

---

## 36. Invariantes canónicos

1. `Meaning(C_h)=Interpret(Closure(Roots(C_h)))`.
2. `Schema_h=Project_definitions(C_h)`.
3. `Position=Consequence(ConstitutiveOrder)`.
4. `DefineParameter => LogicalVector`.
5. `ParameterSemantics != EvolutionSemantics != VectorCodec`.
6. `Definition/Admission precede Use`.
7. `Persist causes; derive reproducible consequences`.
8. `FullReplay == Snapshot+Delta`.
9. `MaterialValid != Authorized != Current`.
10. `View != Authority`.
11. `Storage != Authority`.
12. `NewAudience != ExpandSourceAudience` por defecto.
13. `UI -> Proposal -> Authority -> DeltaC -> Reconstruct`.
14. `Fact !=> Continuity`.
15. `One continuity per independently evolving causal reality`.

---

## 37. Flujo maestro

`C_app recognized locally`
` -> Interpret bootstrap`
` -> reconstruct K_h`
` -> reconstruct S_h`
` -> derive S_K/positions`
` -> derive parameter values`
` -> enforce relations`
` -> materialize vectors/indexes/tables M_h`
` -> project AppUI`

Para cambio:

`Human/App action`
` -> LocalProposal`
` -> semantic validation`
` -> relation/invariant resolution`
` -> Authority_C`
` -> DeltaC or rejection`
` -> persist local recognized evidence`
` -> FoldDelta`
` -> new M_h'`
` -> UI refresh`
` -> optional network publication`.

---

## 38. Próximas probetas

`P0 VectorLab` — entidad/parámetro/admisión/vector.

`P1 DefineEntity minimal contract`.

`P2 DefineParameter minimal contract`.

`P3 ValueTypes + Evolution families`.

`P4 Invariant sequencing: Discount<=Price`.

`P5 Sale->Stock: Derivation + AdmissionGuard + CAS`.

`P6 UI generation from definitions`.

`P7 Full replay vs snapshot+delta`.

`P8 Clean vs KOB2 differential semantics`.

---

## 39. Síntesis

**Continuity Core comienza con una continuidad específica de App y reconstruye desde ella tanto el lenguaje como el estado.**

**Entidades dan coordenadas; parámetros dan dimensiones; hechos dan historia; relaciones dan coherencia.**

**Las posiciones, vectores, tablas, formularios, índices y snapshots son consecuencias materializables, no nuevas fuentes de verdad.**

**La autoridad constituye causas; las proyecciones entregan consecuencias a cada audiencia; la View controla quién puede evaluar esa materialidad.**

**Primero demostrar la gramática general; después escribir el vocabulario de cada App.**

---

## 40. Geometría vectorial primaria

Precisión prioritaria incorporada después de la consolidación inicial:

**Continuity Core debe aprovechar la coordenada que la propia constitución histórica ya produce.**

No partimos de JSON/objetos para convertirlos a vectores. La dirección causal/operacional es:

[
\boxed{
\bigsqcup_n\Gamma_n
\rightarrow
C_h
\rightarrow
\mathbb V_h
\rightarrow
\{JSON,Table,SQL,UI,API,Catalog,Index,Snapshot\}
}
]

Para cada entidad:

[
S_K=[E_0,E_1,\ldots]
]

y cada parámetro:

[
V_A[i]=CurrentValue(S_K[i],A).
]

La posición no se escribe como atributo si el orden constitutivo la determina. La posición es información estructural.

La fuente causal sigue siendo (C_h), no el vector cacheado:

[
C_h\neq\mathbb V_h.
]

Pero la materialización operacional natural es vectorial:

[
\boxed{
\text{continuidad = causas/significado;}
\quad
\text{vectores = actualidad;}
\quad
\text{JSON/SQL/UI = vistas.}
}
]

Authority legitima incorporación; el orden constitutivo induce coordenadas. No confundir coordinate con Authority.
