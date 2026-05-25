import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';
import Procedures from './pages/Procedures';

import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'inventario', 'consulta']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'inventario', 'consulta']}>
              <Productos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'consulta']}>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ventas"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'consulta']}>
              <Ventas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'consulta']}>
              <Reportes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/procedures"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'inventario', 'consulta']}>
              <Procedures />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;