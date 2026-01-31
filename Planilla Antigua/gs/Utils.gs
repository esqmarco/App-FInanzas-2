/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UTILS.GS - FUNCIONES UTILITARIAS Y CÁLCULOS
 * Sistema de Control Financiero 2026 - NeuroTEA & Familia
 * Versión 6.1 - Estilo sobrio profesional
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// FORMATEO DE NÚMEROS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Formatea un número como guaraníes paraguayos
 * @param {number} numero - El número a formatear
 * @return {string} El número formateado con separadores de miles
 */
function formatearGuaranies(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return '-';
  return new Intl.NumberFormat('es-PY').format(numero);
}

/**
 * Formatea un número como porcentaje
 * @param {number} numero - El número a formatear (0.5 = 50%)
 * @return {string} El porcentaje formateado
 */
function formatearPorcentaje(numero) {
  if (numero === null || numero === undefined || isNaN(numero)) return '-';
  return (numero * 100).toFixed(0) + '%';
}

// ═══════════════════════════════════════════════════════════════════════════════
// CÁLCULOS DE LIQUIDEZ
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula la liquidez para las próximas 3 semanas
 * @param {string} entidad - 'FAMILIA' o 'NEUROTEA'
 * @param {number} mesIndex - Índice del mes (0-11)
 * @return {Object} Objeto con los cálculos de liquidez
 */
function calcularLiquidez(entidad, mesIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoy = new Date();
  const diaActual = hoy.getDate();

  // Obtener caja disponible
  const cajaDisponible = calcularCajaDisponible(entidad, mesIndex);

  // Obtener gastos por vencer de GASTOS_FIJOS
  const gastosFijos = ss.getSheetByName(NOMBRES_HOJAS.GASTOS_FIJOS);
  if (!gastosFijos) return null;

  const datos = gastosFijos.getDataRange().getValues();
  let atrasados = { cantidad: 0, monto: 0 };
  let semana1 = { cantidad: 0, monto: 0 };
  let semana2 = { cantidad: 0, monto: 0 };
  let semana3 = { cantidad: 0, monto: 0 };

  // Calcular rangos de días
  const finSemana1 = diaActual + 7;
  const finSemana2 = diaActual + 14;
  const finSemana3 = diaActual + 21;

  datos.forEach((fila, i) => {
    if (i < 6) return; // Saltar headers

    // ESTRUCTURA GASTOS_FIJOS v2:
    // A(0)=Concepto, B(1)=Entidad, C(2)=Categoría, D(3)=Frecuencia, E(4)=Día, F(5)=Cuenta, G(6)=Base, H-S(7-18)=Meses
    const entidadFila = fila[1]; // Columna B = ENTIDAD
    const dia = fila[4]; // Columna E = DÍA
    const montoBase = fila[6]; // Columna G = BASE (v2: era F=5, ahora G=6)
    const montoMes = fila[7 + mesIndex]; // Columnas H-S = Meses (v2: era G-R=6+mes, ahora H-S=7+mes)

    if (entidadFila !== entidad) return;
    if (!dia || dia === '') return;

    const monto = montoMes || montoBase || 0;
    if (monto <= 0) return;

    if (dia < diaActual) {
      // Atrasados
      atrasados.cantidad++;
      atrasados.monto += monto;
    } else if (dia <= finSemana1) {
      semana1.cantidad++;
      semana1.monto += monto;
    } else if (dia <= finSemana2) {
      semana2.cantidad++;
      semana2.monto += monto;
    } else if (dia <= finSemana3) {
      semana3.cantidad++;
      semana3.monto += monto;
    }
  });

  // Calcular saldos proyectados
  const saldoAtrasados = cajaDisponible - atrasados.monto;
  const saldoSem1 = saldoAtrasados - semana1.monto;
  const saldoSem2 = saldoSem1 - semana2.monto;
  const saldoSem3 = saldoSem2 - semana3.monto;

  return {
    cajaDisponible,
    atrasados: { ...atrasados, saldo: saldoAtrasados },
    semana1: { ...semana1, saldo: saldoSem1 },
    semana2: { ...semana2, saldo: saldoSem2 },
    semana3: { ...semana3, saldo: saldoSem3 },
    saldoFinal: saldoSem3
  };
}

/**
 * Calcula la caja disponible (ingresos - egresos pagados)
 */
function calcularCajaDisponible(entidad, mesIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const nombreHojaCarga = entidad === 'FAMILIA'
    ? NOMBRES_HOJAS.CARGA_FAMILIA
    : NOMBRES_HOJAS.CARGA_NT;

  const hojaCarga = ss.getSheetByName(nombreHojaCarga);
  if (!hojaCarga) return 0;

  const datos = hojaCarga.getDataRange().getValues();
  const mesActual = MESES[mesIndex];
  const añoActual = AÑO;

  let ingresos = 0;
  let egresosPagados = 0;

  const tiposIngreso = entidad === 'FAMILIA'
    ? TIPOS_INGRESO_FAMILIA
    : TIPOS_INGRESO_NT;

  datos.forEach((fila, i) => {
    if (i < 3) return; // Saltar headers

    const fecha = fila[0]; // Columna FECHA
    const tipo = fila[1]; // Columna TIPO
    const monto = fila[5]; // Columna MONTO
    const estado = fila[7]; // Columna ESTADO

    if (!fecha || !monto) return;

    // Verificar que sea del mes actual
    const fechaObj = new Date(fecha);
    if (fechaObj.getMonth() !== mesIndex) return;
    if (fechaObj.getFullYear() !== añoActual) return;

    if (tiposIngreso.includes(tipo)) {
      ingresos += monto;
    } else if (estado === 'Pagado') {
      egresosPagados += monto;
    }
  });

  return ingresos - egresosPagados;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CÁLCULOS DE GANANCIA NEUROTEA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula la ganancia de NeuroTEA para un mes
 */
function calcularGananciaNT(mesIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const movimiento = ss.getSheetByName(NOMBRES_HOJAS.MOVIMIENTO);
  if (!movimiento) return null;

  // Buscar totales de ingresos y egresos NT
  // (En implementación completa, esto buscaría en las celdas correspondientes)

  const ingresos = 30000000; // Placeholder
  const egresos = 27300000;  // Placeholder

  const ganancia = ingresos - egresos;
  const porcentajeGanancia = ingresos > 0 ? (ganancia / ingresos) * 100 : 0;
  const metaCumplida = porcentajeGanancia >= METAS_NT.GANANCIA_MINIMA_PCT;

  // Distribución de la ganancia según metas
  const metaGanancia = ingresos * (METAS_NT.GANANCIA_MINIMA_PCT / 100);
  const utilidadDueño = metaGanancia * (METAS_NT.DIST_UTILIDAD_DUEÑO / 100);
  const fondoEmergencia = metaGanancia * (METAS_NT.DIST_FONDO_EMERGENCIA / 100);
  const fondoInversion = metaGanancia * (METAS_NT.DIST_FONDO_INVERSION / 100);

  return {
    ingresos,
    egresos,
    ganancia,
    porcentajeGanancia,
    metaCumplida,
    distribucion: {
      utilidadDueño,
      fondoEmergencia,
      fondoInversion
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CÁLCULOS DE BALANCE CRUZADO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula el balance cruzado entre NT y Familia (v7.12 - Bidireccional completo)
 * FLUJO 1: NT → FAM (NT presta a Familia)
 * FLUJO 2: FAM → NT (Familia presta a NT)
 */
function calcularBalanceCruzado(mesIndex) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);

  // FLUJO 1: NT → FAM
  let prestamosNTaFamMes = 0, prestamosNTaFamAcum = 0;
  let devolucionesFamaNTMes = 0, devolucionesFamaNTAcum = 0;

  // FLUJO 2: FAM → NT (NUEVO)
  let prestamosFamaNTMes = 0, prestamosFamaNTAcum = 0;
  let devolucionesNTaFamMes = 0, devolucionesNTaFamAcum = 0;

  // Buscar en CARGA_NT
  if (cargaNT) {
    const datos = cargaNT.getDataRange().getValues();
    datos.forEach((fila, i) => {
      if (i < 3) return;
      const fecha = fila[0];
      const subcat = fila[3];
      const monto = Number(fila[5]) || 0;
      if (monto <= 0) return;

      const fechaObj = new Date(fecha);
      const esDelMes = fechaObj.getMonth() === mesIndex && fechaObj.getFullYear() === AÑO;

      // FLUJO 1: NT presta a FAM
      if (subcat === 'Préstamo NT → Familia') {
        prestamosNTaFamAcum += monto;
        if (esDelMes) prestamosNTaFamMes += monto;
      }
      // FLUJO 2: NT devuelve a FAM
      if (subcat === 'Devolución NT → Familia') {
        devolucionesNTaFamAcum += monto;
        if (esDelMes) devolucionesNTaFamMes += monto;
      }
    });
  }

  // Buscar en CARGA_FAMILIA
  if (cargaFam) {
    const datos = cargaFam.getDataRange().getValues();
    datos.forEach((fila, i) => {
      if (i < 3) return;
      const fecha = fila[0];
      const subcat = fila[3];
      const monto = Number(fila[5]) || 0;
      if (monto <= 0) return;

      const fechaObj = new Date(fecha);
      const esDelMes = fechaObj.getMonth() === mesIndex && fechaObj.getFullYear() === AÑO;

      // FLUJO 1: FAM devuelve a NT
      if (subcat === 'Devolución Familia → NT') {
        devolucionesFamaNTAcum += monto;
        if (esDelMes) devolucionesFamaNTMes += monto;
      }
      // FLUJO 2: FAM presta a NT
      if (subcat === 'Préstamo Familia → NT') {
        prestamosFamaNTAcum += monto;
        if (esDelMes) prestamosFamaNTMes += monto;
      }
    });
  }

  // Calcular deudas netas
  const deudaFamANT_Mes = prestamosNTaFamMes - devolucionesFamaNTMes;
  const deudaFamANT_Acum = prestamosNTaFamAcum - devolucionesFamaNTAcum;
  const deudaNTaFam_Mes = prestamosFamaNTMes - devolucionesNTaFamMes;
  const deudaNTaFam_Acum = prestamosFamaNTAcum - devolucionesNTaFamAcum;

  // Balance neto: positivo = FAM debe a NT, negativo = NT debe a FAM
  const balanceNetoMes = deudaFamANT_Mes - deudaNTaFam_Mes;
  const balanceNetoAcum = deudaFamANT_Acum - deudaNTaFam_Acum;

  let estado;
  if (balanceNetoAcum > 0) {
    estado = 'FAMILIA DEBE A NT';
  } else if (balanceNetoAcum < 0) {
    estado = 'NT DEBE A FAMILIA';
  } else {
    estado = 'EQUILIBRADO';
  }

  return {
    // FLUJO 1: NT → FAM
    prestamoNTMes: prestamosNTaFamMes,
    prestamoNTAcum: prestamosNTaFamAcum,
    devFamMes: devolucionesFamaNTMes,
    devFamAcum: devolucionesFamaNTAcum,
    deudaFamANT_Mes,
    deudaFamANT_Acum,
    // FLUJO 2: FAM → NT
    prestamoFamMes: prestamosFamaNTMes,
    prestamoFamAcum: prestamosFamaNTAcum,
    devNTMes: devolucionesNTaFamMes,
    devNTAcum: devolucionesNTaFamAcum,
    deudaNTaFam_Mes,
    deudaNTaFam_Acum,
    // Balance neto
    balanceNetoMes,
    balanceNetoAcum,
    estado
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE ARRASTRE (GASTOS_FIJOS)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el monto efectivo para un gasto fijo en un mes específico
 * Implementa la lógica de arrastre: usa el último valor hacia atrás o BASE
 * ESTRUCTURA GASTOS_FIJOS v2: A(0)=Concepto, B(1)=Entidad, C(2)=Categoría, D(3)=Frecuencia, E(4)=Día, F(5)=Cuenta, G(6)=Base, H-S(7-18)=Meses
 */
function obtenerMontoEfectivo(fila, mesIndex, base) {
  // Buscar hacia atrás desde el mes actual
  for (let m = mesIndex; m >= 0; m--) {
    const valor = fila[7 + m]; // Columnas de meses empiezan en H (índice 7) - v2 con CUENTA
    if (valor !== '' && valor !== null && valor !== undefined) {
      return valor;
    }
  }
  // Si no hay valor, usar BASE (columna G, índice 6)
  return base || 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE VALIDACIÓN
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Verifica si un tipo de transacción es ingreso
 */
function esIngreso(tipo, entidad) {
  if (entidad === 'FAMILIA') {
    return TIPOS_INGRESO_FAMILIA.includes(tipo);
  } else {
    return TIPOS_INGRESO_NT.includes(tipo);
  }
}

/**
 * Obtiene el índice del mes actual (0-11)
 */
function getMesActual() {
  return new Date().getMonth();
}

/**
 * Convierte nombre de mes a índice
 */
function mesAIndice(nombreMes) {
  return MESES.findIndex(m => m === nombreMes);
}

/**
 * Convierte índice a nombre de mes
 */
function indiceAMes(indice) {
  return MESES[indice] || 'Enero';
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE COLOR / SEMÁFORO
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determina el color del semáforo basado en un porcentaje
 * @param {number} porcentaje - El porcentaje a evaluar
 * @param {boolean} esIngreso - Si es ingreso (mayor es mejor) o egreso (menor es mejor)
 * @return {string} Código de color hex
 */
function colorSemaforo(porcentaje, esIngreso = false) {
  if (esIngreso) {
    // Para ingresos: verde si >= 100%, amarillo si >= 90%, rojo si < 90%
    if (porcentaje >= 100) return COLORES.VERDE;
    if (porcentaje >= 90) return COLORES.AMARILLO;
    return COLORES.ROJO;
  } else {
    // Para egresos: verde si <= 100%, amarillo si <= 110%, rojo si > 110%
    if (porcentaje <= 100) return COLORES.VERDE;
    if (porcentaje <= 110) return COLORES.AMARILLO;
    return COLORES.ROJO;
  }
}

/**
 * Determina el color para liquidez
 */
function colorLiquidez(saldo) {
  if (saldo < 0) return COLORES.ROJO;
  if (saldo < 500000) return COLORES.AMARILLO;
  return COLORES.VERDE;
}

/**
 * Determina el badge de estado
 */
function badgeEstado(valor, umbralPositivo, umbralNegativo) {
  if (valor >= umbralPositivo) return { texto: 'OK', color: 'green' };
  if (valor <= umbralNegativo) return { texto: 'DÉFICIT', color: 'red' };
  return { texto: 'AJUSTADO', color: 'yellow' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIONES DE FECHA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el primer día del mes
 */
function primerDiaMes(mes, año) {
  return new Date(año, mes, 1);
}

/**
 * Obtiene el último día del mes
 */
function ultimoDiaMes(mes, año) {
  return new Date(año, mes + 1, 0);
}

/**
 * Calcula los días restantes del mes
 */
function diasRestantesMes() {
  const hoy = new Date();
  const ultimoDia = ultimoDiaMes(hoy.getMonth(), hoy.getFullYear());
  return ultimoDia.getDate() - hoy.getDate();
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOG Y DEBUG
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Registra un mensaje en el log (para debug)
 */
function log(mensaje, tipo = 'info') {
  const timestamp = new Date().toLocaleString('es-PY');
  console.log(`[${timestamp}] [${tipo.toUpperCase()}] ${mensaje}`);
}

/**
 * Muestra un toast de notificación
 */
function mostrarToast(mensaje, titulo = 'Info', duracion = 5) {
  SpreadsheetApp.getActiveSpreadsheet().toast(mensaje, titulo, duracion);
}

// ═══════════════════════════════════════════════════════════════════════════════
// REPARACIÓN DE DATOS EN CARGA (v7.23)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Repara fechas y montos en CARGA_FAMILIA y CARGA_NT que estén almacenados como texto.
 * Esto puede ocurrir al pegar datos desde otro Google Sheet o fuente externa.
 *
 * Comportamiento:
 * - Fechas texto bien formadas ("02/01/2026") → auto-convierte a Date
 * - Montos texto ("68.416.658") → auto-convierte a Number
 * - Fechas MALFORMADAS ("24/012026", año incorrecto) → NO toca, ALERTA al usuario
 */
function repararDatosCarga() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const resultado = ui.alert(
    '🔧 Reparar Datos de CARGA',
    'Esta función revisa CARGA_FAMILIA y CARGA_NT:\n\n' +
    '✅ Auto-repara:\n' +
    '• Fechas pegadas como texto (formato correcto dd/mm/' + AÑO + ')\n' +
    '• Montos pegados como texto\n' +
    '• Textos con espacios extra (trim)\n' +
    '• Validaciones incorrectas en filas pegadas\n\n' +
    '⚠️ Solo alerta (NO modifica):\n' +
    '• Fechas con barras faltantes ("24/012026")\n' +
    '• Fechas con año incorrecto\n' +
    '• Fechas no reconocibles\n\n' +
    '¿Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (resultado !== ui.Button.YES) return;

  let totalReparadas = 0;
  let validacionesReparadas = 0;
  const alertas = []; // Fechas malformadas que requieren revisión manual

  // Determinar tipos de ingreso por hoja
  const tiposIngresoMap = {};
  tiposIngresoMap[NOMBRES_HOJAS.CARGA_FAMILIA] = TODOS_TIPOS_INGRESO_FAMILIA;
  tiposIngresoMap[NOMBRES_HOJAS.CARGA_NT] = TODOS_TIPOS_INGRESO_NT;

  // Reparar ambas hojas
  [NOMBRES_HOJAS.CARGA_FAMILIA, NOMBRES_HOJAS.CARGA_NT].forEach(nombreHoja => {
    const sheet = ss.getSheetByName(nombreHoja);
    if (!sheet) return;

    const ultimaFila = sheet.getLastRow();
    if (ultimaFila < 4) return; // No hay datos

    const rango = sheet.getRange(4, 1, ultimaFila - 3, 9); // A4:I{ultima}
    const datos = rango.getValues();
    let cambios = 0;
    let validaciones = 0;
    const tiposIngreso = tiposIngresoMap[nombreHoja] || [];

    datos.forEach((fila, i) => {
      const filaSheet = i + 4;
      let huboCambio = false;

      // ── COLUMNA A: FECHA ──
      const fechaVal = fila[0];
      if (fechaVal && !(fechaVal instanceof Date)) {
        // Es texto - analizar qué tipo de problema tiene
        const fechaStr = String(fechaVal).trim();
        const analisis = analizarFechaTexto(fechaStr);

        if (analisis.tipo === 'ok') {
          // Fecha bien formada, solo es texto → auto-reparar
          sheet.getRange(filaSheet, 1).setValue(analisis.fecha);
          sheet.getRange(filaSheet, 1).setNumberFormat('dd/mm/yyyy');
          huboCambio = true;
        } else {
          // Fecha malformada → NO tocar, agregar a alertas
          alertas.push(`${nombreHoja} fila ${filaSheet}: "${fechaStr}" → ${analisis.problema}`);
        }
      } else if (fechaVal instanceof Date) {
        // Es fecha correcta, solo asegurar formato visual
        sheet.getRange(filaSheet, 1).setNumberFormat('dd/mm/yyyy');
      }

      // ── COLUMNAS B, C, D, G: TRIM ESPACIOS ──
      // Columna B=TIPO, C=CATEGORÍA, D=SUBCATEGORÍA, G=CUENTA
      const colsTexto = [1, 2, 3, 6]; // indices 0-based en el array (B=1, C=2, D=3, G=6)
      colsTexto.forEach(idx => {
        const val = fila[idx];
        if (val && typeof val === 'string') {
          const trimmed = val.trim();
          if (trimmed !== val) {
            sheet.getRange(filaSheet, idx + 1).setValue(trimmed);
            huboCambio = true;
          }
        }
      });

      // ── COLUMNA F: MONTO ──
      const montoVal = fila[5];
      if (montoVal && typeof montoVal === 'string') {
        const montoNumero = limpiarMonto(montoVal);
        if (montoNumero > 0) {
          sheet.getRange(filaSheet, 6).setValue(montoNumero);
          huboCambio = true;
        }
      }

      // ── VALIDACIONES: Limpiar warnings en filas de ingreso/ahorro ──
      const tipo = String(fila[1] || '').trim();
      const categoria = String(fila[2] || '').trim();
      const subcategoria = String(fila[3] || '').trim();

      // Si TIPO es ingreso → CAT y SUBCAT deben ser "-" sin validación
      if (tiposIngreso.includes(tipo)) {
        if (categoria === '-' || categoria === '') {
          sheet.getRange(filaSheet, 3).clearDataValidations();
          if (categoria !== '-') {
            sheet.getRange(filaSheet, 3).setValue('-');
            huboCambio = true;
          }
        }
        if (subcategoria === '-' || subcategoria === '') {
          sheet.getRange(filaSheet, 4).clearDataValidations();
          if (subcategoria !== '-') {
            sheet.getRange(filaSheet, 4).setValue('-');
            huboCambio = true;
          }
        }
        validaciones++;
      }
      // Si TIPO es Ahorro → SUBCAT debe ser "-" sin validación
      else if (tipo === TIPO_AHORRO) {
        if (subcategoria === '-' || subcategoria === '') {
          sheet.getRange(filaSheet, 4).clearDataValidations();
          if (subcategoria !== '-') {
            sheet.getRange(filaSheet, 4).setValue('-');
            huboCambio = true;
          }
        }
        validaciones++;
      }
      // Si es Egreso y CAT no es VARIABLES → SUBCAT debe ser "-" sin validación
      else if (tipo && categoria && categoria !== 'VARIABLES' && categoria !== 'EVENTOS' && categoria !== '-') {
        if (subcategoria === '-' || subcategoria === '') {
          sheet.getRange(filaSheet, 4).clearDataValidations();
          if (subcategoria !== '-') {
            sheet.getRange(filaSheet, 4).setValue('-');
            huboCambio = true;
          }
        }
        validaciones++;
      }

      if (huboCambio) cambios++;
    });

    totalReparadas += cambios;
    validacionesReparadas += validaciones;
    if (cambios > 0) {
      log(`Reparadas ${cambios} filas en ${nombreHoja}`, 'fix');
    }
    if (validaciones > 0) {
      log(`Validaciones limpiadas en ${validaciones} filas de ${nombreHoja}`, 'fix');
    }
  });

  // Mostrar resultado
  let mensaje = '';

  if (totalReparadas > 0) {
    mensaje += `✅ Se repararon ${totalReparadas} filas (texto → fecha/número/trim).\n`;
  } else {
    mensaje += '✅ No se encontraron datos texto que reparar.\n';
  }

  if (validacionesReparadas > 0) {
    mensaje += `✅ Se limpiaron validaciones en ${validacionesReparadas} filas.\n`;
  }

  mensaje += 'Las fórmulas deberían actualizarse automáticamente.\n';

  if (alertas.length > 0) {
    mensaje += `\n⚠️ ${alertas.length} fecha(s) con problemas (NO modificadas):\n\n`;
    // Mostrar máximo 15 alertas para no desbordar el cuadro
    const mostrar = alertas.slice(0, 15);
    mensaje += mostrar.join('\n');
    if (alertas.length > 15) {
      mensaje += `\n... y ${alertas.length - 15} más. Ver log para lista completa.`;
      alertas.forEach(a => log(a, 'warning'));
    }
    mensaje += '\n\nCorregí estas fechas manualmente en la hoja.';
  }

  ui.alert(
    alertas.length > 0 ? '⚠️ Reparación con alertas' : '✅ Reparación completada',
    mensaje,
    ui.ButtonSet.OK
  );
}

/**
 * Analiza una fecha en texto y determina si es reparable automáticamente o necesita revisión.
 *
 * @param {string} texto - El texto a analizar
 * @returns {Object} { tipo: 'ok'|'error', fecha?: Date, problema?: string }
 *   - tipo 'ok': fecha bien formada, se puede auto-reparar
 *   - tipo 'error': fecha malformada, requiere revisión manual
 */
function analizarFechaTexto(texto) {
  if (!texto) return { tipo: 'error', problema: 'Vacío' };

  // Solo auto-reparar formato estándar: dd/mm/yyyy con año correcto
  const match = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const dia = parseInt(match[1]);
    const mes = parseInt(match[2]);
    const anio = parseInt(match[3]);

    if (dia < 1 || dia > 31) return { tipo: 'error', problema: `Día ${dia} fuera de rango` };
    if (mes < 1 || mes > 12) return { tipo: 'error', problema: `Mes ${mes} fuera de rango` };
    if (anio !== AÑO) return { tipo: 'error', problema: `Año ${anio} (esperado ${AÑO})` };

    return { tipo: 'ok', fecha: new Date(anio, mes - 1, dia) };
  }

  // Detectar patrones malformados conocidos para dar mejor mensaje
  const matchBarraFaltante = texto.match(/^(\d{1,2})\/(\d{2})(\d{4})$/);
  if (matchBarraFaltante) {
    return { tipo: 'error', problema: `Falta "/" → ¿debería ser ${matchBarraFaltante[1]}/${matchBarraFaltante[2]}/${matchBarraFaltante[3]}?` };
  }

  const matchSinBarras = texto.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (matchSinBarras) {
    return { tipo: 'error', problema: `Sin barras → ¿debería ser ${matchSinBarras[1]}/${matchSinBarras[2]}/${matchSinBarras[3]}?` };
  }

  return { tipo: 'error', problema: 'Formato no reconocido' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUNCIÓN DE DATOS DE PRUEBA INTEGRAL v7.39
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Carga datos de prueba COMPLETOS E INTEGRALES para verificar todo el sistema
 * Genera datos para los 12 meses del año 2026
 *
 * DATOS GENERADOS:
 * - CARGA_FAMILIA: TODOS los tipos de ingresos, TODAS las subcategorías variables,
 *                  TODOS los tipos de ahorro, préstamos/devoluciones NT↔FAM
 * - CARGA_NT: TODOS los tipos de ingresos, TODAS las subcategorías variables
 * - GASTOS_FIJOS: TODOS los conceptos de FAMILIA y NEUROTEA con valores 12 meses
 * - CONFIG: Saldos iniciales para TODAS las cuentas
 */
function cargarDatosPrueba() {
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.alert(
    '⚠️ CARGAR DATOS DE PRUEBA INTEGRALES',
    '¿Desea cargar datos ficticios COMPLETOS para probar el sistema?\n\n' +
    'Esto cargará datos INTEGRALES en:\n\n' +
    '📊 CARGA_FAMILIA:\n' +
    '  • 12+ tipos de ingresos\n' +
    '  • 14+ subcategorías variables\n' +
    '  • 3 tipos de ahorro\n' +
    '  • Préstamos y devoluciones NT↔FAM\n' +
    '  • Ingresos en múltiples cuentas\n\n' +
    '📊 CARGA_NT:\n' +
    '  • 4 tipos de ingresos\n' +
    '  • 8+ subcategorías variables\n' +
    '  • Préstamos y devoluciones\n\n' +
    '📊 GASTOS_FIJOS: ~60 conceptos 12 meses\n' +
    '📊 CONFIG: Saldos iniciales todas las cuentas\n\n' +
    '⚠️ Se recomienda ejecutar sobre un sistema recién reinicializado.',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ui.alert('Operación cancelada.');
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
  const gastosFijos = ss.getSheetByName(NOMBRES_HOJAS.GASTOS_FIJOS);
  const config = ss.getSheetByName(NOMBRES_HOJAS.CONFIG);

  if (!cargaFam || !cargaNT || !gastosFijos || !config) {
    ui.alert('Error', 'Faltan hojas del sistema. Ejecute "Reinicializar Sistema" primero.', ui.ButtonSet.OK);
    return;
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('Cargando datos de prueba integrales... (puede tomar unos segundos)', '⏳', 120);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CARGAR DATOS EN CARGA_FAMILIA - COMPLETO
  // ═══════════════════════════════════════════════════════════════════════════

  var filaFam = 4;
  var datosFamilia = [];

  for (var mes = 1; mes <= 12; mes++) {

    // ═══════════════════════════════════════════════════════════════════════
    // INGRESOS FAMILIA - TODOS LOS TIPOS PRINCIPALES
    // ═══════════════════════════════════════════════════════════════════════

    // 1. Salario Marco (mensual, día 5)
    datosFamilia.push([new Date(2026, mes - 1, 5), 'Salario Marco', '-', '-', 'Salario Itaipu', 15000000, 'ITAU Marco', 'Prueba']);

    // 2. Salario Marco NeuroTEA (mensual, día 10)
    datosFamilia.push([new Date(2026, mes - 1, 10), 'Salario Marco NeuroTEA', '-', '-', 'Honorarios clínica', 3000000, 'ITAU Marco', 'Prueba']);

    // 3. Vacaciones Marco (enero y julio)
    if (mes === 1 || mes === 7) {
      datosFamilia.push([new Date(2026, mes - 1, 15), 'Vacaciones Marco', '-', '-', 'Pago vacaciones', 8000000, 'ITAU Marco', 'Prueba']);
    }

    // 4. Adelanto Aguinaldo (noviembre)
    if (mes === 11) {
      datosFamilia.push([new Date(2026, mes - 1, 15), 'Adelanto de Aguinaldo Marco', '-', '-', 'Adelanto aguinaldo', 7500000, 'ITAU Marco', 'Prueba']);
    }

    // 5. Saldo Aguinaldo (diciembre)
    if (mes === 12) {
      datosFamilia.push([new Date(2026, mes - 1, 20), 'Saldo Aguinaldo Marco', '-', '-', 'Saldo aguinaldo', 7500000, 'ITAU Marco', 'Prueba']);
    }

    // 6. Viático Marco (meses impares)
    if (mes % 2 === 1) {
      datosFamilia.push([new Date(2026, mes - 1, 12), 'Viático Marco', '-', '-', 'Viático viaje', 1500000, 'ITAU Marco', 'Prueba']);
    }

    // 7. Animador Bíblico Marco (mensual)
    datosFamilia.push([new Date(2026, mes - 1, 20), 'Animador Bíblico Marco', '-', '-', 'Colaboración', 200000, 'Efectivo', 'Prueba']);

    // 8. Tarjeta Gourmed (mensual)
    datosFamilia.push([new Date(2026, mes - 1, 1), 'Tarjeta Gourmed', '-', '-', 'Recarga', 500000, 'Gourmed', 'Prueba']);

    // 9. Contrato Colectivo (junio y diciembre)
    if (mes === 6 || mes === 12) {
      datosFamilia.push([new Date(2026, mes - 1, 25), 'Contrato Colectivo Marco', '-', '-', 'Bono', 5000000, 'ITAU Marco', 'Prueba']);
    }

    // 10. PL Itaipu (abril)
    if (mes === 4) {
      datosFamilia.push([new Date(2026, mes - 1, 30), 'PL Itaipu Marco', '-', '-', 'Participación', 12000000, 'ITAU Marco', 'Prueba']);
    }

    // 11. Honorarios Clara (mensual)
    datosFamilia.push([new Date(2026, mes - 1, 15), 'Honorarios Clara NeuroTEA', '-', '-', 'Honorarios Clara', 2500000, 'ITAU Clara', 'Prueba']);

    // 12. Préstamo Otros Bancos (marzo)
    if (mes === 3) {
      datosFamilia.push([new Date(2026, mes - 1, 10), 'Préstamo Otros Bancos', '-', '-', 'Préstamo banco', 10000000, 'ITAU Clara', 'Prueba']);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // EGRESOS VARIABLES FAMILIA - SUBCATEGORÍAS PRINCIPALES
    // ═══════════════════════════════════════════════════════════════════════

    // Supermercado (4x/mes)
    for (var sem = 1; sem <= 4; sem++) {
      datosFamilia.push([new Date(2026, mes - 1, sem * 7), 'Egreso Familiar', 'VARIABLES', 'Supermercado', 'Compra ' + sem, 450000 + Math.floor(Math.random() * 100000), 'Tarjeta ITAU Clara', 'Prueba']);
    }

    // Combustible (2x/mes)
    datosFamilia.push([new Date(2026, mes - 1, 7), 'Egreso Familiar', 'VARIABLES', 'Combustible', 'Nafta camioneta', 400000, 'Tarjeta ITAU Marco', 'Prueba']);
    datosFamilia.push([new Date(2026, mes - 1, 21), 'Egreso Familiar', 'VARIABLES', 'Combustible', 'Nafta auto', 350000, 'Tarjeta ITAU Clara', 'Prueba']);

    // Alimentación
    datosFamilia.push([new Date(2026, mes - 1, 5), 'Egreso Familiar', 'VARIABLES', 'Alimentación', 'Almuerzo', 150000, 'Gourmed', 'Prueba']);
    datosFamilia.push([new Date(2026, mes - 1, 19), 'Egreso Familiar', 'VARIABLES', 'Alimentación', 'Merienda', 80000, 'Efectivo', 'Prueba']);

    // Gastos Varios
    datosFamilia.push([new Date(2026, mes - 1, 10), 'Egreso Familiar', 'VARIABLES', 'Gastos Varios', 'Varios', 200000, 'Efectivo', 'Prueba']);

    // Mantenimiento Auto Clara (trimestral)
    if (mes % 3 === 1) {
      datosFamilia.push([new Date(2026, mes - 1, 15), 'Egreso Familiar', 'VARIABLES', 'Mantenimiento / Reparaciones Auto Clara', 'Service', 800000, 'Tarjeta ITAU Clara', 'Prueba']);
    }

    // Mantenimiento Camioneta (trimestral)
    if (mes % 3 === 0) {
      datosFamilia.push([new Date(2026, mes - 1, 18), 'Egreso Familiar', 'VARIABLES', 'Mantenimiento / Reparaciones Camioneta Marco', 'Service', 1500000, 'Tarjeta ITAU Marco', 'Prueba']);
    }

    // Ropa (bimestral)
    if (mes % 2 === 0) {
      datosFamilia.push([new Date(2026, mes - 1, 12), 'Egreso Familiar', 'VARIABLES', 'Ropa/Vestidos', 'Ropa familia', 600000, 'Tarjeta Solar Clara', 'Prueba']);
    }

    // Recreación (2x/mes)
    datosFamilia.push([new Date(2026, mes - 1, 6), 'Egreso Familiar', 'VARIABLES', 'Recreación (Pizza, hamburguesa, helados, etc)', 'Pizza', 180000, 'Efectivo', 'Prueba']);
    datosFamilia.push([new Date(2026, mes - 1, 20), 'Egreso Familiar', 'VARIABLES', 'Recreación (Pizza, hamburguesa, helados, etc)', 'Helados cine', 150000, 'Tarjeta ITAU Clara', 'Prueba']);

    // Salud (mensual)
    datosFamilia.push([new Date(2026, mes - 1, 8), 'Egreso Familiar', 'VARIABLES', 'Salud y Medicamentos', 'Farmacia', 250000, 'Efectivo', 'Prueba']);

    // Gastos Colegio (marzo-noviembre)
    if (mes >= 3 && mes <= 11) {
      datosFamilia.push([new Date(2026, mes - 1, 5), 'Egreso Familiar', 'VARIABLES', 'Gastos del Colegio', 'Materiales', 350000, 'ITAU Clara', 'Prueba']);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // AHORRO FAMILIA - TODOS LOS TIPOS
    // ═══════════════════════════════════════════════════════════════════════

    datosFamilia.push([new Date(2026, mes - 1, 6), 'Ahorro', 'Ahorro Clara', '-', 'Ahorro Clara', 1000000, 'UENO Clara', 'Prueba']);
    datosFamilia.push([new Date(2026, mes - 1, 6), 'Ahorro', 'Ahorro Marco', '-', 'Ahorro Marco', 1200000, 'Coop. Univ. Marco', 'Prueba']);
    if (mes % 3 === 0) {
      datosFamilia.push([new Date(2026, mes - 1, 15), 'Ahorro', 'Fondo de Emergencia', '-', 'Fondo', 500000, 'Coop. Univ. Marco', 'Prueba']);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════
  // PRÉSTAMOS Y DEVOLUCIONES NT↔FAM (distribuidos en varios meses)
  // ═══════════════════════════════════════════════════════════════════════

  // ENERO: NT presta a FAMILIA (para visualización inmediata)
  datosFamilia.push([new Date(2026, 0, 15), 'Préstamo NeuroTEA', '-', '-', 'Préstamo de NT a FAM', 4000000, 'ITAU Marco', 'Prueba']);

  // ENERO: FAMILIA devuelve a NT (parcial)
  datosFamilia.push([new Date(2026, 0, 25), 'Egreso Familiar', 'VARIABLES', 'Devolución Familia → NT', 'Devolución parcial', 1500000, 'ITAU Marco', 'Prueba']);

  // FEBRERO: FAMILIA presta a NT
  datosFamilia.push([new Date(2026, 1, 10), 'Egreso Familiar', 'VARIABLES', 'Préstamo Familia → NT', 'Préstamo a NT', 5000000, 'ITAU Marco', 'Prueba']);

  // MAYO: NT devuelve a FAMILIA
  datosFamilia.push([new Date(2026, 4, 20), 'Devolución NeuroTEA', '-', '-', 'NT devuelve préstamo', 2000000, 'ITAU Marco', 'Prueba']);

  // OCTUBRE: FAMILIA devuelve a NT
  datosFamilia.push([new Date(2026, 9, 15), 'Egreso Familiar', 'VARIABLES', 'Devolución Familia → NT', 'Devolución a NT', 3000000, 'ITAU Marco', 'Prueba']);

  // Escribir datos FAMILIA
  if (datosFamilia.length > 0) {
    cargaFam.getRange(filaFam, 1, datosFamilia.length, 8).setValues(datosFamilia);
    cargaFam.getRange(filaFam, 1, datosFamilia.length, 1).setNumberFormat('dd/mm/yyyy');
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('CARGA_FAMILIA completado. Procesando CARGA_NT...', '⏳', 60);

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. CARGAR DATOS EN CARGA_NT - COMPLETO
  // ═══════════════════════════════════════════════════════════════════════════

  var filaNT = 4;
  var datosNT = [];

  for (var mesNT = 1; mesNT <= 12; mesNT++) {

    // INGRESOS NT
    datosNT.push([new Date(2026, mesNT - 1, 5), 'Aporte NeuroTEA Terapeutas', '-', '-', 'Cobros quincena 1', 12000000, 'Atlas NeuroTEA', 'Prueba']);
    datosNT.push([new Date(2026, mesNT - 1, 20), 'Aporte NeuroTEA Terapeutas', '-', '-', 'Cobros quincena 2', 13000000, 'Atlas NeuroTEA', 'Prueba']);

    if (mesNT >= 2 && mesNT <= 11) {
      datosNT.push([new Date(2026, mesNT - 1, 15), 'Cursos NeuroTEA', '-', '-', 'Curso mensual', 4000000 + Math.floor(Math.random() * 2000000), 'Atlas NeuroTEA', 'Prueba']);
    }

    if (mesNT % 4 === 0) {
      datosNT.push([new Date(2026, mesNT - 1, 25), 'Otros', '-', '-', 'Varios', 500000, 'Atlas NeuroTEA', 'Prueba']);
    }

    // EGRESOS VARIABLES NT
    datosNT.push([new Date(2026, mesNT - 1, 8), 'Egreso NT', 'VARIABLES', 'Insumos y Papelería', 'Material', 400000, 'Atlas NeuroTEA', 'Prueba']);
    datosNT.push([new Date(2026, mesNT - 1, 22), 'Egreso NT', 'VARIABLES', 'Insumos y Papelería', 'Papelería', 150000, 'UENO Marco', 'Prueba']);

    if (mesNT % 3 === 0) {
      datosNT.push([new Date(2026, mesNT - 1, 15), 'Egreso NT', 'VARIABLES', 'Reparaciones Clínica', 'Reparación', 600000, 'Atlas NeuroTEA', 'Prueba']);
    }

    if (mesNT === 3 || mesNT === 7 || mesNT === 11) {
      datosNT.push([new Date(2026, mesNT - 1, 10), 'Egreso NT', 'VARIABLES', 'Mantenimiento Aire', 'Limpieza', 350000, 'Atlas NeuroTEA', 'Prueba']);
    }

    if (mesNT >= 2 && mesNT <= 11) {
      datosNT.push([new Date(2026, mesNT - 1, 12), 'Egreso NT', 'VARIABLES', 'Gastos Cursos', 'Materiales curso', 250000, 'Atlas NeuroTEA', 'Prueba']);
    }

    if (mesNT === 4 || mesNT === 6 || mesNT === 8 || mesNT === 11 || mesNT === 12) {
      datosNT.push([new Date(2026, mesNT - 1, 18), 'Egreso NT', 'VARIABLES', 'Gastos Varios Cumple (Tortas, bocaditos, meriendas)', 'Merienda evento', 400000, 'Atlas NeuroTEA', 'Prueba']);
    }

    datosNT.push([new Date(2026, mesNT - 1, 28), 'Egreso NT', 'VARIABLES', 'Horas Extras Aracely', 'Horas extras', 300000 + Math.floor(Math.random() * 200000), 'UENO Marco', 'Prueba']);
    datosNT.push([new Date(2026, mesNT - 1, 28), 'Egreso NT', 'VARIABLES', 'Horas Extras Fatima', 'Horas extras', 250000 + Math.floor(Math.random() * 150000), 'UENO Marco', 'Prueba']);

    if (mesNT === 2 || mesNT === 8) {
      datosNT.push([new Date(2026, mesNT - 1, 20), 'Egreso NT', 'VARIABLES', 'Muebles y equipos', 'Equipamiento', 2500000, 'Atlas NeuroTEA', 'Prueba']);
    }
  }

  // PRÉSTAMOS Y DEVOLUCIONES NT↔FAM (distribuidos en varios meses)

  // ENERO: NT presta a FAMILIA (egreso en NT)
  datosNT.push([new Date(2026, 0, 15), 'Egreso NT', 'VARIABLES', 'Préstamo NT → Familia', 'Préstamo a FAM', 4000000, 'Atlas NeuroTEA', 'Prueba']);

  // ENERO: FAMILIA presta a NT (ingreso en NT)
  datosNT.push([new Date(2026, 0, 25), 'Préstamo Familia', '-', '-', 'FAM presta a NT', 1500000, 'Atlas NeuroTEA', 'Prueba']);

  // FEBRERO: FAMILIA presta a NT (ingreso en NT)
  datosNT.push([new Date(2026, 1, 10), 'Préstamo Familia', '-', '-', 'FAM presta a NT', 5000000, 'Atlas NeuroTEA', 'Prueba']);

  // ABRIL: NT devuelve a FAMILIA
  datosNT.push([new Date(2026, 3, 20), 'Egreso NT', 'VARIABLES', 'Devolución NT → Familia', 'Devolución parcial', 2500000, 'Atlas NeuroTEA', 'Prueba']);

  // JULIO: NT presta a FAMILIA
  datosNT.push([new Date(2026, 6, 15), 'Egreso NT', 'VARIABLES', 'Préstamo NT → Familia', 'Préstamo adicional', 3000000, 'Atlas NeuroTEA', 'Prueba']);

  if (datosNT.length > 0) {
    cargaNT.getRange(filaNT, 1, datosNT.length, 8).setValues(datosNT);
    cargaNT.getRange(filaNT, 1, datosNT.length, 1).setNumberFormat('dd/mm/yyyy');
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('CARGA_NT completado. Procesando GASTOS_FIJOS...', '⏳', 60);

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. CARGAR DATOS EN GASTOS_FIJOS - TODOS LOS CONCEPTOS
  // ═══════════════════════════════════════════════════════════════════════════

  var filaGF = 4;
  var datosGF = [];

  function crearFilaGF(concepto, entidad, categoria, frecuencia, dia, cuenta, montos) {
    var fila = [concepto, entidad, categoria, frecuencia, dia, cuenta];
    for (var i = 0; i < 12; i++) fila.push(Array.isArray(montos) ? montos[i] : montos);
    return fila;
  }

  // GASTOS FIJOS FAMILIA
  datosGF.push(crearFilaGF('Salario Lili Doméstico', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 5, 'Efectivo', 2200000));
  datosGF.push(crearFilaGF('Salario Laura Doméstico', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 5, 'Efectivo', 1800000));
  datosGF.push(crearFilaGF('Escuela Fabián y Brenda', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 10, 'ITAU Marco', [0,0,1500000,1500000,1500000,1500000,1500000,1500000,1500000,1500000,1500000,0]));
  datosGF.push(crearFilaGF('Robótica Niños', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 10, 'ITAU Marco', [0,0,350000,350000,350000,350000,350000,350000,350000,350000,350000,0]));
  datosGF.push(crearFilaGF('ANDE Casa', 'FAMILIA', 'GASTOS FIJOS', 'Variable/Mensual', 15, 'ITAU Marco', [420000,450000,480000,520000,580000,650000,720000,680000,600000,520000,460000,430000]));
  datosGF.push(crearFilaGF('Expensa Casa', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 1, 'ITAU Marco', 850000));
  datosGF.push(crearFilaGF('Ña Luisa', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 5, 'Efectivo', 400000));
  datosGF.push(crearFilaGF('Remedio Lochi', 'FAMILIA', 'GASTOS FIJOS', 'Variable/Mensual', 15, 'Efectivo', [180000,180000,200000,180000,220000,180000,200000,180000,180000,200000,180000,180000]));
  datosGF.push(crearFilaGF('Seguro Médico Papá y Mamá', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 10, 'ITAU Marco', 650000));
  datosGF.push(crearFilaGF('Contadora Marco', 'FAMILIA', 'GASTOS FIJOS', 'Fijo/Mensual', 15, 'ITAU Marco', 500000));

  // CUOTAS Y PRÉSTAMOS
  datosGF.push(crearFilaGF('Préstamo Lizzi', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 20, 'ITAU Marco', 1200000));
  datosGF.push(crearFilaGF('Cajubi Marco', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 5, 'Coop. Univ. Marco', 450000));
  datosGF.push(crearFilaGF('Mutual Marco', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 5, 'Coop. Univ. Marco', 380000));
  datosGF.push(crearFilaGF('Seguro Auto Laura ITAU', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 15, 'ITAU Clara', 420000));
  datosGF.push(crearFilaGF('Cuota ITAU', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Variable/Mensual', 15, 'ITAU Marco', [850000,850000,900000,850000,850000,900000,850000,850000,900000,850000,850000,900000]));
  datosGF.push(crearFilaGF('Auto Laura Cuota', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 15, 'ITAU Clara', 1800000));
  datosGF.push(crearFilaGF('Coop. Universitaria Clara', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 10, 'ITAU Clara', 650000));
  datosGF.push(crearFilaGF('Coomecipar Clara', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 10, 'Tarjeta Comecipar Clara', 550000));
  datosGF.push(crearFilaGF('Solar Préstamo 1', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 20, 'Tarjeta Solar Clara', 480000));
  datosGF.push(crearFilaGF('Solar Préstamo 2', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 20, 'Tarjeta Solar Clara', 320000));
  datosGF.push(crearFilaGF('Show Congelador', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Fijo/Mensual', 25, 'ITAU Marco', [280000,280000,280000,280000,280000,280000,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('Pago Mínimo Tarj ITAU Clara', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Variable/Mensual', 10, 'Tarjeta ITAU Clara', [350000,380000,420000,390000,410000,450000,400000,380000,360000,400000,450000,500000]));
  datosGF.push(crearFilaGF('Pago Mínimo Tarj ITAU Marco', 'FAMILIA', 'CUOTAS Y PRÉSTAMOS', 'Variable/Mensual', 10, 'Tarjeta ITAU Marco', [280000,300000,320000,290000,310000,350000,300000,280000,260000,300000,350000,400000]));

  // OBLIGACIONES LEGALES
  datosGF.push(crearFilaGF('Aporte IPS', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 5, 'ITAU Marco', 520000));
  datosGF.push(crearFilaGF('Aporte Cajubi', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 5, 'Coop. Univ. Marco', 180000));
  datosGF.push(crearFilaGF('Aporte STEIBI', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 5, 'ITAU Marco', 150000));
  datosGF.push(crearFilaGF('Aporte SICHAP', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 5, 'ITAU Marco', 120000));
  datosGF.push(crearFilaGF('Impuesto compra digital', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Variable/Mensual', 20, 'ITAU Marco', [45000,52000,38000,61000,44000,55000,42000,48000,51000,47000,58000,72000]));
  datosGF.push(crearFilaGF('Aporte Coop. Univer. Clara', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 10, 'ITAU Clara', 85000));
  datosGF.push(crearFilaGF('Aporte Coop. Univer. Marco', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 10, 'Coop. Univ. Marco', 95000));
  datosGF.push(crearFilaGF('Impuesto Renta personal', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Anual', 31, 'ITAU Marco', [0,0,2500000,0,0,0,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('Impuesto terreno casa', 'FAMILIA', 'OBLIGACIONES LEGALES', 'Fijo/Anual', 31, 'ITAU Marco', [0,0,850000,0,0,0,0,0,0,0,0,0]));

  // SUSCRIPCIONES
  datosGF.push(crearFilaGF('Giganet', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 1, 'ITAU Marco', 280000));
  datosGF.push(crearFilaGF('Tigo Clara', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 28, 'ITAU Clara', 150000));
  datosGF.push(crearFilaGF('Tigo Familiar', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 28, 'ITAU Marco', 250000));
  datosGF.push(crearFilaGF('Google One', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Marco', 35000));
  datosGF.push(crearFilaGF('ChatGPT', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Marco', 150000));
  datosGF.push(crearFilaGF('Claude Marco', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Marco', 150000));
  datosGF.push(crearFilaGF('Claude Clara', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Clara', 150000));
  datosGF.push(crearFilaGF('Antivirus Clara (Anual)', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Anual', 15, 'Tarjeta ITAU Clara', [0,0,0,0,0,280000,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('Antivirus Marco (Anual)', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Anual', 15, 'Tarjeta ITAU Marco', [0,0,0,0,0,280000,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('MS Office Clara (Anual)', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Anual', 15, 'Tarjeta ITAU Clara', [520000,0,0,0,0,0,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('MS Office Marco (Anual)', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Anual', 15, 'Tarjeta ITAU Marco', [520000,0,0,0,0,0,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('PosterWall', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Marco', 45000));
  datosGF.push(crearFilaGF('Canva (Anual)', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Anual', 15, 'Tarjeta ITAU Marco', [0,0,0,0,0,0,450000,0,0,0,0,0]));
  datosGF.push(crearFilaGF('Scribd', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Marco', 85000));
  datosGF.push(crearFilaGF('iLovePDF', 'FAMILIA', 'SUSCRIPCIONES', 'Fijo/Mensual', 15, 'Tarjeta ITAU Marco', 55000));

  // GASTOS FIJOS NEUROTEA (nombres exactos de Config.gs)
  datosGF.push(crearFilaGF('Alquiler 1 (Principal)', 'NEUROTEA', 'CLÍNICA', 'Fijo/Mensual', 5, 'Atlas NeuroTEA', 4500000));
  datosGF.push(crearFilaGF('Alquiler 2 (Secundario)', 'NEUROTEA', 'CLÍNICA', 'Fijo/Mensual', 5, 'Atlas NeuroTEA', 1500000));
  datosGF.push(crearFilaGF('ANDE clínica', 'NEUROTEA', 'CLÍNICA', 'Variable/Mensual', 15, 'Atlas NeuroTEA', [750000,800000,850000,900000,980000,1100000,1250000,1180000,1000000,880000,800000,750000]));

  datosGF.push(crearFilaGF('Sueldo Aracely', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Fijo/Mensual', 30, 'Atlas NeuroTEA', 3500000));
  datosGF.push(crearFilaGF('Sueldo Fátima', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Fijo/Mensual', 30, 'Atlas NeuroTEA', 3200000));
  datosGF.push(crearFilaGF('Limpieza NeuroTEA', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Variable/Mensual', 30, 'Atlas NeuroTEA', 1200000));
  datosGF.push(crearFilaGF('Honorario Contador', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Fijo/Mensual', 10, 'Atlas NeuroTEA', 600000));
  datosGF.push(crearFilaGF('Salario Administrador (Marco)', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Fijo/Mensual', 30, 'Atlas NeuroTEA', 3000000));
  datosGF.push(crearFilaGF('Honorario Mant. Sistema', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Fijo/Mensual', 15, 'Atlas NeuroTEA', 500000));
  datosGF.push(crearFilaGF('Community Manager', 'NEUROTEA', 'SUELDOS Y HONORARIOS', 'Fijo/Mensual', 30, 'Atlas NeuroTEA', 800000));

  datosGF.push(crearFilaGF('Celular Tigo NeuroTEA', 'NEUROTEA', 'TELEFONÍA E INTERNET', 'Fijo/Mensual', 28, 'Atlas NeuroTEA', 150000));
  datosGF.push(crearFilaGF('Celular Tigo Sistema', 'NEUROTEA', 'TELEFONÍA E INTERNET', 'Fijo/Mensual', 28, 'Atlas NeuroTEA', 120000));
  datosGF.push(crearFilaGF('WhatsFlow', 'NEUROTEA', 'TELEFONÍA E INTERNET', 'Fijo/Mensual', 15, 'Atlas NeuroTEA', 180000));
  datosGF.push(crearFilaGF('Internet NeuroTEA', 'NEUROTEA', 'TELEFONÍA E INTERNET', 'Fijo/Mensual', 15, 'Atlas NeuroTEA', 380000));

  datosGF.push(crearFilaGF('IVA', 'NEUROTEA', 'OBLIGACIONES LEGALES', 'Variable/Mensual', 20, 'Atlas NeuroTEA', [850000,900000,950000,1000000,1050000,1100000,1150000,1100000,1050000,1000000,950000,900000]));
  datosGF.push(crearFilaGF('IPS', 'NEUROTEA', 'OBLIGACIONES LEGALES', 'Fijo/Mensual', 15, 'Atlas NeuroTEA', 1350000));
  datosGF.push(crearFilaGF('Ministerio de Salud', 'NEUROTEA', 'OBLIGACIONES LEGALES', 'Variable/Anual', 31, 'Atlas NeuroTEA', [0,0,450000,0,0,0,0,0,0,0,0,0]));

  // EVENTOS NT
  datosGF.push(crearFilaGF('Día del Autismo', 'NEUROTEA', 'EVENTOS', 'Variable/Anual', 2, 'Atlas NeuroTEA', [0,0,0,1500000,0,0,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('San Juan', 'NEUROTEA', 'EVENTOS', 'Variable/Anual', 24, 'Atlas NeuroTEA', [0,0,0,0,0,1200000,0,0,0,0,0,0]));
  datosGF.push(crearFilaGF('Día del Niño', 'NEUROTEA', 'EVENTOS', 'Variable/Anual', 16, 'Atlas NeuroTEA', [0,0,0,0,0,0,0,1800000,0,0,0,0]));
  datosGF.push(crearFilaGF('Clausura Padres', 'NEUROTEA', 'EVENTOS', 'Variable/Anual', 15, 'Atlas NeuroTEA', [0,0,0,0,0,0,0,0,0,0,2500000,0]));
  datosGF.push(crearFilaGF('Navidad Papá Noel', 'NEUROTEA', 'EVENTOS', 'Variable/Anual', 20, 'Atlas NeuroTEA', [0,0,0,0,0,0,0,0,0,0,0,2000000]));
  datosGF.push(crearFilaGF('Cena Fin de Año', 'NEUROTEA', 'EVENTOS', 'Variable/Anual', 28, 'Atlas NeuroTEA', [0,0,0,0,0,0,0,0,0,0,0,1500000]));

  if (datosGF.length > 0) {
    // v8.1: Limpiar validaciones de CUENTA (col F) antes de escribir
    // para evitar conflicto entre validaciones FAMILIA vs NEUROTEA
    gastosFijos.getRange(filaGF, 6, datosGF.length, 1).clearDataValidations();

    gastosFijos.getRange(filaGF, 1, datosGF.length, 18).setValues(datosGF);

    // Aplicar validaciones correctas según ENTIDAD (columna B)
    for (var gfIdx = 0; gfIdx < datosGF.length; gfIdx++) {
      var entidadGF = datosGF[gfIdx][1]; // Columna B = ENTIDAD
      var cuentasValidas = (entidadGF === 'NEUROTEA') ? CUENTAS_NT : CUENTAS_FAMILIA;
      gastosFijos.getRange(filaGF + gfIdx, 6).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(cuentasValidas, true)
          .setAllowInvalid(false)
          .build()
      );
    }
  }

  SpreadsheetApp.getActiveSpreadsheet().toast('GASTOS_FIJOS completado. Configurando saldos...', '⏳', 30);

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CONFIGURAR SALDOS INICIALES - TODAS LAS CUENTAS
  // ═══════════════════════════════════════════════════════════════════════════

  config.getRange('B68').setValue(8500000);   // ITAU Marco
  config.getRange('B69').setValue(3200000);   // Coop. Univ. Marco
  config.getRange('B70').setValue(4500000);   // ITAU Clara
  config.getRange('B71').setValue(2000000);   // UENO Clara
  config.getRange('B72').setValue(0);         // Tarjeta Solar Clara
  config.getRange('B73').setValue(0);         // Tarjeta ITAU Clara
  config.getRange('B74').setValue(0);         // Tarjeta ITAU Marco
  config.getRange('B75').setValue(0);         // Tarjeta Comecipar Clara
  config.getRange('B76').setValue(500000);    // Gourmed
  config.getRange('B77').setValue(850000);    // Efectivo

  config.getRange('B82').setValue(12000000);  // Atlas NeuroTEA
  config.getRange('B83').setValue(800000);    // UENO Marco

  SpreadsheetApp.getActiveSpreadsheet().toast('CONFIG completado. Cargando PRESUPUESTO...', '⏳', 30);

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. CARGAR VALORES EN PRESUPUESTO
  // ═══════════════════════════════════════════════════════════════════════════

  var presupuesto = ss.getSheetByName(NOMBRES_HOJAS.PRESUPUESTO);
  if (presupuesto) {
    var datosPresup = presupuesto.getDataRange().getValues();

    // Función auxiliar para buscar fila por concepto
    function buscarFilaConcepto(concepto) {
      for (var r = 0; r < datosPresup.length; r++) {
        if (datosPresup[r][0] && datosPresup[r][0].toString().trim() === concepto) {
          return r + 1; // Devolver número de fila (1-indexed)
        }
      }
      return null;
    }

    // Función para llenar valores mensuales (columnas D-O = 4-15)
    function llenarPresupuesto(concepto, valoresMensuales) {
      var fila = buscarFilaConcepto(concepto);
      if (fila) {
        for (var m = 0; m < 12; m++) {
          var valor = Array.isArray(valoresMensuales) ? valoresMensuales[m] : valoresMensuales;
          if (valor > 0) {
            presupuesto.getRange(fila, 4 + m).setValue(valor);
          }
        }
      }
    }

    // ── INGRESOS FAMILIA ──
    llenarPresupuesto('Salario Marco', 15000000);
    llenarPresupuesto('Salario Marco NeuroTEA', 3000000);
    llenarPresupuesto('Vacaciones Marco', [8000000,0,0,0,0,0,8000000,0,0,0,0,0]);
    llenarPresupuesto('Adelanto de Aguinaldo Marco', [0,0,0,0,0,0,0,0,0,0,7500000,0]);
    llenarPresupuesto('Saldo Aguinaldo Marco', [0,0,0,0,0,0,0,0,0,0,0,7500000]);
    llenarPresupuesto('Viático Marco', [1500000,0,1500000,0,1500000,0,1500000,0,1500000,0,1500000,0]);
    llenarPresupuesto('Animador Bíblico Marco', 200000);
    llenarPresupuesto('Tarjeta Gourmed', 500000);
    llenarPresupuesto('Contrato Colectivo Marco', [0,0,0,0,0,5000000,0,0,0,0,0,5000000]);
    llenarPresupuesto('PL Itaipu Marco', [0,0,0,12000000,0,0,0,0,0,0,0,0]);
    llenarPresupuesto('Honorarios Clara NeuroTEA', 2500000);

    // ── EGRESOS FAMILIA - GASTOS FIJOS ──
    llenarPresupuesto('Salario Lili Doméstico', 2200000);
    llenarPresupuesto('Salario Laura Doméstico', 1800000);
    llenarPresupuesto('Escuela Fabián y Brenda', [0,0,1500000,1500000,1500000,1500000,1500000,1500000,1500000,1500000,1500000,0]);
    llenarPresupuesto('Robótica Niños', [0,0,350000,350000,350000,350000,350000,350000,350000,350000,350000,0]);
    llenarPresupuesto('ANDE Casa', [450000,480000,520000,580000,650000,720000,680000,600000,520000,460000,430000,420000]);
    llenarPresupuesto('Expensa Casa', 850000);

    // ── EGRESOS FAMILIA - CUOTAS Y PRÉSTAMOS ──
    llenarPresupuesto('Préstamo Lizzi', 1200000);
    llenarPresupuesto('Cajubi Marco', 450000);
    llenarPresupuesto('Mutual Marco', 380000);
    llenarPresupuesto('Seguro Auto Laura ITAU', 420000);
    llenarPresupuesto('Cuota ITAU', 870000);
    llenarPresupuesto('Auto Laura Cuota', 1800000);
    llenarPresupuesto('Coop. Universitaria Clara', 650000);
    llenarPresupuesto('Coomecipar Clara', 550000);
    llenarPresupuesto('Solar Préstamo 1', 480000);
    llenarPresupuesto('Solar Préstamo 2', 320000);

    // ── EGRESOS FAMILIA - OBLIGACIONES LEGALES ──
    llenarPresupuesto('Aporte IPS', 520000);
    llenarPresupuesto('Aporte Cajubi', 180000);
    llenarPresupuesto('Aporte STEIBI', 150000);
    llenarPresupuesto('Aporte SICHAP', 120000);
    llenarPresupuesto('Impuesto Renta personal', [0,0,2500000,0,0,0,0,0,0,0,0,0]);
    llenarPresupuesto('Impuesto terreno casa', [0,0,850000,0,0,0,0,0,0,0,0,0]);

    // ── EGRESOS FAMILIA - SUSCRIPCIONES ──
    llenarPresupuesto('Giganet', 280000);
    llenarPresupuesto('Tigo Clara', 150000);
    llenarPresupuesto('Tigo Familiar', 250000);
    llenarPresupuesto('Google One', 35000);
    llenarPresupuesto('ChatGPT', 150000);
    llenarPresupuesto('Claude Marco', 150000);
    llenarPresupuesto('Claude Clara', 150000);

    // ── EGRESOS FAMILIA - VARIABLES ──
    llenarPresupuesto('Supermercado', 2000000);
    llenarPresupuesto('Combustible', 750000);
    llenarPresupuesto('Alimentación', 250000);
    llenarPresupuesto('Gastos Varios', 300000);
    llenarPresupuesto('Recreación (Pizza, hamburguesa, helados, etc)', 400000);
    llenarPresupuesto('Salud y Medicamentos', 300000);

    // ── EGRESOS FAMILIA - AHORRO ──
    llenarPresupuesto('Ahorro Clara', 1000000);
    llenarPresupuesto('Ahorro Marco', 1200000);
    llenarPresupuesto('Fondo de Emergencia', [0,0,500000,0,0,500000,0,0,500000,0,0,500000]);

    // ── INGRESOS NEUROTEA ──
    llenarPresupuesto('Aporte NeuroTEA Terapeutas', 25000000);
    llenarPresupuesto('Cursos NeuroTEA', [0,4500000,4500000,4500000,4500000,4500000,4500000,4500000,4500000,4500000,4500000,0]);

    // ── EGRESOS NEUROTEA - CLÍNICA (nombres de Config.gs) ──
    llenarPresupuesto('Alquiler 1 (Principal)', 4500000);
    llenarPresupuesto('Alquiler 2 (Secundario)', 1500000);
    llenarPresupuesto('ANDE clínica', 900000);

    // ── EGRESOS NEUROTEA - SUELDOS Y HONORARIOS (nombres de Config.gs) ──
    llenarPresupuesto('Sueldo Aracely', 3500000);
    llenarPresupuesto('Sueldo Fátima', 3200000);
    llenarPresupuesto('Limpieza NeuroTEA', 1200000);
    llenarPresupuesto('Honorario Contador', 600000);
    llenarPresupuesto('Salario Administrador (Marco)', 3000000);
    llenarPresupuesto('Honorario Mant. Sistema', 500000);
    llenarPresupuesto('Community Manager', 800000);

    // ── EGRESOS NEUROTEA - TELEFONÍA (nombres de Config.gs) ──
    llenarPresupuesto('Celular Tigo NeuroTEA', 150000);
    llenarPresupuesto('Celular Tigo Sistema', 120000);
    llenarPresupuesto('WhatsFlow', 180000);
    llenarPresupuesto('Internet NeuroTEA', 380000);

    // ── EGRESOS NEUROTEA - OBLIGACIONES (nombres de Config.gs) ──
    llenarPresupuesto('IVA', 1000000);
    llenarPresupuesto('IPS', 1350000);
    llenarPresupuesto('Ministerio de Salud', [0,0,450000,0,0,0,0,0,0,0,0,0]);

    // ── EGRESOS NEUROTEA - EVENTOS ──
    llenarPresupuesto('Día del Autismo', [0,0,0,1500000,0,0,0,0,0,0,0,0]);
    llenarPresupuesto('San Juan', [0,0,0,0,0,1200000,0,0,0,0,0,0]);
    llenarPresupuesto('Día del Niño', [0,0,0,0,0,0,0,1800000,0,0,0,0]);
    llenarPresupuesto('Clausura Padres', [0,0,0,0,0,0,0,0,0,0,2500000,0]);
    llenarPresupuesto('Navidad Papá Noel', [0,0,0,0,0,0,0,0,0,0,0,2000000]);
    llenarPresupuesto('Cena Fin de Año', [0,0,0,0,0,0,0,0,0,0,0,1500000]);

    // ── EGRESOS NEUROTEA - VARIABLES ──
    llenarPresupuesto('Insumos y Papelería', 600000);
    llenarPresupuesto('Reparaciones Clínica', [200000,0,200000,0,200000,0,200000,0,200000,0,200000,0]);
    llenarPresupuesto('Mantenimiento Aire', [0,0,350000,0,0,0,350000,0,0,0,350000,0]);
    llenarPresupuesto('Horas Extras Aracely', 400000);
    llenarPresupuesto('Horas Extras Fatima', 350000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CARGAR ESTADOS DE PAGO EN CALCULOS SECCIÓN 7 (v8.1)
  // ═══════════════════════════════════════════════════════════════════════════

  // v8.1: Declarar estadosEnero/Febrero ANTES del bloque if para scope correcto
  // Algunos Pagado, algunos Pendiente para demostrar independencia por mes
  var estadosEnero = {
    // FAMILIA - marcar algunos como Pagado
    'Salario Lili Doméstico': 'Pagado',
    'Salario Laura Doméstico': 'Pagado',
    'ANDE Casa': 'Pendiente',
    'Expensa Casa': 'Pagado',
    'Préstamo Lizzi': 'Pagado',
    'Cajubi Marco': 'Pagado',
    'Mutual Marco': 'Pagado',
    'Giganet': 'Pagado',
    'Tigo Familiar': 'Pagado',
    'Google One': 'Pagado',
    'ChatGPT': 'Pagado',
    'Claude Marco': 'Pagado',
    'Aporte IPS': 'Pagado',
    // NEUROTEA (nombres de Config.gs)
    'Alquiler 1 (Principal)': 'Pagado',
    'Alquiler 2 (Secundario)': 'Pagado',
    'ANDE clínica': 'Pendiente',
    'Sueldo Aracely': 'Pagado',
    'Sueldo Fátima': 'Pagado',
    'Limpieza NeuroTEA': 'Pagado',
    'Honorario Contador': 'Pagado',
    'IPS': 'Pagado',
    'IVA': 'Pendiente'
  };

  // Llenar estados para FEBRERO (diferente de enero)
  var estadosFebrero = {
    'Salario Lili Doméstico': 'Pagado',
    'Salario Laura Doméstico': 'Pendiente',
    'ANDE Casa': 'Pagado',
    'Expensa Casa': 'Pagado',
    'Préstamo Lizzi': 'Pendiente',
    'Cajubi Marco': 'Pagado',
    'Mutual Marco': 'Pendiente',
    'Giganet': 'Pagado',
    'Tigo Familiar': 'Pendiente',
    'Alquiler 1 (Principal)': 'Pagado',
    'Alquiler 2 (Secundario)': 'Pagado',
    'ANDE clínica': 'Pagado',
    'Sueldo Aracely': 'Pagado',
    'Sueldo Fátima': 'Pendiente',
    'Limpieza NeuroTEA': 'Pendiente',
    'Honorario Contador': 'Pagado',
    'IPS': 'Pagado',
    'IVA': 'Pagado'
  };

  // v8.1: Crear mapas normalizados para búsqueda case-insensitive
  var estadosEneroNorm = {};
  var estadosFebreroNorm = {};
  for (var key in estadosEnero) {
    estadosEneroNorm[key.toLowerCase().trim()] = estadosEnero[key];
  }
  for (var key2 in estadosFebrero) {
    estadosFebreroNorm[key2.toLowerCase().trim()] = estadosFebrero[key2];
  }

  var calculos = ss.getSheetByName(NOMBRES_HOJAS.CALCULOS);
  if (calculos) {
    console.log('Cargando estados de pago en CALCULOS sección 7...');

    // Leer conceptos de la sección 7 (empieza en fila 167)
    var filaInicioEstados = 167;
    var datosEstados = calculos.getRange(filaInicioEstados, 1, 120, 1).getValues();

    // Encontrar la última fila con datos en sección 7
    var ultimaFilaEstados = filaInicioEstados;
    for (var e = 0; e < datosEstados.length; e++) {
      if (datosEstados[e][0] && datosEstados[e][0].toString().trim() !== '') {
        ultimaFilaEstados = filaInicioEstados + e;
      }
    }

    // Aplicar estados a las filas correspondientes
    var aplicados = 0;
    for (var f = filaInicioEstados; f <= ultimaFilaEstados; f++) {
      var concepto = calculos.getRange(f, 1).getValue().toString().trim();
      var conceptoNorm = concepto.toLowerCase();
      if (concepto && !concepto.startsWith('──')) {
        // Enero (columna B = 2)
        if (estadosEneroNorm[conceptoNorm]) {
          calculos.getRange(f, 2).setValue(estadosEneroNorm[conceptoNorm]);
          aplicados++;
        } else {
          calculos.getRange(f, 2).setValue('Pendiente');
        }
        // Febrero (columna C = 3)
        if (estadosFebreroNorm[conceptoNorm]) {
          calculos.getRange(f, 3).setValue(estadosFebreroNorm[conceptoNorm]);
        } else {
          calculos.getRange(f, 3).setValue('Pendiente');
        }
        // Marzo a Diciembre: Pendiente por defecto
        for (var m = 4; m <= 13; m++) {
          calculos.getRange(f, m).setValue('Pendiente');
        }
      }
    }
    console.log('Estados de pago cargados en CALCULOS: ' + aplicados + ' conceptos con estados de prueba');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. ACTUALIZAR EST.PAGO EN MOVIMIENTO (v8.2 - para que CALCULOS sección 3 funcione)
  // ═══════════════════════════════════════════════════════════════════════════

  var movimiento = ss.getSheetByName(NOMBRES_HOJAS.MOVIMIENTO);
  if (movimiento) {
    console.log('Actualizando EST.PAGO en MOVIMIENTO...');

    // MOVIMIENTO está en ENERO por defecto después de reinicializar
    // Aplicar estadosEnero a la columna J (EST.PAGO) usando normalización

    // Leer conceptos de MOVIMIENTO (columna A)
    var datosMovFam = movimiento.getRange('A9:A116').getValues();
    var datosMovNT = movimiento.getRange('A122:A206').getValues();
    var actualizadosMov = 0;

    // Actualizar FAMILIA (filas 9-116)
    for (var mf = 0; mf < datosMovFam.length; mf++) {
      var conceptoMov = (datosMovFam[mf][0] || '').toString().trim();
      var conceptoMovNorm = conceptoMov.toLowerCase();
      if (conceptoMov && estadosEneroNorm[conceptoMovNorm]) {
        movimiento.getRange(9 + mf, 10).setValue(estadosEneroNorm[conceptoMovNorm]);
        actualizadosMov++;
      }
    }

    // Actualizar NEUROTEA (filas 122-206)
    for (var mn = 0; mn < datosMovNT.length; mn++) {
      var conceptoMovNT = (datosMovNT[mn][0] || '').toString().trim();
      var conceptoMovNTNorm = conceptoMovNT.toLowerCase();
      if (conceptoMovNT && estadosEneroNorm[conceptoMovNTNorm]) {
        movimiento.getRange(122 + mn, 10).setValue(estadosEneroNorm[conceptoMovNTNorm]);
        actualizadosMov++;
      }
    }

    console.log('EST.PAGO actualizado en MOVIMIENTO: ' + actualizadosMov + ' conceptos');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. RESUMEN
  // ═══════════════════════════════════════════════════════════════════════════

  SpreadsheetApp.getActiveSpreadsheet().toast('¡Datos integrales cargados!', '✓', 5);

  ui.alert(
    '✓ DATOS DE PRUEBA INTEGRALES CARGADOS v8.0',
    'Datos COMPLETOS para 12 meses de 2026:\n\n' +
    '═══════════════════════════════════\n' +
    '📊 CARGA_FAMILIA: ' + datosFamilia.length + ' transacciones\n' +
    '  • 12+ tipos de ingresos\n' +
    '  • 14+ subcategorías variables\n' +
    '  • 3 tipos de ahorro\n' +
    '  • Préstamos/devoluciones NT↔FAM (ENERO)\n\n' +
    '📊 CARGA_NT: ' + datosNT.length + ' transacciones\n' +
    '  • 4 tipos de ingresos\n' +
    '  • 8+ subcategorías variables\n' +
    '  • Préstamos/devoluciones (ENERO)\n\n' +
    '📊 GASTOS_FIJOS: ' + datosGF.length + ' conceptos\n' +
    '  • FAMILIA: gastos, cuotas, oblig, suscr\n' +
    '  • NEUROTEA: clínica, sueldos, eventos\n\n' +
    '📊 PRESUPUESTO: 70+ conceptos con valores\n\n' +
    '📊 CONFIG: 12 cuentas con saldos\n\n' +
    '🧮 CALCULOS: Estados de pago por mes\n' +
    '  • ENERO: algunos Pagado, algunos Pendiente\n' +
    '  • FEBRERO: estados diferentes a Enero\n' +
    '  • MARZO-DIC: Pendiente (default)\n\n' +
    '═══════════════════════════════════\n' +
    '💡 PRUEBA DE MESES INDEPENDIENTES:\n' +
    '  1. MOVIMIENTO → seleccionar Enero\n' +
    '  2. Ver EST.PAGO de gastos fijos\n' +
    '  3. Cambiar a Febrero → ¡estados diferentes!',
    ui.ButtonSet.OK
  );
}
