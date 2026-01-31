/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CODE.GS - MENÚ PRINCIPAL E INICIALIZACIÓN
 * Sistema de Control Financiero 2026 - NeuroTEA & Familia
 * Versión 7.30 - Dashboard v3.0: Chart.js + dashboards separados FAMILIA/NEUROTEA
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * ARQUITECTURA DE ARCHIVOS:
 * ├── Code.gs       → Menú principal e inicialización (este archivo)
 * ├── Config.gs     → Datos maestros y configuraciones
 * ├── Sheets.gs     → Creación de las 9 hojas principales
 * ├── Tablero.gs    → Dashboard TABLERO profesional sobrio
 * ├── WebApp.gs     → Dashboard HTML/CSS profesional
 * └── Utils.gs      → Funciones utilitarias
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// MENÚ PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('💰 Control Financiero')
    // Inicialización
    .addItem('🚀 Inicializar Sistema COMPLETO', 'inicializarSistemaCompleto')
    .addItem('🔄 Reinicializar Sistema (Borrar y Crear)', 'reinicializarSistema')
    .addSeparator()

    // Dashboard
    .addItem('📊 Abrir Dashboard Web', 'abrirDashboard')
    .addItem('🔍 Diagnosticar Dashboard', 'diagnosticarDashboard')
    .addItem('🌐 Instrucciones Web App', 'mostrarInstruccionesWebApp')
    .addSeparator()

    // Crear Hojas Individual
    .addSubMenu(ui.createMenu('📋 Crear Hojas')
      .addItem('⚙️ CONFIG', 'crearHojaCONFIG')
      .addItem('🧮 CALCULOS', 'crearHojaCALCULOS')
      .addItem('📊 PRESUPUESTO', 'crearHojaPRESUPUESTO')
      .addItem('📝 GASTOS_FIJOS', 'crearHojaGASTOS_FIJOS')
      .addItem('👨‍👩‍👧‍👦 CARGA_FAMILIA', 'crearHojaCARGA_FAMILIA')
      .addItem('🏥 CARGA_NT', 'crearHojaCARGA_NT')
      .addItem('📈 MOVIMIENTO', 'crearHojaMOVIMIENTO')
      .addItem('🎯 TABLERO', 'crearHojaTABLERO')
      .addItem('💰 LIQUIDEZ FAMILIA', 'crearHojaLIQUIDEZ_FAMILIA')
      .addItem('💰 LIQUIDEZ NT', 'crearHojaLIQUIDEZ_NT'))
    .addSeparator()

    // Utilidades
    .addSubMenu(ui.createMenu('🔧 Utilidades')
      .addItem('🔄 Actualizar Validaciones', 'actualizarTodasValidaciones')
      .addItem('📈 Recalcular Tablero', 'recalcularTablero')
      .addItem('🎨 Aplicar Estilos', 'aplicarEstilosGlobales')
      .addSeparator()
      .addItem('📊 Cargar Datos de Prueba', 'cargarDatosPrueba')
      .addItem('🧹 Limpiar Datos de Prueba', 'limpiarDatosPrueba')
      .addItem('🔍 Diagnosticar Dashboard', 'diagnosticarDashboard')
      .addSeparator()
      .addItem('🔍 Verificar Contrapartes Huérfanas', 'limpiarContrapartesHuerfanas')
      .addItem('⚡ Instalar Auto-limpieza (onChange)', 'instalarTriggerOnChange')
      .addItem('🩹 Reparar Datos Pegados en CARGA', 'repararDatosCarga')
      .addItem('✓ Agregar columna VÁLIDO a CARGA', 'agregarColumnaValido')
      .addItem('📅 Agregar Filtro por Mes a CARGA', 'agregarFiltroMes'))
    .addSeparator()

    // Info
    .addItem('ℹ️ Acerca del Sistema', 'mostrarAcercaDe')
    .addToUi();
}

// ═══════════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN COMPLETA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * v7.33: Función interna que crea todas las hojas SIN requerir UI
 * Puede ejecutarse desde el editor de Apps Script sin errores
 */
function _crearTodasLasHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Usar console.log para progreso (funciona en editor y en spreadsheet)
  console.log('Creando CONFIG...');
  crearHojaCONFIG();

  console.log('Creando CALCULOS...');
  crearHojaCALCULOS();

  console.log('Creando PRESUPUESTO...');
  crearHojaPRESUPUESTO();

  console.log('Creando GASTOS_FIJOS...');
  crearHojaGASTOS_FIJOS();

  console.log('Creando CARGA_FAMILIA...');
  crearHojaCARGA_FAMILIA();

  console.log('Creando CARGA_NT...');
  crearHojaCARGA_NT();

  console.log('Creando MOVIMIENTO...');
  crearHojaMOVIMIENTO();

  console.log('Creando TABLERO...');
  crearHojaTABLERO();

  console.log('Creando LIQUIDEZ_FAMILIA...');
  crearHojaLIQUIDEZ_FAMILIA();

  console.log('Creando LIQUIDEZ_NT...');
  crearHojaLIQUIDEZ_NT();

  // Ordenar hojas
  ordenarHojas();

  // Ir a TABLERO
  const tablero = ss.getSheetByName(NOMBRES_HOJAS.TABLERO);
  if (tablero) ss.setActiveSheet(tablero);

  console.log('✅ Todas las hojas creadas exitosamente');
}

function inicializarSistemaCompleto() {
  const ui = SpreadsheetApp.getUi();

  const resultado = ui.alert(
    '🚀 Inicializar Sistema Completo',
    '¿Crear todas las hojas del sistema?\n\n' +
    '📋 Se crearán las siguientes 9 hojas:\n' +
    '  • CONFIG - Configuración y listas maestras\n' +
    '  • PRESUPUESTO - Plan anual ENE-DIC\n' +
    '  • GASTOS_FIJOS - Montos base × 12 meses\n' +
    '  • CARGA_FAMILIA - Variables familiares\n' +
    '  • CARGA_NT - Variables NeuroTEA\n' +
    '  • MOVIMIENTO - Real vs Presupuesto + EST. PAGO\n' +
    '  • TABLERO - Dashboard KPIs + SALDO_INICIAL\n' +
    '  • LIQUIDEZ_FAMILIA - Control semanal Familia\n' +
    '  • LIQUIDEZ_NT - Control semanal NeuroTEA\n\n' +
    '⚠️ Las hojas existentes serán sobrescritas.',
    ui.ButtonSet.YES_NO
  );

  if (resultado !== ui.Button.YES) {
    ui.alert('Operación cancelada', 'No se realizaron cambios.', ui.ButtonSet.OK);
    return;
  }

  // Crear todas las hojas
  _crearTodasLasHojas();

  ui.alert(
    '✅ Sistema Creado Exitosamente',
    'Todas las hojas han sido creadas.\n\n' +
    '📊 Para ver el Dashboard interactivo:\n' +
    '   Menú → 💰 Control Financiero → 📊 Abrir Dashboard Web\n\n' +
    '🌐 Para publicar como Web App:\n' +
    '   Menú → 💰 Control Financiero → 🌐 Instrucciones Web App\n\n' +
    '🎯 Próximos pasos:\n' +
    '   1. Ajustar montos en PRESUPUESTO\n' +
    '   2. Completar GASTOS_FIJOS con días de vencimiento\n' +
    '   3. Comenzar a registrar en CARGA_FAMILIA y CARGA_NT',
    ui.ButtonSet.OK
  );
}

/**
 * v7.33: Funciona tanto desde el menú del spreadsheet como desde el editor de Apps Script
 * - Desde menú: Muestra confirmaciones UI y luego crea hojas
 * - Desde editor: Detecta el error de getUi() y crea hojas directamente
 */
function reinicializarSistema() {
  try {
    // Intentar usar UI (solo funciona desde menú del spreadsheet)
    const ui = SpreadsheetApp.getUi();

    // v8.2: Un solo diálogo de confirmación para minimizar tiempo perdido
    const resultado = ui.alert(
      '⚠️ REINICIALIZAR SISTEMA',
      '¿BORRAR y RECREAR todas las hojas?\n\n' +
      '🔴 Se perderán TODOS los datos actuales.\n' +
      '⏳ El proceso toma ~3 minutos. NO cierres la pestaña.',
      ui.ButtonSet.YES_NO
    );

    if (resultado !== ui.Button.YES) return;

    // v8.2: Ejecutar directamente (sin trigger diferido que fallaba)
    SpreadsheetApp.getActiveSpreadsheet().toast('Iniciando reinicialización... NO cierres la pestaña', '⏳', 300);

    _crearTodasLasHojas();

    ui.alert('✅ Sistema Reinicializado', 'Todas las hojas han sido recreadas exitosamente.', ui.ButtonSet.OK);

  } catch (e) {
    // Si getUi() falla, estamos en el editor de Apps Script
    console.log('⚠️ Ejecutando desde editor de Apps Script (sin UI)...');
    console.log('Creando todas las hojas...');
    _crearTodasLasHojas();
    console.log('✅ Reinicialización completada exitosamente');
  }
}

/**
 * v8.1: Función que crea hojas y elimina su propio trigger
 */
function _crearTodasLasHojasConNotificacion() {
  try {
    _crearTodasLasHojas();

    // Eliminar el trigger que nos llamó
    const triggers = ScriptApp.getProjectTriggers();
    for (let i = 0; i < triggers.length; i++) {
      if (triggers[i].getHandlerFunction() === '_crearTodasLasHojasConNotificacion') {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }

    console.log('✅ Reinicialización completada y trigger eliminado');
  } catch (e) {
    console.log('❌ Error en reinicialización:', e.message);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ORDENAR HOJAS
// ═══════════════════════════════════════════════════════════════════════════════

function ordenarHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const orden = [
    NOMBRES_HOJAS.TABLERO,
    NOMBRES_HOJAS.LIQUIDEZ_FAM,    // v6.0 - Hojas separadas
    NOMBRES_HOJAS.LIQUIDEZ_NT,     // v6.0
    NOMBRES_HOJAS.MOVIMIENTO,
    NOMBRES_HOJAS.CARGA_FAMILIA,
    NOMBRES_HOJAS.CARGA_NT,
    NOMBRES_HOJAS.GASTOS_FIJOS,
    NOMBRES_HOJAS.PRESUPUESTO,
    NOMBRES_HOJAS.CONFIG,
    NOMBRES_HOJAS.CALCULOS         // v8.0 - Hoja auxiliar de cálculos (al final)
  ];

  orden.forEach((nombre, index) => {
    const sheet = ss.getSheetByName(nombre);
    if (sheet) {
      ss.setActiveSheet(sheet);
      ss.moveActiveSheet(index + 1);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD WEB
// ═══════════════════════════════════════════════════════════════════════════════

function abrirDashboard() {
  const html = HtmlService.createHtmlOutput(generarHTMLDashboard())
    .setWidth(1500)
    .setHeight(1000);
  SpreadsheetApp.getUi().showModalDialog(html, '📊 Dashboard Control Financiero 2026');
}

function doGet() {
  return HtmlService.createHtmlOutput(generarHTMLDashboard())
    .setTitle('Control Financiero 2026 - NeuroTEA & Familia')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function mostrarInstruccionesWebApp() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🌐 Publicar como Web App',
    'Para publicar el Dashboard como página web independiente:\n\n' +
    '1️⃣ Ir a: Extensiones → Apps Script\n\n' +
    '2️⃣ En Apps Script, click en "Implementar" (botón azul arriba)\n\n' +
    '3️⃣ Seleccionar "Nueva implementación"\n\n' +
    '4️⃣ Configurar:\n' +
    '   • Tipo: "Aplicación web"\n' +
    '   • Ejecutar como: "Yo (tu email)"\n' +
    '   • Acceso: "Cualquier persona"\n\n' +
    '5️⃣ Click "Implementar"\n\n' +
    '6️⃣ Autorizar el acceso cuando se solicite\n\n' +
    '7️⃣ ¡Copiar la URL generada!\n\n' +
    '📱 Podrás acceder al Dashboard desde cualquier navegador o celular.',
    ui.ButtonSet.OK
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════════

function actualizarTodasValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
  if (cargaFam) aplicarValidacionesCargaFamilia(cargaFam);

  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
  if (cargaNT) aplicarValidacionesCargaNT(cargaNT);

  SpreadsheetApp.getUi().alert('✅ Validaciones Actualizadas',
    'Las validaciones de CARGA_FAMILIA y CARGA_NT han sido actualizadas.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

// v7.26: Agrega columna VÁLIDO (J) a hojas CARGA existentes sin perder datos
// v7.34: Simplificado - no usa COUNTIF contra CONFIG (fallaba con datos pegados)
function agregarColumnaValido() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let actualizadas = 0;

  [NOMBRES_HOJAS.CARGA_FAMILIA, NOMBRES_HOJAS.CARGA_NT].forEach(nombre => {
    const sheet = ss.getSheetByName(nombre);
    if (!sheet) return;

    // v7.34: Validación simplificada - solo verifica que SUBCATEGORÍA no esté vacía
    const esFamilia = (nombre === NOMBRES_HOJAS.CARGA_FAMILIA);
    const formulaValido = esFamilia
      ? '=ARRAYFORMULA(IF(A4:A500="";"";IF(IFERROR(MONTH(A4:A500);0)=0;"⚠ Fecha";IF(IFERROR(YEAR(A4:A500);0)<>' + AÑO + ';"⚠ Año";IF((F4:F500="")+(NOT(ISNUMBER(F4:F500)))>0;"⚠ Monto";IF(B4:B500="";"⚠ Tipo";IF((B4:B500="Egreso Familiar")*(C4:C500="-")>0;"⚠ Cat";IF((B4:B500="Egreso Familiar")*(C4:C500="VARIABLES")*((D4:D500="")+(D4:D500="-"))>0;"⚠ Subcat";"✓"))))))))'
      : '=ARRAYFORMULA(IF(A4:A500="";"";IF(IFERROR(MONTH(A4:A500);0)=0;"⚠ Fecha";IF(IFERROR(YEAR(A4:A500);0)<>' + AÑO + ';"⚠ Año";IF((F4:F500="")+(NOT(ISNUMBER(F4:F500)))>0;"⚠ Monto";IF(B4:B500="";"⚠ Tipo";IF((B4:B500="Egreso NT")*(C4:C500="-")>0;"⚠ Cat";IF((B4:B500="Egreso NT")*(C4:C500="VARIABLES")*((D4:D500="")+(D4:D500="-"))>0;"⚠ Subcat";"✓"))))))))';
    // Header J3
    sheet.getRange('J3')
      .setValue('VÁLIDO')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    // ARRAYFORMULA en J4
    sheet.getRange('J4').setFormula(formulaValido);
    sheet.getRange('J4:J500').setHorizontalAlignment('center');
    sheet.setColumnWidth(10, 80);

    // Formato condicional: recrear todas las reglas (evita duplicados si se ejecuta varias veces)
    const entidad = (nombre === NOMBRES_HOJAS.CARGA_FAMILIA) ? 'FAMILIA' : 'NEUROTEA';
    aplicarFormatoCondicionalCarga(sheet, entidad);

    actualizadas++;
  });

  SpreadsheetApp.getUi().alert('✅ Columna VÁLIDO Agregada',
    actualizadas + ' hoja(s) actualizada(s).\n\n' +
    '✓ = Fila será contada en TABLERO\n' +
    '⚠ Fecha = Fecha inválida (texto)\n' +
    '⚠ Año = Año diferente a ' + AÑO + '\n' +
    '⚠ Monto = Monto vacío o texto',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

// v7.27: Agrega filtro por mes a hojas CARGA existentes sin perder datos
function agregarFiltroMes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let actualizadas = 0;

  [NOMBRES_HOJAS.CARGA_FAMILIA, NOMBRES_HOJAS.CARGA_NT].forEach(nombre => {
    const sheet = ss.getSheetByName(nombre);
    if (!sheet) return;

    // Desmerge A2:J2 si estaba mergeado
    sheet.getRange('A2:J2').breakApart();

    // Subtitle en A2:H2
    sheet.getRange('A2:H2').merge()
      .setFontSize(10).setFontStyle('italic');

    // Label y dropdown del filtro
    sheet.getRange('I2').setValue('📅 Filtro:')
      .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('right');
    sheet.getRange('J2').setValue('TODOS')
      .setFontSize(10).setFontWeight('bold').setHorizontalAlignment('center')
      .setBackground('#e0f2fe')
      .setBorder(true, true, true, true, false, false, '#93c5fd', SpreadsheetApp.BorderStyle.SOLID);
    sheet.getRange('J2').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['TODOS', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], true)
        .setAllowInvalid(false)
        .build()
    );

    actualizadas++;
  });

  SpreadsheetApp.getUi().alert('✅ Filtro por Mes Agregado',
    actualizadas + ' hoja(s) actualizada(s).\n\n' +
    'Seleccioná un mes en la celda J2 para filtrar.\n' +
    '"TODOS" muestra todas las transacciones ordenadas por fecha.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function recalcularTablero() {
  SpreadsheetApp.flush();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Tablero recalculado correctamente', '✅ Listo', 3);
}

function aplicarEstilosGlobales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Aplicando estilos...', '🎨 Estilos', 2);
  // Aquí se llamarían las funciones de Styles.gs
  ss.toast('Estilos aplicados correctamente', '✅ Listo', 3);
}

function limpiarDatosPrueba() {
  const ui = SpreadsheetApp.getUi();
  const resultado = ui.alert(
    '🧹 Limpiar Datos de Prueba',
    '¿Deseas limpiar los datos de prueba de CARGA_FAMILIA y CARGA_NT?\n\n' +
    'Solo se eliminarán las filas de datos, no la estructura.',
    ui.ButtonSet.YES_NO
  );

  if (resultado !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
  if (cargaFam && cargaFam.getLastRow() > 3) {
    cargaFam.deleteRows(4, cargaFam.getLastRow() - 3);
  }

  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
  if (cargaNT && cargaNT.getLastRow() > 3) {
    cargaNT.deleteRows(4, cargaNT.getLastRow() - 3);
  }

  ui.alert('✅ Datos Limpiados', 'Los datos de prueba han sido eliminados.', ui.ButtonSet.OK);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACERCA DE
// ═══════════════════════════════════════════════════════════════════════════════

function mostrarAcercaDe() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '📊 Sistema de Control Financiero 2026',
    '═══════════════════════════════════════\n\n' +
    '🏥 NeuroTEA & 🏠 Familia\n\n' +
    '═══════════════════════════════════════\n\n' +
    'Versión: ' + VERSION + '\n' +
    'Año Fiscal: ' + AÑO + '\n\n' +
    '📋 Funcionalidades:\n' +
    '  • Presupuesto anual integrado\n' +
    '  • Control de gastos fijos y variables\n' +
    '  • Sistema "Anti-Burro" para evitar errores\n' +
    '  • Liquidez a 3 semanas\n' +
    '  • Conciliación bancaria\n' +
    '  • Balance cruzado NT ↔ Familia\n' +
    '  • Dashboard visual profesional\n' +
    '  • Meta de ganancia 7% para NeuroTEA\n\n' +
    '═══════════════════════════════════════\n\n' +
    '👤 Usuarios: Marco (Admin) | Clara (Carga)\n' +
    '💰 Moneda: Guaraníes (Gs.)\n\n' +
    '═══════════════════════════════════════',
    ui.ButtonSet.OK
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRIGGER onEdit - Sistema Anti-Burro
// ═══════════════════════════════════════════════════════════════════════════════

function onEdit(e) {
  if (!e) return;

  const sheet = e.source.getActiveSheet();
  const nombreHoja = sheet.getName();
  const row = e.range.getRow();
  const col = e.range.getColumn();

  // v7.27: Filtro por mes en CARGA (celda J2)
  if (row === 2 && col === 10) {
    if (nombreHoja === NOMBRES_HOJAS.CARGA_FAMILIA || nombreHoja === NOMBRES_HOJAS.CARGA_NT) {
      filtrarCargaPorMes(sheet, e.value);
      return;
    }
  }

  // ═══ v8.5: Sincronización EST.PAGO con CALCULOS (MEJORADA) ═══
  if (nombreHoja === NOMBRES_HOJAS.MOVIMIENTO) {
    // Cambio de MES (celda B3) → GUARDAR mes anterior, LUEGO cargar nuevo mes
    if (row === 3 && col === 2) {
      const mesAnterior = e.oldValue;
      const mesNuevo = e.value;

      // v8.5: PRIMERO guardar todos los estados del mes anterior
      if (mesAnterior && mesAnterior !== mesNuevo) {
        guardarTodosLosEstadosMes(sheet, mesAnterior);
      }

      // LUEGO cargar estados del nuevo mes
      cargarEstadosDesdeCálculos(sheet, mesNuevo);
      return;
    }
    // Cambio de EST.PAGO (columna J) → guardar en CALCULOS
    if (col === 10 && row >= 9) {
      guardarEstadoEnCálculos(sheet, row, e.value);
      return;
    }
  }

  if (row < 4) return;

  if (nombreHoja === NOMBRES_HOJAS.CARGA_FAMILIA) {
    procesarEdicionCargaFamilia(sheet, row, col, e.value, e.oldValue);
  } else if (nombreHoja === NOMBRES_HOJAS.CARGA_NT) {
    procesarEdicionCargaNT(sheet, row, col, e.value, e.oldValue);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINCRONIZACIÓN EST.PAGO CON CALCULOS (v8.0)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Carga los estados de pago desde CALCULOS sección 7 cuando cambia el mes.
 * v8.1: Agregado logging diagnóstico y normalización mejorada
 * @param {Sheet} movimiento - Hoja MOVIMIENTO
 * @param {string} mesNuevo - Nombre del mes seleccionado (Enero, Febrero, etc.)
 */
function cargarEstadosDesdeCálculos(movimiento, mesNuevo) {
  const ss = movimiento.getParent();
  const calculos = ss.getSheetByName(NOMBRES_HOJAS.CALCULOS);

  if (!calculos) {
    console.log('❌ Hoja CALCULOS no existe');
    return;
  }

  // Obtener número de mes (1-12)
  const mesNum = MESES.indexOf(mesNuevo) + 1;
  if (mesNum < 1 || mesNum > 12) {
    console.log('❌ Mes no válido:', mesNuevo);
    return;
  }

  ss.toast('Cargando estados de ' + mesNuevo + '...', '📅', 2);
  console.log('═══ cargarEstadosDesdeCálculos: ' + mesNuevo + ' (mes ' + mesNum + ') ═══');

  // Columna del mes en CALCULOS sección 7 (B=1=Enero, C=2=Febrero, etc.)
  const colMes = mesNum + 1; // B=2, C=3, ..., M=13

  // Leer todos los conceptos y estados de CALCULOS sección 7 (fila 167+)
  // v8.1: Extendido a 120 filas para cubrir FAMILIA + NEUROTEA
  const datosCalc = calculos.getRange(167, 1, 120, 13).getValues(); // A167:M286

  // Crear mapa concepto → estado (con normalización)
  const estadosPorConcepto = {};
  let countConceptos = 0;
  for (let i = 0; i < datosCalc.length; i++) {
    const conceptoRaw = (datosCalc[i][0] || '').toString();
    const concepto = normalizarConcepto(conceptoRaw);
    const estado = (datosCalc[i][mesNum] || 'Pendiente').toString().trim();

    if (concepto && concepto !== '── familia ──' && concepto !== '── neurotea ──' && !concepto.startsWith('──')) {
      estadosPorConcepto[concepto] = estado;
      countConceptos++;
    }
  }
  console.log('  Conceptos en CALCULOS sección 7: ' + countConceptos);

  // Leer conceptos de MOVIMIENTO (columna A) y actualizar EST.PAGO (columna J)
  // FAMILIA: filas 9-116, NEUROTEA: filas 122-206
  const rangos = [
    { nombre: 'FAMILIA', inicio: 9, fin: 116 },
    { nombre: 'NEUROTEA', inicio: 122, fin: 206 }
  ];

  let actualizados = 0;
  let noEncontrados = [];

  for (const rango of rangos) {
    const conceptosMov = movimiento.getRange(rango.inicio, 1, rango.fin - rango.inicio + 1, 1).getValues();
    const tiposMov = movimiento.getRange(rango.inicio, 2, rango.fin - rango.inicio + 1, 1).getValues();

    for (let i = 0; i < conceptosMov.length; i++) {
      const conceptoRaw = (conceptosMov[i][0] || '').toString();
      const concepto = normalizarConcepto(conceptoRaw);
      const tipo = (tiposMov[i][0] || '').toString().trim();

      // Solo actualizar filas de EGRESOS (no ingresos, ahorro, headers, subtotales)
      // v8.1: Verificar que sea Egreso para aplicar estado
      if (concepto && tipo === 'Egreso' &&
          !concepto.startsWith('▶') && !concepto.startsWith('📥') &&
          !concepto.startsWith('📤') && !concepto.startsWith('═') &&
          concepto !== 'subtotal' && !concepto.includes('total')) {

        const filaMovimiento = rango.inicio + i;
        const estadoActual = movimiento.getRange(filaMovimiento, 10).getValue();

        if (estadosPorConcepto[concepto]) {
          const estadoNuevo = estadosPorConcepto[concepto];

          // Solo actualizar si es diferente (optimización)
          if (estadoActual !== estadoNuevo) {
            movimiento.getRange(filaMovimiento, 10).setValue(estadoNuevo);
            actualizados++;
          }
        } else {
          // v8.1: Log de conceptos no encontrados (solo si no es variable puro)
          const frec = movimiento.getRange(filaMovimiento, 3).getValue().toString();
          if (frec !== 'Variable') {
            noEncontrados.push(conceptoRaw.substring(0, 30));
          }
        }
      }
    }
  }

  console.log('  Estados actualizados: ' + actualizados);
  if (noEncontrados.length > 0 && noEncontrados.length <= 10) {
    console.log('  ⚠️ Conceptos no encontrados en CALCULOS:', noEncontrados.join(', '));
  } else if (noEncontrados.length > 10) {
    console.log('  ⚠️ ' + noEncontrados.length + ' conceptos no encontrados (primeros 5):', noEncontrados.slice(0, 5).join(', '));
  }

  ss.toast('Estados de ' + mesNuevo + ' cargados (' + actualizados + ' actualizados)', '✓', 2);
}

/**
 * Normaliza un concepto para comparación (trim, lowercase, eliminar espacios múltiples)
 * v8.1: Nueva función auxiliar
 */
function normalizarConcepto(concepto) {
  if (!concepto) return '';
  return concepto.toString().trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Guarda el estado de pago en CALCULOS sección 7 cuando se edita en MOVIMIENTO.
 * v8.1: Mejorado con normalización y logging
 * @param {Sheet} movimiento - Hoja MOVIMIENTO
 * @param {number} filaMovimiento - Fila editada en MOVIMIENTO
 * @param {string} nuevoEstado - Nuevo valor (Pendiente/Pagado/Cancelado)
 */
function guardarEstadoEnCálculos(movimiento, filaMovimiento, nuevoEstado) {
  const ss = movimiento.getParent();
  const calculos = ss.getSheetByName(NOMBRES_HOJAS.CALCULOS);

  if (!calculos) {
    console.log('❌ guardarEstadoEnCálculos: Hoja CALCULOS no existe');
    return;
  }

  // Obtener el concepto de la fila editada
  const conceptoRaw = movimiento.getRange(filaMovimiento, 1).getValue().toString();
  const conceptoNorm = normalizarConcepto(conceptoRaw);

  if (!conceptoNorm || conceptoRaw.startsWith('▶') || conceptoRaw.startsWith('📥') ||
      conceptoRaw.startsWith('📤') || conceptoRaw.startsWith('═') ||
      conceptoNorm === 'subtotal' || conceptoNorm.includes('total')) {
    return; // No guardar headers ni subtotales
  }

  // Obtener mes actual (de celda B3)
  const mesActual = movimiento.getRange(3, 2).getValue().toString();
  const mesNum = MESES.indexOf(mesActual) + 1;

  if (mesNum < 1 || mesNum > 12) {
    console.log('❌ guardarEstadoEnCálculos: Mes no válido:', mesActual);
    return;
  }

  // Columna del mes en CALCULOS (B=Enero=2, C=Febrero=3, etc.)
  const colMes = mesNum + 1;

  // Buscar el concepto en CALCULOS sección 7 (fila 167+)
  // v8.1: Extendido a 120 filas
  const conceptosCalc = calculos.getRange(167, 1, 120, 1).getValues();

  for (let i = 0; i < conceptosCalc.length; i++) {
    const conceptoCalcNorm = normalizarConcepto(conceptosCalc[i][0]);
    if (conceptoCalcNorm === conceptoNorm) {
      const filaCalc = 167 + i;
      calculos.getRange(filaCalc, colMes).setValue(nuevoEstado);
      console.log('✓ Estado guardado:', conceptoRaw, '→', nuevoEstado, 'en', mesActual, '(fila CALCULOS:', filaCalc, ')');
      return;
    }
  }

  // v8.1: Solo log si es un gasto fijo (no variable)
  const frec = movimiento.getRange(filaMovimiento, 3).getValue().toString();
  if (frec !== 'Variable') {
    console.log('⚠️ guardarEstadoEnCálculos: Concepto no encontrado en CALCULOS:', conceptoRaw);
  }
}

/**
 * v8.5: Guarda TODOS los estados de pago del mes actual en CALCULOS sección 7.
 * Se ejecuta ANTES de cambiar de mes para no perder cambios.
 * Usa batch operations para eficiencia.
 *
 * @param {Sheet} movimiento - Hoja MOVIMIENTO
 * @param {string} mes - Nombre del mes a guardar (Enero, Febrero, etc.)
 */
function guardarTodosLosEstadosMes(movimiento, mes) {
  const ss = movimiento.getParent();
  const calculos = ss.getSheetByName(NOMBRES_HOJAS.CALCULOS);

  if (!calculos) {
    console.log('❌ guardarTodosLosEstadosMes: Hoja CALCULOS no existe');
    return;
  }

  // Obtener número de mes (1-12)
  const mesNum = MESES.indexOf(mes) + 1;
  if (mesNum < 1 || mesNum > 12) {
    console.log('❌ guardarTodosLosEstadosMes: Mes no válido:', mes);
    return;
  }

  ss.toast('Guardando estados de ' + mes + '...', '💾', 2);
  console.log('═══ guardarTodosLosEstadosMes: ' + mes + ' (mes ' + mesNum + ') ═══');

  // Columna del mes en CALCULOS sección 7 (B=Enero=2, C=Febrero=3, etc.)
  const colMes = mesNum + 1;

  // Leer conceptos de CALCULOS sección 7 y crear mapa normalizado → fila
  const conceptosCalc = calculos.getRange(167, 1, 120, 1).getValues();
  const mapaConceptoFila = {};

  for (let i = 0; i < conceptosCalc.length; i++) {
    const conceptoNorm = normalizarConcepto(conceptosCalc[i][0]);
    if (conceptoNorm && !conceptoNorm.startsWith('──')) {
      mapaConceptoFila[conceptoNorm] = 167 + i;
    }
  }

  // Rangos de MOVIMIENTO: FAMILIA (9-116) y NEUROTEA (122-206)
  const rangos = [
    { nombre: 'FAMILIA', inicio: 9, fin: 116 },
    { nombre: 'NEUROTEA', inicio: 122, fin: 206 }
  ];

  let guardados = 0;

  for (const rango of rangos) {
    const numFilas = rango.fin - rango.inicio + 1;

    // Leer conceptos (A), tipos (B), frecuencias (C) y estados (J) de MOVIMIENTO
    const conceptosMov = movimiento.getRange(rango.inicio, 1, numFilas, 1).getValues();
    const tiposMov = movimiento.getRange(rango.inicio, 2, numFilas, 1).getValues();
    const frecsMov = movimiento.getRange(rango.inicio, 3, numFilas, 1).getValues();
    const estadosMov = movimiento.getRange(rango.inicio, 10, numFilas, 1).getValues();

    for (let i = 0; i < numFilas; i++) {
      const conceptoRaw = (conceptosMov[i][0] || '').toString();
      const tipo = (tiposMov[i][0] || '').toString().trim();
      const frec = (frecsMov[i][0] || '').toString().trim();
      const estado = (estadosMov[i][0] || '').toString().trim();

      // Solo guardar gastos fijos (Egreso, no Variable, no headers)
      if (tipo === 'Egreso' && frec !== 'Variable' &&
          !conceptoRaw.startsWith('▶') && !conceptoRaw.startsWith('📥') &&
          !conceptoRaw.startsWith('📤') && !conceptoRaw.startsWith('═') &&
          !conceptoRaw.toLowerCase().includes('subtotal') &&
          !conceptoRaw.toLowerCase().includes('total')) {

        const conceptoNorm = normalizarConcepto(conceptoRaw);
        const filaCalc = mapaConceptoFila[conceptoNorm];

        if (filaCalc && estado) {
          calculos.getRange(filaCalc, colMes).setValue(estado);
          guardados++;
        }
      }
    }
  }

  console.log('  Estados guardados: ' + guardados);
  ss.toast('Estados de ' + mes + ' guardados (' + guardados + ')', '✓', 2);
}

// ═══════════════════════════════════════════════════════════════════════════════
// FILTRO POR MES EN CARGA (v7.27)
// ═══════════════════════════════════════════════════════════════════════════════

function filtrarCargaPorMes(sheet, mesSeleccionado) {
  const ss = sheet.getParent();
  ss.toast('Aplicando filtro...', '📅 ' + (mesSeleccionado || 'TODOS'), 2);

  // v7.31: Buscar última fila con datos en columna A (no getLastRow que incluye ARRAYFORMULA)
  var fechasAll = sheet.getRange('A4:A500').getValues();
  var ultimaFilaReal = 3; // si no hay datos
  for (var idx = 0; idx < fechasAll.length; idx++) {
    if (fechasAll[idx][0] && fechasAll[idx][0] !== '') {
      ultimaFilaReal = idx + 4;
    }
  }
  if (ultimaFilaReal < 4) return; // No hay datos

  var numFilas = ultimaFilaReal - 3; // filas 4 a ultimaFilaReal

  // 1. Mostrar todas las filas de datos
  sheet.showRows(4, numFilas);

  // 2. Ordenar por fecha (columna A) - solo A:I para no mover ARRAYFORMULA de J
  if (numFilas > 1) {
    sheet.getRange(4, 1, numFilas, 9).sort({column: 1, ascending: true});
  }

  // 3. Si es TODOS, terminamos (todo visible y ordenado)
  if (mesSeleccionado === 'TODOS' || !mesSeleccionado) {
    ss.toast('Mostrando todas las transacciones (' + numFilas + ' filas)', '📅 TODOS', 3);
    return;
  }

  // 4. Mapear nombre de mes a número (usa constante global MESES de Config.gs)
  const mesNum = MESES.indexOf(mesSeleccionado) + 1;
  if (mesNum === 0) return;

  // 5. Leer todas las fechas
  const fechas = sheet.getRange(4, 1, numFilas, 1).getValues();

  // 6. Ocultar filas que no corresponden al mes (en lotes consecutivos)
  let inicioOcultar = -1;
  let filasVisibles = 0;

  for (var i = 0; i <= numFilas; i++) {
    var debeOcultar = false;

    if (i < numFilas) {
      var fecha = fechas[i][0];
      if (fecha instanceof Date) {
        debeOcultar = (fecha.getMonth() + 1) !== mesNum;
        if (!debeOcultar) filasVisibles++;
      } else if (fecha) {
        // Fecha texto/inválida → ocultar al filtrar
        debeOcultar = true;
      }
      // Celdas vacías → NO ocultar (permite ingresar datos nuevos)
    }

    if (debeOcultar) {
      if (inicioOcultar === -1) inicioOcultar = i + 4;
    } else {
      if (inicioOcultar !== -1) {
        sheet.hideRows(inicioOcultar, (i + 4) - inicioOcultar);
        inicioOcultar = -1;
      }
    }
  }

  ss.toast('Mostrando ' + filasVisibles + ' transacciones de ' + mesSeleccionado, '📅 ' + mesSeleccionado, 3);
}

function procesarEdicionCargaFamilia(sheet, row, col, valor, oldValue) {
  const linkId = obtenerLinkId(sheet, row);
  const tieneContraparte = linkId && linkId.length === 6;

  // Columna A = FECHA (columna 1) - v7.21: También reintenta auto-creación
  if (col === 1 && valor) {
    if (tieneContraparte) {
      sincronizarContraparte(linkId, NOMBRES_HOJAS.CARGA_FAMILIA, 1, valor);
    } else {
      // v7.21: Reintentar auto-creación cuando FECHA se completa
      intentarAutoCreacionFamilia(sheet, row);
    }
  }

  // Columna B = TIPO (columna 2)
  if (col === 2) {
    const esIngreso = TODOS_TIPOS_INGRESO_FAMILIA.includes(valor);
    const esAhorro = (valor === TIPO_AHORRO);

    if (esIngreso) {
      sheet.getRange(row, 3).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
    } else if (esAhorro) {
      sheet.getRange(row, 3).setBackground(COLORES.BLANCO);
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
    } else {
      // v7.24: Restaurar validaciones CATEGORÍA y SUBCATEGORÍA para egresos
      // Usa requireValueInList para compatibilidad con copy-paste
      sheet.getRange(row, 3).setBackground(COLORES.BLANCO).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(['-', ...CARGA_CATEGORIAS_FAMILIA, ...CATEGORIAS_AHORRO_FAMILIA], true)
          .setAllowInvalid(false)
          .build()
      );
      sheet.getRange(row, 4).setBackground(COLORES.BLANCO).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(VARIABLES_FAMILIA, true)
          .setAllowInvalid(true)
          .build()
      );
      // v7.21: Reintentar auto-creación cuando TIPO cambia a Egreso Familiar
      if (!tieneContraparte && valor === 'Egreso Familiar') {
        intentarAutoCreacionFamilia(sheet, row);
      }
    }
  }

  // Columna F = MONTO (columna 6)
  if (col === 6) {
    const montoNuevo = limpiarMonto(valor);
    const montoAnterior = limpiarMonto(oldValue);

    // Si el monto se vació, borrar contraparte
    if (montoNuevo === 0 && montoAnterior > 0) {
      if (tieneContraparte) {
        borrarContraparte(linkId, NOMBRES_HOJAS.CARGA_FAMILIA);
        sheet.getRange(row, 9).setValue('');
      }
    }
    // v7.19: Si ya tiene contraparte, sincronizar monto
    else if (tieneContraparte && montoNuevo >= 10000) {
      sincronizarContraparte(linkId, NOMBRES_HOJAS.CARGA_FAMILIA, 6, montoNuevo);
    }
    // v7.18: Si no tiene contraparte, intentar crear
    else if (!tieneContraparte && montoNuevo >= 10000) {
      intentarAutoCreacionFamilia(sheet, row);
    }
  }

  // Columna G = CUENTA (columna 7)
  if (col === 7 && valor && valor !== '-') {
    // v7.19: Si ya tiene contraparte, sincronizar cuenta
    if (tieneContraparte) {
      sincronizarContraparte(linkId, NOMBRES_HOJAS.CARGA_FAMILIA, 7, valor);
    }
    // Si no tiene contraparte, intentar crear
    else {
      intentarAutoCreacionFamilia(sheet, row);
    }
  }

  // Columna C = CATEGORÍA (columna 3)
  if (col === 3) {
    const tipoActual = sheet.getRange(row, 2).getValue();

    // Validar que el TIPO no sea un INGRESO
    if (TODOS_TIPOS_INGRESO_FAMILIA.includes(tipoActual) && valor !== '-') { // v7.14
      SpreadsheetApp.getUi().alert(
        '⚠️ INCOHERENCIA: TIPO es un INGRESO',
        'El TIPO "' + tipoActual + '" es un INGRESO.\n\n' +
        'Los ingresos NO tienen CATEGORÍA.\n' +
        'La CATEGORÍA solo aplica para egresos ("Egreso Familiar") o ahorro ("Ahorro").',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      // v7.22: clearDataValidations para que "-" no muestre warning
      sheet.getRange(row, 3).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      return;
    }

    // Si TIPO = "Ahorro", validar que CATEGORÍA sea de ahorro
    if (tipoActual === TIPO_AHORRO) {
      if (!CATEGORIAS_AHORRO_FAMILIA.includes(valor)) {
        SpreadsheetApp.getUi().alert(
          '⚠️ CATEGORÍA incorrecta para AHORRO',
          'Si el TIPO es "Ahorro", la CATEGORÍA debe ser:\n\n' +
          '• Ahorro Clara\n' +
          '• Ahorro Marco\n' +
          '• Fondo de Emergencia\n\n' +
          'Seleccionaste: "' + valor + '"',
          SpreadsheetApp.getUi().ButtonSet.OK
        );
        sheet.getRange(row, 3).setValue('');
        return;
      }
      // AHORRO: SUBCATEGORÍA siempre bloqueada
      // v7.22: clearDataValidations para que "-" no muestre warning
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      return;
    }

    // Para egresos: habilitar subcategoría solo si es VARIABLES
    if (valor === 'VARIABLES') {
      sheet.getRange(row, 4).setBackground(COLORES.BLANCO);
      // v7.21: Reintentar auto-creación cuando CATEGORÍA cambia a VARIABLES
      if (!tieneContraparte) {
        intentarAutoCreacionFamilia(sheet, row);
      }
    } else {
      // Deshabilitar subcategoría para otras categorías de egreso
      // v7.22: clearDataValidations para que "-" no muestre warning
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
    }
  }

  // Columna D = SUBCATEGORÍA (columna 4) - Validaciones Anti-Burro
  if (col === 4) {
    const tipoActual = sheet.getRange(row, 2).getValue();
    const categoriaActual = sheet.getRange(row, 3).getValue();

    // Si TIPO = "Ahorro", SUBCATEGORÍA debe estar bloqueada
    if (tipoActual === TIPO_AHORRO && valor !== '-') {
      SpreadsheetApp.getUi().alert(
        '⚠️ SUBCATEGORÍA no aplica para AHORRO',
        'Cuando el TIPO es "Ahorro", la SUBCATEGORÍA no se usa.\n\n' +
        'El tipo de ahorro se selecciona en CATEGORÍA.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO);
      return;
    }

    // 1. Validar contradicciones TIPO vs SUBCATEGORÍA
    if (validarContradiccionTipoSubcategoriaFamilia(sheet, row, tipoActual, valor)) {
      return; // Si hubo contradicción, ya se limpió la celda
    }

    // 2. Validar VARIABLES con subcategoría correcta (v7.20: lee desde CONFIG dinámicamente)
    const variablesFamValidas = obtenerVariablesDesdeConfig('FAMILIA');
    if (categoriaActual === 'VARIABLES' && !variablesFamValidas.includes(valor)) {
      SpreadsheetApp.getUi().alert(
        '⚠️ SUBCATEGORÍA incorrecta para VARIABLES',
        'La subcategoría "' + valor + '" no pertenece a VARIABLES.\n\n' +
        'Verifica que estés seleccionando de la lista correcta.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue('');
      return;
    }

    // 3. Validar préstamos/devoluciones (balance cruzado)
    // v7.21: Si validación bloquea, no intentar auto-creación
    const bloqueadoFam = validarPrestamoDevolucionFamilia(sheet, row, valor);
    if (bloqueadoFam) return;

    // 4. v7.19: Manejar préstamos/devoluciones
    const esPrestamoODevolucion = (valor === 'Préstamo Familia → NT' || valor === 'Devolución Familia → NT');
    const eraPrestamoODevolucion = (oldValue === 'Préstamo Familia → NT' || oldValue === 'Devolución Familia → NT');

    if (esPrestamoODevolucion) {
      // Si ya tenía contraparte y cambió el tipo (préstamo↔devolución), recrear
      if (tieneContraparte && eraPrestamoODevolucion && valor !== oldValue) {
        recrearContraparte(sheet, row, NOMBRES_HOJAS.CARGA_FAMILIA);
      }
      // Si no tiene contraparte, intentar crear
      else if (!tieneContraparte) {
        intentarAutoCreacionFamilia(sheet, row);
      }
    }
    // Si cambió DE préstamo/devolución A otra cosa, borrar contraparte
    else if (eraPrestamoODevolucion && tieneContraparte) {
      borrarContraparte(linkId, NOMBRES_HOJAS.CARGA_FAMILIA);
      sheet.getRange(row, 9).setValue('');
      SpreadsheetApp.getActiveSpreadsheet().toast('✓ Contraparte eliminada', '🗑️ Auto', 2);
    }
  }
}

function procesarEdicionCargaNT(sheet, row, col, valor, oldValue) {
  const linkId = obtenerLinkId(sheet, row);
  const tieneContraparte = linkId && linkId.length === 6;

  // Columna A = FECHA (columna 1) - v7.19: Sincronizar si ya tiene contraparte
  if (col === 1 && valor) {
    if (tieneContraparte) {
      sincronizarContraparte(linkId, NOMBRES_HOJAS.CARGA_NT, 1, valor);
    } else {
      // v7.21: Reintentar auto-creación cuando FECHA se completa
      intentarAutoCreacionNT(sheet, row);
    }
  }

  // Columna B = TIPO (columna 2)
  if (col === 2) {
    const esIngreso = TODOS_TIPOS_INGRESO_NT.includes(valor);
    if (esIngreso) {
      sheet.getRange(row, 3).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
    } else {
      // v7.24: Restaurar validaciones CATEGORÍA y SUBCATEGORÍA para egresos
      // Usa requireValueInList para compatibilidad con copy-paste
      sheet.getRange(row, 3).setBackground(COLORES.BLANCO).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(['-', ...CARGA_CATEGORIAS_NT], true)
          .setAllowInvalid(false)
          .build()
      );
      sheet.getRange(row, 4).setBackground(COLORES.BLANCO).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(VARIABLES_NT, true)
          .setAllowInvalid(true)
          .build()
      );
      // v7.21: Reintentar auto-creación cuando TIPO cambia a Egreso NT
      if (!tieneContraparte && valor === 'Egreso NT') {
        intentarAutoCreacionNT(sheet, row);
      }
    }
  }

  // Columna F = MONTO (columna 6)
  if (col === 6) {
    const montoNuevo = limpiarMonto(valor);
    const montoAnterior = limpiarMonto(oldValue);

    // Si el monto se vació, borrar contraparte
    if (montoNuevo === 0 && montoAnterior > 0) {
      if (tieneContraparte) {
        borrarContraparte(linkId, NOMBRES_HOJAS.CARGA_NT);
        sheet.getRange(row, 9).setValue('');
      }
    }
    // v7.19: Si ya tiene contraparte, sincronizar monto
    else if (tieneContraparte && montoNuevo >= 10000) {
      sincronizarContraparte(linkId, NOMBRES_HOJAS.CARGA_NT, 6, montoNuevo);
    }
    // v7.18: Si no tiene contraparte, intentar crear
    else if (!tieneContraparte && montoNuevo >= 10000) {
      intentarAutoCreacionNT(sheet, row);
    }
  }

  // Columna G = CUENTA (columna 7)
  if (col === 7 && valor && valor !== '-') {
    // v7.19: Si ya tiene contraparte, sincronizar cuenta
    if (tieneContraparte) {
      sincronizarContraparte(linkId, NOMBRES_HOJAS.CARGA_NT, 7, valor);
    }
    // Si no tiene contraparte, intentar crear
    else {
      intentarAutoCreacionNT(sheet, row);
    }
  }

  // Columna C = CATEGORÍA (columna 3)
  if (col === 3) {
    // Validar que el TIPO no sea un INGRESO
    const tipoActual = sheet.getRange(row, 2).getValue();
    if (TODOS_TIPOS_INGRESO_NT.includes(tipoActual) && valor !== '-') { // v7.14
      SpreadsheetApp.getUi().alert(
        '⚠️ INCOHERENCIA: TIPO es un INGRESO',
        'El TIPO "' + tipoActual + '" es un INGRESO.\n\n' +
        'Los ingresos NO tienen CATEGORÍA.\n' +
        'La CATEGORÍA solo aplica para egresos ("Egreso NT").',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      // v7.22: clearDataValidations para que "-" no muestre warning
      sheet.getRange(row, 3).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
      return;
    }

    if (valor === 'VARIABLES' || valor === 'EVENTOS') {
      sheet.getRange(row, 4).setBackground(COLORES.BLANCO);
      // v7.21: Reintentar auto-creación cuando CATEGORÍA cambia a VARIABLES
      if (!tieneContraparte && valor === 'VARIABLES') {
        intentarAutoCreacionNT(sheet, row);
      }
    } else {
      // v7.22: clearDataValidations para que "-" no muestre warning
      sheet.getRange(row, 4).setValue('-').setBackground(COLORES.GRIS_FONDO).clearDataValidations();
    }
  }

  // Columna D = SUBCATEGORÍA (columna 4) - Validaciones Anti-Burro
  if (col === 4) {
    const tipoActual = sheet.getRange(row, 2).getValue();
    const categoriaActual = sheet.getRange(row, 3).getValue();

    // 1. Validar contradicciones TIPO vs SUBCATEGORÍA
    if (validarContradiccionTipoSubcategoriaNT(sheet, row, tipoActual, valor)) {
      return; // Si hubo contradicción, ya se limpió la celda
    }

    // 2. Validar VARIABLES con subcategoría correcta (v7.20: lee desde CONFIG dinámicamente)
    const variablesNTValidas = obtenerVariablesDesdeConfig('NT');
    if (categoriaActual === 'VARIABLES' && !variablesNTValidas.includes(valor)) {
      SpreadsheetApp.getUi().alert(
        '⚠️ SUBCATEGORÍA incorrecta para VARIABLES',
        'La subcategoría "' + valor + '" no pertenece a VARIABLES de NT.\n\n' +
        'Verifica que estés seleccionando de la lista correcta.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue('');
      return;
    }

    // 3. Validar EVENTOS con subcategoría correcta
    if (categoriaActual === 'EVENTOS') {
      const eventosValidos = EVENTOS_NT.map(e => e.nombre);
      if (!eventosValidos.includes(valor)) {
        SpreadsheetApp.getUi().alert(
          '⚠️ SUBCATEGORÍA incorrecta para EVENTOS',
          'La subcategoría "' + valor + '" no es un evento válido.\n\n' +
          'Verifica que estés seleccionando de la lista de eventos.',
          SpreadsheetApp.getUi().ButtonSet.OK
        );
        sheet.getRange(row, 4).setValue('');
        return;
      }
    }

    // 4. Validar préstamos/devoluciones (balance cruzado)
    // v7.21: Si validación bloquea, no intentar auto-creación
    const bloqueadoNT = validarPrestamoDevolucionNT(sheet, row, valor);
    if (bloqueadoNT) return;

    // 5. v7.19: Manejar préstamos/devoluciones
    const esPrestamoODevolucion = (valor === 'Préstamo NT → Familia' || valor === 'Devolución NT → Familia');
    const eraPrestamoODevolucion = (oldValue === 'Préstamo NT → Familia' || oldValue === 'Devolución NT → Familia');

    if (esPrestamoODevolucion) {
      // Si ya tenía contraparte y cambió el tipo (préstamo↔devolución), recrear
      if (tieneContraparte && eraPrestamoODevolucion && valor !== oldValue) {
        recrearContraparte(sheet, row, NOMBRES_HOJAS.CARGA_NT);
      }
      // Si no tiene contraparte, intentar crear
      else if (!tieneContraparte) {
        intentarAutoCreacionNT(sheet, row);
      }
    }
    // Si cambió DE préstamo/devolución A otra cosa, borrar contraparte
    else if (eraPrestamoODevolucion && tieneContraparte) {
      borrarContraparte(linkId, NOMBRES_HOJAS.CARGA_NT);
      sheet.getRange(row, 9).setValue('');
      SpreadsheetApp.getActiveSpreadsheet().toast('✓ Contraparte eliminada', '🗑️ Auto', 2);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LECTURA DINÁMICA DE VARIABLES DESDE CONFIG (v7.20)
// Permite renombrar "Reserva Var." sin tocar el código
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Lee las subcategorías VARIABLES desde la hoja CONFIG dinámicamente.
 * Esto permite que el usuario renombre las "Reserva Var." en CONFIG
 * y la validación las acepte sin necesidad de modificar el código.
 *
 * Posiciones en CONFIG (escritas por escribirListaConfig en Sheets.gs):
 *   VARIABLES FAMILIA: columna 3 (C), header fila 20, items fila 21+
 *   VARIABLES NT: columna 7 (G), header fila 20, items fila 21+
 *
 * @param {string} entidad - 'FAMILIA' o 'NT'
 * @returns {string[]} Lista de subcategorías válidas
 */
function obtenerVariablesDesdeConfig(entidad) {
  const codeArray = entidad === 'FAMILIA' ? VARIABLES_FAMILIA : VARIABLES_NT;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const config = ss.getSheetByName(NOMBRES_HOJAS.CONFIG);

  if (!config) {
    return codeArray;
  }

  // VARIABLES FAMILIA: col 3, VARIABLES NT: col 7
  const col = entidad === 'FAMILIA' ? 3 : 7;
  const maxItems = 25; // v7.25: margen ampliado (19 items FAM, 15 items NT)

  const configValues = config.getRange(21, col, maxItems, 1).getValues()
    .map(function(r) { return (r[0] || '').toString().trim(); })
    .filter(function(v) { return v !== ''; });

  // v7.25: Combinar ambas fuentes (CONFIG + código) para evitar rechazos
  // cuando dropdown (del código) y CONFIG tienen diferencias sutiles
  var combined = codeArray.slice(); // copia del array del código
  for (var i = 0; i < configValues.length; i++) {
    if (combined.indexOf(configValues[i]) === -1) {
      combined.push(configValues[i]);
    }
  }

  return combined;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDACIÓN ANTI-BURRO - CONTRADICCIONES TIPO vs SUBCATEGORÍA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Valida contradicciones entre TIPO y SUBCATEGORÍA en CARGA_FAMILIA
 * v7.13: Simplificado - solo valida que TIPO ingreso no tenga SUBCAT de egreso
 * @returns {boolean} true si hubo contradicción (y se limpió la celda)
 */
function validarContradiccionTipoSubcategoriaFamilia(sheet, row, tipo, subcategoria) {
  // Cualquier TIPO de ingreso no debería tener subcategoría de egreso
  if (TODOS_TIPOS_INGRESO_FAMILIA.includes(tipo) && // v7.14: Incluye tipos auto-creados
      (subcategoria === 'Devolución Familia → NT' || subcategoria === 'Préstamo Familia → NT')) {
    SpreadsheetApp.getUi().alert(
      '⚠️ INCOHERENCIA: TIPO es INGRESO pero SUBCATEGORÍA es de EGRESO',
      'El TIPO "' + tipo + '" es un INGRESO.\n\n' +
      'La subcategoría "' + subcategoria + '" es de EGRESO.\n\n' +
      'No puedes combinar un ingreso con una subcategoría de egreso.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    sheet.getRange(row, 4).setValue('');
    return true;
  }

  return false; // No hubo contradicción
}

/**
 * Valida contradicciones entre TIPO y SUBCATEGORÍA en CARGA_NT
 * v7.13: Simplificado - solo valida que TIPO ingreso no tenga SUBCAT de egreso
 * @returns {boolean} true si hubo contradicción (y se limpió la celda)
 */
function validarContradiccionTipoSubcategoriaNT(sheet, row, tipo, subcategoria) {
  // Cualquier TIPO de ingreso no debería tener subcategoría de egreso
  if (TODOS_TIPOS_INGRESO_NT.includes(tipo) && // v7.14: Incluye tipos auto-creados
      (subcategoria === 'Devolución NT → Familia' || subcategoria === 'Préstamo NT → Familia')) {
    SpreadsheetApp.getUi().alert(
      '⚠️ INCOHERENCIA: TIPO es INGRESO pero SUBCATEGORÍA es de EGRESO',
      'El TIPO "' + tipo + '" es un INGRESO.\n\n' +
      'La subcategoría "' + subcategoria + '" es de EGRESO.\n\n' +
      'No puedes combinar un ingreso con una subcategoría de egreso.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    sheet.getRange(row, 4).setValue('');
    return true;
  }

  return false; // No hubo contradicción
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALIDACIÓN ANTI-BURRO - PRÉSTAMOS Y DEVOLUCIONES (BALANCE CRUZADO)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula cuánto debe FAMILIA a NT
 * Deuda = Préstamos que NT dio a Familia - Devoluciones que Familia hizo a NT
 */
function calcularDeudaFamiliaANT() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Préstamos que NT dio a Familia (registrados en CARGA_NT como egreso)
  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
  let prestamosNTaFamilia = 0;
  if (cargaNT) {
    const datosNT = cargaNT.getDataRange().getValues();
    for (let i = 3; i < datosNT.length; i++) {
      if (datosNT[i][3] === 'Préstamo NT → Familia') { // Columna D (índice 3)
        prestamosNTaFamilia += Number(datosNT[i][5]) || 0; // Columna F = MONTO (índice 5)
      }
    }
  }

  // Devoluciones que Familia hizo a NT (registrados en CARGA_FAMILIA como egreso)
  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
  let devolucionesFamiliaANT = 0;
  if (cargaFam) {
    const datosFam = cargaFam.getDataRange().getValues();
    for (let i = 3; i < datosFam.length; i++) {
      if (datosFam[i][3] === 'Devolución Familia → NT') { // Columna D (índice 3)
        devolucionesFamiliaANT += Number(datosFam[i][5]) || 0; // Columna F = MONTO (índice 5)
      }
    }
  }

  return prestamosNTaFamilia - devolucionesFamiliaANT;
}

/**
 * Calcula cuánto debe NT a FAMILIA
 * Deuda = Préstamos que Familia dio a NT - Devoluciones que NT hizo a Familia
 */
function calcularDeudaNTAFamilia() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Préstamos que Familia dio a NT (registrados en CARGA_FAMILIA como egreso)
  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
  let prestamosFamiliaANT = 0;
  if (cargaFam) {
    const datosFam = cargaFam.getDataRange().getValues();
    for (let i = 3; i < datosFam.length; i++) {
      if (datosFam[i][3] === 'Préstamo Familia → NT') { // Columna D (índice 3)
        prestamosFamiliaANT += Number(datosFam[i][5]) || 0; // Columna F = MONTO (índice 5)
      }
    }
  }

  // Devoluciones que NT hizo a Familia (registrados en CARGA_NT como egreso)
  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
  let devolucionesNTaFamilia = 0;
  if (cargaNT) {
    const datosNT = cargaNT.getDataRange().getValues();
    for (let i = 3; i < datosNT.length; i++) {
      if (datosNT[i][3] === 'Devolución NT → Familia') { // Columna D (índice 3)
        devolucionesNTaFamilia += Number(datosNT[i][5]) || 0; // Columna F = MONTO (índice 5)
      }
    }
  }

  return prestamosFamiliaANT - devolucionesNTaFamilia;
}

/**
 * Formatea un número en formato Guaraníes paraguayos
 */
function formatearGuaranies(monto) {
  return 'Gs. ' + monto.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Valida préstamos/devoluciones en CARGA_FAMILIA
 * - Si Familia DEBE a NT: solo puede devolver, no prestar
 * - Si Familia NO DEBE a NT: solo puede prestar, no devolver
 */
function validarPrestamoDevolucionFamilia(sheet, row, valor) {
  if (valor === 'Préstamo Familia → NT') {
    const deudaFamiliaANT = calcularDeudaFamiliaANT();
    if (deudaFamiliaANT > 0) {
      // Familia ya debe a NT, no puede prestar más
      SpreadsheetApp.getUi().alert(
        '⚠️ BLOQUEO: No puedes prestar a NT',
        'FAMILIA debe ' + formatearGuaranies(deudaFamiliaANT) + ' a NeuroTEA.\n\n' +
        'Primero debes usar "Devolución Familia → NT" para saldar la deuda.\n\n' +
        'Regla: No puedes prestar a quien ya te debe.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue(''); // Limpiar la celda
      return true; // v7.21: Indica que fue bloqueado
    }
  } else if (valor === 'Devolución Familia → NT') {
    const deudaFamiliaANT = calcularDeudaFamiliaANT();
    if (deudaFamiliaANT <= 0) {
      // Familia no debe nada a NT, no puede devolver
      SpreadsheetApp.getUi().alert(
        '⚠️ BLOQUEO: No tienes nada que devolver',
        'FAMILIA no debe nada a NeuroTEA.\n\n' +
        'No puedes registrar una devolución si no recibiste un préstamo.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue(''); // Limpiar la celda
      return true; // v7.21: Indica que fue bloqueado
    }
  }
  return false; // v7.21: No fue bloqueado, puede continuar
}

/**
 * Valida préstamos/devoluciones en CARGA_NT
 * - Si NT DEBE a Familia: solo puede devolver, no prestar
 * - Si NT NO DEBE a Familia: solo puede prestar, no devolver
 */
function validarPrestamoDevolucionNT(sheet, row, valor) {
  if (valor === 'Préstamo NT → Familia') {
    const deudaNTaFamilia = calcularDeudaNTAFamilia();
    if (deudaNTaFamilia > 0) {
      // NT ya debe a Familia, no puede prestar más
      SpreadsheetApp.getUi().alert(
        '⚠️ BLOQUEO: NT no puede prestar a Familia',
        'NeuroTEA debe ' + formatearGuaranies(deudaNTaFamilia) + ' a FAMILIA.\n\n' +
        'Primero debes usar "Devolución NT → Familia" para saldar la deuda.\n\n' +
        'Regla: No puedes prestar a quien ya te debe.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue(''); // Limpiar la celda
      return true; // v7.21: Indica que fue bloqueado
    }
  } else if (valor === 'Devolución NT → Familia') {
    const deudaNTaFamilia = calcularDeudaNTAFamilia();
    if (deudaNTaFamilia <= 0) {
      // NT no debe nada a Familia, no puede devolver
      SpreadsheetApp.getUi().alert(
        '⚠️ BLOQUEO: NT no tiene nada que devolver',
        'NeuroTEA no debe nada a FAMILIA.\n\n' +
        'No puedes registrar una devolución si no recibiste un préstamo.',
        SpreadsheetApp.getUi().ButtonSet.OK
      );
      sheet.getRange(row, 4).setValue(''); // Limpiar la celda
      return true; // v7.21: Indica que fue bloqueado
    }
  }
  return false; // v7.21: No fue bloqueado, puede continuar
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-CREACIÓN DE TRANSACCIONES CRUZADAS (PRÉSTAMOS/DEVOLUCIONES)
// v7.13 SIMPLIFICADO: Sin sistema de flags - la protección es natural
// (las filas auto-creadas tienen SUBCAT="-", no disparan más creaciones)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SISTEMA UUID - VINCULACIÓN DE TRANSACCIONES CRUZADAS (v7.12)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Genera un ID único para vincular transacciones cruzadas
 * Formato: 6 caracteres alfanuméricos (ej: A7K2M1)
 * @returns {string} ID único breve
 */
function generarLinkId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Busca la transacción contraparte por LINK_ID
 * @param {Sheet} sheet - Hoja donde buscar
 * @param {string} linkId - ID de vinculación a buscar
 * @returns {number|null} Número de fila donde está, o null si no existe
 */
function buscarContraparte(sheet, linkId) {
  if (!linkId || linkId === '') return null;

  const datos = sheet.getDataRange().getValues();
  // Columna I (índice 8) = LINK_ID
  for (let i = 3; i < datos.length; i++) {
    if (datos[i][8] === linkId) {
      return i + 1; // Retornar número de fila (1-indexed)
    }
  }
  return null;
}

/**
 * Borra la transacción contraparte vinculada por LINK_ID
 * @param {string} linkId - ID de vinculación
 * @param {string} hojaOrigen - Nombre de la hoja donde se originó el borrado
 * @returns {boolean} true si se borró correctamente
 */
function borrarContraparte(linkId, hojaOrigen) {
  if (!linkId || linkId === '') return false;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Determinar hoja destino (la contraria)
  const nombreHojaDestino = hojaOrigen === NOMBRES_HOJAS.CARGA_FAMILIA
    ? NOMBRES_HOJAS.CARGA_NT
    : NOMBRES_HOJAS.CARGA_FAMILIA;

  const hojaDestino = ss.getSheetByName(nombreHojaDestino);
  if (!hojaDestino) return false;

  const filaContraparte = buscarContraparte(hojaDestino, linkId);
  if (!filaContraparte) return false;

  try {
    // Borrar la fila completa de la contraparte
    hojaDestino.deleteRow(filaContraparte);
    ss.toast('✓ Borrada contraparte en ' + nombreHojaDestino, '🔄 Auto-borrado', 3);
    return true;
  } catch (error) {
    ss.toast('❌ Error al borrar contraparte: ' + error.message, 'Error', 5);
    return false;
  }
}

/**
 * Verifica si una transacción tiene LINK_ID (es parte de par cruzado)
 * @param {Sheet} sheet - Hoja
 * @param {number} row - Fila a verificar
 * @returns {string|null} LINK_ID si existe, null si no
 */
function obtenerLinkId(sheet, row) {
  const valor = sheet.getRange(row, 9).getValue(); // Columna I
  return (valor && valor !== '' && String(valor).length === 6) ? String(valor) : null;
}

/**
 * v7.19: Sincroniza cambios en la transacción contraparte
 * Puede actualizar: FECHA (col 1), MONTO (col 6), CUENTA (col 7)
 * @param {string} linkId - ID de vinculación
 * @param {string} hojaOrigen - Nombre de la hoja origen
 * @param {number} columna - Columna a actualizar (1=FECHA, 6=MONTO, 7=CUENTA)
 * @param {any} nuevoValor - Nuevo valor
 * @returns {boolean} true si se actualizó correctamente
 */
function sincronizarContraparte(linkId, hojaOrigen, columna, nuevoValor) {
  if (!linkId || linkId === '') return false;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const nombreHojaDestino = hojaOrigen === NOMBRES_HOJAS.CARGA_FAMILIA
    ? NOMBRES_HOJAS.CARGA_NT
    : NOMBRES_HOJAS.CARGA_FAMILIA;

  const hojaDestino = ss.getSheetByName(nombreHojaDestino);
  if (!hojaDestino) return false;

  const filaContraparte = buscarContraparte(hojaDestino, linkId);
  if (!filaContraparte) return false;

  try {
    hojaDestino.getRange(filaContraparte, columna).setValue(nuevoValor);

    // Aplicar formato de fecha si es columna A
    if (columna === 1) {
      hojaDestino.getRange(filaContraparte, 1).setNumberFormat('dd/mm/yyyy');
    }

    const nombreCampo = columna === 1 ? 'fecha' : (columna === 6 ? 'monto' : 'cuenta');
    ss.toast('✓ Sincronizado ' + nombreCampo + ' en ' + nombreHojaDestino, '🔄 Auto', 2);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * v7.19: Borra contraparte y recrea cuando cambia el tipo de transacción
 * (ej: de Préstamo a Devolución)
 */
function recrearContraparte(sheet, row, hojaOrigen) {
  const linkId = obtenerLinkId(sheet, row);
  if (linkId) {
    // Borrar la contraparte vieja
    borrarContraparte(linkId, hojaOrigen);
    // Limpiar el LINK_ID de la fila original
    sheet.getRange(row, 9).setValue('');
  }

  // Crear nueva contraparte
  if (hojaOrigen === NOMBRES_HOJAS.CARGA_FAMILIA) {
    intentarAutoCreacionFamilia(sheet, row);
  } else {
    intentarAutoCreacionNT(sheet, row);
  }
}

// Mantener compatibilidad con código existente
function actualizarMontoContraparte(linkId, hojaOrigen, nuevoMonto) {
  return sincronizarContraparte(linkId, hojaOrigen, 6, nuevoMonto);
}

/**
 * Encuentra la primera fila vacía en una hoja (desde fila 4)
 * v7.31: Escanea columna A (FECHA) en lugar de getLastRow()
 * porque getLastRow() se confunde con ARRAYFORMULA en columna J (VÁLIDO)
 * que extiende resultados hasta fila 500, retornando 500 en vez del último dato real.
 */
function encontrarPrimeraFilaVacia(sheet) {
  var fechas = sheet.getRange('A4:A500').getValues();
  for (var i = 0; i < fechas.length; i++) {
    if (!fechas[i][0] || fechas[i][0] === '') {
      return i + 4;
    }
  }
  return 504; // Si todas las 497 filas tienen datos
}

/**
 * Verifica si ya existe una transacción cruzada para evitar duplicados
 * v7.10 - Mejorado: verifica por descripción además de monto
 * @param {Sheet} sheet - Hoja donde buscar
 * @param {Date} fecha - Fecha de la transacción
 * @param {string} tipoOSubcat - Tipo o subcategoría a buscar
 * @param {number} monto - Monto de la transacción
 * @param {string} campo - 'tipo' o 'subcategoria' para indicar qué columna buscar
 * @param {string} descripcion - Descripción de la transacción (opcional)
 * @returns {boolean} true si ya existe
 */
function existeTransaccionCruzada(sheet, fecha, tipoOSubcat, monto, campo, descripcion) {
  const datos = sheet.getDataRange().getValues();
  const colBusqueda = campo === 'tipo' ? 1 : 3; // B=TIPO, D=SUBCATEGORÍA

  // Normalizar fecha a solo día/mes/año para comparación
  const fechaBuscar = fecha instanceof Date ?
    new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()).getTime() : null;

  if (!fechaBuscar) return false;

  // Normalizar descripción para comparación
  const descripNorm = String(descripcion || '').toLowerCase().trim();

  for (let i = 3; i < datos.length; i++) {
    const fila = datos[i];
    const fechaFila = fila[0];
    const valorColumna = fila[colBusqueda];
    const descripFila = String(fila[4] || '').toLowerCase().trim();
    const montoFila = Number(fila[5]) || 0;

    // Verificar si la fecha es válida
    if (!(fechaFila instanceof Date)) continue;

    const fechaFilaNorm = new Date(fechaFila.getFullYear(), fechaFila.getMonth(), fechaFila.getDate()).getTime();

    // Condición 1: Mismo fecha + tipo/subcat + monto (con tolerancia de 1)
    const coincidePorMonto = (fechaFilaNorm === fechaBuscar &&
                              valorColumna === tipoOSubcat &&
                              Math.abs(montoFila - monto) < 1);

    // Condición 2: Mismo fecha + tipo/subcat + descripción similar (v7.10)
    // Esto evita duplicados cuando el usuario edita el monto después
    const coincidePorDescripcion = (descripNorm.length >= 5 &&
                                     fechaFilaNorm === fechaBuscar &&
                                     valorColumna === tipoOSubcat &&
                                     descripFila.includes(descripNorm.substring(0, 10)));

    if (coincidePorMonto || coincidePorDescripcion) {
      return true; // Ya existe
    }
  }
  return false;
}

/**
 * Aplica formato de fecha dd/mm/yyyy a una celda
 * @param {Sheet} sheet - Hoja
 * @param {number} fila - Número de fila
 */
function aplicarFormatoFecha(sheet, fila) {
  sheet.getRange(fila, 1).setNumberFormat('dd/mm/yyyy');
}

/**
 * Limpia un valor numérico que puede venir con formato paraguayo (puntos como miles)
 * @param {any} valor - El valor a limpiar
 * @returns {number} El número limpio
 */
function limpiarMonto(valor) {
  if (typeof valor === 'number') return valor;
  if (!valor) return 0;
  // Remover puntos (separador de miles) y reemplazar coma por punto (decimal)
  const limpio = String(valor).replace(/\./g, '').replace(',', '.');
  return Number(limpio) || 0;
}

/**
 * v7.18: Verifica que TODOS los campos requeridos estén completos antes de auto-crear
 * Campos requeridos: FECHA, TIPO, CATEGORÍA, SUBCATEGORÍA, MONTO, CUENTA
 * Campos opcionales: DESCRIPCIÓN, NOTAS
 */
function intentarAutoCreacionFamilia(sheet, row) {
  const datos = sheet.getRange(row, 1, 1, 9).getValues()[0];

  // Leer todos los campos
  const fecha = datos[0];
  const tipo = String(datos[1] || '').trim();
  const categoria = String(datos[2] || '').trim();
  const subcategoria = String(datos[3] || '').trim();
  const monto = limpiarMonto(datos[5]);
  const cuenta = String(datos[6] || '').trim();
  const linkId = String(datos[8] || '').trim();

  // Si ya tiene LINK_ID, no hacer nada (ya fue auto-creada)
  if (linkId && linkId.length === 6) {
    console.log('INTENTAR-FAM: Ya tiene LINK_ID=' + linkId + ', saliendo');
    return;
  }

  // Verificar que sea un préstamo/devolución
  const esPrestamoFamNT = subcategoria === 'Préstamo Familia → NT';
  const esDevolucionFamNT = subcategoria === 'Devolución Familia → NT';
  if (!esPrestamoFamNT && !esDevolucionFamNT) return; // Silencioso - no es préstamo/devolución

  // Verificar TODOS los campos requeridos
  const fechaValida = fecha && (fecha instanceof Date || (typeof fecha === 'string' && fecha.includes('/')));
  const tipoValido = tipo === 'Egreso Familiar';
  const categoriaValida = categoria === 'VARIABLES';
  const montoValido = monto >= 10000;
  const cuentaValida = cuenta && cuenta !== '-' && cuenta !== '';

  // v7.31: Log diagnóstico para detectar campos faltantes
  if (!fechaValida || !tipoValido || !categoriaValida || !montoValido || !cuentaValida) {
    console.log('INTENTAR-FAM fila ' + row + ': Campos faltantes → fecha=' + fechaValida +
      ' tipo=' + tipoValido + '(' + tipo + ')' +
      ' cat=' + categoriaValida + '(' + categoria + ')' +
      ' subcat=' + subcategoria +
      ' monto=' + montoValido + '(' + monto + ')' +
      ' cuenta=' + cuentaValida + '(' + cuenta + ')');
    return;
  }

  // ¡Todos los campos completos! Disparar auto-creación
  console.log('INTENTAR-FAM fila ' + row + ': ¡TODOS los campos OK! Disparando auto-creación');
  autoCrearTransaccionCruzadaFamilia(sheet, row);
}

/**
 * v7.18: Verifica que TODOS los campos requeridos estén completos antes de auto-crear (NT)
 */
function intentarAutoCreacionNT(sheet, row) {
  const datos = sheet.getRange(row, 1, 1, 9).getValues()[0];

  // Leer todos los campos
  const fecha = datos[0];
  const tipo = String(datos[1] || '').trim();
  const categoria = String(datos[2] || '').trim();
  const subcategoria = String(datos[3] || '').trim();
  const monto = limpiarMonto(datos[5]);
  const cuenta = String(datos[6] || '').trim();
  const linkId = String(datos[8] || '').trim();

  // Si ya tiene LINK_ID, no hacer nada (ya fue auto-creada)
  if (linkId && linkId.length === 6) {
    console.log('INTENTAR-NT: Ya tiene LINK_ID=' + linkId + ', saliendo');
    return;
  }

  // Verificar que sea un préstamo/devolución
  const esPrestamoNTFam = subcategoria === 'Préstamo NT → Familia';
  const esDevolucionNTFam = subcategoria === 'Devolución NT → Familia';
  if (!esPrestamoNTFam && !esDevolucionNTFam) return; // Silencioso - no es préstamo/devolución

  // Verificar TODOS los campos requeridos
  const fechaValida = fecha && (fecha instanceof Date || (typeof fecha === 'string' && fecha.includes('/')));
  const tipoValido = tipo === 'Egreso NT';
  const categoriaValida = categoria === 'VARIABLES';
  const montoValido = monto >= 10000;
  const cuentaValida = cuenta && cuenta !== '-' && cuenta !== '';

  // v7.31: Log diagnóstico para detectar campos faltantes
  if (!fechaValida || !tipoValido || !categoriaValida || !montoValido || !cuentaValida) {
    console.log('INTENTAR-NT fila ' + row + ': Campos faltantes → fecha=' + fechaValida +
      ' tipo=' + tipoValido + '(' + tipo + ')' +
      ' cat=' + categoriaValida + '(' + categoria + ')' +
      ' subcat=' + subcategoria +
      ' monto=' + montoValido + '(' + monto + ')' +
      ' cuenta=' + cuentaValida + '(' + cuenta + ')');
    return;
  }

  // ¡Todos los campos completos! Disparar auto-creación
  console.log('INTENTAR-NT fila ' + row + ': ¡TODOS los campos OK! Disparando auto-creación');
  autoCrearTransaccionCruzadaNT(sheet, row);
}

/**
 * Auto-crea transacción en CARGA_NT cuando FAM registra préstamo/devolución
 * v7.15 - Con logging para debugging
 */
function autoCrearTransaccionCruzadaFamilia(sheet, row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    const datos = sheet.getRange(row, 1, 1, 9).getValues()[0];

    let fecha = datos[0];
    const subcategoria = String(datos[3] || '').trim();
    const montoRaw = datos[5];
    const monto = limpiarMonto(montoRaw);
    const linkIdExistente = String(datos[8] || '').trim();

    // LOG: Ver qué datos estamos leyendo
    console.log('AUTO-FAM: fecha=' + fecha + ', subcat=' + subcategoria + ', montoRaw=' + montoRaw + ', monto=' + monto);

    // Convertir fecha si es string (dd/mm/yyyy)
    if (typeof fecha === 'string' && fecha) {
      const p = fecha.split('/');
      if (p.length === 3) fecha = new Date(p[2], p[1] - 1, p[0]);
    }

    if (!fecha || !(fecha instanceof Date) || isNaN(fecha.getTime())) {
      console.log('AUTO-FAM: Fecha inválida, saliendo');
      return;
    }
    if (!monto || monto < 10000) {
      console.log('AUTO-FAM: Monto inválido (' + monto + '), saliendo');
      return;
    }

    // Solo procesar préstamos/devoluciones
    const esPrestamoFamNT = subcategoria === 'Préstamo Familia → NT';
    const esDevolucionFamNT = subcategoria === 'Devolución Familia → NT';

    if (!esPrestamoFamNT && !esDevolucionFamNT) {
      console.log('AUTO-FAM: Subcategoría no es préstamo/devolución: "' + subcategoria + '"');
      return;
    }

    const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);
    if (!cargaNT) {
      console.log('AUTO-FAM: No se encontró hoja CARGA_NT');
      return;
    }

    // Si ya tiene LINK_ID, actualizar monto en vez de crear nueva
    if (linkIdExistente && linkIdExistente.length === 6) {
      console.log('AUTO-FAM: Ya tiene LINK_ID, actualizando monto');
      if (actualizarMontoContraparte(linkIdExistente, NOMBRES_HOJAS.CARGA_FAMILIA, monto)) return;
    }

    // Determinar tipo de ingreso y descripción
    const tipoIngreso = esPrestamoFamNT ? 'Préstamo Familia' : 'Devolución Familia → NT';
    const descripcion = esPrestamoFamNT ? 'Auto: "Recibido de FAMILIA"' : 'Auto: "Devolución de FAMILIA"';

    // Verificar si ya existe
    if (existeTransaccionCruzada(cargaNT, fecha, tipoIngreso, monto, 'tipo', '')) {
      console.log('AUTO-FAM: Ya existe transacción cruzada, saliendo');
      return;
    }

    // Crear transacción en NT con cuenta por defecto
    const linkId = generarLinkId();
    const filaDestino = encontrarPrimeraFilaVacia(cargaNT);

    console.log('AUTO-FAM: Creando en fila ' + filaDestino + ' con linkId=' + linkId);

    cargaNT.getRange(filaDestino, 1, 1, 9).setValues([[
      fecha, tipoIngreso, '-', '-', descripcion, monto, 'Atlas NeuroTEA', '', linkId
    ]]);
    aplicarFormatoFecha(cargaNT, filaDestino);
    // v7.22: Limpiar validaciones de CATEGORÍA y SUBCATEGORÍA para ingresos auto-creados
    cargaNT.getRange(filaDestino, 3).clearDataValidations();
    cargaNT.getRange(filaDestino, 4).clearDataValidations();

    // Guardar LINK_ID en fila original
    sheet.getRange(row, 9).setValue(linkId);

    ss.toast('✓ Creado en CARGA_NT: ' + tipoIngreso, '🔄 Auto', 3);
    console.log('AUTO-FAM: ¡Éxito! Creado ' + tipoIngreso);

  } catch (error) {
    console.log('AUTO-FAM ERROR: ' + error.message);
    ss.toast('❌ Error auto-creación: ' + error.message, 'Error', 5);
  }
}

/**
 * Auto-crea transacción en CARGA_FAMILIA cuando NT registra préstamo/devolución
 * v7.15 - Con logging para debugging
 */
function autoCrearTransaccionCruzadaNT(sheet, row) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    const datos = sheet.getRange(row, 1, 1, 9).getValues()[0];

    let fecha = datos[0];
    const subcategoria = String(datos[3] || '').trim();
    const montoRaw = datos[5];
    const monto = limpiarMonto(montoRaw);
    const linkIdExistente = String(datos[8] || '').trim();

    // LOG: Ver qué datos estamos leyendo
    console.log('AUTO-NT: fecha=' + fecha + ', subcat=' + subcategoria + ', montoRaw=' + montoRaw + ', monto=' + monto);

    // Convertir fecha si es string (dd/mm/yyyy)
    if (typeof fecha === 'string' && fecha) {
      const p = fecha.split('/');
      if (p.length === 3) fecha = new Date(p[2], p[1] - 1, p[0]);
    }

    if (!fecha || !(fecha instanceof Date) || isNaN(fecha.getTime())) {
      console.log('AUTO-NT: Fecha inválida, saliendo');
      return;
    }
    if (!monto || monto < 10000) {
      console.log('AUTO-NT: Monto inválido (' + monto + '), saliendo');
      return;
    }

    // Solo procesar préstamos/devoluciones
    const esPrestamoNTFam = subcategoria === 'Préstamo NT → Familia';
    const esDevolucionNTFam = subcategoria === 'Devolución NT → Familia';

    if (!esPrestamoNTFam && !esDevolucionNTFam) {
      console.log('AUTO-NT: Subcategoría no es préstamo/devolución: "' + subcategoria + '"');
      return;
    }

    const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
    if (!cargaFam) {
      console.log('AUTO-NT: No se encontró hoja CARGA_FAMILIA');
      return;
    }

    // Si ya tiene LINK_ID, actualizar monto en vez de crear nueva
    if (linkIdExistente && linkIdExistente.length === 6) {
      console.log('AUTO-NT: Ya tiene LINK_ID, actualizando monto');
      if (actualizarMontoContraparte(linkIdExistente, NOMBRES_HOJAS.CARGA_NT, monto)) return;
    }

    // Determinar tipo de ingreso y descripción
    const tipoIngreso = esPrestamoNTFam ? 'Préstamo NeuroTEA' : 'Devolución NeuroTEA';
    const descripcion = esPrestamoNTFam ? 'Auto: "Recibido de NEUROTEA"' : 'Auto: "Devolución de NEUROTEA"';

    // Verificar si ya existe
    if (existeTransaccionCruzada(cargaFam, fecha, tipoIngreso, monto, 'tipo', '')) {
      console.log('AUTO-NT: Ya existe transacción cruzada, saliendo');
      return;
    }

    // Crear transacción en FAMILIA con cuenta por defecto
    const linkId = generarLinkId();
    const filaDestino = encontrarPrimeraFilaVacia(cargaFam);

    console.log('AUTO-NT: Creando en fila ' + filaDestino + ' con linkId=' + linkId);

    cargaFam.getRange(filaDestino, 1, 1, 9).setValues([[
      fecha, tipoIngreso, '-', '-', descripcion, monto, 'ITAU Marco', '', linkId
    ]]);
    aplicarFormatoFecha(cargaFam, filaDestino);
    // v7.22: Limpiar validaciones de CATEGORÍA y SUBCATEGORÍA para ingresos auto-creados
    cargaFam.getRange(filaDestino, 3).clearDataValidations();
    cargaFam.getRange(filaDestino, 4).clearDataValidations();

    // Guardar LINK_ID en fila original
    sheet.getRange(row, 9).setValue(linkId);

    ss.toast('✓ Creado en CARGA_FAMILIA: ' + tipoIngreso, '🔄 Auto', 3);
    console.log('AUTO-NT: ¡Éxito! Creado ' + tipoIngreso);

  } catch (error) {
    console.log('AUTO-NT ERROR: ' + error.message);
    ss.toast('❌ Error auto-creación: ' + error.message, 'Error', 5);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIMPIEZA DE CONTRAPARTES HUÉRFANAS (v7.21)
// Detecta LINK_IDs que existen en una hoja pero no en la otra y los elimina
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Handler para trigger onChange (instalable).
 * Se dispara cuando hay cambios estructurales (insertar/eliminar filas).
 * Solo actúa en REMOVE_ROW para limpiar contrapartes huérfanas.
 */
function onChangeHandler(e) {
  if (!e || e.changeType !== 'REMOVE_ROW') return;
  limpiarContrapartesHuerfanas();
}

/**
 * Escanea CARGA_FAMILIA y CARGA_NT buscando LINK_IDs huérfanos.
 * Un LINK_ID es huérfano si existe en una hoja pero no en la otra.
 * Los elimina automáticamente y notifica al usuario.
 * Se puede ejecutar manualmente desde el menú o automáticamente via onChange.
 */
function limpiarContrapartesHuerfanas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cargaFam = ss.getSheetByName(NOMBRES_HOJAS.CARGA_FAMILIA);
  const cargaNT = ss.getSheetByName(NOMBRES_HOJAS.CARGA_NT);

  if (!cargaFam || !cargaNT) return;

  // Recoger todos los LINK_IDs de cada hoja
  const linkIdsFam = obtenerLinkIds(cargaFam);
  const linkIdsNT = obtenerLinkIds(cargaNT);

  let huerfanasEliminadas = 0;

  // Buscar huérfanas en CARGA_FAMILIA (LINK_ID existe en FAM pero no en NT)
  const huerfanasFam = linkIdsFam.filter(function(item) {
    return !linkIdsNT.some(function(nt) { return nt.linkId === item.linkId; });
  });

  // Buscar huérfanas en CARGA_NT (LINK_ID existe en NT pero no en FAM)
  const huerfanasNT = linkIdsNT.filter(function(item) {
    return !linkIdsFam.some(function(fam) { return fam.linkId === item.linkId; });
  });

  // Eliminar huérfanas de CARGA_FAMILIA (de abajo hacia arriba para no desplazar filas)
  huerfanasFam.sort(function(a, b) { return b.fila - a.fila; });
  for (var i = 0; i < huerfanasFam.length; i++) {
    cargaFam.deleteRow(huerfanasFam[i].fila);
    huerfanasEliminadas++;
    console.log('HUÉRFANA: Eliminada fila ' + huerfanasFam[i].fila + ' de CARGA_FAMILIA (LINK_ID: ' + huerfanasFam[i].linkId + ')');
  }

  // Eliminar huérfanas de CARGA_NT (de abajo hacia arriba)
  huerfanasNT.sort(function(a, b) { return b.fila - a.fila; });
  for (var j = 0; j < huerfanasNT.length; j++) {
    cargaNT.deleteRow(huerfanasNT[j].fila);
    huerfanasEliminadas++;
    console.log('HUÉRFANA: Eliminada fila ' + huerfanasNT[j].fila + ' de CARGA_NT (LINK_ID: ' + huerfanasNT[j].linkId + ')');
  }

  // Notificar resultado
  if (huerfanasEliminadas > 0) {
    ss.toast('✓ Eliminadas ' + huerfanasEliminadas + ' contraparte(s) huérfana(s)', '🧹 Auto-limpieza', 4);
  }
}

/**
 * Obtiene todos los LINK_IDs válidos de una hoja CARGA.
 * @param {Sheet} sheet - Hoja CARGA_FAMILIA o CARGA_NT
 * @returns {Array<{linkId: string, fila: number}>} Lista de LINK_IDs con su fila
 */
function obtenerLinkIds(sheet) {
  const datos = sheet.getDataRange().getValues();
  var resultado = [];
  for (var i = 3; i < datos.length; i++) {
    var linkId = String(datos[i][8] || '').trim();
    if (linkId && linkId.length === 6) {
      resultado.push({ linkId: linkId, fila: i + 1 });
    }
  }
  return resultado;
}

/**
 * Instala el trigger onChange para auto-limpiar contrapartes huérfanas.
 * Solo necesita ejecutarse UNA VEZ. Si ya existe, no crea duplicado.
 */
function instalarTriggerOnChange() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Verificar si ya existe
  const triggers = ScriptApp.getUserTriggers(ss);
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'onChangeHandler') {
      ss.toast('⚡ El trigger ya está instalado', 'Info', 3);
      return;
    }
  }

  // Instalar trigger
  ScriptApp.newTrigger('onChangeHandler')
    .forSpreadsheet(ss)
    .onChange()
    .create();

  ss.toast('✓ Trigger onChange instalado. Las contrapartes huérfanas se eliminarán automáticamente.', '⚡ Instalado', 5);
}
