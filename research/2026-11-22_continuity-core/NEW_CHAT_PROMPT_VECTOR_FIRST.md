# Prompt de reinicio — Continuity Core simple vector-first

Usar este texto para iniciar un chat nuevo dentro del proyecto.

---

Quiero continuar el diseño de **Kobalt Continuity Core**, pero partir desde la versión más simple y clara, evitando arrastrar complejidad histórica innecesaria.

Antes de proponer código, revisa en los repositorios del proyecto:

`research/2026-11-22_continuity-core/VECTOR_FIRST_SIMPLE_CANON.md`

y, solo cuando haga falta ampliar una cuestión específica:

`CONTINUITY_CORE_CONSOLIDATED.md`
`PARAMETER_RELATION_LIBRARY.md`
`SELF_DESCRIBING_APP_CONTINUITY.md`.

El documento `VECTOR_FIRST_SIMPLE_CANON.md` tiene prioridad si una formulación anterior parece más compleja o contradictoria.

## Punto de partida canónico

Continuity Core se piensa así:

`⊔ Γ_n -> C_h -> 𝕍_h -> proyecciones`.

- Cada nodo tiene una trayectoria local append-only `Γ_n`.
- La continuidad `C_h` NO es una trayectoria global ni un JSON; emerge de las trayectorias locales, Authority y las relaciones causales necesarias.
- Authority debe referenciar causas locales cuando puede, no duplicarlas.
- El Core conoce una gramática universal mínima: `DefineEntity`, `DefineParameter`, `DefineRelation`, `AdmitEntity`, `Assign`, más tipos/evoluciones generales.
- Una entidad `K` produce una base estable de identidades `S_K=[E0,E1,...]`.
- Un parámetro `A:K⇀D_A` produce un vector lógico `V_A[i]=CurrentValue(S_K[i],A)`.
- Crear un elemento solo admite una identidad; NO crea un objeto con todos sus campos ni escribe nulls.
- Crear un parámetro añade una dimensión; NO migra ni reescribe entidades existentes.
- La identidad es causal; la posición es una coordenada derivada.
- Referencias semánticas usan identidad; posiciones pueden usarse después como codificación local derivada.
- `Assignment`, `Fold`, `Derived` y `State` son causalidades distintas que pueden exponer la misma interfaz vectorial.
- Relaciones base: `Reference`, `Invariant`, `Derivation`, `AdmissionGuard`.
- Guardar causas; derivar consecuencias. Una venta puede reducir Stock por fold, sin escribir además `stock -= q`.
- El estado operacional natural es `𝕍_h=({S_K},{P_K},{V_A},R_h)`.
- JSON, tablas, SQL/SQLite, catálogos, APIs, formularios, índices y snapshots son proyecciones/materializaciones de `𝕍_h`; no son estructuras primarias del Core.
- JSON tampoco es necesario como formato conceptual de los registros de trayectoria. Los records pueden ser realizaciones compactas tipadas por contratos reconocidos.
- Local-first: la red transporta evidencia; toda interpretación ocurre desde evidencia persistida localmente.

## Principios que no debemos perder

`Position = Consequence(ConstitutiveOrder)`.

`ParameterSemantics != EvolutionSemantics != PhysicalCodec`.

`CausalAuthority != DerivedCache`.

`Storage != Authority`.

`View != Authority`.

`FoldVectorDelta(FoldVectors(C_h),ΔC)=FoldVectors(C_h')`.

**La continuidad conserva significado y causas; los vectores conservan operacionalmente la actualidad; las demás estructuras son vistas.**

**Una entidad no es un objeto con campos: es una identidad dentro de una base; sus campos son secciones de vectores de parámetros.**

## Cómo quiero trabajar en este chat

1. No escribir código todavía.
2. Buscar claridad conceptual extrema antes de implementar.
3. Preferir la explicación/mechanism más simple que preserve las propiedades.
4. No introducir JSON, SQL, schemas, clases, logs globales o nuevas continuidades por costumbre.
5. Distinguir siempre causa, semántica, coordenada, estado vectorial y proyección.
6. Si una cosa puede derivarse exactamente, tratarla primero como derivación.
7. No especializar en Commerce hasta que el mecanismo sea general.
8. Usar ejemplos pequeños (`Product`, `Sale`, `Task`, `Book`) únicamente para probar la gramática general.

## Primera tarea

Quiero que diseñemos, paso a paso, los **flujos mínimos definitivos** de Continuity Core vector-first:

- definición de entidad;
- definición de parámetro;
- admisión de elemento;
- assignment;
- relación/invariante;
- fold/derived;
- propuesta local `Γ_n` -> Authority -> `C_h`;
- actualización incremental `C_h -> 𝕍_h`;
- proyección desde vectores.

Para cada flujo identifica solo:

`entrada -> causa irreducible -> autoridad/condiciones -> efecto en C -> delta vectorial -> derivaciones`.

Busca reducir, no añadir. Si algo no es necesario para que el mecanismo funcione, déjalo fuera.

Al final quiero una gramática mínima suficientemente precisa para que después podamos escribir una probeta HTML+JS local-first sin tomar nuevas decisiones arquitectónicas importantes.