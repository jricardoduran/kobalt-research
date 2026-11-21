# Atomicidad lógica local y libertad de recorrido

## Tesis
Un registro autodelimitado y verificable es una unidad lógica anterior a cualquier trayectoria, índice, orden causal o continuidad. El mecanismo de cuatro componentes permite reconocer el límite de inicio y fin de un registro y verificar su integridad sin consultar registros vecinos. No presupone concatenación secuencial, orden histórico, ni posición global.

## Separación de propiedades
- **Encuadre autónomo**: el primer componente determina la anchura necesaria para interpretar el segundo; el segundo declara la longitud en bits del tercero; el tercero contiene el binario; el cuarto contiene el hash. La definición exacta de codificación, cobertura del hash y tratamiento de bits no alineados debe tomarse de la implementación canónica; este documento no inventa un codec nuevo.
- **Validez estructural local**: V(r) se decide exclusivamente con los bytes de r y las reglas fijas del formato. No depende del registro anterior ni del siguiente.
- **Independencia de recorrido**: cualquier permutación de registros íntegros preserva su validez local, aunque no necesariamente su significado ni la posibilidad de reconstruir un estado.
- **Validez semántica**: requiere contratos, autoridades, causas y resoluciones, que pueden ser referencias inmutables verificables. La validez estructural no demuestra legitimidad comercial.
- **Persistencia física**: el encuadre/hash no garantizan por sí solos durabilidad, exclusión concurrente, autenticidad o ausencia de eliminación de registros.
- **Reconstrucción**: los recorridos de lectura pueden variar; para obtener el mismo estado se necesita cierre causal y reglas de resolución deterministas o decisiones explícitas. Un hash individual no obliga a encadenar registros.

## Invariantes
1. V(r) no consulta posición, índice, predecesor, sucesor ni orden global.
2. El lector conoce el fin de r por el propio encuadre, y puede comenzar a interpretar otro registro inmediatamente después; el siguiente registro puede ser semánticamente independiente.
3. La validez de una colección es la conjunción de las verificaciones locales, pero su admisibilidad como continuidad añade condiciones relacionales.
4. El mismo formato puede almacenar unidades de trayectorias, contratos, resoluciones, manifiestos u otras estructuras sin imponerles una secuencia causal.
5. Continuity != Storage; Contract != Codec != Implementation; registro íntegro != hecho admitido.
6. Una continuidad puede reconstruirse desde registros verificados y relaciones explícitas sin duplicar una bitácora lineal constitutiva.
7. El prefijo físicamente recuperable, la colección de registros íntegros y el cierre causal admisible son conceptos distintos.

## Pruebas necesarias
- Permutar registros íntegros: V(r) permanece invariante.
- Truncar cualquiera de los cuatro componentes: el registro no se acepta.
- Corromper longitud, payload o hash: rechazar cuando la inconsistencia sea detectable por el formato.
- Mezclar registros sin relación causal: todos pueden ser estructuralmente válidos.
- Incorporar referencia causal ausente: registro válido, continuidad aún no cerrada.
- Reordenar un recorrido topológico: reconstrucción semántica equivalente cuando las reglas lo permiten.
- Simular escrituras interrumpidas y bytes residuales sin confundir fin legítimo con corrupción.
- Verificar comportamiento idéntico del codec en navegador y PHP mediante vectores binarios canónicos.

## Alcance
Claridad conceptual, no afirmación de que el código actual ya implemente estos invariantes. No modificar ni reescribir historias existentes para adoptar el mecanismo.
