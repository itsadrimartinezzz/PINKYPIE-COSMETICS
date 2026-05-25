import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';

function Procedures() {
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');
  const [resultado, setResultado] = useState(null);

  const [stockForm, setStockForm] = useState({
    id_producto: '',
    cantidad: '',
    tipo_movimiento: 'ENTRADA'
  });

  const [ventaForm, setVentaForm] = useState({
    id_cliente: '',
    id_empleado: '',
    productos: '[{"id_producto":1,"cantidad":1}]'
  });

  const [anularForm, setAnularForm] = useState({
    id_venta: ''
  });

  const [reporteForm, setReporteForm] = useState({
    fecha_inicio: '2026-01-01',
    fecha_fin: '2026-12-31'
  });

  const mostrarResultado = (response) => {
    setTipoMensaje('success');
    setMensaje(response.data.mensaje || 'Operación ejecutada correctamente');
    setResultado(response.data.resultado || response.data);
  };

  const mostrarError = (error) => {
    setTipoMensaje('error');
    setMensaje(error.response?.data?.mensaje || 'Ocurrió un error al ejecutar el procedimiento');
    setResultado(error.response?.data || null);
  };

  const ejecutarActualizarStock = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/procedures/actualizar-stock', {
        id_producto: Number(stockForm.id_producto),
        cantidad: Number(stockForm.cantidad),
        tipo_movimiento: stockForm.tipo_movimiento
      });

      mostrarResultado(response);
    } catch (error) {
      mostrarError(error);
    }
  };

  const ejecutarRegistrarVenta = async (e) => {
    e.preventDefault();

    try {
      let productosParseados;

      try {
        productosParseados = JSON.parse(ventaForm.productos);
      } catch {
        setTipoMensaje('error');
        setMensaje('El campo productos debe ser un JSON válido');
        return;
      }

      const response = await api.post('/procedures/registrar-venta', {
        id_cliente: Number(ventaForm.id_cliente),
        id_empleado: Number(ventaForm.id_empleado),
        productos: productosParseados
      });

      mostrarResultado(response);
    } catch (error) {
      mostrarError(error);
    }
  };

  const ejecutarAnularVenta = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/procedures/anular-venta', {
        id_venta: Number(anularForm.id_venta)
      });

      mostrarResultado(response);
    } catch (error) {
      mostrarError(error);
    }
  };

  const ejecutarReporteVentas = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get('/procedures/reporte-ventas-periodo', {
        params: {
          fecha_inicio: reporteForm.fecha_inicio,
          fecha_fin: reporteForm.fecha_fin
        }
      });

      mostrarResultado(response);
    } catch (error) {
      mostrarError(error);
    }
  };

  const ejecutarProductosBajoStock = async () => {
    try {
      const response = await api.get('/procedures/productos-bajo-stock');
      mostrarResultado(response);
    } catch (error) {
      mostrarError(error);
    }
  };

  useEffect(() => {
    setMensaje('');
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>Operaciones de Base de Datos</h1>
          </div>
        </div>

        <AlertMessage type={tipoMensaje} message={mensaje} />

        <div className="procedures-grid">
          <section className="card">
            <h2>1. Actualizar stock</h2>
            <p>Ejecuta el stored procedure sp_actualizar_stock.</p>

            <form onSubmit={ejecutarActualizarStock} className="form-grid">
              <input
                type="number"
                placeholder="ID producto"
                value={stockForm.id_producto}
                onChange={(e) =>
                  setStockForm({ ...stockForm, id_producto: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Cantidad"
                value={stockForm.cantidad}
                onChange={(e) =>
                  setStockForm({ ...stockForm, cantidad: e.target.value })
                }
                required
              />

              <select
                value={stockForm.tipo_movimiento}
                onChange={(e) =>
                  setStockForm({ ...stockForm, tipo_movimiento: e.target.value })
                }
              >
                <option value="ENTRADA">ENTRADA</option>
                <option value="SALIDA">SALIDA</option>
              </select>

              <button type="submit">Ejecutar</button>
            </form>
          </section>

          <section className="card">
            <h2>2. Registrar venta</h2>
            <p>Ejecuta el stored procedure sp_registrar_venta.</p>

            <form onSubmit={ejecutarRegistrarVenta} className="form-grid">
              <input
                type="number"
                placeholder="ID cliente"
                value={ventaForm.id_cliente}
                onChange={(e) =>
                  setVentaForm({ ...ventaForm, id_cliente: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="ID empleado"
                value={ventaForm.id_empleado}
                onChange={(e) =>
                  setVentaForm({ ...ventaForm, id_empleado: e.target.value })
                }
                required
              />

              <textarea
                rows="4"
                placeholder='[{"id_producto":1,"cantidad":1}]'
                value={ventaForm.productos}
                onChange={(e) =>
                  setVentaForm({ ...ventaForm, productos: e.target.value })
                }
                required
              />

              <button type="submit">Ejecutar</button>
            </form>
          </section>

          <section className="card">
            <h2>3. Anular venta</h2>
            <p>Ejecuta el stored procedure sp_anular_venta.</p>

            <form onSubmit={ejecutarAnularVenta} className="form-grid">
              <input
                type="number"
                placeholder="ID venta"
                value={anularForm.id_venta}
                onChange={(e) =>
                  setAnularForm({ ...anularForm, id_venta: e.target.value })
                }
                required
              />

              <button type="submit">Ejecutar</button>
            </form>
          </section>

          <section className="card">
            <h2>4. Reporte de ventas por período</h2>
            <p>Ejecuta el stored procedure sp_reporte_ventas_periodo.</p>

            <form onSubmit={ejecutarReporteVentas} className="form-grid">
              <input
                type="date"
                value={reporteForm.fecha_inicio}
                onChange={(e) =>
                  setReporteForm({ ...reporteForm, fecha_inicio: e.target.value })
                }
                required
              />

              <input
                type="date"
                value={reporteForm.fecha_fin}
                onChange={(e) =>
                  setReporteForm({ ...reporteForm, fecha_fin: e.target.value })
                }
                required
              />

              <button type="submit">Ejecutar</button>
            </form>
          </section>

          <section className="card">
            <h2>5. Productos con bajo stock</h2>
            <p>Ejecuta el stored procedure sp_productos_bajo_stock.</p>

            <button onClick={ejecutarProductosBajoStock}>
              Ejecutar
            </button>
          </section>
        </div>

        <section className="card result-card">
          <h2>Resultado</h2>

          {resultado ? (
            <pre className="json-result">
              {JSON.stringify(resultado, null, 2)}
            </pre>
          ) : (
            <p>No hay resultados todavía.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Procedures;