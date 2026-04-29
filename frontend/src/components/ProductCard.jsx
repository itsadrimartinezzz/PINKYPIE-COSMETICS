function ProductCard({ producto, onEdit, onDelete }) {
  return (
    <article className="product-card">
      <div className="product-image-box"></div>

      <div className="product-info">
        <p className="product-category">{producto.categoria}</p>

        <h3>{producto.producto}</h3>

        <p className="product-brand">{producto.marca}</p>

        <div className="product-footer">
          <strong>Q{Number(producto.precio_venta).toFixed(2)}</strong>
          <span>Stock: {producto.stock}</span>
        </div>

        <div className="product-actions">
          <button onClick={() => onEdit(producto)}>Editar</button>
          <button
            className="danger-button"
            onClick={() => onDelete(producto.id_producto)}
          >
            Desactivar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;