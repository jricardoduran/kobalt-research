# Probeta P0 — VectorLab sobre una continuidad de App

**Fecha:** 2026-11-22
**Tipo:** probeta conceptual/UI del núcleo, sin dependencia de Génesis/Dashboard.

## Pregunta

¿Puede Continuity Core recibir una continuidad `C_VectorLab`, descubrir su metaestructura y derivar posiciones/vectores determinísticamente sin tablas ni schema hardcodeados?

## Fixture inicial

Asumimos resuelto: usuario, Génesis, mundos, Dashboard, configuración de Apps habilitadas y selección de VectorLab.

**Input real de P0:**

`C_VectorLab`

## Secuencia de hechos

`r0=AppGenesis`
`r1=EntityKindDefinition(Item)`
`r2=ParameterDefinition(Count,Item,Unsigned8,LatestAssignment)`
`r3=Admit_Item(E0)`
`r4=Assign(E0,Count,7)`
`r5=Admit_Item(E1)`
`r6=Assign(E1,Count,3)`
`r7=ParameterDefinition(Enabled,Item,Boolean,LatestAssignment)`
`r8=Assign(E0,Enabled,true)`

## Resultado esperado

`h2: classes={Item}; params={Count}; S_Item=()`
`h3: S_Item=(E0); pos(E0)=0; V_Count=[bottom]`
`h4: V_Count=[7]`
`h5: S_Item=(E0,E1); pos(E1)=1; V_Count=[7,bottom]`
`h6: V_Count=[7,3]`
`h7: V_Enabled=[bottom,bottom]`
`h8: V_Enabled=[true,bottom]`

## UI mínima

Cuatro paneles: Hechos recorridos; Metaestado K_h; Estado S_h; Vectores/materialización M_h.

Controles mínimos: Reset, +1 hecho, Hasta head, Añadir entidad, Añadir parámetro, Asignar valor.

## Pruebas

### P0.1 Determinismo
`same C_h => same M_h`

### P0.2 Posición no declarada
Ningún hecho contiene `slot`.

### P0.3 Estabilidad
Tras admitir E1, `pos(E0)=0`.

### P0.4 Metaestructura dinámica
`Enabled` aparece después de E0/E1 sin reescribir admisiones.

### P0.5 Ausencia
`bottom != false != 0`

### P0.6 Incrementalidad
Añadir `r9=Assign(E0,Count,9)` y exigir:

`FoldDelta(M_h8,r9)=FullReplay(r0...r9)`

### P0.7 Independencia de codec
Dense uint8 y sparse map deben representar el mismo vector lógico.

### P0.8 Frontera
Nada en P0 depende de login, Dashboard o listado de Apps.

## Siguiente investigación

`EntityKindDefinition -> EntityAdmission -> ConstitutiveOrder -> ParameterDefinition -> Assignment/Fold -> LogicalVector`

antes de Commerce.