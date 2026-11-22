# Flujo simplificado — Génesis → Dashboard → App → Continuity Core

**Fecha:** 2026-11-22
**Estado:** versión canónica simplificada.

## 0. Corrección

La versión anterior hacía demasiado trabajo conceptual entre Génesis y Continuity Core.

La frontera correcta es:

`Genesis -> Dashboard/UI composition -> App selection | ContinuityCore(C_app)`

Continuity Core empieza **solo cuando recibimos la continuidad de una App específica**.

## 1. Génesis

Génesis entrega/reconoce los mundos y capacidades necesarios. Para este problema lo consideramos resuelto.

## 2. Dashboard

El Dashboard se compone de `DashboardShell + UserDashboardConfig`.

El Shell es maqueta/materializador general.

La configuración privada puede ser contenido actual como JSON:

`Config_u={theme,enabledApps,preferences,...}`

No necesita ser continuidad salvo que aparezca una razón longitudinal concreta.

## 3. Apps habilitadas

`EnabledApps_u=[Ref(A_1),...,Ref(A_n)]`

El Dashboard recorre esas referencias y muestra las Apps disponibles. No constituye su estructura interna.

## 4. Apertura de una App

`Ref(A) -> C_{A,u}`

y ahí comienza:

`ContinuityCore(C_{A,u})`

## 5. Definición e instancia

Una definición compartida puede existir en un scope de red:

`AppDefinition_A@W_K`

y la continuidad concreta en el scope correspondiente:

`C_{A,u}@W_D`

Pero esta distribución pertenece a integración/packaging. El Core solo necesita que la clausura necesaria sea alcanzable.

## 6. Core

`C_h -> Interpret -> M_h`

y:

`(M_h,DeltaC) -> FoldDelta -> M_h'`

El Core descubre/deriva contratos, clases, secuencias, posiciones, parámetros, vectores y relaciones.

## 7. UI posterior

`M_h -> Project_UI -> UI_A`

La UI no define la ontología de la App.

## 8. Regla

**Génesis entrega contexto. Dashboard selecciona. Continuity Core empieza en C_app.**