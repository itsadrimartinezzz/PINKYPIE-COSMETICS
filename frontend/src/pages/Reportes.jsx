import { useEffect, useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Download,
  AlertTriangle
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AlertMessage from '../components/AlertMessage';

import api from '../services/api';

function Reportes() {
  const [dashboard, setDashboard] = useState(null);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasCategoria, setVentasCategoria] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');

  const formatoMoneda = (valor) => {
    return `Q${Number(valor || 0).toFixed(2)}`;
  };

  const formatoFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const cargarReportes = async () => {
    try {
      const [
        dashboardResponse,
        productosResponse,
        categoriasResponse,
        stockResponse,
        ventasDiariasResponse
      ] = await Promise.all([
        api.get('/reportes/dashboard'),
        api.get('/reportes/productos-mas-vendidos'),
        api.get('/reportes/ventas-categoria'),
        api.get('/reportes/stock-bajo'),
        api.get('/reportes/ventas-diarias')
      ]);

      setDashboard(dashboardResponse.data);
      setProductosMasVendidos(productosResponse.data);
      setVentasCategoria(categoriasResponse.data);
      setStockBajo(stockResponse.data);
      setVentasDiarias(ventasDiariasResponse.data);
    } catch (error) {
      setTipoMensaje('error');
      setMensaje('No se pudieron cargar los reportes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarReportes();
  }, []);

  const exportarCSV = () => {
    const filas = [
      ['Producto', 'Marca', 'Unidades vendidas', 'Total vendido'],
      ...productosMasVendidos.map((item) => [
        item.producto,
        item.marca,
        item.unidades_vendidas,
        item.total_vendido
      ])
    ];

    const contenido = filas
      .map((fila) => fila.map((valor) => `"${valor}"`).join(','))
      .join('\n');

    const blob = new Blob([contenido], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'productos_mas_vendidos.csv';
    link.click();

    URL.revokeObjectURL(url);

    setTipoMensaje('success');
    setMensaje('Reporte exportado correctamente');
  };

  const resumen = dashboard?.resumen || {};
  const maxVentaCategoria = Math.max(
    ...ventasCategoria.map((item) => Number(item.total_vendido || 0)),
    1
  );

  const maxVentaDiaria = Math.max(
    ...ventasDiarias.map((item) => Number(item.ingreso_total || 0)),
    1
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Reportes"
          subtitle="Análisis y estadísticas de tu negocio"
        />

        <AlertMessage type={tipoMensaje} message={mensaje} />

        {cargando ? (
          <section className="panel-card">
            <p>Cargando reportes...</p>
          </section>
        ) : (
          <>
            <section className="reports-metrics-grid">
              <div className="metric-card">
                <div className="metric-top">
                  <div className="metric-icon">
                    <DollarSign size={24} />
                  </div>
                </div>

                <h2>{formatoMoneda(resumen.ventas_mes)}</h2>
                <p>Ventas del Mes</p>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <div className="metric-icon">
                    <ShoppingBag size={24} />
                  </div>
                </div>

                <h2>{resumen.ordenes_totales || 0}</h2>
                <p>Órdenes Totales</p>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <div className="metric-icon">
                    <Users size={24} />
                  </div>
                </div>

                <h2>{resumen.total_clientes || 0}</h2>
                <p>Clientes Registrados</p>
              </div>

              <div className="metric-card">
                <div className="metric-top">
                  <div className="metric-icon">
                    <TrendingUp size={24} />
                  </div>
                </div>

                <h2>{resumen.productos_vendidos || 0}</h2>
                <p>Productos Vendidos</p>
              </div>
            </section>

            <section className="reports-grid">
              <div className="panel-card">
                <h2>Productos Más Vendidos</h2>

                <div className="ranking-list">
                  {productosMasVendidos.slice(0, 6).map((item, index) => (
                    <div className="ranking-item" key={`${item.producto}-${index}`}>
                      <div className="ranking-number">
                        {index + 1}
                      </div>

                      <div className="ranking-info">
                        <h3>{item.producto}</h3>
                        <p>{item.marca}</p>
                        <small>{item.unidades_vendidas} unidades vendidas</small>
                      </div>

                      <strong>{formatoMoneda(item.total_vendido)}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel-card">
                <h2>Ventas por Categoría</h2>

                <div className="bar-list">
                  {ventasCategoria.map((item) => {
                    const porcentaje = (Number(item.total_vendido) / maxVentaCategoria) * 100;

                    return (
                      <div className="bar-item" key={item.categoria}>
                        <div className="bar-header">
                          <span>{item.categoria}</span>
                          <strong>{formatoMoneda(item.total_vendido)}</strong>
                        </div>

                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>

                        <p>{item.unidades_vendidas} unidades vendidas</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="reports-grid">
              <div className="panel-card">
                <h2>Ventas Diarias</h2>

                <div className="bar-list">
                  {ventasDiarias.slice(0, 8).map((item) => {
                    const porcentaje = (Number(item.ingreso_total) / maxVentaDiaria) * 100;

                    return (
                      <div className="bar-item" key={item.dia}>
                        <div className="bar-header">
                          <span>{formatoFecha(item.dia)}</span>
                          <strong>{formatoMoneda(item.ingreso_total)}</strong>
                        </div>

                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${porcentaje}%` }}
                          />
                        </div>

                        <p>
                          {item.num_ventas} ventas · Ticket promedio {formatoMoneda(item.ticket_promedio)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel-card">
                <h2>Productos con Stock Bajo</h2>

                {stockBajo.length === 0 ? (
                  <p className="muted-text">No hay productos con stock bajo.</p>
                ) : (
                  <div className="stock-list">
                    {stockBajo.map((item) => (
                      <div className="stock-item" key={item.id_producto}>
                        <div className="stock-icon">
                          <AlertTriangle size={22} />
                        </div>

                        <div>
                          <h3>{item.producto}</h3>
                          <p>{item.marca} · {item.categoria}</p>
                          <small>
                            Stock actual: {item.stock} · Mínimo: {item.stock_minimo}
                          </small>
                        </div>

                        <strong>
                          Faltan {item.unidades_faltantes}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="panel-card report-note">
              <div>
                <h2>Reporte exportable</h2>
                <p>
                  El botón Exportar descarga un CSV con los productos más vendidos usando datos reales del backend.
                </p>
              </div>

              <button className="secondary-export-button" onClick={exportarCSV}>
                <Download size={22} />
                Exportar CSV
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Reportes;