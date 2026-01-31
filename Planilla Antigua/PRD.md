# PRD - Product Requirements Document
## Sistema de Control Financiero 2026

> **Versión**: 8.3
> **Última actualización**: 2026-01-31
> **Autor**: Marco (esqmarco)

---

## 1. Visión del Producto

### 1.1 Propósito
Sistema integral de control financiero desarrollado en Google Sheets + Apps Script para gestionar las finanzas de:
- **FAMILIA**: Finanzas del hogar (Marco y Clara)
- **NEUROTEA**: Clínica de terapia para autismo

### 1.2 Objetivos
1. Control mensual de ingresos vs egresos
2. Seguimiento de presupuesto vs ejecución real
3. Gestión de liquidez y vencimientos
4. Balance cruzado de préstamos entre entidades
5. Dashboard visual con gráficos interactivos
6. Automatización de cálculos y validaciones

---

## 2. Arquitectura del Sistema

### 2.1 Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE SPREADSHEET                        │
├─────────────────────────────────────────────────────────────┤
│  HOJAS DE ENTRADA (editables por usuario)                   │
│  ├── CONFIG        → Listas maestras, metas, saldos        │
│  ├── PRESUPUESTO   → Plan anual por concepto               │
│  ├── GASTOS_FIJOS  → Gastos recurrentes mensuales          │
│  ├── CARGA_FAMILIA → Transacciones variables FAM           │
│  └── CARGA_NT      → Transacciones variables NT            │
├─────────────────────────────────────────────────────────────┤
│  HOJAS DE CÁLCULO (automáticas)                             │
│  ├── CALCULOS      → Cálculos intermedios centralizados    │
│  ├── MOVIMIENTO    → Real vs Presupuesto mensual           │
│  ├── TABLERO       → KPIs y saldos por cuenta              │
│  └── LIQUIDEZ      → Vencimientos por semana               │
├─────────────────────────────────────────────────────────────┤
│  APPS SCRIPT (gs/)                                          │
│  ├── Code.gs       → Menú, triggers, auto-creación         │
│  ├── Config.gs     → Datos maestros (arrays)               │
│  ├── Sheets.gs     → Creación de hojas con fórmulas        │
│  ├── Calculos.gs   → Hoja CALCULOS (v8.0)                  │
│  ├── Tablero.gs    → Dashboard en Sheets                   │
│  ├── WebApp.gs     → Dashboard HTML/Chart.js               │
│  └── Utils.gs      → Funciones utilitarias                 │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

```
CONFIG (listas maestras)
    │
    ├──► CARGA_FAMILIA ──────┐
    ├──► CARGA_NT ───────────┼──► CALCULOS ──► TABLERO ──► WebApp
    ├──► GASTOS_FIJOS ───────┤        │
    │                        │        ▼
    └──► PRESUPUESTO ────────┴──► MOVIMIENTO
                                     │
                                     ▼
                                 LIQUIDEZ
```

---

## 3. Especificaciones Funcionales

### 3.1 Hoja CALCULOS (v8.0+)

**Propósito**: Centralizar todos los cálculos complejos para que TABLERO y WebApp solo lean celdas.

| Sección | Filas | Contenido |
|---------|-------|-----------|
| 1. TOTALES | 3-25 | Ingresos, Egresos, Ahorro por entidad (12 meses) |
| 2. SALDOS | 30-50 | Esperado por cuenta (12 meses) |
| 3. CATEGORÍAS | 55-75 | Gastos por categoría (12 meses) |
| 4. BALANCE CRUZADO | 80-95 | Préstamos NT↔FAM (12 meses) |
| 5. SUBCATEGORÍAS | 100-140 | Variables detalladas (12 meses) |
| 6. LIQUIDEZ | 145-160 | Gastos por semana |
| 7. EST.PAGO | 165+ | Estados de pago por mes |

### 3.2 Dashboard Web (v8.3)

**Principio**: El Dashboard SOLO LEE celdas, NO recalcula nada.

```javascript
// CORRECTO: Leer de CALCULOS
var dataCategorias = calculos.getRange(58, 1, 5, 14).getValues();

// INCORRECTO: Recalcular desde CARGA
for (var i = 0; i < dataCarga.length; i++) { ... } // NO HACER
```

**Gráficos por Tab**:
- FAMILIA: 8 gráficos (Balance, Ahorro, Categorías, Subcategorías, etc.)
- NEUROTEA: 8 gráficos (Estado Resultados, Ganancia, etc.)
- Flujo NT↔FAM: Común en ambos tabs

---

## 4. Reglas de Negocio

### 4.1 EST.PAGO (Estado de Pago)

| Origen | EST.PAGO | Editable | Efecto |
|--------|----------|----------|--------|
| INGRESOS (CARGA) | "Recibido" | No | Suma a INGRESOS |
| VARIABLES (CARGA) | "Pagado" | No | Suma a EGRESOS PAGADOS |
| AHORRO (CARGA) | "Ahorrado" | No | Suma a AHORRO |
| GASTOS_FIJOS | Dropdown | Sí | Pendiente/Pagado/Cancelado |

### 4.2 Fórmulas - Reglas Críticas

1. **NUNCA** usar SUMIFS con MONTH()/YEAR() → usar SUMPRODUCT
2. **SIEMPRE** usar `IFERROR(MONTH(rango);0)` dentro de SUMPRODUCT
3. **SIEMPRE** usar `TRIM()` al comparar strings
4. Separador de argumentos: `;` (punto y coma, locale español)
5. Separador decimal: `,` (coma)

### 4.3 Rangos de Filas en MOVIMIENTO

| Entidad | Rango |
|---------|-------|
| FAMILIA | 9-116 |
| NEUROTEA | 122-206 |

---

## 5. Integraciones

### 5.1 Auto-creación de Transacciones Cruzadas

Al registrar préstamos/devoluciones en una hoja CARGA, el sistema auto-crea la contraparte en la otra hoja.

**Desde CARGA_FAMILIA**:
| Registro | Auto-crea en CARGA_NT |
|----------|----------------------|
| Egreso → "Préstamo Familia → NT" | Ingreso → "Préstamo Familia" |
| Egreso → "Devolución Familia → NT" | Ingreso → "Devolución Familia → NT" |

**Desde CARGA_NT**:
| Registro | Auto-crea en CARGA_FAMILIA |
|----------|---------------------------|
| Egreso → "Préstamo NT → Familia" | Ingreso → "Préstamo NeuroTEA" |
| Egreso → "Devolución NT → Familia" | Ingreso → "Devolución NeuroTEA" |

### 5.2 Sincronización con LINK_ID

- Cada par de transacciones comparte un LINK_ID de 6 caracteres
- Al editar monto → se actualiza la contraparte
- Al borrar → se borra la contraparte automáticamente

---

## 6. Métricas y KPIs

### 6.1 FAMILIA
- Ingresos del mes
- Egresos pagados
- Ahorro (Clara + Marco)
- Fondo de Emergencia
- Disponible
- Patrimonio

### 6.2 NEUROTEA
- Ingresos del mes
- Egresos pagados
- Ganancia Real
- % Ganancia vs Meta (7%)
- Distribución: Utilidad, Fondo Emergencia, Inversión

---

## 7. Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Spreadsheet | Google Sheets |
| Backend | Google Apps Script |
| Dashboard Web | HTML + Chart.js (ES5) |
| Versionamiento | Git + GitHub |
| Moneda | Guaraníes (Gs.) - Paraguay |
| Locale | es-PY |

---

## 8. Documentación Relacionada

| Documento | Propósito |
|-----------|-----------|
| `CLAUDE.md` | Fuente de verdad técnica para Claude |
| `PLAN_MAESTRO_*.md` | Detalles de negocio completos |
| `DECISIONES.md` | Decisiones de diseño (NO revertir) |
| `CHANGELOG.md` | Historial de cambios por versión |
| `.claude/rules/` | Reglas de comportamiento para Claude |
| `.claude/commands/` | Comandos slash disponibles |

---

## 9. Historial de Versiones Clave

| Versión | Fecha | Cambio Principal |
|---------|-------|------------------|
| 7.0 | 2026-01-19 | Auto-creación transacciones cruzadas |
| 7.12 | 2026-01-21 | Sistema LINK_ID + auto-borrado |
| 8.0 | 2026-01-28 | Hoja CALCULOS centralizada |
| 8.3 | 2026-01-31 | Dashboard lee de CALCULOS sin recálculos |

---

*Última actualización: 2026-01-31*
