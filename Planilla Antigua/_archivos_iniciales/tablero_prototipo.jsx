import React, { useState } from 'react';

const TableroControlFinanciero = () => {
  const [mesSeleccionado, setMesSeleccionado] = useState('Enero 2026');
  
  const meses = ['Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026'];
  
  // Datos ficticios para el prototipo
  const datosFamilia = {
    cuentas: [
      { nombre: 'ITAU Marco', esperado: 2500000, real: 2350000 },
      { nombre: 'Coop. Univ. Marco', esperado: 1200000, real: 1200000 },
      { nombre: 'ITAU Clara', esperado: 800000, real: 650000 },
      { nombre: 'UENO Clara', esperado: 500000, real: 520000 },
      { nombre: 'Tarjeta Solar', esperado: -1500000, real: -1800000 },
      { nombre: 'Tarjeta ITAU Clara', esperado: -800000, real: -950000 },
      { nombre: 'Gourmed', esperado: 350000, real: 280000 },
    ],
    presupuesto: [
      { categoria: '► INGRESOS FAMILIA', presupuestado: 15200000, real: 14500000 },
      { categoria: '► GASTOS FIJOS', presupuestado: 7250000, real: 7100000 },
      { categoria: '► CUOTAS Y PRÉSTAMOS', presupuestado: 5541000, real: 5541000 },
      { categoria: '► OBLIGACIONES LEGALES', presupuestado: 450000, real: 380000 },
      { categoria: '► SUSCRIPCIONES', presupuestado: 520000, real: 520000 },
      { categoria: '► VARIABLES', presupuestado: 900000, real: 1250000 },
      { categoria: '► AHORRO', presupuestado: 500000, real: 0 },
    ],
    flujo: { ingresos: 14500000, egresosPagados: 12450000, egresosPendientes: 2341000 },
    liquidez: {
      cajaDisponible: 2350000,
      atrasados: { cantidad: 2, monto: 850000 },
      estaSemana: { cantidad: 4, monto: 2100000 },
      proximaSemana: { cantidad: 3, monto: 1800000 },
      terceraSemana: { cantidad: 2, monto: 1200000 },
    }
  };
  
  const datosNeuroTEA = {
    cuentas: [
      { nombre: 'Atlas NeuroTEA', saldo: 8500000 },
      { nombre: 'Costos Operativos', asignado: 25110000, usado: 22800000 },
      { nombre: 'Utilidad del Dueño', meta: 700000, real: 580000 },
      { nombre: 'Fondo Emergencia', meta: 700000, real: 700000 },
      { nombre: 'Fondo Inversión', meta: 700000, real: 420000 },
    ],
    indicadores: {
      ingresosMes: 30000000,
      gastosMes: 27300000,
      gananciaReal: 2700000,
      gananciaEsperada: 2100000, // 7%
      porcentajeGastos: 91,
      metaGastos: 93,
    },
    presupuesto: [
      { categoria: '► INGRESOS NT', presupuestado: 30000000, real: 30000000 },
      { categoria: '► CLÍNICA', presupuestado: 17630000, real: 17630000 },
      { categoria: '► SUELDOS Y HONORARIOS', presupuestado: 9600000, real: 9300000 },
      { categoria: '► TELEFONÍA E INTERNET', presupuestado: 550000, real: 550000 },
      { categoria: '► OBLIGACIONES LEGALES', presupuestado: 2300000, real: 1850000 },
      { categoria: '► EVENTOS', presupuestado: 0, real: 0 },
      { categoria: '► VARIABLES', presupuestado: 450000, real: 670000 },
      { categoria: '► GANANCIA (7%)', presupuestado: 2100000, real: 2700000 },
    ],
    flujo: { ingresos: 30000000, egresosPagados: 24500000, egresosPendientes: 2800000 },
    liquidez: {
      cajaDisponible: 8500000,
      atrasados: { cantidad: 0, monto: 0 },
      estaSemana: { cantidad: 2, monto: 4130000 },
      proximaSemana: { cantidad: 3, monto: 2300000 },
      terceraSemana: { cantidad: 1, monto: 500000 },
    }
  };
  
  const datosGlobales = {
    prestamosNTaFam: { mes: 3000000, acumulado: 8500000 },
    devolucionesFamaaNT: { mes: 0, acumulado: 2000000 },
    saldoNeto: { mes: 3000000, acumulado: 6500000 },
  };

  const formatGs = (num) => {
    if (num === 0) return '-';
    return new Intl.NumberFormat('es-PY').format(num);
  };
  
  const getStatusColor = (real, presupuestado, esIngreso = false) => {
    if (esIngreso) {
      if (real >= presupuestado) return 'bg-green-100 text-green-800';
      if (real >= presupuestado * 0.9) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    } else {
      if (real <= presupuestado) return 'bg-green-100 text-green-800';
      if (real <= presupuestado * 1.1) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    }
  };
  
  const getDiffColor = (diff) => {
    if (diff > 0) return 'text-green-600';
    if (diff < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-4 rounded-t-lg mb-0">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">📊 TABLERO DE CONTROL FINANCIERO</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-200">Mes:</span>
              <select 
                value={mesSeleccionado} 
                onChange={(e) => setMesSeleccionado(e.target.value)}
                className="bg-white text-blue-800 px-3 py-1 rounded font-semibold"
              >
                {meses.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="text-blue-200">
              Hoy: <span className="text-white font-semibold">29/12/2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL - DOS COLUMNAS */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COLUMNA IZQUIERDA: FAMILIA */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="bg-emerald-700 text-white text-center py-2 rounded-t-lg font-bold text-lg">
            🏠 FAMILIA
          </div>
          
          {/* CUENTAS FAMILIA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-emerald-700 border-b pb-2 mb-3">💰 SALDOS EN CUENTAS</h3>
            <table className="w-full text-sm">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="text-left p-2">Cuenta</th>
                  <th className="text-right p-2">Esperado</th>
                  <th className="text-right p-2">Real ✏️</th>
                  <th className="text-right p-2">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {datosFamilia.cuentas.map((c, i) => {
                  const diff = c.real - c.esperado;
                  return (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">{c.nombre}</td>
                      <td className="text-right p-2 text-gray-600">{formatGs(c.esperado)}</td>
                      <td className="text-right p-2 font-semibold text-blue-600">{formatGs(c.real)}</td>
                      <td className={`text-right p-2 font-semibold ${getDiffColor(diff)}`}>
                        {diff > 0 ? '+' : ''}{formatGs(diff)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">✏️ = Ingreso manual</p>
          </div>
          
          {/* PRESUPUESTO VS REAL FAMILIA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-emerald-700 border-b pb-2 mb-3">📋 PRESUPUESTO vs REAL</h3>
            <table className="w-full text-sm">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="text-left p-2">Categoría</th>
                  <th className="text-right p-2">Presupuesto</th>
                  <th className="text-right p-2">Real</th>
                  <th className="text-center p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {datosFamilia.presupuesto.map((p, i) => {
                  const esIngreso = p.categoria.includes('INGRESO');
                  const status = getStatusColor(p.real, p.presupuestado, esIngreso);
                  const pct = ((p.real / p.presupuestado) * 100).toFixed(0);
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-2 font-medium">{p.categoria}</td>
                      <td className="text-right p-2">{formatGs(p.presupuestado)}</td>
                      <td className="text-right p-2">{formatGs(p.real)}</td>
                      <td className="text-center p-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${status}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-emerald-100 font-bold">
                <tr>
                  <td className="p-2">BALANCE FAMILIA</td>
                  <td className="text-right p-2">{formatGs(39000)}</td>
                  <td className="text-right p-2 text-red-600">{formatGs(-291000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">DÉFICIT</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* FLUJO DEL MES FAMILIA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-emerald-700 border-b pb-2 mb-3">💵 FLUJO DEL MES</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span>Ingresos</span>
                <span className="font-bold text-green-600">+ {formatGs(datosFamilia.flujo.ingresos)}</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>Egresos Pagados</span>
                <span className="font-bold text-red-600">- {formatGs(datosFamilia.flujo.egresosPagados)}</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span>Egresos Pendientes</span>
                <span className="font-bold text-yellow-700">- {formatGs(datosFamilia.flujo.egresosPendientes)}</span>
              </div>
              <div className="flex justify-between p-3 bg-emerald-700 text-white rounded font-bold">
                <span>BALANCE</span>
                <span>{formatGs(datosFamilia.flujo.ingresos - datosFamilia.flujo.egresosPagados)}</span>
              </div>
            </div>
          </div>
          
          {/* LIQUIDEZ FAMILIA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-emerald-700 border-b pb-2 mb-3">📅 LIQUIDEZ - PRÓXIMOS PAGOS</h3>
            <table className="w-full text-sm">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="text-left p-2">Concepto</th>
                  <th className="text-center p-2">Cuotas</th>
                  <th className="text-right p-2">Monto</th>
                  <th className="text-right p-2">Saldo</th>
                  <th className="text-center p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-emerald-50">
                  <td className="p-2 font-semibold">Caja disponible</td>
                  <td className="text-center p-2">-</td>
                  <td className="text-right p-2">-</td>
                  <td className="text-right p-2 font-bold">{formatGs(datosFamilia.liquidez.cajaDisponible)}</td>
                  <td className="text-center p-2">-</td>
                </tr>
                <tr className="bg-red-50">
                  <td className="p-2 text-red-700">⚠️ Atrasados</td>
                  <td className="text-center p-2 font-bold text-red-700">{datosFamilia.liquidez.atrasados.cantidad}</td>
                  <td className="text-right p-2 text-red-700">-{formatGs(datosFamilia.liquidez.atrasados.monto)}</td>
                  <td className="text-right p-2 font-bold">{formatGs(datosFamilia.liquidez.cajaDisponible - datosFamilia.liquidez.atrasados.monto)}</td>
                  <td className="text-center p-2">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">PAGAR</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Esta semana</td>
                  <td className="text-center p-2 font-semibold">{datosFamilia.liquidez.estaSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(datosFamilia.liquidez.estaSemana.monto)}</td>
                  <td className="text-right p-2 font-bold text-red-600">{formatGs(datosFamilia.liquidez.cajaDisponible - datosFamilia.liquidez.atrasados.monto - datosFamilia.liquidez.estaSemana.monto)}</td>
                  <td className="text-center p-2">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">FALTA</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Próxima semana</td>
                  <td className="text-center p-2 font-semibold">{datosFamilia.liquidez.proximaSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(datosFamilia.liquidez.proximaSemana.monto)}</td>
                  <td className="text-right p-2 font-bold text-red-600">{formatGs(-2400000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">FALTA</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">3ra semana</td>
                  <td className="text-center p-2 font-semibold">{datosFamilia.liquidez.terceraSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(datosFamilia.liquidez.terceraSemana.monto)}</td>
                  <td className="text-right p-2 font-bold text-red-600">{formatGs(-3600000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">FALTA</span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="font-bold">
                  <td className="p-2">SALDO FINAL</td>
                  <td className="text-center p-2">{datosFamilia.liquidez.atrasados.cantidad + datosFamilia.liquidez.estaSemana.cantidad + datosFamilia.liquidez.proximaSemana.cantidad + datosFamilia.liquidez.terceraSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(5950000)}</td>
                  <td className="text-right p-2 text-red-600">{formatGs(-3600000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">DÉFICIT</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* GRÁFICO TORTA FAMILIA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-emerald-700 border-b pb-2 mb-3">📊 DISTRIBUCIÓN DE GASTOS</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Simulación de torta */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#059669" strokeWidth="20" strokeDasharray="75 25" strokeDashoffset="25"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="50 50" strokeDashoffset="-50"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="30 70" strokeDashoffset="-100"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="20" strokeDasharray="20 80" strokeDashoffset="-130"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="20" strokeDasharray="15 85" strokeDashoffset="-150"/>
                </svg>
              </div>
              <div className="ml-4 text-sm space-y-1">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-600 rounded"></div> Gastos Fijos 48%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sky-500 rounded"></div> Cuotas/Préstamos 37%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded"></div> Variables 8%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded"></div> Suscripciones 4%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-violet-500 rounded"></div> Obligaciones 3%</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* COLUMNA DERECHA: NEUROTEA */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="space-y-4">
          <div className="bg-blue-700 text-white text-center py-2 rounded-t-lg font-bold text-lg">
            🏥 NEUROTEA
          </div>
          
          {/* INDICADORES DE METAS NT */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">🎯 INDICADORES DE METAS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-blue-600 uppercase">Ingresos del Mes</div>
                <div className="text-xl font-bold text-blue-800">{formatGs(datosNeuroTEA.indicadores.ingresosMes)}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600 uppercase">Gastos del Mes</div>
                <div className="text-xl font-bold text-gray-800">{formatGs(datosNeuroTEA.indicadores.gastosMes)}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-green-600 uppercase">Ganancia Real</div>
                <div className="text-xl font-bold text-green-700">{formatGs(datosNeuroTEA.indicadores.gananciaReal)}</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg">
                <div className="text-xs text-emerald-600 uppercase">Meta 7%</div>
                <div className="text-xl font-bold text-emerald-700">{formatGs(datosNeuroTEA.indicadores.gananciaEsperada)}</div>
              </div>
            </div>
            
            {/* Barra de progreso gastos */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>% Gastos sobre Ingresos</span>
                <span className="font-bold">{datosNeuroTEA.indicadores.porcentajeGastos}% / {datosNeuroTEA.indicadores.metaGastos}% máx</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full" 
                  style={{width: `${datosNeuroTEA.indicadores.porcentajeGastos}%`}}
                ></div>
              </div>
              <div className="text-center mt-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                  ✅ META CUMPLIDA - Superávit: {formatGs(datosNeuroTEA.indicadores.gananciaReal - datosNeuroTEA.indicadores.gananciaEsperada)}
                </span>
              </div>
            </div>
            
            {/* Distribución de ganancia */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-semibold mb-2">Distribución de Ganancia (7% = {formatGs(datosNeuroTEA.indicadores.gananciaEsperada)})</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-purple-50 p-2 rounded text-center">
                  <div className="text-purple-600 text-xs">Utilidad Dueño</div>
                  <div className="font-bold">{formatGs(700000)}</div>
                  <div className="text-xs text-green-600">✓ {formatGs(580000)}</div>
                </div>
                <div className="bg-orange-50 p-2 rounded text-center">
                  <div className="text-orange-600 text-xs">Fondo Emerg.</div>
                  <div className="font-bold">{formatGs(700000)}</div>
                  <div className="text-xs text-green-600">✓ {formatGs(700000)}</div>
                </div>
                <div className="bg-cyan-50 p-2 rounded text-center">
                  <div className="text-cyan-600 text-xs">Fondo Inversión</div>
                  <div className="font-bold">{formatGs(700000)}</div>
                  <div className="text-xs text-yellow-600">⚠ {formatGs(420000)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CUENTAS NEUROTEA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">💰 SALDOS EN CUENTAS</h3>
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-2">Cuenta</th>
                  <th className="text-right p-2">Mes</th>
                  <th className="text-right p-2">Acumulado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">Atlas NeuroTEA ✏️</td>
                  <td className="text-right p-2 text-blue-600 font-bold">{formatGs(8500000)}</td>
                  <td className="text-right p-2">-</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">Costos Operativos</td>
                  <td className="text-right p-2">{formatGs(22800000)}</td>
                  <td className="text-right p-2 text-gray-500">{formatGs(22800000)}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">Utilidad del Dueño</td>
                  <td className="text-right p-2">{formatGs(580000)}</td>
                  <td className="text-right p-2 text-gray-500">{formatGs(580000)}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">Fondo Emergencia</td>
                  <td className="text-right p-2">{formatGs(700000)}</td>
                  <td className="text-right p-2 text-gray-500">{formatGs(2100000)}</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">Fondo Inversión</td>
                  <td className="text-right p-2">{formatGs(420000)}</td>
                  <td className="text-right p-2 text-gray-500">{formatGs(1260000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* PRESUPUESTO VS REAL NEUROTEA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">📋 PRESUPUESTO vs REAL</h3>
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-2">Categoría</th>
                  <th className="text-right p-2">Presupuesto</th>
                  <th className="text-right p-2">Real</th>
                  <th className="text-center p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {datosNeuroTEA.presupuesto.map((p, i) => {
                  const esIngreso = p.categoria.includes('INGRESO');
                  const esGanancia = p.categoria.includes('GANANCIA');
                  const status = getStatusColor(p.real, p.presupuestado, esIngreso || esGanancia);
                  const pct = p.presupuestado > 0 ? ((p.real / p.presupuestado) * 100).toFixed(0) : '-';
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-2 font-medium">{p.categoria}</td>
                      <td className="text-right p-2">{formatGs(p.presupuestado)}</td>
                      <td className="text-right p-2">{formatGs(p.real)}</td>
                      <td className="text-center p-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${status}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-blue-100 font-bold">
                <tr>
                  <td className="p-2">BALANCE NEUROTEA</td>
                  <td className="text-right p-2">{formatGs(-530000)}</td>
                  <td className="text-right p-2 text-green-600">{formatGs(2700000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">SUPERÁVIT</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* FLUJO DEL MES NEUROTEA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">💵 FLUJO DEL MES</h3>
            <div className="space-y-2">
              <div className="flex justify-between p-2 bg-green-50 rounded">
                <span>Ingresos</span>
                <span className="font-bold text-green-600">+ {formatGs(datosNeuroTEA.flujo.ingresos)}</span>
              </div>
              <div className="flex justify-between p-2 bg-red-50 rounded">
                <span>Egresos Pagados</span>
                <span className="font-bold text-red-600">- {formatGs(datosNeuroTEA.flujo.egresosPagados)}</span>
              </div>
              <div className="flex justify-between p-2 bg-yellow-50 rounded">
                <span>Egresos Pendientes</span>
                <span className="font-bold text-yellow-700">- {formatGs(datosNeuroTEA.flujo.egresosPendientes)}</span>
              </div>
              <div className="flex justify-between p-3 bg-blue-700 text-white rounded font-bold">
                <span>BALANCE</span>
                <span>{formatGs(datosNeuroTEA.flujo.ingresos - datosNeuroTEA.flujo.egresosPagados)}</span>
              </div>
            </div>
          </div>
          
          {/* LIQUIDEZ NEUROTEA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">📅 LIQUIDEZ - PRÓXIMOS PAGOS</h3>
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="text-left p-2">Concepto</th>
                  <th className="text-center p-2">Cuotas</th>
                  <th className="text-right p-2">Monto</th>
                  <th className="text-right p-2">Saldo</th>
                  <th className="text-center p-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50">
                  <td className="p-2 font-semibold">Caja disponible</td>
                  <td className="text-center p-2">-</td>
                  <td className="text-right p-2">-</td>
                  <td className="text-right p-2 font-bold">{formatGs(datosNeuroTEA.liquidez.cajaDisponible)}</td>
                  <td className="text-center p-2">-</td>
                </tr>
                <tr className="bg-green-50">
                  <td className="p-2 text-green-700">✅ Atrasados</td>
                  <td className="text-center p-2 font-bold text-green-700">{datosNeuroTEA.liquidez.atrasados.cantidad}</td>
                  <td className="text-right p-2 text-green-700">-</td>
                  <td className="text-right p-2 font-bold">{formatGs(8500000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">OK</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Esta semana</td>
                  <td className="text-center p-2 font-semibold">{datosNeuroTEA.liquidez.estaSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(datosNeuroTEA.liquidez.estaSemana.monto)}</td>
                  <td className="text-right p-2 font-bold text-green-600">{formatGs(4370000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">ALCANZA</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">Próxima semana</td>
                  <td className="text-center p-2 font-semibold">{datosNeuroTEA.liquidez.proximaSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(datosNeuroTEA.liquidez.proximaSemana.monto)}</td>
                  <td className="text-right p-2 font-bold text-green-600">{formatGs(2070000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">ALCANZA</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2">3ra semana</td>
                  <td className="text-center p-2 font-semibold">{datosNeuroTEA.liquidez.terceraSemana.cantidad}</td>
                  <td className="text-right p-2">-{formatGs(datosNeuroTEA.liquidez.terceraSemana.monto)}</td>
                  <td className="text-right p-2 font-bold text-green-600">{formatGs(1570000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">ALCANZA</span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="font-bold">
                  <td className="p-2">SALDO FINAL</td>
                  <td className="text-center p-2">6</td>
                  <td className="text-right p-2">-{formatGs(6930000)}</td>
                  <td className="text-right p-2 text-green-600">{formatGs(1570000)}</td>
                  <td className="text-center p-2">
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">OK</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* GRÁFICO TORTA NEUROTEA */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-bold text-blue-700 border-b pb-2 mb-3">📊 DISTRIBUCIÓN DE GASTOS</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1d4ed8" strokeWidth="20" strokeDasharray="58 42" strokeDashoffset="25"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0891b2" strokeWidth="20" strokeDasharray="32 68" strokeDashoffset="-33"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#7c3aed" strokeWidth="20" strokeDasharray="8 92" strokeDashoffset="-65"/>
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ea580c" strokeWidth="20" strokeDasharray="2 98" strokeDashoffset="-73"/>
                </svg>
              </div>
              <div className="ml-4 text-sm space-y-1">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-700 rounded"></div> Clínica (Alquileres) 58%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-600 rounded"></div> Sueldos/Honorarios 32%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-violet-600 rounded"></div> Obligaciones Leg. 8%</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-600 rounded"></div> Tel/Internet/Var. 2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECCIÓN GLOBAL - DEBAJO DE LAS DOS COLUMNAS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="mt-6">
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 text-white text-center py-2 rounded-t-lg font-bold text-lg">
          🔄 BALANCE CRUZADO: NEUROTEA ↔ FAMILIA
        </div>
        <div className="bg-white rounded-b-lg shadow p-4">
          <div className="grid grid-cols-2 gap-8">
            {/* Tabla de préstamos */}
            <div>
              <table className="w-full text-sm">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="text-left p-3">Concepto</th>
                    <th className="text-right p-3">Este Mes</th>
                    <th className="text-right p-3">Acumulado Año</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">Préstamo NT → Familia</td>
                    <td className="text-right p-3 font-semibold text-red-600">{formatGs(datosGlobales.prestamosNTaFam.mes)}</td>
                    <td className="text-right p-3 font-bold text-red-700">{formatGs(datosGlobales.prestamosNTaFam.acumulado)}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Devolución Familia → NT</td>
                    <td className="text-right p-3 font-semibold text-green-600">{formatGs(datosGlobales.devolucionesFamaaNT.mes)}</td>
                    <td className="text-right p-3 font-bold text-green-700">{formatGs(datosGlobales.devolucionesFamaaNT.acumulado)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-purple-100">
                  <tr className="font-bold">
                    <td className="p-3">SALDO NETO</td>
                    <td className="text-right p-3 text-red-700">{formatGs(datosGlobales.saldoNeto.mes)}</td>
                    <td className="text-right p-3 text-red-700">{formatGs(datosGlobales.saldoNeto.acumulado)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Indicador visual */}
            <div className="flex items-center justify-center">
              <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="text-6xl mb-2">⚠️</div>
                <div className="text-xl font-bold text-red-700">NT SUBSIDIA A FAMILIA</div>
                <div className="text-3xl font-bold text-red-800 mt-2">Gs. {formatGs(datosGlobales.saldoNeto.acumulado)}</div>
                <div className="text-sm text-red-600 mt-2">
                  El salario de administrador (Gs. 5.000.000) no está cubriendo los gastos familiares.
                  <br/>Déficit mensual promedio: Gs. {formatGs(datosGlobales.saldoNeto.acumulado / 3)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Control Financiero 2026 - NeuroTEA & Familia | Prototipo Visual v1.0</p>
        <p className="text-xs mt-1">✏️ = Campo de ingreso manual | 🔗 = Calculado automáticamente</p>
      </div>
    </div>
  );
};

export default TableroControlFinanciero;
