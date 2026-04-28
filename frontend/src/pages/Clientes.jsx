import { useEffect, useState } from 'react';
import { Search, Mail, Phone, Pencil, Trash2 } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ClientForm from '../components/ClientForm';
import AlertMessage from '../components/AlertMessage';

import api from '../services/api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  const cargarClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      setTipoMensaje('error');
      setMensaje('No se pudieron cargar los clientes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = `${cliente.nombre} ${cliente.apellido} ${cliente.email} ${cliente.telefono}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const obtenerInicial = (cliente) => {
    return cliente.nombre?.charAt(0)?.toUpperCase() || '?';
  };

  const abrirCrear = () => {
    setClienteEditando(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (cliente) => {
    setClienteEditando(cliente);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setClienteEditando(null);
  };

  const guardarCliente = async (data) => {
    try {
      if (clienteEditando) {
        await api.put(`/clientes/${clienteEditando.id_cliente}`, data);
        setTipoMensaje('success');
        setMensaje('Cliente actualizado correctamente');
      } else {
        await api.post('/clientes', data);
        setTipoMensaje('success');
        setMensaje('Cliente creado correctamente');
      }

      cerrarFormulario();
      cargarClientes();
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(error.response?.data?.mensaje || 'Error al guardar cliente');
    }
  };

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas eliminar este cliente?');

    if (!confirmar) return;

    try {
      await api.delete(`/clientes/${id}`);

      setTipoMensaje('success');
      setMensaje('Cliente eliminado correctamente');

      cargarClientes();
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(error.response?.data?.mensaje || 'Error al eliminar cliente');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Clientes"
          subtitle="Administra tu base de clientes"
          actionText="Nuevo Cliente"
          onAction={abrirCrear}
        />

        <AlertMessage type={tipoMensaje} message={mensaje} />

        <section className="toolbar toolbar-single">
          <div className="search-box">
            <Search size={24} />
            <input
              type="text"
              placeholder="Buscar clientes por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </section>

        {cargando ? (
          <section className="panel-card">
            <p>Cargando clientes...</p>
          </section>
        ) : (
          <section className="table-card">
            <table className="data-table clients-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Dirección</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id_cliente}>
                    <td>
                      <div className="client-cell">
                        <div className="client-avatar">
                          {obtenerInicial(cliente)}
                        </div>

                        <div>
                          <strong>{cliente.nombre} {cliente.apellido}</strong>
                          <p>ID #{cliente.id_cliente}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="contact-info">
                        <p>
                          <Mail size={17} />
                          {cliente.email}
                        </p>

                        <p>
                          <Phone size={17} />
                          {cliente.telefono || 'Sin teléfono'}
                        </p>
                      </div>
                    </td>

                    <td>{cliente.direccion || 'Sin dirección'}</td>

                    <td>
                      {new Date(cliente.fecha_registro).toLocaleDateString('es-GT')}
                    </td>

                    <td>
                      <div className="table-actions">
                        <button onClick={() => abrirEditar(cliente)}>
                          <Pencil size={17} />
                          Editar
                        </button>

                        <button
                          className="danger-table-button"
                          onClick={() => eliminarCliente(cliente.id_cliente)}
                        >
                          <Trash2 size={17} />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {clientesFiltrados.length === 0 && (
              <div className="empty-state">
                No se encontraron clientes.
              </div>
            )}
          </section>
        )}

        {mostrarFormulario && (
          <ClientForm
            clienteEditando={clienteEditando}
            onSubmit={guardarCliente}
            onCancel={cerrarFormulario}
          />
        )}
      </main>
    </div>
  );
}

export default Clientes;