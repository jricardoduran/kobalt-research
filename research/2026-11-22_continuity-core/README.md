# Kobalt Continuity Core — 2026-11-22

**Fecha de inicio canónico:** 2026-11-22
**Estado:** línea principal general; Commerce pasa a ser una aplicación particular de estos mecanismos.

## 0. Propósito

Este directorio separa la teoría general de continuidades de cualquier App concreta.

Orden de trabajo canónico:

`Continuity mechanisms -> vector/parameter experiments -> verified reusable mechanisms -> Commerce specialization`

Commerce no debe introducir mecanismos estructurales nuevos salvo que aparezca una semántica irreducible que no pueda expresarse por composición de los mecanismos generales.

---

## 1. Continuidad autocontenida

Una continuidad C debe ser autocontenida causal y semánticamente:

`Meaning(C_h) = Interpret(Closure(Roots(C_h)))`

Al recorrer C deben poder descubrirse progresivamente contratos, clases de entidad, parámetros, relaciones, admisiones, órdenes constitutivos necesarios, hechos de dominio y referencias exactas.

No debe existir un schema mutable imprescindible escondido en una DB o código externo.

---

## 2. Bootstrap mínimo

Decir que basta la lógica de recorrido requiere una precisión: no existe interpretación desde cero absoluto.

El lector necesita un núcleo de bootstrap mínimo y estable capaz de:

1. delimitar/verificar material;
2. reconocer raíces/referencias;
3. interpretar el metalenguaje con el que se definen contratos;
4. aplicar reglas generales de recorrido y causalidad.

Después de ese bootstrap, el vocabulario concreto de la App emerge desde la propia continuidad.

`BootstrapKernel << AppSemantics`

El bootstrap no conoce Product, Sale, Price o Tax; conoce cómo leer definiciones que pueden llegar a definirlos.

---

## 3. AppTemplate y AppInstance

Una plantilla inicial de App es:

`AppTemplate_A = Genesis(InitialContracts_A, InitialCapabilities_A)`

Una continuidad concreta originada desde esa plantilla evoluciona:

`Contracts(C_h) = InitialContracts ∪ ConstitutedContractExtensions(C_h)`

y:

`AppInstance(C_h) = Contracts(C_h) + capabilities/vocabulary induced by those contracts`.

Así distinguimos:

- AppTemplate: contratos iniciales;
- AppInstance@h: contratos realmente constituidos/vigentes;
- Customización: extensiones constituidas después del génesis.

---

## 4. Contratos extensibles

Cualquier nodo con capacidad de propuesta puede crear localmente una propuesta de nuevo contrato, parámetro, relación o clase de entidad.

Que cualquiera pueda proponer no significa que cualquiera pueda constituir:

`ContractProposal -> Authority -> ContractAdmitted | Rejected`.

Una vez admitido:

`ContractAdmitted(X) prec Use(X)`.

Otros nodos lo descubren posteriormente al adquirir/recorrer el nuevo corte.

---

## 5. UI/programación como editor de metaestructura

Una UI general puede permitir crear clase de entidad, parámetro, template semántico, fold, codec preferido, relación o contrato.

La misma capacidad puede invocarse programáticamente.

La UI no escribe C directamente:

`UI -> LocalProposal -> Authority -> DeltaC -> Reconstruct`.

---

## 6. Clases de entidad dinámicas

Commerce puede comenzar con Product y Sale y posteriormente incorporar Supplier, Warehouse u otra clase.

La lista de clases/tablas/vectores no debe estar hardcodeada en el motor.

---

## 7. Posición derivada

Para clase K:

`A_K(C_h) = admisiones constitutivas de K`

`prec_K = orden constitutivo canónico inducido por C`

`S_K(C_h) = sort(A_K(C_h),prec_K)`

`pos_K(E) = index(E,S_K)`.

**La posición es consecuencia, no hecho.**

**No se escribe el slot; se constituye el orden que lo hace inevitable.**

La tabla es posterior:

`T_K = Materialize(S_K)`.

---

## 8. Parámetros como dimensiones sobre una clase padre

Un parámetro A sobre K es:

`A : K ⇀ D_A`.

Su vector lógico usa las posiciones de K:

`V_A^h[i] = CurrentValue_h(S_K(C_h)[i],A)`.

Definir A induce un vector lógico; no obliga a almacenar un array físico dentro de C.

---

## 9. ParameterDefinition general

Conviene separar cuatro capas:

1. Host/domain: clase K;
2. Value semantics: dominio y ausencia;
3. Fold/update algebra: cómo la historia produce actualidad;
4. Representation profile: cómo materializar eficientemente.

`ParameterSemantics != FoldSemantics != VectorCodec`

---

## 10. Dependencias: DAG antes que script rígido

Para entidad E nueva, parámetro A nuevo y valor v:

`Admit_K(E) prec Assign(E,A,v)`

`DefineParameter(A) prec Assign(E,A,v)`.

No existe razón general para imponer orden entre Admit(E) y Define(A).

El flujo causal es un DAG; autoridad resuelve dependencias/topología, no scripts arbitrarios.

---

## 11. Familias reutilizables

Semánticas:

- Unsigned(bits);
- Signed(bits);
- FixedPoint(bits,scale,unit?);
- Boolean;
- Enum(OptionKind);
- Reference(TargetKind);
- Text/BlobReference;
- Set/List;
- State/Transition.

Folds:

- LatestAuthorizedAssignment;
- SumMovements;
- SetUnion;
- ApplyValidTransitions;
- DerivedFunction.

Representaciones:

- dense/sparse;
- bitmap;
- fixed-width;
- dictionary/enum index;
- reference slots;
- string pool + offsets;
- hash/blob refs;
- delta/compressed.

---

## 12. Commerce como especialización

Ejemplos futuros:

`Price = FixedPoint(...) + LatestAuthorizedAssignment`

`Quantity = Unsigned(...)`

`Description = Text/BlobReference`

`Tax = FixedPoint | Enum | Relation, según semántica real`

`Stock = Fold(InventoryMovements,AdmittedSales,Returns,...)`

`ProductRef = Reference(Product)`.

El objetivo es que estos nombres de negocio no requieran mecanismos estructurales nuevos.

---

## 13. Relación Sale -> Product

Una Sale puede tener:

`ProductRef : Sale -> Product`

`Quantity : Sale -> N+`.

Integridad causal:

`Admit_Product(P) prec Admit_Sale(S referencing P)`.

La venta no copia Product como verdad. Una materialización puede usar pos_Product(P) si el contexto/corte correspondiente ya está disponible.

---

## 14. Stock como consecuencia

SaleAdmitted es causa.

`Stock(P) = Fold(InventoryMovements(P),AdmittedSales(P),Returns(P),Adjustments(P),...)`.

`V_Stock[pos_Product(P)]` puede materializarse, pero no es autoridad.

---

## 15. Determinismo por corte

Para mismo C_h y mismos contratos/bootstrap:

`same C_h -> same meta-state K_h`

`same C_h -> same entity sequences S_K`

`same C_h -> same positions`

`same C_h -> same logical vectors`.

Y:

`FoldDelta(Project(C_h),DeltaC_h->h') == Project(C_h')`

debe ser una propiedad verificable.

---

## 16. Continuidad no es una trayectoria global

Cada nodo puede mantener Gamma_n.

Una autoridad puede mantener fibras constitutivas autorizadas por dominio/clase.

Pero:

`C != Gamma_authority`.

C es la clausura causal/constitutiva compartida que reconoce hechos, fibras y relaciones.

Una fibra lineal puede producir posiciones para una clase sin imponer orden total a toda C.

Evitar consenso salvo que exista realmente un protocolo entre múltiples autoridades.

---

## 17. Local

`Local(X)` = evidencia reconocida desde la cual X interpreta.

Browser, PHP y worker tienen local. Online/offline es otra propiedad.

`Network -> Verify -> PersistLocal -> InterpretLocal`.

---

## 18. Materializaciones

`M_h = Project(C_h)` puede contener secuencias/tablas, identity->position, parámetros, vectores, índices, snapshots, matrices y DBs.

Estas estructuras pueden ser la ruta normal de lectura.

`DerivedCache != CausalAuthority`.

---

## 19. Plan de investigación

Fase A: claridad formal de coordenadas, parámetros, folds, representación, relaciones y autoridad.

Fase B: probetas UI para hacer visibles esos mecanismos.

Fase C: verificar determinismo, incrementalidad, atomicidad y reconstrucción.

Fase D: volver a Commerce y expresarlo por composición.

---

## 20. Criterio de éxito

Volver a Commerce cuando Product, Sale, Price, Quantity, Description, Tax, Images, Enabled y Stock puedan describirse como instancias/composiciones de mecanismos generales.

---

## 21. Frases canónicas

**La App inicial es un génesis de contratos.**

**La App concreta en h es el conjunto de contratos constituidos/vigentes de esa continuidad, más las capacidades que inducen.**

**Customizar una App es constituir nuevos contratos/definiciones dentro de su continuidad.**

**La posición es consecuencia, no hecho.**

**Un parámetro induce un vector lógico; materializarlo es una optimización.**

**El orden causal es un DAG; solo imponer orden total cuando una semántica lo exige.**

**Commerce es una aplicación de Continuity Core, no la definición de Continuity Core.**

## 22. Integración KOB2

La comparación entre substrate limpio y substrate KOB2, el lugar de K5.1, cifrado privado, proyección pública y tensiones con mecanismos históricos está en:

`KOB2_INTEGRATION.md`.

La recomendación vigente es mantener **Clean Core** y **KOB2-backed Core** como dos realizaciones del mismo modelo semántico y compararlas mediante probetas diferenciales.


## 23. Lectura, escritura, audiencia y autoridad

La doctrina canónica que separa `WriteAuthority`, `ReadAudience`, `Projection` y `View` está en:

`READ_WRITE_AUDIENCE_MODEL.md`.

Frase guía:

**La escritura converge hacia la fuente; la lectura irradia desde la fuente mediante derivados.**

La View se elige a partir de la audiencia; Authority se elige a partir del efecto que se quiere constituir.


## 24. Ontología relacional y algoritmo de diseño

La definición canónica de Authority, View, Source, Storage, Verification, Projection y Audience por sus relaciones está en `RELATIONAL_ONTOLOGY.md`.

El procedimiento obligatorio para diseñar nuevos flujos/regímenes está en `FLOW_DESIGN_ALGORITHM.md`.

Política recomendada: **una continuidad constitutiva que no tenga propósito público explícito se materializa preferentemente bajo `Keyed(d_domain)`; las audiencias externas reciben derivados específicos bajo `Clear` o `Keyed(d_group)`.**


## 25. Asimetría de divulgación

La regla canónica sobre audiencia mínima, privacidad por defecto y derivación hacia afuera está en `DISCLOSURE_ASYMMETRY.md`.

Principio: **la privacidad conserva opciones; la publicidad consume opciones**. Una fuente constitutiva usa la audiencia mínima necesaria y las audiencias mayores reciben derivados específicos.


## 26. Génesis → Continuity Core

El flujo canónico desde `Génesis · Creador de Mundos V3.1.8` hacia una continuidad de App está en `GENESIS_TO_CONTINUITY_FLOW.md`.

La primera probeta general está en `PROBE_P0_VECTORLAB.md`: una App mínima privada, descubierta desde Dashboard_D, que demuestra clase → admisión → posición derivada → parámetro → vector → snapshot+delta.

Regla: **Génesis entrega contexto; Continuity Core reconstruye/constituye la App; Commerce vendrá después como especialización.**


## 27. Frontera canónica App → Core

La claridad vigente está en `APP_BOUNDARY_AND_CORE_ENTRY.md`.

`Genesis -> DashboardShell + UserDashboardConfig -> EnabledApps -> AppSelection | C_app -> ContinuityCore -> M_h -> AppUI`

**Continuity Core comienza con la continuidad específica de una App.** Dashboard, login, tema y listado de Apps quedan fuera del núcleo.

Siguiente foco:

`EntityKindDefinition -> EntityAdmission -> ConstitutiveOrder -> ParameterDefinition -> Assignment/Fold -> LogicalVector`.