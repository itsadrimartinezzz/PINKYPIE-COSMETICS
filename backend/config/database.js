// Configuración de Sequelize para PostgreSQL
const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false, // Cambiar a console.log si quieres ver las queries SQL
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Probar conexión
sequelize.authenticate()
  .then(() => {
    console.log('Sequelize conectado a PostgreSQL');
  })
  .catch(err => {
    console.error('Error Sequelize:', err);
  });

module.exports = sequelize;