# Probetas — Continuity Core

**Fecha:** 2026-11-22

## P0 — Continuity Explorer
Recorrer C hecho por hecho y mostrar metaestado, estado y materializaciones. Debe descubrir clases/parámetros sin hardcodearlos.

## P1 — Posición derivada
Entregar mismos materiales en órdenes físicos distintos. Debe derivarse exactamente same S_K y same positions.

## P2 — Entidad nueva / parámetro existente
Identidad local antes de posición compartida; después de admisión emerge posición y el vector se alinea.

## P3 — Parámetro nuevo / entidad existente
Mostrar Define(A) precedes Assign y que A induce vector lógico aunque no se materialice.

## P4 — Entidad nueva + parámetro nuevo
Visualizar DAG: Admit(E) y Define(A) independientes; ambos preceden Assignment. Probar topological orders equivalentes.

## P5 — Numeric vector lab
Comparar Unsigned 8/16/32, FixedPoint y Boolean. Cambiar codec sin cambiar semántica.

## P6 — Enum / option table
Opciones con identidad y posición derivada; comparar identity vs compact position.

## P7 — Reference vectors
Una clase referencia otra. Un position-ref solo se interpreta si la secuencia target está causalmente disponible.

## P8 — Text/blob layouts
Misma semántica con inline, hash ref y string pool/offsets.

## P9 — Folds
Comparar LatestAssignment, SumMovements, SetUnion y StateTransition con misma interfaz slot->value.

## P10 — Relations
Probar Independent, Sequenciable, AtomicBatch, Conflict e Invalid.

## P11 — Atomic append
Dos incorporaciones concurrentes al mismo orden constitutivo. Proteger head+append, no slot.

## P12 — Snapshot + delta
Verificar Project(C_h') == FoldDelta(Project(C_h),Delta).

## P13 — Multi-format projection
Mismo C_h -> vector, JSON, matriz, CSV y tabla SQL-like.

## P14 — Local/connectivity
Browser offline, browser online y servidor: todos con evidencia local y trayectoria propia.

## P15 — Continuity partial order
Fibras lineales constitutivas dentro de C parcialmente ordenada, sin log global.

## Criterio de paso
Una probeta solo pasa si mantiene su invariante y detecta deliberadamente su condición de falsación.