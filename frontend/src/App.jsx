import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Estudantes from './pages/Estudantes';
import EstudanteForm from './pages/EstudanteForm';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/estudantes" element={<Estudantes />} />
        <Route path="/estudantes/novo" element={<EstudanteForm />} />
        <Route path="/estudantes/:id/editar" element={<EstudanteForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/estudantes" replace />} />
    </Routes>
  );
}