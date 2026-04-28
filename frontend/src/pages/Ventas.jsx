import { useEffect, useState } from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AlertMessage from '../components/AlertMessage';

import api from '../services/api';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');

  const [form, setForm] = useState({
    id_cliente: '',
    id_empleado: '',
    descuento: 0,
    observaciones: '',
    productos: []
  });

  const cargarDatos = async () => {
    try {
      const [
        ventasResponse,
        clientesResponse,
        empleadosResponse,
        productosResponse
      ] = await Promise.all([
        api.get('/ventas'),
        api.get('/clientes'),
        api.get('/ventas/empleados'),
        api.get('/productos')
      ]);

      setVentas(ventasResponse.data);
      setClientes(clientesResponse.data);
      setEmpleados(empleadosResponse.data);
      setProductos(productosResponse.data.filter((p) => p.activo));
    } catch (error) {
      setTipoMensaje('error');
      setMensaje('No se pudieron cargar los datos de ventas');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
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

  const ventasFiltradas = ventas.filter((venta) => {
    const texto = `${venta.id_venta} ${venta.cliente} ${venta.empleado} ${venta.estado}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const agregarProducto = () => {
    setForm({
      ...form,
      productos: [
        ...form.productos,
        {
          id_producto: '',
          cantidad: 1,
          descuento_linea: 0
        }
      ]
    });
  };

  const actualizarProductoVenta = (index, campo, valor) => {
    const nuevosProductos = [...form.productos];

    nuevosProductos[index] = {
      ...nuevosProductos[index],
      [campo]: valor
    };

    setForm({
      ...form,
      productos: nuevosProductos
    });
  };

  const eliminarProductoVenta = (index) => {
    const nuevosProductos = form.productos.filter((_, i) => i !== index);

    setForm({
      ...form,
      productos: nuevosProductos
    });
  };

  const obtenerProductoPorId = (id) => {
    return productos.find((producto) => Number(producto.id_producto) === Number(id));
  };

  const calcularSubtotalLinea = (item) => {
    const producto = obtenerProductoPorId(item.id_producto);

    if (!producto) return 0;

    return (Number(producto.precio_venta) * Number(item.cantidad || 0)) - Number(item.descuento_linea || 0);
  };

  const calcularSubtotal = () => {
    return form.productos.reduce((total, item) => {
      return total + calcularSubtotalLinea(item);
    }, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - Number(form.descuento || 0);
  };

  const limpiarFormulario = () => {
    setForm({
      id_cliente: '',
      id_empleado: '',
      descuento: 0,
      observaciones: '',
      productos: []
    });
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    limpiarFormulario();
  };

  const crearVenta = async (e) => {
    e.preventDefault();

    if (form.productos.length === 0) {
      setTipoMensaje('error');
      setMensaje('Debe agregar al menos un producto');
      return;
    }

    try {
      const payload = {
        id_cliente: Number(form.id_cliente),
        id_empleado: Number(form.id_empleado),
        descuento: Number(form.descuento || 0),
        observaciones: form.observaciones,
        productos: form.productos.map((item) => ({
          id_producto: Number(item.id_producto),
          cantidad: Number(item.cantidad),
          descuento_linea: Number(item.descuento_linea || 0)
        }))
      };

      await api.post('/ventas', payload);

      setTipoMensaje('success');
      setMensaje('Venta registrada correctamente');

      cerrarFormulario();
      cargarDatos();
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(error.response?.data?.mensaje || 'Error al registrar la venta');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Ventas"
          subtitle="Gestiona todas tus órdenes y transacciones"
          actionText="Nueva Venta"
          onAction={() => setMostrarFormulario(true)}
        />

        <AlertMessage type={tipoMensaje} message={mensaje} />

        <section className="toolbar toolbar-single">
          <div className="search-box">
            <Search size={24} />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o empleado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </section>

        {cargando ? (
          <section className="panel-card">
            <p>Cargando ventas...</p>
          </section>
        ) : (
          <section className="table-card">
            <table className="data-table sales-table">
              <thead>
                <tr>
                  <th>ID de Orden</th>
                  <th>Cliente</th>
                  <th>Empleado</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id_venta}>
                    <td>
                      <strong className="order-id">
                        #VT-{String(venta.id_venta).padStart(4, '0')}
                      </strong>
                    </td>

                    <td>{venta.cliente}</td>

                    <td>{venta.empleado}</td>

                    <td>{formatoFecha(venta.fecha_venta)}</td>

                    <td>
                      <strong className="money-text">
                        {formatoMoneda(venta.total)}
                      </strong>
                    </td>

                    <td>
                      <span className={`status-pill status-${venta.estado}`}>
                        {venta.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {ventasFiltradas.length === 0 && (
              <div className="empty-state">
                No se encontraron ventas.
              </div>
            )}
          </section>
        )}

        {mostrarFormulario && (
          <div className="modal-backdrop">
            <form className="modal-card sale-form" onSubmit={crearVenta}>
              <div className="modal-header">
                <div>
                  <h2>Nueva Venta</h2>
                  <p>Selecciona cliente, empleado y productos vendidos</p>
                </div>

                <button type="button" onClick={cerrarFormulario} className="close-button">
                  ×
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Cliente</label>
                  <select
                    name="id_cliente"
                    value={form.id_cliente}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id_cliente} value={cliente.id_cliente}>
                        {cliente.nombre} {cliente.apellido}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Empleado</label>
                  <select
                    name="id_empleado"
                    value={form.id_empleado}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Seleccionar empleado</option>
                    {empleados.map((empleado) => (
                      <option key={empleado.id_empleado} value={empleado.id_empleado}>
                        {empleado.nombre} {empleado.apellido} - {empleado.puesto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sale-products-header">
                <h3>Productos</h3>

                <button type="button" className="add-line-button" onClick={agregarProducto}>
                  <Plus size={18} />
                  Agregar producto
                </button>
              </div>

              <div className="sale-products-list">
                {form.productos.length === 0 && (
                  <p className="muted-text">Todavía no agregaste productos.</p>
                )}

                {form.productos.map((item, index) => {
                  const productoSeleccionado = obtenerProductoPorId(item.id_producto);
                  const subtotalLinea = calcularSubtotalLinea(item);

                  return (
                    <div className="sale-product-row" key={index}>
                      <div className="form-group">
                        <label>Producto</label>
                        <select
                          value={item.id_producto}
                          onChange={(e) => actualizarProductoVenta(index, 'id_producto', e.target.value)}
                          required
                        >
                          <option value="">Seleccionar producto</option>
                          {productos.map((producto) => (
                            <option key={producto.id_producto} value={producto.id_producto}>
                              {producto.producto} - Stock: {producto.stock}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Cantidad</label>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => actualizarProductoVenta(index, 'cantidad', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Desc. línea</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.descuento_linea}
                          onChange={(e) => actualizarProductoVenta(index, 'descuento_linea', e.target.value)}
                        />
                      </div>

                      <div className="sale-line-total">
                        <span>Subtotal</span>
                        <strong>{formatoMoneda(subtotalLinea)}</strong>
                        {productoSeleccionado && (
                          <small>Precio: {formatoMoneda(productoSeleccionado.precio_venta)}</small>
                        )}
                      </div>

                      <button
                        type="button"
                        className="remove-line-button"
                        onClick={() => eliminarProductoVenta(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Descuento general</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="descuento"
                    value={form.descuento}
                    onChange={manejarCambio}
                  />
                </div>

                <div className="form-group">
                  <label>Observaciones</label>
                  <input
                    name="observaciones"
                    value={form.observaciones}
                    onChange={manejarCambio}
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <div className="sale-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>{formatoMoneda(calcularSubtotal())}</strong>
                </div>

                <div>
                  <span>Descuento</span>
                  <strong>{formatoMoneda(form.descuento)}</strong>
                </div>

                <div className="sale-summary-total">
                  <span>Total</span>
                  <strong>{formatoMoneda(calcularTotal())}</strong>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={cerrarFormulario}>
                  Cancelar
                </button>

                <button type="submit" className="primary-button">
                  Registrar Venta
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Ventas;