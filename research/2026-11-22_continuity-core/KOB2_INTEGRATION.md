# Integración KOB2 9.0.1 ↔ Continuity Core

**Fecha:** 2026-11-22
**Estado:** análisis arquitectónico y plan de integración. Distingue capacidades verificadas de KOB2 de propuestas nuevas.

## 0. Decisión provisional

No elegir todavía entre «usar KOB2 entero» y «crear kernel nuevo». Mantener una semántica Continuity Core independiente y probar dos substrates:

`ContinuityCoreSemantics`
`  ├─ KOB2-backed substrate`
`  └─ Clean/native substrate`

La igualdad buscada es semántica:

`same logical continuity -> same contracts/meta-state -> same entity sequences -> same derived positions -> same logical vectors -> equivalent projections`.

Así el Core limpio funciona como especificación/oráculo y KOB2 como realización criptográfica/material.

---

## 1. Capacidades verificadas de KOB2 9.0.1 [E]

Kernel puro:

- `Frame` conserva fronteras entre átomos;
- `View = Clear ⊔ Keyed(B^32)`;
- derivación de identidad/contenido/nombre;
- `Cell` de descriptor + referent;
- `EMIT / EXPAND / FOLLOW`;
- `Trajectory` e `Index`;
- `Envelope.seal/open`;
- `Recognition`;
- `Resolution` con `EXACT`, `CHAIN`, `FORK`, etc.

En `Keyed(d)`, derivaciones usan HMAC-SHA-256 y envelopes usan AES-GCM. El envelope autentica/cifra `Cell || B`; en Clear el cuerpo queda visible.

La suite histórica registra 26 pruebas del kernel.

Mechanisms 1.0.0 añade construcciones derivadas como Continuity, Publication, CoordinateTable, Coproduct, Evidence, DescriptorTable, Closure, Domain y Authority; su atlas formula explícitamente:

`Kernel ⊢ Mechanism`.

Esta filosofía coincide muy bien con Continuity Core: no elevar una construcción útil a primitive si puede derivarse de leyes menores.

---

## 2. KOB2 encaja especialmente bien como bootstrap material

El BootstrapKernel general necesita:

1. framing/material exacto;
2. identidad/contenido/nombres reproducibles;
3. lectura de historia/composición;
4. reconocimiento y resolución;
5. una gramática extensible.

KOB2 ya ofrece esas cinco familias.

Por tanto una variante fuerte es:

`BootstrapKernel := KOB2 9.0.1 + minimal mechanism set`.

Continuity Core quedaría encima y NO dentro del kernel puro.

---

## 3. Capas propuestas

### L0 — KOB2 puro

`Frame + View + Derivation + Cell + Trajectory + Index + Grammar + Envelope + Recognition + Resolution`

### L1 — Mechanisms

`Continuity + Closure + Descriptor grammar + Evidence + Publication + Domain/View + Authority + Record/Chunk mechanisms`

### L2 — Continuity Core

`ContractDefinition + EntityKind + ConstitutiveOrder + DerivedPosition + ParameterDefinition + Fold + Relation + Materialization`

### L3 — AppTemplate

`Commerce`, futuras Apps.

### L4 — Projections

`Catalog + POS views + JSON + DB + public derivatives`.

Regla:

`L(n+1)` puede usar propiedades de `L(n)`; no reescribir leyes de capas inferiores para acomodar una App.

---

## 4. K5.1 no debe fusionarse a ciegas con Envelope

K5.1 actual:

`[T16][W8][LEN][BODY][HASH256][PAD0]`.

KOB2 ya posee framing, ContentId, commitment, Cell descriptor y Envelope cifrado/autenticado.

Hay solapamiento, pero no identidad de propósito.

### K5.1 aporta especialmente

- delimitación de records concatenados/streaming;
- recuperación de un append-file;
- verificación local de cada record sin necesitar un objeto KOB2 exterior;
- codec/tipo material explícito para un record dentro de un archivo.

### KOB2 aporta especialmente

- identidad de contenido bajo View;
- nombres opacos/derivados;
- cifrado/confidencialidad Keyed;
- relación exacta Cell↔contenido;
- historia `FOLLOW` y composición `EXPAND`;
- reconocimiento/forks.

Conclusión provisional:

**K5.1 debe estudiarse como Mechanism/record profile construido sobre/compatible con KOB2, no como nueva primitive automática ni como reemplazo del Envelope.**

---

## 5. Mecanismo propuesto: Record

Aplicar la forma canónica del Atlas de Mechanisms.

### CONCEPT

Record auto-delimitable/verificable para trayectorias/chunks locales.

### REQUIRES

`Bytes/Frame` y una ley de exactitud; en profile KOB2 puede apoyarse además en `ContentId/Envelope`.

### CONSTRUCTION

Profile standalone: materialización K5.1.

Profile KOB2-backed: record/chunk se convierte en `B` de una Cell exacta y luego se sella bajo View.

### LAW

Un lector puede determinar frontera completa y detectar cuerpo truncado/corrupto antes de incorporarlo.

### DOES NOT IMPLY

Authority, semantic validity, continuity, encryption o ordering.

### OPEN

Determinar experimentalmente si el `HASH256` interno es redundante cuando cada record/chunk siempre vive dentro de un Envelope KOB2. No eliminarlo antes de probar recuperación local/streaming.

---

## 6. Flujo privado cifrado

Propuesta:

`Local semantic facts`
`  -> Record/Chunk encode`
`  -> KOB2 exact Cell`
`  -> Envelope.seal(Keyed(d_private))`
`  -> opaque Name`
`  -> untrusted network/storage`.

Lectura:

`network/storage`
`  -> candidate envelopes`
`  -> open/recognize(Keyed(d_private))`
`  -> verified plaintext chunk`
`  -> parse records`
`  -> Continuity Core fold`
`  -> M_h`.

Esto permite que almacenamiento/red no necesiten entender Product, Price, Sale ni siquiera el contenido plaintext.

---

## 7. Qué queda visible aun cifrando

KOB2 Keyed protege contenido frente a quien no conoce `d`, pero no debe describirse como ocultación total.

El diseño es determinista para igual contenido/contexto y la documentación histórica advierte que repeticiones exactas pueden ser observables.

Además storage/red puede observar tamaños, existencia de objetos, tiempos y patrones de acceso según el adapter.

Por tanto:

`ConfidentialContent != TrafficPatternPrivacy`.

---

## 8. View no es Authority

Este punto es obligatorio.

En KOB2, quien posee `d` puede abrir y también sellar envelopes válidos bajo `Keyed(d)`.

Si dos lectores comparten la misma View pero deben tener permisos de escritura distintos, `d` no contiene información suficiente para distinguirlos.

Por tanto:

`SameView + DifferentWriteAuthority => additional authority cause required`.

Continuity Core debe mantener Authority como contrato separado de confidentiality/readability.

---

## 9. Servidor: tres roles posibles

### A — Storage ciego

Servidor conserva envelopes opacos y no conoce `d`.

Ventaja: mínimo conocimiento.

Límite: no puede evaluar reglas de negocio que requieren plaintext.

### B — Authority confiable

Servidor/authority puede constituir `Keyed(d)` y evaluar continuidad.

Ventaja: decisiones online/atomicidad central sencilla.

Coste: el servidor entra en el perímetro de confidencialidad.

### C — Split authority

Servidor recibe pruebas/solicitudes acotadas o claves/capabilities más estrechas.

Ventaja: minimiza exposición.

Coste: mecanismo mucho más complejo y no debe anticiparse sin necesidad.

Para las primeras probetas probar A y B; no diseñar C prematuramente.

---

## 10. Derivado público desde continuidad privada

El catálogo público debe modelarse como una PROYECCIÓN deliberada, no como 'descifrar públicamente' la continuidad privada.

`M_private,h = Project(C_private,h)`

`Catalog_h = PublicProjection(M_private,h, ProjectionPolicy_h)`.

Después se publica como material/continuidad distinta:

`Catalog_h -> KOB2 Clear (o una View de audiencia distinta) -> public storage`.

Campos no incluidos en `ProjectionPolicy` no salen de la frontera privada.

Esto permite:

`private encrypted causes -> authorized local projection -> public derived reality`.

---

## 11. Por qué el catálogo público debe ser una realidad separada

`Clear` y `Keyed(d)` generan identificadores/nombres diferentes y tienen propiedades de audiencia distintas.

Además el catálogo puede omitir costo, proveedor, notas internas, autoridad, historia completa, etc.

Por tanto:

`PublicCatalog != ClearView(PrivateContinuity)`

Más preciso:

`PublicCatalog = Projection_of(PrivateContinuity, policy, cut)`.

Puede poseer identidad/historia propia si necesitamos evolución/publicación incremental.

---

## 12. Autoría del derivado público

`Clear` ofrece materialidad pública verificable, pero no identifica por sí mismo quién tenía derecho a actualizar el catálogo.

Si el catálogo público debe ser writable solo por el comercio, necesitamos una Authority separada (firma/capability/source single-writer u otra realización).

`Public readability != Public write authority`.

---

## 13. Provenance pública opcional

Un consumidor público no puede verificar por sí mismo una referencia privada Keyed que no puede abrir.

Si queremos demostrar que un catálogo proviene de cierto corte privado, hace falta una evidencia pública adicional, por ejemplo:

- attestation/signature del authority;
- commitment público deliberado;
- otra relación verificable.

No es necesaria para el funcionamiento básico del catálogo y no debe introducirse sin una pregunta concreta.

---

## 14. Rotación de View

KOB2 histórico modela Domain/View como mecanismo evolutivo, pero el transporte semántico entre generaciones de `d_t` fue reconocido como pregunta abierta.

Por tanto el uso real de Keyed para historia larga debe decidir:

- cómo un miembro vigente abre historia antigua;
- si se conservan claves antiguas;
- si se re-encripta;
- si se introducen epochs/generaciones.

No esconder esta pregunta bajo la palabra 'rotación'.

---

## 15. Tensión con CoordinateTable histórico

El Atlas viejo de Mechanisms define `CoordinateTable` como causa persistente de coordenadas.

Continuity Core actual adopta una doctrina más minimal:

`Position = Consequence(ConstitutiveOrder)`.

Por tanto **NO debemos reutilizar CoordinateTable 1.0.0 como ontología sin revisión**.

Opciones:

1. reemplazarlo por `DerivedCoordinateTable`, materialización reconstruible;
2. conservar CoordinateTable solo cuando exista una razón real para que la asignación de coordenada sea un hecho irreducible;
3. demostrar que cierto orden constitutivo KOB2 ya hace derivable el slot.

Esta diferencia es un punto explícito de investigación, no una inconsistencia que deba ocultarse.

---

## 16. Tensión con Trajectory

KOB2 Trajectory fue diseñada como historia de realizaciones exactas de una identidad.

Continuity Core usa trayectorias/órdenes también para hechos/eventos constitutivos.

No debemos asumir automáticamente que 'lista de eventos' = `KOB2.Trajectory` sin definir el mecanismo.

Probar dos realizaciones:

- `EventFiber`: mecanismo que interpreta una Trajectory exacta como secuencia de eventos constitutivos;
- `Chunk/manifest`: records append-only agrupados en chunks exactos y una continuidad KOB2 que sigue sus manifests/roots.

Comparar coste, semántica y crecimiento.

---

## 17. Arquitectura híbrida candidata

Para alta escala/offline-first:

`OPFS/IndexedDB local`
`  -> append K5/Record stream`
`  -> chunk immutable records`
`  -> KOB2 seal chunk under Keyed(d)`
`  -> publish opaque chunk`
`  -> KOB2 continuity tracks current root/manifest`.

Así:

- Continuity Core controla semántica de records/vectores;
- K5/Record resuelve append/recuperación local;
- KOB2 resuelve identidad exacta, cifrado, nombres, historia de roots/composición;
- storage sigue siendo ciego.

Este diseño evita forzar una Trajectory KOB2 gigantesca por cada evento.

---

## 18. Dos tracks de probeta

### Track A — Clean Core

Bootstrap mínimo propio + K5/Record + local append + explicit semantics.

Objetivo: máxima claridad y mínimo residuo.

### Track B — KOB2-backed

KOB2 kernel + Mechanisms revisados + Record/Chunk + Continuity Core.

Objetivo: reutilizar criptografía/identidad/closure ya implementadas.

### Prueba diferencial

Para el mismo fixture lógico:

`Interpret_A(fixture) == Interpret_B(fixture)`

en:

- contratos;
- admisiones;
- secuencias;
- posiciones;
- vectores;
- relaciones;
- proyección pública.

Las diferencias materiales son permitidas; las semánticas no.

---

## 19. Recomendación actual

**No abandonar KOB2 y no acoplar Continuity Core a KOB2.**

Usar KOB2 como el primer substrate serio de Continuity Core y mantener un substrate limpio mínimo como referencia.

Esto nos permite capturar el valor ya construido sin convertir decisiones históricas de KOB2 en axiomas irrevisables.

---

## 20. Próximas probetas

`KB0` — abrir/sellar record simple Clear vs Keyed.

`KB1` — K5.1 dentro de EMIT y análisis de redundancia hash/commitment.

`KB2` — chunk de records K5.1 cifrado; corrupción/truncamiento local y remoto.

`KB3` — misma continuidad lógica en Clean y KOB2; comparar posiciones/vectores.

`KB4` — public projection: private Keyed -> catalog Clear.

`KB5` — dos usuarios con misma View y authority distinta; demostrar por qué View no basta.

`KB6` — server storage ciego vs server authority confiable.

`KB7` — descriptor/contract extension cifrada y descubrible solo por View.

`KB8` — View rotation/epoch lab.

`KB9` — EventFiber vs ChunkManifest para continuidad grande.

---

## 21. Frases canónicas

**KOB2 puede ser el bootstrap material de Continuity Core sin convertirse en su ontología completa.**

**K5.1 puede ser un mecanismo de record/chunk encima del kernel; no debemos duplicar primitivas sin probar la necesidad.**

**Private continuity can be Keyed; public catalog is a separate projection, not the private continuity made Clear.**

**View controls evaluability/confidentiality; Authority controls legitimate evolution.**

**Mantener Clean y KOB2-backed en paralelo convierte la comparación en una prueba de independencia semántica.**