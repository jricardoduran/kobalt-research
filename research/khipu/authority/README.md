# Khipu — autoridad, conflictos matemáticos y continuidad

**Fecha:** 2026-11-21 12:24 UTC-5  
**Estado:** claridad conceptual + probeta ejecutada

## 1. Separación canónica

Una trayectoria local es un orden total reconocido de un nodo:

`Γ_n = (e_0,...,e_k)`.

El coproducto preserva todas las fibras sin crear un orden global:

`L = ⨿_n Γ_n`.

La autoridad **no es** el coproducto. El coproducto reúne evidencia; la autoridad constituye decisiones.

La continuidad queda:

`C = Constitute_A(Closure(L,R,K))`.

- `L`: evidencia local;
- `R`: relaciones/causas/resoluciones;
- `K`: contratos y semántica;
- `A`: autoridad reconocida para constituir decisiones.

## 2. Conflicto matemático

Sea `P_h` el conjunto de candidatos individualmente admisibles bajo el corte `C_h`.

Un conjunto `M ⊆ P_h` es un conflicto mínimo cuando:

1. cada miembro es individualmente admisible;
2. `M` no puede constituirse conjuntamente sin violar un invariante;
3. todo subconjunto propio de `M` sí es coherente.

Para stock:

`Coherent_h(S) ⇔ Σ quantity(q) ≤ Stock_h(product)`.

Stock 1 + solicitudes A/B/C de cantidad 1 produce conflictos mínimos:

`{A,B}, {A,C}, {B,C}`.

Las soluciones coherentes máximas son:

`{A}, {B}, {C}`.

Por tanto los invariantes detectan el conflicto pero no contienen información suficiente para elegir ganador.

## 3. Automático vs autoridad

No confundir:

- **rechazo contractual automático:** un candidato es inválido por sí mismo; no es conflicto entre trayectorias;
- **conflicto matemático:** varios candidatos individualmente válidos son incompatibles juntos;
- **política automática:** una regla adicional y determinista puede elegir; es autoridad delegada/ codificada;
- **decisión discrecional:** hay varias soluciones coherentes y no existe una política contractual;
- **decisión de dominio sin conflicto matemático:** por ejemplo declarar duplicados dos productos con IDs distintos.

Así, una resolución automática de un conflicto real no emerge de la compatibilidad sola: necesita una regla adicional que ejerce autoridad.

## 4. Continuidad no es log global

Las solicitudes permanecen en las trayectorias locales. La continuidad puede constituir una resolución que referencia esas solicitudes sin copiarlas.

Ejemplo:

`Γ_B: SaleRequest_B -> Incorporate(resolutionRef)`

mientras:

`C: SaleResolve(requestRefs=[A,B,C], admitted=[B], rejected=[A,C])`.

La trayectoria responde qué hizo/intento el nodo. El coproducto responde qué evidencia concurrente existe. La autoridad decide qué consecuencias compartidas pueden constituirse. La continuidad responde qué realidad compartida quedó constituida.

## 5. UI de autoridad

La probeta separa tres superficies:

1. **Trayectorias:** cada `Γ_n` por separado.
2. **Autoridad:** validaciones automáticas, decisiones de dominio y conflictos matemáticos.
3. **Continuidad:** solo hechos constituidos y estado derivado.

La detección de un conflicto nunca modifica la continuidad. Solo una decisión constitutiva lo hace.

## 6. Resultado probado

Fixture:

- A y B producen solicitudes de producto con atributos iguales e IDs KS1 diferentes;
- esa posible duplicidad se clasifica como decisión de dominio, no conflicto matemático;
- A queda admitido, B rechazado como duplicado;
- stock del producto A = 1;
- A/B/C producen tres SaleRequest válidas por una unidad;
- detector: demanda 3 > capacidad 1;
- conflictos mínimos: AB, AC, BC;
- soluciones máximas: A, B, C;
- `requiresAuthority=true`;
- resolución manual elegida: B;
- resultado: 1 admitida, 2 rechazadas, stock 0;
- A/B/C incorporan la misma resolución en sus trayectorias;
- la continuidad no contiene copias de product.request ni sale.request.

JavaScript y PHP produjeron exactamente el mismo resultado y el mismo continuityHead:
`2b0a3a359748f5fe38a51e2c5582098a6af63597fded093e969ed332513ad46b`.
