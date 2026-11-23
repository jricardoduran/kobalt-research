# Biblioteca canónica de parámetros, evolución y relaciones

**Fecha:** 2026-11-22
**Estado:** diseño conceptual para probetas.

## 0. Separación fundamental

Cada parámetro responde dos preguntas distintas:

1. ¿qué clase de valor contiene?
2. ¿cómo obtiene/evoluciona ese valor?

Conceptualmente:

`ParameterDefinition=(id,host,valueType,evolution)`

y las relaciones se declaran aparte.

---

## 1. ValueTypes iniciales

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

Defaults iniciales:

`absence=bottom`
`cardinality=0..1` cuando aplique
`representation=Auto`.

---

## 2. Evolutions iniciales

`Assignment` — último assignment autorizado.

`Fold` — acumulación de movimientos/eventos.

`Derived` — función reproducible de otras causas/valores.

`State` — máquina de transiciones válidas.

Regla:

`CommonVectorInterface != CommonCausality`.

Todos pueden aparecer como vectores actuales, aunque lleguen a su valor de formas distintas.

---

## 3. Relaciones iniciales

`Reference` — un valor referencia una entidad.

`Invariant` — restringe combinaciones de valores actuales.

`Derivation` — define un valor como consecuencia reproducible.

`AdmissionGuard` — condición requerida antes de constituir un hecho.

Estas relaciones no se mezclan en un mecanismo vago único.

---

## 4. Precio y descuento

`Price:Product->Money` con `Assignment`.

`DiscountPrice:Product->Money` con `Assignment`.

Relación:

`DiscountPrice=bottom OR (0 <= DiscountPrice <= Price)`.

Si se propone Price 100→70 y Discount=80, el cambio aislado viola el invariante.

Si también se propone Discount 80→60, existe una secuencia válida:

`Discount 80->60`
`Price 100->70`.

El resolutor general clasifica transformaciones:

`Independent | Sequenciable(order) | AtomicBatch | Conflict | Invalid`.

No existe un handler específico de precios.

---

## 5. Venta y stock

`Sale(ProductRef,Quantity)` constituye una causa.

`Stock:Product->Integer` usa `DerivedFold`/`Fold`.

Ejemplo:

`Stock_h(P)=Opening(P)+Inputs_h(P)-Outputs_h(P)-Sales_h(P)+Returns_h(P)`.

Una venta admitida cambia el conjunto causal observado por Stock; no hace `stock -= q` como segunda escritura soberana.

Regla:

**Guardar causas; derivar consecuencias reproducibles.**

---

## 6. Guarda de venta

`CanAdmitSale(s,C_h) iff Stock_h(ProductRef(s)) >= Quantity(s)`.

Authority protege como unidad lógica:

`CheckCurrentStock + AdmitSale`.

Concurrencia de dos ventas contra stock 1 requiere CAS/serialización de la admisión causal, no de una celda Stock.

---

## 7. Parámetros derivados visibles como columnas

Una tabla puede mezclar:

- Price: Assignment;
- DiscountPrice: Assignment + Invariant;
- EffectivePrice: Derived;
- Stock: Fold/Derived;
- Enabled: Assignment/State.

Todos pueden materializar vectores actuales:

`V_A[i]=CurrentValue(S_K[i],A)`.

Que algo tenga vector no implica que haya sido escrito directamente.

---

## 8. Representación

`LogicalVector != PhysicalVector`.

Representaciones posibles:

`dense | sparse | bitmap | fixed-width | dictionary`.

El codec/perfil físico nunca cambia la semántica del parámetro.

---

## 9. Frase canónica

**Entidades dan coordenadas; parámetros dan dimensiones; hechos dan historia; relaciones dan coherencia.**