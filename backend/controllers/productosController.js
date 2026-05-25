const { Producto, Categoria, Marca, Proveedor } = require('../models');

const incluirRelacionesProducto = [
  {
    model: Categoria,
    as: 'categoria',
    attributes: ['id_categoria', 'nombre']
  },
  {
    model: Marca,
    as: 'marca',
    attributes: ['id_marca', 'nombre']
  },
  {
    model: Proveedor,
    as: 'proveedor',
    attributes: ['id_proveedor', 'nombre']
  }
];

const formatearProducto = (p) => ({
  id_producto: p.id_producto,
  sku: p.sku,
  producto: p.nombre,
  nombre: p.nombre,
  descripcion: p.descripcion,
  id_categoria: p.id_categoria,
  categoria: p.categoria ? p.categoria.nombre : null,
  id_marca: p.id_marca,
  marca: p.marca ? p.marca.nombre : null,
  id_proveedor: p.id_proveedor,
  proveedor: p.proveedor ? p.proveedor.nombre : null,
  precio_compra: Number(p.precio_compra),
  precio_venta: Number(p.precio_venta),
  stock: p.stock,
  stock_minimo: p.stock_minimo,
  imagen: p.imagen,
  activo: p.activo
});

// ORM: obtener productos con categoría, marca y proveedor
const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({
      include: incluirRelacionesProducto,
      order: [['id_producto', 'ASC']]
    });

    res.json(productos.map(formatearProducto));
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// ORM: obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id, {
      include: incluirRelacionesProducto
    });

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.json(formatearProducto(producto));
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
};

// ORM: crear producto
const crearProducto = async (req, res) => {
  try {
    const {
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      sku,
      imagen,
      activo
    } = req.body;

    if (!id_categoria || !id_marca || !id_proveedor || !nombre || !precio_compra || !precio_venta || !sku) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const nuevoProducto = await Producto.create({
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock: stock ?? 0,
      stock_minimo: stock_minimo ?? 5,
      sku,
      imagen,
      activo: activo !== undefined ? activo : true
    });

    const productoCompleto = await Producto.findByPk(nuevoProducto.id_producto, {
      include: incluirRelacionesProducto
    });

    res.status(201).json({
      mensaje: 'Producto creado correctamente',
      producto: formatearProducto(productoCompleto)
    });
  } catch (error) {
    console.error('Error al crear producto:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese SKU' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ mensaje: 'La categoría, marca o proveedor seleccionado no existe' });
    }

    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// ORM: actualizar producto
const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    const {
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      sku,
      imagen,
      activo
    } = req.body;

    await producto.update({
      id_categoria,
      id_marca,
      id_proveedor,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      stock,
      stock_minimo,
      sku,
      imagen,
      activo
    });

    const productoActualizado = await Producto.findByPk(id, {
      include: incluirRelacionesProducto
    });

    res.json({
      mensaje: 'Producto actualizado correctamente',
      producto: formatearProducto(productoActualizado)
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ mensaje: 'Ya existe un producto con ese SKU' });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ mensaje: 'La categoría, marca o proveedor seleccionado no existe' });
    }

    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// ORM: desactivar producto
const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    await producto.update({ activo: false });

    res.json({ mensaje: 'Producto desactivado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};