/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CALCULOS.GS - HOJA INTERMEDIA DE CÁLCULOS CENTRALIZADOS
 * Sistema de Control Financiero 2026 - NeuroTEA & Familia
 * Versión 8.0 - Reingeniería: Cálculos centralizados + Estados por mes
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * PROPÓSITO:
 * - Centralizar todos los cálculos complejos (SUMPRODUCT) en un solo lugar
 * - Simplificar TABLERO y WebApp (solo INDEX/MATCH)
 * - Estados de pago independientes por mes
 * - Liquidez por semana pre-calculada
 *
 * ESTRUCTURA:
 * - Sección 1: TOTALES POR ENTIDAD (filas 2-25)
 * - Sección 2: SALDOS POR CUENTA (filas 30-50)
 * - Sección 3: CATEGORÍAS EGRESO (filas 55-75)
 * - Sección 4: BALANCE CRUZADO NT↔FAM (filas 80-95)
 * - Sección 5: SUBCATEGORÍAS VARIABLES (filas 100-140)
 * - Sección 6: LIQUIDEZ POR SEMANA (filas 145-160)
 * - Sección 7: ESTADOS DE PAGO POR MES (filas 165+)
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CREAR HOJA CALCULOS
// ═══════════════════════════════════════════════════════════════════════════════

function crearHojaCALCULOS() {
  const sheet = crearOLimpiarHoja('CALCULOS');
  const C = COLORES;

  // ─── HEADER PRINCIPAL ───
  sheet.getRange('A1:N1').merge()
    .setValue('🔢 CÁLCULOS INTERMEDIOS - NO EDITAR')
    .setFontSize(14).setFontWeight('bold')
    .setBackground(C.HEADER_DARK).setFontColor(C.BLANCO)
    .setHorizontalAlignment('center');

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 1: TOTALES POR ENTIDAD (filas 3-25)
  // ═══════════════════════════════════════════════════════════════════════════════
  let row = 3;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('📊 SECCIÓN 1: TOTALES POR ENTIDAD')
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);
  row++;

  // Headers: CONCEPTO + 12 meses + TOTAL
  const headersMeses = ['CONCEPTO', ...MESES_CORTOS, 'TOTAL'];
  headersMeses.forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  // ─── FAMILIA ───
  sheet.getRange(row, 1).setValue('── FAMILIA ──').setFontWeight('bold');
  row++;

  const totalesFamilia = [
    { label: 'FAM_INGRESOS', formula: (mes) => formulaSumproductIngresos('FAMILIA', mes) },
    { label: 'FAM_EGRESOS_PAGADOS', formula: (mes) => formulaSumproductEgresosPagados('FAMILIA', mes) },
    { label: 'FAM_EGRESOS_PENDIENTES', formula: (mes) => formulaSumproductEgresosPendientes('FAMILIA', mes) },
    { label: 'FAM_AHORRO', formula: (mes) => formulaSumproductAhorro('Ahorro Clara', mes) + '+' + formulaSumproductAhorro('Ahorro Marco', mes) },
    { label: 'FAM_FONDO_EMERGENCIA', formula: (mes) => formulaSumproductAhorro('Fondo de Emergencia', mes) },
    { label: 'FAM_DISPONIBLE', formula: null } // Calculado
  ];

  const filaInicioTotalesFam = row;
  totalesFamilia.forEach((item, idx) => {
    sheet.getRange(row, 1).setValue(item.label);

    if (item.formula) {
      // Fórmulas para cada mes (columnas B-M = meses 1-12)
      for (let mes = 1; mes <= 12; mes++) {
        const formula = item.formula(mes);
        sheet.getRange(row, mes + 1).setFormula('=' + formula);
      }
      // Total anual
      sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    } else if (item.label === 'FAM_DISPONIBLE') {
      // DISPONIBLE = INGRESOS - EGRESOS_PAGADOS - AHORRO - FONDO
      for (let mes = 1; mes <= 12; mes++) {
        const col = mes + 1;
        const colLetter = String.fromCharCode(64 + col);
        const filaIng = filaInicioTotalesFam;
        const filaEgr = filaInicioTotalesFam + 1;
        const filaAho = filaInicioTotalesFam + 3;
        const filaFon = filaInicioTotalesFam + 4;
        sheet.getRange(row, col).setFormula(`=${colLetter}${filaIng}-${colLetter}${filaEgr}-${colLetter}${filaAho}-${colLetter}${filaFon}`);
      }
      sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    }

    // Formato de número
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  row += 2;

  // ─── NEUROTEA ───
  sheet.getRange(row, 1).setValue('── NEUROTEA ──').setFontWeight('bold');
  row++;

  const totalesNT = [
    { label: 'NT_INGRESOS', formula: (mes) => formulaSumproductIngresos('NEUROTEA', mes) },
    { label: 'NT_EGRESOS_PAGADOS', formula: (mes) => formulaSumproductEgresosPagados('NEUROTEA', mes) },
    { label: 'NT_EGRESOS_PENDIENTES', formula: (mes) => formulaSumproductEgresosPendientes('NEUROTEA', mes) },
    { label: 'NT_GANANCIA', formula: null }, // Calculado
    { label: 'NT_PCT_GANANCIA', formula: null } // Calculado
  ];

  const filaInicioTotalesNT = row;
  totalesNT.forEach((item, idx) => {
    sheet.getRange(row, 1).setValue(item.label);

    if (item.formula) {
      for (let mes = 1; mes <= 12; mes++) {
        const formula = item.formula(mes);
        sheet.getRange(row, mes + 1).setFormula('=' + formula);
      }
      sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    } else if (item.label === 'NT_GANANCIA') {
      // GANANCIA = INGRESOS - EGRESOS_PAGADOS
      for (let mes = 1; mes <= 12; mes++) {
        const col = mes + 1;
        const colLetter = String.fromCharCode(64 + col);
        sheet.getRange(row, col).setFormula(`=${colLetter}${filaInicioTotalesNT}-${colLetter}${filaInicioTotalesNT + 1}`);
      }
      sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    } else if (item.label === 'NT_PCT_GANANCIA') {
      // % GANANCIA = GANANCIA / INGRESOS
      for (let mes = 1; mes <= 12; mes++) {
        const col = mes + 1;
        const colLetter = String.fromCharCode(64 + col);
        sheet.getRange(row, col).setFormula(`=IFERROR(${colLetter}${row - 1}/${colLetter}${filaInicioTotalesNT};0)`);
      }
      sheet.getRange(row, 2, 1, 12).setNumberFormat('0.00%');
      sheet.getRange(row, 14).setFormula(`=IFERROR(M${row - 1}/M${filaInicioTotalesNT};0)`);
      sheet.getRange(row, 14).setNumberFormat('0.00%');
    }

    if (item.label !== 'NT_PCT_GANANCIA') {
      sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    }
    row++;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 2: SALDOS POR CUENTA (filas 30-50)
  // ═══════════════════════════════════════════════════════════════════════════════
  row = 30;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('💰 SECCIÓN 2: SALDOS POR CUENTA')
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);
  row++;

  // Headers
  headersMeses.forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h === 'CONCEPTO' ? 'CUENTA' : h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  // ─── CUENTAS FAMILIA ───
  sheet.getRange(row, 1).setValue('── FAMILIA ──').setFontWeight('bold');
  row++;

  const filaInicioCuentasFam = row;
  CUENTAS_FAMILIA.forEach((cuenta, idx) => {
    sheet.getRange(row, 1).setValue(cuenta);

    for (let mes = 1; mes <= 12; mes++) {
      // Esperado = Saldo_Inicial + Ingresos - Egresos - Ahorro - GastosFijos_Pagados
      const formula = formulaEsperadoCuenta(cuenta, 'FAMILIA', mes, filaInicioCuentasFam + idx);
      sheet.getRange(row, mes + 1).setFormula('=' + formula);
    }
    sheet.getRange(row, 14).setFormula(`=M${row}`); // Último mes
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  // Total FAMILIA
  sheet.getRange(row, 1).setValue('TOTAL_FAM').setFontWeight('bold');
  for (let mes = 1; mes <= 12; mes++) {
    const col = mes + 1;
    const colLetter = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=SUM(${colLetter}${filaInicioCuentasFam}:${colLetter}${row - 1})`);
  }
  sheet.getRange(row, 14).setFormula(`=M${row}`);
  sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0').setFontWeight('bold');
  row += 2;

  // ─── CUENTAS NEUROTEA ───
  sheet.getRange(row, 1).setValue('── NEUROTEA ──').setFontWeight('bold');
  row++;

  const filaInicioCuentasNT = row;
  CUENTAS_NT.forEach((cuenta, idx) => {
    sheet.getRange(row, 1).setValue(cuenta);

    for (let mes = 1; mes <= 12; mes++) {
      const formula = formulaEsperadoCuenta(cuenta, 'NEUROTEA', mes, filaInicioCuentasNT + idx);
      sheet.getRange(row, mes + 1).setFormula('=' + formula);
    }
    sheet.getRange(row, 14).setFormula(`=M${row}`);
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  // Total NEUROTEA
  sheet.getRange(row, 1).setValue('TOTAL_NT').setFontWeight('bold');
  for (let mes = 1; mes <= 12; mes++) {
    const col = mes + 1;
    const colLetter = String.fromCharCode(64 + col);
    sheet.getRange(row, col).setFormula(`=SUM(${colLetter}${filaInicioCuentasNT}:${colLetter}${row - 1})`);
  }
  sheet.getRange(row, 14).setFormula(`=M${row}`);
  sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0').setFontWeight('bold');

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 3: CATEGORÍAS EGRESO (filas 55-75)
  // ═══════════════════════════════════════════════════════════════════════════════
  row = 55;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('📁 SECCIÓN 3: CATEGORÍAS EGRESO')
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);
  row++;

  // Headers
  headersMeses.forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h === 'CONCEPTO' ? 'CATEGORÍA' : h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  // ─── CATEGORÍAS FAMILIA ───
  sheet.getRange(row, 1).setValue('── FAMILIA ──').setFontWeight('bold');
  row++;

  const filaInicioCatFam = row;
  CATEGORIAS_EGRESO_FAMILIA.forEach((cat) => {
    sheet.getRange(row, 1).setValue(cat);

    for (let mes = 1; mes <= 12; mes++) {
      const formula = formulaSumproductCategoria(cat, 'FAMILIA', mes);
      sheet.getRange(row, mes + 1).setFormula('=' + formula);
    }
    sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  row += 2;

  // ─── CATEGORÍAS NEUROTEA ───
  sheet.getRange(row, 1).setValue('── NEUROTEA ──').setFontWeight('bold');
  row++;

  const filaInicioCatNT = row;
  CATEGORIAS_EGRESO_NT.forEach((cat) => {
    sheet.getRange(row, 1).setValue(cat);

    for (let mes = 1; mes <= 12; mes++) {
      const formula = formulaSumproductCategoria(cat, 'NEUROTEA', mes);
      sheet.getRange(row, mes + 1).setFormula('=' + formula);
    }
    sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 4: BALANCE CRUZADO NT↔FAM (filas 80-95)
  // ═══════════════════════════════════════════════════════════════════════════════
  row = 80;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('🔄 SECCIÓN 4: BALANCE CRUZADO NT↔FAM')
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);
  row++;

  headersMeses.forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  const conceptosBalance = [
    { label: 'Préstamos NT → FAM', subcatFam: 'Préstamo NeuroTEA', tipoFam: true },
    { label: 'Devoluciones FAM → NT', subcatFam: 'Devolución Familia → NT', tipoFam: false },
    { label: 'DEUDA FAM A NT', formula: 'resta' },
    { label: 'Préstamos FAM → NT', subcatNT: 'Préstamo Familia', tipoNT: true },
    { label: 'Devoluciones NT → FAM', subcatNT: 'Devolución NT → Familia', tipoNT: false },
    { label: 'DEUDA NT A FAM', formula: 'resta' },
    { label: 'BALANCE NETO', formula: 'neto' }
  ];

  const filaInicioBalance = row;
  conceptosBalance.forEach((item, idx) => {
    sheet.getRange(row, 1).setValue(item.label);

    if (item.subcatFam) {
      // Préstamos/devoluciones registrados en CARGA_FAMILIA
      for (let mes = 1; mes <= 12; mes++) {
        const formula = item.tipoFam
          ? formulaSumproductTipo(item.subcatFam, 'CARGA_FAMILIA', mes)
          : formulaSumproductSubcat(item.subcatFam, 'CARGA_FAMILIA', mes);
        sheet.getRange(row, mes + 1).setFormula('=' + formula);
      }
    } else if (item.subcatNT) {
      // Préstamos/devoluciones registrados en CARGA_NT
      for (let mes = 1; mes <= 12; mes++) {
        const formula = item.tipoNT
          ? formulaSumproductTipo(item.subcatNT, 'CARGA_NT', mes)
          : formulaSumproductSubcat(item.subcatNT, 'CARGA_NT', mes);
        sheet.getRange(row, mes + 1).setFormula('=' + formula);
      }
    } else if (item.formula === 'resta') {
      // DEUDA = Préstamos - Devoluciones
      for (let mes = 1; mes <= 12; mes++) {
        const col = mes + 1;
        const colLetter = String.fromCharCode(64 + col);
        sheet.getRange(row, col).setFormula(`=${colLetter}${row - 2}-${colLetter}${row - 1}`);
      }
    } else if (item.formula === 'neto') {
      // BALANCE NETO = DEUDA FAM A NT - DEUDA NT A FAM
      for (let mes = 1; mes <= 12; mes++) {
        const col = mes + 1;
        const colLetter = String.fromCharCode(64 + col);
        const filaDeudaFam = filaInicioBalance + 2;
        const filaDeudaNT = filaInicioBalance + 5;
        sheet.getRange(row, col).setFormula(`=${colLetter}${filaDeudaFam}-${colLetter}${filaDeudaNT}`);
      }
    }

    sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');

    // Resaltar filas de totales
    if (item.formula) {
      sheet.getRange(row, 1, 1, 14).setFontWeight('bold').setBackground(C.GRIS_FONDO);
    }
    row++;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 5: SUBCATEGORÍAS VARIABLES (filas 100-140)
  // ═══════════════════════════════════════════════════════════════════════════════
  row = 100;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('📋 SECCIÓN 5: SUBCATEGORÍAS VARIABLES')
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);
  row++;

  headersMeses.forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h === 'CONCEPTO' ? 'SUBCATEGORÍA' : h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  // ─── VARIABLES FAMILIA ───
  sheet.getRange(row, 1).setValue('── FAMILIA ──').setFontWeight('bold');
  row++;

  VARIABLES_FAMILIA.forEach((subcat) => {
    // Excluir préstamos/devoluciones (ya están en balance cruzado)
    if (subcat.includes('Préstamo') || subcat.includes('Devolución')) return;

    sheet.getRange(row, 1).setValue(subcat);

    for (let mes = 1; mes <= 12; mes++) {
      const formula = formulaSumproductSubcat(subcat, 'CARGA_FAMILIA', mes);
      sheet.getRange(row, mes + 1).setFormula('=' + formula);
    }
    sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  row += 2;

  // ─── VARIABLES NEUROTEA ───
  sheet.getRange(row, 1).setValue('── NEUROTEA ──').setFontWeight('bold');
  row++;

  VARIABLES_NT.forEach((subcat) => {
    if (subcat.includes('Préstamo') || subcat.includes('Devolución')) return;

    sheet.getRange(row, 1).setValue(subcat);

    for (let mes = 1; mes <= 12; mes++) {
      const formula = formulaSumproductSubcat(subcat, 'CARGA_NT', mes);
      sheet.getRange(row, mes + 1).setFormula('=' + formula);
    }
    sheet.getRange(row, 14).setFormula(`=SUM(B${row}:M${row})`);
    sheet.getRange(row, 2, 1, 13).setNumberFormat('#,##0');
    row++;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 6: LIQUIDEZ POR SEMANA (filas 145-160)
  // ═══════════════════════════════════════════════════════════════════════════════
  row = 145;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('📅 SECCIÓN 6: LIQUIDEZ POR SEMANA')
    .setFontWeight('bold').setBackground(C.GRIS_FONDO);
  row++;

  // Headers simplificados
  ['SEMANA', 'FAMILIA', 'NEUROTEA'].forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  // Nota: Estas fórmulas usan el mes seleccionado en MOVIMIENTO
  const semanas = [
    { label: 'Atrasados', condicion: '<DAY(TODAY())' },
    { label: 'Esta semana', condicion: '>=DAY(TODAY())' },
    { label: 'Próxima semana', condicion: '>DAY(TODAY())+7' },
    { label: 'Semana 3', condicion: '>DAY(TODAY())+14' }
  ];

  semanas.forEach((sem) => {
    sheet.getRange(row, 1).setValue(sem.label);
    // Fórmulas de liquidez basadas en MOVIMIENTO (DÍA + EST.PAGO)
    sheet.getRange(row, 2).setFormula(formulaLiquidezSemana('FAMILIA', sem.label));
    sheet.getRange(row, 3).setFormula(formulaLiquidezSemana('NEUROTEA', sem.label));
    sheet.getRange(row, 2, 1, 2).setNumberFormat('#,##0');
    row++;
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // SECCIÓN 7: ESTADOS DE PAGO POR MES (filas 165+)
  // ═══════════════════════════════════════════════════════════════════════════════
  row = 165;

  sheet.getRange(row, 1, 1, 14).merge()
    .setValue('✅ SECCIÓN 7: ESTADOS DE PAGO POR MES (Editable)')
    .setFontWeight('bold').setBackground(C.GANANCIA_FONDO);
  row++;

  // Esta sección se usa para guardar EST.PAGO independiente por mes
  // Headers: CONCEPTO + 12 meses
  const headersEstado = ['CONCEPTO', ...MESES_CORTOS];
  headersEstado.forEach((h, i) => {
    sheet.getRange(row, i + 1).setValue(h)
      .setFontWeight('bold').setBackground(C.GRIS_FONDO).setHorizontalAlignment('center');
  });
  row++;

  // ─── GASTOS FIJOS FAMILIA ───
  sheet.getRange(row, 1).setValue('── FAMILIA ──').setFontWeight('bold');
  row++;

  const gastosFijosFamilia = [...GASTOS_FIJOS_FAM, ...CUOTAS_FAM, ...OBLIGACIONES_FAM, ...SUSCRIPCIONES_FAM];
  const filaInicioEstadosFam = row;

  gastosFijosFamilia.forEach((gasto) => {
    sheet.getRange(row, 1).setValue(gasto.concepto);
    // Default: "Pendiente" para todos los meses
    for (let mes = 1; mes <= 12; mes++) {
      sheet.getRange(row, mes + 1).setValue('Pendiente');
      // Dropdown de estados
      sheet.getRange(row, mes + 1).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(ESTADOS, true)
          .setAllowInvalid(false)
          .build()
      );
    }
    row++;
  });

  row += 2;

  // ─── GASTOS FIJOS NEUROTEA ───
  sheet.getRange(row, 1).setValue('── NEUROTEA ──').setFontWeight('bold');
  row++;

  const gastosFijosNT = [...CLINICA_NT, ...SUELDOS_NT, ...TELEFONIA_NT, ...OBLIGACIONES_NT, ...EVENTOS_GASTOS_NT];
  const filaInicioEstadosNT = row;

  gastosFijosNT.forEach((gasto) => {
    sheet.getRange(row, 1).setValue(gasto.concepto);
    for (let mes = 1; mes <= 12; mes++) {
      sheet.getRange(row, mes + 1).setValue('Pendiente');
      sheet.getRange(row, mes + 1).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(ESTADOS, true)
          .setAllowInvalid(false)
          .build()
      );
    }
    row++;
  });

  // ─── FORMATO FINAL ───
  sheet.setColumnWidth(1, 250);
  for (let c = 2; c <= 14; c++) {
    sheet.setColumnWidth(c, 85);
  }

  // Ocultar la hoja (es solo para cálculos)
  // sheet.hideSheet(); // Comentado para debugging inicial

  console.log('Hoja CALCULOS creada exitosamente');
  return sheet;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES PARA GENERAR FÓRMULAS
// ═══════════════════════════════════════════════════════════════════════════════

function formulaSumproductIngresos(entidad, mes) {
  const hoja = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';
  const tipoEgreso = entidad === 'FAMILIA' ? 'Egreso Familiar' : 'Egreso NT';

  return `IFERROR(SUMPRODUCT(
    (TRIM(${hoja}!$B$4:$B$500)<>"${tipoEgreso}")*
    (TRIM(${hoja}!$B$4:$B$500)<>"Ahorro")*
    (IFERROR(MONTH(${hoja}!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(${hoja}!$A$4:$A$500);0)=2026)*
    (${hoja}!$F$4:$F$500)
  );0)`.replace(/\n\s*/g, '');
}

/**
 * v8.4: CORREGIDO - Ahora lee EST.PAGO de CALCULOS Sección 7 en vez de MOVIMIENTO
 * MOVIMIENTO solo muestra UN mes, CALCULOS Sección 7 tiene TODOS los meses.
 */
function formulaSumproductEgresosPagados(entidad, mes) {
  const hoja = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';
  const tipoEgreso = entidad === 'FAMILIA' ? 'Egreso Familiar' : 'Egreso NT';

  // Egresos de CARGA (variables) siempre son "Pagados" (ya pagados al cargarlos)
  const formulaCarga = `SUMPRODUCT(
    (TRIM(${hoja}!$B$4:$B$500)="${tipoEgreso}")*
    (IFERROR(MONTH(${hoja}!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(${hoja}!$A$4:$A$500);0)=2026)*
    (${hoja}!$F$4:$F$500)
  )`.replace(/\n\s*/g, '');

  // Egresos de GASTOS_FIJOS con estado "Pagado" en CALCULOS Sección 7
  // Columna del mes en GASTOS_FIJOS (G=Enero=7, H=Feb=8, etc.)
  const colMesGF = mes + 6;
  const colMesGFLetter = String.fromCharCode(64 + colMesGF);

  // Columna del mes en CALCULOS Sección 7 (B=Enero=2, C=Feb=3, etc.)
  const colMesCalc = mes + 1;
  const colMesCalcLetter = String.fromCharCode(64 + colMesCalc);

  // Rangos de CALCULOS Sección 7 (conceptos y estados)
  const rangoEstados = `CALCULOS!$${colMesCalcLetter}$167:$${colMesCalcLetter}$286`;
  const rangoConceptosCalc = 'CALCULOS!$A$167:$A$286';

  // GASTOS_FIJOS: usa INDEX/MATCH para obtener EST.PAGO de CALCULOS Sección 7
  const formulaGastosFijos = `SUMPRODUCT(
    (TRIM(GASTOS_FIJOS!$B$4:$B$200)="${entidad}")*
    (INDEX(${rangoEstados};MATCH(TRIM(GASTOS_FIJOS!$A$4:$A$200);${rangoConceptosCalc};0))="Pagado")*
    (GASTOS_FIJOS!$${colMesGFLetter}$4:$${colMesGFLetter}$200)
  )`.replace(/\n\s*/g, '');

  return `IFERROR(${formulaCarga}+${formulaGastosFijos};0)`;
}

/**
 * v8.4: CORREGIDO - Ahora lee EST.PAGO de CALCULOS Sección 7 en vez de MOVIMIENTO
 * Solo GASTOS_FIJOS pueden estar "Pendiente" (CARGA siempre es "Pagado").
 */
function formulaSumproductEgresosPendientes(entidad, mes) {
  // Columna del mes en GASTOS_FIJOS (G=Enero=7, H=Feb=8, etc.)
  const colMesGF = mes + 6;
  const colMesGFLetter = String.fromCharCode(64 + colMesGF);

  // Columna del mes en CALCULOS Sección 7 (B=Enero=2, C=Feb=3, etc.)
  const colMesCalc = mes + 1;
  const colMesCalcLetter = String.fromCharCode(64 + colMesCalc);

  // Rangos de CALCULOS Sección 7 (conceptos y estados)
  const rangoEstados = `CALCULOS!$${colMesCalcLetter}$167:$${colMesCalcLetter}$286`;
  const rangoConceptosCalc = 'CALCULOS!$A$167:$A$286';

  // GASTOS_FIJOS: usa INDEX/MATCH para obtener EST.PAGO de CALCULOS Sección 7
  return `IFERROR(SUMPRODUCT(
    (TRIM(GASTOS_FIJOS!$B$4:$B$200)="${entidad}")*
    (INDEX(${rangoEstados};MATCH(TRIM(GASTOS_FIJOS!$A$4:$A$200);${rangoConceptosCalc};0))="Pendiente")*
    (GASTOS_FIJOS!$${colMesGFLetter}$4:$${colMesGFLetter}$200)
  );0)`.replace(/\n\s*/g, '');
}

function formulaSumproductAhorro(categoria, mes) {
  return `IFERROR(SUMPRODUCT(
    (TRIM(CARGA_FAMILIA!$B$4:$B$500)="Ahorro")*
    (TRIM(CARGA_FAMILIA!$C$4:$C$500)="${categoria}")*
    (IFERROR(MONTH(CARGA_FAMILIA!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(CARGA_FAMILIA!$A$4:$A$500);0)=2026)*
    (CARGA_FAMILIA!$F$4:$F$500)
  );0)`.replace(/\n\s*/g, '');
}

function formulaEsperadoCuenta(cuenta, entidad, mes, fila) {
  const hoja = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';
  const tipoEgreso = entidad === 'FAMILIA' ? 'Egreso Familiar' : 'Egreso NT';

  // Saldo inicial de CONFIG
  const filaConfigFam = 68; // Fila donde empiezan las cuentas FAMILIA en CONFIG
  const filaConfigNT = 82;  // Fila donde empiezan las cuentas NEUROTEA en CONFIG
  const filaConfig = entidad === 'FAMILIA' ? filaConfigFam : filaConfigNT;
  const cuentasArray = entidad === 'FAMILIA' ? CUENTAS_FAMILIA : CUENTAS_NT;
  const idxCuenta = cuentasArray.indexOf(cuenta);
  const filaConfigCuenta = filaConfig + idxCuenta;
  const colConfigMes = mes + 1; // B=1, C=2, etc. para meses
  const colConfigLetter = String.fromCharCode(64 + colConfigMes);

  const saldoInicial = `CONFIG!$${colConfigLetter}$${filaConfigCuenta}`;

  // Ingresos a esta cuenta
  const ingresos = `SUMPRODUCT(
    (TRIM(${hoja}!$G$4:$G$500)="${cuenta}")*
    (TRIM(${hoja}!$B$4:$B$500)<>"${tipoEgreso}")*
    (TRIM(${hoja}!$B$4:$B$500)<>"Ahorro")*
    (IFERROR(MONTH(${hoja}!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(${hoja}!$A$4:$A$500);0)=2026)*
    (${hoja}!$F$4:$F$500)
  )`.replace(/\n\s*/g, '');

  // Egresos de esta cuenta (CARGA)
  const egresos = `SUMPRODUCT(
    (TRIM(${hoja}!$G$4:$G$500)="${cuenta}")*
    (TRIM(${hoja}!$B$4:$B$500)="${tipoEgreso}")*
    (IFERROR(MONTH(${hoja}!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(${hoja}!$A$4:$A$500);0)=2026)*
    (${hoja}!$F$4:$F$500)
  )`.replace(/\n\s*/g, '');

  // Ahorro (solo FAMILIA)
  let ahorro = '0';
  if (entidad === 'FAMILIA') {
    ahorro = `SUMPRODUCT(
      (TRIM(CARGA_FAMILIA!$G$4:$G$500)="${cuenta}")*
      (TRIM(CARGA_FAMILIA!$B$4:$B$500)="Ahorro")*
      (IFERROR(MONTH(CARGA_FAMILIA!$A$4:$A$500);0)=${mes})*
      (IFERROR(YEAR(CARGA_FAMILIA!$A$4:$A$500);0)=2026)*
      (CARGA_FAMILIA!$F$4:$F$500)
    )`.replace(/\n\s*/g, '');
  }

  // Gastos fijos pagados de esta cuenta
  // v8.4: CORREGIDO - Leer estado de CALCULOS Sección 7 en vez de MOVIMIENTO
  // GASTOS_FIJOS: A=Concepto, B=Entidad, F=Cuenta, G-R=Montos (ENE-DIC)
  // CALCULOS Sección 7: A=Concepto, B-M=Estados por mes (filas 167-286)

  // Columna del mes en GASTOS_FIJOS (G=Enero=7, H=Feb=8, etc.)
  const colMesGF = mes + 6;
  const colMesGFLetter = String.fromCharCode(64 + colMesGF);

  // Columna del mes en CALCULOS Sección 7 (B=Enero=2, C=Feb=3, etc.)
  const colMesCalc = mes + 1;
  const colMesCalcLetter = String.fromCharCode(64 + colMesCalc);

  // Rangos de CALCULOS Sección 7 (conceptos y estados)
  const rangoEstados = `CALCULOS!$${colMesCalcLetter}$167:$${colMesCalcLetter}$286`;
  const rangoConceptosCalc = 'CALCULOS!$A$167:$A$286';

  const gastosFijos = `SUMPRODUCT(
    (TRIM(GASTOS_FIJOS!$B$4:$B$200)="${entidad}")*
    (TRIM(GASTOS_FIJOS!$F$4:$F$200)="${cuenta}")*
    (INDEX(${rangoEstados};MATCH(TRIM(GASTOS_FIJOS!$A$4:$A$200);${rangoConceptosCalc};0))="Pagado")*
    (GASTOS_FIJOS!$${colMesGFLetter}$4:$${colMesGFLetter}$200)
  )`.replace(/\n\s*/g, '');

  return `IFERROR(${saldoInicial}+${ingresos}-${egresos}-${ahorro}-${gastosFijos};0)`;
}

/**
 * v8.4: CORREGIDO - Ahora lee de GASTOS_FIJOS + CARGA directamente
 * Antes leía de MOVIMIENTO que solo tiene datos de UN mes.
 *
 * La fórmula suma:
 * 1. Gastos fijos de esa categoría con estado "Pagado" en CALCULOS sección 7
 * 2. Variables de CARGA de ese mes (siempre "pagados")
 */
function formulaSumproductCategoria(categoria, entidad, mes) {
  // ═══ GASTOS FIJOS: Leer de GASTOS_FIJOS + verificar estado en CALCULOS sección 7 ═══
  // GASTOS_FIJOS: A=Concepto, B=Entidad, C=Categoría, G-R=Meses (ENE-DIC)
  // CALCULOS sección 7: A=Concepto, B-M=Estados por mes (desde fila 167)

  // Columna del mes en GASTOS_FIJOS: G=ENE(1), H=FEB(2), etc.
  const colMesGF = mes + 6; // G=7, pero mes=1 → col 7
  const colMesGFLetter = String.fromCharCode(64 + colMesGF); // G, H, I, ...

  // Columna del mes en CALCULOS sección 7: B=ENE(1), C=FEB(2), etc.
  const colMesCalc = mes + 1; // B=2, C=3, etc.
  const colMesCalcLetter = String.fromCharCode(64 + colMesCalc);

  // Rango de estados en CALCULOS sección 7 (filas 167-286 aprox)
  const rangoEstados = `CALCULOS!$${colMesCalcLetter}$167:$${colMesCalcLetter}$286`;
  const rangoConceptosCalc = 'CALCULOS!$A$167:$A$286';

  // Fórmula para gastos fijos: suma montos donde categoría + entidad + estado="Pagado"
  const formulaGastosFijos = `SUMPRODUCT(
    (TRIM(GASTOS_FIJOS!$C$4:$C$200)="${categoria}")*
    (TRIM(GASTOS_FIJOS!$B$4:$B$200)="${entidad}")*
    (INDEX(${rangoEstados};MATCH(GASTOS_FIJOS!$A$4:$A$200;${rangoConceptosCalc};0))="Pagado")*
    (GASTOS_FIJOS!$${colMesGFLetter}$4:$${colMesGFLetter}$200)
  )`.replace(/\n\s*/g, '');

  // ═══ VARIABLES: Leer de CARGA directamente (siempre "pagados") ═══
  let formulaVariables = '0';
  if (categoria === 'VARIABLES') {
    const hojaCarga = entidad === 'FAMILIA' ? 'CARGA_FAMILIA' : 'CARGA_NT';
    const tipoEgreso = entidad === 'FAMILIA' ? 'Egreso Familiar' : 'Egreso NT';

    formulaVariables = `SUMPRODUCT(
      (TRIM(${hojaCarga}!$B$4:$B$500)="${tipoEgreso}")*
      (TRIM(${hojaCarga}!$C$4:$C$500)="VARIABLES")*
      (IFERROR(MONTH(${hojaCarga}!$A$4:$A$500);0)=${mes})*
      (IFERROR(YEAR(${hojaCarga}!$A$4:$A$500);0)=2026)*
      (${hojaCarga}!$F$4:$F$500)
    )`.replace(/\n\s*/g, '');
  }

  return `IFERROR(${formulaGastosFijos}+${formulaVariables};0)`;
}

function formulaSumproductTipo(tipo, hoja, mes) {
  return `IFERROR(SUMPRODUCT(
    (TRIM(${hoja}!$B$4:$B$500)="${tipo}")*
    (IFERROR(MONTH(${hoja}!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(${hoja}!$A$4:$A$500);0)=2026)*
    (${hoja}!$F$4:$F$500)
  );0)`.replace(/\n\s*/g, '');
}

function formulaSumproductSubcat(subcat, hoja, mes) {
  return `IFERROR(SUMPRODUCT(
    (TRIM(${hoja}!$D$4:$D$500)="${subcat}")*
    (IFERROR(MONTH(${hoja}!$A$4:$A$500);0)=${mes})*
    (IFERROR(YEAR(${hoja}!$A$4:$A$500);0)=2026)*
    (${hoja}!$F$4:$F$500)
  );0)`.replace(/\n\s*/g, '');
}

function formulaLiquidezSemana(entidad, semana) {
  const rangoMov = entidad === 'FAMILIA' ? '9:116' : '122:206';
  const ini = rangoMov.split(':')[0];
  const fin = rangoMov.split(':')[1];

  let condicionDia = '';
  switch(semana) {
    case 'Atrasados':
      condicionDia = `(MOVIMIENTO!$D$${ini}:$D$${fin}>0)*(MOVIMIENTO!$D$${ini}:$D$${fin}<DAY(TODAY()))`;
      break;
    case 'Esta semana':
      condicionDia = `(MOVIMIENTO!$D$${ini}:$D$${fin}>=DAY(TODAY()))*(MOVIMIENTO!$D$${ini}:$D$${fin}<=DAY(TODAY())+7)`;
      break;
    case 'Próxima semana':
      condicionDia = `(MOVIMIENTO!$D$${ini}:$D$${fin}>DAY(TODAY())+7)*(MOVIMIENTO!$D$${ini}:$D$${fin}<=DAY(TODAY())+14)`;
      break;
    case 'Semana 3':
      condicionDia = `(MOVIMIENTO!$D$${ini}:$D$${fin}>DAY(TODAY())+14)*(MOVIMIENTO!$D$${ini}:$D$${fin}<=DAY(TODAY())+21)`;
      break;
  }

  return `=IFERROR(SUMPRODUCT(
    ${condicionDia}*
    (TRIM(MOVIMIENTO!$M$${ini}:$M$${fin})="${entidad}")*
    (TRIM(MOVIMIENTO!$J$${ini}:$J$${fin})="Pendiente")*
    (MOVIMIENTO!$F$${ini}:$F$${fin})
  );0)`.replace(/\n\s*/g, '');
}
