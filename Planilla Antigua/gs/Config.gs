/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CONFIG.GS - DATOS MAESTROS Y CONFIGURACIÓN
 * Sistema de Control Financiero 2026 - NeuroTEA & Familia
 * Versión 7.30 - Dashboard v3.0: Chart.js + dashboards separados FAMILIA/NEUROTEA
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTES GLOBALES
// ═══════════════════════════════════════════════════════════════════════════════

const VERSION = '8.5';
const AÑO = 2026;

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_CORTOS = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

// ═══════════════════════════════════════════════════════════════════════════════
// PALETA DE COLORES PROFESIONAL
// ═══════════════════════════════════════════════════════════════════════════════

const COLORES = {
  // ═══════════════════════════════════════════════════════════════════
  // ESTILO SOBRIO PROFESIONAL - Headers neutros, colores solo estados
  // ═══════════════════════════════════════════════════════════════════

  // HEADERS (Gris neutro para todas las entidades)
  FAM_HEADER: '#1f2937',      // Gris oscuro (sobrio)
  FAM_HEADER_LIGHT: '#374151', // Gris medio
  FAM_FONDO: '#f9fafb',       // Gris muy claro
  FAM_FONDO_ALT: '#ffffff',   // Blanco
  FAM_SUBTOTAL: '#e5e7eb',    // Gris claro
  FAM_BORDER: '#d1d5db',      // Gris borde

  NT_HEADER: '#1f2937',       // Gris oscuro (sobrio)
  NT_HEADER_LIGHT: '#374151', // Gris medio
  NT_FONDO: '#f9fafb',        // Gris muy claro
  NT_FONDO_ALT: '#ffffff',    // Blanco
  NT_SUBTOTAL: '#e5e7eb',     // Gris claro
  NT_BORDER: '#d1d5db',       // Gris borde

  // BALANCE CRUZADO (mismo estilo sobrio)
  BALANCE_HEADER: '#1f2937',  // Gris oscuro
  BALANCE_FONDO: '#f3f4f6',   // Gris claro
  BALANCE_SUBTOTAL: '#e5e7eb', // Gris pastel

  // ESTADOS / SEMÁFORO (colores SOLO para estados)
  VERDE: '#22c55e',           // OK / Cumplido
  VERDE_FONDO: '#dcfce7',
  AMARILLO: '#f59e0b',        // Advertencia
  AMARILLO_FONDO: '#fef3c7',
  ROJO: '#dc2626',            // Alerta / Déficit
  ROJO_FONDO: '#fee2e2',

  // INDICADORES DE ESTADO
  INGRESO_COLOR: '#3b82f6',   // Azul para ingresos
  INGRESO_FONDO: '#dbeafe',
  PAGADO_COLOR: '#22c55e',    // Verde para pagado
  PAGADO_FONDO: '#dcfce7',
  PENDIENTE_COLOR: '#f59e0b', // Naranja para pendiente
  PENDIENTE_FONDO: '#fef3c7',

  // NEUTROS
  HEADER_DARK: '#1f2937',     // Gris muy oscuro
  TEXTO: '#374151',           // Gris oscuro
  TEXTO_CLARO: '#6b7280',     // Gris medio
  GRIS_FONDO: '#f3f4f6',      // Gris muy claro
  GRIS_BORDE: '#e5e7eb',      // Gris borde
  BLANCO: '#ffffff',

  // ESPECIALES (para indicadores financieros)
  INGRESO: '#3b82f6',         // Azul para ingresos
  EGRESO: '#ef4444',          // Rojo para egresos
  GANANCIA: '#22c55e',        // Verde para ganancia
  GANANCIA_FONDO: '#dcfce7'   // Verde claro
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE LISTAS MAESTRAS
// ═══════════════════════════════════════════════════════════════════════════════

const ENTIDADES = ['FAMILIA', 'NEUROTEA'];
const FRECUENCIAS = ['Fijo/Mensual', 'Fijo/Anual', 'Variable/Mensual', 'Variable/Anual'];
const ESTADOS = ['Pendiente', 'Pagado', 'Cancelado'];

// ═══════════════════════════════════════════════════════════════════════════════
// CUENTAS
// ═══════════════════════════════════════════════════════════════════════════════

const CUENTAS_FAMILIA = [
  'ITAU Marco',
  'Coop. Univ. Marco',
  'ITAU Clara',
  'UENO Clara',
  'Tarjeta Solar Clara',
  'Tarjeta ITAU Clara',
  'Tarjeta ITAU Marco',
  'Tarjeta Comecipar Clara',
  'Gourmed',
  'Efectivo'
];

const CUENTAS_NT = [
  'Atlas NeuroTEA',
  'UENO Marco'  // v7.4: Cambiado de 'Caja Chica NT' para uso compartido
];

// ═══════════════════════════════════════════════════════════════════════════════
// TIPOS DE INGRESO
// v7.14: Separados en DROPDOWN (para usuario) y AUTOCREADOS (sistema)
// ═══════════════════════════════════════════════════════════════════════════════

// FAMILIA - Tipos para DROPDOWN (lo que el usuario ve y puede seleccionar)
const TIPOS_INGRESO_FAMILIA = [
  'Salario Marco',
  'Salario Marco NeuroTEA',
  'Vacaciones Marco',
  'Adelanto de Aguinaldo Marco',
  'Saldo Aguinaldo Marco',
  'Viático Marco',
  'Animador Bíblico Marco',
  'Tarjeta Gourmed',
  'Contrato Colectivo Marco',
  'PL Itaipu Marco',
  'Honorarios Clara NeuroTEA',
  'Préstamo Otros Bancos'
  // v7.15: SIN préstamos/devoluciones - el usuario registra como EGRESO
];

// FAMILIA - Tipos que el sistema auto-crea (NO aparecen en dropdown)
const TIPOS_INGRESO_FAMILIA_AUTOCREADOS = [
  'Préstamo NeuroTEA',
  'Devolución NeuroTEA'
];

// TODOS los tipos válidos (para validaciones en Code.gs)
const TODOS_TIPOS_INGRESO_FAMILIA = [...TIPOS_INGRESO_FAMILIA, ...TIPOS_INGRESO_FAMILIA_AUTOCREADOS];

// NEUROTEA - Tipos para DROPDOWN (lo que el usuario ve y puede seleccionar)
const TIPOS_INGRESO_NT = [
  'Aporte NeuroTEA Terapeutas',
  'Cursos NeuroTEA',
  'Otros'
  // v7.15: SIN préstamos/devoluciones - el usuario registra como EGRESO
];

// NEUROTEA - Tipos que el sistema auto-crea (NO aparecen en dropdown)
const TIPOS_INGRESO_NT_AUTOCREADOS = [
  'Préstamo Familia',
  'Devolución Familia → NT'
];

// TODOS los tipos válidos (para validaciones en Code.gs)
const TODOS_TIPOS_INGRESO_NT = [...TIPOS_INGRESO_NT, ...TIPOS_INGRESO_NT_AUTOCREADOS];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORÍAS DE EGRESO
// ═══════════════════════════════════════════════════════════════════════════════

const CATEGORIAS_EGRESO_FAMILIA = [
  'GASTOS FIJOS',
  'CUOTAS Y PRÉSTAMOS',
  'OBLIGACIONES LEGALES',
  'SUSCRIPCIONES',
  'VARIABLES'
  // AHORRO ya no es egreso - tiene su propio TIPO
];

// ═══════════════════════════════════════════════════════════════════════════════
// AHORRO - TIPO SEPARADO (no es ingreso ni egreso, es transferencia)
// ═══════════════════════════════════════════════════════════════════════════════

const TIPO_AHORRO = 'Ahorro';

const CATEGORIAS_AHORRO_FAMILIA = [
  'Ahorro Clara',
  'Ahorro Marco',
  'Fondo de Emergencia'
];

const CATEGORIAS_EGRESO_NT = [
  'CLÍNICA',
  'SUELDOS Y HONORARIOS',
  'TELEFONÍA E INTERNET',
  'OBLIGACIONES LEGALES',
  'EVENTOS',
  'VARIABLES'
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUBCATEGORÍAS VARIABLES
// ═══════════════════════════════════════════════════════════════════════════════

const VARIABLES_FAMILIA = [
  'Supermercado',
  'Combustible',
  'Alimentación',               // v7.7: Agregado
  'Gastos Varios',              // v7.7: Agregado
  'Mantenimiento / Reparaciones Auto Clara',
  'Mantenimiento / Reparaciones Auto Niños',
  'Mantenimiento / Reparaciones Camioneta Marco',
  'Ropa/Vestidos',
  'Recreación (Pizza, hamburguesa, helados, etc)',
  'Salud y Medicamentos',
  'Gastos no identificados',
  'Devolución Familia → NT',
  'Préstamo Familia → NT',      // Familia presta a NT
  'Gastos del Colegio',          // v7.22: Agregado por usuario
  'Reserva Var. 1',              // v7.25: 5 reservas dinámicas
  'Reserva Var. 2',
  'Reserva Var. 3',
  'Reserva Var. 4',
  'Reserva Var. 5'
];

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORÍAS PARA DROPDOWNS DE CARGA (solo VARIABLES - las fijas van en GASTOS_FIJOS)
// ═══════════════════════════════════════════════════════════════════════════════

const CARGA_CATEGORIAS_FAMILIA = ['VARIABLES'];
const CARGA_CATEGORIAS_NT = ['VARIABLES'];

// NOTA: AHORRO_FAMILIA ya no existe como subcategoría
// Ahora se usa CATEGORIAS_AHORRO_FAMILIA como categoría del TIPO "Ahorro"

const VARIABLES_NT = [
  'Insumos y Papelería',
  'Reparaciones Clínica',
  'Mantenimiento Aire',
  'Gastos Cursos',
  'Gastos Varios Cumple (Tortas, bocaditos, meriendas)',
  'Horas Extras Aracely',        // v7.7: Agregado
  'Horas Extras Fatima',         // v7.7: Agregado
  'Préstamo NT → Familia',
  'Devolución NT → Familia',     // NT devuelve préstamo a Familia
  'Muebles y equipos',           // v7.22: Agregado por usuario
  'Reserva Var. 1',              // v7.25: 5 reservas dinámicas
  'Reserva Var. 2',
  'Reserva Var. 3',
  'Reserva Var. 4',
  'Reserva Var. 5'
];

// ═══════════════════════════════════════════════════════════════════════════════
// EVENTOS NEUROTEA (6 definidos + 10 reservas)
// ═══════════════════════════════════════════════════════════════════════════════

// EVENTOS_NT: Lista para PRESUPUESTO y referencia (6 definidos + 12 reservas = 18 total)
const EVENTOS_NT = [
  { nombre: 'Día del Autismo', mes: 'Abril' },
  { nombre: 'San Juan', mes: 'Junio' },
  { nombre: 'Día del Niño', mes: 'Agosto' },
  { nombre: 'Clausura Padres', mes: 'Noviembre' },
  { nombre: 'Navidad Papá Noel', mes: 'Diciembre' },
  { nombre: 'Cena Fin de Año', mes: 'Diciembre' },
  { nombre: 'Reserva Evento 1', mes: '(por definir)' },
  { nombre: 'Reserva Evento 2', mes: '(por definir)' },
  { nombre: 'Reserva Evento 3', mes: '(por definir)' },
  { nombre: 'Reserva Evento 4', mes: '(por definir)' },
  { nombre: 'Reserva Evento 5', mes: '(por definir)' },
  { nombre: 'Reserva Evento 6', mes: '(por definir)' },
  { nombre: 'Reserva Evento 7', mes: '(por definir)' },
  { nombre: 'Reserva Evento 8', mes: '(por definir)' },
  { nombre: 'Reserva Evento 9', mes: '(por definir)' },
  { nombre: 'Reserva Evento 10', mes: '(por definir)' },
  { nombre: 'Reserva Evento 11', mes: '(por definir)' },  // v7.7: Agregado
  { nombre: 'Reserva Evento 12', mes: '(por definir)' }   // v7.7: Agregado
];

// EVENTOS para GASTOS_FIJOS (con estructura completa: concepto, categoria, frecuencia, dia, cuenta, monto)
const EVENTOS_GASTOS_NT = [
  { concepto: 'Día del Autismo', categoria: 'EVENTOS', frecuencia: 'Variable/Anual', dia: 2, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'San Juan', categoria: 'EVENTOS', frecuencia: 'Variable/Anual', dia: 24, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Día del Niño', categoria: 'EVENTOS', frecuencia: 'Variable/Anual', dia: 16, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Clausura Padres', categoria: 'EVENTOS', frecuencia: 'Variable/Anual', dia: 15, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Navidad Papá Noel', categoria: 'EVENTOS', frecuencia: 'Variable/Anual', dia: 20, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Cena Fin de Año', categoria: 'EVENTOS', frecuencia: 'Variable/Anual', dia: 28, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 1', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 2', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 3', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 4', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 5', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 6', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 7', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 8', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 9', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 10', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 11', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Evento 12', categoria: 'EVENTOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRESUPUESTO - INGRESOS FAMILIA
// ═══════════════════════════════════════════════════════════════════════════════

const INGRESOS_FAMILIA = [
  { concepto: 'Salario Marco', frecuencia: 'Variable/Mensual', monto: 0 },
  { concepto: 'Salario Marco NeuroTEA', frecuencia: 'Variable/Mensual', monto: 0 },
  { concepto: 'Vacaciones Marco', frecuencia: 'Variable/Anual', monto: 0 },
  { concepto: 'Adelanto de Aguinaldo Marco', frecuencia: 'Variable/Anual', monto: 0 },
  { concepto: 'Saldo Aguinaldo Marco', frecuencia: 'Variable/Anual', monto: 0 },
  { concepto: 'Viático Marco', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Animador Bíblico Marco', frecuencia: 'Variable/Mensual', monto: 0 },
  { concepto: 'Tarjeta Gourmed', frecuencia: 'Variable/Mensual', monto: 0 },
  { concepto: 'Contrato Colectivo Marco', frecuencia: 'Variable/Anual', monto: 0 },
  { concepto: 'PL Itaipu Marco', frecuencia: 'Variable/Anual', monto: 0 },
  { concepto: 'Honorarios Clara NeuroTEA', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Préstamo NeuroTEA', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Devolución NeuroTEA', frecuencia: 'Variable', monto: 0 },  // NT devuelve a Familia
  { concepto: 'Préstamo Otros Bancos', frecuencia: 'Variable', monto: 0 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// GASTOS FIJOS FAMILIA
// ═══════════════════════════════════════════════════════════════════════════════

const GASTOS_FIJOS_FAM = [
  { concepto: 'Salario Lili Doméstico', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Efectivo', monto: 0 },
  { concepto: 'Salario Laura Doméstico', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Efectivo', monto: 0 },
  { concepto: 'Escuela Fabián y Brenda', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Robótica Niños', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'ANDE Casa', categoria: 'GASTOS FIJOS', frecuencia: 'Variable/Mensual', dia: 15, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Expensa Casa', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 1, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Ña Luisa', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Efectivo', monto: 0 },
  { concepto: 'Remedio Lochi', categoria: 'GASTOS FIJOS', frecuencia: 'Variable/Mensual', dia: 15, cuenta: 'Efectivo', monto: 0 },
  { concepto: 'Seguro Médico Papá y Mamá', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Contadora Marco', categoria: 'GASTOS FIJOS', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Reserva GF 1', categoria: 'GASTOS FIJOS', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva GF 2', categoria: 'GASTOS FIJOS', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva GF 3', categoria: 'GASTOS FIJOS', frecuencia: '-', dia: '', cuenta: '', monto: 0 }
];

const CUOTAS_FAM = [
  { concepto: 'Préstamo Lizzi', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 20, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Cajubi Marco', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Coop. Univ. Marco', monto: 0 },
  { concepto: 'Mutual Marco', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Coop. Univ. Marco', monto: 0 },
  { concepto: 'Seguro Auto Laura ITAU', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'ITAU Clara', monto: 0 },
  { concepto: 'Cuota ITAU', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Variable/Mensual', dia: 15, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Auto Laura Cuota', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'ITAU Clara', monto: 0 },
  { concepto: 'Coop. Universitaria Clara', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'ITAU Clara', monto: 0 },
  { concepto: 'Coomecipar Clara', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'Tarjeta Comecipar Clara', monto: 0 },
  { concepto: 'Solar Préstamo 1', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 20, cuenta: 'Tarjeta Solar Clara', monto: 0 },
  { concepto: 'Solar Préstamo 2', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 20, cuenta: 'Tarjeta Solar Clara', monto: 0 },
  { concepto: 'Show Congelador', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Fijo/Mensual', dia: 25, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Pago Mínimo Tarj ITAU Clara', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Variable/Mensual', dia: 10, cuenta: 'Tarjeta ITAU Clara', monto: 0 },
  { concepto: 'Pago Mínimo Tarj ITAU Marco', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Variable/Mensual', dia: 10, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'Pago Mínimo Tarj Solar Clara', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Variable/Mensual', dia: 15, cuenta: 'Tarjeta Solar Clara', monto: 0 },
  { concepto: 'Pago Mínimo Tarj Comecipar', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: 'Variable/Mensual', dia: 15, cuenta: 'Tarjeta Comecipar Clara', monto: 0 },
  { concepto: 'Reserva Cuota 1', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva Cuota 2', categoria: 'CUOTAS Y PRÉSTAMOS', frecuencia: '-', dia: '', cuenta: '', monto: 0 }
];

const OBLIGACIONES_FAM = [
  { concepto: 'Aporte IPS', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Aporte Cajubi', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Coop. Univ. Marco', monto: 0 },
  { concepto: 'Aporte STEIBI', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Aporte SICHAP', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Impuesto compra digital', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Variable/Mensual', dia: 20, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Aporte Coop. Univer. Clara', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'ITAU Clara', monto: 0 },
  { concepto: 'Aporte Coop. Univer. Marco', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'Coop. Univ. Marco', monto: 0 },
  { concepto: 'Impuesto Renta personal', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Anual', dia: 31, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Impuesto terreno casa', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Anual', dia: 31, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Reserva Oblig. 1', categoria: 'OBLIGACIONES LEGALES', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva Oblig. 2', categoria: 'OBLIGACIONES LEGALES', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva Oblig. 3', categoria: 'OBLIGACIONES LEGALES', frecuencia: '-', dia: '', cuenta: '', monto: 0 }
];

const SUSCRIPCIONES_FAM = [
  { concepto: 'Giganet', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 1, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Tigo Clara', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 28, cuenta: 'ITAU Clara', monto: 0 },
  { concepto: 'Tigo Familiar', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 28, cuenta: 'ITAU Marco', monto: 0 },
  { concepto: 'Google One', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'ChatGPT', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'Claude Marco', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'Claude Clara', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Clara', monto: 0 },
  { concepto: 'Antivirus Clara (Anual)', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Anual', dia: 15, cuenta: 'Tarjeta ITAU Clara', monto: 0 },
  { concepto: 'Antivirus Marco (Anual)', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Anual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'MS Office Clara (Anual)', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Anual', dia: 15, cuenta: 'Tarjeta ITAU Clara', monto: 0 },
  { concepto: 'MS Office Marco (Anual)', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Anual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'PosterWall', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'Canva (Anual)', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Anual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'Scribd', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'iLovePDF', categoria: 'SUSCRIPCIONES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Tarjeta ITAU Marco', monto: 0 },
  { concepto: 'Reserva Suscr. 1', categoria: 'SUSCRIPCIONES', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva Suscr. 2', categoria: 'SUSCRIPCIONES', frecuencia: '-', dia: '', cuenta: '', monto: 0 },
  { concepto: 'Reserva Suscr. 3', categoria: 'SUSCRIPCIONES', frecuencia: '-', dia: '', cuenta: '', monto: 0 }
];

const VARIABLES_PRESUP_FAM = [
  { concepto: 'Supermercado', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Combustible', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Alimentación', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },      // v7.7
  { concepto: 'Gastos Varios', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },     // v7.7
  { concepto: 'Mantenimiento / Reparaciones Auto Clara', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Mantenimiento / Reparaciones Auto Niños', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Mantenimiento / Reparaciones Camioneta Marco', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Ropa/Vestidos', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Recreación (Pizza, hamburguesa, helados, etc)', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Salud y Medicamentos', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Gastos no identificados', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Devolución Familia → NT', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Préstamo Familia → NT', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },  // Familia presta a NT
  { concepto: 'Gastos del Colegio', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },   // v7.22: Agregado por usuario
  { concepto: 'Reserva Var. 1', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },    // v7.25: 5 reservas dinámicas
  { concepto: 'Reserva Var. 2', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Var. 3', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Var. 4', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Var. 5', categoria: 'VARIABLES', frecuencia: '-', monto: 0 }
];

const AHORRO_FAM = [
  { concepto: 'Ahorro Clara', categoria: 'AHORRO', frecuencia: 'Variable/Mensual', monto: 0 },
  { concepto: 'Ahorro Marco', categoria: 'AHORRO', frecuencia: 'Variable/Mensual', monto: 0 },
  { concepto: 'Fondo de Emergencia', categoria: 'AHORRO', frecuencia: 'Variable/Mensual', monto: 0 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PRESUPUESTO - NEUROTEA
// ═══════════════════════════════════════════════════════════════════════════════

const INGRESOS_NT = [
  { concepto: 'Aporte NeuroTEA Terapeutas', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Cursos NeuroTEA', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Otros', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Devolución Familia → NT', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Préstamo Familia', frecuencia: 'Variable', monto: 0 },  // Familia presta a NT
  { concepto: 'Reserva Ing. 1', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Ing. 2', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Ing. 3', frecuencia: '-', monto: 0 }
];

const CLINICA_NT = [
  { concepto: 'Alquiler 1 (Principal)', categoria: 'CLÍNICA', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Alquiler 2 (Secundario)', categoria: 'CLÍNICA', frecuencia: 'Fijo/Mensual', dia: 5, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'ANDE clínica', categoria: 'CLÍNICA', frecuencia: 'Variable/Mensual', dia: 15, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Clín. 1', categoria: 'CLÍNICA', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Clín. 2', categoria: 'CLÍNICA', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Clín. 3', categoria: 'CLÍNICA', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 }
];

const SUELDOS_NT = [
  { concepto: 'Sueldo Aracely', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Fijo/Mensual', dia: 30, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Sueldo Fátima', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Fijo/Mensual', dia: 30, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Limpieza NeuroTEA', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Variable/Mensual', dia: 30, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Honorario Contador', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Fijo/Mensual', dia: 10, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Salario Administrador (Marco)', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Fijo/Mensual', dia: 30, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Honorario Mant. Sistema', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Community Manager', categoria: 'SUELDOS Y HONORARIOS', frecuencia: 'Fijo/Mensual', dia: 30, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Sueldo 2', categoria: 'SUELDOS Y HONORARIOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Sueldo 3', categoria: 'SUELDOS Y HONORARIOS', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 }
];

const TELEFONIA_NT = [
  { concepto: 'Celular Tigo NeuroTEA', categoria: 'TELEFONÍA E INTERNET', frecuencia: 'Fijo/Mensual', dia: 28, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Celular Tigo Sistema', categoria: 'TELEFONÍA E INTERNET', frecuencia: 'Fijo/Mensual', dia: 28, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'WhatsFlow', categoria: 'TELEFONÍA E INTERNET', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Internet NeuroTEA', categoria: 'TELEFONÍA E INTERNET', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Tel. 1', categoria: 'TELEFONÍA E INTERNET', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Tel. 2', categoria: 'TELEFONÍA E INTERNET', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Tel. 3', categoria: 'TELEFONÍA E INTERNET', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 }
];

const OBLIGACIONES_NT = [
  { concepto: 'IVA', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Variable/Mensual', dia: 20, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'IPS', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Fijo/Mensual', dia: 15, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Ministerio de Salud', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Variable/Anual', dia: 31, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Mora de Alquiler', categoria: 'OBLIGACIONES LEGALES', frecuencia: 'Variable/Mensual', dia: 10, cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Oblig. 1', categoria: 'OBLIGACIONES LEGALES', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Oblig. 2', categoria: 'OBLIGACIONES LEGALES', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 },
  { concepto: 'Reserva Oblig. 3', categoria: 'OBLIGACIONES LEGALES', frecuencia: '-', dia: '', cuenta: 'Atlas NeuroTEA', monto: 0 }
];

const VARIABLES_PRESUP_NT = [
  { concepto: 'Insumos y Papelería', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Reparaciones Clínica', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Mantenimiento Aire', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Gastos Cursos', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Gastos Varios Cumple (Tortas, bocaditos, meriendas)', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Horas Extras Aracely', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },     // v7.7: Agregado
  { concepto: 'Horas Extras Fatima', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },      // v7.7: Agregado
  { concepto: 'Préstamo NT → Familia', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },
  { concepto: 'Devolución NT → Familia', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },  // NT devuelve a Familia
  { concepto: 'Muebles y equipos', categoria: 'VARIABLES', frecuencia: 'Variable', monto: 0 },    // v7.22: Agregado por usuario
  { concepto: 'Reserva Var. 1', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },    // v7.25: 5 reservas dinámicas
  { concepto: 'Reserva Var. 2', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Var. 3', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Var. 4', categoria: 'VARIABLES', frecuencia: '-', monto: 0 },
  { concepto: 'Reserva Var. 5', categoria: 'VARIABLES', frecuencia: '-', monto: 0 }
];

// ═══════════════════════════════════════════════════════════════════════════════
// METAS NEUROTEA
// ═══════════════════════════════════════════════════════════════════════════════

const METAS_NT = {
  GANANCIA_MINIMA_PCT: 7,        // 7% mínimo de ganancia
  MAXIMO_GASTOS_PCT: 93,        // Máximo 93% en gastos
  DIST_UTILIDAD_DUEÑO: 33.33,   // 1/3 para Marco
  DIST_FONDO_EMERGENCIA: 33.33, // 1/3 para emergencias
  DIST_FONDO_INVERSION: 33.34   // 1/3 para inversión
};

// ═══════════════════════════════════════════════════════════════════════════════
// NOMBRES DE HOJAS
// ═══════════════════════════════════════════════════════════════════════════════

const NOMBRES_HOJAS = {
  CONFIG: 'CONFIG',
  CALCULOS: 'CALCULOS',               // v8.0: Hoja intermedia de cálculos
  PRESUPUESTO: 'PRESUPUESTO',
  GASTOS_FIJOS: 'GASTOS_FIJOS',
  CARGA_FAMILIA: 'CARGA_FAMILIA',
  CARGA_NT: 'CARGA_NT',
  MOVIMIENTO: 'MOVIMIENTO',
  TABLERO: 'TABLERO',
  LIQUIDEZ_FAM: 'LIQUIDEZ_FAMILIA',
  LIQUIDEZ_NT: 'LIQUIDEZ_NT'
};
