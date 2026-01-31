# DECISIONES.md - Registro de Cambios Aprobados

> **IMPORTANTE**: Este archivo contiene decisiones FINALES aprobadas por el usuario.
> Claude NO debe revertir, modificar ni contradecir estas decisiones.
> Solo el usuario puede agregar o modificar entradas aquí.

---

## Formato de Registro

```
### [FECHA] - Título corto
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**: Qué se decidió
**Archivos afectados**: Lista de archivos
**Razón**: Por qué se tomó esta decisión
```

---

## Decisiones Registradas

### [2026-01-02] - Origen de datos REAL según frecuencia
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Frecuencia "Variable" (puro) → SUMIFS desde CARGA_FAMILIA/CARGA_NT
- Frecuencia "Fijo/Mensual", "Variable/Mensual", "Fijo/Anual", "Variable/Anual" → INDEX/MATCH desde GASTOS_FIJOS
**Archivos afectados**: gs/Sheets.gs, CLAUDE.md
**Razón**: El usuario aclaró que solo los gastos puramente variables (Supermercado, Combustible) van a CARGA. Los que tienen BASE van a GASTOS_FIJOS.

---

### [2026-01-02] - MOVIMIENTO y TABLERO con fórmulas dinámicas
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- MOVIMIENTO debe usar fórmulas que lean de PRESUPUESTO, GASTOS_FIJOS y CARGA
- TABLERO debe usar fórmulas que lean de MOVIMIENTO
- NUNCA valores fijos/hardcodeados
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs
**Razón**: El usuario rechazó la versión con valores estáticos. El sistema debe actualizarse en tiempo real.

---

### [2026-01-02] - Selector de mes en MOVIMIENTO controla todo
**Estado**: 🔄 EVOLUCIONADA → ver v2 [2026-01-02b]

---

### [2026-01-02b] - Selector de mes en MOVIMIENTO controla todo (v2)
**Estado**: ✅ APROBADO - NO REVERTIR
**Evoluciona de**: [2026-01-02] Selector de mes en MOVIMIENTO
**Descripción**:
- Celda B3 de MOVIMIENTO tiene dropdown con meses
- Celda **L3** (oculta) tiene fórmula MATCH que convierte mes a número (antes era K3)
- Todas las fórmulas usan **$L$3** para filtrar por mes
- TABLERO sincroniza con MOVIMIENTO!B3 y usa MOVIMIENTO!L3 para el número de mes
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, CLAUDE.md
**Razón del cambio**: Se agregó columna EST. PAGO (columna I), desplazando MES_NUM a columna L.

---

### [2026-01-02] - Sistema de documentación con memoria
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- CLAUDE.md es la fuente de verdad técnica
- PLAN_MAESTRO es la referencia de negocio
- settings.json tiene reglas estructuradas
- /verificar audita consistencia
- DECISIONES.md registra cambios aprobados
**Archivos afectados**: CLAUDE.md, .claude/settings.json, .claude/commands/verificar.md, DECISIONES.md
**Razón**: Evitar que Claude "olvide" o "alucine" cambios diferentes a los acordados.

---

### [2026-01-02c] - Columna EST. PAGO en MOVIMIENTO
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- MOVIMIENTO ahora tiene 10 columnas (antes 9)
- Nueva columna I: EST. PAGO con dropdown (Pendiente, Pagado, Cancelado)
- Permite trackear el estado de pago de cada concepto individualmente
- Columnas K-L quedan ocultas (MES_NUM)
**Archivos afectados**: gs/Sheets.gs, CLAUDE.md
**Razón**: Requerimiento del usuario para control de pagos en la hoja MOVIMIENTO.

---

### [2026-01-02d] - Todas las fórmulas con IFERROR
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- TODAS las fórmulas INDEX, MATCH, SUMIFS, SUMIF deben estar envueltas en IFERROR(...,0)
- Evita errores #VALUE!, #ERROR!, #N/A cuando no hay datos
- Ejemplo: `=IFERROR(SUMIFS(...),0)` en lugar de `=SUMIFS(...)`
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, CLAUDE.md
**Razón**: El sistema mostraba #VALUE! en hojas vacías. Con IFERROR muestra 0.

---

### [2026-01-02e] - Nombres de conceptos unificados
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Los nombres en VARIABLES_PRESUP_FAM deben coincidir EXACTAMENTE con VARIABLES_FAMILIA
- Los nombres en VARIABLES_PRESUP_NT deben coincidir EXACTAMENTE con VARIABLES_NT
- Ejemplo: "Recreación (Pizza, hamburguesa, helados, etc)" NO "Recreación"
- Ejemplo: "Mantenimiento / Reparaciones Auto Clara" NO "Mant. Auto Clara"
**Archivos afectados**: gs/Config.gs
**Razón**: Los SUMIFS fallan si los nombres no coinciden exactamente.

---

### [2026-01-02f] - Valores iniciales en cero
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Todos los `monto: 0` en Config.gs
- Las hojas CARGA inician vacías
- PRESUPUESTO se completa manualmente por el usuario
- GASTOS_FIJOS tiene BASE=0 hasta que el usuario ingrese valores
**Archivos afectados**: gs/Config.gs
**Razón**: El usuario solicitó que el sistema inicie sin valores precargados.

---

### [2026-01-03g] - SUMPRODUCT en lugar de SUMIFS para filtrar por mes/año
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Usar `SUMPRODUCT` en lugar de `SUMIFS` cuando se filtran fechas con `MONTH()` y `YEAR()`
- SUMIFS no funciona correctamente con funciones de fecha como criterio en español
- Sintaxis correcta: `=SUMPRODUCT((CARGA!$B$4:$B$500="Concepto")*(MONTH(CARGA!$A$4:$A$500)=$L$3)*(YEAR(CARGA!$A$4:$A$500)=2026)*(CARGA!$F$4:$F$500))`
- Siempre envuelto en `IFERROR(...,0)`
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs
**Razón**: SUMIFS fallaba silenciosamente al no reconocer MONTH()/YEAR() como criterios válidos.

---

### [2026-01-03h] - Locale español en fórmulas Google Sheets
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Separador decimal: **coma** (`,`) → `0,07` no `0.07`
- Separador de argumentos: **punto y coma** (`;`) → `IF(A1>0;B1;C1)` no `IF(A1>0,B1,C1)`
- Aplica a todas las fórmulas generadas por Apps Script
- Ejemplo: `=IFERROR(E${row}*0,3333;0)` para 33.33%
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs
**Razón**: El sistema está configurado para Paraguay (es-PY) que usa formato europeo de números.

---

### [2026-01-03i] - WebApp.gs con concatenación de strings
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- El HTML se genera usando **concatenación de strings** (`+`) en lugar de template literals
- Google Apps Script NO soporta template literals anidados con backticks escapados
- Se usan funciones auxiliares (`generarFilasCuentasFamilia()`, `generarTortaGastos()`, etc.) para modularizar
**Archivos afectados**: gs/WebApp.gs
**Razón**: Error de sintaxis "Invalid or unexpected token" al usar template literals anidados.

---

### [2026-01-03j] - Cálculo dinámico de posiciones en WebApp
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Las posiciones de celdas en `obtenerDatosDashboard()` se calculan dinámicamente
- Basado en `CUENTAS_FAMILIA.length` (10) y `CUENTAS_NT.length` (3)
- Posiciones clave calculadas:
  - FILA_INICIO_CUENTAS_FAM = 8
  - FILA_TOTAL_CUENTAS_FAM = 8 + 10 = 18
  - FILA_INGRESOS_FAM = 23, FILA_EGRESOS_FAM = 24, FILA_BALANCE_FAM = 25
  - FILA_INGRESOS_NT = 9 (H9/J9), FILA_GANANCIA_NT = 13 (H13/J13)
  - FILA_DISTRIBUCION = 20
- Función `leerNumero()` para evitar valores NaN
**Archivos afectados**: gs/WebApp.gs
**Razón**: Valores hardcodeados causaban que el HTML mostrara datos incorrectos o NaN.

---

## Cómo Agregar Nuevas Decisiones

Después de aprobar un cambio, el usuario debe decir:
```
"Registra esta decisión: [descripción]"
```

Claude agregará una nueva entrada con:
- Fecha actual
- Descripción del cambio
- Archivos afectados
- Razón de la decisión
- Estado: ✅ APROBADO - NO REVERTIR

---

## Reglas para Claude

1. **ANTES de modificar código**: Leer DECISIONES.md
2. **Si un cambio contradice una decisión**: DETENER y mostrar ALERTA DE IMPACTO
3. **NUNCA revertir silenciosamente** - siempre notificar
4. **Si hay duda**: Preguntar antes de actuar

---

## Protocolo de Modificación de Decisiones

Las decisiones pueden **evolucionar** cuando hay razones válidas. Cuando detecte un conflicto:

### Paso 1: Mostrar Alerta de Impacto
```
⚠️ ALERTA: Este cambio afecta una decisión aprobada

📋 Decisión afectada: [nombre]
📅 Aprobada el: [fecha]
📝 Dice actualmente: [descripción]

🔄 Cambio propuesto: [nuevo comportamiento]

📊 ANÁLISIS DE IMPACTO:
- Archivos que cambiarían: [lista]
- Funcionalidad afectada: [descripción]
- Riesgo: [Bajo/Medio/Alto]

❓ ¿Deseas:
   A) Proceder con el cambio (evolucionará la decisión)
   B) Cancelar y mantener la decisión actual
   C) Discutir alternativas
```

### Paso 2: Si el usuario aprueba, registrar evolución
La decisión original se marca como EVOLUCIONADA y se crea una nueva versión.

---

## Decisiones Evolucionadas (Historial)

Cuando una decisión cambia, se registra así:

```
### [FECHA] - Título (v2)
**Estado**: ✅ APROBADO - NO REVERTIR
**Evoluciona de**: [referencia a versión anterior]
**Descripción**: Nueva descripción
**Razón del cambio**: Por qué se modificó
**Archivos afectados**: Lista actualizada
```

La versión anterior se marca como:
```
**Estado**: 🔄 EVOLUCIONADA → ver v2
```

---

## Ejemplo de Evolución

### Antes:
```
### [2026-01-02] - Meta ganancia NT 7%
**Estado**: 🔄 EVOLUCIONADA → ver v2 [2026-02-15]
```

### Después:
```
### [2026-02-15] - Meta ganancia NT 10% (v2)
**Estado**: ✅ APROBADO - NO REVERTIR
**Evoluciona de**: [2026-01-02] Meta ganancia NT 7%
**Razón del cambio**: Análisis financiero mostró que 7% era insuficiente
```

---

---

### [2026-01-03k] - EST. PAGO como GATILLO de contabilización
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- EST. PAGO en MOVIMIENTO controla DÓNDE se contabiliza cada gasto
- **Pendiente**: Monto se muestra pero suma a "EGRESOS PENDIENTES" (no a pagados)
- **Pagado**: Monto suma a "EGRESOS PAGADOS" (se descuenta de DISPONIBLE)
- **Cancelado**: Monto no suma a ninguno (anulado)
- Por defecto: Todos los conceptos inician como "Pendiente"
- Fórmula TABLERO: `EGRESOS_PAGADOS = SUMIF(MOVIMIENTO!I:I,"Pagado",MOVIMIENTO!E:E)`
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, PLAN_MAESTRO (§8.3)
**Razón**: El usuario quiere controlar manualmente cuándo un gasto se considera "efectuado", no automáticamente.

---

### [2026-01-03l] - Nueva hoja LIQUIDEZ (8va hoja)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Se crea una 8va hoja llamada "LIQUIDEZ" (antes eran 7 + WEB APP popup)
- Estructura:
  - 🔴 ATRASADOS: Gastos donde DÍA < DAY(TODAY()) y EST.PAGO = "Pendiente"
  - 🟡 ESTA SEMANA: DÍA entre HOY y HOY+7
  - 🟢 PRÓXIMA SEMANA: DÍA entre HOY+8 y HOY+14
- Usa fórmulas con TODAY() que se actualizan automáticamente cada día
- Separado por entidad: FAMILIA y NEUROTEA
- Incluye resumen con SALDO PROYECTADO
**Archivos afectados**: gs/Sheets.gs (nueva función crearHojaLIQUIDEZ), gs/Código.gs, PLAN_MAESTRO (§11)
**Razón**: El usuario quiere ver claramente qué gastos vencieron, cuáles vencen esta semana y cuáles la próxima.

---

### [2026-01-03m] - SALDO_INICIAL manual por mes
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- En TABLERO, sección editable para ingresar SALDO_INICIAL de cada entidad
- Al cambiar de mes, el usuario carga manualmente el saldo que quedó del mes anterior
- Fórmula: `DISPONIBLE = SALDO_INICIAL + INGRESOS_MES - EGRESOS_PAGADOS`
- NO se arrastra automáticamente del mes anterior (simplicidad)
- Flujo: Cerrar enero → Ver saldo final → Cambiar a febrero → Cargar saldo inicial febrero
**Archivos afectados**: gs/Tablero.gs, PLAN_MAESTRO (§12.0)
**Razón**: El usuario prefiere control manual del cierre de mes en lugar de fórmulas complejas de arrastre.

---

### [2026-01-03n] - Corrección de colores en DIFERENCIA
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Colores de la columna DIFERENCIA deben considerar el contexto:
  - **INGRESOS**: Positivo (+) = VERDE (recibiste más), Negativo (-) = ROJO (recibiste menos)
  - **EGRESOS**: Negativo (-) = VERDE (gastaste menos), Positivo (+) = ROJO (gastaste más)
- Antes: Misma regla para todos (invertido para ingresos)
- Implementación: Formato condicional con fórmula que verifica columna TIPO
**Archivos afectados**: gs/Sheets.gs (reglas de formato condicional)
**Razón**: El usuario reportó que los colores estaban invertidos para ingresos.

---

### [2026-01-03o] - EST.PAGO diferenciado según origen del dato
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Los items que vienen de **CARGA** (ya pagados/recibidos) NO tienen dropdown:
  - **INGRESOS**: EST.PAGO = "Recibido" (fijo, gris, cursiva)
  - **VARIABLES puros**: EST.PAGO = "Pagado" (fijo, gris, cursiva)
  - **EVENTOS**: EST.PAGO = "Pagado" (fijo, gris, cursiva)
- Solo **GASTOS_FIJOS** tienen dropdown (Pendiente/Pagado/Cancelado)
- Razón: Si ya cargaste un gasto en CARGA, es porque ya lo pagaste. No tiene sentido preguntar si está pendiente.
**Archivos afectados**: gs/Sheets.gs (funciones escribirSeccionMovimiento*)
**Razón**: El usuario detectó inconsistencia: items de CARGA aparecían como "Pendiente" pero ya estaban contabilizados como pagados en TABLERO.

---

### [2026-01-03p] - Cuentas NEUROTEA corregidas
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- NEUROTEA tiene solo 2 cuentas:
  1. Atlas NeuroTEA (cuenta bancaria)
  2. UENO Marco (cuenta compartida con Familia para gastos NT en efectivo)
- Se eliminó "Efectivo NT" que era redundante
- v7.4: "Caja Chica NT" renombrada a "UENO Marco" para reflejar uso real
- En TABLERO, SALDOS NT muestra: Esperado (automático desde CARGA_NT) y Real ✏️ (manual)
**Archivos afectados**: gs/Config.gs, gs/Tablero.gs
**Razón**: El usuario corrigió que no existe cuenta "Efectivo NT" separada de Caja Chica.

---

---

### [2026-01-04q] - Columna CUENTA en GASTOS_FIJOS
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- GASTOS_FIJOS ahora tiene columna F = CUENTA
- Indica de qué cuenta bancaria se debita cada gasto fijo
- Nueva estructura de columnas:
  - A=CONCEPTO, B=ENTIDAD, C=CATEGORÍA, D=FRECUENCIA, E=DÍA
  - **F=CUENTA** (nueva)
  - G=BASE, H-S=ENE-DIC (meses desplazados)
- Dropdown con opciones de CUENTAS_FAMILIA o CUENTAS_NT según entidad
**Archivos afectados**: gs/Config.gs, gs/Sheets.gs, CLAUDE.md
**Razón**: El usuario necesita saber de qué cuenta se paga cada gasto fijo para control de saldos.

---

### [2026-01-04r] - "Saldo Banco" en lugar de "Real" en TABLERO
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- En TABLERO, sección "SALDOS EN CUENTAS", la columna editable se renombró
- Antes: "Real ✏️"
- Ahora: "Saldo Banco ✏️"
- Razón: "Real" se confundía con la columna REAL de MOVIMIENTO (que muestra gastos reales)
- "Saldo Banco" es más claro: es el saldo que el usuario verifica en su banco/app
**Archivos afectados**: gs/Tablero.gs, CLAUDE.md
**Razón**: El usuario reportó confusión por tener "Real" en dos contextos con significados diferentes.

---

### [2026-01-04s] - AHORRO carga desde CARGA_FAMILIA (no GASTOS_FIJOS)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- AHORRO ya NO está en GASTOS_FIJOS
- AHORRO se registra en CARGA_FAMILIA cuando efectivamente se hace la transferencia
- Items de ahorro: Ahorro Clara, Ahorro Marco, Fondo de Emergencia
- En MOVIMIENTO:
  - Sección separada "AHORRO" (verde)
  - EST.PAGO = "Ahorrado" (fijo, verde, cursiva) - no es "Pendiente"
  - Fórmula: SUMPRODUCT desde CARGA_FAMILIA
- En CARGA_FAMILIA:
  - Si CATEGORÍA = AHORRO → muestra dropdown con subcategorías ahorro
**Archivos afectados**: gs/Config.gs (AHORRO_FAMILIA array), gs/Sheets.gs, gs/Code.gs (onEdit)
**Razón**: El ahorro es una transferencia positiva que se hace cuando hay dinero disponible. No tiene sentido tenerlo como "Pendiente" ya que no es una obligación fija.

---

### [2026-01-04t] - PRESUPUESTO con cálculos automáticos completos
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- PRESUPUESTO ahora incluye fórmulas calculadas según PLAN_MAESTRO §4:
  - Subtotales por sección (SUM automático)
  - TOTAL INGRESOS FAMILIA / EGRESOS FAMILIA / BALANCE FAMILIA
  - TOTAL INGRESOS NEUROTEA / EGRESOS NEUROTEA
  - **Ganancia Calculada** = Ingresos - Egresos
  - **% Ganancia** = Ganancia / Ingresos (formato porcentaje)
  - **Estado Meta** con semáforo:
    - 🔴 PÉRDIDA: Ganancia < 0
    - 🟡 <7%: Ganancia 0-7%
    - 🟢 META: Ganancia ≥ 7%
  - Distribución de utilidad: 33.33% cada fondo (lee de METAS_NT.GANANCIA_MINIMA_PCT)
  - BALANCE NEUROTEA
  - BALANCE CONSOLIDADO FAM/NT
**Archivos afectados**: gs/Sheets.gs (crearHojaPRESUPUESTO, escribirSeccionPresupuesto, escribirSeccionEventos)
**Razón**: El usuario identificó que PRESUPUESTO no tenía los cálculos especificados en PLAN_MAESTRO §4.

---

---

### [2026-01-05u] - GASTOS_FIJOS sin columna BASE
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Se eliminó la columna BASE de GASTOS_FIJOS
- Ahora cada mes (G-R = ENE-DIC) tiene su valor directo
- MOVIMIENTO copia el DÍA a columna D para que LIQUIDEZ y TABLERO lean directamente sin INDEX/MATCH
- Nueva estructura: A=CONCEPTO, B=ENTIDAD, C=CATEGORÍA, D=FRECUENCIA, E=DÍA, F=CUENTA, G-R=ENE-DIC
**Archivos afectados**: gs/Config.gs, gs/Sheets.gs, CLAUDE.md
**Razón**: Simplifica la entrada de datos y el cálculo de fórmulas. Usuario ingresa monto directamente por mes.

---

### [2026-01-05v] - Estilo sobrio profesional (v6.1)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Headers de FAMILIA y NEUROTEA ahora usan gris neutro (#1F2937) en lugar de colores distintivos
- Fondos alternados en gris claro (#F9FAFB) y blanco
- Colores solo para indicadores de estado: verde=OK, amarillo=advertencia, rojo=alerta
- Estilo consistente entre Google Sheets y WebApp HTML
**Archivos afectados**: gs/Config.gs (COLORES), gs/Tablero.gs, gs/WebApp.gs
**Razón**: Apariencia más profesional y menos distractora. Los colores comunican estado, no identidad de entidad.

---

### [2026-01-06w] - LIQUIDEZ rediseñada con layout intuitivo (v6.2)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- LIQUIDEZ responde la pregunta clave: "¿Tengo plata para pagar mis gastos fijos?"
- Panel principal con 3 tarjetas grandes:
  1. 💵 SALDO DISPONIBLE (azul)
  2. ⏳ TOTAL PENDIENTE (naranja)
  3. 📊 ¿ALCANZA? (verde/rojo condicional)
- Panel lateral por semana mostrando:
  - 🔴 Atrasados (cantidad + monto)
  - ⏳ Pendientes (cantidad + monto)
  - ✅ Pagados (cantidad + monto)
  - 📋 Total semana
  - ¿Saldo cubre? (indicador)
**Archivos afectados**: gs/Sheets.gs (crearHojaLiquidezEntidad)
**Razón**: El usuario necesita ver de un vistazo si su saldo cubre los gastos pendientes.

---

### [2026-01-06x] - Préstamos bidireccionales NT↔FAM (v6.3)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Ahora se trackean préstamos en AMBAS direcciones:
  - **FLUJO NT → FAM**: Préstamo NT → Familia, Devolución Familia → NT, Deuda FAM → NT
  - **FLUJO FAM → NT**: Préstamo Familia → NT, Devolución NT → Familia, Deuda NT → FAM
- Nuevos conceptos agregados:
  - FAMILIA Ingreso: "Devolución NeuroTEA" (NT devuelve a FAM)
  - FAMILIA Egreso Variable: "Préstamo Familia → NT"
  - NT Ingreso: "Préstamo Familia" (FAM presta a NT)
  - NT Egreso Variable: "Devolución NT → Familia"
- TABLERO Balance Cruzado expandido a 8 filas (antes 4)
- WebApp muestra flujo bidireccional con colores diferenciados
- Balance Neto = Deuda FAM - Deuda NT
  - > 0: FAM debe a NT (rojo)
  - < 0: NT debe a FAM (amarillo)
  - = 0: Equilibrado (verde)
**Archivos afectados**: gs/Config.gs, gs/Sheets.gs, gs/Tablero.gs, gs/WebApp.gs, CLAUDE.md
**Razón**: Usuario identificó que solo existía flujo NT→FAM. Familia también puede prestar a NT para cubrir déficit.

---

### [2026-01-06y] - GANANCIA consistente entre TABLERO y MOVIMIENTO
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- TABLERO ahora usa la misma fórmula que MOVIMIENTO para calcular GANANCIA NT
- Fórmula correcta: `GANANCIA = INGRESOS - EGRESOS_PAGADOS - EGRESOS_PENDIENTES`
- Antes TABLERO usaba: `GANANCIA = INGRESOS - EGRESOS_PAGADOS` (incorrecto)
- La distribución (Utilidad, Fondo Emergencia, Fondo Inversión) se basa en ganancia real
**Archivos afectados**: gs/Tablero.gs
**Razón**: Usuario reportó que RESUMEN NEUROTEA mostraba 0s porque la fórmula no consideraba egresos pendientes.

---

### [2026-01-13z] - Rangos de filas NEUROTEA corregidos (119-200)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Las fórmulas de TABLERO para NEUROTEA usaban rango hardcodeado 73-150 (INCORRECTO)
- Filas 73-113 corresponden a FAMILIA (SUSCRIPCIONES, VARIABLES, AHORRO)
- NEUROTEA comienza en fila 119
- Corregidas 8 fórmulas en Tablero.gs: líneas 539, 552, 594, 1009, 1014, 1033, 1039, 1092
- Nuevo rango correcto: 119-200
**Archivos afectados**: gs/Tablero.gs, CLAUDE.md
**Razón**: Usuario reportó que NEUROTEA mostraba -902.000 cuando no había transacciones. Era porque sumaba SUSCRIPCIONES de FAMILIA como gastos de NEUROTEA.

---

### [2026-01-13aa] - AHORRO separado de GASTOS con PATRIMONIO FAMILIA
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- AHORRO es transferencia, NO gasto (el dinero sigue siendo de FAMILIA)
- En MOVIMIENTO summary: "TOTAL EGRESOS PAGADOS" → "TOTAL GASTOS OPERATIVOS" (sin AHORRO)
- En TABLERO: "EGRESOS PAGADOS" → "GASTOS OPERATIVOS"
- Nuevo indicador: "PATRIMONIO FAMILIA" = INGRESOS - GASTOS (incluye ahorros como activos)
- DISPONIBLE = INGRESOS - GASTOS - AHORRO (para saber cuánto queda para gastar/ahorrar)
- Fórmulas corregidas:
  - Sheets.gs línea 952: Excluye "Ahorrado" de GASTOS OPERATIVOS
  - Tablero.gs: Nuevo indicador PATRIMONIO FAMILIA
**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, CLAUDE.md
**Razón**: Usuario identificó que AHORRO no debería tratarse como gasto. Es una transferencia entre cuentas propias.

---

### [2026-01-13ab] - Columnas ocultas CATEGORÍA y ENTIDAD en MOVIMIENTO
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- MOVIMIENTO tiene columnas L (CATEGORÍA) y M (ENTIDAD) ocultas
- Almacenan metadatos para cálculos de % GASTOS POR CATEGORÍA
- Se usan con SUMIFS para filtrar gastos por categoría y entidad
- Eliminan necesidad de INDEX/MATCH complejos en TABLERO
**Archivos afectados**: gs/Sheets.gs (escribirSeccionMovimiento*), gs/Tablero.gs
**Razón**: % GASTOS POR CATEGORÍA no funcionaba porque las fórmulas originales usaban INDEX con row 0 que no funciona en locale español.

---

### [2026-01-14ac] - Rango GASTOS OPERATIVOS FAMILIA expandido (F9:F113)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- El rango de GASTOS OPERATIVOS en TABLERO estaba limitado a F9:F70
- Esto excluía SUSCRIPCIONES (filas 73+) y VARIABLES (filas 93+)
- Corregido a F9:F113 para incluir todas las categorías de egresos FAMILIA
- Además, se incluye EST.PAGO="Ahorrado" junto con "Pagado" en la suma
**Archivos afectados**: gs/Tablero.gs (línea 319)
**Razón**: Bug detectado durante testing - % GASTOS POR CATEGORÍA mostraba 0% porque el divisor (GASTOS OPERATIVOS) era 0.

---

### [2026-01-14ad] - GANANCIA REAL NT = Ingresos - Pagados (sin pendientes)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- La fórmula de GANANCIA REAL en NEUROTEA estaba calculando: Ingresos - Pagados - Pendientes
- Esto es incorrecto porque GANANCIA REAL es lo que efectivamente ganaste hasta ahora
- Corregido a: Ingresos - Pagados (sin restar pendientes)
- La PROYECCIÓN FIN DE MES sí resta los pendientes, pero eso es diferente a GANANCIA REAL
**Archivos afectados**: gs/Tablero.gs (línea 661)
**Razón**: Bug detectado durante testing - GANANCIA REAL mostraba valor negativo porque restaba egresos aún no pagados.

---

### [2026-01-14ae] - Formato de número en Balance Cruzado con puntos
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- El Balance Cruzado mostraba "Gs. 1000000" sin separadores de miles
- En Paraguay se usa el punto (.) como separador de miles, no la coma
- Corregido usando: SUBSTITUTE(TEXT(ROUND(valor;0);"#,##0");",";".")
- Esto convierte el formato estándar con comas a puntos
- Resultado: "Gs. 1.000.000" en lugar de "Gs. 1000000"
**Archivos afectados**: gs/Tablero.gs (líneas 394, 408, 706, 720, 1514)
**Razón**: Mejora de legibilidad solicitada por usuario - los números grandes son difíciles de leer sin separadores.

---

### [2026-01-14af] - Formato de número Paraguay también en Sheets.gs
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
- Las fórmulas de "Sobrante/Faltante" y "Monto atrasado" en CALENDARIO_MES también mostraban números sin separadores
- Aplicado el mismo patrón SUBSTITUTE(TEXT(valor;"#,##0");",";".")
- Afecta las líneas de resumen financiero del calendario mensual
**Archivos afectados**: gs/Sheets.gs (líneas 1668, 1679)
**Razón**: Consistencia con el resto del sistema - todos los montos en Guaraníes deben usar puntos como separador de miles.

---

### [2026-01-15a] - Validación Anti-Burro para préstamos/devoluciones
**Estado**: 🔄 EVOLUCIONADA → ver [2026-01-15b]

---

### [2026-01-15b] - Validación Anti-Burro COMPLETA (TIPO/CATEGORÍA/SUBCATEGORÍA)
**Estado**: ✅ APROBADO - NO REVERTIR
**Evoluciona de**: [2026-01-15a] Validación préstamos/devoluciones
**Descripción**:
Sistema completo de validaciones para evitar incoherencias en la carga de datos:

1. **TIPO Ingreso → Bloquea CATEGORÍA y SUBCATEGORÍA**
   - Si TIPO es ingreso, las columnas C y D se bloquean con "-"

2. **Contradicciones TIPO vs SUBCATEGORÍA**
   - TIPO="Devolución NeuroTEA" + SUBCAT="Devolución Familia → NT" → BLOQUEO
   - TIPO="Préstamo NeuroTEA" + SUBCAT="Préstamo Familia → NT" → BLOQUEO
   - Cualquier TIPO ingreso + SUBCATEGORÍA de egreso → BLOQUEO

3. **AHORRO con subcategoría correcta**
   - CATEGORÍA="AHORRO" solo permite: Ahorro Clara, Ahorro Marco, Fondo de Emergencia

4. **VARIABLES con subcategoría correcta**
   - CATEGORÍA="VARIABLES" solo permite items de VARIABLES_FAMILIA o VARIABLES_NT

5. **Balance cruzado préstamos/devoluciones**
   - No puedes prestar a quien ya te debe (primero devolver)

**Nuevas funciones en Code.gs v6.8**:
- `validarContradiccionTipoSubcategoriaFamilia()` - Detecta contradicciones en CARGA_FAMILIA
- `validarContradiccionTipoSubcategoriaNT()` - Detecta contradicciones en CARGA_NT
- `calcularDeudaFamiliaANT()` / `calcularDeudaNTAFamilia()` - Calculan deudas cruzadas
- `validarPrestamoDevolucionFamilia()` / `validarPrestamoDevolucionNT()` - Bloquean según balance

**Archivos afectados**: gs/Code.gs, CLAUDE.md, DECISIONES.md, PLAN_MAESTRO
**Razón**: El usuario identificó incoherencias como TIPO="Devolución NeuroTEA" con SUBCAT="Devolución Familia → NT" que son operaciones OPUESTAS y no deben coexistir.

---

### [2026-01-15c] - AHORRO separado de GASTOS OPERATIVOS (v6.9)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
AHORRO conceptualmente NO es un gasto, es una transferencia a cuenta de ahorro. Por lo tanto:

1. **AHORRO ahora es un TIPO separado** (no "Egreso Familiar"):
   - TIPO: "Ahorro"
   - CATEGORÍA: "Ahorro Clara" / "Ahorro Marco" / "Fondo de Emergencia"
   - SUBCATEGORÍA: "-" (bloqueada automáticamente)

2. **Ecuación contable correcta**:
   ```
   INGRESOS = GASTOS OPERATIVOS + AHORRO + FONDO EMERGENCIA + DISPONIBLE
   ```

3. **Visualización en TABLERO**:
   - GASTOS OPERATIVOS: Solo suma TIPO="Egreso" con EST.PAGO="Pagado"
   - AHORRO: Suma TIPO="Ahorro" con CATEGORÍA in ("Ahorro Clara", "Ahorro Marco")
   - FONDO EMERGENCIA: Suma TIPO="Ahorro" con CATEGORÍA="Fondo de Emergencia"

4. **Cambios técnicos**:
   - Config.gs: Agregado TIPO_AHORRO y CATEGORIAS_AHORRO_FAMILIA
   - Code.gs: Anti-Burro para TIPO="Ahorro" bloquea SUBCATEGORÍA
   - Sheets.gs: CARGA_FAMILIA incluye "Ahorro" en dropdown TIPO
   - Sheets.gs: MOVIMIENTO columna B muestra "Ahorro" para items de ahorro
   - Tablero.gs: Fórmulas separadas para AHORRO y FONDO EMERGENCIA

**Archivos afectados**: gs/Config.gs, gs/Code.gs, gs/Sheets.gs, gs/Tablero.gs, CLAUDE.md
**Razón**: El usuario identificó que AHORRO estaba sumándose en GASTOS OPERATIVOS, lo cual es conceptualmente incorrecto. AHORRO es una asignación del dinero, no un gasto.

---

### [2026-01-19] - Saldos por cuenta y DISPONIBLE coherente (v7.5)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Reestructuración del sistema de saldos para garantizar coherencia total:

1. **Saldos iniciales por cuenta (v7.4)**:
   - CONFIG tiene tabla "SALDOS INICIALES POR CUENTA" (FAMILIA: filas 65-74, NT: filas 79-80)
   - Cada cuenta tiene su saldo inicial editable por mes
   - Esta es la ÚNICA fuente de verdad para saldos iniciales

2. **Saldos globales ahora son FÓRMULAS (v7.5)**:
   - CONFIG "SALDOS INICIALES POR MES" ya NO es editable
   - FAMILIA = SUM(saldos de las 10 cuentas FAMILIA)
   - NEUROTEA = SUM(saldos de las 2 cuentas NT)

3. **DISPONIBLE = SUM(Esperado) (v7.5)**:
   - DISPONIBLE ya no calcula independientemente
   - DISPONIBLE = suma de todos los "Esperado" por cuenta
   - Garantiza coherencia: suma de cuentas = total disponible

4. **FIX: AHORRO ahora RESTA en Esperado (v7.5)**:
   - Bug anterior: AHORRO sumaba (TIPO<>"Egreso Familiar" incluía Ahorro)
   - Corrección: AHORRO resta explícitamente en fórmula Esperado
   - Fórmula: `+ Ingresos - Egresos - AHORRO - Gastos fijos pagados`

5. **Renombrado: "Caja Chica NT" → "UENO Marco" (v7.4)**:
   - La cuenta de efectivo de NT ahora se llama "UENO Marco"
   - Refleja mejor el uso real (cuenta compartida para gastos NT)

**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, gs/Config.gs, CLAUDE.md
**Razón**: El usuario identificó que los saldos globales y por cuenta podían ser inconsistentes si se editaban por separado. También detectó que AHORRO inflaba incorrectamente los saldos de cuenta.

---

### [2026-01-19] - METAS NEUROTEA configurables desde CONFIG (v7.6)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Las metas de NEUROTEA (% ganancia, % máximo gastos, distribución de utilidades) deben ser editables desde CONFIG, no hardcodeadas en fórmulas.

**Cambios implementados**:
1. **CONFIG tiene nueva sección "🎯 METAS NEUROTEA (Editables)"** (filas 38-45):
   - B40: Meta Ganancia Mínima (%) = 7
   - B41: Meta Máximo Gastos (%) = 93
   - B42: Distribución Utilidad Dueño (%) = 33.33
   - B43: Distribución Fondo Emergencia (%) = 33.33
   - B44: Distribución Fondo Inversión (%) = 33.34

2. **Fórmulas usan referencias en lugar de valores hardcodeados**:
   - PRESUPUESTO: `CONFIG!$B$40/100` en lugar de `0,07`
   - MOVIMIENTO: Semáforo lee de CONFIG
   - TABLERO: Indicadores NT leen de CONFIG
   - WebApp.gs: Lee valores de CONFIG y los usa en HTML

3. **Textos dinámicos**:
   - "META 7%" ahora muestra `"META "&CONFIG!$B$40&"%"`
   - "93% máximo" ahora muestra valor de CONFIG!$B$41
   - Distribución muestra % leídos de CONFIG

**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, gs/WebApp.gs, CLAUDE.md
**Razón**: El usuario solicitó que las metas sean configurables para poder ajustarlas sin modificar código. Esto sigue el principio de separar datos de lógica.

---

### [2026-01-20] - EVENTOS movido de CARGA a GASTOS_FIJOS (v7.7)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
EVENTOS son gastos PLANIFICADOS (Variable/Anual), no gastos variables puros. Por lo tanto, deben registrarse en GASTOS_FIJOS.

**Cambios implementados**:

1. **EVENTOS ahora está en GASTOS_FIJOS**:
   - Nueva constante EVENTOS_GASTOS_NT con estructura completa (concepto, categoria, frecuencia, dia, cuenta, monto)
   - Columnas G-R = meses ENE-DIC (igual que otros gastos fijos)
   - El usuario ingresa el monto del evento en el mes correspondiente

2. **Dropdowns de CARGA limpios**:
   - CARGA_FAMILIA CATEGORÍA: Solo `['-', 'VARIABLES', opciones_ahorro]`
   - Se eliminaron: GASTOS FIJOS, CUOTAS Y PRÉSTAMOS, OBLIGACIONES LEGALES, SUSCRIPCIONES
   - CARGA_NT CATEGORÍA: Solo `['-', 'VARIABLES']`
   - Se eliminaron: CLÍNICA, SUELDOS Y HONORARIOS, TELEFONÍA E INTERNET, OBLIGACIONES LEGALES, EVENTOS

3. **MOVIMIENTO lee EVENTOS de GASTOS_FIJOS**:
   - Fórmula REAL: `INDEX(GASTOS_FIJOS!$G:$R;MATCH(concepto;GASTOS_FIJOS!$A:$A;0);$N$3)`
   - EST.PAGO: Dropdown (Pendiente/Pagado/Cancelado) en lugar de fijo "Pagado"
   - Se incluyen TODOS los eventos (6 definidos + 12 reservas = 18 total)

4. **Reservas ampliadas**:
   - Antes: 6 definidos + 10 reservas = 16 total
   - Ahora: 6 definidos + 12 reservas = 18 total
   - Renombradas de "Reserva X" a "Reserva Evento X"

5. **Nuevas subcategorías VARIABLES FAMILIA**:
   - Agregadas: "Alimentación" y "Gastos Varios"
   - Total: 13 items (antes 11)

**Archivos afectados**: gs/Config.gs, gs/Sheets.gs, CLAUDE.md
**Razón**: El usuario identificó que EVENTOS no son variables puros (impredecibles) sino gastos planificados con fecha conocida. Además, los dropdowns de CARGA mostraban categorías que solo se usan en GASTOS_FIJOS, causando confusión.

---

### [2026-01-20] - FIX CRÍTICO: Esperado por cuenta ahora resta gastos fijos (v7.8)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Corregido bug crítico donde las fórmulas "Esperado" por cuenta en TABLERO no restaban los gastos fijos pagados correctamente.

**Problema identificado**:
1. **FAMILIA**: La fórmula usaba `INDEX/MATCH` dentro de `SUMPRODUCT` para buscar EST.PAGO y REAL en MOVIMIENTO basándose en el CONCEPTO. Pero `INDEX/MATCH` con un array como argumento de búsqueda NO funciona correctamente - solo retorna el primer match, no procesa cada elemento del array.
2. **NEUROTEA**: La fórmula ni siquiera intentaba restar gastos fijos - solo leía de CARGA_NT.
3. **Impacto**: Los saldos "Esperado" estaban inflados (~44M en FAMILIA, ~27M en NEUROTEA).

**Solución implementada**:
1. **Nueva columna N (CUENTA) en MOVIMIENTO**:
   - Para items que vienen de GASTOS_FIJOS: `=INDEX(GASTOS_FIJOS!$F:$F;MATCH(concepto;GASTOS_FIJOS!$A:$A;0))`
   - Para items de CARGA (Variables, Ahorro, Ingresos): vacío (ya tienen CUENTA en CARGA)
   - Columna oculta junto con L y M

2. **Fórmulas "Esperado" corregidas**:
   - La parte de gastos fijos ahora usa: `-SUMPRODUCT((MOVIMIENTO!$N$rango="${cuenta}")*(MOVIMIENTO!$J$rango="Pagado")*(MOVIMIENTO!$F$rango))`
   - Esta fórmula funciona correctamente porque usa igualdad simple en arrays, no INDEX/MATCH

3. **Rangos utilizados**:
   - FAMILIA: N9:N113
   - NEUROTEA: N119:N200

**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs, CLAUDE.md
**Razón**: El usuario identificó que los valores calculados en TABLERO eran incoherentes con los datos ingresados. El análisis reveló que los gastos fijos no se restaban del saldo esperado por cuenta.

---

### [2026-01-21] - Sistema LINK_ID para transacciones cruzadas (v7.12)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Las transacciones cruzadas (préstamos/devoluciones NT↔FAM) ahora están vinculadas con un ID único.

**Implementación**:
1. **Nueva columna I (LINK_ID)** en CARGA_FAMILIA y CARGA_NT
2. **Formato**: 6 caracteres alfanuméricos (ej: A7K2M1)
3. **Ambas transacciones del par tienen el mismo LINK_ID**
4. **Auto-borrado sincronizado**: Al borrar una transacción (vaciar MONTO), se borra la contraparte automáticamente
5. **Actualización sincronizada**: Al editar MONTO, se actualiza en ambas hojas

**Archivos afectados**: gs/Code.gs, gs/Sheets.gs, CLAUDE.md
**Razón**: Antes no había vínculo explícito entre contrapartes, dificultando la sincronización y el borrado.

---

### [2026-01-24] - Trigger onChange para contrapartes huérfanas (v7.21)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Si el usuario elimina una fila con clic derecho → "Eliminar fila", `onEdit` NO se dispara (limitación de Apps Script). Se implementó auto-limpieza via trigger `onChange`.

**Implementación**:
1. **`onChangeHandler(e)`**: trigger instalable que detecta `REMOVE_ROW`
2. **`limpiarContrapartesHuerfanas()`**: escanea LINK_IDs sin par y elimina filas huérfanas
3. **Menú**: Utilidades → "Instalar Auto-limpieza" (una sola vez)

**Archivos afectados**: gs/Code.gs
**Razón**: Contrapartes huérfanas corrompían los cálculos de balance cruzado.

---

### [2026-01-26] - Columna VÁLIDO para detectar errores silenciosos (v7.26)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Las fórmulas SUMPRODUCT excluyen silenciosamente filas con datos inválidos. Nueva columna J (VÁLIDO) muestra qué filas serán contadas.

**Indicadores**:
- "✓" = Fila válida
- "⚠ Fecha" = Fecha inválida (texto/malformada)
- "⚠ Año" = Año diferente a 2026
- "⚠ Monto" = Monto vacío o texto
- "⚠ Tipo" = TIPO vacío
- "⚠ Cat" = Egreso con CATEGORÍA="-"
- "⚠ Subcat" = Egreso VARIABLES con SUBCATEGORÍA inválida

**Archivos afectados**: gs/Sheets.gs, gs/Code.gs
**Razón**: El usuario no podía saber cuáles filas NO estaban siendo contadas en TABLERO.

---

### [2026-01-27] - Dashboard v3.0 con Chart.js (v7.30)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Reescritura completa del dashboard HTML con Chart.js en lugar de Google Charts.

**Características**:
1. **2 pestañas**: FAMILIA y NEUROTEA (antes 3)
2. **18 gráficos Chart.js interactivos** con tooltips
3. **Flujo entre entidades**: diagrama SVG + tabla + gráfico mensual
4. **KPI cards mejorados**: grid responsive con indicadores de color
5. **Guías de interpretación**: cada gráfico tiene descripción

**Archivos afectados**: gs/WebApp.gs
**Razón**: Google Charts era limitado y pesado. Chart.js es más flexible y ligero.

---

### [2026-01-28] - TRIM en todas las fórmulas SUMPRODUCT (v7.35)
**Estado**: ✅ APROBADO - NO REVERTIR
**Descripción**:
Las fórmulas SUMPRODUCT hacían comparación EXACTA de strings. Si había espacios invisibles, la comparación fallaba silenciosamente.

**Solución**:
- Agregar `TRIM()` a todas las comparaciones de strings
- Patrón: `(TRIM(CARGA!D4:D500)=TRIM(A102))` en lugar de `(CARGA!D4:D500=A102)`

**Fórmulas corregidas**:
- Sheets.gs: INGRESOS, VARIABLES, AHORRO
- Tablero.gs: Esperado FAM/NT, Ahorro, Fondo, Balance cruzado

**Archivos afectados**: gs/Sheets.gs, gs/Tablero.gs
**Razón**: MOVIMIENTO mostraba REAL=0 aunque CARGA tenía datos válidos y VÁLIDO mostraba "✓". El problema era diferencia de espacios en strings.

---

*Última actualización: 2026-01-28 - Agregadas decisiones v7.12, v7.21, v7.26, v7.30, v7.35*
