# Ontología relacional y regímenes por defecto — Continuity Core + KOB2

**Fecha:** 2026-11-22
**Estado:** doctrina canónica.

## 0. Tesis

Los conceptos principales no se definen primero por propiedades aisladas sino por las relaciones que mantienen con otros componentes.

Ejemplos:

`Authority_C` se entiende por su relación con una continuidad C: sus decisiones admitidas pueden constituir extensiones de C.

`View_v` se entiende por su relación con material/evaluadores: determina cómo se derivan nombres/identidades y cómo puede abrirse/reconocerse el material.

`Source_i` se entiende por su relación nominal: ofrece candidatos para un Name; no declara por sí sola qué candidato es verdadero o vigente.

`Projection_P` se entiende por su relación entre una fuente y una realidad derivada.

---

## 1. Authority

Definición relacional:

`Authority_C(q)` = mecanismo/rol/contrato cuyas decisiones legítimas pueden convertir una propuesta q en un nuevo hecho constitutivo de C.

En forma operacional:

`Proposal -> Resolve_A(q,C_h) -> (response, DeltaC)`.

Si `DeltaC != empty`, la decisión de A participa causalmente en `C_h -> C_h'`.

Por tanto puede decirse pedagógicamente:

> **Authority es la capacidad de escribir en una continuidad**,

si y solo si `escribir` significa **constituir realidad compartida**, no `PUT(bytes)` ni append local.

Distinciones:

`WriteLocal != Constitute != PutBytes`.

---

## 2. Node

Un nodo es un locus capaz de conservar su propia trayectoria:

`Node(n) => exists Gamma_n`.

Su autoridad primaria sobre `Gamma_n` es local/single-writer.

Puede formular propuestas para otras continuidades sin tener Authority sobre ellas.

---

## 3. Continuity

`C` es la clausura causal/constitutiva reconocida de una realidad.

No es Storage, archivo, base de datos ni necesariamente una sola trayectoria.

Una realización puede usar fibras/trayectorias autorizadas, pero C es lo reconstruible a partir de sus causas y contratos.

---

## 4. View

KOB2 ofrece:

`View = Clear ⊔ Keyed(d)`.

Definición relacional:

`View_v` determina bajo qué ámbito se derivan identidad/contenido/nombre y bajo qué régimen un envelope puede abrirse/reconocerse.

Interpretación práctica:

`Clear` = audiencia abierta.

`Keyed(d)` = audiencia que comparte/puede constituir el secreto d.

View NO determina Authority.

---

## 5. Default de privacidad constitutiva

Dado que Clear y Keyed son regímenes igualmente naturales en KOB2, no es necesario adoptar la convención tradicional de 'todo nace en claro y luego añadimos seguridad'.

Política recomendada:

> **Una continuidad constitutiva se materializa por defecto bajo un ámbito Keyed de su dominio de autoridad, salvo que exista una razón positiva para que su historia causal completa sea pública.**

Formalmente:

`ConstitutiveSource(C) ∧ not PublicByPurpose(C) => PreferredView(C)=Keyed(d_domain)`.

Esto es una política/heurística de diseño, no una ley del kernel.

Motivos:

- la historia causal suele contener más información que cualquier lector externo necesita;
- un derivado público puede construirse después sin abrir la fuente;
- cambiar audiencia no obliga a cambiar semántica;
- evita el patrón tradicional 'publicar primero, proteger después'.

---

## 6. Projection

`D_a,h = Projection(P_a, C_h)`.

Projection es una transformación semántica deliberada desde una fuente/corte a una nueva realidad para una finalidad/audiencia.

No es un filtro de UI ni una ACL sobre C.

Puede:

- eliminar clases/parametros;
- reducir granularidad;
- sustituir valores por categorías;
- agregar/anonimizar;
- conservar solo un periodo;
- añadir contratos mínimos para que D sea autocontenida;
- producir una continuidad derivada con historia propia.

---

## 7. Audience

`Audience(D)` responde:

> ¿quién necesita poder reconstruir esta realidad D?

La audiencia conduce a View:

`Everyone -> Clear`.

`Group G -> Keyed(d_G)`.

Un grupo de una sola contraparte puede usar `Keyed(d_partner)` con un secreto exclusivo compartido con ella.

KOB2 9.0.1 revisado no contiene por sí mismo un mecanismo asimétrico de 'cifrar con la clave pública de un nodo'. Si se necesita distribución asimétrica, puede añadirse fuera del Core un mecanismo que entregue/wrappee `d_partner` al destinatario; no debe fingirse que ya existe.

---

## 8. Source

Definición epistemológica/material:

`Source_i : Name -> finite set of candidate Envelopes`.

Source responde:

> ¿qué candidatos puedo observar para este Name desde esta fuente?

NO responde:

- cuál es autoridad;
- cuál es current;
- cuál es legítimo;
- cuál es semánticamente válido.

Por eso múltiples Sources pueden ser usadas simultáneamente.

---

## 9. Storage

Storage retiene bytes y realiza operaciones físicas.

`PUT/GET/LIST/RANGE/...` son capacidades materiales.

`CanPut != Authority`.

Un Storage puede aceptar bytes de un atacante y seguir sin convertirse en autoridad.

---

## 10. Verification / Recognition

Verification pregunta si un material candidato satisface las propiedades matemáticas/materiales esperadas bajo la View, Name, commitment, descriptor y contratos aplicables.

Regla crítica:

> **La verificación matemática sustituye confianza en el medio de almacenamiento; no sustituye la autoridad semántica.**

Un candidato corrupto/modificado no debe pasar `open/recognize` bajo el contexto esperado.

Un candidato materialmente válido tampoco se vuelve automáticamente un hecho autorizado de dominio.

Por tanto:

`MaterialValid != Authorized != Current`.

---

## 11. Distribución sin Storage autoritativo

Supongamos Sources A,B,C.

Un atacante puede borrar/corromper A y B.

Si C conserva material reconocido suficiente:

`Query(A,B,C) -> candidates -> recognize/verify -> reconstruct`.

La disponibilidad depende de que al menos una Source útil conserve evidencia suficiente.

La integridad no depende de confiar en A/B/C.

El borrado no falsifica bytes: produce ausencia/indisponibilidad.

La corrupción produce candidatos rechazables.

Un replay/stale candidate puede ser materialmente válido pero no necesariamente current; Resolution/trajectory/completeness deben resolver esa pregunta.

---

## 12. Authority y matemática

No decir simplemente `Authority is mathematical`.

Separar:

`MathematicalVerification` = prueba reproducible de correspondencia/materialidad.

`Authority` = causa/contrato que determina qué decisiones constituyen realidad.

La matemática puede verificar una evidencia de Authority si el contrato incluye firmas, capabilities, claves reconocidas, causalidad, etc.; no crea legitimidad por sí sola.

---

## 13. Fuente privada, derivados públicos/compartidos

Patrón recomendado:

`C_private @ Keyed(d_domain)`

` -> Projection_public -> D_public @ Clear`

` -> Projection_network -> D_net @ Keyed(d_net)`

` -> Projection_partner -> D_partner @ Keyed(d_partner)`.

Cada derivado puede revelar exactamente lo necesario para su función.

---

## 14. Multitienda / stock

Fuente privada de comercio:

`C_commerce` incluye ventas completas y causas de stock.

Una tienda/tenant externo no necesita saber quién compró en B o C.

Puede recibir:

`D_store_i = Projection_store_i(C_commerce)`

con, por ejemplo:

`ProductRef, AvailableQty, Price, fulfillment constraints`.

La venta completa permanece privada.

El stock compartido puede ser una consecuencia derivada sin revelar la causa personal/comercial que lo redujo.

---

## 15. Socio que audita ventas

Si un posible comprador/socio necesita observar ventas agregadas o detalladas:

`D_partner = Projection_partner(C_commerce, period, fields, aggregation)`.

Audience = `{partner}`.

Con KOB2 actual:

`D_partner -> Keyed(d_partner)`.

Nosotros y el socio comparten `d_partner` por un canal seguro.

Si en el futuro se añade key-wrapping asimétrico:

`publicKey_partner -> wrap(d_partner)`

sería un mecanismo de distribución de View, no una redefinición de Continuity Core.

---

## 16. Definiciones relacionales resumidas

`Authority(C)` — quién/qué puede constituir la siguiente realidad de C.

`View(X)` — bajo qué ámbito X puede ser materialmente reconocido/abierto.

`Audience(X)` — quién necesita reconstruir X.

`Projection(C->D)` — qué realidad D se deriva deliberadamente de C.

`Source(N)` — dónde pueden aparecer candidatos para un nombre N.

`Storage` — dónde pueden retenerse bytes.

`Verification(candidate,context)` — si el candidato satisface la matemática/materialidad requerida.

`Resolution(candidates,Cut)` — cuál afirmación puede hacerse honestamente sobre actualidad/fork/ausencia.

---

## 17. Frases canónicas

**La autoridad constituye; la View revela; la Source ofrece candidatos; el Storage retiene; la matemática verifica; la proyección decide qué realidad entregamos.**

**La continuidad fuente puede ser privada por defecto y sus audiencias externas recibir derivados específicos.**

**No confiamos en el Storage para saber qué es verdad; lo usamos para encontrar material que luego debe ser reconocido.**

**Materialmente válido no significa autorizado ni vigente.**

**La audiencia selecciona el régimen de View; la finalidad selecciona la proyección.**