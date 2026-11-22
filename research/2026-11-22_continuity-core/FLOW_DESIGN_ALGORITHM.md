# Algoritmo de diseño de flujos, regímenes y derivados

**Fecha:** 2026-11-22

## 0. Objetivo

Convertir las preguntas conceptuales en un procedimiento repetible para UI, contratos y arquitectura.

## 1. Pregunta C — ¿qué realidad estamos intentando cambiar?

Identificar la continuidad fuente `C`.

Si solo cambia estado local descartable/materializado, quizá no hay nueva causa en C.

## 2. Pregunta A — ¿quién puede constituir ese cambio?

Definir `Authority_C(F)`.

Si un actor solo origina una solicitud, es proposer, no Authority.

Salida: flujo de escritura semántica.

`Gamma_proposer -> request -> Authority_C -> DeltaC`.

## 3. Pregunta V0 — ¿la historia completa de C tiene un propósito público?

Si NO o es indiferente:

`PreferredView(C)=Keyed(d_domain)`.

Si SÍ por definición del dominio:

`PreferredView(C)=Clear` puede ser válido.

Esta es una política de privacidad por defecto, no una obligación del kernel.

## 4. Pregunta U — ¿quién necesita conocer qué consecuencia?

Enumerar audiencias `a1,...,an`.

Para cada audiencia no preguntar 'qué permisos sobre C', sino:

`Need_a(C_h)`.

## 5. Pregunta P — ¿puede leer la fuente o necesita un derivado?

Si necesita exactamente toda C y es apropiado:

`D_a=C`.

Si no:

`D_a=Projection_a(C)`.

Preferir derivado cuando la audiencia necesita menos información que la fuente.

## 6. Pregunta G — ¿qué granularidad necesita D_a?

Decidir clases, parámetros, periodo, agregación, anonimización, precisión e historia.

Ejemplos:

- público: `Available/Unavailable`;
- afiliados: cantidad disponible exacta;
- socio: ventas agregadas mensuales;
- auditor: ventas detalladas pero sin otros contratos internos.

## 7. Pregunta R — ¿quién puede reconstruir D_a?

`Audience(D_a)=Everyone -> Clear`.

`Audience(D_a)=Group G -> Keyed(d_G)`.

`Audience(D_a)={single partner} -> Keyed(d_partner)` con secreto exclusivo compartido.

## 8. Pregunta PA — ¿quién publica/actualiza D_a?

Definir `PublicationAuthority(D_a)`.

Si D_a es determinista desde C, idealmente el publisher solo materializa la derivación; no inventa estado independiente.

## 9. Pregunta S — ¿dónde puede vivir el material?

Elegir uno o varios Storages/Sources por disponibilidad/costo.

Esta decisión NO cambia Authority ni View.

## 10. Pregunta Q — ¿cómo se recupera?

`Sources -> candidates -> recognize/open -> persist local -> resolve -> fold/project`.

No confiar en el primer servidor que responda.

## 11. Pregunta F — ¿qué fallos toleramos?

Separar:

- corrupción: detectar/rechazar;
- borrado: recuperar de otra Source si existe;
- stale/replay: resolver actualidad;
- fork: exponer/resolver según Authority;
- pérdida de key/View: problema de disponibilidad de lectura;
- pérdida de Authority: problema de evolución, no de Storage.

## 12. Pregunta D — ¿el derivado necesita continuidad propia?

Si D_a cambia independientemente, recibe feedback propio o necesita historia/identidad autónoma, puede tener continuidad propia.

Si es pura función de `C_h` y policy fija, puede ser materialización reproducible.

## 13. UI de creación/configuración

Una UI metaestructural puede preguntar en este orden:

1. ¿qué estamos creando/modificando?;
2. ¿qué continuidad es fuente?;
3. ¿quién constituye cambios?;
4. ¿la fuente debe ser privada por defecto?;
5. ¿qué audiencias existen?;
6. para cada audiencia, ¿qué necesita saber?;
7. ¿fuente o derivado?;
8. ¿qué ProjectionPolicy?;
9. ¿Clear o Keyed(d_G)?;
10. ¿quién publica el derivado?;
11. ¿qué Storages replican el material?;
12. ¿qué política de resolución/redundancia se requiere?

El resultado no es una ACL sino un grafo de flujos.

## 14. Ejemplo mínimo: Commerce

`C_commerce`
` Authority = CommerceAuthority`
` PreferredView = Keyed(d_commerce)`

`D_public = Projection_catalog(C_commerce)`
` Audience = Everyone`
` View = Clear`

`D_aff = Projection_affiliate(C_commerce)`
` Audience = Affiliates`
` View = Keyed(d_aff)`

`D_partner = Projection_sales(C_commerce)`
` Audience = Partner`
` View = Keyed(d_partner)`.

## 15. Frase final

> **No empezamos escogiendo una base, un permiso o un cifrado. Empezamos identificando la realidad, su Authority y las necesidades de cada audiencia; la proyección, la View y el Storage emergen después.**