const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      return res.status(400).json({
        mensaje: 'Debe ingresar usuario y contraseña'
      });
    }

    // Buscar usuario activo
    const result = await pool.query(`
      SELECT
        u.id_usuario,
        u.username,
        u.password_hash,
        u.rol,
        u.activo,
        e.id_empleado,
        e.nombre,
        e.apellido,
        e.email,
        e.puesto
      FROM usuario u
      JOIN empleado e ON e.id_empleado = u.id_empleado
      WHERE u.username = $1
        AND u.activo = TRUE
        AND e.activo = TRUE;
    `, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    const usuario = result.rows[0];

    // Comparar contraseña con hash
    const passwordValida = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Crear token
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        id_empleado: usuario.id_empleado,
        username: usuario.username,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Actualizar último login
    await pool.query(`
      UPDATE usuario
      SET ultimo_login = NOW()
      WHERE id_usuario = $1;
    `, [usuario.id_usuario]);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        id_empleado: usuario.id_empleado,
        username: usuario.username,
        rol: usuario.rol,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        puesto: usuario.puesto
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      mensaje: 'Error al iniciar sesión'
    });
  }
};

// Obtener perfil del usuario autenticado
const obtenerPerfil = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;

    const result = await pool.query(`
      SELECT
        u.id_usuario,
        u.username,
        u.rol,
        u.ultimo_login,
        e.id_empleado,
        e.nombre,
        e.apellido,
        e.email,
        e.puesto
      FROM usuario u
      JOIN empleado e ON e.id_empleado = u.id_empleado
      WHERE u.id_usuario = $1;
    `, [id_usuario]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      mensaje: 'Error al obtener perfil'
    });
  }
};

module.exports = {
  login,
  obtenerPerfil
};