# PLAN MAESTRO: Sistema de Control Financiero 2026
## NeuroTEA & Familia - Google Sheets + Web App
### Versión 3.1 - Bug fixes testing (GASTOS OPERATIVOS, GANANCIA REAL NT, formato números)

---

## RESUMEN EJECUTIVO

Este documento consolida la interpretación completa del proyecto de planilla de control financiero basado en el análisis exhaustivo de:
- Conversaciones anteriores con chatbots
- Archivos Excel V7 y V9
- Prototipo visual JSX del tablero
- Imágenes de referencia (preview1-4.webp)
- PDF del presupuesto anual

**Objetivo del Sistema:** Crear una herramienta robusta, práctica y visualmente elegante para controlar las finanzas de la familia y de la clínica NeuroTEA de forma integrada, con alertas automáticas sobre rentabilidad y flujo de caja.

### Principios Clave (v2.4)
1. **EST. PAGO es el gatillo**: Un gasto solo se contabiliza como PAGADO cuando el usuario lo marca así
2. **Separación clara**: EGRESOS PAGADOS vs EGRESOS PENDIENTES
3. **LIQUIDEZ automática**: Calcula gastos atrasados, esta semana y próxima semana según DÍA
4. **SALDO_INICIAL manual**: El usuario carga el saldo inicial del mes anterior para cada entidad

---

## 1. CONTEXTO DEL USUARIO

### Perfil
- **Usuario principal:** Marco (administrador de NeuroTEA y finanzas familiares)
- **Usuario secundario:** Clara (esposa de Marco, carga gastos familiares)
- **Moneda:** Guaraníes paraguayos (Gs.)
- **Período:** Año fiscal 2026

### Entidades Financieras
1. **FAMILIA:** Finanzas del hogar (salarios, gastos domésticos, préstamos personales)
2. **NEUROTEA:** Clínica de terapias para niños con autismo (ingresos por terapeutas, cursos, gastos operativos)

### Relación entre Entidades
- Marco recibe **Salario de Itaipu** (empleador principal)
- Marco recibe **Salario de Administrador de NeuroTEA** (Gs. 5.000.000/mes) - Este es un GASTO para NT y un INGRESO para Familia
- Clara recibe **Honorarios de NeuroTEA** (Gs. 2.999.999/mes aprox)
- Cuando la familia tiene déficit, **NeuroTEA presta dinero a la Familia**
- La familia debe **devolver esos préstamos** a NeuroTEA
- El sistema debe rastrear este **balance cruzado** y alertar si hay subsidio

---

## 2. ESTRUCTURA DE HOJAS (8 PESTAÑAS)

| # | Hoja | Función | Quién la usa | Editable |
|---|------|---------|--------------|----------|
| 1 | **CONFIG** | Listas maestras, metas, parámetros globales | Marco | Sí |
| 2 | **PRESUPUESTO** | Plan anual de ingresos/gastos (excepto Ganancia NT que es calculada) | Marco | Sí (parcial) |
| 3 | **GASTOS_FIJOS** | Montos base × 12 meses + día de vencimiento | Marco | Sí |
| 4 | **CARGA_FAMILIA** | Registro cronológico de variables familiares | Clara/Marco | Sí |
| 5 | **CARGA_NT** | Registro cronológico de variables NeuroTEA (v7.7: solo VARIABLES, EVENTOS va en GASTOS_FIJOS) | Marco | Sí |
| 6 | **MOVIMIENTO** | Real vs Presupuesto + EST. PAGO (gatillo de contabilización) | Marco | Parcial |
| 7 | **TABLERO** | KPIs, SALDO_INICIAL, resumen PAGADOS vs PENDIENTES | Lectura | Parcial (SALDO_INICIAL) |
| 8 | **LIQUIDEZ** | Gastos atrasados, esta semana, próxima semana (fórmulas TODAY()) | Lectura | No |

> **Nota**: WEB APP no es una hoja, es un popup HTML que se abre desde el menú.

---

## 3. HOJA CONFIG - CONFIGURACIÓN COMPLETA

### 3.1 MESES
```
Enero, Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto, Septiembre, Octubre, Noviembre, Diciembre
```

### 3.2 ENTIDADES
```
FAMILIA, NEUROTEA
```

### 3.3 TIPOS DE INGRESO FAMILIA (para desplegable)
| # | Tipo de Ingreso | Descripción |
|---|-----------------|-------------|
| 1 | Salario Marco | Salario de Itaipu (empleador principal) |
| 2 | **Salario Marco NeuroTEA** | Salario de administrador que NT paga a Marco |
| 3 | Vacaciones Marco | Pago de vacaciones |
| 4 | Adelanto de Aguinaldo Marco | Anticipo de aguinaldo |
| 5 | Saldo Aguinaldo Marco | Resto del aguinaldo |
| 6 | Viático Marco | Viáticos de trabajo |
| 7 | Animador Bíblico Marco | Ingreso por actividad religiosa |
| 8 | Tarjeta Gourmed | Beneficio alimentación |
| 9 | Contrato Colectivo Marco | Bonificación sindical |
| 10 | PL Itaipu Marco | Participación en utilidades Itaipu |
| 11 | Honorarios Clara NeuroTEA | Pago de NT a Clara |
| 12 | Préstamo NeuroTEA | Dinero que NT presta a Familia |
| 13 | Préstamo Otros Bancos | Préstamos de terceros |

### 3.4 TIPOS DE INGRESO NEUROTEA (para desplegable)
| # | Tipo de Ingreso | Descripción |
|---|-----------------|-------------|
| 1 | Aporte NeuroTEA Terapeutas | Ingresos principales de la clínica |
| 2 | Cursos NeuroTEA | Ingresos por capacitaciones |
| 3 | Otros | Otros ingresos varios |
| 4 | Devolución Familia → NT | Cuando Familia devuelve préstamo a NT |

**ACLARACIÓN IMPORTANTE - FLUJO DE HONORARIOS CLARA:**
- Los terapeutas entregan su aporte a la clínica
- **Clara retira su parte ANTES** de que el dinero entre a NeuroTEA
- Lo que se registra en "Aporte NeuroTEA Terapeutas" ya viene **NETO** (sin la parte de Clara)
- Por lo tanto, **NO existe** un egreso en NT llamado "Honorarios Clara"
- En FAMILIA, Clara registra su ingreso como "Honorarios Clara NeuroTEA"
- Este flujo evita duplicación: Clara ya tomó su parte, no se descuenta de NT

### 3.5 CUENTAS FAMILIA (para desplegable)
| # | Cuenta |
|---|--------|
| 1 | ITAU Marco |
| 2 | Coop. Univ. Marco |
| 3 | ITAU Clara |
| 4 | UENO Clara |
| 5 | Tarjeta Solar Clara |
| 6 | Tarjeta ITAU Clara |
| 7 | **Tarjeta ITAU Marco** |
| 8 | Tarjeta Comecipar Clara |
| 9 | Gourmed |
| 10 | Efectivo |

### 3.6 CUENTAS NEUROTEA (para desplegable)
| # | Cuenta | Descripción |
|---|--------|-------------|
| 1 | Atlas NeuroTEA | Cuenta bancaria principal |
| 2 | UENO Marco | Cuenta compartida para gastos NT en efectivo |

> **Nota**: Solo 2 cuentas. "UENO Marco" es la cuenta de Marco usada para gastos NT en efectivo.

### 3.7 CATEGORÍAS EGRESO FAMILIA (Agrupaciones principales)
| # | Categoría |
|---|-----------|
| 1 | GASTOS FIJOS |
| 2 | CUOTAS Y PRÉSTAMOS |
| 3 | OBLIGACIONES LEGALES |
| 4 | SUSCRIPCIONES |
| 5 | VARIABLES |
| 6 | AHORRO |

### 3.8 SUBCATEGORÍAS VARIABLES FAMILIA (para desplegable cuando Categoría = VARIABLES)
| # | Subcategoría Variable | Descripción |
|---|----------------------|-------------|
| 1 | Supermercado | Compras de alimentos y hogar |
| 2 | Combustible | Nafta para vehículos |
| 3 | Mantenimiento / Reparaciones Auto Clara | Gastos del auto de Clara |
| 4 | Mantenimiento / Reparaciones Auto Niños | Gastos del auto de los niños |
| 5 | Mantenimiento / Reparaciones Camioneta Marco | Gastos de la camioneta |
| 6 | Ropa/Vestidos | Vestimenta familiar |
| 7 | Recreación (Pizza, hamburguesa, helados, etc) | Salidas y entretenimiento |
| 8 | Salud y Medicamentos | Gastos médicos no cubiertos |
| 9 | Gastos no identificados | Gastos varios sin categoría |
| 10 | Devolución Familia → NT | Cuando Familia devuelve préstamo a NT |

### 3.9 CATEGORÍAS EGRESO NEUROTEA (Agrupaciones principales)
| # | Categoría |
|---|-----------|
| 1 | CLÍNICA |
| 2 | SUELDOS Y HONORARIOS |
| 3 | TELEFONÍA E INTERNET |
| 4 | OBLIGACIONES LEGALES |
| 5 | EVENTOS |
| 6 | VARIABLES |

### 3.10 SUBCATEGORÍAS VARIABLES NEUROTEA (para desplegable cuando Categoría = VARIABLES)
| # | Subcategoría Variable | Descripción |
|---|----------------------|-------------|
| 1 | Insumos y Papelería | Materiales de oficina y terapia |
| 2 | Reparaciones Clínica | Arreglos del local |
| 3 | Mantenimiento Aire | Service de aire acondicionado |
| 4 | Gastos Cursos | Materiales para capacitaciones |
| 5 | Gastos Varios Cumple (Tortas, bocaditos, meriendas) | Celebraciones menores |
| 6 | Préstamo NT → Familia | Cuando NT presta dinero a Familia |

### 3.11 EVENTOS NEUROTEA (van en GASTOS_FIJOS - v7.7)

> **DECISIÓN [2026-01-20]**: EVENTOS son gastos PLANIFICADOS (Variable/Anual), no variables puros.
> Se registran en GASTOS_FIJOS igual que otros gastos fijos, NO en CARGA_NT.

| # | Evento | Mes típico | Día estimado |
|---|--------|------------|--------------|
| 1 | Día del Autismo | Abril | 2 |
| 2 | San Juan | Junio | 24 |
| 3 | Día del Niño | Agosto | 16 |
| 4 | Clausura Padres | Noviembre | 15 |
| 5 | Navidad Papá Noel | Diciembre | 20 |
| 6 | Cena Fin de Año | Diciembre | 28 |
| 7-18 | Reserva Evento 1-12 | (por definir) | - |

**Total: 18 eventos (6 definidos + 12 reservas)**

**SISTEMA DE EVENTOS (v7.7):**
- Los eventos se registran en GASTOS_FIJOS con monto en el mes correspondiente
- Las Reservas se renombran cuando se define el evento real
- MOVIMIENTO lee de GASTOS_FIJOS (INDEX/MATCH) no de CARGA_NT
- EST.PAGO tiene dropdown (Pendiente/Pagado/Cancelado)

### 3.12 FRECUENCIA (para clasificar gastos)
| # | Frecuencia | Descripción |
|---|------------|-------------|
| 1 | Fijo/Mensual | Mismo monto cada mes (Ej: Alquiler) |
| 2 | Fijo/Anual | Se paga una vez al año (Ej: Antivirus) |
| 3 | Variable/Mensual | Monto varía cada mes (Ej: ANDE, Supermercado) |
| 4 | Variable/Anual | Ocurre ocasionalmente (Ej: Reparaciones) |

### 3.13 ESTADOS (para seguimiento de pagos)
| # | Estado | Descripción |
|---|--------|-------------|
| 1 | Pendiente | Aún no pagado |
| 2 | Pagado | Ya fue abonado |
| 3 | Cancelado | No se pagará (anulado) |

### 3.14 METAS NEUROTEA (parámetros editables desde CONFIG v7.6)
| Parámetro | Valor Default | Ubicación CONFIG | Descripción |
|-----------|---------------|------------------|-------------|
| Meta Ganancia Mínima | **7%** | CONFIG!$B$40 | Porcentaje mínimo de ganancia sobre ingresos |
| Meta Máximo Gastos | **93%** | CONFIG!$B$41 | Porcentaje máximo de gastos sobre ingresos |
| Distribución Utilidad Dueño | **33.33%** | CONFIG!$B$42 | Tercio de la ganancia para Marco |
| Distribución Fondo Emergencia | **33.33%** | CONFIG!$B$43 | Tercio para contingencias |
| Distribución Fondo Inversión | **33.34%** | CONFIG!$B$44 | Tercio para crecimiento |

> **v7.6**: Estos valores son editables directamente en CONFIG (sección "🎯 METAS NEUROTEA").
> Las fórmulas en PRESUPUESTO, MOVIMIENTO y TABLERO los referencian automáticamente.

**ACLARACIÓN IMPORTANTE - FONDOS VIRTUALES:**
Los fondos de NeuroTEA (Utilidad, Fondo Emergencia, Fondo Inversión) son **VIRTUALES**:
- Se CALCULAN automáticamente basados en la ganancia
- **NO son cuentas bancarias separadas**
- El dinero físico permanece en las cuentas NT (Atlas, UENO Marco)
- Los fondos son una **asignación contable** para saber cuánto hay disponible para cada propósito
- Ayudan a tomar decisiones: "¿Puedo hacer esta inversión?" → Mirar Fondo Inversión

---

## 4. HOJA PRESUPUESTO - DETALLE COMPLETO

### 4.1 Estructura de la Hoja
```
| CONCEPTO | TIPO | FRECUENCIA | ENE | FEB | MAR | ABR | MAY | JUN | JUL | AGO | SEP | OCT | NOV | DIC | TOTAL AÑO |
```

### 4.2 PRESUPUESTO FAMILIA

#### ► INGRESOS FAMILIA
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Salario Marco | Ingreso | Fijo/Mensual |
| 2 | **Salario Marco NeuroTEA** | Ingreso | Fijo/Mensual |
| 3 | Vacaciones Marco | Ingreso | Variable/Anual |
| 4 | Adelanto de Aguinaldo Marco | Ingreso | Fijo/Anual |
| 5 | Saldo Aguinaldo Marco | Ingreso | Fijo/Anual |
| 6 | Viático Marco | Ingreso | Variable/Mensual |
| 7 | Animador Bíblico Marco | Ingreso | Fijo/Mensual |
| 8 | Tarjeta Gourmed | Ingreso | Fijo/Mensual |
| 9 | Contrato Colectivo Marco | Ingreso | Variable/Anual |
| 10 | PL Itaipu Marco | Ingreso | Variable/Anual |
| 11 | Honorarios Clara NeuroTEA | Ingreso | Fijo/Mensual |
| 12 | Préstamo NeuroTEA | Ingreso | Variable/Mensual |
| 13 | Préstamo Otros Bancos | Ingreso | Variable/Anual |
| - | **TOTAL INGRESOS FAMILIA** | - | - |

#### ► EGRESOS FAMILIA - GASTOS FIJOS
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Salario Lili Doméstico | Egreso | Fijo/Mensual |
| 2 | Salario Laura Doméstico | Egreso | Fijo/Mensual |
| 3 | Escuela Fabián y Brenda | Egreso | Fijo/Mensual |
| 4 | Robótica Niños | Egreso | Fijo/Mensual |
| 5 | ANDE Casa | Egreso | Variable/Mensual |
| 6 | Expensa Casa | Egreso | Fijo/Mensual |
| 7 | Ña Luisa | Egreso | Fijo/Mensual |
| 8 | Remedio Lochi | Egreso | Variable/Mensual |
| 9 | Seguro Médico Papá y Mamá | Egreso | Fijo/Mensual |
| 10 | Contadora Marco | Egreso | Fijo/Mensual |
| 11 | Reserva | - | - |
| 12 | Reserva | - | - |
| 13 | Reserva | - | - |
| - | **SUBTOTAL GASTOS FIJOS** | - | - |

#### ► EGRESOS FAMILIA - CUOTAS Y PRÉSTAMOS
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Préstamo Lizzi | Egreso | Fijo/Mensual |
| 2 | Cajubi Marco | Egreso | Fijo/Mensual |
| 3 | Mutual Marco | Egreso | Fijo/Mensual |
| 4 | Seguro Auto Laura ITAU | Egreso | Fijo/Mensual |
| 5 | Cuota ITAU | Egreso | Variable/Mensual |
| 6 | Auto Laura Cuota | Egreso | Fijo/Mensual |
| 7 | Coop. Universitaria Clara | Egreso | Fijo/Mensual |
| 8 | Coomecipar Clara | Egreso | Fijo/Mensual |
| 9 | Solar Préstamo 1 | Egreso | Fijo/Mensual |
| 10 | Solar Préstamo 2 | Egreso | Fijo/Mensual |
| 11 | Show Congelador | Egreso | Fijo/Mensual |
| 12 | Pago Mínimo Tarj Crédito ITAU Clara | Egreso | Variable/Mensual |
| 13 | Pago Mínimo Tarj Crédito ITAU Marco | Egreso | Variable/Mensual |
| 14 | Pago Mínimo Tarj Crédito Solar Clara | Egreso | Variable/Mensual |
| 15 | Pago Mínimo Tarj Crédito Comecipar Clara | Egreso | Variable/Mensual |
| 16 | Reserva | - | - |
| 17 | Reserva | - | - |
| - | **SUBTOTAL CUOTAS Y PRÉSTAMOS** | - | - |

#### ► EGRESOS FAMILIA - OBLIGACIONES LEGALES
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Aporte IPS | Egreso | Fijo/Mensual |
| 2 | Aporte Cajubi | Egreso | Fijo/Mensual |
| 3 | Aporte STEIBI | Egreso | Fijo/Mensual |
| 4 | Aporte SICHAP | Egreso | Fijo/Mensual |
| 5 | Impuesto compra digital | Egreso | Variable/Mensual |
| 6 | Aporte y Solidaridad Coop. Univer. Clara | Egreso | Fijo/Mensual |
| 7 | Aporte y Solidaridad Coop. Univer. Marco | Egreso | Fijo/Mensual |
| 8 | Impuesto a la Renta personal | Egreso | Fijo/Anual |
| 9 | Impuesto del terreno casa | Egreso | Fijo/Anual |
| 10 | Reserva | - | - |
| 11 | Reserva | - | - |
| 12 | Reserva | - | - |
| - | **SUBTOTAL OBLIGACIONES LEGALES** | - | - |

#### ► EGRESOS FAMILIA - SUSCRIPCIONES
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Giganet | Egreso | Fijo/Mensual |
| 2 | Tigo Clara | Egreso | Fijo/Mensual |
| 3 | Tigo Familiar | Egreso | Fijo/Mensual |
| 4 | Google One | Egreso | Fijo/Mensual |
| 5 | ChatGPT | Egreso | Fijo/Mensual |
| 6 | Claude Marco | Egreso | Fijo/Mensual |
| 7 | Claude Clara | Egreso | Fijo/Mensual |
| 8 | Antivirus Clara (Anual) | Egreso | Fijo/Anual |
| 9 | Antivirus Marco (Anual) | Egreso | Fijo/Anual |
| 10 | Microsoft Office Clara (Anual) | Egreso | Fijo/Anual |
| 11 | Microsoft Office Marco (Anual) | Egreso | Fijo/Anual |
| 12 | PosterWall | Egreso | Fijo/Mensual |
| 13 | Canva (Anual) | Egreso | Fijo/Anual |
| 14 | Scribd | Egreso | Fijo/Mensual |
| 15 | iLovePDF | Egreso | Fijo/Mensual |
| 16 | Reserva | - | - |
| 17 | Reserva | - | - |
| 18 | Reserva | - | - |
| - | **SUBTOTAL SUSCRIPCIONES** | - | - |

#### ► EGRESOS FAMILIA - VARIABLES
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Supermercado | Egreso | Variable/Mensual |
| 2 | Combustible | Egreso | Variable/Mensual |
| 3 | Mantenimiento / Reparaciones Auto Clara | Egreso | Variable/Anual |
| 4 | Mantenimiento / Reparaciones Auto Niños | Egreso | Variable/Anual |
| 5 | Mantenimiento / Reparaciones Camioneta Marco | Egreso | Variable/Anual |
| 6 | Ropa/Vestidos | Egreso | Variable/Mensual |
| 7 | Recreación (Pizza, hamburguesa, helados, etc) | Egreso | Variable/Mensual |
| 8 | Salud y Medicamentos | Egreso | Variable/Mensual |
| 9 | Gastos no identificados | Egreso | Variable/Mensual |
| 10 | Reserva | - | - |
| 11 | Reserva | - | - |
| 12 | Reserva | - | - |
| - | **SUBTOTAL VARIABLES** | - | - |

#### ► EGRESO - AHORRO FAMILIA (desde CARGA_FAMILIA)
| # | Concepto | Tipo | Frecuencia | Origen |
|---|----------|------|------------|--------|
| 1 | Ahorro Clara | Egreso | Variable | CARGA_FAMILIA |
| 2 | Ahorro Marco | Egreso | Variable | CARGA_FAMILIA |
| 3 | Fondo de Emergencia | Egreso | Variable | CARGA_FAMILIA |
| - | **SUBTOTAL AHORROS** | - | - | - |

> **DECISIÓN [2026-01-04s]**: AHORRO se registra en CARGA_FAMILIA (no en GASTOS_FIJOS) porque es una transferencia que se hace cuando realmente hay dinero disponible. En MOVIMIENTO, EST.PAGO = "Ahorrado" (verde, fijo).

| - | **TOTAL EGRESOS FAMILIA** | - | - |
| - | **BALANCE FAMILIA (Ingresos - Egresos)** | - | - |

---

### 4.3 PRESUPUESTO NEUROTEA

#### ► INGRESOS NEUROTEA
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Aporte NeuroTEA Terapeutas | Ingreso | Variable/Mensual |
| 2 | Cursos NeuroTEA | Ingreso | Variable/Mensual |
| 3 | Otros | Ingreso | Variable/Mensual |
| 4 | Reserva | - | - |
| 5 | Reserva | - | - |
| 6 | Reserva | - | - |
| - | **TOTAL INGRESOS NEUROTEA** | - | - |

#### ► EGRESOS NT - CLÍNICA
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Alquiler 1 (Principal) | Egreso | Fijo/Mensual |
| 2 | Alquiler 2 (Secundario) | Egreso | Fijo/Mensual |
| 3 | ANDE clínica | Egreso | Variable/Mensual |
| 4 | Reserva | - | - |
| 5 | Reserva | - | - |
| 6 | Reserva | - | - |
| - | **TOTAL EGRESOS CLÍNICA** | - | - |

#### ► EGRESOS NT - SUELDOS Y HONORARIOS
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Sueldo Aracely | Egreso | Fijo/Mensual |
| 2 | Sueldo Fátima | Egreso | Fijo/Mensual |
| 3 | Limpieza NeuroTEA | Egreso | Variable/Mensual |
| 4 | Honorario Contador | Egreso | Fijo/Mensual |
| 5 | **Salario Administrador (Marco)** | Egreso | Fijo/Mensual |
| 6 | Honorario Mant. Sistema | Egreso | Fijo/Mensual |
| 7 | Reserva | - | - |
| 8 | Reserva | - | - |
| 9 | Reserva | - | - |
| - | **TOTAL SUELDOS Y HONORARIOS** | - | - |

**NOTA:** El "Salario Administrador" es lo que NT paga a Marco. Este mismo monto aparece como INGRESO en Familia bajo "Salario Marco NeuroTEA".

#### ► EGRESOS NT - TELEFONÍA E INTERNET
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Celular Tigo NeuroTEA | Egreso | Fijo/Mensual |
| 2 | Celular Tigo Sistema | Egreso | Fijo/Mensual |
| 3 | WhatsFlow | Egreso | Fijo/Mensual |
| 4 | Internet NeuroTEA | Egreso | Fijo/Mensual |
| 5 | Reserva | - | - |
| 6 | Reserva | - | - |
| 7 | Reserva | - | - |
| - | **TOTAL TELEFONÍA E INTERNET** | - | - |

#### ► EGRESOS NT - OBLIGACIONES LEGALES
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | IVA | Egreso | Variable/Mensual |
| 2 | IPS | Egreso | Fijo/Mensual |
| 3 | Ministerio de Salud | Egreso | Variable/Anual |
| 4 | Mora de Alquiler | Egreso | Variable/Mensual |
| 5 | Reserva | - | - |
| 6 | Reserva | - | - |
| 7 | Reserva | - | - |
| - | **TOTAL OBLIGACIONES LEGALES** | - | - |

#### ► EGRESOS NT - EVENTOS (Tratamiento Especial - Opción A con Reservas)
| # | Concepto | Mes Estimado | Tipo | Frecuencia | Presupuesto |
|---|----------|--------------|------|------------|-------------|
| 1 | Día del Autismo | Abril | Egreso | Variable/Anual | (definir) |
| 2 | San Juan | Junio | Egreso | Variable/Anual | (definir) |
| 3 | Día del Niño | Agosto | Egreso | Variable/Anual | (definir) |
| 4 | Clausura Padres | Noviembre | Egreso | Variable/Anual | (definir) |
| 5 | Navidad Papá Noel | Diciembre | Egreso | Variable/Anual | (definir) |
| 6 | Cena Fin de Año | Diciembre | Egreso | Variable/Anual | (definir) |
| 7 | Reserva 1 | (por definir) | Egreso | Variable/Anual | (definir) |
| 8 | Reserva 2 | (por definir) | Egreso | Variable/Anual | (definir) |
| 9 | Reserva 3 | (por definir) | Egreso | Variable/Anual | (definir) |
| 10 | Reserva 4 | (por definir) | Egreso | Variable/Anual | (definir) |
| 11 | Reserva 5 | (por definir) | Egreso | Variable/Anual | (definir) |
| 12 | Reserva 6 | (por definir) | Egreso | Variable/Anual | (definir) |
| 13 | Reserva 7 | (por definir) | Egreso | Variable/Anual | (definir) |
| 14 | Reserva 8 | (por definir) | Egreso | Variable/Anual | (definir) |
| 15 | Reserva 9 | (por definir) | Egreso | Variable/Anual | (definir) |
| 16 | Reserva 10 | (por definir) | Egreso | Variable/Anual | (definir) |
| - | **TOTAL GASTOS EVENTOS** | - | - | - | **SUMA** |

**SISTEMA DE EVENTOS (Opción A - Reservas Numeradas):**
- Cada evento tiene su **propio presupuesto individual**
- Los eventos definidos tienen **MES ESTIMADO** asignado
- Las **Reservas** son para eventos futuros no definidos aún
- Cuando definas un evento, **renombra la Reserva** al nombre real (Ej: "Reserva 3" → "Cumple Empleados")
- En **CARGA_NT** se registra cada gasto con el nombre específico del evento
- En **MOVIMIENTO** se compara: Presupuesto del evento vs Real gastado en ese evento
- El **TOTAL EVENTOS** permite ver si estás dentro del presupuesto global

#### ► EGRESOS NT - VARIABLES
| # | Concepto | Tipo | Frecuencia |
|---|----------|------|------------|
| 1 | Insumos y Papelería | Egreso | Variable/Mensual |
| 2 | Reparaciones Clínica | Egreso | Variable/Anual |
| 3 | Mantenimiento Aire | Egreso | Variable/Anual |
| 4 | Gastos Cursos | Egreso | Variable/Mensual |
| 5 | Gastos Varios Cumple (Tortas, bocaditos, meriendas) | Egreso | Variable/Mensual |
| 6 | Reserva | - | - |
| 7 | Reserva | - | - |
| 8 | Reserva | - | - |
| - | **TOTAL GASTOS VARIABLES** | - | - |

#### ► EGRESO - GANANCIA NEUROTEA (CALCULADO AUTOMÁTICAMENTE)
| # | Concepto | Tipo | Fórmula |
|---|----------|------|---------|
| 1 | Ganancia 7% | Calculado | = TOTAL INGRESOS NT - TOTAL EGRESOS NT (sin ganancia) |
| 2 | Utilidad al propietario | Calculado | = Ganancia × 33.33% |
| 3 | Fondo de emergencia | Calculado | = Ganancia × 33.33% |
| 4 | Fondo de Inversión | Calculado | = Ganancia × 33.33% |
| - | **TOTAL GANANCIA NEUROTEA** | - | - |

| - | **TOTAL EGRESOS NEUROTEA** | - | - |
| - | **BALANCE NEUROTEA (Ingresos - Egresos)** | - | - |
| - | **BALANCE TOTAL CONSOLIDADO FAM/NT** | - | - |

### 4.4 Semáforo de Ganancia NeuroTEA

| Condición | Color | Significado | Acción |
|-----------|-------|-------------|--------|
| Ganancia < 0 | 🔴 ROJO | Pérdida | Acción urgente requerida |
| 0% ≤ Ganancia < 7% | 🟡 AMARILLO | Por debajo de la meta | Revisar gastos |
| Ganancia ≥ 7% | 🟢 VERDE | Meta cumplida | Mantener el rumbo |

---

## 5. HOJA GASTOS_FIJOS - LISTA MAESTRA

### 5.1 Propósito
Centralizar **TODOS los gastos recurrentes** de FAMILIA y NEUROTEA:
- Gastos Fijos (mismo monto cada período)
- Gastos Variables Recurrentes (monto varía pero se repiten cada período)
- Monto BASE que se arrastra mes a mes
- Posibilidad de actualizar el monto en cualquier mes
- Día de vencimiento (DÍA) para cálculo de liquidez

**IMPORTANTE:** Si un gasto tiene frecuencia (Mensual o Anual), va en GASTOS_FIJOS.
Las hojas CARGA_FAMILIA y CARGA_NT son SOLO para **variables puros** (compras puntuales no recurrentes).

### 5.2 Estructura de la Hoja

```
| CONCEPTO | ENTIDAD | CATEGORÍA | FRECUENCIA | DÍA | CUENTA | BASE | ENE | FEB | MAR | ... | DIC |
```

| Columna | Descripción |
|---------|-------------|
| **CONCEPTO** | Nombre del gasto |
| **ENTIDAD** | FAMILIA o NEUROTEA |
| **CATEGORÍA** | Categoría del gasto (GASTOS FIJOS, CUOTAS, VARIABLES, etc.) |
| **FRECUENCIA** | Fijo/Mensual, Fijo/Anual, Variable/Mensual, Variable/Anual |
| **DÍA** | Día del mes en que vence (1-31) |
| **CUENTA** | Cuenta desde donde se paga (dropdown según ENTIDAD) |
| **BASE** | Monto base inicial |
| **ENE-DIC** | Celdas opcionales para sobrescribir el BASE |

> **DECISIÓN [2026-01-04q]**: Se agregó columna CUENTA para saber de qué cuenta se debita cada gasto fijo.

### 5.3 Tipos de Frecuencia en GASTOS_FIJOS

| Frecuencia | Descripción | Ejemplo | Comportamiento |
|------------|-------------|---------|----------------|
| **Fijo/Mensual** | Mismo monto cada mes | Alquiler, Salarios | BASE se copia cada mes |
| **Fijo/Anual** | Mismo monto una vez al año | Antivirus, Impuesto Renta | Solo el mes indicado |
| **Variable/Mensual** | Monto varía pero es cada mes | ANDE, Combustible estimado | BASE estimado, se actualiza cada mes |
| **Variable/Anual** | Monto varía, ocurre una vez | Mantenimiento Aire, Ministerio Salud | BASE estimado, se actualiza cuando ocurre |

### 5.4 Lógica de Actualización de Montos

**Regla Principal:** El sistema siempre usa el **VALOR MÁS RECIENTE** (último mes con dato hacia atrás).

**Gasto Cancelado:** Si un gasto se termina de pagar o ya no aplica, poner **0** en el siguiente mes. El 0 se arrastra hacia adelante.

```
ALGORITMO para obtener MONTO_EFECTIVO del mes M:

1. Buscar desde el mes M hacia atrás (M, M-1, M-2, ..., ENE)
2. SI encuentra un valor en algún mes → Usar ese valor
3. SI NO encuentra ningún valor → Usar BASE

Ejemplo:
BASE = 400.000
FEB = 500.000
MAY = 700.000

Resultado por mes:
- ENE: 400.000 (usa BASE, no hay valores previos)
- FEB: 500.000 (usa FEB)
- MAR: 500.000 (usa FEB, último valor)
- ABR: 500.000 (usa FEB, último valor)
- MAY: 700.000 (usa MAY)
- JUN: 700.000 (usa MAY, último valor)
- ... hasta DIC: 700.000

Ejemplo GASTO CANCELADO (Cuota que termina en Junio):
BASE = 800.000
JUL = 0

Resultado por mes:
- ENE a JUN: 800.000 (usa BASE)
- JUL: 0 (cuota terminó)
- AGO a DIC: 0 (se arrastra el 0)
```

### 5.5 Fórmula Sugerida para Google Sheets

Para la celda del mes de MARZO (columna I), por ejemplo:
```
=SI(I3<>""; I3; SI(H3<>""; H3; SI(G3<>""; G3; F3)))
```

O más elegante con BUSCAR:
```
=INDICE(F3:I3; MAX(SI(F3:I3<>""; COLUMNA(F3:I3)-COLUMNA(F3)+1)))
```

### 5.6 Diseño Visual - Separación FAMILIA / NEUROTEA

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    GASTOS FIJOS - LISTA MAESTRA                                  │
│  DIA = día del mes que vence. Si un mes está vacío, usa el MONTO BASE.          │
├─────────────────────────────────────────────────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓                    🟢 GASTOS FIJOS FAMILIA 🟢                          ▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CONCEPTO              │ENTIDAD │CATEGORÍA      │FREC    │DÍA│ BASE    │ENE│... │
├───────────────────────┼────────┼───────────────┼────────┼───┼─────────┼───┼────┤
│ Salario Lili          │FAMILIA │GASTOS FIJOS   │Fijo/Mes│ 5 │2.500.000│   │    │
│ Salario Laura         │FAMILIA │GASTOS FIJOS   │Fijo/Mes│ 5 │1.800.000│   │    │
│ Escuela Fabián/Brenda │FAMILIA │GASTOS FIJOS   │Fijo/Mes│10 │1.200.000│   │    │
│ Robótica Niños        │FAMILIA │GASTOS FIJOS   │Fijo/Mes│15 │  350.000│   │    │
│ Expensa Casa          │FAMILIA │GASTOS FIJOS   │Fijo/Mes│ 1 │  450.000│   │    │
│ ...                   │        │               │        │   │         │   │    │
├───────────────────────┼────────┼───────────────┼────────┼───┼─────────┼───┼────┤
│ Préstamo Lizzi        │FAMILIA │CUOTAS/PRÉST.  │Fijo/Mes│20 │  800.000│   │    │
│ Cajubi Marco          │FAMILIA │CUOTAS/PRÉST.  │Fijo/Mes│ 5 │  450.000│   │    │
│ Cuota ITAU            │FAMILIA │CUOTAS/PRÉST.  │Fijo/Mes│15 │1.500.000│   │    │
│ ...                   │        │               │        │   │         │   │    │
├───────────────────────┼────────┼───────────────┼────────┼───┼─────────┼───┼────┤
│ Giganet               │FAMILIA │SUSCRIPCIONES  │Fijo/Mes│ 1 │  180.000│   │    │
│ Tigo Familiar         │FAMILIA │SUSCRIPCIONES  │Fijo/Mes│28 │  250.000│   │    │
│ ChatGPT               │FAMILIA │SUSCRIPCIONES  │Fijo/Mes│15 │  120.000│   │    │
│ Claude Marco          │FAMILIA │SUSCRIPCIONES  │Fijo/Mes│15 │  120.000│   │    │
│ ...                   │        │               │        │   │         │   │    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓                    🔵 GASTOS FIJOS NEUROTEA 🔵                         ▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────────────────────────────────────────────────────────┤
│ CONCEPTO              │ENTIDAD │CATEGORÍA      │FREC    │DÍA│ BASE    │ENE│... │
├───────────────────────┼────────┼───────────────┼────────┼───┼─────────┼───┼────┤
│ Alquiler 1 (Principal)│NEUROTEA│CLÍNICA        │Fijo/Mes│ 5 │3.500.000│   │    │
│ Alquiler 2 (Secundar.)│NEUROTEA│CLÍNICA        │Fijo/Mes│ 5 │1.800.000│   │    │
│ ...                   │        │               │        │   │         │   │    │
├───────────────────────┼────────┼───────────────┼────────┼───┼─────────┼───┼────┤
│ Sueldo Aracely        │NEUROTEA│SUELDOS/HONOR. │Fijo/Mes│30 │2.800.000│   │    │
│ Sueldo Fátima         │NEUROTEA│SUELDOS/HONOR. │Fijo/Mes│30 │2.500.000│   │    │
│ Salario Admin (Marco) │NEUROTEA│SUELDOS/HONOR. │Fijo/Mes│30 │5.000.000│   │    │
│ Honorario Contador    │NEUROTEA│SUELDOS/HONOR. │Fijo/Mes│10 │  800.000│   │    │
│ ...                   │        │               │        │   │         │   │    │
├───────────────────────┼────────┼───────────────┼────────┼───┼─────────┼───┼────┤
│ Celular Tigo NT       │NEUROTEA│TELEFONÍA      │Fijo/Mes│28 │  150.000│   │    │
│ Internet NT           │NEUROTEA│TELEFONÍA      │Fijo/Mes│15 │  200.000│   │    │
│ WhatsFlow             │NEUROTEA│TELEFONÍA      │Fijo/Mes│15 │  180.000│   │    │
│ ...                   │        │               │        │   │         │   │    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.7 Colores para Diferenciación Visual

| Sección | Color Fondo | Color Texto | Código Hex Fondo |
|---------|-------------|-------------|------------------|
| Encabezado FAMILIA | Verde oscuro | Blanco | #166534 |
| Filas FAMILIA | Verde claro | Negro | #dcfce7 |
| Encabezado NEUROTEA | Azul oscuro | Blanco | #1e40af |
| Filas NEUROTEA | Azul claro | Negro | #dbeafe |
| Separador | Gris | - | #9ca3af |

### 5.8 Uso del DÍA de Vencimiento

El campo **DÍA** es crucial para:
1. **Cálculo de LIQUIDEZ 3 SEMANAS** - Determina en qué semana cae cada gasto
2. **Alertas de vencimiento** - Avisar cuando se acerca la fecha
3. **Ordenamiento** - Mostrar gastos en orden de vencimiento

```
Ejemplo de uso en LIQUIDEZ:
HOY = 3 de Enero

Gastos con DÍA entre 3-9 → SEMANA 1
Gastos con DÍA entre 10-16 → SEMANA 2
Gastos con DÍA entre 17-23 → SEMANA 3
```

### 5.9 Gastos Fijos Anuales

Para gastos que se pagan **una vez al año** (Ej: Antivirus, Impuesto Renta):
- FRECUENCIA = "Fijo/Anual"
- Solo se coloca valor en el MES que corresponde
- Los demás meses quedan vacíos (no se arrastran)

```
Ejemplo: Antivirus Clara (se paga en Marzo)

| CONCEPTO        | FREC       | BASE    | ENE | FEB | MAR     | ABR | ... |
|-----------------|------------|---------|-----|-----|---------|-----|-----|
| Antivirus Clara | Fijo/Anual | 350.000 |     |     | 350.000 |     |     |
```

### 5.10 Relación con Otras Hojas

```
GASTOS_FIJOS ─────┬────► MOVIMIENTO (columna REAL para gastos fijos)
                  │
                  ├────► LIQUIDEZ 3 SEMANAS (según DÍA VENC)
                  │
                  └────► PRESUPUESTO (validar que coincidan conceptos)
```

---

## 6. HOJA CARGA_FAMILIA - SISTEMA "ANTI-BURRO"

**IMPORTANTE:** Esta hoja es SOLO para **VARIABLES PUROS** (compras puntuales, no recurrentes).
- ✅ Supermercado (cada compra es diferente)
- ✅ Combustible (cada carga es diferente)
- ✅ Reparación inesperada
- ❌ ANDE (es Variable/Mensual → va en GASTOS_FIJOS)
- ❌ Alquiler (es Fijo/Mensual → va en GASTOS_FIJOS)

**Usuarios:** Marco y Clara cargan de forma **independiente**. Ambos tienen acceso completo.

### 6.1 Estructura de la Hoja
```
| FECHA | TIPO | CATEGORÍA | SUBCATEGORÍA | DESCRIPCIÓN | MONTO | CUENTA | ESTADO | NOTAS |
```

### 6.2 Lógica "Anti-Burro" (Validación Inteligente)

El sistema debe ser inteligente para evitar errores de carga:

#### Regla 1: TIPO determina si es INGRESO o EGRESO
```
SI TIPO está en lista de "TIPOS DE INGRESO FAMILIA":
   → Es un INGRESO
   → Columna CATEGORÍA se deshabilita o muestra "-"
   → Columna SUBCATEGORÍA se deshabilita o muestra "-"

SI TIPO = "Egreso Familiar":
   → Es un EGRESO
   → Columna CATEGORÍA se habilita (desplegable de categorías egreso)
   → Columna SUBCATEGORÍA depende de la CATEGORÍA elegida
```

#### Regla 2: CATEGORÍA determina SUBCATEGORÍA disponible
```
SI CATEGORÍA = "VARIABLES":
   → SUBCATEGORÍA muestra desplegable de Variables Familia
   (Supermercado, Combustible, Mantenimiento Auto, etc.)

SI CATEGORÍA = "GASTOS FIJOS", "CUOTAS Y PRÉSTAMOS", etc.:
   → SUBCATEGORÍA se deshabilita (los fijos no tienen subcategoría variable)
```

#### Regla 3: Validación de combinaciones inválidas

| TIPO | CATEGORÍA Válida | SUBCATEGORÍA Válida |
|------|------------------|---------------------|
| Salario Marco | - (deshabilitado) | - (deshabilitado) |
| Honorarios Clara | - (deshabilitado) | - (deshabilitado) |
| Préstamo NeuroTEA | - (deshabilitado) | - (deshabilitado) |
| Egreso Familiar | VARIABLES | Supermercado, Combustible, etc. |
| Egreso Familiar | GASTOS FIJOS | - (deshabilitado) |

### 6.3 Tipos de Ingreso Familia (Desplegable completo)
1. Salario Marco
2. **Salario Marco NeuroTEA**
3. Vacaciones Marco
4. Adelanto de Aguinaldo Marco
5. Saldo Aguinaldo Marco
6. Viático Marco
7. Animador Bíblico Marco
8. Tarjeta Gourmed
9. Contrato Colectivo Marco
10. PL Itaipu Marco
11. Honorarios Clara NeuroTEA
12. Préstamo NeuroTEA
13. Préstamo Otros Bancos

### 6.4 Tipo de Egreso Familia
- **Egreso Familiar** (único tipo que habilita CATEGORÍA y SUBCATEGORÍA)

### 6.5 Subcategorías Variables Familia (cuando CATEGORÍA = VARIABLES)
1. Supermercado
2. Combustible
3. Mantenimiento / Reparaciones Auto Clara
4. Mantenimiento / Reparaciones Auto Niños
5. Mantenimiento / Reparaciones Camioneta Marco
6. Ropa/Vestidos
7. Recreación
8. Salud y Medicamentos
9. Gastos no identificados
10. **Devolución Familia → NT** (para devolver préstamos a NeuroTEA)

### 6.6 Ejemplo de Carga Correcta

| FECHA | TIPO | CATEGORÍA | SUBCATEGORÍA | DESCRIPCIÓN | MONTO | CUENTA |
|-------|------|-----------|--------------|-------------|-------|--------|
| 02/01/26 | Salario Marco | - | - | Enero Itaipu | 8.500.000 | ITAU Marco |
| 02/01/26 | Salario Marco NeuroTEA | - | - | Enero Admin | 5.000.000 | ITAU Marco |
| 03/01/26 | Egreso Familiar | VARIABLES | Supermercado | Stock mensual | 450.000 | Efectivo |
| 05/01/26 | Egreso Familiar | VARIABLES | Combustible | Nafta | 200.000 | Tarjeta ITAU Marco |
| 10/01/26 | Egreso Familiar | VARIABLES | Devolución Familia → NT | Devuelvo préstamo | 500.000 | ITAU Marco |

### 6.7 Filtro por Mes
- Desplegable en celda fija que OCULTA filas de otros meses
- Muestra solo las transacciones del mes seleccionado
- Resumen automático al final: Total Ingresos | Total Egresos | Balance

---

## 7. HOJA CARGA_NT - SISTEMA "ANTI-BURRO" (v7.7)

**IMPORTANTE:** Esta hoja es para:
- **VARIABLES PUROS** (compras puntuales de la clínica)
- **INGRESOS** (aportes de terapeutas, cursos, devoluciones)

> **v7.7**: EVENTOS ya NO va en CARGA_NT. Ahora va en GASTOS_FIJOS porque son gastos PLANIFICADOS.

- ✅ Insumos (cada compra es diferente)
- ✅ Aporte Terapeutas (ingreso)
- ❌ Alquiler (es Fijo/Mensual → va en GASTOS_FIJOS)
- ❌ Sueldos (es Fijo/Mensual → va en GASTOS_FIJOS)
- ❌ **EVENTOS** (es Variable/Anual PLANIFICADO → va en GASTOS_FIJOS)

**Usuarios:** Marco y Clara cargan de forma **independiente**. Ambos tienen acceso completo.

### 7.1 Estructura de la Hoja
```
| FECHA | TIPO | CATEGORÍA | SUBCATEGORÍA/EVENTO | DESCRIPCIÓN | MONTO | CUENTA | ESTADO | NOTAS |
```

### 7.2 Lógica "Anti-Burro" para NeuroTEA

#### Regla 1: TIPO determina si es INGRESO o EGRESO
```
SI TIPO está en lista de "TIPOS DE INGRESO NT":
   → Es un INGRESO
   → CATEGORÍA se deshabilita
   → SUBCATEGORÍA se deshabilita

SI TIPO = "Egreso NT":
   → Es un EGRESO
   → CATEGORÍA se habilita (solo VARIABLES - v7.7)
   → SUBCATEGORÍA muestra lista de VARIABLES_NT
```

> **v7.7**: Se eliminaron del dropdown: CLÍNICA, SUELDOS, TELEFONÍA, OBLIGACIONES, EVENTOS
> Esas categorías van en GASTOS_FIJOS, no en CARGA_NT.

#### Regla 2: CATEGORÍA determina opciones de SUBCATEGORÍA

| CATEGORÍA | SUBCATEGORÍA disponible |
|-----------|------------------------|
| **VARIABLES** | Lista de variables (Insumos, Reparaciones, etc.) |

> **NOTA v7.7**: Las categorías CLÍNICA, SUELDOS, TELEFONÍA, OBLIGACIONES, EVENTOS
> ya no aparecen en el dropdown porque esos gastos se registran en GASTOS_FIJOS.

### 7.3 Tipos de Ingreso NT (Desplegable)
1. Aporte NeuroTEA Terapeutas
2. Cursos NeuroTEA
3. Otros
4. **Devolución Familia → NT** (cuando Familia devuelve préstamo)

### 7.4 Tipo de Egreso NT
- **Egreso NT** (único tipo que habilita CATEGORÍA y SUBCATEGORÍA)

### 7.5 ~~Subcategorías EVENTOS NT~~ (ELIMINADO en v7.7)

> **DEPRECADO**: EVENTOS ya no aparece en CARGA_NT.
> Ver sección 3.11 para lista de EVENTOS en GASTOS_FIJOS.
12. Reserva 6 (por definir)
13. Reserva 7 (por definir)
14. Reserva 8 (por definir)
15. Reserva 9 (por definir)
16. Reserva 10 (por definir)

**Nota:** Las Reservas se renombran cuando se define el evento real.

### 7.6 Subcategorías VARIABLES NT (cuando CATEGORÍA = VARIABLES)
1. Insumos y Papelería
2. Reparaciones Clínica
3. Mantenimiento Aire
4. Gastos Cursos
5. Gastos Varios Cumple
6. **Préstamo NT → Familia** (cuando NT presta dinero a Familia)

### 7.7 Ejemplo de Carga Correcta

| FECHA | TIPO | CATEGORÍA | SUBCATEGORÍA | DESCRIPCIÓN | MONTO | CUENTA |
|-------|------|-----------|--------------|-------------|-------|--------|
| 02/01/26 | Aporte NeuroTEA Terapeutas | - | - | Semana 1 | 6.000.000 | Atlas NT |
| 05/01/26 | Egreso NT | VARIABLES | Insumos y Papelería | Materiales | 150.000 | Caja Chica |
| 10/01/26 | Egreso NT | EVENTOS | Día del Autismo | Decoración | 200.000 | Atlas NT |
| 15/01/26 | Egreso NT | VARIABLES | Préstamo NT → Familia | Marco necesita | 3.000.000 | Atlas NT |
| 20/01/26 | Devolución Familia → NT | - | - | Marco devuelve | 500.000 | Atlas NT |

### 7.8 TRATAMIENTO ESPECIAL DE EVENTOS

**En CARGA_NT:**
- Se registra cada evento con su nombre específico (Día del Niño, San Juan, etc.)
- Cada registro tiene su monto individual

**En MOVIMIENTO:**
- Todos los eventos se agrupan en UNA SOLA LÍNEA llamada "EVENTOS"
- La columna REAL suma todos los eventos del mes
- La comparación es: PRESUPUESTO TOTAL EVENTOS vs REAL TOTAL EVENTOS
- NO se compara evento por evento

**Ejemplo:**
```
MOVIMIENTO - Junio 2026
| CONCEPTO | PRESUPUESTO | REAL | DIFERENCIA |
| EVENTOS  | 500.000     | 450.000 | +50.000 ✅ |

Donde REAL = Suma de:
- San Juan: 300.000
- Cumple empleado: 150.000
```

---

## 8. HOJA MOVIMIENTO - CONTROL MENSUAL

### 8.1 Estructura
- Selector de mes en celda fija
- Vista lado a lado: FAMILIA | NEUROTEA
- Columnas: CONCEPTO | TIPO | FRECUENCIA | PRESUPUESTO | REAL | DIFERENCIA | % | ESTADO

### 8.2 Lógica de Datos REAL

| Tipo de Gasto | Fuente del dato REAL |
|---------------|---------------------|
| Fijo/Mensual | GASTOS_FIJOS (columna del mes) |
| Fijo/Anual | GASTOS_FIJOS (columna del mes donde aplica) |
| Variable/Mensual | SUMA de CARGA_FAMILIA o CARGA_NT filtrado por mes y subcategoría |
| Variable/Anual | SUMA de CARGA_FAMILIA o CARGA_NT filtrado por mes y subcategoría |
| **EVENTOS (NT)** | SUMA de todos los registros con CATEGORÍA = "EVENTOS" del mes |

### 8.3 Estados y Contabilización (EST. PAGO como GATILLO)

**Principio fundamental:** El monto REAL siempre se muestra (viene de GASTOS_FIJOS o CARGA), pero el EST. PAGO controla DÓNDE se contabiliza.

#### EST. PAGO según origen del dato

| Origen | EST. PAGO | Editable | Razón |
|--------|-----------|----------|-------|
| **INGRESOS** (de CARGA) | "Recibido" | No (fijo) | Ya recibiste el dinero al cargarlo |
| **VARIABLES puros** (de CARGA) | "Pagado" | No (fijo) | Ya pagaste al cargarlo |
| **EVENTOS** (de CARGA) | "Pagado" | No (fijo) | Ya pagaste al cargarlo |
| **GASTOS_FIJOS** | "Pendiente" | Sí (dropdown) | Tú decides cuándo marcarlo como pagado |

#### Estados disponibles (solo para GASTOS_FIJOS)

| Estado | Comportamiento | En TABLERO |
|--------|---------------|------------|
| **Pendiente** | Monto visible pero NO contabilizado como pagado | Suma a "EGRESOS PENDIENTES" |
| **Pagado** | Monto contabilizado como efectivamente pagado | Suma a "EGRESOS PAGADOS" |
| **Cancelado** | Monto anulado, no cuenta para nada | No suma a ninguno |

**Flujo de trabajo para GASTOS_FIJOS:**
```
1. GASTOS_FIJOS tiene: Alquiler = 3.500.000 (BASE)
                              ↓
2. MOVIMIENTO trae automáticamente: REAL = 3.500.000, EST. PAGO = [Pendiente ▼]
                              ↓
3. Usuario paga el alquiler → cambia dropdown a "Pagado"
                              ↓
4. TABLERO recalcula:
   - EGRESOS PAGADOS += 3.500.000
   - EGRESOS PENDIENTES -= 3.500.000
   - DISPONIBLE = SALDO_INICIAL + INGRESOS - EGRESOS PAGADOS
```

**Flujo de trabajo para items de CARGA:**
```
1. Usuario carga "Supermercado 150.000" en CARGA_FAMILIA
                              ↓
2. MOVIMIENTO suma automáticamente: REAL = 150.000, EST. PAGO = "Pagado" (fijo)
                              ↓
3. TABLERO ya lo cuenta como EGRESOS PAGADOS (no hay acción manual)
```

**Fórmulas clave en TABLERO:**
```
EGRESOS_PAGADOS = SUMIFS(MOVIMIENTO!E:E, MOVIMIENTO!B:B, "Egreso", MOVIMIENTO!I:I, "Pagado")
EGRESOS_PENDIENTES = SUMIFS(MOVIMIENTO!E:E, MOVIMIENTO!B:B, "Egreso", MOVIMIENTO!I:I, "Pendiente")
DISPONIBLE = SALDO_INICIAL + INGRESOS - EGRESOS_PAGADOS
PROYECCIÓN = DISPONIBLE - EGRESOS_PENDIENTES
```

---

## 9. FLUJO DE DATOS COMPLETO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CONFIG                                          │
│  (Listas maestras, tipos, categorías, subcategorías, metas)                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
         ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
         │  CARGA_FAMILIA  │ │    CARGA_NT     │ │  GASTOS_FIJOS   │
         │  (Variables)    │ │  (Variables +   │ │  (Montos base   │
         │                 │ │   Eventos)      │ │   × 12 meses)   │
         └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
                  │                   │                   │
                  └───────────────────┼───────────────────┘
                                      │
                                      ▼
                           ┌─────────────────┐
                           │   PRESUPUESTO   │
                           │ (Plan anual)    │◄─── Comparación
                           └────────┬────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │   MOVIMIENTO    │
                           │ (Real vs Plan)  │
                           └────────┬────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
         ┌─────────────────┐ ┌─────────────────┐
         │    TABLERO      │ │    WEB APP      │
         │   (KPIs hoja)   │ │  (Dashboard)    │
         └─────────────────┘ └─────────────────┘
```

---

## 10. BALANCE CRUZADO NT ↔ FAMILIA

### 10.1 Registro de Préstamos

**Cuando NeuroTEA presta a Familia:**

| Hoja | TIPO | CATEGORÍA | SUBCATEGORÍA | Columna |
|------|------|-----------|--------------|---------|
| CARGA_NT | Egreso NT | VARIABLES | Préstamo NT → Familia | EGRESO |
| CARGA_FAMILIA | Préstamo NeuroTEA | - | - | INGRESO |

**Cuando Familia devuelve a NeuroTEA:**

| Hoja | TIPO | CATEGORÍA | SUBCATEGORÍA | Columna |
|------|------|-----------|--------------|---------|
| CARGA_FAMILIA | Egreso Familiar | VARIABLES | Devolución Familia → NT | EGRESO |
| CARGA_NT | Devolución Familia → NT | - | - | INGRESO |

### 10.2 Cálculo del Saldo Neto
```
PRÉSTAMOS NT→FAM = SUMA(CARGA_NT donde SUBCATEGORÍA = "Préstamo NT → Familia")
DEVOLUCIONES FAM→NT = SUMA(CARGA_NT donde TIPO = "Devolución Familia → NT")

SALDO NETO = PRÉSTAMOS NT→FAM - DEVOLUCIONES FAM→NT

SI SALDO > 0 → "NT SUBSIDIA A FAMILIA" (Familia debe a NT) 🔴
SI SALDO < 0 → "FAMILIA SUBSIDIA A NT" (NT debe a Familia) 🟡
SI SALDO = 0 → "FINANZAS EQUILIBRADAS" 🟢
```

### 10.3 Validación Anti-Burro COMPLETA (v6.8)

Sistema completo de validaciones para evitar incoherencias en la carga de datos.

#### 10.3.1 TIPO Ingreso → Bloquea CATEGORÍA y SUBCATEGORÍA
Si el TIPO seleccionado es un ingreso, las columnas CATEGORÍA y SUBCATEGORÍA se bloquean automáticamente con "-".

#### 10.3.2 Contradicciones TIPO vs SUBCATEGORÍA

| Contradicción | Explicación | Acción |
|---------------|-------------|--------|
| TIPO="Devolución NeuroTEA" + SUBCAT="Devolución Familia → NT" | Operaciones OPUESTAS | BLOQUEO |
| TIPO="Préstamo NeuroTEA" + SUBCAT="Préstamo Familia → NT" | Operaciones OPUESTAS | BLOQUEO |
| Cualquier TIPO ingreso + SUBCATEGORÍA de egreso | Incoherente | BLOQUEO |

#### 10.3.3 AHORRO y VARIABLES con subcategoría correcta

| CATEGORÍA | SUBCATEGORÍAS permitidas |
|-----------|-------------------------|
| AHORRO | Ahorro Clara, Ahorro Marco, Fondo de Emergencia |
| VARIABLES (FAM) | Supermercado, Combustible, Mantenimiento autos, etc. |
| VARIABLES (NT) | Insumos, Reparaciones, Mantenimiento Aire, etc. |

#### 10.3.4 Balance cruzado préstamos/devoluciones

**Regla de negocio**: No puedes prestar a quien ya te debe. Primero debe devolver.

| Entidad | Si DEBE a la otra | Si NO DEBE a la otra |
|---------|-------------------|----------------------|
| **FAMILIA** | ❌ Bloqueado "Préstamo Familia → NT" | ✅ Puede prestar |
|  | ✅ Solo puede "Devolución Familia → NT" | ❌ No puede devolver |
| **NEUROTEA** | ❌ Bloqueado "Préstamo NT → Familia" | ✅ Puede prestar |
|  | ✅ Solo puede "Devolución NT → Familia" | ❌ No puede devolver |

**Implementación técnica (Code.gs v6.8)**:
- `validarContradiccionTipoSubcategoriaFamilia()` / `validarContradiccionTipoSubcategoriaNT()`
- `calcularDeudaFamiliaANT()` / `calcularDeudaNTAFamilia()`
- `validarPrestamoDevolucionFamilia()` / `validarPrestamoDevolucionNT()`

---

## 11. HOJA LIQUIDEZ - CONTROL DE FLUJO DE CAJA (NUEVA)

### 11.1 Propósito
Hoja separada (8va hoja) que muestra en tiempo real:
- **Gastos ATRASADOS**: Vencieron y siguen pendientes
- **Gastos ESTA SEMANA**: Vencen en los próximos 7 días
- **Gastos PRÓXIMA SEMANA**: Vencen entre 8 y 14 días

Usa fórmulas con `TODAY()` que se actualizan automáticamente cada día.

### 11.2 Estructura de la Hoja LIQUIDEZ

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 LIQUIDEZ - CONTROL DE FLUJO DE CAJA                    [Auto: TODAY()]  │
│  Sincronizado con: MOVIMIENTO (mes actual)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ════════════════════════════════════════════════════════════════════════  │
│  🏠 FAMILIA                                              🏥 NEUROTEA       │
│  ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐
│  │ 🔴 ATRASADOS (vencidos, no pagados) │  │ 🔴 ATRASADOS                    │
│  ├─────────────────────────────────────┤  ├─────────────────────────────────┤
│  │ Concepto          │ DÍA │ Monto    │  │ Concepto          │ DÍA │ Monto │
│  │ Alquiler          │  5  │ 3.500.000│  │ Alquiler 1        │  5  │3.500.000│
│  │ Salario Lili      │  5  │ 2.500.000│  │ Sueldo Aracely    │  5  │2.800.000│
│  │ ─────────────────────────────────── │  │ ────────────────────────────────│
│  │ TOTAL ATRASADO:          6.000.000  │  │ TOTAL ATRASADO:         6.300.000│
│  │ Días máx. atraso:        5 días     │  │ Días máx. atraso:       5 días   │
│  └─────────────────────────────────────┘  └─────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐
│  │ 🟡 ESTA SEMANA (próx. 7 días)       │  │ 🟡 ESTA SEMANA                  │
│  ├─────────────────────────────────────┤  ├─────────────────────────────────┤
│  │ Concepto          │ DÍA │ Monto    │  │ Concepto          │ DÍA │ Monto │
│  │ Escuela Fabián    │ 10  │ 1.200.000│  │ Honorario Contador│ 10  │  800.000│
│  │ Coop. Univ. Clara │ 10  │   500.000│  │                   │     │        │
│  │ ─────────────────────────────────── │  │ ────────────────────────────────│
│  │ TOTAL ESTA SEMANA:       1.700.000  │  │ TOTAL ESTA SEMANA:        800.000│
│  └─────────────────────────────────────┘  └─────────────────────────────────┘
│                                                                             │
│  ┌─────────────────────────────────────┐  ┌─────────────────────────────────┐
│  │ 🟢 PRÓXIMA SEMANA (8-14 días)       │  │ 🟢 PRÓXIMA SEMANA               │
│  ├─────────────────────────────────────┤  ├─────────────────────────────────┤
│  │ Concepto          │ DÍA │ Monto    │  │ Concepto          │ DÍA │ Monto │
│  │ ANDE Casa         │ 15  │   450.000│  │ ANDE Clínica      │ 15  │  350.000│
│  │ Cuota ITAU        │ 15  │ 1.500.000│  │ IPS               │ 15  │  400.000│
│  │ ─────────────────────────────────── │  │ ────────────────────────────────│
│  │ TOTAL PRÓX. SEMANA:      1.950.000  │  │ TOTAL PRÓX. SEMANA:       750.000│
│  └─────────────────────────────────────┘  └─────────────────────────────────┘
│                                                                             │
│  ═══════════════════════════════════════════════════════════════════════   │
│  📊 RESUMEN DE LIQUIDEZ                                                    │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  │ Concepto              │ FAMILIA     │ NEUROTEA    │ CONSOLIDADO │       │
│  │ DISPONIBLE (hoy)      │  8.000.000  │  5.000.000  │  13.000.000 │       │
│  │ - Atrasados           │ -6.000.000  │ -6.300.000  │ -12.300.000 │       │
│  │ - Esta semana         │ -1.700.000  │   -800.000  │  -2.500.000 │       │
│  │ - Próxima semana      │ -1.950.000  │   -750.000  │  -2.700.000 │       │
│  │ ═══════════════════════════════════════════════════════════════════    │
│  │ SALDO PROYECTADO      │ -1.650.000🔴│ -2.850.000🔴│  -4.500.000 │       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Lógica de Clasificación por Fechas

```
HOY = DAY(TODAY())  // Ej: si hoy es 10 de enero, HOY = 10

Para cada gasto en MOVIMIENTO donde EST.PAGO = "Pendiente":
  - DÍA viene de GASTOS_FIJOS (columna E)

  SI DÍA < HOY:
    → ATRASADO (venció y no se pagó)
    → Días de atraso = HOY - DÍA

  SI DÍA >= HOY Y DÍA <= HOY + 7:
    → ESTA SEMANA (vence pronto)
    → Días para vencer = DÍA - HOY

  SI DÍA > HOY + 7 Y DÍA <= HOY + 14:
    → PRÓXIMA SEMANA
    → Días para vencer = DÍA - HOY

  SI DÍA > HOY + 14:
    → MÁS ADELANTE (no se muestra en detalle)
```

### 11.4 Fórmulas Clave para Google Sheets

```
// Celda que obtiene el día actual del mes
HOY = DAY(TODAY())

// ATRASADOS FAMILIA (DÍA < HOY y EST.PAGO = "Pendiente")
=SUMPRODUCT(
  (MOVIMIENTO!$I$9:$I$70="Pendiente")*
  (GASTOS_FIJOS!$E$4:$E$100<DAY(TODAY()))*
  (MOVIMIENTO!$E$9:$E$70)
)

// ESTA SEMANA FAMILIA (DÍA entre HOY y HOY+7)
=SUMPRODUCT(
  (MOVIMIENTO!$I$9:$I$70="Pendiente")*
  (GASTOS_FIJOS!$E$4:$E$100>=DAY(TODAY()))*
  (GASTOS_FIJOS!$E$4:$E$100<=DAY(TODAY())+7)*
  (MOVIMIENTO!$E$9:$E$70)
)

// PRÓXIMA SEMANA FAMILIA (DÍA entre HOY+8 y HOY+14)
=SUMPRODUCT(
  (MOVIMIENTO!$I$9:$I$70="Pendiente")*
  (GASTOS_FIJOS!$E$4:$E$100>DAY(TODAY())+7)*
  (GASTOS_FIJOS!$E$4:$E$100<=DAY(TODAY())+14)*
  (MOVIMIENTO!$E$9:$E$70)
)
```

### 11.5 Semáforo de Alertas

| Sección | Condición | Color | Acción |
|---------|-----------|-------|--------|
| **ATRASADOS** | Total > 0 | 🔴 ROJO | ¡Pagar urgente! |
| **ESTA SEMANA** | Saldo proyectado < 0 | 🟡 AMARILLO | Buscar fondos |
| **PRÓXIMA SEMANA** | Saldo proyectado < 0 | 🟠 NARANJA | Planificar |
| **SALDO FINAL** | >= 0 | 🟢 VERDE | OK |

### 11.6 Relación con otras hojas

```
GASTOS_FIJOS ────► DÍA de vencimiento
      │
      ▼
MOVIMIENTO ──────► EST.PAGO (Pendiente/Pagado) + REAL (monto)
      │
      ▼
LIQUIDEZ ────────► Agrupa por fecha relativa a TODAY()
      │
      ▼
TABLERO ─────────► Resumen: Total Atrasados, Total Esta Semana
```

### 11.7 Notas Importantes

- **Se actualiza sola**: Las fórmulas con TODAY() recalculan automáticamente cada día
- **Solo gastos con DÍA**: Los variables puros (Supermercado, Combustible) no tienen DÍA, no aparecen aquí
- **Fin de mes especial**: Si HOY = 28 y DÍA = 5, técnicamente el día 5 del próximo mes está a 7 días, pero la fórmula simple no lo detecta. Solución: El mes cambia en MOVIMIENTO, reiniciando el ciclo.
- **Separación FAM/NT**: Cada entidad tiene su propia sección de liquidez

---

## 12. SALDOS EN CUENTAS Y SALDO INICIAL

### 12.0 SALDO INICIAL DEL MES (Manual)

**Propósito:** Al cambiar de mes, el usuario ingresa manualmente el saldo que quedó del mes anterior. Esto permite:
- Iniciar cada mes con el contexto correcto
- Ver histórico de cómo cerró cada mes
- No depender de fórmulas complejas de arrastre automático

**Ubicación:** Sección editable en TABLERO, arriba del resumen

```
┌─────────────────────────────────────────────────────────────────┐
│  📅 SALDO INICIAL DEL MES (editable)                            │
├─────────────────────────────────────────────────────────────────┤
│  🏠 FAMILIA:     [____________] Gs.    ✏️                       │
│  🏥 NEUROTEA:    [____________] Gs.    ✏️                       │
└─────────────────────────────────────────────────────────────────┘
```

**Flujo de cierre de mes:**
```
1. Estás en ENERO, cerró con saldo FAMILIA = 3.000.000
2. Cambias el selector de MOVIMIENTO a FEBRERO
3. En TABLERO, ingresas SALDO INICIAL FAMILIA = 3.000.000
4. Los cálculos de FEBRERO usan ese saldo como punto de partida

DISPONIBLE = SALDO_INICIAL + INGRESOS_MES - EGRESOS_PAGADOS
```

**Fórmula en TABLERO:**
```
// Celda DISPONIBLE FAMILIA
=B_SALDO_INICIAL + SUMIF(MOVIMIENTO!B:B,"Ingreso",MOVIMIENTO!E:E) - SUMIF(MOVIMIENTO!I:I,"Pagado",MOVIMIENTO!E:E)
```

### 12.1 Propósito - Conciliación Bancaria
Comparar el saldo CALCULADO (según los movimientos cargados) con el saldo REAL (lo que se ve en la app del banco). La diferencia revela gastos no registrados o errores de carga.

### 12.2 Tipos de Saldo

| Tipo | Fuente | Descripción |
|------|--------|-------------|
| **ESPERADO** | Calculado | Saldo inicial + Ingresos a cuenta - Egresos de cuenta |
| **SALDO BANCO** | Manual | Lo que el usuario ve en la app del banco (antes "Real") |
| **DIFERENCIA** | Calculado | SALDO BANCO - ESPERADO |

> **DECISIÓN [2026-01-04r]**: Se renombró "Real" a "Saldo Banco" para evitar confusión con la columna REAL de MOVIMIENTO.

### 12.3 Estructura de la Sección

```
| CUENTA | SALDO INICIAL | INGRESOS | EGRESOS | ESPERADO | SALDO BANCO ✏️ | DIFERENCIA | ESTADO |
```

### 12.4 Cálculo del Saldo ESPERADO

Para cada cuenta (Ej: "ITAU Marco"):
```
SALDO_INICIAL = Valor configurado al inicio del mes (o arrastrado del mes anterior)

INGRESOS_CUENTA = Suma de todos los registros en CARGA_FAMILIA donde:
  - CUENTA = "ITAU Marco"
  - TIPO está en lista de ingresos

EGRESOS_CUENTA = Suma de todos los registros en CARGA_FAMILIA donde:
  - CUENTA = "ITAU Marco"
  - TIPO = "Egreso Familiar"
  - ESTADO = "Pagado"

SALDO_ESPERADO = SALDO_INICIAL + INGRESOS_CUENTA - EGRESOS_CUENTA
```

### 12.5 Ingreso del Saldo REAL

- El usuario ingresa MANUALMENTE el saldo que ve en la app del banco
- Se recomienda actualizar al menos 1 vez por semana
- Campo editable en TABLERO o sección dedicada

### 12.6 Interpretación de la DIFERENCIA

| Diferencia | Significado | Acción |
|------------|-------------|--------|
| DIFERENCIA = 0 | ✅ Perfecto | Registros completos y correctos |
| DIFERENCIA > 0 (REAL > ESPERADO) | 🟢 Hay más dinero del esperado | Posible ingreso no registrado |
| DIFERENCIA < 0 (REAL < ESPERADO) | 🔴 Hay menos dinero del esperado | Posible gasto no registrado |

### 12.7 Ejemplo Práctico

```
CUENTA: ITAU Marco - Enero 2026

Saldo Inicial (01/01):     Gs. 500.000
+ Salario Marco:           Gs. 8.500.000
+ Salario Marco NT:        Gs. 5.000.000
- Cuota ITAU:              Gs. 1.200.000
- Nafta:                   Gs. 300.000
─────────────────────────────────────────
SALDO ESPERADO:            Gs. 12.500.000

SALDO REAL (app banco):    Gs. 12.150.000

DIFERENCIA:                Gs. -350.000 🔴

→ Interpretación: Hay Gs. 350.000 de gastos NO registrados
→ Acción: Revisar extracto bancario y cargar los gastos faltantes
```

### 12.8 Visualización en Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONCILIACIÓN BANCARIA - FAMILIA                          [Enero 2026]     │
├─────────────────┬────────────┬──────────────┬────────────┬─────────────────┤
│     CUENTA      │  ESPERADO  │ SALDO BANCO  │ DIFERENCIA │     ESTADO      │
├─────────────────┼────────────┼──────────────┼────────────┼─────────────────┤
│ ITAU Marco      │ 12.500.000 │  12.150.000  │  -350.000  │ 🔴 Revisar      │
│ Coop. Univ.     │  2.300.000 │   2.300.000  │      0     │ ✅ OK           │
│ ITAU Clara      │  1.800.000 │   1.850.000  │   +50.000  │ 🟢 Ingreso?     │
│ Efectivo        │    400.000 │     350.000  │   -50.000  │ 🟡 Menor        │
├─────────────────┼────────────┼──────────────┼────────────┼─────────────────┤
│ **TOTAL**       │ 17.000.000 │  16.650.000  │  -350.000  │                 │
└─────────────────┴────────────┴──────────────┴────────────┴─────────────────┘
```

### 12.9 Frecuencia de Actualización Recomendada
- **Semanal:** Actualizar SALDO BANCO de cuentas principales (ITAU, Coop)
- **Quincenal:** Actualizar tarjetas de crédito
- **Fin de mes:** Conciliación completa de todas las cuentas

---

## 13. COLORES DEL SISTEMA

| Uso | Color | Código Hex |
|-----|-------|------------|
| Familia (principal) | Verde esmeralda | #059669 |
| Familia (fondo claro) | Verde pastel | #dcfce7 |
| NeuroTEA (principal) | Azul intenso | #1d4ed8 |
| NeuroTEA (fondo claro) | Azul pastel | #dbeafe |
| Balance Cruzado | Púrpura | #7c3aed |
| Alerta/Pérdida | Rojo | #dc2626 |
| Advertencia | Amarillo/Naranja | #f59e0b |
| Cumplimiento/OK | Verde claro | #22c55e |
| Textos | Gris oscuro | #1f2937 |
| Fondos | Gris muy claro | #f3f4f6 |

---

## 14. RESUMEN DE CAMBIOS POR VERSIÓN

### Versión 2.0
| # | Corrección | Estado |
|---|------------|--------|
| 1 | Agregado "Salario Marco NeuroTEA" en TIPOS INGRESO FAM | ✅ |
| 2 | Agregado "Tarjeta ITAU Marco" en CUENTAS FAMILIA | ✅ |
| 3 | Detalladas SUBCATEGORÍAS VARIABLES FAMILIA | ✅ |
| 4 | Detalladas SUBCATEGORÍAS VARIABLES NT | ✅ |
| 5 | Detalladas SUBCATEGORÍAS EVENTOS NT | ✅ |
| 6 | Presupuesto completo con todas las Reservas | ✅ |
| 7 | Lógica "Anti-Burro" documentada para CARGA_FAMILIA | ✅ |
| 8 | Lógica "Anti-Burro" documentada para CARGA_NT | ✅ |
| 9 | Tratamiento especial de EVENTOS documentado | ✅ |
| 10 | Relación Salario Administrador NT ↔ Ingreso Marco explicada | ✅ |

### Versión 2.1
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 11 | Nueva sección LIQUIDEZ 3 SEMANAS con cálculo detallado | ✅ |
| 12 | Nueva sección SALDOS EN CUENTAS (Esperado vs Real) | ✅ |
| 13 | Aclaración: Flujo de Honorarios Clara (aportes vienen NETOS) | ✅ |
| 14 | Aclaración: Fondos NT son VIRTUALES (no cuentas bancarias) | ✅ |
| 15 | Visualizaciones de dashboard para Liquidez y Conciliación | ✅ |

### Versión 2.2
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 16 | Nueva sección GASTOS_FIJOS completa con estructura y lógica | ✅ |
| 17 | Lógica de arrastre de monto BASE (último valor prevalece) | ✅ |
| 18 | Diseño visual con separación clara FAMILIA / NEUROTEA | ✅ |
| 19 | Columna DÍA VENC para cálculo de liquidez | ✅ |
| 20 | Fórmulas sugeridas para Google Sheets | ✅ |
| 21 | Tratamiento de gastos fijos anuales | ✅ |

### Versión 2.3
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 22 | Variable/Mensual y Variable/Anual van en GASTOS_FIJOS (no en CARGA) | ✅ |
| 23 | CARGA_FAMILIA y CARGA_NT son SOLO para variables PUROS | ✅ |
| 24 | Lógica de gasto cancelado: poner 0, se arrastra | ✅ |
| 25 | EVENTOS con 10 Reservas numeradas (Opción A) | ✅ |
| 26 | Cada evento tiene presupuesto individual | ✅ |
| 27 | Clara también carga variables (acceso independiente) | ✅ |
| 28 | Ejemplos de qué va en CARGA vs GASTOS_FIJOS | ✅ |

### Versión 2.4
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 29 | **EST. PAGO como GATILLO**: El dropdown controla si un gasto se suma a PAGADOS o PENDIENTES | ✅ |
| 30 | **Separación PAGADOS vs PENDIENTES**: TABLERO muestra ambos por separado | ✅ |
| 31 | **Nueva hoja LIQUIDEZ (8va hoja)**: Atrasados, Esta Semana, Próxima Semana con TODAY() | ✅ |
| 32 | **SALDO_INICIAL manual**: Usuario carga saldo del mes anterior al cambiar de mes | ✅ |
| 33 | **Fórmula DISPONIBLE**: = SALDO_INICIAL + INGRESOS - EGRESOS_PAGADOS | ✅ |
| 34 | **Colores corregidos**: Verde/Rojo según contexto (ingreso = + verde, egreso = - verde) | ✅ |
| 35 | WEB APP ya no es hoja, es popup HTML. LIQUIDEZ es la 8va hoja | ✅ |

### Versión 2.5
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 36 | **EST.PAGO diferenciado**: Items de CARGA = fijo ("Recibido"/"Pagado"), GASTOS_FIJOS = dropdown | ✅ |
| 37 | **Cuentas NT corregidas**: Solo 2 cuentas (Atlas NeuroTEA, UENO Marco) | ✅ |
| 38 | **SALDOS NT**: Columnas Esperado (automático) y Saldo Banco ✏️ (manual) | ✅ |
| 39 | **Selector mes**: Aviso en TABLERO que el mes se selecciona en MOVIMIENTO | ✅ |

### Versión 2.6
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 40 | **CUENTA en GASTOS_FIJOS**: Nueva columna F para indicar de qué cuenta se debita | ✅ |
| 41 | **"Saldo Banco" en TABLERO**: Renombrado de "Real" a "Saldo Banco" para evitar confusión | ✅ |
| 42 | **AHORRO desde CARGA_FAMILIA**: AHORRO ya no está en GASTOS_FIJOS, se carga cuando se ahorra | ✅ |
| 43 | **Fondo de Emergencia FAM**: Agregado como 3er item de ahorro familiar | ✅ |
| 44 | **EST.PAGO = "Ahorrado"**: AHORRO tiene estado fijo verde, no es "Pendiente" | ✅ |
| 45 | **PRESUPUESTO con cálculos**: Subtotales, totales, ganancia NT, % y semáforo automáticos | ✅ |
| 46 | **Meta NT desde CONFIG**: El 7% de ganancia lee de METAS_NT.GANANCIA_MINIMA_PCT | ✅ |
| 47 | **Balance Consolidado**: PRESUPUESTO muestra balance FAM + NT total | ✅ |

### Versión 2.7
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 48 | **GASTOS_FIJOS sin BASE**: Cada mes tiene su valor directo (G-R = ENE-DIC) | ✅ |
| 49 | **Estilo sobrio profesional**: Headers gris neutro, colores solo para estados | ✅ |
| 50 | **LIQUIDEZ rediseñada**: 3 tarjetas grandes (Saldo, Pendiente, ¿Alcanza?) | ✅ |
| 51 | **Préstamos bidireccionales**: FAM↔NT en ambas direcciones | ✅ |
| 52 | **GANANCIA consistente**: TABLERO usa misma fórmula que MOVIMIENTO | ✅ |

### Versión 3.0
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 53 | **Rangos NEUROTEA corregidos**: 119-200 (antes 73-150 incluía FAMILIA) | ✅ |
| 54 | **AHORRO separado de GASTOS**: "GASTOS OPERATIVOS" sin incluir ahorro | ✅ |
| 55 | **PATRIMONIO FAMILIA**: Nuevo indicador = INGRESOS - GASTOS (incl. ahorros) | ✅ |
| 56 | **Columnas ocultas L/M**: CATEGORÍA y ENTIDAD en MOVIMIENTO para filtros | ✅ |
| 57 | **% GASTOS POR CATEGORÍA**: Funciona con SUMIFS en lugar de SUMPRODUCT | ✅ |

### Versión 3.1
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 58 | **Validación Anti-Burro Préstamos**: No puedes prestar a quien ya te debe | ✅ |
| 59 | **Bloqueo en CARGA_FAMILIA**: Si FAM debe a NT, bloqueado "Préstamo Familia → NT" | ✅ |
| 60 | **Bloqueo en CARGA_NT**: Si NT debe a FAM, bloqueado "Préstamo NT → Familia" | ✅ |
| 61 | **Alertas explicativas**: Mensaje indica cuánto se debe y qué acción usar | ✅ |

### Versión 3.2
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 62 | **TIPO Ingreso bloquea CATEGORÍA**: Si TIPO es ingreso, CATEGORÍA y SUBCATEGORÍA = "-" | ✅ |
| 63 | **Contradicciones TIPO vs SUBCATEGORÍA**: Detecta operaciones opuestas | ✅ |
| 64 | **AHORRO con subcategoría correcta**: Solo permite Ahorro Clara/Marco/Fondo Emergencia | ✅ |
| 65 | **VARIABLES con subcategoría correcta**: Valida pertenencia a lista correcta | ✅ |
| 66 | **EVENTOS con subcategoría correcta**: Valida pertenencia a lista de eventos | ✅ |

### Versión 3.3 (Actual)
| # | Adición/Aclaración | Estado |
|---|-------------------|--------|
| 67 | **Saldos iniciales por cuenta**: Cada cuenta tiene saldo editable por mes en CONFIG (FAMILIA: filas 65-74, NT: filas 79-80) | ✅ |
| 68 | **Saldos globales automáticos**: SALDOS POR MES = SUM(saldos por cuenta), no editables | ✅ |
| 69 | **DISPONIBLE = SUM(Esperado)**: Coherencia garantizada entre cuentas individuales y total | ✅ |
| 70 | **FIX: AHORRO resta en Esperado**: Corregido bug donde AHORRO sumaba en vez de restar | ✅ |
| 71 | **Renombrado "Caja Chica NT" → "UENO Marco"**: Refleja uso real de cuenta compartida | ✅ |
| 72 | **Auto-creación transacciones cruzadas**: Préstamos/devoluciones FAM↔NT se crean en ambas hojas | ✅ |

---

## 15. RANGOS DE FILAS EN MOVIMIENTO

**CRÍTICO**: Las fórmulas de TABLERO deben usar los rangos correctos.

| Entidad | Rango de Filas | Secciones incluidas |
|---------|----------------|---------------------|
| **FAMILIA** | 9-113 | Ingresos, Gastos Fijos, Cuotas, Obligaciones, Suscripciones, Variables, Ahorro |
| **NEUROTEA** | 119-200 | Ingresos, Clínica, Sueldos, Telefonía, Obligaciones, Eventos, Variables |

> **ADVERTENCIA**: El rango 73-150 es INCORRECTO para NEUROTEA - incluye SUSCRIPCIONES de FAMILIA.

---

## 16. AHORRO vs GASTOS (Tratamiento Conceptual)

| Concepto | Descripción | Cómo afecta |
|----------|-------------|-------------|
| **GASTOS OPERATIVOS** | Gastos reales (EST.PAGO = "Pagado") | Reduce DISPONIBLE |
| **AHORRO** | Transferencia a cuenta ahorro (EST.PAGO = "Ahorrado") | Reduce DISPONIBLE pero NO es gasto |
| **DISPONIBLE** | INGRESOS - GASTOS - AHORRO | Dinero para más gastos/ahorro |
| **PATRIMONIO FAMILIA** | INGRESOS - GASTOS (sin restar ahorro) | Total de activos de FAMILIA |

---

## 17. NOTAS TÉCNICAS IMPLEMENTADAS

1. **Locale español (es-PY)**: Separador decimal `,` y argumentos `;`
2. **SUMPRODUCT vs SUMIFS**: SUMPRODUCT para filtros con MONTH()/YEAR()
3. **IFERROR en todas las fórmulas**: Evita errores #VALUE! con datos vacíos
4. **Fondos NT virtuales**: Son asignaciones contables, no cuentas bancarias
5. **EST.PAGO como gatillo**: Solo items "Pagado" suman a GASTOS, "Ahorrado" suma a AHORRO

---

*Documento actualizado el 19 de enero de 2026*
*Versión: 3.3 - Saldos por cuenta, DISPONIBLE = SUM(Esperado), AHORRO corregido*
