# Biblioteca UI mínima — entidades, elementos, parámetros y valores

**Fecha:** 2026-11-22
**Estado:** diseño conceptual inicial.

## 0. Metáfora de interfaz

Para el usuario:

`Entidad ~= tabla`
`Elemento ~= fila`
`Parámetro ~= columna`
`Valor ~= celda`.

Pero la tabla es solo una vista.

Debajo:

`EntityKind -> eje de elementos`
`EntityAdmission -> posición derivada`
`ParameterDefinition -> vector lógico`
`Assignment -> valor actual por fold`.

---

## 1. Cinco operaciones UI

`CreateEntity(label)`
`AddParameter(entity,type,label)`
`CreateElement(entity)`
`SetValue(element,parameter,value)`
`ReadEntity(entity)`.

Las primeras cuatro producen propuestas causales. La quinta es proyección.

Equivalencia:

`CreateEntity -> DefineEntity`
`AddParameter -> DefineParameter`
`CreateElement -> AdmitEntity`
`SetValue -> Assign`
`ReadEntity -> Project`.

Regla:

**5 operaciones UI = 4 causas + 1 proyección.**

---

## 2. Identidad vs etiqueta

`Identity(K) != Label(K)`
`Identity(A) != Label(A)`.

Renombrar Producto→Artículo o Precio→Precio base no cambia identidad ni vectores.

---

## 3. Entidad

Definición sencilla:

**Un tipo de entidad es una clase creciente de elementos identificables sobre los que pueden definirse parámetros.**

Al admitir:

`Admit_K(E)`

se deriva:

`S_K=(...)`
`pos_K(E)=index(E,S_K)`.

Nunca se introduce `slot` como dato soberano.

---

## 4. Parámetro

Definición sencilla:

**Un parámetro es una dimensión definida sobre los elementos de una entidad.**

`A:K partial-> D_A`.

Vector lógico:

`V_A[i]=CurrentValue(S_K[i],A)`.

Definir un parámetro induce un vector lógico, aunque no exista un array físico.

---

## 5. Formularios y tablas derivados

`ParameterDefinitions -> default FormUI`.

`ParameterDefinitions + LogicalVectors -> TableUI`.

`ParameterSemantic != Widget`.

Boolean puede mostrarse como checkbox/switch; Enum como select/radios, sin cambiar semántica.

---

## 6. Ejemplos

Commerce:
`Product(Name,Price,Enabled)`
`Sale(ProductRef,Quantity)`.

Tasks:
`Project(Name,Active)`
`Task(Title,Status,Priority,ProjectRef)`.

Library:
`Book(Title,Author,Available)`
`Loan(BookRef,Borrower,Date)`.

Las tres Apps usan el mismo motor.

---

## 7. Regla de extensibilidad

Una cuarta App no prevista debe poder crearse definiendo únicamente nuevas entidades, parámetros y relaciones, sin modificar Continuity Core.