# Frontera canónica — Dashboard/App selection → Continuity Core

**Fecha:** 2026-11-22
**Estado:** claridad canónica posterior a la primera formulación Genesis→Core.

## 0. Tesis

Continuity Core **no comienza en Génesis ni en el Dashboard**.

Comienza cuando ya existe una referencia a una continuidad específica de App:

`ContinuityCore(C_app)`

Todo lo anterior pertenece a arranque, composición y selección de interfaz.

---

## 1. Flujo mínimo

`Genesis -> WorldContext -> DashboardShell -> UserDashboardConfig -> EnabledApps -> AppSelection | C_app -> ContinuityCore -> M_h -> AppUI`

La barra marca la frontera semántica.

## 2. Génesis

Génesis resuelve acceso/reconocimiento a los mundos y sus capacidades.

No debe conocer Product, Sale, VectorLab, parámetros, vectores ni UI interna de una App.

`Genesis != ContinuityCore`

## 3. Dashboard Shell

El Dashboard Shell es composición/materialización de interfaz. Puede provenir de W_K, del mundo público cuando sea apropiado u otro materializador reconocido.

No necesita ser una continuidad propia.

## 4. Configuración privada del usuario

La configuración del Dashboard puede ser simplemente contenido actual:

`Config_u={theme,enabledApps,preferences}`

No todo dato necesita continuidad.

`Fact !=> Continuity`

Una configuración merece continuidad propia solo si necesita historia, concurrencia, autoridad o referencias longitudinales independientes.

## 5. Apps habilitadas

`EnabledApps_u=[Ref(A_1),Ref(A_2),...,Ref(A_n)]`

El Dashboard recorre esta configuración y muestra lanzadores. Esto es lógica de composición UI, no Continuity Core.

## 6. Selección de App

Cuando el usuario elige una App:

`Ref(A) -> C_{A,u}`

y desde ese punto:

`ContinuityCore(C_{A,u})`

## 7. Definición de App vs instancia

Puede existir una definición compartida `AppDefinition_A` y una continuidad concreta `C_{A,u}`.

`AppDefinition != AppInstance`

La definición aporta gramática inicial; la continuidad concreta contiene realidad constituida y extensiones.

## 8. Continuity Core

Entrada: `C_h`.

Salida: `M_h=Interpret(C_h)`.

`M_h` puede contener contratos vigentes, clases de entidad, secuencias constitutivas, posiciones derivadas, parámetros, vectores lógicos, relaciones e índices/materializaciones.

Operación incremental:

`M_h' = FoldDelta(M_h, DeltaC)`

con invariante:

`FoldDelta(Project(C_h),DeltaC) = Project(C_h')`

## 9. App UI

La UI es posterior:

`UI_A=Project_UI_A(M_h)`

Continuity Core no necesita conocer botones, layout comercial o navegación.

## 10. VectorLab: nuevo punto de partida

La probeta ya no prueba Génesis ni Dashboard.

Asumimos usuario reconocido, App habilitada y VectorLab seleccionada.

Input real:

`C_VectorLab`

Pregunta:

`Dada C_h, ¿qué estructura emerge al recorrerla?`

Desde ahí:

`Facts -> Definitions -> ConstitutiveOrder -> Positions -> Parameters -> Vectors -> Relations -> Materialization`

## 11. Siguiente bloque de investigación

Orden canónico inmediato:

1. EntityKindDefinition — definir una clase de entidad.
2. EntityAdmission — admitir identidades de esa clase.
3. ConstitutiveOrder — inducir posiciones estables.
4. ParameterDefinition — definir una dimensión sobre la clase.
5. Assignment/Fold — producir valor actual desde historia.
6. LogicalVector — indexar la dimensión por posición del padre.
7. Representation profile — materializar sin cambiar semántica.
8. Relations — restringir transformaciones entre parámetros.

## 12. Frases canónicas

**Continuity Core comienza con una continuidad específica de App.**

**Dashboard compone y selecciona; Continuity Core interpreta y constituye la App.**

**No todo contenido necesita continuidad.**

**AppDefinition no es AppInstance.**

**La UI de una App es una proyección posterior de la realidad materializada del Core.**