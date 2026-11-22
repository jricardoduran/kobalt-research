# Probeta P0 — VectorLab sobre Génesis

**Fecha:** 2026-11-22
**Tipo:** probeta conceptual/UI antes de implementación completa.

## Pregunta

¿Puede una continuidad privada descubierta desde Génesis crear su propia metaestructura y derivar posiciones/vectores determinísticamente sin tablas/schema hardcodeados?

## Fixture inicial

Contexto ya reconocido por Génesis V3.1.8:

`W_K = Keyed(K)`

`W_D = Keyed(d)`

`Dashboard_D Current`.

Existe `VectorLabTemplate` en W_K con meta-contratos mínimos.

## Secuencia de hechos de prueba

`r0 = AppGenesis(VectorLabTemplate)`

`r1 = EntityKindDefinition(Item)`

`r2 = ParameterDefinition(Count,Item,Unsigned8,LatestAssignment)`

`r3 = Admit_Item(E0)`

`r4 = Assign(E0,Count,7)`

`r5 = Admit_Item(E1)`

`r6 = Assign(E1,Count,3)`

`r7 = ParameterDefinition(Enabled,Item,Boolean,LatestAssignment)`

`r8 = Assign(E0,Enabled,true)`.

## Resultado esperado por prefijo

`h2: classes={Item}; params={Count}; S_Item=()`

`h3: S_Item=(E0); pos(E0)=0; V_Count=[bottom]`

`h4: V_Count=[7]`

`h5: S_Item=(E0,E1); pos(E1)=1; V_Count=[7,bottom]`

`h6: V_Count=[7,3]`

`h7: V_Enabled=[bottom,bottom]`

`h8: V_Enabled=[true,bottom]`.

## Interacción UI mínima

La UI de laboratorio debe tener solo cuatro paneles:

1. `Hechos` — secuencia/prefijo recorrido;
2. `Metaestado K_h` — clases, parámetros y contratos descubiertos;
3. `Estado S_h` — secuencias/posiciones derivadas;
4. `Vectores M_h` — vectores lógicos/materializados.

Controles:

`Reset | +1 hecho | Hasta head | Añadir entidad | Añadir parámetro | Asignar valor`.

No necesita UI comercial.

## Pruebas obligatorias

### P0.1 Determinismo

Repetir replay completo dos veces:

`Project(C_h)==Project(C_h)`.

### P0.2 Posición no declarada

Inspeccionar todos los hechos: ninguno contiene `slot`.

### P0.3 Estabilidad

Tras admitir E1, `pos(E0)` sigue siendo 0.

### P0.4 Schema dinámico

Enabled aparece después de E0/E1 sin reescribir sus admisiones.

### P0.5 Sparse semantics

`bottom` significa ausencia; no confundir con false/0/null.

### P0.6 Incrementalidad

Guardar M_h8. Añadir:

`r9=Assign(E0,Count,9)`.

Exigir:

`FoldDelta(M_h8,r9)==FullReplay(r0..r9)`.

### P0.7 Independencia del codec

Materializar Count como dense uint8 y como sparse map. Ambos deben representar el mismo vector lógico.

### P0.8 Frontera Genesis/Core

Cambiar el contenido de VectorLab no modifica raíces/Views de Génesis.

## Falsaciones deliberadas

- introducir Assignment antes de definir parámetro → unresolved/rejected, nunca inventar definición;
- introducir Assignment a entidad no admitida → unresolved/rejected;
- intentar usar un slot declarado distinto del derivado → el slot declarado no tiene autoridad/idealmente ni existe en contrato;
- barajar orden físico de storage conservando relaciones causales → misma proyección;
- cambiar codec → misma semántica.

## Salida

Si P0 pasa, tenemos evidencia para implementar las siguientes probetas:

`P1 Parameter templates`
`P2 Relation/Invariant`
`P3 Reference vectors`
`P4 Snapshot+delta/K5`
`P5 Commerce specialization`.
