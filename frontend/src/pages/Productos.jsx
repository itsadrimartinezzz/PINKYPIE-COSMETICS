import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import AlertMessage from '../components/AlertMessage';

import api from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('success');
  const [cargando, setCargando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const cargarProductos = async () => {
    try {
      const response = await api.get('/productos');
      setProductos(response.data);
    } catch (error) {
      setTipoMensaje('error');
      setMensaje('No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const obtenerUnicos = (lista, idKey, textKey) => {
    const mapa = new Map();

    lista.forEach((item) => {
      if (item[idKey] && item[textKey]) {
        mapa.set(item[idKey], {
          [idKey]: item[idKey],
          [textKey]: item[textKey]
        });
      }
    });

    return Array.from(mapa.values());
  };

  const categorias = obtenerUnicos(productos, 'id_categoria', 'categoria');
  const marcas = obtenerUnicos(productos, 'id_marca', 'marca');
  const proveedores = obtenerUnicos(productos, 'id_proveedor', 'proveedor');

  const productosFiltrados = productos.filter((producto) => {
    const texto = `${producto.producto} ${producto.marca} ${producto.categoria} ${producto.sku}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  const abrirCrear = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const abrirEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  const guardarProducto = async (data) => {
    try {
      if (productoEditando) {
        await api.put(`/productos/${productoEditando.id_producto}`, data);
        setTipoMensaje('success');
        setMensaje('Producto actualizado correctamente');
      } else {
        await api.post('/productos', data);
        setTipoMensaje('success');
        setMensaje('Producto creado correctamente');
      }

      cerrarFormulario();
      cargarProductos();
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(error.response?.data?.mensaje || 'Error al guardar producto');
    }
  };

  const desactivarProducto = async (id) => {
    const confirmar = window.confirm('¿Seguro que deseas desactivar este producto?');

    if (!confirmar) return;

    try {
      await api.delete(`/productos/${id}`);

      setTipoMensaje('success');
      setMensaje('Producto desactivado correctamente');

      cargarProductos();
    } catch (error) {
      setTipoMensaje('error');
      setMensaje(error.response?.data?.mensaje || 'Error al desactivar producto');
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar
          title="Productos"
          subtitle="Gestiona tu catálogo de productos"
          actionText="Nuevo Producto"
          onAction={abrirCrear}
        />

        <AlertMessage type={tipoMensaje} message={mensaje} />

        <section className="toolbar">
          <div className="search-box">
            <Search size={24} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <button className="filter-button">
            <SlidersHorizontal size={24} />
            Filtros
          </button>
        </section>

        {cargando ? (
          <section className="panel-card">
            <p>Cargando productos...</p>
          </section>
        ) : (
          <section className="products-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id_producto}
                producto={producto}
                onEdit={abrirEditar}
                onDelete={desactivarProducto}
              />
            ))}
          </section>
        )}

        {!cargando && productosFiltrados.length === 0 && (
          <section className="panel-card">
            <p>No se encontraron productos.</p>
          </section>
        )}

        {mostrarFormulario && (
          <ProductForm
            productoEditando={productoEditando}
            categorias={categorias}
            marcas={marcas}
            proveedores={proveedores}
            onSubmit={guardarProducto}
            onCancel={cerrarFormulario}
          />
        )}
      </main>
    </div>
  );
}

export default Productos;