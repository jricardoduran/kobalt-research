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

## Dos tracks de implementación experimental

**Track A — Clean Core:** bootstrap mínimo propio + Record/K5 + persistencia local.

**Track B — KOB2-backed:** KOB2 9.0.1 + mecanismos revisados + Record/Chunk + Continuity Core.

Ambos deben recibir fixtures semánticos equivalentes y producir las mismas secuencias, posiciones, vectores y proyecciones. Las diferencias de bytes/codec son aceptables; las diferencias semánticas no.


## Prueba transversal Audience/Authority

Antes de especializar cualquier flujo, responder explícitamente:

1. ¿quién puede proponer?;
2. ¿quién puede constituir?;
3. ¿quién necesita leer qué parte?;
4. ¿fuente o derivado?;
5. ¿Clear o Keyed(d_group)?;
6. ¿quién puede publicar el derivado?;
7. ¿quién solo puede escribir bytes sin autoridad semántica?

Toda probeta nueva debe etiquetar sus flujos con estas respuestas.


## Política transversal — privacidad constitutiva por defecto

No asumir `Clear` como estado inicial por costumbre. Para cada continuidad fuente preguntar si su historia completa necesita audiencia pública. Si no, preferir `Keyed(d_domain)` y exponer información mediante derivados con ProjectionPolicy explícita. Esta política debe verificarse en las probetas de KOB2.


## Regla transversal — audiencia mínima

Bajo incertidumbre razonable, no usar `Clear` por costumbre. Elegir la audiencia mínima que cumple la función de la fuente; ampliar acceso mediante `Projection -> Clear/Keyed(d_group)`. Verificar explícitamente que ningún flujo amplíe la audiencia de la fuente cuando basta un derivado.


## Foco inmediato — mecanismos estructurales de una App

La probeta P0 parte directamente de `C_app`; Génesis/Dashboard se consideran contexto resuelto.

Orden de investigación:

1. definir una clase de entidad;
2. admitir identidades de esa clase;
3. derivar su orden/posición estable;
4. definir parámetros sobre la clase;
5. constituir assignments y su fold;
6. derivar vectores lógicos alineados por posición;
7. comparar representaciones dense/sparse/bitmap/fixed-width;
8. introducir relaciones entre parámetros.

No avanzar a Commerce hasta que estos mecanismos sean independientes del vocabulario de negocio.