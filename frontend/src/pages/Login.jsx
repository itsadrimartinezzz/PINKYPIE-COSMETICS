import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AlertMessage from '../components/AlertMessage';

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const response = await api.post('/auth/login', form);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      navigate('/dashboard');
    } catch (error) {
      setMensaje(error.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <h1>PINKYPIE</h1>
          <p>Inventario y ventas de maquillaje</p>
        </div>

        <form onSubmit={iniciarSesion} className="login-form">
          <AlertMessage type="error" message={mensaje} />

          <label>Usuario</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={manejarCambio}
            placeholder="admin"
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={manejarCambio}
            placeholder="admin123"
          />

          <button type="submit" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="login-help">
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Vendedor:</strong> melanie / vendedor123</p>
        </div>
      </section>
    </main>
  );
}

export default Login;