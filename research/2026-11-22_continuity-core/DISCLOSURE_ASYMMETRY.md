# Asimetría de divulgación, audiencia mínima y derivación hacia afuera

**Fecha:** 2026-11-22
**Estado:** regla conceptual canónica para Continuity Core + KOB2.

## 0. Tesis

Entre una realidad privada y una realidad pública existe una asimetría fundamental:

> **De una fuente más restringida siempre podemos derivar posteriormente una realidad más abierta; de una realidad ya divulgada no podemos recuperar la confidencialidad de lo que ya conoció una audiencia mayor.**

Por tanto la privacidad inicial conserva opciones futuras; la publicidad inicial las consume.

---

## 1. Orden de audiencias

Sea `Aud(X)` el conjunto de actores capaces de reconstruir X.

Definimos:

`X <=aud Y  iff  Aud(X) subseteq Aud(Y)`.

Entonces una audiencia privada puede estar contenida en una audiencia de red, y esta en la audiencia pública:

`Aud_private subseteq Aud_network subseteq Aud_public`.

En KOB2:

- `Clear` representa naturalmente audiencia abierta;
- `Keyed(d_G)` representa naturalmente una audiencia restringida al grupo que posee/constituye `d_G`.

---

## 2. Irreversibilidad de divulgación

Si un hecho `x` se publica a una audiencia A:

`x -> A`

no existe una operación posterior que garantice que los miembros de A dejen de conocer x.

Cifrar después una nueva copia no revoca el conocimiento ya divulgado.

Por tanto:

`Public(x) -> Private(x)`

solo puede significar 'las futuras materializaciones serán privadas', nunca 'x vuelve a ser secreto'.

Regla:

`Disclosure is knowledge-monotone`.

---

## 3. Derivación hacia afuera

El movimiento seguro/natural es:

`C_restricted -> Projection_P -> D_less_sensitive -> WiderView`.

Ejemplo:

`C_private @ Keyed(d_priv)`

` -> Projection_catalog`

` -> D_public @ Clear`.

No convertimos la continuidad fuente a Clear; construimos otra realidad que contiene exactamente lo publicable.

---

## 4. Valor de opción de la privacidad

Una fuente privada conserva múltiples futuros posibles:

`C_private -> D_public`

`C_private -> D_network`

`C_private -> D_partner`

`C_private -> D_internal`.

Una fuente pública no conserva la opción de retirar de la audiencia aquello ya expuesto.

Por tanto, cuando `Clear` y `Keyed` tienen coste conceptual comparable, una audiencia más restringida posee mayor **valor de opción**.

Regla de decisión:

> **Si no existe una finalidad positiva para que la historia completa sea pública, elegir la audiencia mínima necesaria.**

---

## 5. Principio de audiencia mínima

Para una realidad X con función f:

`PreferredAudience(X) = minimal A such that A can fulfill f`.

Después:

`PreferredView(X) = Clear` si `A = Everyone`;

`PreferredView(X) = Keyed(d_A)` si `A` es un grupo restringido.

Esto es análogo al principio de mínimo privilegio, pero aplicado a divulgación:

`LeastNecessaryAudience`.

---

## 6. Regla de no-ampliación accidental

Una nueva necesidad de lectura no debe ampliar automáticamente `Aud(C_source)`.

En su lugar:

`Need_G(C) -> Projection_G(C) -> D_G -> View_G`.

Solo si la audiencia realmente necesita toda la fuente y existe una razón de dominio para ello se amplía la audiencia de la fuente.

---

## 7. Tres scopes prácticos

### Dominio privado

`Keyed(d_domain)`.

Para historia constitutiva completa, contratos internos, ventas detalladas, costos, proveedores, datos personales, decisiones de autoridad, etc.

### Red/cooperación

`Keyed(d_network)`.

Para gramática/contratos compartidos por miembros de una red, feeds de cooperación, catálogos cooperativos, capacidades de lectura comunes.

El secreto es compartido de red; no llamarlo clave pública asimétrica.

### Público

`Clear`.

Para derivados cuya información puede ser conocida por cualquiera sin daño ni pérdida de una opción futura relevante.

---

## 8. Apps y lógica de lectura

Una App puede separar:

- `BootstrapKernel`: universal/conocido por runtime;
- `AppNetworkGrammar`: contratos/lógica compartida por los miembros que deben interpretar esa familia de continuidades;
- `InstancePrivateContracts`: contratos/customizaciones propios de una continuidad concreta;
- `PublicDerivativeGrammar`: solo la gramática necesaria para interpretar un derivado público.

Una opción natural es:

`BootstrapKernel` conocido universalmente;

`AppNetworkGrammar -> Keyed(d_appNetwork)` cuando solo la red de la App necesita recorrerla;

`InstancePrivateContracts -> Keyed(d_instance)`;

`PublicDerivativeGrammar -> Clear` únicamente si el derivado público la necesita.

Esto evita publicar toda la lógica/metaestructura de una App solo porque existe un frontend público.

---

## 9. Commerce

Patrón natural:

`C_commerce @ Keyed(d_commerce)`.

De allí:

`D_catalog @ Clear`;

`D_affiliates @ Keyed(d_affiliateNetwork)`;

`D_partner @ Keyed(d_partner)`;

`D_store_i @ Keyed(d_store_i)` si una tienda concreta necesita información propia.

Cada derivado revela solamente las consecuencias necesarias.

---

## 10. Stock multitienda

Una venta completa puede permanecer únicamente en `C_commerce`.

Las otras tiendas pueden recibir:

`D_stock = Projection_stock(C_commerce)`

con:

`ProductRef -> AvailableQty`.

Así una causa privada produce una consecuencia compartida sin divulgar comprador, tienda originadora, precio, pago ni historia de venta.

---

## 11. De red a público

También un derivado de red puede producir un derivado público:

`D_network @ Keyed(d_net) -> Projection_public -> D_public @ Clear`.

De nuevo, la dirección natural es hacia una audiencia igual o mayor mediante una reducción explícita de información.

---

## 12. De público a privado

Podemos crear una nueva continuidad privada que use hechos previamente públicos:

`D_public -> C_new_private`.

Pero esto NO vuelve privados los hechos originales.

Solo permite que nuevas causas posteriores permanezcan restringidas.

Distinción:

`private successor != restored secrecy`.

---

## 13. Coste de error asimétrico

Error A: algo que podía ser público nació privado.

Corrección:

`Projection -> Clear`.

Coste: derivación/publicación adicional, normalmente reversible/controlable.

Error B: algo que debía ser privado nació público.

Corrección:

podemos dejar de publicarlo en adelante, pero la divulgación histórica no puede deshacerse.

Coste: potencialmente irreversible.

Por tanto, bajo incertidumbre razonable:

`PreferRestricted`.

---

## 14. Regla de decisión bajo incertidumbre

Si no sabemos todavía cuál será la audiencia final:

`UnknownAudience + low extra cost of Keyed => choose restricted View`.

Después podemos abrir exactamente lo necesario mediante derivados.

Esto minimiza el peor error irreversible.

---

## 15. Relación con Authority

Esta regla no cambia la definición de Authority.

`Authority_C` sigue determinando qué puede constituirse en C.

La audiencia/View responde otra pregunta:

`who can reconstruct C or D`.

El hecho de que una escritura pase por Authority hace natural que la continuidad completa permanezca dentro del mismo dominio restringido de lectura, pero no lo exige matemáticamente.

Si la historia constitutiva es deliberadamente pública, puede estar en `Clear` con Authority igualmente restringida.

---

## 16. Algoritmo abreviado

Para cada realidad X:

1. ¿qué función cumple?;
2. ¿quién constituye cambios?;
3. ¿qué audiencia mínima necesita la fuente completa?;
4. si la respuesta no es Everyone, usar `Keyed(d_domain/group)` por defecto;
5. enumerar audiencias externas;
6. construir para cada una el mínimo derivado suficiente;
7. elegir `Clear` solo cuando la audiencia deseada sea Everyone;
8. nunca ampliar la fuente solo para satisfacer una nueva audiencia si un derivado basta.

---

## 17. Invariantes

1. `PublicOnce(x)` no puede implicar `SecretAgain(x)`.
2. `PrivateSource -> PublicDerivative` es natural y controlable.
3. `NewAudience != ExpandSourceAudience` por defecto.
4. `LeastNecessaryAudience` precede selección de View.
5. `Clear` debe responder a una finalidad pública positiva, no a una costumbre técnica.
6. `Keyed` no implica Authority; solo restringe evaluabilidad/materialidad.
7. La proyección es el mecanismo normal para ampliar audiencia sin ampliar exposición de la fuente.

---

## 18. Frases canónicas

**La privacidad conserva opciones; la publicidad consume opciones.**

**De restringido a público derivamos; de público a privado no podemos borrar conocimiento.**

**La fuente nace con la audiencia mínima necesaria; las audiencias mayores reciben derivados.**

**Clear debe ser una decisión de propósito, no el valor por defecto heredado de arquitecturas tradicionales.**

**Causa restringida, consecuencia compartida por propósito.**