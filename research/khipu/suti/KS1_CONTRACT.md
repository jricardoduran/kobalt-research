# Khipu Suti KS1 — contrato mínimo de nombres de linaje

**Fecha:** 2026-11-21 12:24 UTC-5

## 1. Motivación

Evitar coordinación global para nombrar entidades que nacen offline. El nombre debe conservar procedencia suficiente para que dos escritores independientes nunca necesiten disputar el mismo contador.

## 2. Coordenadas

`EntityId = U32 || N64 || L32`

- `U32`: coordenada compacta del usuario dentro de una autoridad/jurisdicción. No es la identidad humana completa. La probeta usa `00000000` como primer usuario.
- `N64`: identificador autónomo del nodo. Cada nodo puede nacer offline.
- `L32`: coordenada monotónica local del nodo. No existe contador global.

Binario canónico: 16 bytes big-endian.

Texto canónico: `uuuuuuuu_nnnnnnnnnnnnnnnn_llllllll`, hexadecimal minúsculo y ancho fijo.

El tipo no se codifica en el ID. `productId`, `saleId`, etc. ya son campos tipados por contrato.

## 3. Leyes

### KS1.1 — Procedencia

`Parse(id) -> (U,N,L)`.

### KS1.2 — Separación nodal

Si `N_a != N_b`, entonces:

`KS(U,N_a,L) != KS(U,N_b,L)`.

### KS1.3 — Asignación local

`L` solo necesita ser único/monotónico dentro de `(U,N)`. El nodo puede asignarlo offline.

### KS1.4 — Nombre != autoridad

Poseer o producir un nombre válido no concede autoridad sobre la continuidad compartida.

### KS1.5 — Nombre != equivalencia semántica

Dos IDs distintos continúan siendo dos entidades distintas aunque sus atributos sean iguales. Declarar que representan el mismo objeto real es una decisión de dominio/autoridad.

### KS1.6 — No reciclaje histórico

Una entidad deshabilitada conserva su ID. Nunca se renombra ni se borra de la trayectoria/continuidad histórica.

## 4. Autoridad frente a consenso

La arquitectura evita buscar consenso donde no existe un conflicto matemático.

Dos nodos pueden crear simultáneamente:

`P_A = KS(U,A,0)`

`P_B = KS(U,B,0)`

con los mismos atributos. No hay colisión nominal: `P_A != P_B`.

Si la realidad comercial dice que son duplicados, una autoridad puede constituir después:

`ProductStatus(P_B, enabled=false, reason=duplicate, canonical=P_A)`.

No se reescribe `ProductCreate(P_B)`.

Solo cuando existe un invariante realmente compartido —por ejemplo una unidad de stock— se necesita coordinación de admisión (CAS del `head`).

## 5. Integridad referencial causal

Una venta de `P` solo puede constituirse si `P` ya está constituido y habilitado en el corte causal usado para evaluar la solicitud.

`Sale(P)` requiere `Product(P) ≺ Sale(P)`.

Crear `P` después no legitima retroactivamente una venta rechazada antes.
