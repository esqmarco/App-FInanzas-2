/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SHEETS.GS - CREACIÓN DE LAS 9 HOJAS PRINCIPALES
 * Sistema de Control Financiero 2026 - NeuroTEA & Familia
 * Versión 6.2 - Estilo sobrio profesional (gris/blanco, colores solo estados)
 * BUG FIX [2026-01-14]: Formato números Paraguay con SUBSTITUTE
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDAD: Crear o Limpiar Hoja
// ═══════════════════════════════════════════════════════════════════════════════

function crearOLimpiarHoja(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(nombre);
  if (sheet) {
    ss.deleteSheet(sheet);
  }
  sheet = ss.insertSheet(nombre);

  // Limpiar cualquier validación de datos heredada (Google Sheets a veces las copia)
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).clearDataValidations();

  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. HOJA CONFIG - Listas Maestras y Configuración
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaCONFIG() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.CONFIG);
  const C = COLORES;

  // ─── HEADER PRINCIPAL ───
  sheet.getRange('A1:N1').merge()
    .setValue('⚙️ CONFIGURACIÓN - LISTAS MAESTRAS')
    .setFontSize(16).setFontWeight('bold')
    .setBackground(C.HEADER_DARK).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:N2').merge()
    .setValue('Estas listas alimentan los desplegables del sistema. Modificar con cuidado.')
    .setFontSize(10).setFontColor(C.TEXTO_CLARO).setFontStyle('italic');

  let col = 1;

  // ─── MESES ───
  escribirListaConfig(sheet, 4, col, 'MESES', MESES, C.FAM_HEADER);
  col += 2;

  // ─── ENTIDADES ───
  escribirListaConfig(sheet, 4, col, 'ENTIDADES', ENTIDADES, C.NT_HEADER);
  col += 2;

  // ─── TIPOS INGRESO FAMILIA ───
  escribirListaConfig(sheet, 4, col, 'TIPOS INGRESO FAMILIA', TIPOS_INGRESO_FAMILIA, C.FAM_HEADER);
  col += 2;

  // ─── TIPOS INGRESO NT ───
  escribirListaConfig(sheet, 4, col, 'TIPOS INGRESO NT', TIPOS_INGRESO_NT, C.NT_HEADER);
  col += 2;

  // ─── CUENTAS FAMILIA ───
  escribirListaConfig(sheet, 4, col, 'CUENTAS FAMILIA', CUENTAS_FAMILIA, C.FAM_HEADER);
  col += 2;

  // ─── CUENTAS NT ───
  escribirListaConfig(sheet, 4, col, 'CUENTAS NT', CUENTAS_NT, C.NT_HEADER);
  col += 2;

  // ─── CATEGORÍAS EGRESO FAMILIA ───
  escribirListaConfig(sheet, 4, col, 'CATEG. EGRESO FAM', CATEGORIAS_EGRESO_FAMILIA, C.FAM_HEADER);

  // Segunda fila de listas
  col = 1;
  const fila2 = 20;

  // ─── CATEGORÍAS EGRESO NT ───
  escribirListaConfig(sheet, fila2, col, 'CATEG. EGRESO NT', CATEGORIAS_EGRESO_NT, C.NT_HEADER);
  col += 2;

  // ─── VARIABLES FAMILIA ───
  escribirListaConfig(sheet, fila2, col, 'VARIABLES FAMILIA', VARIABLES_FAMILIA, C.FAM_HEADER);
  col += 2;

  // ─── CATEGORÍAS AHORRO FAMILIA (v6.9: son CATEGORÍAS, no subcategorías) ───
  escribirListaConfig(sheet, fila2, col, 'CATEG. AHORRO FAM', CATEGORIAS_AHORRO_FAMILIA, C.FAM_HEADER);
  col += 2;

  // ─── VARIABLES NT ───
  escribirListaConfig(sheet, fila2, col, 'VARIABLES NT', VARIABLES_NT, C.NT_HEADER);
  col += 2;

  // ─── EVENTOS NT ───
  escribirListaConfig(sheet, fila2, col, 'EVENTOS NT', EVENTOS_NT.map(e => e.nombre), C.BALANCE_HEADER);
  col += 2;

  // ─── FRECUENCIAS ───
  escribirListaConfig(sheet, fila2, col, 'FRECUENCIAS', FRECUENCIAS, C.TEXTO);
  col += 2;

  // ─── ESTADOS ───
  escribirListaConfig(sheet, fila2, col, 'ESTADOS', ESTADOS, C.TEXTO);

  // ─── METAS NEUROTEA ───
  // v7.28: Moved from 38 to 41 to avoid overlap with VARIABLES_FAMILIA (19 items at C21:C39)
  const filaMetas = 41;
  sheet.getRange(filaMetas, 1, 1, 4).merge()
    .setValue('🎯 METAS NEUROTEA (Editables)')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO);

  // v7.6: METAS ahora son valores numéricos editables que las fórmulas referencian
  // Estructura: Parámetro | Valor (numérico) | Unidad | Descripción
  const metasHeaders = [['Parámetro', 'Valor', 'Unidad', 'Descripción']];
  sheet.getRange(filaMetas + 1, 1, 1, 4).setValues(metasHeaders)
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);

  // Fila 43: Meta Ganancia Mínima (CONFIG!$B$43)
  sheet.getRange(filaMetas + 2, 1).setValue('Meta Ganancia Mínima');
  sheet.getRange(filaMetas + 2, 2).setValue(METAS_NT.GANANCIA_MINIMA_PCT)
    .setNumberFormat('0').setBackground(C.NT_FONDO).setFontWeight('bold');
  sheet.getRange(filaMetas + 2, 3).setValue('%');
  sheet.getRange(filaMetas + 2, 4).setValue('% mínimo de ganancia sobre ingresos');

  // Fila 44: Meta Máximo Gastos (CONFIG!$B$44)
  sheet.getRange(filaMetas + 3, 1).setValue('Meta Máximo Gastos');
  sheet.getRange(filaMetas + 3, 2).setValue(METAS_NT.MAXIMO_GASTOS_PCT)
    .setNumberFormat('0').setBackground(C.NT_FONDO).setFontWeight('bold');
  sheet.getRange(filaMetas + 3, 3).setValue('%');
  sheet.getRange(filaMetas + 3, 4).setValue('% máximo de gastos sobre ingresos');

  // Fila 45: Distribución Utilidad Dueño (CONFIG!$B$45)
  sheet.getRange(filaMetas + 4, 1).setValue('Distribución Utilidad Dueño');
  sheet.getRange(filaMetas + 4, 2).setValue(METAS_NT.DIST_UTILIDAD_DUEÑO)
    .setNumberFormat('0.00').setBackground(C.NT_FONDO).setFontWeight('bold');
  sheet.getRange(filaMetas + 4, 3).setValue('%');
  sheet.getRange(filaMetas + 4, 4).setValue('Porcentaje de ganancia para Marco');

  // Fila 46: Distribución Fondo Emergencia (CONFIG!$B$46)
  sheet.getRange(filaMetas + 5, 1).setValue('Distribución Fondo Emergencia');
  sheet.getRange(filaMetas + 5, 2).setValue(METAS_NT.DIST_FONDO_EMERGENCIA)
    .setNumberFormat('0.00').setBackground(C.NT_FONDO).setFontWeight('bold');
  sheet.getRange(filaMetas + 5, 3).setValue('%');
  sheet.getRange(filaMetas + 5, 4).setValue('Porcentaje para contingencias');

  // Fila 47: Distribución Fondo Inversión (CONFIG!$B$47)
  sheet.getRange(filaMetas + 6, 1).setValue('Distribución Fondo Inversión');
  sheet.getRange(filaMetas + 6, 2).setValue(METAS_NT.DIST_FONDO_INVERSION)
    .setNumberFormat('0.00').setBackground(C.NT_FONDO).setFontWeight('bold');
  sheet.getRange(filaMetas + 6, 3).setValue('%');
  sheet.getRange(filaMetas + 6, 4).setValue('Porcentaje para crecimiento');

  // Nota explicativa
  sheet.getRange(filaMetas + 7, 1, 1, 4).merge()
    .setValue('✏️ Edite los valores en columna B. Las fórmulas de PRESUPUESTO y TABLERO se actualizan automáticamente.')
    .setFontSize(9).setFontStyle('italic').setFontColor(C.TEXTO_CLARO);

  // ─── SALDOS INICIALES POR MES ───
  // Decisión [2026-01-06]: Cada mes tiene su propio saldo inicial independiente
  const filaSaldos = 50;
  sheet.getRange(filaSaldos, 1, 1, 4).merge()
    .setValue('💰 SALDOS INICIALES POR MES')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.BALANCE_HEADER).setFontColor(C.BLANCO);

  sheet.getRange(filaSaldos + 1, 1, 1, 3)
    .setValues([['MES', 'FAMILIA', 'NEUROTEA']])
    .setFontWeight('bold')
    .setBackground(C.GRIS_FONDO)
    .setHorizontalAlignment('center');

  // v7.5: Saldos globales ahora son FÓRMULAS que suman los saldos por cuenta
  // Esto garantiza coherencia: solo se editan saldos por cuenta, el global se calcula
  MESES.forEach((mes, i) => {
    const filaMes = filaSaldos + 2 + i;
    const colLetra = String.fromCharCode(66 + i); // B=Enero, C=Febrero, ... M=Diciembre
    sheet.getRange(filaMes, 1).setValue(mes);
    // FAMILIA = SUM de las 10 cuentas (filas 68-77)
    sheet.getRange(filaMes, 2).setFormula(`=SUM(${colLetra}68:${colLetra}77)`)
      .setNumberFormat('#,##0')
      .setBackground(C.FAM_FONDO)
      .setFontWeight('bold');
    // NEUROTEA = SUM de las 2 cuentas (filas 82-83)
    sheet.getRange(filaMes, 3).setFormula(`=SUM(${colLetra}82:${colLetra}83)`)
      .setNumberFormat('#,##0')
      .setBackground(C.NT_FONDO)
      .setFontWeight('bold');
  });

  // Nota explicativa (actualizada v7.5)
  sheet.getRange(filaSaldos + 14, 1, 1, 3).merge()
    .setValue('📊 Calculado automáticamente desde SALDOS POR CUENTA (abajo)')
    .setFontSize(9).setFontStyle('italic').setFontColor(C.TEXTO_CLARO);

  // ─── SALDOS INICIALES POR CUENTA - FAMILIA ───
  // v7.4: Cada cuenta tiene su saldo inicial por mes
  const filaSaldosCuentasFam = 66;
  sheet.getRange(filaSaldosCuentasFam, 1, 1, 14).merge()
    .setValue('💰 SALDOS INICIALES POR CUENTA - FAMILIA')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.FAM_HEADER).setFontColor(C.BLANCO);

  // Headers de meses para FAMILIA
  const headersMesesFam = [['CUENTA'].concat(MESES.map(m => m.substring(0, 3).toUpperCase()))];
  sheet.getRange(filaSaldosCuentasFam + 1, 1, 1, 13)
    .setValues(headersMesesFam)
    .setFontWeight('bold')
    .setBackground(C.GRIS_FONDO)
    .setHorizontalAlignment('center');

  // Filas de cuentas FAMILIA con valores editables (inicializados en 0)
  CUENTAS_FAMILIA.forEach((cuenta, i) => {
    const filaCuenta = filaSaldosCuentasFam + 2 + i;
    sheet.getRange(filaCuenta, 1).setValue(cuenta).setFontWeight('bold');
    for (let mes = 0; mes < 12; mes++) {
      sheet.getRange(filaCuenta, 2 + mes)
        .setValue(0)
        .setNumberFormat('#,##0')
        .setBackground(C.FAM_FONDO);
    }
  });

  // Nota FAMILIA
  const notaFilaFam = filaSaldosCuentasFam + 2 + CUENTAS_FAMILIA.length;
  sheet.getRange(notaFilaFam, 1, 1, 13).merge()
    .setValue('✏️ Ingrese el saldo inicial de cada cuenta al inicio de cada mes.')
    .setFontSize(9).setFontStyle('italic').setFontColor(C.TEXTO_CLARO);

  // ─── SALDOS INICIALES POR CUENTA - NEUROTEA ───
  const filaSaldosCuentasNT = notaFilaFam + 2;
  sheet.getRange(filaSaldosCuentasNT, 1, 1, 14).merge()
    .setValue('💰 SALDOS INICIALES POR CUENTA - NEUROTEA')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO);

  // Headers de meses para NEUROTEA
  const headersMesesNT = [['CUENTA'].concat(MESES.map(m => m.substring(0, 3).toUpperCase()))];
  sheet.getRange(filaSaldosCuentasNT + 1, 1, 1, 13)
    .setValues(headersMesesNT)
    .setFontWeight('bold')
    .setBackground(C.GRIS_FONDO)
    .setHorizontalAlignment('center');

  // Filas de cuentas NEUROTEA con valores editables (inicializados en 0)
  CUENTAS_NT.forEach((cuenta, i) => {
    const filaCuenta = filaSaldosCuentasNT + 2 + i;
    sheet.getRange(filaCuenta, 1).setValue(cuenta).setFontWeight('bold');
    for (let mes = 0; mes < 12; mes++) {
      sheet.getRange(filaCuenta, 2 + mes)
        .setValue(0)
        .setNumberFormat('#,##0')
        .setBackground(C.NT_FONDO);
    }
  });

  // Nota NEUROTEA
  const notaFilaNT = filaSaldosCuentasNT + 2 + CUENTAS_NT.length;
  sheet.getRange(notaFilaNT, 1, 1, 13).merge()
    .setValue('✏️ El saldo inicial de cada cuenta se usa para calcular el "Esperado" en TABLERO.')
    .setFontSize(9).setFontStyle('italic').setFontColor(C.TEXTO_CLARO);

  // Formato general
  sheet.setColumnWidths(1, 1, 180);  // Columna de cuentas más ancha
  sheet.setColumnWidths(2, 12, 85);  // Columnas de meses
  sheet.setFrozenRows(3);

  return sheet;
}

function escribirListaConfig(sheet, row, col, titulo, lista, colorHeader) {
  // Título
  sheet.getRange(row, col)
    .setValue(titulo)
    .setFontWeight('bold')
    .setBackground(colorHeader)
    .setFontColor(COLORES.BLANCO)
    .setHorizontalAlignment('center');

  // Items
  lista.forEach((item, i) => {
    sheet.getRange(row + 1 + i, col).setValue(item);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HOJA PRESUPUESTO - Plan Anual ENE-DIC
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaPRESUPUESTO() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.PRESUPUESTO);
  const C = COLORES;
  const metaGanancia = METAS_NT.GANANCIA_MINIMA_PCT / 100; // 0.07

  // ─── HEADER PRINCIPAL ───
  sheet.getRange('A1:Q1').merge()
    .setValue('📊 PRESUPUESTO ANUAL ' + AÑO)
    .setFontSize(18).setFontWeight('bold')
    .setBackground(C.HEADER_DARK).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:Q2').merge()
    .setValue('Plan de ingresos y egresos para FAMILIA y NEUROTEA • Moneda: Guaraníes (Gs.)')
    .setFontSize(10).setFontColor(C.TEXTO_CLARO);

  // ─── HEADERS DE COLUMNAS ───
  const headers = ['CONCEPTO', 'TIPO', 'FREC.', ...MESES_CORTOS, 'TOTAL AÑO'];
  headers.forEach((h, i) => {
    sheet.getRange(4, i + 1).setValue(h).setFontWeight('bold')
      .setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });

  let row = 6;
  let result;

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN FAMILIA
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 16).merge()
    .setValue('═══════════════  🏠 FAMILIA  ═══════════════')
    .setFontSize(14).setFontWeight('bold')
    .setBackground(C.FAM_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row += 2;

  // ─── INGRESOS FAMILIA ───
  result = escribirSeccionPresupuesto(sheet, row, '▶ INGRESOS FAMILIA', INGRESOS_FAMILIA, 'Ingreso', C.FAM_FONDO, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row;
  const filaSubtotalIngresosFam = result.filaSubtotal;

  // TOTAL INGRESOS FAMILIA
  sheet.getRange(row, 1).setValue('📥 TOTAL INGRESOS FAMILIA').setFontWeight('bold').setFontSize(11);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=${colLetra}${filaSubtotalIngresosFam}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.VERDE_FONDO);
  const filaTotalIngresosFam = row;
  row += 2;

  // ─── EGRESOS FAMILIA ───
  const filasSubtotalesEgresosFam = [];

  result = escribirSeccionPresupuesto(sheet, row, '▶ GASTOS FIJOS', GASTOS_FIJOS_FAM, 'Egreso', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row; filasSubtotalesEgresosFam.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ CUOTAS Y PRÉSTAMOS', CUOTAS_FAM, 'Egreso', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row; filasSubtotalesEgresosFam.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ OBLIGACIONES LEGALES', OBLIGACIONES_FAM, 'Egreso', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row; filasSubtotalesEgresosFam.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ SUSCRIPCIONES', SUSCRIPCIONES_FAM, 'Egreso', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row; filasSubtotalesEgresosFam.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ VARIABLES', VARIABLES_PRESUP_FAM, 'Egreso', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row; filasSubtotalesEgresosFam.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ AHORRO', AHORRO_FAM, 'Egreso', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL, 'FAMILIA');
  row = result.row; filasSubtotalesEgresosFam.push(result.filaSubtotal);

  // TOTAL EGRESOS FAMILIA
  sheet.getRange(row, 1).setValue('📤 TOTAL EGRESOS FAMILIA').setFontWeight('bold').setFontSize(11);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    const sumaFilas = filasSubtotalesEgresosFam.map(f => `${colLetra}${f}`).join('+');
    sheet.getRange(row, col).setFormula(`=${sumaFilas}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.ROJO_FONDO);
  const filaTotalEgresosFam = row;
  row++;

  // BALANCE FAMILIA = Ingresos - Egresos
  sheet.getRange(row, 1).setValue('💰 BALANCE FAMILIA (Ingresos - Egresos)').setFontWeight('bold').setFontSize(11);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=${colLetra}${filaTotalIngresosFam}-${colLetra}${filaTotalEgresosFam}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.GANANCIA_FONDO);
  const filaBalanceFam = row;
  row += 3;

  // ═══════════════════════════════════════════════════════════════════
  // SECCIÓN NEUROTEA
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 16).merge()
    .setValue('═══════════════  🏥 NEUROTEA  ═══════════════')
    .setFontSize(14).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row += 2;

  // ─── INGRESOS NT ───
  result = escribirSeccionPresupuesto(sheet, row, '▶ INGRESOS NEUROTEA', INGRESOS_NT, 'Ingreso', C.NT_FONDO, C.NT_SUBTOTAL, 'NEUROTEA');
  row = result.row;
  const filaSubtotalIngresosNT = result.filaSubtotal;

  // TOTAL INGRESOS NT
  sheet.getRange(row, 1).setValue('📥 TOTAL INGRESOS NEUROTEA').setFontWeight('bold').setFontSize(11);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=${colLetra}${filaSubtotalIngresosNT}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.VERDE_FONDO);
  const filaTotalIngresosNT = row;
  row += 2;

  // ─── EGRESOS NT ───
  const filasSubtotalesEgresosNT = [];

  result = escribirSeccionPresupuesto(sheet, row, '▶ CLÍNICA', CLINICA_NT, 'Egreso', C.NT_FONDO_ALT, C.NT_SUBTOTAL, 'NEUROTEA');
  row = result.row; filasSubtotalesEgresosNT.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ SUELDOS Y HONORARIOS', SUELDOS_NT, 'Egreso', C.NT_FONDO_ALT, C.NT_SUBTOTAL, 'NEUROTEA');
  row = result.row; filasSubtotalesEgresosNT.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ TELEFONÍA E INTERNET', TELEFONIA_NT, 'Egreso', C.NT_FONDO_ALT, C.NT_SUBTOTAL, 'NEUROTEA');
  row = result.row; filasSubtotalesEgresosNT.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ OBLIGACIONES LEGALES', OBLIGACIONES_NT, 'Egreso', C.NT_FONDO_ALT, C.NT_SUBTOTAL, 'NEUROTEA');
  row = result.row; filasSubtotalesEgresosNT.push(result.filaSubtotal);

  // EVENTOS NT (especial)
  result = escribirSeccionEventos(sheet, row, C.NT_FONDO_ALT, C.NT_SUBTOTAL);
  row = result.row; filasSubtotalesEgresosNT.push(result.filaSubtotal);

  result = escribirSeccionPresupuesto(sheet, row, '▶ VARIABLES', VARIABLES_PRESUP_NT, 'Egreso', C.NT_FONDO_ALT, C.NT_SUBTOTAL, 'NEUROTEA');
  row = result.row; filasSubtotalesEgresosNT.push(result.filaSubtotal);

  // TOTAL EGRESOS NT (sin ganancia)
  sheet.getRange(row, 1).setValue('📤 TOTAL EGRESOS NEUROTEA').setFontWeight('bold').setFontSize(11);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    const sumaFilas = filasSubtotalesEgresosNT.map(f => `${colLetra}${f}`).join('+');
    sheet.getRange(row, col).setFormula(`=${sumaFilas}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.ROJO_FONDO);
  const filaTotalEgresosNT = row;
  row += 2;

  // ═══════════════════════════════════════════════════════════════════
  // GANANCIA NT (CALCULADA AUTOMÁTICAMENTE)
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 16).merge()
    .setValue(`▶ GANANCIA NEUROTEA (META ${METAS_NT.GANANCIA_MINIMA_PCT}%)`)
    .setFontWeight('bold').setBackground(C.GANANCIA_FONDO);
  row++;

  // Ganancia Calculada = Ingresos - Egresos
  sheet.getRange(row, 1).setValue('Ganancia Calculada').setFontWeight('bold');
  sheet.getRange(row, 2).setValue('Calculado');
  sheet.getRange(row, 3).setValue('-');
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=${colLetra}${filaTotalIngresosNT}-${colLetra}${filaTotalEgresosNT}`);
  }
  const filaGananciaCalculada = row;
  row++;

  // % Ganancia = Ganancia / Ingresos
  sheet.getRange(row, 1).setValue('% Ganancia').setFontWeight('bold');
  sheet.getRange(row, 2).setValue('Calculado');
  sheet.getRange(row, 3).setValue('-');
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=IFERROR(${colLetra}${filaGananciaCalculada}/${colLetra}${filaTotalIngresosNT};0)`);
  }
  sheet.getRange(row, 4, 1, 13).setNumberFormat('0.00%');
  const filaPctGanancia = row;
  row++;

  // Semáforo de estado
  // v7.6: Usa referencia a CONFIG!$B$43 (Meta Ganancia Mínima %) en lugar de valor hardcodeado
  sheet.getRange(row, 1).setValue('Estado Meta').setFontWeight('bold');
  sheet.getRange(row, 2).setValue('Calculado');
  sheet.getRange(row, 3).setValue('-');
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    // Semáforo: <0% = Rojo (Pérdida), 0-META% = Amarillo, >=META% = Verde
    // FIX: Usar VALUE() para comparación numérica
    sheet.getRange(row, col).setFormula(
      `=IF(${colLetra}${filaPctGanancia}<0;"🔴 PÉRDIDA";IF(${colLetra}${filaPctGanancia}<VALUE(CONFIG!$B$43)/100;"🟡 <"&CONFIG!$B$43&"%";"🟢 META"))`
    );
  }
  const filaEstadoMeta = row;
  row++;

  // Distribución de ganancia
  // v7.22: Simplificado - dividir ganancia entre 3 si es positiva
  const distItems = [
    { nombre: '→ Utilidad al propietario (33,33%)' },
    { nombre: '→ Fondo de emergencia (33,33%)' },
    { nombre: '→ Fondo de Inversión (33,34%)' }
  ];
  distItems.forEach(item => {
    sheet.getRange(row, 1).setValue(item.nombre).setFontStyle('italic');
    sheet.getRange(row, 2).setValue('Calculado');
    sheet.getRange(row, 3).setValue('-');
    for (let col = 4; col <= 16; col++) {
      const colLetra = String.fromCharCode(64 + col);
      sheet.getRange(row, col).setFormula(
        `=IF(${colLetra}${filaGananciaCalculada}>0;${colLetra}${filaGananciaCalculada}/3;0)`
      );
    }
    row++;
  });
  row++;

  // BALANCE NT = Ingresos - Egresos (igual a Ganancia)
  sheet.getRange(row, 1).setValue('💰 BALANCE NEUROTEA').setFontWeight('bold').setFontSize(11);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=${colLetra}${filaGananciaCalculada}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.GANANCIA_FONDO);
  const filaBalanceNT = row;
  row += 2;

  // BALANCE CONSOLIDADO FAM + NT
  sheet.getRange(row, 1).setValue('🔄 BALANCE TOTAL CONSOLIDADO FAM/NT').setFontWeight('bold').setFontSize(12);
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=${colLetra}${filaBalanceFam}+${colLetra}${filaBalanceNT}`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(C.BALANCE_FONDO);

  // ═══════════════════════════════════════════════════════════════════
  // FORMATO FINAL
  // ═══════════════════════════════════════════════════════════════════

  // Formato de números
  sheet.getRange('D:P').setNumberFormat('#,##0');

  // Restaurar formato % en fila de porcentaje
  sheet.getRange(filaPctGanancia, 4, 1, 13).setNumberFormat('0.00%');

  // Anchos de columna
  sheet.setColumnWidth(1, 300);
  sheet.setColumnWidth(2, 80);
  sheet.setColumnWidth(3, 80);
  for (let i = 4; i <= 15; i++) sheet.setColumnWidth(i, 85);
  sheet.setColumnWidth(16, 100);

  sheet.setFrozenRows(4);

  return sheet;
}

function escribirSeccionPresupuesto(sheet, row, titulo, items, tipo, colorFondo, colorSubtotal, entidad) {
  // v7.33: entidad agregada para pasar a obtenerReferenciaReserva
  // Título de sección
  sheet.getRange(row, 1, 1, 16).merge()
    .setValue(titulo)
    .setFontWeight('bold')
    .setBackground(colorFondo);
  row++;

  const filaInicio = row; // Guardar fila inicio para subtotales

  // Items
  items.forEach(item => {
    // v7.33: Reservas usan fórmula referenciando fuente de verdad, pasando entidad para desambiguar
    const refReserva = obtenerReferenciaReserva(item.concepto, entidad);
    if (refReserva) {
      sheet.getRange(row, 1).setFormula(refReserva);
    } else {
      sheet.getRange(row, 1).setValue(item.concepto);
    }
    sheet.getRange(row, 2).setValue(tipo);
    sheet.getRange(row, 3).setValue(item.frecuencia);

    // Valores mensuales
    const monto = item.monto || 0;
    const esMensual = item.frecuencia && item.frecuencia.includes('Mensual');
    const esReserva = item.concepto.includes('Reserva');

    if (!esReserva && monto > 0) {
      for (let m = 4; m <= 15; m++) {
        if (esMensual) {
          sheet.getRange(row, m).setValue(monto);
        }
      }
    }
    // Total año por fila (siempre, para que sume lo que el usuario ingrese)
    sheet.getRange(row, 16).setFormula(`=SUM(D${row}:O${row})`);
    row++;
  });

  const filaFin = row - 1;

  // Subtotal con fórmulas SUM() para cada columna
  sheet.getRange(row, 1).setValue('Subtotal ' + titulo.replace('▶ ', '')).setFontWeight('bold').setFontStyle('italic');
  // Fórmulas para meses (D-O) y total año (P)
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col); // D=68, E=69, etc.
    sheet.getRange(row, col).setFormula(`=SUM(${colLetra}${filaInicio}:${colLetra}${filaFin})`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(colorSubtotal);
  const filaSubtotal = row;
  row++;

  // Devolver objeto con fila siguiente y fila del subtotal (para totales)
  return { row: row, filaSubtotal: filaSubtotal };
}

function escribirSeccionEventos(sheet, row, colorFondo, colorSubtotal) {
  // v7.7: Actualizado a 18 eventos (6 definidos + 12 reservas)
  sheet.getRange(row, 1, 1, 16).merge()
    .setValue('▶ EVENTOS (6 definidos + 12 reservas)')
    .setFontWeight('bold')
    .setBackground(colorFondo);
  row++;

  const filaInicio = row;

  EVENTOS_NT.forEach(evento => {
    // v7.33: Reservas de eventos referencian CONFIG dinámicamente (siempre NEUROTEA)
    const refReserva = obtenerReferenciaReserva(evento.nombre, 'NEUROTEA');
    if (refReserva) {
      sheet.getRange(row, 1).setFormula(refReserva);
    } else {
      sheet.getRange(row, 1).setValue(evento.nombre);
    }
    sheet.getRange(row, 2).setValue('Egreso');
    sheet.getRange(row, 3).setValue(evento.mes);
    sheet.getRange(row, 16).setFormula(`=SUM(D${row}:O${row})`);
    row++;
  });

  const filaFin = row - 1;

  // Subtotal con fórmulas SUM()
  sheet.getRange(row, 1).setValue('Subtotal EVENTOS').setFontWeight('bold').setFontStyle('italic');
  for (let col = 4; col <= 16; col++) {
    const colLetra = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=SUM(${colLetra}${filaInicio}:${colLetra}${filaFin})`);
  }
  sheet.getRange(row, 1, 1, 16).setBackground(colorSubtotal);
  const filaSubtotal = row;
  row++;

  return { row: row, filaSubtotal: filaSubtotal };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. HOJA GASTOS_FIJOS - Lista Maestra SIMPLIFICADA (sin BASE)
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaGASTOS_FIJOS() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.GASTOS_FIJOS);
  const C = COLORES;

  // ─── HEADER PRINCIPAL ───
  // Nueva estructura SIMPLIFICADA: 18 columnas (A-R) sin BASE
  sheet.getRange('A1:R1').merge()
    .setValue('📋 GASTOS FIJOS - LISTA MAESTRA')
    .setFontSize(16).setFontWeight('bold')
    .setBackground(C.HEADER_DARK).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:R2').merge()
    .setValue('DÍA = día del mes que vence | CUENTA = cuenta desde donde se paga | Ingrese el monto en cada mes que corresponda')
    .setFontSize(10).setFontColor(C.TEXTO_CLARO).setFontStyle('italic');

  // ─── HEADERS DE COLUMNAS ───
  // Estructura SIMPLIFICADA: CONCEPTO, ENTIDAD, CATEGORÍA, FRECUENCIA, DÍA, CUENTA, ENE-DIC (sin BASE)
  const headers = ['CONCEPTO', 'ENTIDAD', 'CATEGORÍA', 'FRECUENCIA', 'DÍA', 'CUENTA', ...MESES_CORTOS];
  headers.forEach((h, i) => {
    sheet.getRange(4, i + 1)
      .setValue(h)
      .setFontWeight('bold')
      .setBackground(C.GRIS_FONDO)
      .setHorizontalAlignment('center');
  });

  let row = 6;

  // ═══════════════════════════════════════════════════════════════════
  // GASTOS FIJOS FAMILIA
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 18).merge()
    .setValue('═══════════════  🏠 GASTOS FIJOS FAMILIA  ═══════════════')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.FAM_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row += 2;

  // Combinar todos los gastos familia
  const todosGastosFamilia = [
    ...GASTOS_FIJOS_FAM,
    ...CUOTAS_FAM,
    ...OBLIGACIONES_FAM,
    ...SUSCRIPCIONES_FAM
  ];

  todosGastosFamilia.forEach(gasto => {
    sheet.getRange(row, 1).setValue(gasto.concepto);
    sheet.getRange(row, 2).setValue('FAMILIA');
    sheet.getRange(row, 3).setValue(gasto.categoria);
    sheet.getRange(row, 4).setValue(gasto.frecuencia);
    sheet.getRange(row, 5).setValue(gasto.dia).setHorizontalAlignment('center');
    sheet.getRange(row, 6).setValue(gasto.cuenta || ''); // CUENTA (columna F)
    // Meses empiezan en columna G (sin BASE)
    // El monto inicial se pone en ENERO (columna G) si existe
    if (gasto.monto > 0) {
      sheet.getRange(row, 7).setValue(gasto.monto).setNumberFormat('#,##0'); // ENE
    }

    // Validación para CUENTA (columna F) - dropdown de cuentas FAMILIA
    sheet.getRange(row, 6).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CUENTAS_FAMILIA, true)
        .setAllowInvalid(false)
        .build()
    );

    if (!gasto.concepto.includes('Reserva')) {
      sheet.getRange(row, 1, 1, 18).setBackground(C.FAM_FONDO_ALT);
    }
    row++;
  });

  row += 2;

  // ═══════════════════════════════════════════════════════════════════
  // GASTOS FIJOS NEUROTEA
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 18).merge()
    .setValue('═══════════════  🏥 GASTOS FIJOS NEUROTEA  ═══════════════')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row += 2;

  // v7.7: EVENTOS ahora está en GASTOS_FIJOS (antes estaba solo en CARGA_NT)
  const todosGastosNT = [
    ...CLINICA_NT,
    ...SUELDOS_NT,
    ...TELEFONIA_NT,
    ...OBLIGACIONES_NT,
    ...EVENTOS_GASTOS_NT  // v7.7: EVENTOS agregado a GASTOS_FIJOS
  ];

  todosGastosNT.forEach(gasto => {
    // v7.20: EVENTOS reserves referencian CONFIG (fuente de verdad)
    // Otros reserves (Clínica, Sueldos, etc.) quedan como texto (GF es la fuente)
    if (gasto.concepto.includes('Reserva Evento')) {
      const eventosNombres = EVENTOS_NT.map(e => e.nombre);
      const idxEvt = eventosNombres.indexOf(gasto.concepto);
      if (idxEvt >= 0) {
        sheet.getRange(row, 1).setFormula(`=CONFIG!$I$${21 + idxEvt}`);
      } else {
        sheet.getRange(row, 1).setValue(gasto.concepto);
      }
    } else {
      sheet.getRange(row, 1).setValue(gasto.concepto);
    }
    sheet.getRange(row, 2).setValue('NEUROTEA');
    sheet.getRange(row, 3).setValue(gasto.categoria);
    sheet.getRange(row, 4).setValue(gasto.frecuencia);
    sheet.getRange(row, 5).setValue(gasto.dia).setHorizontalAlignment('center');
    sheet.getRange(row, 6).setValue(gasto.cuenta || ''); // CUENTA (columna F)
    // Meses empiezan en columna G (sin BASE)
    if (gasto.monto > 0) {
      sheet.getRange(row, 7).setValue(gasto.monto).setNumberFormat('#,##0'); // ENE
    }

    // Validación para CUENTA (columna F) - dropdown de cuentas NT
    sheet.getRange(row, 6).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CUENTAS_NT, true)
        .setAllowInvalid(false)
        .build()
    );

    if (!gasto.concepto.includes('Reserva')) {
      sheet.getRange(row, 1, 1, 18).setBackground(C.NT_FONDO_ALT);
    }
    row++;
  });

  // Formato de números (meses son G-R, sin BASE)
  sheet.getRange('G:R').setNumberFormat('#,##0');

  // Anchos de columna
  sheet.setColumnWidth(1, 250);  // CONCEPTO
  sheet.setColumnWidth(2, 90);   // ENTIDAD
  sheet.setColumnWidth(3, 150);  // CATEGORÍA
  sheet.setColumnWidth(4, 110);  // FRECUENCIA
  sheet.setColumnWidth(5, 50);   // DÍA
  sheet.setColumnWidth(6, 130);  // CUENTA
  for (let i = 7; i <= 18; i++) sheet.setColumnWidth(i, 85); // ENE-DIC

  sheet.setFrozenRows(4);

  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. HOJA CARGA_FAMILIA - Variables Puros (Sistema Anti-Burro)
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaCARGA_FAMILIA() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.CARGA_FAMILIA);
  const C = COLORES;

  // ─── HEADER PRINCIPAL ───
  sheet.getRange('A1:J1').merge()
    .setValue('👨‍👩‍👧‍👦 CARGA FAMILIA - Variables y Ahorro')
    .setFontSize(16).setFontWeight('bold')
    .setBackground(C.FAM_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:H2').merge()
    .setValue('VARIABLES puros (Supermercado, Combustible) y AHORRO (Clara, Marco, Fondo Emergencia). Los fijos van en GASTOS_FIJOS.')
    .setFontSize(10).setFontColor(C.TEXTO_CLARO).setFontStyle('italic');

  // v7.27: Filtro por mes
  sheet.getRange('I2').setValue('📅 Filtro:')
    .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('right');
  sheet.getRange('J2').setValue('TODOS')
    .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center')
    .setBackground('#e0f2fe').setBorder(true, true, true, true, false, false, '#93c5fd', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange('J2').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['TODOS', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], true)
      .setAllowInvalid(false)
      .build()
  );

  // ─── HEADERS DE COLUMNAS ───
  // v7.12: Columna I = LINK_ID para vincular transacciones cruzadas (préstamos/devoluciones)
  // v7.26: Columna J = VÁLIDO - indica si la fila será contada en TABLERO
  const headers = ['FECHA', 'TIPO', 'CATEGORÍA', 'SUBCATEGORÍA', 'DESCRIPCIÓN', 'MONTO', 'CUENTA', 'NOTAS', 'LINK_ID', 'VÁLIDO'];

  headers.forEach((h, i) => {
    sheet.getRange(3, i + 1)
      .setValue(h)
      .setFontWeight('bold')
      .setBackground(C.FAM_FONDO)
      .setHorizontalAlignment('center')
      .setBorder(true, true, true, true, false, false, C.FAM_BORDER, SpreadsheetApp.BorderStyle.SOLID);
  });

  // ─── VALIDACIONES ───
  aplicarValidacionesCargaFamilia(sheet);

  // ─── FORMATO ───
  sheet.getRange('A4:A500').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('F4:F500').setNumberFormat('#,##0');

  // Anchos de columna
  sheet.setColumnWidth(1, 90);   // FECHA
  sheet.setColumnWidth(2, 180);  // TIPO
  sheet.setColumnWidth(3, 150);  // CATEGORÍA
  sheet.setColumnWidth(4, 200);  // SUBCATEGORÍA
  sheet.setColumnWidth(5, 200);  // DESCRIPCIÓN
  sheet.setColumnWidth(6, 110);  // MONTO
  sheet.setColumnWidth(7, 130);  // CUENTA
  sheet.setColumnWidth(8, 150);  // NOTAS
  sheet.setColumnWidth(9, 140);  // LINK_ID (v7.12)
  sheet.setColumnWidth(10, 80);  // VÁLIDO (v7.26)

  // v7.26: Fórmula ARRAYFORMULA en J4 que valida cada fila
  // Validaciones VÁLIDO (v7.34):
  // 1. MONTH(fecha) válido  2. YEAR = 2026  3. MONTO numérico
  // 4. TIPO no vacío  5. Egreso con CATEGORÍA="-"  6. Egreso VARIABLES con SUBCATEGORÍA vacía
  // v7.34: Simplificado - no usa COUNTIF contra CONFIG (fallaba con datos pegados)
  const formulaValido = '=ARRAYFORMULA(IF(A4:A500="";"";IF(IFERROR(MONTH(A4:A500);0)=0;"⚠ Fecha";IF(IFERROR(YEAR(A4:A500);0)<>' + AÑO + ';"⚠ Año";IF((F4:F500="")+(NOT(ISNUMBER(F4:F500)))>0;"⚠ Monto";IF(B4:B500="";"⚠ Tipo";IF((B4:B500="Egreso Familiar")*(C4:C500="-")>0;"⚠ Cat";IF((B4:B500="Egreso Familiar")*(C4:C500="VARIABLES")*((D4:D500="")+(D4:D500="-"))>0;"⚠ Subcat";"✓"))))))))';
  sheet.getRange('J4').setFormula(formulaValido);
  sheet.getRange('J4:J500').setHorizontalAlignment('center');

  sheet.setFrozenRows(3);

  // Formato condicional para ingresos (verde) y egresos (rojo)
  aplicarFormatoCondicionalCarga(sheet, 'FAMILIA');

  return sheet;
}

function aplicarValidacionesCargaFamilia(sheet) {
  // TIPO: Ingresos + Egreso Familiar + Ahorro (separado)
  const tipos = [...TIPOS_INGRESO_FAMILIA, 'Egreso Familiar', TIPO_AHORRO];

  // TIPO (columna B) - v7.15: setAllowInvalid(true) permite auto-creación de préstamos
  sheet.getRange('B4:B500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(tipos, true)
      .setAllowInvalid(true)  // Permite valores no en lista (para auto-creación)
      .build()
  );

  // CATEGORÍA (columna C) - solo VARIABLES (para egresos) y opciones de AHORRO
  // v7.7: Se eliminaron GASTOS FIJOS, CUOTAS, OBLIGACIONES, SUSCRIPCIONES (van en GASTOS_FIJOS)
  sheet.getRange('C4:C500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['-', ...CARGA_CATEGORIAS_FAMILIA, ...CATEGORIAS_AHORRO_FAMILIA], true)
      .setAllowInvalid(false)
      .build()
  );

  // SUBCATEGORÍA (columna D) - solo VARIABLES (AHORRO usa CATEGORÍA)
  // v7.24: Usa requireValueInList para compatibilidad con copy-paste desde otros sheets
  // (requireValueInRange no reconocía valores pegados como texto)
  sheet.getRange('D4:D500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(VARIABLES_FAMILIA, true)
      .setAllowInvalid(true)  // Permite '-' y valores vacíos
      .build()
  );

  // CUENTA (columna G)
  sheet.getRange('G4:G500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CUENTAS_FAMILIA, true)
      .setAllowInvalid(false)
      .build()
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. HOJA CARGA_NT - Variables + Eventos (Sistema Anti-Burro)
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaCARGA_NT() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.CARGA_NT);
  const C = COLORES;

  // ─── HEADER PRINCIPAL ───
  sheet.getRange('A1:J1').merge()
    .setValue('🏥 CARGA NEUROTEA - Variables')
    .setFontSize(16).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  sheet.getRange('A2:H2').merge()
    .setValue('Solo para gastos VARIABLES puros. Los gastos fijos y EVENTOS van en GASTOS_FIJOS.')
    .setFontSize(10).setFontColor(C.TEXTO_CLARO).setFontStyle('italic');

  // v7.27: Filtro por mes
  sheet.getRange('I2').setValue('📅 Filtro:')
    .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('right');
  sheet.getRange('J2').setValue('TODOS')
    .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center')
    .setBackground('#e0f2fe').setBorder(true, true, true, true, false, false, '#93c5fd', SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange('J2').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['TODOS', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], true)
      .setAllowInvalid(false)
      .build()
  );

  // ─── HEADERS DE COLUMNAS ───
  // v7.12: Columna I = LINK_ID para vincular transacciones cruzadas (préstamos/devoluciones)
  // v7.26: Columna J = VÁLIDO - indica si la fila será contada en TABLERO
  const headers = ['FECHA', 'TIPO', 'CATEGORÍA', 'SUBCAT/EVENTO', 'DESCRIPCIÓN', 'MONTO', 'CUENTA', 'NOTAS', 'LINK_ID', 'VÁLIDO'];

  headers.forEach((h, i) => {
    sheet.getRange(3, i + 1)
      .setValue(h)
      .setFontWeight('bold')
      .setBackground(C.NT_FONDO)
      .setHorizontalAlignment('center')
      .setBorder(true, true, true, true, false, false, C.NT_BORDER, SpreadsheetApp.BorderStyle.SOLID);
  });

  // ─── VALIDACIONES ───
  aplicarValidacionesCargaNT(sheet);

  // ─── FORMATO ───
  sheet.getRange('A4:A500').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('F4:F500').setNumberFormat('#,##0');

  // Anchos de columna
  sheet.setColumnWidth(1, 90);   // FECHA
  sheet.setColumnWidth(2, 180);  // TIPO
  sheet.setColumnWidth(3, 150);  // CATEGORÍA
  sheet.setColumnWidth(4, 180);  // SUBCAT/EVENTO
  sheet.setColumnWidth(5, 200);  // DESCRIPCIÓN
  sheet.setColumnWidth(6, 110);  // MONTO
  sheet.setColumnWidth(7, 130);  // CUENTA
  sheet.setColumnWidth(8, 150);  // NOTAS
  sheet.setColumnWidth(9, 140);  // LINK_ID (v7.12)
  sheet.setColumnWidth(10, 80);  // VÁLIDO (v7.26)

  // Validaciones VÁLIDO (v7.34): fecha, año, monto, tipo, categoría, subcategoría
  // v7.34: Simplificado - no usa COUNTIF contra CONFIG (fallaba con datos pegados)
  const formulaValido = '=ARRAYFORMULA(IF(A4:A500="";"";IF(IFERROR(MONTH(A4:A500);0)=0;"⚠ Fecha";IF(IFERROR(YEAR(A4:A500);0)<>' + AÑO + ';"⚠ Año";IF((F4:F500="")+(NOT(ISNUMBER(F4:F500)))>0;"⚠ Monto";IF(B4:B500="";"⚠ Tipo";IF((B4:B500="Egreso NT")*(C4:C500="-")>0;"⚠ Cat";IF((B4:B500="Egreso NT")*(C4:C500="VARIABLES")*((D4:D500="")+(D4:D500="-"))>0;"⚠ Subcat";"✓"))))))))';
  sheet.getRange('J4').setFormula(formulaValido);
  sheet.getRange('J4:J500').setHorizontalAlignment('center');

  sheet.setFrozenRows(3);

  // Formato condicional
  aplicarFormatoCondicionalCarga(sheet, 'NEUROTEA');

  return sheet;
}

function aplicarValidacionesCargaNT(sheet) {
  const tipos = [...TIPOS_INGRESO_NT, 'Egreso NT'];

  // TIPO (columna B) - v7.15: setAllowInvalid(true) permite auto-creación de préstamos
  sheet.getRange('B4:B500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(tipos, true)
      .setAllowInvalid(true)  // Permite valores no en lista (para auto-creación)
      .build()
  );

  // CATEGORÍA (columna C) - solo VARIABLES (EVENTOS y otros van en GASTOS_FIJOS)
  // v7.7: Se eliminaron CLÍNICA, SUELDOS, TELEFONÍA, OBLIGACIONES, EVENTOS
  sheet.getRange('C4:C500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['-', ...CARGA_CATEGORIAS_NT], true)
      .setAllowInvalid(false)
      .build()
  );

  // SUBCATEGORÍA (columna D) - solo VARIABLES_NT (EVENTOS se eliminaron - van en GASTOS_FIJOS)
  // v7.24: Usa requireValueInList para compatibilidad con copy-paste desde otros sheets
  sheet.getRange('D4:D500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(VARIABLES_NT, true)
      .setAllowInvalid(true)  // Permite '-' y valores vacíos
      .build()
  );

  // CUENTA (columna G)
  sheet.getRange('G4:G500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(CUENTAS_NT, true)
      .setAllowInvalid(false)
      .build()
  );
}

function aplicarFormatoCondicionalCarga(sheet, entidad) {
  const C = COLORES;
  const color = entidad === 'FAMILIA' ? C.FAM_FONDO : C.NT_FONDO;

  // Alternar colores de filas (v7.26: extendido a columna J)
  const reglaAlternada = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=ISEVEN(ROW())')
    .setBackground(color)
    .setRanges([sheet.getRange('A4:J500')])
    .build();

  // v7.26: Columna VÁLIDO - resaltar filas con problemas
  // Fila completa en rojo claro si VÁLIDO muestra ⚠
  const reglaFilaInvalida = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=LEFT($J4;1)="⚠"')
    .setBackground('#fde8e8')  // Rojo muy claro
    .setFontColor('#991b1b')   // Rojo oscuro
    .setRanges([sheet.getRange('A4:J500')])
    .build();

  // Columna J: ✓ en verde
  const reglaValido = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('✓')
    .setFontColor(C.VERDE)
    .setRanges([sheet.getRange('J4:J500')])
    .build();

  // Columna J: ⚠ en rojo
  const reglaInvalido = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=LEFT(J4;1)="⚠"')
    .setFontColor('#dc2626')
    .setBold(true)
    .setRanges([sheet.getRange('J4:J500')])
    .build();

  // Orden: reglas específicas primero, luego alternada
  sheet.setConditionalFormatRules([reglaFilaInvalida, reglaInvalido, reglaValido, reglaAlternada]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. HOJA MOVIMIENTO - Real vs Presupuesto (SIMPLIFICADO v5.1)
// Nueva estructura: Con DÍA y RESUMEN para TABLERO/LIQUIDEZ
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaMOVIMIENTO() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.MOVIMIENTO);
  const C = COLORES;

  // ─── HEADER PRINCIPAL ───
  sheet.getRange('A1:L1').merge()
    .setValue('📈 MOVIMIENTO - Real vs Presupuesto')
    .setFontSize(16).setFontWeight('bold')
    .setBackground(C.HEADER_DARK).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  // ─── SELECTOR DE MES ───
  sheet.getRange('A3').setValue('📅 MES:').setFontWeight('bold');
  sheet.getRange('B3').setValue('Enero').setBackground(C.GANANCIA_FONDO);
  sheet.getRange('B3').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(MESES, true)
      .build()
  );

  // Número de mes calculado (oculto en M3)
  sheet.getRange('M3').setValue('MES_NUM:').setFontColor(C.TEXTO_CLARO);
  sheet.getRange('N3').setFormula('=MATCH(B3;{"Enero";"Febrero";"Marzo";"Abril";"Mayo";"Junio";"Julio";"Agosto";"Septiembre";"Octubre";"Noviembre";"Diciembre"};0)');

  sheet.getRange('D3').setValue('Hoy:').setFontWeight('bold');
  sheet.getRange('E3').setFormula('=TODAY()').setNumberFormat('dd/mm/yyyy');

  // ─── HEADERS DE COLUMNAS (con DÍA, CATEGORÍA, ENTIDAD y CUENTA) ───
  // A=CONCEPTO, B=TIPO, C=FREC, D=DÍA, E=PRESUP, F=REAL, G=DIF, H=%, I=ESTADO, J=EST.PAGO, K=🚦, L=CATEGORÍA, M=ENTIDAD, N=CUENTA (ocultas)
  const headers = ['CONCEPTO', 'TIPO', 'FREC.', 'DÍA', 'PRESUPUESTO', 'REAL', 'DIFERENCIA', '%', 'ESTADO', 'EST. PAGO', '🚦', 'CATEGORÍA', 'ENTIDAD', 'CUENTA'];
  headers.forEach((h, i) => {
    sheet.getRange(5, i + 1)
      .setValue(h)
      .setFontWeight('bold')
      .setBackground(C.GRIS_FONDO)
      .setHorizontalAlignment('center');
  });
  // Ocultar columnas L-N (CATEGORÍA, ENTIDAD, CUENTA) - solo para cálculos internos
  sheet.hideColumns(12, 3);

  let row = 7;
  const filaInicioFam = 9; // Primera fila de datos FAMILIA

  // ═══════════════════════════════════════════════════════════════════
  // FAMILIA
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 11).merge()
    .setValue('═══════════════  🏠 FAMILIA  ═══════════════')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.FAM_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row += 2;

  // Ingresos Familia (vienen de CARGA_FAMILIA - son variables puros)
  row = escribirSeccionMovimientoIngresos(sheet, row, '▶ INGRESOS FAMILIA', INGRESOS_FAMILIA, 'FAMILIA', C.FAM_FONDO, C.FAM_SUBTOTAL);

  // Egresos Familia (vienen de GASTOS_FIJOS o CARGA según frecuencia)
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ GASTOS FIJOS', GASTOS_FIJOS_FAM, 'FAMILIA', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL);
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ CUOTAS Y PRÉSTAMOS', CUOTAS_FAM, 'FAMILIA', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL);
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ OBLIGACIONES LEGALES', OBLIGACIONES_FAM, 'FAMILIA', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL);
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ SUSCRIPCIONES', SUSCRIPCIONES_FAM, 'FAMILIA', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL);
  row = escribirSeccionMovimientoVariables(sheet, row, '▶ VARIABLES', VARIABLES_PRESUP_FAM, 'FAMILIA', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL);
  row = escribirSeccionMovimientoAhorro(sheet, row, '▶ AHORRO', AHORRO_FAM, 'FAMILIA', C.FAM_FONDO_ALT, C.FAM_SUBTOTAL);

  const filaFinFam = row - 1;

  // ═══════════════════════════════════════════════════════════════════
  // RESUMEN FAMILIA (para que TABLERO y LIQUIDEZ lean directamente)
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 11).merge()
    .setValue('📊 RESUMEN FAMILIA')
    .setFontSize(11).setFontWeight('bold')
    .setBackground(C.FAM_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row++;

  // v7.14: Textos únicos para que TABLERO use INDEX/MATCH
  // v7.36: Agregadas fórmulas columna E (PRESUPUESTO) para consistencia con TABLERO
  // TOTAL INGRESOS FAMILIA
  sheet.getRange(row, 1).setValue('📥 TOTAL INGRESOS FAMILIA');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUMIF(B${filaInicioFam}:B${filaFinFam};"Ingreso";E${filaInicioFam}:E${filaFinFam});0)`); // PRESUP
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIF(B${filaInicioFam}:B${filaFinFam};"Ingreso";F${filaInicioFam}:F${filaFinFam});0)`); // REAL
  sheet.getRange(row, 1, 1, 11).setBackground(C.VERDE_FONDO);
  const filaTotalIngresosFam = row;
  row++;

  // TOTAL EGRESOS PAGADOS FAMILIA (solo gastos reales, sin AHORRO)
  // Presupuesto = TODOS los egresos, porque presupuesto no tiene estado de pago
  sheet.getRange(row, 1).setValue('📤 TOTAL EGRESOS PAGADOS FAMILIA');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUMIF(B${filaInicioFam}:B${filaFinFam};"Egreso";E${filaInicioFam}:E${filaFinFam});0)`); // PRESUP (todos)
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIFS(F${filaInicioFam}:F${filaFinFam};B${filaInicioFam}:B${filaFinFam};"Egreso";J${filaInicioFam}:J${filaFinFam};"Pagado");0)`); // REAL (pagados)
  sheet.getRange(row, 1, 1, 11).setBackground(C.ROJO_FONDO);
  const filaTotalEgresosPagadosFam = row;
  row++;

  // TOTAL AHORRO FAMILIA (suma de TIPO="Ahorro" con EST.PAGO="Ahorrado")
  sheet.getRange(row, 1).setValue('💰 TOTAL AHORRO FAMILIA');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUMIF(B${filaInicioFam}:B${filaFinFam};"Ahorro";E${filaInicioFam}:E${filaFinFam});0)`); // PRESUP
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIF(B${filaInicioFam}:B${filaFinFam};"Ahorro";F${filaInicioFam}:F${filaFinFam});0)`); // REAL
  sheet.getRange(row, 1, 1, 11).setBackground(C.VERDE_FONDO);
  const filaTotalAhorroFam = row;
  row++;

  // TOTAL EGRESOS PENDIENTES FAMILIA
  sheet.getRange(row, 1).setValue('⏳ TOTAL EGRESOS PENDIENTES FAMILIA');
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIFS(F${filaInicioFam}:F${filaFinFam};B${filaInicioFam}:B${filaFinFam};"Egreso";J${filaInicioFam}:J${filaFinFam};"Pendiente");0)`);
  sheet.getRange(row, 1, 1, 11).setBackground(C.AMARILLO_FONDO);
  const filaTotalEgresosPendientesFam = row;
  row++;

  // SALDO DISPONIBLE FAMILIA (Ingresos - Gastos - Ahorro)
  sheet.getRange(row, 1).setValue('💵 SALDO DISPONIBLE FAMILIA').setFontWeight('bold');
  sheet.getRange(row, 6).setFormula(`=F${filaTotalIngresosFam}-F${filaTotalEgresosPagadosFam}-F${filaTotalAhorroFam}`).setFontWeight('bold');
  sheet.getRange(row, 9).setFormula(`=IF(F${row}>=0;"✓ OK";"⚠ DÉFICIT")`);
  sheet.getRange(row, 1, 1, 11).setBackground(C.GANANCIA_FONDO);
  const filaSaldoDisponibleFam = row;
  row++;

  // SALDO FIN DE MES FAMILIA (Disponible - Pendientes)
  sheet.getRange(row, 1).setValue('📉 SALDO FIN DE MES FAMILIA').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 6).setFormula(`=F${filaSaldoDisponibleFam}-F${filaTotalEgresosPendientesFam}`).setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 9).setFormula(`=IF(F${row}>=0;"✓ OK";"⚠ DÉFICIT")`);
  sheet.getRange(row, 1, 1, 11).setBackground(C.BALANCE_FONDO);
  const filaSaldoProyectadoFam = row;
  row += 3;

  const filaInicioNT = row + 2; // +2 por el header y la fila vacía

  // ═══════════════════════════════════════════════════════════════════
  // NEUROTEA
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 11).merge()
    .setValue('═══════════════  🏥 NEUROTEA  ═══════════════')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row += 2;

  // Ingresos NT (vienen de CARGA_NT - son variables puros)
  row = escribirSeccionMovimientoIngresos(sheet, row, '▶ INGRESOS NEUROTEA', INGRESOS_NT, 'NEUROTEA', C.NT_FONDO, C.NT_SUBTOTAL);

  // Egresos NT (vienen de GASTOS_FIJOS o CARGA según frecuencia)
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ CLÍNICA', CLINICA_NT, 'NEUROTEA', C.NT_FONDO_ALT, C.NT_SUBTOTAL);
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ SUELDOS Y HONORARIOS', SUELDOS_NT, 'NEUROTEA', C.NT_FONDO_ALT, C.NT_SUBTOTAL);
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ TELEFONÍA E INTERNET', TELEFONIA_NT, 'NEUROTEA', C.NT_FONDO_ALT, C.NT_SUBTOTAL);
  row = escribirSeccionMovimientoEgresos(sheet, row, '▶ OBLIGACIONES LEGALES', OBLIGACIONES_NT, 'NEUROTEA', C.NT_FONDO_ALT, C.NT_SUBTOTAL);

  // Eventos NT
  row = escribirSeccionMovimientoEventos(sheet, row, C.NT_FONDO_ALT, C.NT_SUBTOTAL);

  row = escribirSeccionMovimientoVariables(sheet, row, '▶ VARIABLES NT', VARIABLES_PRESUP_NT, 'NEUROTEA', C.NT_FONDO_ALT, C.NT_SUBTOTAL);

  const filaFinNT = row - 1;

  // ═══════════════════════════════════════════════════════════════════
  // RESUMEN NEUROTEA (para que TABLERO y LIQUIDEZ lean directamente)
  // ═══════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 11).merge()
    .setValue('📊 RESUMEN NEUROTEA')
    .setFontSize(11).setFontWeight('bold')
    .setBackground(C.NT_HEADER).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');
  row++;

  // v7.14: Textos únicos para que TABLERO use INDEX/MATCH
  // v7.36: Agregadas fórmulas columna E (PRESUPUESTO) para consistencia con TABLERO
  // TOTAL INGRESOS NT
  sheet.getRange(row, 1).setValue('📥 TOTAL INGRESOS NT');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUMIF(B${filaInicioNT}:B${filaFinNT};"Ingreso";E${filaInicioNT}:E${filaFinNT});0)`); // PRESUP
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIF(B${filaInicioNT}:B${filaFinNT};"Ingreso";F${filaInicioNT}:F${filaFinNT});0)`); // REAL
  sheet.getRange(row, 1, 1, 11).setBackground(C.VERDE_FONDO);
  const filaTotalIngresosNT = row;
  row++;

  // TOTAL EGRESOS PAGADOS NT (Presupuesto = TODOS los egresos, porque presupuesto no tiene estado de pago)
  sheet.getRange(row, 1).setValue('📤 TOTAL EGRESOS PAGADOS NT');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUMIF(B${filaInicioNT}:B${filaFinNT};"Egreso";E${filaInicioNT}:E${filaFinNT});0)`); // PRESUP (todos)
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIFS(F${filaInicioNT}:F${filaFinNT};B${filaInicioNT}:B${filaFinNT};"Egreso";J${filaInicioNT}:J${filaFinNT};"Pagado");0)`); // REAL (pagados)
  sheet.getRange(row, 1, 1, 11).setBackground(C.ROJO_FONDO);
  const filaTotalEgresosPagadosNT = row;
  row++;

  // TOTAL EGRESOS PENDIENTES NT
  sheet.getRange(row, 1).setValue('⏳ TOTAL EGRESOS PENDIENTES NT');
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUMIFS(F${filaInicioNT}:F${filaFinNT};B${filaInicioNT}:B${filaFinNT};"Egreso";J${filaInicioNT}:J${filaFinNT};"Pendiente");0)`);
  sheet.getRange(row, 1, 1, 11).setBackground(C.AMARILLO_FONDO);
  const filaTotalEgresosPendientesNT = row;
  row++;

  // GANANCIA NT (Ingresos - Egresos)
  // v7.6: El texto muestra el % de meta leído de CONFIG!$B$43
  sheet.getRange(row, 1).setFormula('="📈 GANANCIA (META "&CONFIG!$B$43&"%)"').setFontWeight('bold');
  sheet.getRange(row, 6).setFormula(`=F${filaTotalIngresosNT}-(F${filaTotalEgresosPagadosNT}+F${filaTotalEgresosPendientesNT})`).setFontWeight('bold');
  const filaGananciaNT = row;
  row++;

  // % Ganancia
  // v7.6: El semáforo compara contra CONFIG!$B$43/100
  // FIX: Usar VALUE() para comparación numérica
  sheet.getRange(row, 1).setValue('  % Ganancia sobre Ingresos').setFontStyle('italic');
  sheet.getRange(row, 6).setFormula(`=IFERROR(IF(F${filaTotalIngresosNT}>0;F${filaGananciaNT}/F${filaTotalIngresosNT};0);0)`).setNumberFormat('0,00%');
  sheet.getRange(row, 9).setFormula(`=IF(F${row}>=VALUE(CONFIG!$B$43)/100;"🟢 META";"🟡 <"&CONFIG!$B$43&"%")`);
  row++;

  // Distribución de Ganancia (solo si > 0)
  // v7.22: Simplificado - dividir ganancia entre 3
  sheet.getRange(row, 1).setValue('    → Utilidad Dueño (33,33%)').setFontStyle('italic').setFontColor(C.TEXTO_CLARO);
  sheet.getRange(row, 6).setFormula(`=IF(F${filaGananciaNT}>0;F${filaGananciaNT}/3;0)`);
  row++;
  sheet.getRange(row, 1).setValue('    → Fondo Emergencia (33,33%)').setFontStyle('italic').setFontColor(C.TEXTO_CLARO);
  sheet.getRange(row, 6).setFormula(`=IF(F${filaGananciaNT}>0;F${filaGananciaNT}/3;0)`);
  row++;
  sheet.getRange(row, 1).setValue('    → Fondo Inversión (33,34%)').setFontStyle('italic').setFontColor(C.TEXTO_CLARO);
  sheet.getRange(row, 6).setFormula(`=IF(F${filaGananciaNT}>0;F${filaGananciaNT}/3;0)`);
  row++;

  // SALDO DISPONIBLE NT
  sheet.getRange(row, 1).setValue('💵 SALDO DISPONIBLE NT').setFontWeight('bold');
  sheet.getRange(row, 6).setFormula(`=F${filaTotalIngresosNT}-F${filaTotalEgresosPagadosNT}`).setFontWeight('bold');
  sheet.getRange(row, 9).setFormula(`=IF(F${row}>=0;"✓ OK";"⚠ DÉFICIT")`);
  sheet.getRange(row, 1, 1, 11).setBackground(C.GANANCIA_FONDO);
  const filaSaldoDisponibleNT = row;
  row++;

  // SALDO PROYECTADO NT
  sheet.getRange(row, 1).setValue('📉 SALDO PROYECTADO NT').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 6).setFormula(`=F${filaSaldoDisponibleNT}-F${filaTotalEgresosPendientesNT}`).setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 9).setFormula(`=IF(F${row}>=0;"✓ OK";"⚠ DÉFICIT")`);
  sheet.getRange(row, 1, 1, 11).setBackground(C.BALANCE_FONDO);

  // Formato
  sheet.getRange('E:G').setNumberFormat('#,##0');
  sheet.getRange('H:H').setNumberFormat('0%');

  // Anchos (nueva estructura con DÍA)
  sheet.setColumnWidth(1, 280);   // CONCEPTO
  sheet.setColumnWidth(2, 70);    // TIPO
  sheet.setColumnWidth(3, 100);   // FREC
  sheet.setColumnWidth(4, 45);    // DÍA
  sheet.setColumnWidth(5, 110);   // PRESUPUESTO
  sheet.setColumnWidth(6, 110);   // REAL
  sheet.setColumnWidth(7, 100);   // DIFERENCIA
  sheet.setColumnWidth(8, 55);    // %
  sheet.setColumnWidth(9, 80);    // ESTADO
  sheet.setColumnWidth(10, 90);   // EST. PAGO
  sheet.setColumnWidth(11, 45);   // 🚦

  // Ocultar columnas M y N (MES_NUM)
  sheet.hideColumns(13, 2);

  // Formato condicional para ESTADO
  aplicarFormatoCondicionalMovimiento(sheet);

  sheet.setFrozenRows(5);

  return sheet;
}

// ─── SECCIÓN INGRESOS (Variables puros - vienen de CARGA) ───
// Nueva estructura: A=CONCEPTO, B=TIPO, C=FREC, D=DÍA, E=PRESUP, F=REAL, G=DIF, H=%, I=ESTADO, J=EST.PAGO, K=🚦
function escribirSeccionMovimientoIngresos(sheet, row, titulo, items, entidad, colorFondo, colorSubtotal) {
  sheet.getRange(row, 1, 1, 11).merge()
    .setValue(titulo)
    .setFontWeight('bold')
    .setBackground(colorFondo);
  row++;

  const filaInicio = row;
  const hojaCarga = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';

  items.forEach(item => {
    sheet.getRange(row, 1).setValue(item.concepto);
    sheet.getRange(row, 2).setValue('Ingreso');
    sheet.getRange(row, 3).setValue(item.frecuencia || 'Variable');
    sheet.getRange(row, 4).setValue(0).setHorizontalAlignment('center'); // DÍA (ingresos no tienen)

    // v7.20: Fórmulas usan A{row} para consistencia con sistema dinámico
    // PRESUPUESTO (col E): Busca en hoja PRESUPUESTO según mes seleccionado
    const formulaPresup = `=IFERROR(INDEX(PRESUPUESTO!$D:$O;MATCH(A${row};PRESUPUESTO!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 5).setFormula(formulaPresup);

    // REAL (col F): SUMPRODUCT desde CARGA según tipo y mes
    // v7.35: TRIM para eliminar espacios invisibles y evitar mismatch de strings
    const formulaReal = `=IFERROR(SUMPRODUCT((TRIM(${hojaCarga}!$B$4:$B$500)=TRIM(A${row}))*(IFERROR(MONTH(${hojaCarga}!$A$4:$A$500);0)=$N$3)*(IFERROR(YEAR(${hojaCarga}!$A$4:$A$500);0)=${AÑO})*(${hojaCarga}!$F$4:$F$500));0)`;
    sheet.getRange(row, 6).setFormula(formulaReal);

    // DIFERENCIA (col G)
    sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);

    // % (col H)
    sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);

    // ESTADO (col I) - Ingreso: positivo es bueno
    sheet.getRange(row, 9).setFormula(`=IF(F${row}>=E${row};"✓";"⚠")`);

    // EST. PAGO (col J): Ingresos de CARGA ya están RECIBIDOS (sin dropdown)
    sheet.getRange(row, 10).setValue('Recibido')
      .setFontStyle('italic')
      .setFontColor('#6B7280');

    // CATEGORÍA (col L) - vacío para ingresos
    sheet.getRange(row, 12).setValue('');

    // ENTIDAD (col M) - para filtrar en TABLERO
    sheet.getRange(row, 13).setValue(entidad);

    // CUENTA (col N) - vacío para ingresos (vienen de CARGA que ya tiene CUENTA)
    sheet.getRange(row, 14).setValue('');

    row++;
  });

  // Subtotal
  const filaFin = row - 1;
  sheet.getRange(row, 1).setValue('Subtotal').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUM(E${filaInicio}:E${filaFin});0)`);
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUM(F${filaInicio}:F${filaFin});0)`);
  sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);
  sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);
  sheet.getRange(row, 1, 1, 11).setBackground(colorSubtotal);
  row++;

  return row;
}

// ─── HELPER: Referencia dinámica para reservas (v7.33) ───
// Permite renombrar reservas en CONFIG o GASTOS_FIJOS y que MOVIMIENTO/PRESUPUESTO se actualicen
// BUG FIX v7.33: Ahora recibe entidad para evitar confusión entre FAMILIA y NT
// (Las reservas "Reserva Var. 1-5" existen en AMBOS arrays, hay que buscar en el correcto)

/**
 * Obtiene la fórmula de referencia para el nombre de una reserva.
 *
 * Fuentes de verdad:
 *   - VARIABLES FAM → CONFIG col C, filas 21+
 *   - VARIABLES NT → CONFIG col G, filas 21+
 *   - EVENTOS NT → CONFIG col I, filas 21+
 *   - GASTOS_FIJOS → GASTOS_FIJOS!A
 *
 * @param {string} concepto - Nombre original del concepto
 * @param {string} entidad - 'FAMILIA' o 'NEUROTEA' para desambiguar reservas
 * @returns {string|null} Fórmula (ej: "=CONFIG!$G$30") o null si no es reserva
 */
function obtenerReferenciaReserva(concepto, entidad) {
  if (!concepto.includes('Reserva')) return null;

  // ─── VARIABLES: Buscar según entidad para evitar confusión ───
  // Las reservas "Reserva Var. 1-5" existen en AMBOS arrays
  if (entidad === 'NEUROTEA') {
    // Para NT, buscar primero en VARIABLES_NT (col G)
    const idxVarNT = VARIABLES_NT.indexOf(concepto);
    if (idxVarNT >= 0) return `=CONFIG!$G$${21 + idxVarNT}`;
  } else {
    // Para FAMILIA (o sin especificar), buscar en VARIABLES_FAMILIA (col C)
    const idxVarFam = VARIABLES_FAMILIA.indexOf(concepto);
    if (idxVarFam >= 0) return `=CONFIG!$C$${21 + idxVarFam}`;
  }

  // ─── EVENTOS NT (CONFIG col I, items rows 21+) ───
  // Solo aplica a NEUROTEA, pero verificamos de todas formas
  const eventosNombres = EVENTOS_NT.map(e => e.nombre);
  const idxEvt = eventosNombres.indexOf(concepto);
  if (idxEvt >= 0) return `=CONFIG!$I$${21 + idxEvt}`;

  // ─── GASTOS_FIJOS: Buscar según entidad ───
  const FILA_INICIO_GF_FAM = 8;
  const gastosFam = [...GASTOS_FIJOS_FAM, ...CUOTAS_FAM, ...OBLIGACIONES_FAM, ...SUSCRIPCIONES_FAM];

  if (entidad === 'NEUROTEA') {
    // Para NT, buscar en sección NEUROTEA de GASTOS_FIJOS
    const FILA_INICIO_GF_NT = FILA_INICIO_GF_FAM + gastosFam.length + 4;
    const gastosNT = [...CLINICA_NT, ...SUELDOS_NT, ...TELEFONIA_NT, ...OBLIGACIONES_NT, ...EVENTOS_GASTOS_NT];
    const idxGFNT = gastosNT.findIndex(g => g.concepto === concepto);
    if (idxGFNT >= 0) return `=GASTOS_FIJOS!$A$${FILA_INICIO_GF_NT + idxGFNT}`;
  } else {
    // Para FAMILIA, buscar en sección FAMILIA de GASTOS_FIJOS
    const idxGFFam = gastosFam.findIndex(g => g.concepto === concepto);
    if (idxGFFam >= 0) return `=GASTOS_FIJOS!$A$${FILA_INICIO_GF_FAM + idxGFFam}`;
  }

  return null; // No es reserva conocida
}

// ─── SECCIÓN EGRESOS FIJOS (vienen de GASTOS_FIJOS) ───
// Nueva estructura: A=CONCEPTO, B=TIPO, C=FREC, D=DÍA, E=PRESUP, F=REAL, G=DIF, H=%, I=ESTADO, J=EST.PAGO, K=🚦, L=CATEGORÍA
// GASTOS_FIJOS simplificado: A=Concepto, B=Entidad, C=Categoría, D=Frecuencia, E=Día, F=Cuenta, G-R=Meses (sin BASE)
function escribirSeccionMovimientoEgresos(sheet, row, titulo, items, entidad, colorFondo, colorSubtotal) {
  // Extraer nombre de categoría del título (quitar "▶ ")
  const categoria = titulo.replace('▶ ', '');

  sheet.getRange(row, 1, 1, 11).merge()
    .setValue(titulo)
    .setFontWeight('bold')
    .setBackground(colorFondo);
  row++;

  const filaInicio = row;

  items.forEach(item => {
    // v7.33: Reservas usan fórmula referenciando fuente de verdad, con entidad para desambiguar
    const refReserva = obtenerReferenciaReserva(item.concepto, entidad);
    if (refReserva) {
      sheet.getRange(row, 1).setFormula(refReserva);
    } else {
      sheet.getRange(row, 1).setValue(item.concepto);
    }
    sheet.getRange(row, 2).setValue('Egreso');
    sheet.getRange(row, 3).setValue(item.frecuencia);

    // v7.20: Todas las fórmulas usan A{row} (referencia indirecta) en lugar de texto literal
    // Así, al renombrar la reserva, las fórmulas siguen funcionando

    // DÍA (col D): Trae de GASTOS_FIJOS columna E
    const formulaDia = `=IFERROR(INDEX(GASTOS_FIJOS!$E:$E;MATCH(A${row};GASTOS_FIJOS!$A:$A;0));0)`;
    sheet.getRange(row, 4).setFormula(formulaDia).setHorizontalAlignment('center');

    // PRESUPUESTO (col E): Busca en hoja PRESUPUESTO según mes seleccionado
    const formulaPresup = `=IFERROR(INDEX(PRESUPUESTO!$D:$O;MATCH(A${row};PRESUPUESTO!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 5).setFormula(formulaPresup);

    // REAL (col F): Busca en GASTOS_FIJOS directamente (G-R son ENE-DIC, sin BASE)
    const formulaReal = `=IFERROR(INDEX(GASTOS_FIJOS!$G:$R;MATCH(A${row};GASTOS_FIJOS!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 6).setFormula(formulaReal);

    // DIFERENCIA (col G)
    sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);

    // % (col H)
    sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);

    // ESTADO (col I) - Egreso: gastar menos es bueno
    sheet.getRange(row, 9).setFormula(`=IF(F${row}<=E${row};"✓";"⚠")`);

    // ESTADO PAGO (col J) - Dropdown editable (Pendiente/Pagado/Cancelado)
    // v8.0: Los valores se sincronizan con CALCULOS sección 7 via triggers
    sheet.getRange(row, 10).setValue('Pendiente')
      .setDataValidation(SpreadsheetApp.newDataValidation()
        .requireValueInList(ESTADOS, true)
        .setAllowInvalid(false)
        .build());

    // CATEGORÍA (col L) - para cálculos de % GASTOS POR CATEGORÍA
    sheet.getRange(row, 12).setValue(categoria);

    // ENTIDAD (col M) - para filtrar en TABLERO
    sheet.getRange(row, 13).setValue(entidad);

    // CUENTA (col N) - para cálculos de Esperado en TABLERO (v7.8)
    const formulaCuenta = `=IFERROR(INDEX(GASTOS_FIJOS!$F:$F;MATCH(A${row};GASTOS_FIJOS!$A:$A;0));"")`;
    sheet.getRange(row, 14).setFormula(formulaCuenta);

    row++;
  });

  // Subtotal
  const filaFin = row - 1;
  sheet.getRange(row, 1).setValue('Subtotal').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUM(E${filaInicio}:E${filaFin});0)`);
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUM(F${filaInicio}:F${filaFin});0)`);
  sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);
  sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);
  sheet.getRange(row, 1, 1, 11).setBackground(colorSubtotal);
  row++;

  return row;
}

// ─── SECCIÓN VARIABLES PUROS (vienen de CARGA) ───
// Nueva estructura: A=CONCEPTO, B=TIPO, C=FREC, D=DÍA, E=PRESUP, F=REAL, G=DIF, H=%, I=ESTADO, J=EST.PAGO, K=🚦, L=CATEGORÍA, M=ENTIDAD, N=CUENTA
function escribirSeccionMovimientoVariables(sheet, row, titulo, items, entidad, colorFondo, colorSubtotal) {
  // La categoría siempre es "VARIABLES" para esta sección
  const categoria = 'VARIABLES';

  sheet.getRange(row, 1, 1, 11).merge()
    .setValue(titulo)
    .setFontWeight('bold')
    .setBackground(colorFondo);
  row++;

  const filaInicio = row;
  const hojaCarga = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';

  items.forEach(item => {
    // v7.33: Reservas usan fórmula referenciando CONFIG, con entidad para desambiguar
    const refReserva = obtenerReferenciaReserva(item.concepto, entidad);
    if (refReserva) {
      sheet.getRange(row, 1).setFormula(refReserva);
    } else {
      sheet.getRange(row, 1).setValue(item.concepto);
    }
    sheet.getRange(row, 2).setValue('Egreso');
    sheet.getRange(row, 3).setValue('Variable');
    sheet.getRange(row, 4).setValue(0).setHorizontalAlignment('center'); // DÍA (variables no tienen)

    // v7.20: Fórmulas usan A{row} (referencia indirecta) para soportar renombrado dinámico

    // PRESUPUESTO (col E): Busca en hoja PRESUPUESTO según mes seleccionado
    const formulaPresup = `=IFERROR(INDEX(PRESUPUESTO!$D:$O;MATCH(A${row};PRESUPUESTO!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 5).setFormula(formulaPresup);

    // REAL (col F): SUMPRODUCT desde CARGA según subcategoría y mes
    // v7.35: TRIM para eliminar espacios invisibles y evitar mismatch de strings
    const formulaReal = `=IFERROR(SUMPRODUCT((TRIM(${hojaCarga}!$D$4:$D$500)=TRIM(A${row}))*(IFERROR(MONTH(${hojaCarga}!$A$4:$A$500);0)=$N$3)*(IFERROR(YEAR(${hojaCarga}!$A$4:$A$500);0)=${AÑO})*(${hojaCarga}!$F$4:$F$500));0)`;
    sheet.getRange(row, 6).setFormula(formulaReal);

    // DIFERENCIA (col G)
    sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);

    // % (col H)
    sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);

    // ESTADO (col I) - Egreso: gastar menos es bueno
    sheet.getRange(row, 9).setFormula(`=IF(F${row}<=E${row};"✓";"⚠")`);

    // EST. PAGO (col J): Variables de CARGA ya están PAGADOS (sin dropdown)
    sheet.getRange(row, 10).setValue('Pagado')
      .setFontStyle('italic')
      .setFontColor('#6B7280');

    // CATEGORÍA (col L) - para cálculos de % GASTOS POR CATEGORÍA
    sheet.getRange(row, 12).setValue(categoria);

    // ENTIDAD (col M) - para filtrar en TABLERO
    sheet.getRange(row, 13).setValue(entidad);

    // CUENTA (col N) - vacío para variables puros (vienen de CARGA que ya tiene CUENTA)
    sheet.getRange(row, 14).setValue('');

    row++;
  });

  // Subtotal
  const filaFin = row - 1;
  sheet.getRange(row, 1).setValue('Subtotal').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUM(E${filaInicio}:E${filaFin});0)`);
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUM(F${filaInicio}:F${filaFin});0)`);
  sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);
  sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);
  sheet.getRange(row, 1, 1, 11).setBackground(colorSubtotal);
  row++;

  return row;
}

// ─── SECCIÓN AHORRO (viene de CARGA, EST.PAGO = "Ahorrado") ───
// Nueva estructura: A=CONCEPTO, B=TIPO, C=FREC, D=DÍA, E=PRESUP, F=REAL, G=DIF, H=%, I=ESTADO, J=EST.PAGO, K=🚦, L=CATEGORÍA, M=ENTIDAD, N=CUENTA
function escribirSeccionMovimientoAhorro(sheet, row, titulo, items, entidad, colorFondo, colorSubtotal) {
  // La categoría siempre es "AHORRO" para esta sección
  // Ahora AHORRO es un TIPO separado (no Egreso), se carga en CARGA_FAMILIA con:
  //   - TIPO = "Ahorro"
  //   - CATEGORÍA = "Ahorro Clara" / "Ahorro Marco" / "Fondo de Emergencia"
  //   - SUBCATEGORÍA = "-" (bloqueada)
  const categoria = 'AHORRO';

  sheet.getRange(row, 1, 1, 11).merge()
    .setValue(titulo)
    .setFontWeight('bold')
    .setBackground(colorFondo);
  row++;

  const filaInicio = row;
  const hojaCarga = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';

  items.forEach(item => {
    sheet.getRange(row, 1).setValue(item.concepto);
    sheet.getRange(row, 2).setValue('Ahorro'); // Ahora es TIPO "Ahorro", no "Egreso"
    sheet.getRange(row, 3).setValue(item.frecuencia || 'Variable/Mensual');
    sheet.getRange(row, 4).setValue(0).setHorizontalAlignment('center'); // DÍA (ahorro no tiene)

    // v7.20: Fórmulas usan A{row} para consistencia con sistema dinámico
    // PRESUPUESTO (col E): Busca en hoja PRESUPUESTO según mes seleccionado
    const formulaPresup = `=IFERROR(INDEX(PRESUPUESTO!$D:$O;MATCH(A${row};PRESUPUESTO!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 5).setFormula(formulaPresup);

    // REAL (col F): SUMPRODUCT desde CARGA donde TIPO="Ahorro" y CATEGORÍA=item.concepto
    // v7.35: TRIM para eliminar espacios invisibles y evitar mismatch de strings
    const formulaReal = `=IFERROR(SUMPRODUCT((TRIM(${hojaCarga}!$B$4:$B$500)="Ahorro")*(TRIM(${hojaCarga}!$C$4:$C$500)=TRIM(A${row}))*(IFERROR(MONTH(${hojaCarga}!$A$4:$A$500);0)=$N$3)*(IFERROR(YEAR(${hojaCarga}!$A$4:$A$500);0)=${AÑO})*(${hojaCarga}!$F$4:$F$500));0)`;
    sheet.getRange(row, 6).setFormula(formulaReal);

    // DIFERENCIA (col G)
    sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);

    // % (col H)
    sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);

    // ESTADO (col I): Ahorro: ahorrar MÁS es bueno, verde si real >= presupuesto
    sheet.getRange(row, 9).setFormula(`=IF(F${row}>=E${row};"✓";"⚠")`);

    // EST. PAGO (col J): Ahorro viene de CARGA = ya está "Ahorrado" (sin dropdown)
    sheet.getRange(row, 10).setValue('Ahorrado')
      .setFontStyle('italic')
      .setFontColor('#059669'); // Verde para ahorro

    // CATEGORÍA (col L) - para cálculos de % GASTOS POR CATEGORÍA
    sheet.getRange(row, 12).setValue(categoria);

    // ENTIDAD (col M) - para filtrar en TABLERO
    sheet.getRange(row, 13).setValue(entidad);

    // CUENTA (col N) - vacío para ahorro (viene de CARGA que ya tiene CUENTA)
    sheet.getRange(row, 14).setValue('');

    row++;
  });

  // Subtotal
  const filaFin = row - 1;
  sheet.getRange(row, 1).setValue('Subtotal').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUM(E${filaInicio}:E${filaFin});0)`);
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUM(F${filaInicio}:F${filaFin});0)`);
  sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);
  sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);
  sheet.getRange(row, 1, 1, 11).setBackground(colorSubtotal);
  row++;

  return row;
}

// ─── SECCIÓN EVENTOS NT ───
// v7.7: EVENTOS ahora lee de GASTOS_FIJOS (como otros gastos fijos), NO de CARGA_NT
// Estructura: A=CONCEPTO, B=TIPO, C=FREC, D=DÍA, E=PRESUP, F=REAL, G=DIF, H=%, I=ESTADO, J=EST.PAGO, K=🚦, L=CATEGORÍA, M=ENTIDAD, N=CUENTA
function escribirSeccionMovimientoEventos(sheet, row, colorFondo, colorSubtotal) {
  // La categoría siempre es "EVENTOS" para esta sección
  const categoria = 'EVENTOS';

  sheet.getRange(row, 1, 1, 11).merge()
    .setValue('▶ EVENTOS (6 definidos + 12 reservas)')
    .setFontWeight('bold').setBackground(colorFondo);
  row++;

  const filaInicio = row;

  // v7.7: Incluimos TODOS los eventos (incluyendo reservas)
  EVENTOS_NT.forEach(evento => {
    // v7.33: Reservas de eventos referencian CONFIG dinámicamente (siempre NEUROTEA)
    const refReserva = obtenerReferenciaReserva(evento.nombre, 'NEUROTEA');
    if (refReserva) {
      sheet.getRange(row, 1).setFormula(refReserva);
    } else {
      sheet.getRange(row, 1).setValue(evento.nombre);
    }
    sheet.getRange(row, 2).setValue('Egreso');
    sheet.getRange(row, 3).setValue('Variable/Anual');

    // v7.20: Fórmulas usan A{row} para soportar renombrado dinámico

    // DÍA (col D): Lee de GASTOS_FIJOS
    const formulaDia = `=IFERROR(INDEX(GASTOS_FIJOS!$E:$E;MATCH(A${row};GASTOS_FIJOS!$A:$A;0));0)`;
    sheet.getRange(row, 4).setFormula(formulaDia).setHorizontalAlignment('center');

    // PRESUPUESTO (col E): Busca en hoja PRESUPUESTO
    const formulaPresup = `=IFERROR(INDEX(PRESUPUESTO!$D:$O;MATCH(A${row};PRESUPUESTO!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 5).setFormula(formulaPresup);

    // REAL (col F): Lee de GASTOS_FIJOS (columnas G-R = meses, $N$3 = mes seleccionado)
    const formulaReal = `=IFERROR(INDEX(GASTOS_FIJOS!$G:$R;MATCH(A${row};GASTOS_FIJOS!$A:$A;0);$N$3);0)`;
    sheet.getRange(row, 6).setFormula(formulaReal);

    // DIFERENCIA (col G)
    sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);

    // % (col H)
    sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);

    // ESTADO (col I)
    sheet.getRange(row, 9).setFormula(`=IF(F${row}<=E${row};"✓";"⚠")`);

    // EST. PAGO (col J) - Dropdown editable (Pendiente/Pagado/Cancelado)
    // v8.0: Los valores se sincronizan con CALCULOS sección 7 via triggers
    sheet.getRange(row, 10).setValue('Pendiente')
      .setDataValidation(SpreadsheetApp.newDataValidation()
        .requireValueInList(ESTADOS, true)
        .setAllowInvalid(false)
        .build());

    // CATEGORÍA (col L) - para cálculos de % GASTOS POR CATEGORÍA
    sheet.getRange(row, 12).setValue(categoria);

    // ENTIDAD (col M) - EVENTOS es solo para NEUROTEA
    sheet.getRange(row, 13).setValue('NEUROTEA');

    // CUENTA (col N) - para cálculos de Esperado en TABLERO (v7.8)
    const formulaCuenta = `=IFERROR(INDEX(GASTOS_FIJOS!$F:$F;MATCH(A${row};GASTOS_FIJOS!$A:$A;0));"")`;
    sheet.getRange(row, 14).setFormula(formulaCuenta);

    row++;
  });

  // Subtotal Eventos
  const filaFin = row - 1;
  sheet.getRange(row, 1).setValue('Subtotal Eventos').setFontWeight('bold').setFontStyle('italic');
  sheet.getRange(row, 5).setFormula(`=IFERROR(SUM(E${filaInicio}:E${filaFin});0)`);
  sheet.getRange(row, 6).setFormula(`=IFERROR(SUM(F${filaInicio}:F${filaFin});0)`);
  sheet.getRange(row, 7).setFormula(`=F${row}-E${row}`);
  sheet.getRange(row, 8).setFormula(`=IF(E${row}=0;0;F${row}/E${row})`);
  sheet.getRange(row, 1, 1, 11).setBackground(colorSubtotal);
  row++;

  return row;
}

// ─── FORMATO CONDICIONAL MOVIMIENTO ───
// Nueva estructura columnas: I=ESTADO, G=DIFERENCIA, J=EST.PAGO
function aplicarFormatoCondicionalMovimiento(sheet) {
  const C = COLORES;

  // Estado ✓ = Verde (columna I)
  const reglaOK = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('✓')
    .setBackground(C.VERDE_FONDO)
    .setFontColor(C.VERDE)
    .setRanges([sheet.getRange('I:I')])
    .build();

  // Estado ⚠ = Rojo (columna I)
  const reglaAlerta = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('⚠')
    .setBackground(C.ROJO_FONDO)
    .setFontColor(C.ROJO)
    .setRanges([sheet.getRange('I:I')])
    .build();

  // ═══════════════════════════════════════════════════════════════════
  // COLORES DIFERENCIA (columna G) - Sensible al contexto INGRESO vs EGRESO
  // ═══════════════════════════════════════════════════════════════════

  // INGRESOS: Positivo (+) = VERDE (recibiste más = bueno)
  const reglaDifIngresoPos = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($B1="Ingreso";$G1>0)')
    .setFontColor(C.VERDE)
    .setRanges([sheet.getRange('G:G')])
    .build();

  // INGRESOS: Negativo (-) = ROJO (recibiste menos = malo)
  const reglaDifIngresoNeg = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($B1="Ingreso";$G1<0)')
    .setFontColor(C.ROJO)
    .setRanges([sheet.getRange('G:G')])
    .build();

  // EGRESOS: Positivo (+) = ROJO (gastaste más = malo)
  const reglaDifEgresoPos = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($B1="Egreso";$G1>0)')
    .setFontColor(C.ROJO)
    .setRanges([sheet.getRange('G:G')])
    .build();

  // EGRESOS: Negativo (-) = VERDE (gastaste menos = bueno)
  const reglaDifEgresoNeg = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($B1="Egreso";$G1<0)')
    .setFontColor(C.VERDE)
    .setRanges([sheet.getRange('G:G')])
    .build();

  // EST. PAGO colores (columna J)
  const reglaPagado = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Pagado')
    .setBackground(C.VERDE_FONDO)
    .setFontColor(C.VERDE)
    .setRanges([sheet.getRange('J:J')])
    .build();

  const reglaPendiente = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Pendiente')
    .setBackground(C.AMARILLO_FONDO)
    .setFontColor(C.AMARILLO)
    .setRanges([sheet.getRange('J:J')])
    .build();

  const reglaCancelado = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Cancelado')
    .setBackground(C.GRIS_FONDO)
    .setFontColor(C.TEXTO_CLARO)
    .setRanges([sheet.getRange('J:J')])
    .build();

  // Ahorrado = Verde especial (columna J)
  const reglaAhorrado = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Ahorrado')
    .setBackground(C.VERDE_FONDO)
    .setFontColor('#059669')
    .setRanges([sheet.getRange('J:J')])
    .build();

  sheet.setConditionalFormatRules([
    reglaOK, reglaAlerta,
    reglaDifIngresoPos, reglaDifIngresoNeg,
    reglaDifEgresoPos, reglaDifEgresoNeg,
    reglaPagado, reglaPendiente, reglaCancelado, reglaAhorrado
  ]);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. HOJAS LIQUIDEZ - Control de Flujo de Caja Semanal (v6.0)
// ═══════════════════════════════════════════════════════════════════════════════
// LIQUIDEZ_FAMILIA y LIQUIDEZ_NT: Hojas separadas con desglose semanal
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Crea la hoja LIQUIDEZ_FAMILIA con estructura semanal
 * Muestra gastos fijos organizados por semana del mes
 */
function crearHojaLIQUIDEZ_FAMILIA() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.LIQUIDEZ_FAM);
  // v7.25: Rangos actualizados (FAMILIA: 9-116) - 3 reservas variables más
  return crearHojaLiquidezEntidad(sheet, 'FAMILIA', '🏠', 9, 116);
}

/**
 * Crea la hoja LIQUIDEZ_NT con estructura semanal
 * Muestra gastos fijos organizados por semana del mes
 */
function crearHojaLIQUIDEZ_NT() {
  const sheet = crearOLimpiarHoja(NOMBRES_HOJAS.LIQUIDEZ_NT);
  // v7.25: Rangos actualizados (NEUROTEA: 122-206) - 3 reservas variables más en FAM y NT
  return crearHojaLiquidezEntidad(sheet, 'NEUROTEA', '🏥', 122, 206);
}

/**
 * Función genérica para crear una hoja de liquidez por entidad
 * ESTILO SOBRIO PROFESIONAL: Gris/blanco, colores solo para estados
 */
function crearHojaLiquidezEntidad(sheet, entidad, icono, filaInicioMov, filaFinMov) {
  /**
   * LIQUIDEZ v6.2 - Diseño intuitivo
   * Pregunta clave: "¿Tengo plata para pagar mis gastos fijos?"
   *
   * Estructura: Columnas A-E (lista gastos) + G-I (panel resumen lateral)
   */
  const UI = {
    HEADER_DARK: '#1F2937',
    HEADER_LIGHT: '#374151',
    FONDO_CLARO: '#F9FAFB',
    FONDO_ALT: '#FFFFFF',
    SUBTOTAL: '#E5E7EB',
    BORDE: '#D1D5DB',
    BLANCO: '#FFFFFF',
    TEXTO: '#374151',
    TEXTO_CLARO: '#6B7280',
    // Estados
    INGRESO: '#3B82F6',
    INGRESO_FONDO: '#DBEAFE',
    PAGADO: '#22C55E',
    PAGADO_FONDO: '#DCFCE7',
    PENDIENTE: '#F59E0B',
    PENDIENTE_FONDO: '#FEF3C7',
    DEFICIT: '#EF4444',
    DEFICIT_FONDO: '#FEE2E2',
    ATRASADO: '#DC2626',
    ATRASADO_FONDO: '#FEE2E2'
  };

  const esFamilia = entidad === 'FAMILIA';

  // ════════════════════════════════════════════════════════════════════
  // HEADER PRINCIPAL
  // ════════════════════════════════════════════════════════════════════
  sheet.getRange('A1:I1').merge()
    .setValue(`${icono} LIQUIDEZ ${entidad} - ¿Puedo pagar mis gastos fijos?`)
    .setFontSize(14).setFontWeight('bold')
    .setBackground(UI.HEADER_DARK).setFontColor(UI.BLANCO)
    .setHorizontalAlignment('center');

  // Info fecha
  sheet.getRange('A3').setValue('📅 Hoy:').setFontWeight('bold');
  sheet.getRange('B3').setFormula('=TODAY()').setNumberFormat('dd/mm/yyyy');
  sheet.getRange('C3').setValue('📋 Mes:').setFontWeight('bold');
  sheet.getRange('D3').setFormula('=MOVIMIENTO!B3');
  sheet.getRange('E3').setValue('📆 Día:').setFontWeight('bold');
  sheet.getRange('F3').setFormula('=DAY(TODAY())');

  let row = 5;

  // ════════════════════════════════════════════════════════════════════
  // PANEL PRINCIPAL: ¿ALCANZA EL DINERO?
  // ════════════════════════════════════════════════════════════════════
  sheet.getRange(row, 1, 1, 9).merge()
    .setValue('💰 RESUMEN DE COBERTURA')
    .setFontSize(12).setFontWeight('bold')
    .setBackground(UI.HEADER_DARK).setFontColor(UI.BLANCO)
    .setHorizontalAlignment('center');
  row++;

  // Fila de indicadores principales (3 tarjetas grandes)
  // v6.9: SALDO DISPONIBLE = Ingresos - Egresos Pagados - Ahorro (TIPO="Ahorro")
  const formulaSaldo = esFamilia
    ? `=IFERROR(SUMIF(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov};"Ingreso";MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov})-SUMIFS(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov};MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov};"Egreso";MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov};"Pagado")-SUMIF(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov};"Ahorro";MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov});0)`
    : `=IFERROR(SUMIF(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov};"Ingreso";MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov})-SUMIFS(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov};MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov};"Egreso";MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov};"Pagado");0)`;

  // Tarjeta 1: Saldo Disponible
  sheet.getRange(row, 1, 1, 3).merge()
    .setValue('💵 SALDO DISPONIBLE')
    .setFontWeight('bold').setBackground(UI.INGRESO_FONDO).setFontColor(UI.INGRESO)
    .setHorizontalAlignment('center');
  row++;
  sheet.getRange(row, 1, 1, 3).merge()
    .setFormula(formulaSaldo)
    .setNumberFormat('"Gs. "#,##0').setFontWeight('bold').setFontSize(14)
    .setBackground(UI.INGRESO_FONDO).setFontColor(UI.INGRESO)
    .setHorizontalAlignment('center');
  const filaSaldo = row;

  // Tarjeta 2: Total Pendiente (en la misma fila que Saldo)
  sheet.getRange(row-1, 4, 1, 3).merge()
    .setValue('⏳ TOTAL PENDIENTE')
    .setFontWeight('bold').setBackground(UI.PENDIENTE_FONDO).setFontColor(UI.PENDIENTE)
    .setHorizontalAlignment('center');
  sheet.getRange(row, 4, 1, 3).merge()
    .setFormula(`=IFERROR(SUMIFS(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov};MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov};"Egreso";MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov};"Pendiente");0)`)
    .setNumberFormat('"Gs. "#,##0').setFontWeight('bold').setFontSize(14)
    .setBackground(UI.PENDIENTE_FONDO).setFontColor(UI.PENDIENTE)
    .setHorizontalAlignment('center');
  const filaPendiente = row;

  // Tarjeta 3: ¿Alcanza?
  sheet.getRange(row-1, 7, 1, 3).merge()
    .setValue('📊 ¿ALCANZA?')
    .setFontWeight('bold').setBackground(UI.FONDO_CLARO).setFontColor(UI.TEXTO)
    .setHorizontalAlignment('center');
  sheet.getRange(row, 7, 1, 3).merge()
    .setFormula(`=IF(A${filaSaldo}>=D${filaPendiente};"✅ SÍ ALCANZA";"❌ NO ALCANZA")`)
    .setFontWeight('bold').setFontSize(14)
    .setBackground(UI.FONDO_CLARO)
    .setHorizontalAlignment('center');
  const filaAlcanza = row;

  // Formato condicional para ¿Alcanza?
  const reglaAlcanzaSi = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('SÍ ALCANZA')
    .setBackground(UI.PAGADO_FONDO)
    .setFontColor(UI.PAGADO)
    .setRanges([sheet.getRange(row, 7, 1, 3)])
    .build();
  const reglaAlcanzaNo = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('NO ALCANZA')
    .setBackground(UI.DEFICIT_FONDO)
    .setFontColor(UI.DEFICIT)
    .setRanges([sheet.getRange(row, 7, 1, 3)])
    .build();

  row++;

  // Fila de detalle: Proyección y Atrasados
  sheet.getRange(row, 1, 1, 3).merge()
    // BUG FIX [2026-01-14]: Formato Paraguay con puntos como separador de miles
    .setFormula(`="Sobrante/Faltante: "&SUBSTITUTE(TEXT(A${filaSaldo}-D${filaPendiente};"#,##0");",";".")&" Gs."`)
    .setFontStyle('italic').setBackground(UI.FONDO_CLARO).setFontColor(UI.TEXTO_CLARO)
    .setHorizontalAlignment('center');

  sheet.getRange(row, 4, 1, 3).merge()
    .setFormula(`="🔴 Atrasados: "&SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0)*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<DAY(TODAY()))*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pendiente"))&" pagos"`)
    .setBackground(UI.ATRASADO_FONDO).setFontColor(UI.ATRASADO)
    .setHorizontalAlignment('center');

  sheet.getRange(row, 7, 1, 3).merge()
    // BUG FIX [2026-01-14]: Formato Paraguay con puntos como separador de miles
    .setFormula(`="Monto atrasado: "&SUBSTITUTE(TEXT(SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0)*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<DAY(TODAY()))*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pendiente")*(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov}));"#,##0");",";".")&" Gs."`)
    .setBackground(UI.ATRASADO_FONDO).setFontColor(UI.ATRASADO)
    .setHorizontalAlignment('center');

  row += 2;

  // ════════════════════════════════════════════════════════════════════
  // SEMANAS CON PANEL LATERAL DE RESUMEN
  // ════════════════════════════════════════════════════════════════════
  const semanas = [
    { nombre: 'SEMANA 1', rango: '1-7', diaMin: 1, diaMax: 7 },
    { nombre: 'SEMANA 2', rango: '8-14', diaMin: 8, diaMax: 14 },
    { nombre: 'SEMANA 3', rango: '15-21', diaMin: 15, diaMax: 21 },
    { nombre: 'SEMANA 4', rango: '22-31', diaMin: 22, diaMax: 31 }
  ];

  const reglas = [reglaAlcanzaSi, reglaAlcanzaNo];

  semanas.forEach((semana, idx) => {
    const filaInicioSeccion = row;

    // Header semana (columnas A-E)
    sheet.getRange(row, 1, 1, 5).merge()
      .setValue(`${semana.nombre} (Días ${semana.rango})`)
      .setFontSize(10).setFontWeight('bold')
      .setBackground(UI.HEADER_LIGHT).setFontColor(UI.BLANCO);

    // Header panel lateral (columnas G-I)
    sheet.getRange(row, 7, 1, 3).merge()
      .setValue(`📊 RESUMEN ${semana.nombre}`)
      .setFontSize(10).setFontWeight('bold')
      .setBackground(UI.HEADER_LIGHT).setFontColor(UI.BLANCO)
      .setHorizontalAlignment('center');
    row++;

    // Headers de tabla de gastos
    ['Concepto', 'Día', 'Monto', 'Estado'].forEach((h, i) => {
      const col = i === 0 ? 1 : i === 1 ? 3 : i === 2 ? 4 : 5;
      const span = i === 0 ? 2 : 1;
      if (span > 1) sheet.getRange(row, col, 1, span).merge();
      sheet.getRange(row, col)
        .setValue(h).setFontSize(9).setFontWeight('bold')
        .setBackground(UI.FONDO_CLARO).setFontColor(UI.TEXTO)
        .setHorizontalAlignment(i === 2 ? 'right' : 'center')
        .setBorder(true, true, true, true, false, false, UI.BORDE, SpreadsheetApp.BorderStyle.SOLID);
    });

    // Panel lateral - Atrasados
    sheet.getRange(row, 7)
      .setValue('🔴 Atrasados:').setFontSize(9)
      .setBackground(UI.ATRASADO_FONDO).setFontColor(UI.ATRASADO);
    sheet.getRange(row, 8)
      .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<DAY(TODAY()))*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pendiente"))`)
      .setHorizontalAlignment('center').setBackground(UI.ATRASADO_FONDO).setFontColor(UI.ATRASADO);
    sheet.getRange(row, 9)
      .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<DAY(TODAY()))*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pendiente")*(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov}))`)
      .setNumberFormat('#,##0').setHorizontalAlignment('right').setBackground(UI.ATRASADO_FONDO).setFontColor(UI.ATRASADO);
    row++;

    // Filas de datos (8 items por semana)
    for (let i = 0; i < 8; i++) {
      const bgColor = i % 2 === 0 ? UI.FONDO_ALT : UI.FONDO_CLARO;

      // Concepto
      sheet.getRange(row, 1, 1, 2).merge()
        .setFormula(`=IFERROR(INDEX(FILTER(MOVIMIENTO!$A$${filaInicioMov}:$A$${filaFinMov};(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0));${i+1});"")`)
        .setBackground(bgColor).setBorder(true, true, true, true, false, false, UI.BORDE, SpreadsheetApp.BorderStyle.SOLID);

      // Día
      sheet.getRange(row, 3)
        .setFormula(`=IFERROR(INDEX(FILTER(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov};(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0));${i+1});"")`)
        .setHorizontalAlignment('center').setBackground(bgColor).setBorder(true, true, true, true, false, false, UI.BORDE, SpreadsheetApp.BorderStyle.SOLID);

      // Monto
      sheet.getRange(row, 4)
        .setFormula(`=IFERROR(INDEX(FILTER(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov};(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0));${i+1});"")`)
        .setNumberFormat('#,##0').setHorizontalAlignment('right').setBackground(bgColor).setBorder(true, true, true, true, false, false, UI.BORDE, SpreadsheetApp.BorderStyle.SOLID);

      // Estado
      sheet.getRange(row, 5)
        .setFormula(`=IFERROR(INDEX(FILTER(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov};(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0));${i+1});"")`)
        .setHorizontalAlignment('center').setBackground(bgColor).setBorder(true, true, true, true, false, false, UI.BORDE, SpreadsheetApp.BorderStyle.SOLID);

      // Panel lateral según fila
      if (i === 0) {
        // Pendientes
        sheet.getRange(row, 7).setValue('⏳ Pendientes:').setFontSize(9).setBackground(UI.PENDIENTE_FONDO).setFontColor(UI.PENDIENTE);
        sheet.getRange(row, 8)
          .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pendiente")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0))`)
          .setHorizontalAlignment('center').setBackground(UI.PENDIENTE_FONDO).setFontColor(UI.PENDIENTE);
        sheet.getRange(row, 9)
          .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pendiente")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0)*(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov}))`)
          .setNumberFormat('#,##0').setHorizontalAlignment('right').setBackground(UI.PENDIENTE_FONDO).setFontColor(UI.PENDIENTE);
      } else if (i === 1) {
        // Pagados
        sheet.getRange(row, 7).setValue('✅ Pagados:').setFontSize(9).setBackground(UI.PAGADO_FONDO).setFontColor(UI.PAGADO);
        sheet.getRange(row, 8)
          .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pagado")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0))`)
          .setHorizontalAlignment('center').setBackground(UI.PAGADO_FONDO).setFontColor(UI.PAGADO);
        sheet.getRange(row, 9)
          .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$J$${filaInicioMov}:$J$${filaFinMov}="Pagado")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0)*(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov}))`)
          .setNumberFormat('#,##0').setHorizontalAlignment('right').setBackground(UI.PAGADO_FONDO).setFontColor(UI.PAGADO);
      } else if (i === 2) {
        // Separador
        sheet.getRange(row, 7, 1, 3).merge().setBackground(UI.FONDO_CLARO);
      } else if (i === 3) {
        // Total Semana
        sheet.getRange(row, 7).setValue('📋 Total:').setFontSize(9).setFontWeight('bold').setBackground(UI.SUBTOTAL);
        sheet.getRange(row, 8)
          .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0))`)
          .setHorizontalAlignment('center').setFontWeight('bold').setBackground(UI.SUBTOTAL);
        sheet.getRange(row, 9)
          .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0)*(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov}))`)
          .setNumberFormat('#,##0').setHorizontalAlignment('right').setFontWeight('bold').setBackground(UI.SUBTOTAL);
      } else if (i === 4) {
        // Separador
        sheet.getRange(row, 7, 1, 3).merge().setBackground(UI.FONDO_ALT);
      } else if (i === 5) {
        // ¿Alcanza para la semana?
        sheet.getRange(row, 7, 1, 3).merge()
          .setFormula(`=IF(H${row-2}=0;"Sin pendientes";IF(A${filaSaldo}>=I${row-5};"✅ Saldo cubre";"❌ No cubre"))`)
          .setFontWeight('bold').setHorizontalAlignment('center').setBackground(UI.FONDO_CLARO);

        // Regla condicional para este indicador
        const reglaCubreSi = SpreadsheetApp.newConditionalFormatRule()
          .whenTextContains('cubre')
          .setBackground(UI.PAGADO_FONDO).setFontColor(UI.PAGADO)
          .setRanges([sheet.getRange(row, 7, 1, 3)])
          .build();
        const reglaCubreNo = SpreadsheetApp.newConditionalFormatRule()
          .whenTextContains('No cubre')
          .setBackground(UI.DEFICIT_FONDO).setFontColor(UI.DEFICIT)
          .setRanges([sheet.getRange(row, 7, 1, 3)])
          .build();
        reglas.push(reglaCubreSi, reglaCubreNo);
      } else {
        sheet.getRange(row, 7, 1, 3).merge().setBackground(UI.FONDO_ALT);
      }

      row++;
    }

    // Subtotal de la semana
    sheet.getRange(row, 1, 1, 2).merge()
      .setValue('SUBTOTAL').setFontWeight('bold').setBackground(UI.SUBTOTAL);
    sheet.getRange(row, 3).setValue('-').setHorizontalAlignment('center').setBackground(UI.SUBTOTAL);
    sheet.getRange(row, 4)
      .setFormula(`=SUMPRODUCT((MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>=${semana.diaMin})*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}<=${semana.diaMax})*(MOVIMIENTO!$B$${filaInicioMov}:$B$${filaFinMov}="Egreso")*(MOVIMIENTO!$D$${filaInicioMov}:$D$${filaFinMov}>0)*(MOVIMIENTO!$F$${filaInicioMov}:$F$${filaFinMov}))`)
      .setNumberFormat('#,##0').setFontWeight('bold').setHorizontalAlignment('right').setBackground(UI.SUBTOTAL);
    sheet.getRange(row, 5).setBackground(UI.SUBTOTAL);
    sheet.getRange(row, 7, 1, 3).merge().setBackground(UI.SUBTOTAL);

    row += 2;
  });

  // ════════════════════════════════════════════════════════════════════
  // CONFIGURACIÓN FINAL
  // ════════════════════════════════════════════════════════════════════
  sheet.setColumnWidths(1, 2, 90);   // A-B: Concepto
  sheet.setColumnWidth(3, 40);       // C: Día
  sheet.setColumnWidth(4, 90);       // D: Monto
  sheet.setColumnWidth(5, 70);       // E: Estado
  sheet.setColumnWidth(6, 15);       // F: Separador
  sheet.setColumnWidth(7, 90);       // G: Label panel
  sheet.setColumnWidth(8, 40);       // H: Cantidad
  sheet.setColumnWidth(9, 90);       // I: Monto panel

  // Formato condicional para estados
  const reglaPagado = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Pagado')
    .setBackground(UI.PAGADO_FONDO).setFontColor(UI.PAGADO)
    .setRanges([sheet.getRange('E:E')])
    .build();
  const reglaPendiente = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Pendiente')
    .setBackground(UI.PENDIENTE_FONDO).setFontColor(UI.PENDIENTE)
    .setRanges([sheet.getRange('E:E')])
    .build();

  reglas.push(reglaPagado, reglaPendiente);
  sheet.setConditionalFormatRules(reglas);

  sheet.setFrozenRows(4);

  return sheet;
}

// ─── FORMATO CONDICIONAL LIQUIDEZ ───
function aplicarFormatoCondicionalLiquidez(sheet) {
  const C = COLORES;

  // Saldo negativo = Rojo
  const reglaNegativo = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground(C.ROJO_FONDO)
    .setFontColor(C.ROJO)
    .setRanges([sheet.getRange('B:D')])
    .build();

  // Saldo positivo = Verde
  const reglaPositivo = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setFontColor(C.VERDE)
    .setRanges([sheet.getRange('B:D')])
    .build();

  sheet.setConditionalFormatRules([reglaNegativo, reglaPositivo]);
}
