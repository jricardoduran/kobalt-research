# Kobalt — continuidad vectorial: especificación conceptual general

**Fecha:** 2026-11-22
**Estado:** línea general previa a cualquier App concreta. Commerce debe tratarse después como una instancia de estos mecanismos.

---

## 0. Inversión de enfoque

Antes de diseñar Commerce conviene fijar una teoría general de continuidad capaz de explicar:

- cómo nacen identidades localmente;
- cómo una autoridad constituye hechos compartidos;
- cómo ciertos órdenes constitutivos producen coordenadas estables;
- cómo parámetros reconocidos inducen vectores;
- cómo relaciones entre parámetros restringen transformaciones;
- cómo snapshots/materializaciones permiten lectura incremental;
- cómo una App concreta reutiliza estos mecanismos sin inventar semántica estructural nueva.

Principio:

> **Primero continuidad y mecanismos generales; después Apps como especializaciones de contratos y parámetros.**

---

## 1. Tres niveles que nunca deben confundirse

### 1.1 Causa constitutiva

Lo que realmente se reconoce en continuidad: definiciones, admisiones, relaciones, decisiones y otros hechos irreducibles.

### 1.2 Consecuencia derivada

Lo que el recorrido determina de manera única: secuencias, posiciones, actualidad de parámetros, estados.

### 1.3 Materialización

Una forma física/operativa de guardar consecuencias: tablas, vectores, matrices, índices, snapshots, JSON, SQLite, etc.

Cadena:

`ConstitutiveFacts -> DerivedConsequences -> Materializations`

Una materialización jamás debe crear hacia atrás una causa que no existía.

---

## 2. Nodo

Un nodo es cualquier locus capaz de mantener una trayectoria propia.

No debe definirse por geografía ni por tecnología.

Puede ser:

- navegador;
- PHP en servidor;
- worker;
- proceso local;
- servicio remoto;
- otro entorno.

Propiedad mínima:

`Node(n) => exists Gamma_n`

donde `Gamma_n` es append-only, single-writer y localmente ordenada.

### 2.1 Local

`Local(component)` significa el ámbito de evidencia reconocida desde el cual ese componente interpreta.

No significa necesariamente 'cliente'.

Un servidor también tiene local.

### 2.2 Conectividad

Separar:

- locus de ejecución;
- conectividad (`offline | online`);
- ámbito semántico local.

Un nodo offline solo puede usar evidencia ya local.

Un nodo online puede adquirir evidencia por red, pero debe verificarla/persistirla antes de interpretarla como evidencia local reconocida.

`Network -> Verify -> PersistLocal -> InterpretLocal`

---

## 3. Autoridad y continuidad

Una autoridad es un rol/capacidad, no una ubicación.

Puede ejecutarse en un nodo remoto o local.

Puede mantener una o varias trayectorias propias de decisiones/constitución.

**Continuidad no es sinónimo de trayectoria de autoridad.**

Una forma útil de verla es:

`Continuity = causal/constitutive closure of recognized authoritative facts + necessary referenced evidence/relations`.

Puede existir una fibra/trayectoria constitutiva autorizada que aporte orden a un dominio específico; C incluye/reconoce esa fibra pero no se reduce a ella.

Evitar el término `consenso` salvo que realmente exista un protocolo de consenso entre múltiples autoridades.

---

## 4. Clases de entidad y admisiones

Una clase de entidad `K` puede ser reconocida por contrato.

Ejemplos futuros:

`Product`, `Sale`, `User`, `Option`, etc.

Una identidad `E` puede nacer localmente.

Su constitución compartida se expresa por:

`Admit_K(E)`.

El hecho mínimo no necesita atributos ni posición.

---

## 5. Orden constitutivo y posición

Cuando una clase K necesita coordenadas estables, C debe inducir un orden canónico `prec_K` sobre sus admisiones.

`A_K(C_h) = { Admit_K(E) alcanzables en C_h }`

`S_K(C_h) = sort(A_K(C_h), prec_K)`

`pos_K(E) = index(E,S_K)`

Regla:

**La posición es consecuencia, no hecho.**

Una implementación posible para hacer simple `prec_K` es una fibra constitutiva autorizada append-only específica de K, o una cadena de links que determine el mismo orden.

Pero la semántica no exige que C completa sea una sola trayectoria.

---

## 6. Parámetro: definición general

Un parámetro `A` es una dimensión semántica reconocida sobre una clase padre `K`.

`A : K ⇀ D_A`

Donde:

- `K` = clase de entidad a la que aplica;
- `D_A` = dominio semántico de valores;
- `bottom` = ausencia de valor reconocido.

Un `ParameterDefinition` debería separar al menos cuatro preguntas:

1. **Host/Domain**: ¿sobre qué clase K se indexa?;
2. **Value semantics**: ¿qué valores son válidos?;
3. **Fold/update algebra**: ¿cómo hechos posteriores determinan el valor actual?;
4. **Representation profile**: ¿cómo conviene materializar/codificar el vector?

El punto 4 no debe confundirse con los tres primeros.

`ParameterSemantics != VectorCodec != Implementation`

---

## 7. Crear parámetro no significa almacenar un vector físico

Si C reconoce:

`DefineParameter(A,K,D,F,...)`

entonces conceptualmente queda bien definida una proyección:

`V_A^h[i] = Fold_A(C_h, S_K(C_h)[i])`

para toda posición i de K.

Por tanto puede decirse que el parámetro **induce** un vector.

Pero no es obligatorio que exista un archivo/array físico `V_A` en continuidad.

El vector físico es una materialización opcional:

`MaterializeVector(A,C_h)`.

Esta distinción evita introducir una DB columnar como nueva autoridad.

---

## 8. Dependencias causales al crear entidad, parámetro y valor

Supongamos una nueva entidad E y un nuevo parámetro A aplicable a su clase K.

Para constituir:

`Assign(E,A,v)`

son necesarias dos precondiciones causales independientes:

`Admit_K(E) prec Assign(E,A,v)`

`DefineParameter(A,K,...) prec Assign(E,A,v)`

**No es necesario imponer entre `Admit_K(E)` y `DefineParameter(A)` un orden total si ninguna depende de la otra.**

Por tanto el patrón correcto es un DAG:

`Admit_K(E) ----\`

`                 > Assign(E,A,v)`

`DefineParameter(A) /`

Esto es más general que exigir siempre `producto -> parámetro -> valor` o `parámetro -> producto -> valor`.

La autoridad puede resolver un bundle offline mediante orden topológico de dependencias.

---

## 9. Flujo offline general

Un nodo puede producir localmente:

`EntityRequest(E,K)`

`ParameterRequest(A,K,Definition)`

`AssignmentProposal(E,A,v)`

y conservar sus dependencias.

Al reconectar:

1. publica los hechos/propuestas exactos;
2. autoridad adquiere/verifica/persiste localmente;
3. reconstruye el grafo de dependencias;
4. resuelve primero las definiciones/admisiones necesarias;
5. constituye assignments solo cuando sus precondiciones compartidas ya existen;
6. responde al nodo por cada solicitud/resolución relevante.

El orden de transporte no debe confundirse con el orden causal.

---

## 10. Vector por posición del padre

Si A aplica a K, su vector usa el espacio de posiciones derivado de K:

`V_A[i] <-> value of A for S_K[i]`.

La posición está implícita en el índice del vector.

Por eso no se necesita almacenar `entityId` junto a cada celda de un vector denso.

En una representación sparse sí puede almacenarse `i -> value`.

En hechos causales base, la referencia segura puede seguir siendo por identidad; un codec optimizado puede usar posiciones solo si el contexto/corte que les da significado ya está causalmente disponible.

Regla:

`UsePosition(i) => SequenceDefinition(K,h) causally available`.

---

## 11. Contratos para recorrer vectores

No existe un único 'contrato de vector'. Conviene separar:

### 11.1 Parameter semantic contract

Define K, D_A, cardinalidad, ausencia y significado del valor.

### 11.2 Fold/update contract

Define cómo la historia produce actualidad.

Ejemplos:

- `LatestAuthorizedAssignment`;
- `SumMovements`;
- `SetUnion`;
- `StateTransition`;
- función derivada desde otros hechos.

### 11.3 Vector representation contract

Define cómo se materializa eficientemente el resultado:

- dense;
- sparse;
- bitmap;
- fixed-width integer;
- fixed-point;
- dictionary/enum;
- references/slots;
- string/blob references;
- compressed/delta encoding.

### 11.4 Relation contracts

Definen invariantes con otras dimensiones.

Ejemplo:

`SalePrice <= Price`.

Así, 'crear un parámetro' puede seleccionar/referenciar templates reutilizables de estas cuatro capas sin crear contratos específicos llamados `PriceContract` o `TaxContract` cuando no hacen falta.

---

## 12. Templates generales de parámetros

### 12.1 ScalarUnsigned(bits)

`D={0,...,2^bits-1}`.

Útil para cantidades enteras acotadas.

### 12.2 ScalarSigned(bits)

Enteros con signo.

### 12.3 FixedPoint(bits,scale,unit?)

Semántica numérica exacta sin float binario.

Útil para dinero, tasas, medidas.

### 12.4 Boolean

`D={false,true}`; materializable como bitset.

### 12.5 Enum(OptionClass)

El valor pertenece a una tabla/opciones reconocidas.

Si existen m opciones, un codec puede usar aproximadamente `ceil(log2(m))` bits por posición cuando sea conveniente.

### 12.6 Reference(TargetEntityKind)

Valor semántico = referencia a otra entidad.

Materialización optimizada puede usar posiciones estables del target si el corte necesario está disponible.

### 12.7 Text/BlobReference

Valor semántico = contenido o referencia exacta por hash; vector puede guardar refs/offsets.

### 12.8 Set/List

Cardinalidad múltiple; puede materializarse con sparse lists, bitsets o índices.

### 12.9 State/Transition

Los valores pueden representar estados y un contrato separado define transiciones admisibles.

También puede existir un dominio finito donde cada opción referencia una transformación semántica. La tabla de opciones aporta coordenadas; el contrato de transición aporta significado.

---

## 13. Ejemplos generales, no específicos de Commerce

`Price` puede ser `FixedPoint(32,2,currency)` + `LatestAuthorizedAssignment`.

`Quantity` puede ser `ScalarUnsigned(16)`.

`Description` puede ser `Text/BlobReference`.

`TaxCategory` puede ser `Enum(TaxOption)`.

`Enabled` puede ser `Boolean` derivado de hechos de estado.

`Stock` puede ser `ScalarSigned/Unsigned` materializado, pero con fold `SumMovements - AdmittedUses` y no por asignación directa.

La semántica general viene de templates; el nombre de dominio solo los aplica.

---

## 14. Relaciones entre parámetros

Sea un estado de dimensiones relacionadas x y un espacio admisible D.

Para transformaciones propuestas F:

- si conmutan y preservan D: `Independent`;
- si existe un orden que mantiene cada prefijo en D: `Sequenciable(order)`;
- si ningún orden intermedio sirve pero el cambio conjunto sí: `AtomicBatch`;
- si existen varias soluciones admisibles con consecuencias distintas: `Conflict(alternatives)`;
- si ninguna solución es admisible: `Invalid`.

Esta clasificación es general y reusable por cualquier App.

---

## 15. Lectura de continuidad como construcción simultánea de metaestado y estado

El lector mantiene conceptualmente dos estructuras:

`K_h` = entorno semántico/metaestructural reconocido hasta h;

`S_h` = estado de dominio reconstruido hasta h.

Cada nuevo hecho puede modificar K, S o ambos.

Ejemplos que modifican K:

- nueva clase de entidad;
- nuevo ParameterDefinition;
- nueva RelationDefinition;
- nuevo codec/representation contract.

Ejemplos que modifican S:

- admitir entidad;
- asignar valor;
- admitir movimiento;
- admitir transición.

Formalmente:

`(K_i,S_i)=Step(K_(i-1),S_(i-1),r_i)`.

Esto evita exigir que el lector conozca de antemano toda la estructura futura.

---

## 16. Materializaciones incrementales

Después de recorrer hasta h:

`M_h=Project(K_h,S_h)`.

Puede contener:

- secuencias/positions por clase;
- registries de parámetros;
- vectores;
- índices;
- snapshots.

Al recibir delta:

`M_h'=FoldDelta(M_h,DeltaC)`.

Los slots históricos permanecen estables porque derivan de prefijos constitutivos inmutables.

---

## 17. Proyecciones y formatos tradicionales

Desde M_h pueden responderse preguntas:

- JSON vertical por entidad;
- vector horizontal por parámetro;
- matriz densa;
- SQLite/SQL;
- CSV;
- API;
- UI.

Una forma derivada puede introducir `null` explícitos aunque la historia sparse nunca los haya almacenado.

---

## 18. Qué hace una App

Una App selecciona un conjunto inicial de:

- clases de entidad;
- parámetros/templates;
- relaciones;
- flujos de autoridad;
- vistas/acciones UI.

No necesita inventar un mecanismo nuevo para cada nombre de negocio.

Commerce será una especialización:

`Price = FixedPoint + LatestAuthorizedAssignment`

`Quantity = UnsignedScalar`

`Description = TextRef`

`Tax = FixedPoint/Enum/Relation según caso`

etc.

---

## 19. Regla de minimalidad

Antes de crear un contrato específico de dominio preguntar:

`¿puede expresarse como instancia/composición de contratos generales ya existentes?`

Solo crear un nuevo mecanismo si aparece una semántica irreducible nueva.

---

## 20. Síntesis

**La continuidad constituye hechos y relaciones.**

**Los órdenes constitutivos producen secuencias estables.**

**Las secuencias producen posiciones.**

**Los parámetros se indexan naturalmente por las posiciones de su clase padre.**

**Definir un parámetro induce conceptualmente un vector, pero no obliga a almacenar físicamente ese vector en continuidad.**

**El contrato semántico del parámetro, su algebra de actualización, sus relaciones y su codec vectorial son capas distintas.**

**Las Apps concretas deben reutilizar estos mecanismos generales.**