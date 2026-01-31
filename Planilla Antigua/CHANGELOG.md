# Changelog - Sistema Control Financiero 2026

Todas las versiones notables del sistema.

---

## [8.3] - 2026-01-31

### Changed
- **Dashboard Web lee directamente de CALCULOS (sin recálculos)**
  - Eliminado todo el código de recálculo desde CARGA (~200 líneas)
  - WebApp.gs ahora lee datos precalculados de la hoja CALCULOS
  - Principio: El Dashboard SOLO LEE celdas, NO recalcula nada

### Fixed
- **Gráficos de categorías mostraban "Sin datos"**
  - Causa: Filtros EST.PAGO bugueados en código de recálculo
  - Fix: Leer directamente de CALCULOS (Sección 3, filas 58-71)

### Technical
- Datos que ahora se leen de CALCULOS:
  - Sección 1 (filas 6-11 FAM, 15-19 NT): Tendencias 12 meses
  - Sección 3 (filas 58-62 FAM, 66-71 NT): Categorías de egreso
  - Sección 4 (filas 82-88): Balance cruzado NT↔FAM
  - Sección 5 (filas 103-119 FAM, 123-135 NT): Subcategorías variables
- WebApp.gs: Reducido de ~300 a ~100 líneas en `obtenerDatosDashboard()`
- **FIX v8.3.1**: Corregido offset +1 en lectura de Sección 1 (filas 7→6 FAM, 16→15 NT)

### Documentation
- Nuevo archivo PRD.md (Product Requirements Document)
- Nueva regla `.claude/rules/proceso-cambios.md`
- Actualizado CLAUDE.md con proceso obligatorio de propuestas

---

## [7.35] - 2026-01-28

### Fixed
- **BUG CRÍTICO: SUMPRODUCT no reconocía subcategorías con espacios invisibles**
  - Las fórmulas hacían comparación EXACTA de strings sin tolerancia a espacios
  - Si el usuario pegaba datos con espacios extra, la comparación fallaba silenciosamente
  - MOVIMIENTO mostraba REAL=0 aunque VÁLIDO mostraba "✓"
  - Fix: Agregar `TRIM()` a todas las comparaciones de strings en fórmulas SUMPRODUCT

### Technical
- Sheets.gs: 3 fórmulas SUMPRODUCT con TRIM (INGRESOS, VARIABLES, AHORRO)
- Tablero.gs: Fórmulas Esperado FAM/NT, Ahorro, Fondo, Balance cruzado con TRIM
- Patrón: `(TRIM(CARGA!D4:D500)=TRIM(A102))` en lugar de `(CARGA!D4:D500=A102)`

---

## [7.34] - 2026-01-28

### Fixed
- **VÁLIDO mostraba "⚠ Subcat" para subcategorías válidas**
  - COUNTIF contra CONFIG fallaba con datos pegados (diferencias de encoding)
  - Fix: Simplificado a verificar solo si vacío o "-": `(D4:D500="")+(D4:D500="-")`

---

## [7.33] - 2026-01-28

### Fixed
- **Reservas "Reserva Var." de NT usaban columna C en vez de G**
  - `obtenerReferenciaReserva()` siempre buscaba primero en VARIABLES_FAMILIA
  - MOVIMIENTO NT mostraba "Unidad" o vacío en las reservas
  - Fix: Nuevo parámetro `entidad` para desambiguar la búsqueda
- **Error "Cannot call SpreadsheetApp.getUi()" al ejecutar desde editor**
  - Fix: try/catch para detectar contexto y ejecutar sin UI cuando es necesario

### Changed
- `obtenerReferenciaReserva(concepto, entidad)` - ahora requiere parámetro entidad
- `reinicializarSistema()` funciona tanto desde menú como desde editor de Apps Script

---

## [7.32] - 2026-01-28

### Fixed
- **Dashboard v3.0 mostraba todos los KPIs en cero (BUG CRÍTICO)**
  - `obtenerDatosDashboard()` en WebApp.gs usaba cálculos de filas incorrectos para leer de TABLERO
  - FAMILIA: Esperaba valores en filas separadas, pero INGRESOS y EGRESOS están en la misma fila (22), columnas B y D
  - NEUROTEA: Cuentas se leían de fila 24 cuando realmente están en fila 8; indicadores de fila 9 cuando están en fila 15
  - Fix: Recalculados `FILA_INICIO_CUENTAS_NT=8`, `FILA_VALORES_FAM=22`, `FILA_VALORES_NT=15`, `FILA_GANANCIA_NT=21`
- **Ahorro y Fondo Emergencia se leían duplicados**
  - Se leían de TABLERO y también se sumaban desde MOVIMIENTO
  - Fix: Eliminada lectura redundante de MOVIMIENTO; ahora solo se leen de TABLERO (filas 22 y 25)
- **Liquidez y Balance Cruzado usaban variables no definidas**
  - Variables `FILA_CAJA_DISP`, `FILA_SEMANA_1`, `FILA_BALANCE_CRUZADO` nunca fueron definidas tras refactor
  - Fix: Simplificada lectura de liquidez (calculada desde disponible/pendientes) y balance cruzado (calculado desde flujoMensual)

### Technical
- Mapa de filas TABLERO documentado:
  - FAMILIA: Cuentas 8-17, Total 18, Indicadores 22/25
  - NEUROTEA: Cuentas 8-9, Total 10, Indicadores 15, Ganancia 21, Distribución 28
- Columnas FAMILIA: B=2, C=3, D=4, E=5
- Columnas NEUROTEA: H=8, I=9, J=10, K=11

---

## [7.31] - 2026-01-27

### Fixed
- **Auto-creación de préstamos/devoluciones no funcionaba (BUG CRÍTICO)**
  - `encontrarPrimeraFilaVacia()` usaba `sheet.getLastRow()` que retornaba 500 debido al ARRAYFORMULA en columna J (VÁLIDO, v7.26)
  - Las transacciones auto-creadas se escribían en fila 501, fuera del rango SUMPRODUCT (A4:A500)
  - Fix: Ahora escanea columna A (FECHA) para encontrar la primera fila vacía
- **`filtrarCargaPorMes()` operaba sobre 497 filas innecesariamente**
  - Misma causa raíz: `getLastRow()` inflado por ARRAYFORMULA
  - Fix: Busca última fila real en columna A

### Added
- Logging diagnóstico en `intentarAutoCreacionFamilia()` e `intentarAutoCreacionNT()`
  - Muestra qué campos faltan cuando la auto-creación no se dispara
  - Ver logs en: Extensiones → Apps Script → Ejecuciones

---

## [7.30] - 2026-01-27

### Added
- **Dashboard v3.0** - Reescritura completa de WebApp.gs con Chart.js (reemplaza Google Charts v2.0)
- **Dashboards separados**: 2 pestañas independientes (FAMILIA, NEUROTEA) en lugar de 3
- **18 gráficos Chart.js interactivos** con tooltips y descripciones interpretativas:
  - **FAMILIA (8+1)**: Balance Mensual (combo), Ahorro Acumulado (línea), Gastos por Categoría (donut), Composición Egresos (barra horizontal), % Gastos vs Ingresos (barras), Subcategorías Variables (donut), Presupuesto vs Ejecución (área), Flujo entre Entidades (barras)
  - **NEUROTEA (8+1)**: Estado de Resultados (combo con línea % ganancia), Ganancia Acumulada (línea), Gastos por Categoría (donut), Composición Egresos (barra horizontal), Evolución % Ganancia (línea con meta), Distribución Ganancia (columnas meta vs real), Presupuesto vs Ejecución (área), Flujo entre Entidades (barras)
- **Flujo entre entidades**: sección común en ambos tabs con diagrama SVG vertical (NT↔FAM con flechas), alerta de balance, tabla detallada y gráfico mensual
- **Guías de interpretación**: cada gráfico tiene un párrafo `<p class="desc">` que explica cómo leer el gráfico
- **KPI cards mejorados**: grid responsive con border-left por tipo (azul=ingreso, rojo=egreso, verde=positivo, amber=pendiente)
- **Nuevos datos**: subcategorías variables (FAMILIA y NT), flujo mensual cruzado (12 meses)

### Changed
- **Chart.js** via CDN reemplaza Google Charts Visualization API (más ligero, más flexible)
- **2 tabs** (FAMILIA, NEUROTEA) en lugar de 3 (FAMILIA, NEUROTEA, BALANCE CRUZADO)
- Dialog modal: `setHeight(950)` → `setHeight(1000)` para mejor visualización
- `obtenerDatosDashboard()` ahora recopila 3 nuevos campos: `subcategoriasFam`, `subcategoriasNT`, `flujoMensual`
- Charts se destruyen y recrean al cambiar de tab (evita "Canvas already in use")
- IDs SVG únicos por instancia de flujo para evitar colisiones de markers

### Technical
- `generarHTMLDashboard()` - HTML completo con CSS embebido + Chart.js via CDN
- String concatenation (ES5 compatible) en lugar de template literals
- Tab-based SPA con destroy/recreate pattern para Chart.js
- Datos embebidos como JSON en la página (sin llamadas adicionales)
- Layout responsive con CSS Grid
- Paleta de colores consistente con `references/colors.md`

---

## [7.29] - 2026-01-26

### Added
- **Dashboard v2.0** - Reescritura completa de WebApp.gs con Google Charts Visualization API
- **3 pestañas**: FAMILIA, NEUROTEA, BALANCE CRUZADO (tabs con redraw al cambiar)
- **10 gráficos interactivos**:
  - FAMILIA: Tendencia 12 meses (ComboChart), Desglose egresos (BarChart), Distribución (PieChart donut), Presupuesto vs Real (BarChart)
  - NEUROTEA: Estado de resultados (ComboChart dual axis), Desglose egresos, Distribución, Distribución ganancia (ColumnChart), Presupuesto vs Real
- **KPI cards** con indicadores visuales (colores por tipo: azul=ingreso, rojo=egreso, verde=positivo, amber=pendiente)
- **Tendencia 12 meses**: datos combinados de CARGA + GASTOS_FIJOS + PRESUPUESTO
- **Tabla cuentas bancarias** con esperado/banco/diferencia (FAMILIA) y esperado/acumulado (NT)
- **Liquidez visual**: disponible → semanas → saldo fin de mes
- **Balance cruzado**: KPIs + tabla detallada + alerta visual de estado

### Fixed
- **CONFIG refs**: B40-B44 → B43-B47 (METAS desplazadas por v7.28)
- **MOVIMIENTO ranges**: A9:F70 → A9:F116 (FAMILIA), A73:F150 → A122:F206 (NEUROTEA)
- **Unicode**: ► (U+25BA) → ▶ (U+25B6) en detección de secciones MOVIMIENTO

### Technical
- `obtenerDatosDashboard()` - nueva función de datos comprehensiva (lee 7 hojas)
- `generarHTMLDashboard()` - HTML completo con CSS embebido + Google Charts JS
- Charts se renderizan client-side via `google.visualization` (paquete: corechart)
- Datos embebidos como JSON en la página (no requiere llamadas adicionales)
- Layout responsive con CSS Grid y media queries

---

## [7.28] - 2026-01-26

### Fixed
- **CRÍTICO: METAS sobrescribía VARIABLES_FAMILIA en CONFIG** - `filaMetas=38` se solapaba con las últimas 2 reservas variables (C38:C39). MOVIMIENTO filas 111-112 mostraban vacío/"Unidad" en vez de "Reserva Var. 4"/"Reserva Var. 5"
- Movido `filaMetas` de 38 a 41 para evitar overlap (19 items en C21:C39)
- Cascadeados todos los desplazamientos: SALDOS POR MES (50-63), CUENTA FAM (68-77), CUENTA NT (82-83)
- Actualizadas 29 referencias hardcodeadas en Sheets.gs, Tablero.gs y CLAUDE.md

### Enhanced
- **VÁLIDO ahora valida TIPO, CATEGORÍA y SUBCATEGORÍA** (no solo fecha/año/monto)
  - "⚠ Tipo": TIPO vacío
  - "⚠ Cat": Egreso con CATEGORÍA="-"
  - "⚠ Subcat": Egreso VARIABLES con SUBCATEGORÍA que no existe en CONFIG
- Fórmulas VÁLIDO diferenciadas por entidad (FAMILIA vs NT, diferentes rangos CONFIG)

---

## [7.27] - 2026-01-26

### Added
- **Filtro por mes** en CARGA_FAMILIA y CARGA_NT: dropdown en J2 con "TODOS" + 12 meses
- Al filtrar: ordena por fecha + oculta filas de otros meses
- Al seleccionar "TODOS": muestra todo ordenado cronológicamente
- Las filas ocultas NO afectan fórmulas (SUMPRODUCT sigue calculando todo)
- Utilidad de menú: "📅 Agregar Filtro por Mes a CARGA" para hojas existentes

### Technical
- Sheets.gs: fila 2 dividida (A2:H2 subtitle + I2 label + J2 dropdown)
- Code.gs: onEdit detecta J2, filtrarCargaPorMes() ordena y oculta filas en lotes
- Sort solo columnas A-I (preserva ARRAYFORMULA de J)

---

## [7.26] - 2026-01-26

### Added
- **Columna VÁLIDO (J)** en CARGA_FAMILIA y CARGA_NT: ARRAYFORMULA que detecta filas que NO serán contadas en TABLERO
  - "✓" = fila válida, será contada
  - "⚠ Fecha" = fecha inválida/texto
  - "⚠ Año" = año ≠ 2026
  - "⚠ Monto" = monto vacío o texto
- **Formato condicional**: filas con ⚠ se resaltan en rojo claro, ✓ en verde
- **Utilidad de menú**: "✓ Agregar columna VÁLIDO a CARGA" para agregar a hojas existentes sin reinicializar

### Technical
- Sheets.gs: headers expandidos A-J, ARRAYFORMULA en J4, conditional formatting mejorado
- Code.gs: nueva función `agregarColumnaValido()`, menú actualizado

---

## [7.25] - 2026-01-26

### Changed
- **VARIABLES FAMILIA**: 5 reservas dinámicas (antes 2) → total 19 ítems (14 fijos + 5 reservas)
- **VARIABLES NEUROTEA**: 5 reservas dinámicas (antes 2) → total 15 ítems (10 fijos + 5 reservas)
- "Gastos del Colegio" (FAM) y "Muebles y equipos" (NT) permanecen como ítems permanentes
- Rangos MOVIMIENTO actualizados: FAMILIA 9-116, NEUROTEA 122-206

### Technical
- Config.gs: VARIABLES_FAMILIA, VARIABLES_NT, VARIABLES_PRESUP_FAM, VARIABLES_PRESUP_NT (+3 reservas c/u)
- Sheets.gs: LIQUIDEZ parámetros actualizados (9,116 y 122,206)
- Tablero.gs: 12+ referencias de rango actualizadas (SUMIF, SUMIFS, SUMPRODUCT)
- WebApp.gs: 2 getRange actualizados

---

## [7.24] - 2026-01-26

### Fixed
- **BUG CRÍTICO:** SUMPRODUCT retornaba 0 si UNA fecha en CARGA era texto/malformada → ahora usa `IFERROR(MONTH();0)` y `IFERROR(YEAR();0)` dentro del SUMPRODUCT para aislar filas con fechas inválidas
- **BUG:** SUBCATEGORÍA mostraba error de validación al pegar datos desde otro Google Sheet → cambiado de `requireValueInRange(CONFIG)` a `requireValueInList(VARIABLES_*)` para compatibilidad con paste
- **BUG:** Validación de SUBCATEGORÍA en Code.gs (restauración Egreso) también usaba `requireValueInRange` → unificado a `requireValueInList`

### Changed
- `repararDatosCarga()` ahora también: trim de espacios en texto, limpieza de validaciones en filas de ingreso/ahorro
- Menú renombrado: "Reparar Datos Pegados en CARGA" (antes "Reparar Fechas/Montos")
- Todas las fórmulas SUMPRODUCT en Sheets.gs, Tablero.gs protegen MONTH/YEAR con IFERROR individual

### Technical
- Sheets.gs: 3 fórmulas SUMPRODUCT en MOVIMIENTO (ingresos, variables, ahorro)
- Tablero.gs: 10+ fórmulas SUMPRODUCT (Esperado FAM/NT, Ahorro, Fondo, Balance cruzado)
- Code.gs: 2 puntos de restauración de validación (FAMILIA y NT col 2 handler)

---

## [7.23] - 2026-01-26

### Added
- `repararDatosCarga()`: utilidad para convertir fechas/montos pegados como texto
- `analizarFechaTexto()`: detecta fechas bien formadas vs malformadas
- Menú: Utilidades → "Reparar Fechas/Montos en CARGA"

### Fixed
- Fórmula Esperado en Tablero.gs: cada SUMPRODUCT ahora tiene IFERROR individual (antes uno externo cubría todos)

---

## [7.22] - 2026-01-26

### Added
- Nuevas subcategorías: "Gastos del Colegio" (FAMILIA), "Muebles y equipos" (NT) - reemplazan Reserva Var. 1
- Restauración completa de dropdowns CATEGORÍA/SUBCATEGORÍA al cambiar TIPO a Egreso

### Changed
- Distribución ganancia NT simplificada: `=IF(ganancia>0;ganancia/3;0)` en PRESUPUESTO y MOVIMIENTO

### Fixed
- **BUG CRÍTICO:** Validación "No válido" en SUBCATEGORÍA y CATEGORÍA al seleccionar Ingreso/Ahorro
- **BUG CRÍTICO:** Transacciones auto-creadas (préstamos/devoluciones) mostraban error de validación
- **BUG:** CATEGORÍA dropdown desaparecía al cambiar Ingreso → Egreso (validación no se restauraba)
- **BUG:** SUBCATEGORÍA mostraba warning al seleccionar CATEGORÍA no-VARIABLES (faltaba clearDataValidations)
- `clearDataValidations()` aplicado en 6+ puntos donde se asigna "-" a celdas con validación activa
- Validaciones restauradas con `setDataValidation()` al volver a modo Egreso

---

## [7.21] - 2026-01-24

### Added
- Auto-limpieza de contrapartes huérfanas via trigger `onChange` (detecta `REMOVE_ROW`)
- `limpiarContrapartesHuerfanas()`: escanea LINK_IDs sin par y elimina filas huérfanas
- `instalarTriggerOnChange()`: instala el trigger una sola vez desde menú
- Menú: Utilidades → "Verificar Contrapartes Huérfanas" + "Instalar Auto-limpieza"

### Fixed
- Auto-creación de "Devolución NT → Familia" no generaba ingreso en CARGA_FAMILIA
- FECHA, TIPO y CATEGORÍA ahora reintentan `intentarAutoCreacion` para entradas nuevas
- `validarPrestamoDevolucionNT/Familia` retornan boolean y hacen `return` si bloquean
- Eliminado flujo donde validación limpiaba celda pero código seguía ejecutando

---

## [7.20] - 2026-01-22

### Added
- Reservas de VARIABLES dinámicamente renombrables desde CONFIG
- `obtenerVariablesDesdeConfig()` lee subcategorías dinámicamente
- Dropdown SUBCATEGORÍA usa `requireValueInRange` para reflejar cambios en CONFIG

### Changed
- Validación de SUBCATEGORÍA ahora lee desde CONFIG en lugar de arrays hardcodeados

---

## [7.19] - 2026-01-22

### Added
- Sincronización dinámica de contrapartes (FECHA, MONTO, CUENTA)
- `sincronizarContraparte()` - actualiza campo específico en contraparte
- `recrearContraparte()` - borra y recrea cuando cambia tipo de transacción
- Trigger en columna CUENTA para completar auto-creación

### Changed
- Auto-creación ahora espera TODOS los campos completos (FECHA, TIPO, CATEGORÍA, SUBCATEGORÍA, MONTO, CUENTA)

### Fixed
- Cambiar SUBCATEGORÍA de préstamo a devolución ahora borra y recrea correctamente

---

## [7.18] - 2026-01-22

### Added
- `intentarAutoCreacionFamilia()` - verifica 6 campos antes de auto-crear
- `intentarAutoCreacionNT()` - misma lógica para NeuroTEA

### Fixed
- Auto-creación ya no se dispara prematuramente

---

## [7.17] - 2026-01-22

### Changed
- Distribución ganancia NT simplificada: `=IF(H21>0;H21/3;0)`
- Eliminados porcentajes configurables (eran innecesarios)

---

## [7.16] - 2026-01-22

### Fixed
- `limpiarMonto()` usado en verificación de SUBCATEGORÍA
- Toast de debug mejorado

---

## [7.15] - 2026-01-21

### Added
- `limpiarMonto()` para formato paraguayo (5.000.000)
- Logging con console.log para debugging

### Fixed
- Dropdown TIPO con `setAllowInvalid(true)` permite auto-creación

---

## [7.14] - 2026-01-21

### Changed
- Dropdowns TIPO simplificados (préstamos/devoluciones son solo auto-creados)
- TABLERO usa INDEX/MATCH en lugar de SUMPRODUCT

### Added
- Arrays separados: `TIPOS_INGRESO_*` vs `TIPOS_INGRESO_*_AUTOCREADOS`

---

## [7.13] - 2026-01-21

### Fixed
- Sistema anti-loop con timeout de 10 segundos
- Tipos auto-creados reconocidos en validaciones

---

## [7.12] - 2026-01-21

### Added
- Sistema LINK_ID (6 caracteres) para vincular contrapartes
- Auto-borrado sincronizado de transacciones cruzadas
- `borrarContraparte()`, `buscarContraparte()`

---

## [7.11] - 2026-01-20

### Fixed
- DISPONIBLE ahora referencia TOTAL DISPONIBLE (coherencia garantizada)
- GANANCIA REAL NT referencia TOTAL DISPONIBLE NT

---

## [7.8] - 2026-01-20

### Fixed
- **BUG CRÍTICO:** "Esperado" por cuenta no restaba gastos fijos
- Nueva columna N (CUENTA) en MOVIMIENTO

---

## [7.5] - 2026-01-19

### Fixed
- AHORRO ahora RESTA en fórmula Esperado (antes sumaba incorrectamente)
- Saldos globales son FÓRMULAS que suman saldos por cuenta

---

## [7.1] - 2026-01-19

### Fixed
- **BUG CRÍTICO:** INGRESOS volvían a cero después de préstamo
- `aplicarFormatoFecha()` después de setValues()
- Duplicación de transacciones cruzadas evitada con `existeTransaccionCruzada()`
