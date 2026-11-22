# Plan canónico — Continuity Core antes de Commerce

**Fecha:** 2026-11-22

## Objetivo

Desarrollar primero mecanismos generales de continuidad, validarlos con probetas explicativas y solo después especializarlos en Commerce.

## Fase 1 — claridad formal

Congelar vocabulario e invariantes para continuidad autocontenida, bootstrap mínimo, contratos extensibles, clases dinámicas, posición derivada, parámetros/vector lógico, folds, codecs/materializaciones, relaciones, autoridad, atomicidad y local/red.

## Fase 2 — probetas de mecanismo

Comenzar por:

`P0 Explorer -> P1 Derived Position -> P2/P3/P4 dependencies -> P5 vector templates`.

## Fase 3 — verificación

Cada probeta debe comprobar determinismo, igualdad replay completo vs snapshot+delta, independencia del orden físico, separación semántica/codec, reconstrucción desde continuidad y local-first.

## Fase 4 — biblioteca conceptual

Fijar templates reutilizables de parámetros, folds y representaciones solo después de verificarlos.

## Fase 5 — Commerce

Definir CommerceAppTemplate usando mecanismos generales ya fijados.

## Fase 6 — UI Commerce

Construir registrador de producto, catálogo y POS como preguntas/propuestas sobre la continuidad Commerce.

## Regla de no-regresión

Si en Commerce aparece una necesidad general, volver a Continuity Core, definirla/probarla allí y luego reutilizarla.

> **Primero demostrar la gramática general; después escribir el vocabulario de Comercio.**