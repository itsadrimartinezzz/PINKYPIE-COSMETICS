import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../services/api';
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDashboard = async () => {
    try {
      const response = await api.get('/reportes/dashboard');
      setDashboard(response.data);
    } catch (error) {
      setError('No se pudo cargar el resumen del dashboard');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

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

  const resumen = dashboard?.resumen || {};
  const ventasRecientes = dashboard?.ventas_recientes || [];

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Dashboard"
          subtitle="Bienvenida de nuevo, aquí está tu resumen de hoy"
        />

        {cargando && (
          <section className="panel-card">
            <p>Cargando datos...</p>
          </section>
        )}

        {error && (
          <section className="panel-card">
            <p>{error}</p>
          </section>
        )}

        {!cargando && !error && (
          <>
            <section className="metrics-grid">
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
                    <Users size={24} />
                  </div>
                </div>

                <h2>{resumen.total_clientes || 0}</h2>
                <p>Clientes Registrados</p>
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
                    <TrendingUp size={24} />
                  </div>
                </div>

                <h2>{resumen.productos_vendidos || 0}</h2>
                <p>Productos Vendidos</p>
              </div>
            </section>

            <section className="panel-card">
              <h2>Ventas Recientes</h2>

              {ventasRecientes.length === 0 ? (
                <p>No hay ventas recientes registradas.</p>
              ) : (
                ventasRecientes.map((venta) => (
                  <div className="recent-sale" key={venta.id_venta}>
                    <div>
                      <h3>{venta.cliente}</h3>
                      <p>Venta #{venta.id_venta}</p>
                    </div>

                    <div>
                      <span>{formatoFecha(venta.fecha_venta)}</span>
                      <strong>{formatoMoneda(venta.total)}</strong>
                    </div>
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;