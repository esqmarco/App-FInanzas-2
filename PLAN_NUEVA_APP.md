# PLAN: Nueva App de Control Financiero
## FinanzasApp - Google Apps Script + Google Sheets

> **Versión**: 1.0
> **Fecha**: 2026-01-31
> **Autor**: Marco (esqmarco)

---

## RESUMEN EJECUTIVO

Propongo crear una **aplicación web moderna** completamente nueva usando Google Apps Script, con las siguientes características diferenciadoras:

1. **Single Page Application (SPA)** con navegación fluida
2. **Dos espacios de trabajo independientes**: FAMILIA y NEUROTEA
3. **Base de datos en Google Sheets** (minimalista, solo datos)
4. **Interface 100% web** (HTML/CSS/JS moderno)
5. **Sistema de importación/exportación** (JSON/CSV)
6. **Dashboard en tiempo real** con Chart.js
7. **Diseño responsive** que funciona en móvil y desktop

---

## 1. ARQUITECTURA DEL SISTEMA

### 1.1 Filosofía de Diseño

```
┌─────────────────────────────────────────────────────────────────────┐
│                      NUEVA ARQUITECTURA                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   FRONTEND (100% Web)                                               │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  SPA HTML5 + CSS3 + JavaScript ES6                         │   │
│   │  ├── Pantalla Login (selección entidad)                    │   │
│   │  ├── Dashboard Principal                                    │   │
│   │  ├── Módulo Transacciones                                  │   │
│   │  ├── Módulo Presupuesto                                    │   │
│   │  ├── Módulo Gastos Fijos                                   │   │
│   │  ├── Módulo Reportes                                       │   │
│   │  └── Módulo Configuración                                  │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                            │                                         │
│                            ▼                                         │
│   BACKEND (Google Apps Script)                                      │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  API REST-like con google.script.run                       │   │
│   │  ├── TransaccionesService                                  │   │
│   │  ├── PresupuestoService                                    │   │
│   │  ├── GastosFijosService                                    │   │
│   │  ├── ConfigService                                         │   │
│   │  ├── ReportesService                                       │   │
│   │  └── ImportExportService                                   │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                            │                                         │
│                            ▼                                         │
│   DATABASE (Google Sheets - Minimalista)                            │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  Solo 4 hojas de DATOS (sin fórmulas complejas)            │   │
│   │  ├── CONFIG (parámetros globales)                          │   │
│   │  ├── TRANSACCIONES (todas las transacciones)               │   │
│   │  ├── GASTOS_FIJOS (gastos recurrentes)                     │   │
│   │  └── PRESUPUESTO (plan anual)                              │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Diferencias con el Sistema Anterior

| Aspecto | Sistema Anterior | Nueva App |
|---------|------------------|-----------|
| Interface | Google Sheets + popup HTML | 100% Web SPA |
| Cálculos | Fórmulas en Sheets | JavaScript en backend |
| Navegación | Múltiples hojas | Navegación fluida SPA |
| Dashboards | Sheets + popup | Integrado en la app |
| Hojas de datos | 9 hojas con fórmulas | 4 hojas solo datos |
| Complejidad | Alta | Baja (usuario) |
| Mantenimiento | Difícil (fórmulas) | Fácil (código) |

---

## 2. ESTRUCTURA DE BASE DE DATOS

### 2.1 Hoja: CONFIG
Almacena toda la configuración del sistema en formato clave-valor.

| Columna | Descripción |
|---------|-------------|
| A | Clave (key) |
| B | Valor (value) |
| C | Tipo (string/number/json) |
| D | Entidad (GLOBAL/FAMILIA/NEUROTEA) |

**Datos almacenados:**
```
CUENTAS_FAMILIA = ["ITAU Marco", "Coop. Univ. Marco", "ITAU Clara", ...]
CUENTAS_NEUROTEA = ["Atlas NeuroTEA", "UENO Marco"]
CATEGORIAS_FAMILIA = ["GASTOS FIJOS", "CUOTAS", "OBLIGACIONES", "SUSCRIPCIONES", "VARIABLES", "AHORRO"]
CATEGORIAS_NEUROTEA = ["CLÍNICA", "SUELDOS", "TELEFONÍA", "OBLIGACIONES", "EVENTOS", "VARIABLES"]
SUBCATEGORIAS_FAMILIA = ["Supermercado", "Combustible", ...]
SUBCATEGORIAS_NEUROTEA = ["Insumos", "Reparaciones", ...]
META_GANANCIA_NT = 7
META_MAX_GASTOS_NT = 93
DISTRIBUCION_UTILIDAD = 33.33
SALDO_INICIAL_FAMILIA = {...}
SALDO_INICIAL_NEUROTEA = {...}
```

### 2.2 Hoja: TRANSACCIONES
Tabla única para TODAS las transacciones (ingresos, egresos, ahorros, transferencias).

| Columna | Campo | Tipo | Descripción |
|---------|-------|------|-------------|
| A | id | string | UUID único (auto-generado) |
| B | fecha | date | Fecha de la transacción |
| C | entidad | string | FAMILIA / NEUROTEA |
| D | tipo | string | INGRESO / EGRESO / AHORRO / TRANSFERENCIA |
| E | concepto | string | Nombre del concepto |
| F | categoria | string | Categoría principal |
| G | subcategoria | string | Subcategoría (si aplica) |
| H | monto | number | Monto en Gs. |
| I | cuenta | string | Cuenta bancaria |
| J | estado | string | PAGADO / PENDIENTE / CANCELADO |
| K | notas | string | Observaciones |
| L | link_id | string | ID de transacción cruzada (si aplica) |
| M | created_at | datetime | Fecha de creación |
| N | updated_at | datetime | Última modificación |

### 2.3 Hoja: GASTOS_FIJOS
Gastos recurrentes con montos mensuales.

| Columna | Campo | Tipo |
|---------|-------|------|
| A | id | string |
| B | entidad | string |
| C | concepto | string |
| D | categoria | string |
| E | frecuencia | string |
| F | dia_vencimiento | number |
| G | cuenta | string |
| H-S | monto_ene ... monto_dic | number |
| T | activo | boolean |

### 2.4 Hoja: PRESUPUESTO
Plan anual por concepto.

| Columna | Campo | Tipo |
|---------|-------|------|
| A | id | string |
| B | entidad | string |
| C | concepto | string |
| D | tipo | string |
| E | categoria | string |
| F | frecuencia | string |
| G-R | pres_ene ... pres_dic | number |

---

## 3. MÓDULOS DE LA APLICACIÓN

### 3.1 Pantalla de Inicio (Login)
Al abrir la app, se muestra una pantalla elegante para seleccionar la entidad:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│           🏦 CONTROL FINANCIERO 2026                │
│                                                      │
│    ┌────────────────┐    ┌────────────────┐        │
│    │                │    │                │        │
│    │   👨‍👩‍👧‍👦        │    │   🏥           │        │
│    │   FAMILIA      │    │   NEUROTEA     │        │
│    │                │    │                │        │
│    │  [Entrar]      │    │  [Entrar]      │        │
│    │                │    │                │        │
│    └────────────────┘    └────────────────┘        │
│                                                      │
│              Última sesión: FAMILIA                 │
│              Versión 1.0                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3.2 Dashboard Principal
Vista general con KPIs y gráficos del mes actual.

**FAMILIA:**
- Balance del mes (Ingresos - Egresos)
- Ahorro acumulado (Clara + Marco + Fondo Emergencia)
- Gastos por categoría (donut)
- Presupuesto vs Real (barras)
- Flujo de efectivo mensual (línea)
- Balance con NeuroTEA (deudas/préstamos)
- Saldos por cuenta

**NEUROTEA:**
- Ingresos del mes
- Egresos pagados
- Ganancia real (% sobre meta)
- Distribución de ganancia (utilidad, fondos)
- Estado de resultados (barras)
- Gastos por categoría (donut)
- Balance con FAMILIA

### 3.3 Módulo Transacciones
CRUD completo para registrar movimientos.

**Características:**
- Formulario inteligente con validación en cascada
- Autocompletado de conceptos frecuentes
- Vista de lista con filtros (fecha, categoría, cuenta)
- Edición inline
- Transacciones cruzadas automáticas (préstamos NT↔FAM)
- Búsqueda rápida
- Paginación

### 3.4 Módulo Presupuesto
Gestión del plan anual.

**Características:**
- Vista de matriz 12 meses
- Edición directa en celdas
- Comparativa Presupuesto vs Real
- Alertas de desvío
- Proyección anual

### 3.5 Módulo Gastos Fijos
Gestión de gastos recurrentes.

**Características:**
- Lista de todos los gastos fijos
- Montos por mes (con variaciones)
- Estado de pago mensual
- Calendario de vencimientos
- Alertas de vencimientos próximos

### 3.6 Módulo Reportes
Análisis y visualización avanzada.

**Características:**
- Dashboard completo de 12 meses
- Tendencias y proyecciones
- Comparativa año anterior (futuro)
- Exportación PDF
- Análisis de subcategorías

### 3.7 Módulo Configuración
Gestión de parámetros del sistema.

**Características:**
- Cuentas bancarias (CRUD)
- Categorías y subcategorías (CRUD)
- Metas NeuroTEA
- Saldos iniciales por cuenta
- Importar/Exportar datos
- Backup automático

---

## 4. FLUJO DE DATOS

### 4.1 Registrar Transacción

```
┌─────────────────────────────────────────────────────────────────────┐
│  USUARIO                                                             │
│    │                                                                 │
│    │ 1. Abre formulario nueva transacción                           │
│    ▼                                                                 │
│  FRONTEND                                                            │
│    │ 2. Valida campos (fecha, monto, cuenta)                        │
│    │ 3. Determina si es transacción cruzada                         │
│    ▼                                                                 │
│  BACKEND (google.script.run)                                        │
│    │ 4. TransaccionesService.crear(data)                            │
│    │ 5. Si es préstamo NT↔FAM, crea contraparte con LINK_ID        │
│    │ 6. Inserta fila(s) en TRANSACCIONES                            │
│    │ 7. Recalcula totales en memoria                                │
│    ▼                                                                 │
│  FRONTEND                                                            │
│    │ 8. Actualiza lista de transacciones                            │
│    │ 9. Actualiza KPIs del dashboard                                │
│    ▼                                                                 │
│  USUARIO ve confirmación                                             │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Transacciones Cruzadas (Préstamos NT↔FAM)

| Acción en FAMILIA | Auto-crea en NEUROTEA |
|-------------------|----------------------|
| Egreso: "Préstamo Familia → NT" | Ingreso: "Préstamo de Familia" |
| Egreso: "Devolución a NT" | Ingreso: "Devolución de Familia" |
| Ingreso: "Préstamo de NeuroTEA" | Egreso: "Préstamo NT → Familia" |

### 4.3 Cálculos en Backend (no fórmulas en Sheets)

```javascript
// Ejemplo: calcular balance del mes
function calcularBalanceMes(entidad, mes, anio) {
  const transacciones = obtenerTransacciones(entidad, mes, anio);

  const ingresos = transacciones
    .filter(t => t.tipo === 'INGRESO' && t.estado === 'PAGADO')
    .reduce((sum, t) => sum + t.monto, 0);

  const egresos = transacciones
    .filter(t => t.tipo === 'EGRESO' && t.estado === 'PAGADO')
    .reduce((sum, t) => sum + t.monto, 0);

  return {
    ingresos,
    egresos,
    balance: ingresos - egresos
  };
}
```

---

## 5. DISEÑO VISUAL

### 5.1 Paleta de Colores

```css
:root {
  /* Colores principales */
  --primary: #1f2937;       /* Gris oscuro - fondos, textos */
  --positive: #047857;      /* Verde - ingresos, OK */
  --negative: #dc2626;      /* Rojo - egresos, alertas */
  --balance: #b45309;       /* Ámbar - balances */

  /* Colores secundarios */
  --navy: #1e3a5f;          /* Azul marino */
  --teal: #0d9488;          /* Verde azulado */
  --amber: #d97706;         /* Ámbar */
  --indigo: #4338ca;        /* Índigo */
  --rose: #be123c;          /* Rosa */
  --emerald: #059669;       /* Esmeralda */
  --sky: #0369a1;           /* Celeste */
  --violet: #7c3aed;        /* Violeta */
  --orange: #c2410c;        /* Naranja */
  --cyan: #0891b2;          /* Cian */

  /* Fondos */
  --bg-primary: #f9fafb;    /* Gris muy claro */
  --bg-card: #ffffff;       /* Blanco */
  --bg-sidebar: #1f2937;    /* Gris oscuro */

  /* Bordes */
  --border: #e5e7eb;        /* Gris claro */
}
```

### 5.2 Gráficos Donut

**DONUT1 (6 colores - Categorías principales):**
```javascript
const DONUT1 = ['#1e3a5f', '#be123c', '#d97706', '#4338ca', '#0d9488', '#7c3aed'];
```

**DONUT2 (10 colores - Subcategorías):**
```javascript
const DONUT2 = ['#047857', '#b45309', '#0369a1', '#7c3aed', '#c2410c',
                '#0891b2', '#059669', '#4338ca', '#0d9488', '#1e3a5f'];
```

### 5.3 KPIs

```css
.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.kpi-card.blue { border-left: 4px solid #3b82f6; }
.kpi-card.red { border-left: 4px solid #dc2626; }
.kpi-card.green { border-left: 4px solid #047857; }
.kpi-card.amber { border-left: 4px solid #b45309; }

.kpi-value { font-size: 28px; font-weight: 700; }
.kpi-label { font-size: 14px; color: #6b7280; }
```

### 5.4 Layout Principal

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER (logo, entidad actual, switch entidad, usuario)          │
├──────────┬───────────────────────────────────────────────────────┤
│          │                                                       │
│ SIDEBAR  │              CONTENIDO PRINCIPAL                      │
│          │                                                       │
│ 📊 Dashboard │  ┌─────────────────────────────────────────────┐ │
│ 💰 Transacc. │  │                                             │ │
│ 📋 Presupuesto │ │   Vista activa según menú                  │ │
│ 📅 Gastos Fijos│ │                                             │ │
│ 📈 Reportes    │ │                                             │ │
│ ⚙️ Config     │  │                                             │ │
│          │  └─────────────────────────────────────────────┘ │
│          │                                                       │
│ ───────  │                                                       │
│ 🔄 Cambiar │                                                     │
│   Entidad │                                                      │
│          │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

---

## 6. IMPORTACIÓN / EXPORTACIÓN

### 6.1 Exportar Backup (JSON)

```javascript
// Estructura del backup
{
  "version": "1.0",
  "fecha_export": "2026-01-31T15:30:00",
  "config": {
    "cuentas_familia": [...],
    "cuentas_neurotea": [...],
    "categorias": {...},
    "metas": {...}
  },
  "transacciones": [
    {
      "id": "abc123",
      "fecha": "2026-01-15",
      "entidad": "FAMILIA",
      "tipo": "EGRESO",
      "concepto": "Supermercado",
      "categoria": "VARIABLES",
      "subcategoria": "Supermercado",
      "monto": 850000,
      "cuenta": "ITAU Clara",
      "estado": "PAGADO"
    },
    ...
  ],
  "gastos_fijos": [...],
  "presupuesto": [...]
}
```

### 6.2 Importar desde CSV

**Formato esperado (transacciones):**
```csv
fecha,entidad,tipo,concepto,categoria,subcategoria,monto,cuenta,estado,notas
2026-01-15,FAMILIA,EGRESO,Supermercado,VARIABLES,Supermercado,850000,ITAU Clara,PAGADO,
2026-01-15,FAMILIA,INGRESO,Salario Marco,,,12500000,ITAU Marco,PAGADO,
```

---

## 7. ESTRUCTURA DE ARCHIVOS

```
/App-Finanzas-Nueva/
├── Code.gs                 # Entry point, doGet(), rutas
├── Config.gs               # Configuración global
├── Services/
│   ├── TransaccionesService.gs
│   ├── GastosFijosService.gs
│   ├── PresupuestoService.gs
│   ├── ConfigService.gs
│   ├── ReportesService.gs
│   └── ImportExportService.gs
├── Utils/
│   ├── Formatters.gs       # Formato números, fechas
│   ├── Validators.gs       # Validaciones
│   └── Database.gs         # Helpers para Sheets
├── Views/
│   ├── Index.html          # SPA principal
│   ├── Components/
│   │   ├── Header.html
│   │   ├── Sidebar.html
│   │   ├── Dashboard.html
│   │   ├── Transacciones.html
│   │   ├── Presupuesto.html
│   │   ├── GastosFijos.html
│   │   ├── Reportes.html
│   │   └── Config.html
│   └── Styles/
│       └── main.css
└── Scripts/
    ├── app.js              # Lógica principal SPA
    ├── charts.js           # Chart.js helpers
    └── utils.js            # Utilidades frontend
```

---

## 8. TECNOLOGÍAS

| Componente | Tecnología | Razón |
|------------|------------|-------|
| Frontend | HTML5 + CSS3 + JS ES6 | Compatible con GAS HtmlService |
| Gráficos | Chart.js v4 | Liviano, moderno, responsive |
| Íconos | Heroicons (SVG inline) | Sin dependencias externas |
| Backend | Google Apps Script | Integración nativa con Sheets |
| Database | Google Sheets | Fácil backup, acceso universal |
| Formato | Paraguay (Gs., separador punto) | Locale del usuario |

---

## 9. VENTAJAS DE LA NUEVA ARQUITECTURA

### 9.1 Para el Usuario

| Beneficio | Descripción |
|-----------|-------------|
| **Velocidad** | Cálculos en JS son más rápidos que fórmulas Sheets |
| **UX moderna** | Navegación SPA sin recargas |
| **Móvil friendly** | Responsive design |
| **Menos errores** | Sin fórmulas complejas que se rompen |
| **Búsqueda rápida** | Filtros instantáneos |
| **Backup fácil** | Export JSON con un click |

### 9.2 Para el Desarrollador

| Beneficio | Descripción |
|-----------|-------------|
| **Mantenible** | Código modular, sin fórmulas |
| **Testeable** | Funciones puras en backend |
| **Extensible** | Fácil agregar nuevas features |
| **Versionable** | Git para todo el código |
| **Debuggeable** | Logs claros, no fórmulas ocultas |

---

## 10. FASES DE IMPLEMENTACIÓN

### Fase 1: Fundación (Semana 1-2)
- [ ] Crear Google Sheet con estructura de datos
- [ ] Implementar Code.gs con doGet() SPA
- [ ] Crear layout base (Header, Sidebar)
- [ ] Implementar pantalla de selección de entidad
- [ ] Servicios base: ConfigService, Database

### Fase 2: Core (Semana 3-4)
- [ ] TransaccionesService completo
- [ ] Vista de transacciones con CRUD
- [ ] Formulario con validación en cascada
- [ ] Transacciones cruzadas automáticas
- [ ] GastosFijosService + vista

### Fase 3: Dashboard (Semana 5)
- [ ] Implementar Dashboard FAMILIA
- [ ] Implementar Dashboard NEUROTEA
- [ ] Gráficos con Chart.js
- [ ] KPIs en tiempo real

### Fase 4: Presupuesto y Reportes (Semana 6)
- [ ] PresupuestoService + vista
- [ ] Comparativa Pres vs Real
- [ ] ReportesService
- [ ] Vista de reportes anuales

### Fase 5: Polish (Semana 7)
- [ ] Módulo Configuración completo
- [ ] Import/Export JSON/CSV
- [ ] Optimización de rendimiento
- [ ] Testing final
- [ ] Documentación usuario

---

## 11. PREGUNTAS PARA CONFIRMAR

Antes de comenzar la implementación, confirma estos puntos:

1. **¿Deseas mantener el flujo de préstamos NT↔FAM bidireccional?**
   - [ ] Sí, exactamente igual
   - [ ] Sí, pero simplificado
   - [ ] No es necesario

2. **¿Deseas que el sistema recuerde la última entidad usada?**
   - [ ] Sí, al abrir ir directo a esa entidad
   - [ ] No, siempre mostrar pantalla de selección

3. **¿Deseas algún nivel de autenticación?**
   - [ ] No, cualquiera con el link puede usar
   - [ ] Sí, validar email de Google
   - [ ] Sí, con contraseña por entidad

4. **¿Moneda única (Guaraníes)?**
   - [ ] Sí, solo Gs.
   - [ ] No, quiero multi-moneda (futuro)

5. **¿Deseas alertas por email?**
   - [ ] Sí, vencimientos próximos
   - [ ] Sí, cuando balance sea negativo
   - [ ] No por ahora

---

## 12. PRÓXIMOS PASOS

Si apruebas este plan, procederé a:

1. **Crear el Google Sheet** con la nueva estructura de 4 hojas
2. **Implementar el esqueleto base** de la aplicación
3. **Desarrollar módulo por módulo** según las fases

¿Deseas que comience con la implementación?

---

*Plan creado: 2026-01-31*
*Basado en análisis de: PLAN_MAESTRO_Control_Financiero_2026.md, PRD.md, CLAUDE.md*
