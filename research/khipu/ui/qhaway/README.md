# Khipu Qhaway (KQ)

`Qhaway` se usa aquí por su sentido de mirar/observar.

Perfil de UI efímera: verifica y reconstruye la continuidad directamente desde la fuente y proyecta el resultado sin exigir persistencia local.

## Flujo

`Source -> Verify(K5.1) -> Reconstruct(head, prev) -> Project -> Render`

## Contrato operacional

- La UI no usa IndexedDB como autoridad.
- Cada render válido depende de una lectura válida de la fuente.
- Un K5 inválido, faltante, RID incoherente o ciclo aborta la reconstrucción.
- El orden físico de archivos no constituye el orden histórico; `head + prev` lo hace.
- La UI sigue siendo una proyección destruible; simplemente no conserva una copia local obligatoria de la continuidad.

Se conservan aquí las variantes navegador-local y PHP directo.
