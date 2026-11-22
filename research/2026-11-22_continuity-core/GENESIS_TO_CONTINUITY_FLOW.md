# Flujo inicial — Génesis V3.1.8 → Continuity Core

**Fecha:** 2026-11-22
**Estado:** flujo conceptual canónico; sin código.

## 0. Punto de partida verificado

La última versión accesible verificada de `Génesis · Creador de Mundos` es **V3.1.8**. Se toma como infraestructura previa: deriva/reconoce Público `Clear`, Red `Keyed(K)` y Privado `Keyed(d)`, reconoce raíz y Dashboard, y entrega un contexto recorrible mediante `FOLLOW/EXPAND/EMIT`.

No se reimplementa login, derivación de Views, raíces, Current ni Source nominal.

El reingreso/login se interpreta como la misma ley: mismas causas → mismas coordenadas → Current/clausura reconocibles; no se crea una sesión soberana adicional.

---

## 1. Frontera exacta

`Genesis` responde:

`¿desde qué mundos/Views/raíces puedo empezar a preguntar?`

`Continuity Core` responde después:

`¿qué contratos, entidades, parámetros y hechos constituyen una App concreta y qué estado deriva de ellos?`

Por tanto:

`Genesis != AppTemplate != AppInstance != MaterializedUI`.

---

## 2. Contexto entregado por Génesis

Conceptualmente obtenemos:

`G = { (W_P,Clear,rho_P), (W_K,Keyed(K),rho_K), (W_D,Keyed(d),rho_D), dashboard closures }`.

Para la primera probeta usaremos principalmente:

- `W_K`: gramática/template compartible de App;
- `W_D`: instancia privada y sus hechos;
- `Dashboard_D`: punto desde donde el usuario descubre/crea Apps privadas.

El mundo público no es necesario para probar los mecanismos vectoriales.

---

## 3. AppTemplate en mundo de red

Propuesta de diseño:

`VectorLabTemplate` vive en `W_K` bajo `Keyed(K)`.

Contiene/referencia únicamente la gramática mínima necesaria:

- `AppGenesis`;
- `EntityKindDefinition`;
- `ParameterDefinition`;
- `EntityAdmission`;
- `Assignment`;
- reglas de fold/representación reutilizables.

Motivo: la gramática de una familia de Apps puede ser compartida por la red sin hacerla pública en `Clear`.

Esto es una decisión de scope, no una obligación ontológica.

---

## 4. AppInstance en mundo privado

El usuario, desde `Dashboard_D`, crea o reconoce una continuidad de App:

`C_lab @ Keyed(d)`.

Su primer hecho constitutivo es conceptualmente:

`AppGenesis(templateRef=VectorLabTemplate, templateCut/version)`.

Así la instancia privada puede reconstruir qué gramática inicial usa sin copiarla como código hardcodeado.

Si el template se referencia desde `W_K`, la clausura semántica de la App incluye esa referencia.

---

## 5. Participación en Dashboard

El Dashboard no contiene una lista hardcodeada de Apps.

Cuando `C_lab` queda constituida, el Dashboard privado puede evolucionar para alcanzar:

`FOLLOW(I_lab)`

mediante su `EXPAND/Index` vigente.

Después:

`Traverse(Dashboard_D)`

descubre `C_lab`.

Regla:

`crear App` y `hacerla participante del Dashboard` son dos hechos/relaciones conceptualmente distintos, aunque una autoridad pueda comprometerlos en una operación lógica coordinada.

---

## 6. Reader de Continuity Core

El lector comienza con:

`Bootstrap meta-contracts + template closure + C_lab`.

Recorre hechos en orden causal suficiente y mantiene:

`K_h = metaestado reconocido`

`S_h = estado de dominio reconstruido`.

Cada paso:

`(K_i,S_i)=Step(K_(i-1),S_(i-1),r_i)`.

Los contratos descubiertos amplían `K_h`; las admisiones/asignaciones amplían `S_h`.

---

## 7. Mecanismo de clase de entidad

Constituir:

`EntityKindDefinition(Item)`.

Si `Item` necesita posiciones estables, el contrato declara/referencia el mecanismo que induce un orden constitutivo canónico sobre sus admisiones.

No se crea una tabla como causa.

---

## 8. Mecanismo de admisión y posición

Constituir:

`Admit_Item(E0)`.

De la continuidad se deriva:

`S_Item=(E0)`

y por consecuencia:

`pos_Item(E0)=0`.

Después:

`Admit_Item(E1)`

produce:

`S_Item=(E0,E1)`

`pos(E0)=0, pos(E1)=1`.

**El slot nunca fue escrito.**

---

## 9. Mecanismo de parámetro

Constituir:

`DefineParameter(Count, host=Item, semantics=Unsigned(8), fold=LatestAuthorizedAssignment)`.

Esto induce conceptualmente:

`V_Count[i]=CurrentValue(S_Item[i],Count)`.

No obliga a crear un archivo vector.

---

## 10. Mecanismo Assignment

Constituir:

`Assign(E0,Count,7)`.

Precondiciones:

`Admit_Item(E0) prec Assign(E0,Count,7)`

`DefineParameter(Count) prec Assign(E0,Count,7)`.

Materialización:

`V_Count=[7]`.

Después:

`Assign(E1,Count,3)`

produce:

`V_Count=[7,3]`.

Los hechos causales pueden referenciar identidades; la materialización usa posiciones.

---

## 11. Parámetro añadido después

Con E0/E1 ya existentes, constituir:

`DefineParameter(Enabled, host=Item, semantics=Boolean, fold=LatestAuthorizedAssignment)`.

Inicialmente:

`V_Enabled=[bottom,bottom]`.

Después:

`Assign(E0,Enabled,true)`

produce:

`V_Enabled=[true,bottom]`.

Esto demuestra que schema/estructura crece sin reescribir entidades.

---

## 12. Materialización incremental

Tras corte h:

`M_h=(S_Item, parameterRegistry, V_Count, V_Enabled, indexes, head=h)`.

Con nuevo hecho:

`Assign(E0,Count,9)`

se aplica:

`M_h' = FoldDelta(M_h,DeltaC)`

y esperamos:

`V_Count=[9,3]`.

Propiedad obligatoria:

`FoldDelta(Project(C_h),DeltaC) == Project(C_h')`.

---

## 13. KOB2 en esta primera probeta

No necesitamos probar todavía proyecciones públicas.

`C_lab` usa naturalmente el ámbito privado ya entregado por Génesis:

`Keyed(d)`.

`VectorLabTemplate` puede estar en Red:

`Keyed(K)`.

Así verificamos de paso que la semántica de Continuity Core no depende de que template e instancia estén bajo la misma View.

---

## 14. Flujo completo

`Génesis V3.1.8`
` -> reconoce W_K, W_D, Dashboard_D`
` -> Dashboard_D pregunta por Apps`
` -> usuario propone Crear VectorLab`
` -> Authority_D constituye C_lab + participación Dashboard`
` -> C_lab referencia VectorLabTemplate@W_K`
` -> reader reconstruye contracts`
` -> Define Item`
` -> Admit E0/E1`
` -> posiciones derivadas 0/1`
` -> Define Count/Enabled`
` -> Assign values`
` -> derive logical vectors`
` -> materialize M_h`
` -> append delta`
` -> verify incremental == full replay`.

---

## 15. Qué NO probamos todavía

- Product/Sale/Stock;
- catálogo público;
- afiliados;
- multi-authority;
- rotación de View;
- key distribution;
- optimización final de bytes;
- K5.1 definitivo.

Primero demostramos la matemática general.

---

## 16. Criterio de éxito

La probeta pasa si, desde un contexto real de Génesis, una App nueva puede ser descubierta/constituida sin hardcodear su schema, y para el mismo corte se obtienen determinísticamente las mismas:

- clases;
- secuencias;
- posiciones;
- definiciones de parámetros;
- vectores lógicos;
- materializaciones actuales.

Además, ninguna posición puede aparecer como hecho soberano.
