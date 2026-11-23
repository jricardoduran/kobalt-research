# Continuidad autocontenida de una App

**Fecha:** 2026-11-22
**Estado:** doctrina canónica.

## 0. Tesis

Una App concreta se modela inicialmente con **una sola continuidad**:

`C_app`

En ella conviven dos familias de hechos:

- hechos de metaestructura: entidades, parámetros, relaciones, contratos;
- hechos de dominio: admisiones, assignments, eventos.

No se separan por defecto en una continuidad de schema y otra de datos.

---

## 1. Reconstrucción simultánea

Al recorrer un corte `C_h` reconstruimos:

`(K_h,S_h)`

donde:

- `K_h` = metaestado vigente: entidades, parámetros, relaciones, contratos;
- `S_h` = estado de dominio: elementos, assignments, eventos y consecuencias actuales.

Cada hecho aplica:

`(K_i,S_i)=Step(K_(i-1),S_(i-1),r_i)`.

Así la continuidad reconstruye simultáneamente el lenguaje y los datos expresados en ese lenguaje.

---

## 2. Hechos mínimos iniciales

Biblioteca causal mínima:

`DefineEntity`
`DefineParameter`
`DefineRelation`
`AdmitEntity`
`Assign`

Más adelante pueden añadirse familias como `AdmitEvent` cuando exista necesidad irreducible.

---

## 3. Evolución de estructura

Ejemplo:

`DefineEntity(Product)`
`DefineParameter(Name,Product,Text)`
`DefineParameter(Price,Product,FixedPoint)`
`AdmitEntity(Product,P0)`
`Assign(P0,Price,100)`.

Después:

`DefineParameter(Discount,Product,FixedPoint)`.

No se migran ni reescriben P0/P1/P2.

El nuevo corte simplemente induce una dimensión adicional:

`V_Discount=[bottom,bottom,...]`.

Regla:

**La estructura también es historia.**

---

## 4. Schema como proyección

No existe un `schema.json` soberano.

`Schema_h = Project_definitions(C_h)`.

El schema vigente es la proyección actual de definiciones constituidas.

---

## 5. Una continuidad por realidad causal independiente

No crear automáticamente:

- EntitySystemContinuity;
- ParameterSystemContinuity;
- RelationSystemContinuity;
- una continuidad por tabla.

Regla:

**Una continuidad por realidad que necesita evolución causal independiente.**

Dentro de una App, entidades, parámetros, relaciones y hechos normalmente pertenecen a la misma realidad de App.

---

## 6. Template opcional

Puede existir una continuidad separada de template cuando haya una razón real:

`C_AppTemplate @ W_K`

y una instancia:

`C_AppInstance @ W_D`.

La separación existe porque template e instancia tienen identidad/audiencia/evolución distintas, no porque schema y datos deban separarse.

---

## 7. Constructor UI

La UI creadora no es otra continuidad.

Traduce acciones humanas a propuestas:

`Crear entidad -> DefineEntity`
`Añadir parámetro -> DefineParameter`
`Añadir regla -> DefineRelation`
`Crear elemento -> AdmitEntity`
`Cambiar valor -> Assign`.

Lectura:

`Read/Project` no constituye hechos.

---

## 8. Flujo compacto

`C_app -> Interpret -> (K_h,S_h) -> Project -> M_h -> AppUI`.

Cambios:

`UI -> Proposal -> Authority_C -> DeltaC -> FoldDelta -> (K_h',S_h')`.

---

## 9. Frases canónicas

**Una App concreta empieza con una sola continuidad autocontenida.**

**Su continuidad contiene tanto el lenguaje vigente como los hechos expresados en ese lenguaje.**

**La estructura también es historia.**

**El constructor propone metahechos; no constituye una realidad paralela.**

**Schema_h es una proyección de C_h, no una fuente soberana.**