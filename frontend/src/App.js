import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Reportes from './pages/Reportes';

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
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'inventario', 'consulta', 'supervisor']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'inventario', 'consulta', 'supervisor']}>
              <Productos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'consulta', 'supervisor']}>
              <Clientes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ventas"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'vendedor', 'consulta', 'supervisor']}>
              <Ventas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reportes"
          element={
            <ProtectedRoute rolesPermitidos={['admin', 'gerente', 'consulta', 'supervisor']}>
              <Reportes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;