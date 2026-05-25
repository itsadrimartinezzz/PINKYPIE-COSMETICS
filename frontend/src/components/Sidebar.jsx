import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Database,
  LogOut
} from 'lucide-react';
import api from '../services/api';

function Sidebar() {
  const navigate = useNavigate();
  const usuarioGuardado = localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const rol = usuario?.rol;

  const cerrarSesion = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Aunque falle el backend, se limpia la sesión local.
    }

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const menu = [
    {
      nombre: 'Dashboard',
      ruta: '/dashboard',
      icono: LayoutDashboard,
      roles: ['admin', 'gerente', 'vendedor', 'inventario', 'consulta']
    },
    {
      nombre: 'Productos',
      ruta: '/productos',
      icono: Package,
      roles: ['admin', 'gerente', 'vendedor', 'inventario', 'consulta']
    },
    {
      nombre: 'Clientes',
      ruta: '/clientes',
      icono: Users,
      roles: ['admin', 'gerente', 'vendedor', 'consulta']
    },
    {
      nombre: 'Ventas',
      ruta: '/ventas',
      icono: ShoppingCart,
      roles: ['admin', 'gerente', 'vendedor', 'consulta']
    },
    {
      nombre: 'Reportes',
      ruta: '/reportes',
      icono: BarChart3,
      roles: ['admin', 'gerente', 'consulta']
    },
    {
      nombre: 'Operaciones BD',
      ruta: '/procedures',
      icono: Database,
      roles: ['admin', 'gerente', 'inventario', 'consulta']
    }
  ];

  const menuPermitido = menu.filter((item) => item.roles.includes(rol));

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <h1>PINKYPIE</h1>
          <p>{rol ? rol.toUpperCase() : 'ADMIN PANEL'}</p>
        </div>

        <nav className="sidebar-menu">
          {menuPermitido.map((item) => {
            const Icono = item.icono;

            return (
              <NavLink
                key={item.ruta}
                to={item.ruta}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                <Icono size={22} strokeWidth={1.7} />
                <span>{item.nombre}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button onClick={cerrarSesion} className="logout-button">
          <LogOut size={22} strokeWidth={1.7} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;