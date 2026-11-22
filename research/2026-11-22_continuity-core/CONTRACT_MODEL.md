# Modelo general de contratos — Continuity Core

**Fecha:** 2026-11-22

## 1. Meta-contratos mínimos

El BootstrapKernel debe reconocer un metalenguaje mínimo capaz de constituir definiciones de:

- EntityKind;
- Parameter;
- Fold/update algebra;
- Representation profile;
- Relation/invariant;
- Authority policy/reference;
- Contract extension/status.

El objetivo no es meter Product/Price/etc. en el bootstrap.

## 2. Contrato de clase

`EntityKindDefinition(K)`

Declara que K es una clase válida. Si requiere posiciones estables, referencia/define el mecanismo que induce `prec_K`.

## 3. Contrato de parámetro

`ParameterDefinition(A, host=K, valueSemantics=D_A, fold=F_A, representation=R_A?)`

Separaciones:

`Host != ValueSemantics != Fold != Representation`.

`R_A` puede ser una recomendación/contrato de materialización y no necesariamente parte de la semántica causal.

## 4. Contrato de relación

`RelationDefinition(R, dependencies={A1,...,Ak}, invariant/function)`

Permite clasificar transformaciones como Independent, Sequenciable, AtomicBatch, Conflict o Invalid.

## 5. Contrato de extensión

`ContractProposal(X)` nace localmente.

`Authority -> ContractAdmitted(X) | Rejected(X)`.

Después:

`ContractAdmitted(X) prec Use(X)`.

## 6. Entidad nueva + parámetro nuevo

Dependencias mínimas:

`Admit_K(E) prec Assign(E,A,v)`

`DefineParameter(A) prec Assign(E,A,v)`.

No imponer orden entre Admit(E) y Define(A) sin una relación adicional.

## 7. Clases dinámicas

Un AppInstance puede ganar un nuevo `EntityKindDefinition(K2)` y desde entonces admitir identidades de K2.

Esto permite que Commerce empiece con Product/Sale y luego añada Supplier/Warehouse/etc. sin modificar el motor general.

## 8. Plantillas reutilizables

Semánticas: Unsigned, Signed, FixedPoint, Boolean, Enum, Reference, Text/BlobRef, Set/List, State.

Folds: LatestAuthorizedAssignment, SumMovements, SetUnion, ApplyTransitions, DerivedFunction.

Representaciones: dense/sparse/bitmap/fixed-width/dictionary/reference slots/string pool/hash refs/delta.

## 9. Regla de especialización

Antes de definir un contrato de negocio específico preguntar:

`¿puede expresarse como composición de contratos generales existentes?`

Solo crear un contrato nuevo si introduce semántica irreducible.