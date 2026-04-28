function ProductCard({ producto, onEdit, onDelete }) {
  const obtenerIcono = (categoria) => {
    const texto = categoria?.toLowerCase() || '';

    if (texto.includes('labial') || texto.includes('lip')) return '💄';
    if (texto.includes('gloss')) return '✨';
    if (texto.includes('blush')) return '🌸';
    if (texto.includes('base')) return '🧴';
    if (texto.includes('corrector')) return '🪄';
    if (texto.includes('polvo')) return '☁️';
    if (texto.includes('bronzer')) return '🌞';
    if (texto.includes('máscara')) return '👁️';
    if (texto.includes('sombra')) return '🎨';
    if (texto.includes('cejas')) return '〰️';

    return '🛍️';
  };

  return (
    <article className="product-card">
      <div className="product-image-box">
        <span>{obtenerIcono(producto.categoria)}</span>
      </div>

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
          <button className="danger-button" onClick={() => onDelete(producto.id_producto)}>
            Desactivar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;