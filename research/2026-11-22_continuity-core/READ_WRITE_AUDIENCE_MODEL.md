# Modelo canónico de lectura, escritura, autoridad y audiencia

**Fecha:** 2026-11-22
**Estado:** doctrina fundamental de Continuity Core + KOB2.

## 0. Inversión arquitectónica

La arquitectura tradicional suele comenzar por un recurso X y luego añadir permisos:

`Resource X + ACL(readers,writers)`.

Continuity Core invierte la pregunta:

1. ¿Quién puede originar propuestas?
2. ¿Quién puede constituir cambios en la realidad compartida?
3. ¿Quién necesita reconstruir qué parte de esa realidad?
4. ¿Debe leer la fuente o un derivado?
5. ¿Bajo qué View debe materializarse ese derivado?

El flujo emerge de las respuestas.

Principio canónico:

> **No asignamos primero un régimen y luego forzamos los datos dentro. Preguntamos quién puede modificar legítimamente la realidad y quién necesita conocer qué información; de esas dos respuestas emerge la topología del flujo, la proyección y el régimen KOB2.**

---

## 1. Leer y escribir son mecanismos ortogonales

Definimos para una realidad X:

`Audience(X)` = conjunto de actores que deben poder reconstruir/evaluar X.

`Authority(X)` = contrato/causas que determinan quién puede constituir cambios legítimos en X.

En general:

`Audience(X) != Authority(X)`.

Un objeto puede ser:

- público de lectura y privado de escritura;
- compartido de lectura y restringido de escritura;
- privado de lectura y multi-actor de escritura;
- público de lectura y colaborativo bajo una Authority explícita.

Por tanto `Clear` o `Keyed(d)` nunca sustituyen Authority.

---

## 2. 'Escribir' tiene varias capas

Para evitar ambigüedad distinguimos:

### 2.1 Local authorship

`WriteLocal(n)` = el nodo puede append a su propia trayectoria `Gamma_n`.

Esto no modifica todavía una realidad compartida.

### 2.2 Proposal authority

`MayPropose(actor,q)` = el contrato permite que q sea presentada para evaluación.

Una propuesta válida no implica que será admitida.

### 2.3 Constitutive authority

`MayConstitute_A(q,C_h)` = Authority puede transformar la continuidad fuente.

Esta es la escritura semántica que realmente cambia realidad compartida.

### 2.4 Publication authority

`MayPublish(actor,D_a)` = quién puede producir/actualizar un derivado para una audiencia.

Puede coincidir con Authority de la fuente o ser una capacidad separada.

### 2.5 Material write capability

`CanPut(storage,key,bytes)` = capacidad física de escribir bytes.

Esto NO concede autoridad semántica.

Regla:

`PhysicalWrite != ConstitutiveWrite`.

---

## 3. 'Leer' también tiene capas

### 3.1 Source readability

`CanReconstruct(C)` = actor puede abrir/verificar suficiente evidencia para reconstruir la continuidad fuente.

### 3.2 Derived readability

`CanReconstruct(D_a)` = actor puede reconstruir un derivado específico.

### 3.3 Query/UI visibility

Una UI puede mostrar solo una proyección adicional de un material ya legible.

Regla:

`ReadableSource` no es requisito para `ReadableDerivative`.

Un afiliado puede reconstruir `D_net` sin poder reconstruir `C_private`.

---

## 4. Escritura converge; lectura irradia

Forma general de escritura:

`coproduct_i Gamma_i -> proposals -> Authority_A -> C`.

Muchas trayectorias/propuestas convergen hacia una autoridad que constituye una realidad fuente.

Forma general de lectura:

`C -> {Projection_a(C)}_a -> {View_a}_a -> audiences`.

Una fuente puede irradiar múltiples realidades derivadas según audiencia.

Frase canónica:

> **La escritura converge hacia la fuente; la lectura irradia desde la fuente mediante derivados.**

---

## 5. La fuente y los lectores no tienen por qué compartir el mismo objeto

En un modelo ACL tradicional se intenta proteger el mismo recurso:

`DatabaseRow/Product -> read/write permissions`.

Aquí normalmente hacemos:

`C_private -> Projection_public -> D_public`

`C_private -> Projection_net -> D_net`

`C_private -> Projection_internal -> D_internal`.

Los lectores externos no reciben 'permisos parciales sobre C_private'; reciben otra realidad autocontenida para su propósito.

---

## 6. Algoritmo canónico para decidir un flujo

Para cada nueva necesidad q:

### Paso W1 — identificar la realidad que puede cambiar

`Source(q)=C`.

Preguntar: ¿qué continuidad debería poseer causalmente este efecto?

### Paso W2 — identificar proposers

`Proposers(q)`.

¿Quién puede originar solicitudes/hechos locales?

### Paso W3 — identificar Authority

`Authority_C(q)`.

¿Quién tiene información suficiente y legitimidad para constituir el efecto?

Esto define el camino de escritura.

### Paso R1 — identificar audiencia

Para cada grupo g:

`Audience_g`.

¿Quién necesita conocer información resultante?

### Paso R2 — minimizar información

`Need_g(C_h)`.

¿Qué necesita exactamente ese grupo y qué NO necesita?

### Paso R3 — decidir fuente vs derivado

Si el grupo puede/ debe reconstruir toda la fuente:

`Projection_g = Identity`.

Si no:

`D_g = Projection_g(C_h)`.

### Paso R4 — escoger View KOB2

`Audience=Everyone -> Clear`.

`Audience=Group G -> Keyed(d_G)`.

`Audience=Private domain -> Keyed(d_private)`.

### Paso R5 — definir publisher/authority del derivado

¿Quién puede actualizar `D_g`?

Esto es independiente de que todos, algunos o uno puedan leerlo.

### Paso M — materializar

`Logical D_g -> KOB2ViewAdapter(View_g) -> Storage/Network`.

---

## 7. Régimen como producto de dos ejes

No existe un único eje `private/public`.

Definimos conceptualmente:

`Regime(X) = (WriteAuthority(X), ReadAudience(X))`.

KOB2 implementa el eje de lectura/materialización:

`ReadAudience=Everyone => Clear`

`ReadAudience=Group => Keyed(d_group)`.

Authority/Capability implementa el eje de escritura.

Ejemplos:

`(OwnerWrite, EveryoneRead)` = catálogo público.

`(OwnerWrite, NetworkRead)` = feed de afiliados.

`(InternalAuthority, InternalRead)` = continuidad operativa privada.

`(MultiActorAuthority, EveryoneRead)` = continuidad colaborativa pública si el contrato lo permite.

---

## 8. El régimen no se decide por dónde está almacenado

`Location ⟂ Audience ⟂ Authority`.

Un envelope Keyed privado puede vivir en R2 público de objetos opacos.

Un catálogo Clear puede vivir localmente.

Un Storage puede tener capacidad de PUT sin autoridad para constituir cambios.

Por tanto:

`StorageACL != DomainAuthority`.

---

## 9. KOB2 simplifica el eje de lectura

KOB2 9.0.1 tiene exactamente:

`View = Clear ⊔ Keyed(B^32)`.

Interpretación de diseño:

`PublicRead := Clear`.

`GroupRead(G) := Keyed(d_G)`.

`PrivateRead := Keyed(d_private)`.

No necesitamos tres primitivas criptográficas.

Los diferentes 'mundos' son perfiles de audiencia construidos con la misma View algebra.

---

## 10. KOB2 NO resuelve por sí solo el eje de escritura

Poseer `d_G` permite evaluar material Keyed(d_G) y producir envelopes válidos bajo esa View.

Por tanto:

`Possess(d_G) != MayConstitute(Source)`.

Y:

`SharedView != SharedAuthority`.

Si un feed de afiliados usa `Keyed(d_affiliates)`, los afiliados pueden reconstruir el feed, pero sus ventas siguen siendo propuestas a la Authority de la continuidad fuente.

---

## 11. Flujo privado fuente

Escritura:

`node local -> Gamma_n -> proposal -> Authority_private -> C_private`.

Persistencia:

`C_private -> KOB2 Keyed(d_private) -> storage`.

Lectura autorizada:

`storage -> open Keyed(d_private) -> verify -> persist local -> fold C_private -> M_h`.

Audience y Authority pueden coincidir, pero conceptualmente siguen separadas.

---

## 12. Flujo de cooperación de red

Fuente:

`C_private`.

Derivación:

`D_net = Projection_net(C_private)`.

Lectura:

`D_net -> Keyed(d_net) -> miembros de red`.

Escritura de negocio:

`member -> Gamma_member -> Request -> Authority_private -> C_private`.

Reirradiación:

`C_private' -> Projection_net -> D_net'`.

Regla:

`NetworkRead != SourceWrite`.

---

## 13. Flujo público

Fuente:

`C_private`.

Derivación:

`D_public = Projection_public(C_private)`.

Lectura:

`D_public -> Clear -> Everyone`.

Escritura:

`Authority_publication/owner -> update D_public`

o, preferiblemente, D_public se regenera determinísticamente desde C_private.

Regla:

`PublicRead != PublicWrite`.

---

## 14. Derivados como fronteras de información

Una ProjectionPolicy no es solo formato; es una frontera semántica.

`Projection_g` decide:

- qué clases aparecen;
- qué parámetros aparecen;
- qué granularidad;
- qué historia se conserva;
- qué contratos necesita el derivado para ser autocontenido;
- qué referencias se eliminan o sustituyen.

Por tanto:

`ProjectionPolicy` es parte del diseño de audiencia.

---

## 15. Caso Commerce

### Fuente privada

`C_commerce` contiene Product, Sale, Cost, Supplier, internal Stock causes, contracts, etc.

`ReadAudience = private` -> `Keyed(d_commerce)`.

`WriteAuthority = CommerceAuthority`.

### Feed afiliados

`D_aff = Projection_aff(C_commerce)` con Product, sellable price, availability, commission, public images.

`ReadAudience = affiliate network` -> `Keyed(d_aff)`.

`WriteAuthority(D_aff) = publisher/derivation authority`, no afiliados por defecto.

Afiliado vende:

`Gamma_aff -> SaleRequest -> CommerceAuthority -> C_commerce`.

### Catálogo público

`D_pub = Projection_pub(C_commerce)`.

`ReadAudience = everyone` -> `Clear`.

`WriteAuthority(D_pub) = commerce publication authority`.

---

## 16. Matriz de decisión

| Qué cambia | Quién constituye | Quién lee | Fuente/derivado | KOB2 |
|---|---|---|---|---|
| realidad interna | CommerceAuthority | equipo privado | fuente | Keyed(d_priv) |
| catálogo web | CommerceAuthority por derivación | todos | derivado | Clear |
| feed afiliados | CommerceAuthority por derivación | red afiliada | derivado | Keyed(d_net) |
| venta afiliado | CommerceAuthority | afiliado observa respuesta/derivado | proposal→fuente | fuente privada + respuesta |
| snapshot local | proceso local | UI local | materialización | cualquiera/local |

---

## 17. Diferencia con ACL tradicional

ACL tradicional:

`same resource + read/write flags`.

Continuity Core:

`many proposal trajectories -> constitutive authority -> source continuity -> many projections -> audience-specific Views`.

Esto reduce exposición porque ampliar lectura no obliga a ampliar acceso a la fuente.

También reduce acoplamiento: cambiar la audiencia de un derivado no cambia la semántica de la fuente.

---

## 18. Invariantes

1. `PhysicalWrite != ConstitutiveWrite`.
2. `ReadableDerivative != ReadableSource`.
3. `SharedView != SharedAuthority`.
4. `PublicRead != PublicWrite`.
5. `Projection != AccessControlFilter`; es una nueva realidad derivada.
6. `StorageACL != DomainAuthority`.
7. La fuente no debe ampliar su audiencia solo porque un consumidor nuevo necesite algunos datos.
8. Cada derivado debe ser autocontenido respecto de su promesa.
9. La View se elige después de conocer la audiencia.
10. Authority se elige después de conocer el efecto que realmente se quiere constituir.

---

## 19. Frases canónicas

**La escritura converge; la lectura irradia.**

**Primero preguntamos quién puede cambiar la realidad; después quién necesita conocer qué parte de ella.**

**La respuesta de escritura determina Authority y la fuente causal.**

**La respuesta de lectura determina Projection y View.**

**No damos acceso parcial a una fuente cuando podemos publicar un derivado autocontenido.**

**KOB2 simplifica la audiencia; Authority gobierna la evolución.**

**El régimen emerge de las preguntas, no se predefine.**