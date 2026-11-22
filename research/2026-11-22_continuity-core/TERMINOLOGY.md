# Terminología estable — Continuity Core

**Fecha:** 2026-11-22

## Regla

Los términos de este archivo son normativos para evitar circularidad y mezclar causalidad con materialización.

### Continuidad C
Clausura causal/constitutiva compartida. No es DB ni trayectoria global.

### Corte C_h
Vista reconocida suficiente de C hasta un head/corte verificable.

### Nodo n
Cualquier locus capaz de mantener trayectoria propia Γ_n. Tecnología/ubicación no lo define.

### Local(X)
Ámbito de evidencia reconocida desde el que X interpreta. No equivale a browser.

### Trayectoria Γ_n
Historia local lineal, append-only, single-writer.

### Autoridad
Rol/capacidad que evalúa y constituye. No implica ubicación física ni consenso.

### AppTemplate
Génesis de contratos/capacidades iniciales.

### AppInstance(C_h)
Conjunto de contratos constituidos/vigentes de C_h más las capacidades/vocabulario que inducen.

### Customización
Extensión constituida posterior al génesis: nuevos contratos, clases, parámetros o relaciones.

### Clase K
Tipo semántico de entidad reconocido por contrato.

### Admit_K(E)
Hecho constitutivo que reconoce identidad E como miembro de K.

### prec_K
Orden constitutivo canónico inducido por C sobre admisiones de K cuando K necesita coordenadas estables.

### S_K(C_h)
Secuencia derivada al ordenar las admisiones de K por prec_K.

### pos_K(E)
Índice derivado de E en S_K. **Es consecuencia, no hecho.**

### T_K
Tabla materializada de S_K. No produce posiciones; las guarda como derivado.

### ParameterDefinition A
Dimensión semántica `A:K⇀D_A` sobre una clase padre K.

### Vector lógico V_A
Función actual `V_A[i]=CurrentValue(S_K[i],A)` inducida por el parámetro y su fold.

### Vector materializado
Representación física opcional de V_A.

### Fold_A
Álgebra que transforma hechos históricos relevantes en valor actual de A.

### Representation profile
Codec/layout físico: dense, sparse, bitmap, fixed-width, dictionary, refs, etc.

### RelationDefinition
Invariante/relación entre dimensiones o entidades.

### Materialización M_h
Estado derivado de C_h para lectura eficiente; reconstruible y descartable.

### BootstrapKernel
Núcleo mínimo que sabe verificar material, seguir refs e interpretar el metalenguaje de contratos. No conoce vocabulario de negocio.

## Frases prohibidas o desaconsejadas

- 'la tabla asigna el slot';
- 'la autoridad escribe la posición';
- 'local significa cliente';
- 'continuidad es el log de la autoridad';
- 'el JSON es el producto';
- 'crear parámetro crea obligatoriamente un archivo vector';
- 'Commerce define los mecanismos de continuidad'.

## Frases canónicas

- La posición es consecuencia, no hecho.
- La tabla materializa una secuencia derivada.
- Un parámetro induce un vector lógico; su materialización es opcional.
- La App inicial es un génesis de contratos.
- La App concreta es el conjunto de contratos vigentes de su continuidad.
- El orden causal es un DAG; solo introducir orden total donde tenga significado.
- Commerce especializa Continuity Core.

### WriteLocal
Capacidad de un nodo para append a su propia trayectoria. No constituye realidad compartida.

### Proposer
Actor autorizado a presentar una propuesta para evaluación.

### WriteAuthority / ConstitutiveAuthority
Contrato/causas que determinan quién puede constituir cambios legítimos en una continuidad.

### PublicationAuthority
Quién puede producir/actualizar un derivado para una audiencia.

### ReadAudience
Conjunto de actores que deben poder reconstruir una realidad o derivado.

### ProjectionPolicy
Regla semántica que determina qué parte de una fuente se convierte en un derivado autocontenido.

### PhysicalWrite
Capacidad de escribir bytes en un Storage. No equivale a autoridad semántica.

### Regime(X)
Par conceptual `(WriteAuthority(X), ReadAudience(X))`; KOB2 materializa el eje de lectura mediante `Clear` o `Keyed(d)`, mientras Authority gobierna la escritura constitutiva.

## Frases canónicas adicionales

- La escritura converge; la lectura irradia.
- PhysicalWrite != ConstitutiveWrite.
- ReadableDerivative != ReadableSource.
- El régimen emerge de las preguntas, no se predefine.


### MathematicalVerification
Prueba reproducible de que un candidato corresponde materialmente al contexto esperado (View, Name, commitment, descriptor, contratos). Sustituye confianza en el Storage, no Authority.

### MaterialValid
Candidato que pasa verificaciones materiales. No implica `Authorized` ni `Current`.

### PreferredView
Política de materialización elegida después de conocer audiencia/finalidad. Para fuentes constitutivas no públicas, preferencia actual: `Keyed(d_domain)`.

### Source
Relación nominal que ofrece candidatos. No es autoridad ni Current.

## Frases canónicas adicionales

- La autoridad constituye; la View revela; la Source ofrece candidatos; el Storage retiene; la matemática verifica; la Projection decide qué realidad entregamos.
- MaterialValid != Authorized != Current.
- Si la fuente no necesita ser pública, Keyed es el default preferido; Clear debe responder a una finalidad pública concreta.


### LeastNecessaryAudience
Audiencia mínima suficiente para que una realidad cumpla su función. Debe decidirse antes de seleccionar View.

### DisclosureAsymmetry
Asimetría por la cual una divulgación a una audiencia mayor no puede deshacerse, mientras que una fuente restringida puede producir posteriormente derivados más abiertos.

### PublicByPurpose
Condición positiva según la cual la historia/material completo de una realidad está destinado a audiencia pública; solo entonces `Clear` es un default natural para esa realidad.

## Frases canónicas adicionales

- La privacidad conserva opciones; la publicidad consume opciones.
- De restringido a público derivamos; de público a privado no restauramos secreto.
- Clear debe ser una decisión de propósito, no una costumbre técnica.
- Causa restringida, consecuencia compartida por propósito.
