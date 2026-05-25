import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, rolesPermitidos }) {
  const token = localStorage.getItem('token');
  const usuarioGuardado = localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;