# Views, ámbitos y derivados — integración mínima de KOB2 con Continuity Core

**Fecha:** 2026-11-22
**Estado:** refinamiento canónico de integración. Objetivo: usar propiedades ya existentes de KOB2 sin contaminar Continuity Core con lógica de cifrado o audiencia.

## 0. Decisión

Continuity Core permanece semánticamente autónomo.

KOB2 se incorpora mediante una frontera/adaptador de materialización y recorrido:

`LogicalContinuity <-> KOB2ViewAdapter(view, storage/query)`

El Core no necesita saber si la evidencia está pública, cifrada para una red o cifrada para un ámbito privado.

---

## 1. KOB2 solo necesita dos ramas materiales

KOB2 9.0.1 implementa:

`View = Clear ⊔ Keyed(d)`.

No hace falta añadir primitivas `Public`, `Network` y `Private`.

Son perfiles de uso:

`Public := Clear`

`Network := Keyed(d_net)` donde d_net es compartida por los miembros de la red correspondiente

`Private := Keyed(d_priv)` donde d_priv está restringida al ámbito privado correspondiente.

Por tanto:

`AudienceProfile != KernelPrimitive`.

---

## 2. World como evaluación bajo View

El mecanismo histórico de KOB2 permite entender:

`World(v,entry,E) = Closure_v(entry,E)`.

Así, público/red/privado son ámbitos de evaluación/recorrido bajo distintas Views y entradas, no tres kernels.

Una misma ley de Continuity Core puede materializarse en cualquiera de esos ámbitos.

---

## 3. Privado por defecto

Para una App Commerce podemos elegir:

`C_private -> KOB2 Keyed(d_commerce)`.

Storage/red conserva envelopes opacos.

Solo un nodo capaz de constituir/poseer la View pertinente puede abrirlos, recorrerlos e interpretar la continuidad.

Esto permite que privacidad sea una propiedad del substrate y no una lógica repetida en Product/Sale/Price/etc.

---

## 4. Derivados como nuevas realidades

No se abre la continuidad privada al público.

Se deriva una realidad nueva:

`D_a,h = Projection_a(C_private,h, Policy_a)`.

Después se materializa bajo la audiencia deseada:

`Publish_a(D_a,h, View_a)`.

Ejemplos:

`CatalogPublic = Projection(C_private, catalogPolicy) -> Clear`

`AffiliateFeed = Projection(C_private, affiliatePolicy) -> Keyed(d_affiliates)`

`InternalOps = Projection(C_private, internalPolicy) -> Keyed(d_internal)`.

Cada derivado puede tener contratos mínimos propios y, si necesita historia independiente, identidad/continuidad propia.

---

## 5. La red compartida es simplemente otra View

Una red de comercios afiliados no necesita un mecanismo criptográfico nuevo.

Si todos los miembros autorizados comparten/constituyen `d_net`, entonces:

`W_net = Closure_Keyed(d_net)(entry_net)`.

Allí puede publicarse un derivado diseñado para vendedores afiliados.

Importante:

`membership/readability under d_net != write authority`.

Quien puede abrir una View compartida puede también producir envelopes válidos bajo esa misma View; si la escritura debe restringirse más, Authority necesita una causa adicional.

---

## 6. Semántica inicial / contratos

Los contratos de Continuity Core pueden distribuirse según necesidad de audiencia.

Ejemplos:

- meta-contratos/bootstrap universal: código conocido por el runtime;
- contratos públicos de un derivado público: Clear;
- contratos de una red: Keyed(d_net);
- contratos internos/customizados: Keyed(d_private).

No existe obligación de publicar los contratos de la continuidad privada para que un derivado público sea interpretable: el derivado puede contener/referenciar solo la gramática mínima necesaria para él.

---

## 7. El Name no auto-etiqueta el ámbito

KOB2 deriva `Name` bajo la View; por eso el mismo objeto lógico bajo Clear y Keyed produce Names diferentes.

Pero el hash/Name de 32 bytes no debe tratarse como una etiqueta humana auto-descriptiva `public/network/private`.

El ámbito se conoce por el contexto/View con el que se derivó o por metadata exterior del adaptador. El Envelope sí incluye `ViewKind` (Clear/Keyed), pero no identifica qué clave compartida concreta representa 'red A' o 'privado B'.

Si necesitamos etiquetar ámbitos operativamente, hacerlo en configuración/adaptador, no alterar la semántica del Name.

---

## 8. Adaptador KOB2

Frontera conceptual:

`KOB2ViewAdapter`

Entradas:

- View o capacidad para constituirla;
- root/entry;
- bytes/facts/chunks a materializar;
- query/put del Storage.

Salidas:

- evidencia abierta y verificada para Continuity Core;
- envelopes/names preparados para publicación;
- estados explícitos de ausencia, fork, falta de capacidad, etc.

Responsabilidad:

- traducir material lógico <-> material KOB2;
- aplicar `seal/open/recognize/resolve`;
- mantener detalles de View/Name/Envelope fuera del Core.

NO le pertenece:

- decidir Price/Stock/Sale;
- decidir legitimidad comercial;
- definir proyecciones de negocio;
- convertir View en Authority.

---

## 9. Flujo privado

`UI/App`
` -> local proposal`
` -> Continuity Core`
` -> Record/Chunk materialization`
` -> KOB2ViewAdapter(Keyed(d_private))`
` -> Storage/Network`.

Lectura:

`Storage/Network`
` -> KOB2ViewAdapter(Keyed(d_private))`
` -> verify + persist local`
` -> Continuity Core fold`
` -> local materialization`
` -> UI`.

---

## 10. Flujo de derivado público

`C_private,h`
` -> local authorized reconstruction`
` -> ProjectionPolicy_public`
` -> D_public,h`
` -> KOB2ViewAdapter(Clear)`
` -> public Storage/Network`.

Los consumidores:

`Clear material -> verify/persist local -> interpret derived continuity -> UI/catalog`.

No necesitan ni pueden recorrer C_private.

---

## 11. Flujo de derivado de red

`C_private,h`
` -> ProjectionPolicy_net`
` -> D_net,h`
` -> KOB2ViewAdapter(Keyed(d_net))`
` -> network storage`.

Miembros con `d_net` reconstruyen D_net.

No reciben automáticamente C_private ni información omitida por `ProjectionPolicy_net`.

---

## 12. Por qué esto simplifica Continuity Core

Continuity Core puede comenzar con un solo actor y asumir simplemente:

`read(facts) / append proposals / constitute / derive`.

Privacidad, audiencia y red quedan ortogonales.

Después, al conectarlo a KOB2, el mismo Core obtiene:

- Clear public world;
- Keyed shared network worlds;
- Keyed private worlds;
- nombres opacos por View;
- cifrado/autenticación de envelopes;
- FOLLOW/EXPAND/EMIT y Closure;
- almacenamiento ciego posible.

Sin reescribir la semántica.

---

## 13. Regla de desarrollo

Primero probar cada mecanismo de Continuity Core en el modelo limpio.

Después probar la misma semántica a través de `KOB2ViewAdapter`.

Solo si una propiedad de KOB2 cambia una necesidad semántica real debe subir al Core.

En caso contrario permanece como propiedad del substrate/adaptador.

---

## 14. Fórmula canónica

`SemanticContinuity`
`  -> Projection(policy)`
`  -> AudienceMaterialization(View)`
`  -> Storage/Network`.

Y en sentido de lectura:

`Storage/Network`
`  -> View recognition`
`  -> Local verified evidence`
`  -> SemanticContinuity`.

---

## 15. Síntesis

**KOB2 no redefine la continuidad: define una forma extremadamente útil de localizar, reconocer, cifrar y recorrer su evidencia material.**

**Public, network-shared y private no requieren tres kernels: son perfiles de `Clear` y `Keyed(d)` más políticas de proyección.**

**Un derivado no concede acceso a la continuidad fuente: constituye otra realidad deliberadamente más pequeña para otra audiencia.**

**El adaptador mantiene KOB2 y Continuity Core autónomos.**
---

## 16. Derivado de red no es canal de autoridad

Para afiliados/vendedores:

`C_private -> ProjectionPolicy_net -> D_net -> Keyed(d_net)`.

Los miembros de la red reconstruyen `D_net` para conocer productos/ofertas permitidas.

Si un miembro quiere vender, su acción nace como propuesta en su propio ámbito/trajectory:

`Gamma_affiliate -> SaleRequest(ProductRef,Quantity,...) -> Authority_private`.

La autoridad privada evalúa y, si corresponde, constituye el efecto en `C_private`.

Después una nueva proyección de red refleja el estado actualizado.

Por tanto:

`ReadSharedDerivative != WriteSourceContinuity`

y:

`SharedView != SharedAuthority`.

Esto preserva colaboración sin entregar la capacidad de evolución de la continuidad fuente a todos los poseedores de `d_net`.

## 17. Terminología de clave

`Keyed(d)` usa secreto simétrico compartido. No llamarlo `clave pública` en sentido criptográfico asimétrico.

Usar:

- `d_private`: secreto privado del ámbito;
- `d_net`: secreto compartido por miembros de una red;
- `Clear`: sin secreto de lectura.

Si `d_net` es conocida por todos los miembros, todos ellos pueden evaluar el mundo de red; eso es una decisión de audiencia, no una prueba de autoridad individual.
