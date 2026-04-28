import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  LogOut
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const menu = [
    {
      nombre: 'Dashboard',
      ruta: '/dashboard',
      icono: LayoutDashboard
    },
    {
      nombre: 'Productos',
      ruta: '/productos',
      icono: Package
    },
    {
      nombre: 'Clientes',
      ruta: '/clientes',
      icono: Users
    },
    {
      nombre: 'Ventas',
      ruta: '/ventas',
      icono: ShoppingCart
    },
    {
      nombre: 'Reportes',
      ruta: '/reportes',
      icono: BarChart3
    }
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <h1>PINKYPIE</h1>
          <p>ADMIN PANEL</p>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => {
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