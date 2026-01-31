# CHANGELOG
## FinanzasApp - Historial de Cambios

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### En desarrollo
- Estructura base del proyecto
- Documentación inicial (PRD, CLAUDE.md)

---

## [1.0.0] - En desarrollo

### Added (Agregado)
- **Arquitectura SPA**: Aplicación web de página única con navegación fluida
- **Base de datos simplificada**: 4 hojas en Google Sheets (CONFIG, TRANSACCIONES, GASTOS_FIJOS, PRESUPUESTO)
- **Pantalla de selección**: Elección entre FAMILIA y NEUROTEA al iniciar
- **Dashboard FAMILIA**: KPIs, gráficos de categorías, saldos por cuenta
- **Dashboard NEUROTEA**: Ganancia, distribución de utilidad, estado de resultados
- **Módulo Transacciones**: CRUD completo con validación en cascada
- **Transacciones cruzadas**: Sistema automático de préstamos/devoluciones NT↔FAM con link_id
- **Módulo Gastos Fijos**: Gestión de gastos recurrentes por mes
- **Módulo Presupuesto**: Plan anual con comparativa vs Real
- **Módulo Configuración**: Cuentas, categorías, subcategorías, metas
- **Import/Export**: Backup JSON y carga desde CSV
- **Paleta de colores**: Diseño sobrio profesional según especificación
- **Chart.js v4**: Gráficos donut y barras interactivos

### Technical (Técnico)
- Google Apps Script como backend
- HtmlService para frontend SPA
- google.script.run para comunicación frontend-backend
- Formato numérico paraguayo (separador de miles con punto)
- Moneda única: Guaraníes (Gs.)

---

## Convenciones de este archivo

### Tipos de cambios
- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades que serán removidas próximamente
- **Removed**: Funcionalidades removidas
- **Fixed**: Corrección de bugs
- **Security**: Correcciones de vulnerabilidades
- **Technical**: Cambios técnicos internos

### Formato de versiones
- **MAJOR.MINOR.PATCH**
- MAJOR: Cambios incompatibles
- MINOR: Nuevas funcionalidades compatibles
- PATCH: Correcciones de bugs compatibles

---

*Última actualización: 2026-01-31*
