# Khipu-5 — continuidad autodescriptiva + UI derivada

**Fecha:** 2026-11-21 11:16 UTC-5

Esta probeta demuestra que una UI puede reconstruirse desde una continuidad sin contener Producto/Venta como lógica hardcodeada.

Flujo:

```
head.txt
  -> Resolve(rid)
  -> K5.1 MaterialValid
  -> BODY JSON
  -> prev
  -> ... -> genesis
  -> reverse
  -> continuity.define
  -> descubrir views
  -> proyectar eventos
  -> render UI
```

La UI solo conoce:

1. K5.1;
2. la relación lineal `head -> prev`;
3. el metacontrato `kobalt.continuity.ui.v1`;
4. primitivas genéricas de proyección (`latestByKey`, `append`).

El dominio no está en la UI. El génesis declara las vistas. En el fixture `comercio` descubre:

- Productos: `product.upsert`, `latestByKey(sku)`;
- Ventas: `sale.recorded`, `append`.

Invariante de lectura:

`K5 inválido OR rid inconsistente OR registro faltante OR ciclo OR envelope inválido => ABORT`.

Resultado observado en JS y PHP: 7 registros, 3 productos y 2 ventas. La prueba JS enumeró físicamente los archivos en orden inverso y produjo las mismas vistas.

La continuidad es historia; la UI es una proyección destruible y regenerable:

`UI = Project(Continuity, ViewDefinition)`.
