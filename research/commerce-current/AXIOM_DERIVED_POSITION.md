# Axioma fundamental — la posición es consecuencia, no hecho

**Fecha:** 2026-11-22

> **La posición de una entidad no se declara como dato independiente. Emerge determinísticamente del **orden constitutivo canónico de las admisiones de esa clase dentro de la continuidad**.**

`Position = Consequence(ConstitutiveOrder)`

## Repetición deliberada

**La posición es consecuencia, no hecho.**

**La continuidad constituye identidades en un orden; el recorrido deriva posiciones.**

**No se escribe `slot=i`: se escribe la causa que hace inevitable ese `i`.**

**La atomicidad protege el append/avance constitutivo; el slot emerge de ese orden.**

**Una caché, snapshot, DB, matriz o índice puede guardar `identity→slot`, pero solo como materialización derivada de un corte.**

## Ejemplo

Si la continuidad induce para las admisiones Product el orden constitutivo:

`P_A, P_B, P_C, P_D`

se deriva:

`T_Product=(P_A,P_B,P_C,P_D)`

y:

`slot(P_D)=3`.

El valor `3` no necesita aparecer en el hecho de admisión.

## Condición matemática

El slot solo es canónico si cualquier lector correcto deriva la misma posición. El orden físico de archivos, llegada por red o enumeración de storage no puede definir silenciosamente la coordenada.

Si dos admisiones no tienen suficiente relación para inducir un orden único dentro de la tabla, todavía no existe un slot canónico.

## Consecuencia para atomicidad

No se protege una asignación redundante de slot. Se protege:

`CheckHead(Order_K,h) + Append(EntityAdmitted(E))`

como transición lógica cuando esa trayectoria produce posiciones.

Después:

`slot(E)=position_TK(E)`.

## Consecuencia para vectores

`V_A[i]=CurrentValue(T_Entity[i],A)`

es estable porque los slots históricos son consecuencias inmutables del pasado constituido.

## Consecuencia para optimizaciones

Una materialización puede guardar:

`M_h=(tables, identityToSlot, vectors, indexes, ...)`

siempre ligada al corte `h`.

`M_h=Project(C_h)`

y puede descartarse y reconstruirse.

## Regla de diseño

Persistir la causa mínima suficiente; derivar la consecuencia. No duplicar como hecho aquello que ya está matemáticamente determinado por la continuidad.

## Terminología estable

La cadena conceptual es:

`Continuity -> constitutive admissions of K + canonical order -> derived sequence S_K -> derived position -> materialized table T_K`.

Evitar `orden de la tabla` como origen del slot: la tabla es una materialización posterior.
