# CLAUDE.md - Guía Técnica para Desarrollo
## FinanzasApp v1.0

> **IMPORTANTE**: Este documento es la FUENTE DE VERDAD técnica del proyecto.
> Debe actualizarse con CADA cambio significativo.

---

## 1. DESCRIPCIÓN DEL PROYECTO

**FinanzasApp** es una aplicación web SPA (Single Page Application) para control financiero personal y empresarial, construida con Google Apps Script.

### 1.1 Características Principales
- Dos espacios de trabajo independientes: FAMILIA y NEUROTEA
- Interface 100% web (no se usa Google Sheets como interface)
- Google Sheets solo como base de datos (sin fórmulas complejas)
- Dashboard con gráficos Chart.js
- Sistema de préstamos/devoluciones bidireccional entre entidades

### 1.2 Stack Tecnológico
| Componente | Tecnología |
|------------|------------|
| Frontend | HTML5 + CSS3 + JavaScript ES6 |
| Gráficos | Chart.js v4 (CDN) |
| Backend | Google Apps Script |
| Database | Google Sheets |
| Hosting | GAS Web App |

---

## 2. ESTRUCTURA DE ARCHIVOS

```
/App-FInanzas-2/
├── src/
│   ├── Code.gs                    # Entry point, doGet(), includeFile()
│   ├── Config.gs                  # Constantes globales, colores, entidades
│   ├── Database.gs                # Helpers para lectura/escritura en Sheets
│   │
│   ├── services/
│   │   ├── ConfigService.gs       # CRUD configuración
│   │   ├── TransaccionesService.gs # CRUD transacciones
│   │   ├── GastosFijosService.gs  # CRUD gastos fijos
│   │   ├── PresupuestoService.gs  # CRUD presupuesto
│   │   ├── ReportesService.gs     # Cálculos para dashboards
│   │   └── ImportExportService.gs # JSON/CSV import/export
│   │
│   └── utils/
│       ├── Formatters.gs          # Formato números, fechas
│       ├── Validators.gs          # Validaciones de datos
│       └── UUID.gs                # Generador de IDs únicos
│
├── views/
│   ├── Index.html                 # SPA principal
│   ├── styles.html                # CSS embebido
│   ├── app.html                   # JavaScript principal
│   │
│   └── components/
│       ├── Login.html             # Pantalla selección entidad
│       ├── Dashboard.html         # Vista dashboard
│       ├── Transacciones.html     # Vista transacciones
│       ├── GastosFijos.html       # Vista gastos fijos
│       ├── Presupuesto.html       # Vista presupuesto
│       └── Configuracion.html     # Vista configuración
│
├── PRD.md                         # Product Requirements Document
├── CLAUDE.md                      # Este archivo
├── CHANGELOG.md                   # Historial de cambios
└── PLAN_NUEVA_APP.md              # Plan original del proyecto
```

---

## 3. BASE DE DATOS (Google Sheets)

### 3.1 Hojas

| Hoja | Propósito | Editable por App |
|------|-----------|------------------|
| CONFIG | Configuración del sistema | Sí |
| TRANSACCIONES | Todos los movimientos | Sí |
| GASTOS_FIJOS | Gastos recurrentes | Sí |
| PRESUPUESTO | Plan anual | Sí |

### 3.2 Estructura: CONFIG

| Columna | Campo | Tipo |
|---------|-------|------|
| A | key | string |
| B | value | string/json |
| C | type | string |
| D | entity | string |

**Claves importantes:**
```
CUENTAS_FAMILIA          → JSON array de cuentas
CUENTAS_NEUROTEA         → JSON array de cuentas
CATEGORIAS_FAMILIA       → JSON array
CATEGORIAS_NEUROTEA      → JSON array
SUBCATEGORIAS_FAMILIA    → JSON array
SUBCATEGORIAS_NEUROTEA   → JSON array
TIPOS_INGRESO_FAMILIA    → JSON array
TIPOS_INGRESO_NEUROTEA   → JSON array
META_GANANCIA_NT         → number (7)
META_MAX_GASTOS_NT       → number (93)
DISTRIBUCION_UTILIDAD    → number (33.33)
SALDO_INICIAL_FAMILIA    → JSON {cuenta: monto}
SALDO_INICIAL_NEUROTEA   → JSON {cuenta: monto}
```

### 3.3 Estructura: TRANSACCIONES

| Col | Campo | Tipo | Requerido |
|-----|-------|------|-----------|
| A | id | string | Sí |
| B | fecha | date | Sí |
| C | entidad | string | Sí |
| D | tipo | string | Sí |
| E | concepto | string | Sí |
| F | categoria | string | No |
| G | subcategoria | string | No |
| H | monto | number | Sí |
| I | cuenta | string | Sí |
| J | estado | string | Sí |
| K | notas | string | No |
| L | link_id | string | No |
| M | created_at | datetime | Sí |
| N | updated_at | datetime | Sí |

**Valores válidos:**
- `entidad`: FAMILIA, NEUROTEA
- `tipo`: INGRESO, EGRESO, AHORRO, TRANSFERENCIA
- `estado`: PAGADO, PENDIENTE, CANCELADO

### 3.4 Estructura: GASTOS_FIJOS

| Col | Campo | Tipo |
|-----|-------|------|
| A | id | string |
| B | entidad | string |
| C | concepto | string |
| D | categoria | string |
| E | frecuencia | string |
| F | dia_vencimiento | number |
| G | cuenta | string |
| H-S | monto_ene...monto_dic | number |
| T | activo | boolean |

### 3.5 Estructura: PRESUPUESTO

| Col | Campo | Tipo |
|-----|-------|------|
| A | id | string |
| B | entidad | string |
| C | concepto | string |
| D | tipo | string |
| E | categoria | string |
| F | frecuencia | string |
| G-R | pres_ene...pres_dic | number |

---

## 4. SERVICIOS (Backend)

### 4.1 ConfigService.gs

```javascript
// Obtener configuración
function getConfig(key, entity = 'GLOBAL')

// Guardar configuración
function setConfig(key, value, type, entity)

// Obtener todas las cuentas de una entidad
function getCuentas(entidad)

// Obtener categorías de una entidad
function getCategorias(entidad)

// Obtener subcategorías de una entidad
function getSubcategorias(entidad)
```

### 4.2 TransaccionesService.gs

```javascript
// Listar transacciones con filtros
function getTransacciones(entidad, filtros = {})
// filtros: { mes, anio, categoria, cuenta, estado, busqueda }

// Crear transacción (y contraparte si es cruzada)
function crearTransaccion(data)

// Actualizar transacción
function actualizarTransaccion(id, data)

// Eliminar transacción (y contraparte si tiene link_id)
function eliminarTransaccion(id)

// Obtener transacción por ID
function getTransaccionById(id)
```

### 4.3 GastosFijosService.gs

```javascript
// Listar gastos fijos
function getGastosFijos(entidad)

// Crear gasto fijo
function crearGastoFijo(data)

// Actualizar gasto fijo
function actualizarGastoFijo(id, data)

// Eliminar gasto fijo
function eliminarGastoFijo(id)

// Obtener vencimientos del mes
function getVencimientos(entidad, mes)
```

### 4.4 ReportesService.gs

```javascript
// Datos para dashboard
function getDashboardData(entidad, mes, anio)

// Balance del mes
function getBalanceMes(entidad, mes, anio)

// Gastos por categoría
function getGastosPorCategoria(entidad, mes, anio)

// Presupuesto vs Real
function getPresupuestoVsReal(entidad, mes, anio)

// Balance cruzado NT↔FAM
function getBalanceCruzado()

// Saldos por cuenta
function getSaldosPorCuenta(entidad, mes, anio)
```

---

## 5. FRONTEND (SPA)

### 5.1 Estructura del HTML Principal

```html
<!-- Index.html -->
<!DOCTYPE html>
<html>
<head>
  <?!= include('styles'); ?>
</head>
<body>
  <div id="app">
    <!-- Login (selección entidad) -->
    <div id="login-view"></div>

    <!-- App principal -->
    <div id="main-view" style="display:none">
      <header id="header"></header>
      <aside id="sidebar"></aside>
      <main id="content"></main>
    </div>
  </div>

  <?!= include('app'); ?>
</body>
</html>
```

### 5.2 Navegación SPA

```javascript
// Router simple
const routes = {
  'dashboard': renderDashboard,
  'transacciones': renderTransacciones,
  'gastos-fijos': renderGastosFijos,
  'presupuesto': renderPresupuesto,
  'configuracion': renderConfiguracion
};

function navigate(route) {
  const content = document.getElementById('content');
  routes[route](content);
  updateActiveMenu(route);
}
```

### 5.3 Comunicación con Backend

```javascript
// Wrapper para google.script.run
function callBackend(functionName, ...args) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [functionName](...args);
  });
}

// Uso
async function loadDashboard() {
  const data = await callBackend('getDashboardData', currentEntity, currentMonth, currentYear);
  renderDashboardCharts(data);
}
```

---

## 6. VALIDACIONES EN CASCADA

### 6.1 Reglas de Validación

```
SI tipo = INGRESO:
  → categoria = "-" (deshabilitada)
  → subcategoria = "-" (deshabilitada)

SI tipo = EGRESO:
  → categoria = dropdown con opciones de la entidad
  → SI categoria ≠ VARIABLES:
      → subcategoria = "-" (deshabilitada)
  → SI categoria = VARIABLES:
      → subcategoria = dropdown con opciones

SI tipo = AHORRO (solo FAMILIA):
  → categoria = dropdown [Ahorro Clara, Ahorro Marco, Fondo Emergencia]
  → subcategoria = "-" (deshabilitada)
```

### 6.2 Implementación Frontend

```javascript
function onTipoChange(tipo) {
  const categoriaSelect = document.getElementById('categoria');
  const subcategoriaSelect = document.getElementById('subcategoria');

  if (tipo === 'INGRESO') {
    categoriaSelect.disabled = true;
    categoriaSelect.value = '-';
    subcategoriaSelect.disabled = true;
    subcategoriaSelect.value = '-';
  } else if (tipo === 'EGRESO') {
    categoriaSelect.disabled = false;
    loadCategorias(currentEntity);
  }
  // ... etc
}
```

---

## 7. TRANSACCIONES CRUZADAS

### 7.1 Detección Automática

Una transacción es cruzada si:
- FAMILIA registra ingreso "Préstamo de NeuroTEA"
- FAMILIA registra egreso "Devolución Familia → NT"
- NEUROTEA registra egreso "Préstamo NT → Familia"
- NEUROTEA registra ingreso "Devolución de Familia"

### 7.2 Creación de Contraparte

```javascript
function crearTransaccion(data) {
  const id = generateUUID();
  data.id = id;
  data.created_at = new Date();
  data.updated_at = new Date();

  // Verificar si es transacción cruzada
  if (esTransaccionCruzada(data)) {
    const linkId = generateUUID();
    data.link_id = linkId;

    // Crear contraparte
    const contraparte = crearContraparte(data, linkId);
    insertarTransaccion(contraparte);
  }

  insertarTransaccion(data);
  return id;
}
```

### 7.3 Mapeo de Contrapartes

| Original (FAMILIA) | Contraparte (NEUROTEA) |
|--------------------|------------------------|
| INGRESO: Préstamo de NeuroTEA | EGRESO: Préstamo NT → Familia |
| EGRESO: Devolución Familia → NT | INGRESO: Devolución de Familia |

| Original (NEUROTEA) | Contraparte (FAMILIA) |
|---------------------|------------------------|
| EGRESO: Préstamo NT → Familia | INGRESO: Préstamo de NeuroTEA |
| INGRESO: Devolución de Familia | EGRESO: Devolución Familia → NT |

---

## 8. FORMATO DE NÚMEROS

### 8.1 Locale Paraguay

```javascript
// Formato: 1.234.567 (punto como separador de miles)
function formatMoney(value) {
  return new Intl.NumberFormat('es-PY', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

// Resultado: "Gs. 1.234.567"
function formatCurrency(value) {
  return 'Gs. ' + formatMoney(value);
}
```

### 8.2 Parsing de Entrada

```javascript
// Convertir "1.234.567" a 1234567
function parseMoney(str) {
  return parseInt(str.replace(/\./g, ''), 10) || 0;
}
```

---

## 9. COLORES Y ESTILOS

### 9.1 Variables CSS

```css
:root {
  /* Principales */
  --primary: #1f2937;
  --positive: #047857;
  --negative: #dc2626;
  --balance: #b45309;

  /* Secundarios */
  --navy: #1e3a5f;
  --teal: #0d9488;
  --amber: #d97706;
  --indigo: #4338ca;
  --rose: #be123c;
  --emerald: #059669;
  --sky: #0369a1;
  --violet: #7c3aed;
  --orange: #c2410c;
  --cyan: #0891b2;

  /* Fondos */
  --bg-primary: #f9fafb;
  --bg-card: #ffffff;
  --bg-sidebar: #1f2937;
  --border: #e5e7eb;
}
```

### 9.2 Paletas para Gráficos

```javascript
const COLORS = {
  DONUT1: ['#1e3a5f', '#be123c', '#d97706', '#4338ca', '#0d9488', '#7c3aed'],
  DONUT2: ['#047857', '#b45309', '#0369a1', '#7c3aed', '#c2410c', '#0891b2', '#059669', '#4338ca', '#0d9488', '#1e3a5f']
};
```

---

## 10. CHECKLIST PRE-CAMBIOS

Antes de modificar cualquier archivo:

- [ ] Leí este documento completo
- [ ] Entiendo la estructura de las 4 hojas de datos
- [ ] Sé qué Service debo modificar
- [ ] Verifico que no rompo transacciones cruzadas
- [ ] Mantengo el formato de números paraguayo
- [ ] Actualizo CHANGELOG.md
- [ ] Actualizo este CLAUDE.md si es necesario

---

## 11. ERRORES COMUNES

| Error | Causa | Solución |
|-------|-------|----------|
| Números con coma | Formato incorrecto | Usar formatMoney() siempre |
| Contraparte no creada | No se detectó como cruzada | Verificar concepto exacto |
| Datos no guardan | Sheet name incorrecto | Verificar nombre exacto de hoja |
| Charts no renderizan | Chart.js no cargado | Verificar CDN en <head> |

---

## 12. COMANDOS GIT

```bash
# Ver estado
git status

# Agregar cambios
git add <archivo>

# Commit
git commit -m "descripción del cambio"

# Push
git push -u origin claude/gas-accounting-app-r56JF
```

---

*Última actualización: 2026-01-31*
*Versión del documento: 1.0*
