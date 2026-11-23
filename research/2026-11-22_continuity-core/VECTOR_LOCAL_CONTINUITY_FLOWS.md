# Vector Core — flujos locales, trayectorias y continuidad

**Fecha:** 2026-11-22
**Estado:** especificación de implementación de la primera probeta ejecutable.

## 0. Tesis

Continuity Core debe distinguir tres objetos aunque vivan en el mismo navegador:

`Γ_n` — trayectoria local append-only del nodo n.

`Γ_A` — trayectoria local append-only de la Authority.

`C_app` — realidad constituida derivada de decisiones aceptadas; no es una trayectoria global.

Regla:

`Γ_n != Γ_A != C_app`.

Una misma máquina puede alojar los tres sin fusionar sus responsabilidades.

---

## 1. Registro local

Cada trayectoria contiene records encadenados:

`R_n,k = (nodeId,seq,prevHash,kind,payload,hash)`.

`hash = SHA256(canonical(record_without_hash))`.

Leyes:

`seq_(k+1)=seq_k+1`

`prevHash_(k+1)=hash_k`.

El hash detecta corrupción/truncación/coherencia material de la trayectoria; no crea Authority.

---

## 2. Qué escribe un nodo

Una acción humana/app no escribe C directamente.

`Action -> Proposal(q) -> append Γ_n`.

Ejemplos de propuesta:

`DefineEntity`
`DefineParameter`
`DefineRelation`
`AdmitEntity`
`Assign`
`Batch(facts)`.

El Proposal guarda además el `observedRevision` de C para diagnóstico, pero Authority siempre evalúa contra su C actual.

---

## 3. Qué escribe Authority

Authority observa propuestas disponibles y resuelve:

`Resolve_A(q,C_h) -> (ρ_q,ΔC)`.

Primero persiste un record `Decision` en `Γ_A`.

Decision aceptado contiene:

`proposalHash, accepted=true, orderedFacts, baseRevision, newRevision`.

Decision rechazado contiene:

`proposalHash, accepted=false, reason, baseRevision, newRevision=baseRevision`.

Así una respuesta puede ser durable aunque no cambie C.

---

## 4. Cómo emerge continuidad

`C_app` se reconstruye desde los Decision aceptados de `Γ_A` cuya causa Proposal es verificable.

`C_h = Closure({orderedFacts(d) | d in Γ_A, d.accepted})`.

`Γ_A` no es C porque Γ_A también contiene rechazos/respuestas y material operacional que no constituye realidad de App.

En esta probeta hay una sola Authority y su trayectoria aporta una fibra constitutiva lineal. Esto NO implica que toda continuidad general deba tener orden global total.

---

## 5. Flujo local completo de escritura

`UI action`
` -> build Proposal`
` -> append Proposal to Γ_n`
` -> UI muestra Pending`
` -> Authority lee q + reconstruye C_h`
` -> valida definiciones/identidades/tipos/referencias`
` -> resuelve invariantes/orden/guards`
` -> append Decision to Γ_A`
` -> si accepted, C_h -> C_h'`
` -> reconstruir/FoldDelta M_h'`
` -> UI muestra Accepted/Rejected`.

Si Authority es remota, entre Γ_n y Γ_A aparecen transporte/importación; la semántica no cambia.

---

## 6. Flujo local completo de lectura

`IndexedDB evidence`
` -> verify each Γ hash-chain`
` -> locate Authority Decisions`
` -> verify proposal references`
` -> constitute C_h from accepted decisions`
` -> replay meta-state K_h`
` -> replay domain S_h`
` -> derive S_K and pos_K`
` -> derive CurrentValue for each parameter`
` -> derive logical vectors V_A`
` -> evaluate derived/fold/state parameters`
` -> materialize M_h`
` -> project UI`.

---

## 7. Flujo DefineEntity

`CreateEntity(label)`
` -> Proposal{facts:[DefineEntity(K,label)]}`
` -> Γ_n`
` -> Authority validates unique identity`
` -> Decision accepted Γ_A`
` -> C includes DefineEntity`
` -> K_h includes K`
` -> UI shows 0 elements / 0 parameters`.

---

## 8. Flujo DefineParameter

`AddParameter(K,label,valueType,evolution)`
` -> Proposal DefineParameter(A,...)`
` -> Γ_n`
` -> Authority verifies K exists`
` -> Decision Γ_A`
` -> K_h includes A`
` -> logical V_A immediately exists over current S_K`.

If S_K=(E0,E1,E2):

`V_A=[bottom,bottom,bottom]` until causes assign/derive values.

---

## 9. Flujo CreateElement

UI may submit one atomic proposal containing:

`AdmitEntity(K,E)`
`Assign(E,A1,v1)`
`Assign(E,A2,v2)`
`...`

Authority resolves the batch, ensuring definitions/admission precede uses.

After acceptance:

`S_K' = S_K + E`

`pos_K(E)=last derived coordinate` in this single-authority fiber.

Existing positions remain stable.

---

## 10. Flujo SetValue / multi-edit

A single edit proposes one Assign.

Editing several fields proposes a Batch of Assigns.

Resolver classifies:

`Independent | Sequenciable(order) | AtomicBatch | Conflict | Invalid`.

For invariant `Discount<=Price`, proposed `Price 100->70` and `Discount 80->60` is sequenced:

`Discount->60 ; Price->70`.

---

## 11. Flujo Reference

`Reference(TargetKind)` validates identity, not positional slot.

Example:

`ProductRef:Sale->Product`.

`Assign(Sale0,ProductRef,P3)` requires P3 admitted in Product at evaluation cut.

Materialization may encode `pos_Product(P3)` locally after scope/cut is known.

---

## 12. Flujo Fold/Derived vector

Logical vectors share coordinates but not causality.

`Assignment`: latest accepted Assign.

`Derived`: reproducible function of current values.

`Fold`: reproducible fold over admitted source entities/events.

`State`: transition-constrained current value.

All expose:

`V_A[i]=CurrentValue(S_K[i],A)`.

---

## 13. Sale -> Stock

`Sale(ProductRef,Quantity)` is causal input.

`Stock:Product->Integer` is Fold/Derived.

General fold-by-reference profile:

`Stock(P)=Base(P)+Σ_j sign_j * Σ_{x in SourceKind_j, Ref_j(x)=P} Value_j(x)`.

Sale term uses sign -1.

Authority admission guard:

`Stock_h(ProductRef(s)) >= Quantity(s)`.

`CheckCurrentStock + AdmitSale` is one logical authority decision.

No authoritative `stock -= q` record is emitted.

---

## 14. Local-first/network

Local creation:

`Action -> Γ_n local first`.

Remote authority:

`Γ_n proposal -> outbox -> transport -> Authority local evidence -> Decision Γ_A -> transport -> verify -> persist local -> reconstruct C`.

Local authority probe:

transport collapses to an in-process handoff, but both trajectories remain separate.

---

## 15. Multi-node evidence

A local browser may possess records from several trajectories:

`E_local = ⨿ Γ_n`.

This is evidence, not continuity.

Continuity is computed only after Recognition + Authority semantics:

`E_local -> Recognize -> ResolveAuthority -> C_h`.

Thus importing arbitrary valid trajectory records does not grant them constitutive power.

---

## 16. Failure states

`Corrupt trajectory record` -> hash-chain invalid; exclude/unresolved.

`Missing predecessor` -> trajectory incomplete; unresolved.

`Proposal without Decision` -> Pending.

`Rejected Decision` -> durable response; no DeltaC.

`Accepted Decision missing Proposal cause` -> unresolved continuity evidence in strict mode.

`Stale proposal` -> reevaluate against current C; not automatically invalid.

`Reference target absent` -> reject/unresolved according to evidence completeness contract.

---

## 17. Persistence profile for first implementation

Browser-only:

`HTML + CSS + JavaScript + IndexedDB`.

No Node, no TypeScript, no Service Worker.

IndexedDB stores append-only trajectory records and small local configuration.

`C_h`, vectors, tables and UI are reconstructed projections; they are not stored as sovereign truth.

Export/import JSON transports trajectory evidence between browsers/nodes.

---

## 18. First executable probe

The UI must expose simultaneously:

1. current node `Γ_n`;
2. authority `Γ_A`;
3. derived continuity facts `C_h`;
4. entity sequences/positions;
5. logical vectors;
6. pending/accepted/rejected proposals;
7. entity/parameter/element editors.

Success means the user can see that a local proposal exists before C changes, and that only an accepted Authority decision changes C.

---

## 19. Canonical summary

**El nodo escribe su trayectoria; la Authority escribe decisiones en la suya; la continuidad emerge de aquello que las decisiones autorizadas constituyen.**

**La continuidad no es una trayectoria global.**

**Las posiciones y vectores se derivan de la continuidad, nunca del orden físico de IndexedDB.**

**Local-first significa que toda acción nace como evidencia local y toda lectura interpreta evidencia local reconocida.**