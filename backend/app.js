const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const productosRouter = require('./routes/productos');
const clientesRouter = require('./routes/clientes');
const ventasRouter = require('./routes/ventas');
const reportesRouter = require('./routes/reportes');
const authRouter = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API PINKYPIE funcionando correctamente'
  });
});

app.use('/api/auth', authRouter);
app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/reportes', reportesRouter);

module.exports = app;