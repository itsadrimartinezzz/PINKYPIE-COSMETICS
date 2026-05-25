// Archivo central de modelos con relaciones

const sequelize = require('../config/database');
const Categoria = require('./Categoria');
const Marca = require('./Marca');
const Proveedor = require('./Proveedor');
const Producto = require('./Producto');
const Cliente = require('./Cliente');

// Relaciones de producto
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });

Producto.belongsTo(Marca, { foreignKey: 'id_marca', as: 'marca' });
Marca.hasMany(Producto, { foreignKey: 'id_marca', as: 'productos' });

Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor', as: 'proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor', as: 'productos' });

module.exports = {
  sequelize,
  Categoria,
  Marca,
  Proveedor,
  Producto,
  Cliente
};