# PRD - Product Requirements Document
## FinanzasApp v1.0

> **Producto**: FinanzasApp - Sistema de Control Financiero Personal y Empresarial
> **Plataforma**: Google Apps Script + Google Sheets
> **Versión**: 1.0.0
> **Última actualización**: 2026-01-31

---

## 1. VISIÓN DEL PRODUCTO

### 1.1 Propósito
FinanzasApp es una aplicación web moderna para el control financiero integral de dos entidades independientes pero relacionadas:

- **FAMILIA**: Finanzas del hogar (Marco y Clara)
- **NEUROTEA**: Clínica de terapias para niños con autismo

### 1.2 Problema que Resuelve
- Múltiples fuentes de ingreso difíciles de rastrear
- Transferencias entre cuentas personales y del negocio sin control
- Falta de visibilidad del estado financiero real
- Complejidad de planillas con fórmulas que se rompen
- Necesidad de independizar el control pero mantener trazabilidad de flujos cruzados

### 1.3 Propuesta de Valor
Una aplicación **liviana, moderna e intuitiva** que:
- Separa completamente FAMILIA y NEUROTEA
- Permite transferencias controladas entre ambas entidades
- Ofrece dashboards profesionales en tiempo real
- Usa Google Sheets solo como base de datos (sin fórmulas complejas)
- Interface 100% web con navegación fluida

---

## 2. USUARIOS

### 2.1 Usuarios Primarios
| Usuario | Rol | Uso Principal |
|---------|-----|---------------|
| Marco | Administrador | Gestión NEUROTEA + supervisión FAMILIA |
| Clara | Usuario | Carga de gastos FAMILIA |

### 2.2 Contexto
- **Moneda**: Guaraníes paraguayos (Gs.)
- **Formato numérico**: Separador de miles con punto (1.000.000)
- **Período fiscal**: Año calendario (Enero-Diciembre)

---

## 3. ARQUITECTURA

### 3.1 Stack Tecnológico
| Capa | Tecnología |
|------|------------|
| Frontend | HTML5 + CSS3 + JavaScript ES6 |
| Visualización | Chart.js v4 |
| Backend | Google Apps Script |
| Base de datos | Google Sheets (4 hojas) |
| Hosting | Google Apps Script Web App |

### 3.2 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO (Browser)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (SPA)                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Index.html + CSS + JavaScript                        │    │
│  │ - Pantalla selección entidad                        │    │
│  │ - Dashboard con Chart.js                            │    │
│  │ - Módulos: Transacciones, Presupuesto, Config       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                    google.script.run
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (GAS)                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Services:                                            │    │
│  │ - TransaccionesService                              │    │
│  │ - GastosFijosService                                │    │
│  │ - PresupuestoService                                │    │
│  │ - ConfigService                                     │    │
│  │ - ReportesService                                   │    │
│  │ - ImportExportService                               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (Google Sheets)                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   CONFIG     │ │ TRANSACCIONES│ │ GASTOS_FIJOS │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│  ┌──────────────┐                                           │
│  │ PRESUPUESTO  │                                           │
│  └──────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. ESTRUCTURA DE DATOS

### 4.1 Hoja: CONFIG
Almacena configuración en formato clave-valor.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| key | string | Identificador único |
| value | string/json | Valor de configuración |
| type | string | Tipo de dato (string/number/json/boolean) |
| entity | string | GLOBAL / FAMILIA / NEUROTEA |

**Configuraciones almacenadas:**
- Cuentas bancarias por entidad
- Categorías de egresos
- Subcategorías variables
- Tipos de ingreso
- Metas NEUROTEA (ganancia 7%, max gastos 93%, distribución 33.33%)
- Saldos iniciales por cuenta

### 4.2 Hoja: TRANSACCIONES
Tabla única para todos los movimientos financieros.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| id | string | Sí | UUID auto-generado |
| fecha | date | Sí | Fecha de la transacción |
| entidad | string | Sí | FAMILIA / NEUROTEA |
| tipo | string | Sí | INGRESO / EGRESO / AHORRO / TRANSFERENCIA |
| concepto | string | Sí | Nombre del concepto |
| categoria | string | No | Categoría principal (egresos) |
| subcategoria | string | No | Subcategoría (si categoría = VARIABLES) |
| monto | number | Sí | Monto en Gs. |
| cuenta | string | Sí | Cuenta bancaria |
| estado | string | Sí | PAGADO / PENDIENTE / CANCELADO |
| notas | string | No | Observaciones |
| link_id | string | No | UUID de transacción cruzada vinculada |
| created_at | datetime | Sí | Fecha/hora de creación |
| updated_at | datetime | Sí | Fecha/hora de última modificación |

### 4.3 Hoja: GASTOS_FIJOS
Gastos recurrentes con montos por mes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID |
| entidad | string | FAMILIA / NEUROTEA |
| concepto | string | Nombre del gasto |
| categoria | string | Categoría |
| frecuencia | string | Fijo/Mensual, Variable/Mensual, etc. |
| dia_vencimiento | number | Día del mes (1-31) |
| cuenta | string | Cuenta de pago |
| monto_ene...monto_dic | number | Monto por cada mes |
| activo | boolean | Si está activo |

### 4.4 Hoja: PRESUPUESTO
Plan anual por concepto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | UUID |
| entidad | string | FAMILIA / NEUROTEA |
| concepto | string | Nombre |
| tipo | string | INGRESO / EGRESO |
| categoria | string | Categoría |
| frecuencia | string | Frecuencia |
| pres_ene...pres_dic | number | Presupuesto por mes |

---

## 5. FUNCIONALIDADES

### 5.1 Pantalla de Inicio
- Selección visual de entidad (FAMILIA / NEUROTEA)
- Cards con íconos distintivos
- Acceso directo a cada espacio de trabajo

### 5.2 Dashboard
**Común a ambas entidades:**
- Balance del mes (Ingresos - Egresos pagados)
- Gráfico de categorías (donut)
- Presupuesto vs Real (barras)
- Saldos por cuenta
- Balance cruzado con la otra entidad

**Específico FAMILIA:**
- Ahorro acumulado (Clara + Marco + Fondo Emergencia)
- Flujo de efectivo mensual

**Específico NEUROTEA:**
- Ganancia real (% sobre meta 7%)
- Distribución de ganancia (utilidad, fondo emergencia, fondo inversión)
- Estado de resultados

### 5.3 Módulo Transacciones
- Listado con filtros (fecha, categoría, cuenta, estado)
- Formulario de carga con validación en cascada
- Edición inline
- Transacciones cruzadas automáticas (préstamos NT↔FAM)
- Búsqueda rápida
- Paginación

### 5.4 Módulo Gastos Fijos
- Lista de gastos recurrentes
- Montos por mes con variaciones
- Estado de pago mensual
- Calendario de vencimientos

### 5.5 Módulo Presupuesto
- Vista matriz 12 meses
- Edición directa en celdas
- Comparativa Presupuesto vs Real
- Alertas de desvío

### 5.6 Módulo Reportes
- Dashboard anual completo
- Tendencias mensuales
- Análisis por categoría/subcategoría
- Exportación (futuro: PDF)

### 5.7 Módulo Configuración
- CRUD de cuentas bancarias
- CRUD de categorías/subcategorías
- Metas NEUROTEA
- Saldos iniciales
- Importar backup JSON
- Exportar backup JSON
- Importar CSV

---

## 6. TRANSACCIONES CRUZADAS

### 6.1 Flujo de Préstamos NT → FAMILIA

```
NEUROTEA presta a FAMILIA:
┌─────────────────────────────────────────────────────────────┐
│ En NEUROTEA (auto):                                          │
│   Tipo: EGRESO                                               │
│   Concepto: "Préstamo NT → Familia"                         │
│   Categoría: VARIABLES                                       │
│   Subcategoría: "Préstamo NT → Familia"                     │
│   link_id: "abc123"                                          │
└─────────────────────────────────────────────────────────────┘
                              ↕ vinculadas
┌─────────────────────────────────────────────────────────────┐
│ En FAMILIA (auto):                                           │
│   Tipo: INGRESO                                              │
│   Concepto: "Préstamo de NeuroTEA"                          │
│   link_id: "abc123"                                          │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Flujo de Devolución FAMILIA → NT

```
FAMILIA devuelve a NEUROTEA:
┌─────────────────────────────────────────────────────────────┐
│ En FAMILIA (auto):                                           │
│   Tipo: EGRESO                                               │
│   Concepto: "Devolución Familia → NT"                       │
│   Categoría: VARIABLES                                       │
│   Subcategoría: "Devolución Familia → NT"                   │
│   link_id: "xyz789"                                          │
└─────────────────────────────────────────────────────────────┘
                              ↕ vinculadas
┌─────────────────────────────────────────────────────────────┐
│ En NEUROTEA (auto):                                          │
│   Tipo: INGRESO                                              │
│   Concepto: "Devolución de Familia"                         │
│   link_id: "xyz789"                                          │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 Balance Cruzado
- Se calcula en tiempo real
- Muestra deuda neta entre entidades
- Visible en dashboard de ambas entidades

---

## 7. DISEÑO VISUAL

### 7.1 Paleta de Colores

```css
/* Colores principales */
--primary: #1f2937;       /* Gris oscuro */
--positive: #047857;      /* Verde - ingresos */
--negative: #dc2626;      /* Rojo - egresos */
--balance: #b45309;       /* Ámbar - balances */

/* Colores secundarios */
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
```

### 7.2 Gráficos Donut
- **DONUT1** (6 colores): `['#1e3a5f', '#be123c', '#d97706', '#4338ca', '#0d9488', '#7c3aed']`
- **DONUT2** (10 colores): `['#047857', '#b45309', '#0369a1', '#7c3aed', '#c2410c', '#0891b2', '#059669', '#4338ca', '#0d9488', '#1e3a5f']`

### 7.3 KPIs
```css
.kpi-card.blue  { border-left: 4px solid #3b82f6; }
.kpi-card.red   { border-left: 4px solid #dc2626; }
.kpi-card.green { border-left: 4px solid #047857; }
.kpi-card.amber { border-left: 4px solid #b45309; }
```

---

## 8. REQUISITOS NO FUNCIONALES

### 8.1 Rendimiento
- Carga inicial < 3 segundos
- Respuesta a acciones < 500ms
- Paginación para listas > 50 items

### 8.2 Usabilidad
- Responsive (desktop + tablet + móvil)
- Navegación con máximo 2 clicks
- Feedback visual en todas las acciones

### 8.3 Seguridad
- Sin autenticación adicional (por ahora)
- Acceso mediante URL de Web App
- Backup automático en Sheets

### 8.4 Mantenibilidad
- Código modular (Services separados)
- Documentación actualizada (CLAUDE.md)
- Control de versiones (Git)

---

## 9. ROADMAP

### v1.0 - MVP (Actual)
- [x] Arquitectura base
- [ ] Pantalla selección entidad
- [ ] Dashboard FAMILIA y NEUROTEA
- [ ] CRUD Transacciones
- [ ] Gastos Fijos
- [ ] Presupuesto básico
- [ ] Import/Export JSON

### v1.1 - Mejoras
- [ ] Reportes anuales
- [ ] Alertas visuales de vencimientos
- [ ] Gráficos de tendencias

### v1.2 - Futuro
- [ ] Autenticación Google
- [ ] Alertas por email
- [ ] Exportación PDF
- [ ] Multi-año

---

## 10. GLOSARIO

| Término | Definición |
|---------|------------|
| Entidad | FAMILIA o NEUROTEA |
| Transacción cruzada | Movimiento que afecta ambas entidades (préstamo/devolución) |
| link_id | UUID que vincula dos transacciones cruzadas |
| EST.PAGO | Estado de pago (PAGADO/PENDIENTE/CANCELADO) |
| SPA | Single Page Application |

---

*Documento creado: 2026-01-31*
*Próxima revisión: Al completar v1.0*
