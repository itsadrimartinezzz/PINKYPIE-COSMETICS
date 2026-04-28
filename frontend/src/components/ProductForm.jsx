import { useEffect, useState } from 'react';

function ProductForm({
  productoEditando,
  categorias,
  marcas,
  proveedores,
  onSubmit,
  onCancel
}) {
  const [form, setForm] = useState({
    id_categoria: '',
    id_marca: '',
    id_proveedor: '',
    nombre: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: '',
    stock: '',
    stock_minimo: '',
    sku: '',
    imagen: '',
    activo: true
  });

  useEffect(() => {
    if (productoEditando) {
      setForm({
        id_categoria: productoEditando.id_categoria || '',
        id_marca: productoEditando.id_marca || '',
        id_proveedor: productoEditando.id_proveedor || '',
        nombre: productoEditando.producto || '',
        descripcion: productoEditando.descripcion || '',
        precio_compra: productoEditando.precio_compra || '',
        precio_venta: productoEditando.precio_venta || '',
        stock: productoEditando.stock || '',
        stock_minimo: productoEditando.stock_minimo || '',
        sku: productoEditando.sku || '',
        imagen: productoEditando.imagen || '',
        activo: productoEditando.activo
      });
    }
  }, [productoEditando]);

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const enviarFormulario = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      id_categoria: Number(form.id_categoria),
      id_marca: Number(form.id_marca),
      id_proveedor: Number(form.id_proveedor),
      precio_compra: Number(form.precio_compra),
      precio_venta: Number(form.precio_venta),
      stock: Number(form.stock),
      stock_minimo: Number(form.stock_minimo)
    });
  };

  return (
    <div className="modal-backdrop">
      <form className="modal-card product-form" onSubmit={enviarFormulario}>
        <div className="modal-header">
          <div>
            <h2>{productoEditando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <p>Completa los datos del producto</p>
          </div>

          <button type="button" onClick={onCancel} className="close-button">
            ×
          </button>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>SKU</label>
            <input
              name="sku"
              value={form.sku}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select
              name="id_categoria"
              value={form.id_categoria}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccionar</option>
              {categorias.map((item) => (
                <option key={item.id_categoria} value={item.id_categoria}>
                  {item.categoria}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Marca</label>
            <select
              name="id_marca"
              value={form.id_marca}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccionar</option>
              {marcas.map((item) => (
                <option key={item.id_marca} value={item.id_marca}>
                  {item.marca}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Proveedor</label>
            <select
              name="id_proveedor"
              value={form.id_proveedor}
              onChange={manejarCambio}
              required
            >
              <option value="">Seleccionar</option>
              {proveedores.map((item) => (
                <option key={item.id_proveedor} value={item.id_proveedor}>
                  {item.proveedor}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Imagen</label>
            <input
              name="imagen"
              value={form.imagen}
              onChange={manejarCambio}
              placeholder="nombre-imagen.jpg"
            />
          </div>

          <div className="form-group">
            <label>Precio compra</label>
            <input
              type="number"
              step="0.01"
              name="precio_compra"
              value={form.precio_compra}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Precio venta</label>
            <input
              type="number"
              step="0.01"
              name="precio_venta"
              value={form.precio_venta}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock mínimo</label>
            <input
              type="number"
              name="stock_minimo"
              value={form.stock_minimo}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={manejarCambio}
            rows="3"
          />
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={manejarCambio}
          />
          Producto activo
        </label>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancelar
          </button>

          <button type="submit" className="primary-button">
            {productoEditando ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;