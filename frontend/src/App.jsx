import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Estudantes from './pages/Estudantes';
import EstudanteForm from './pages/EstudanteForm';
import EstudanteDetalhe from './pages/EstudanteDetalhe';
import OcorrenciaForm from './pages/OcorrenciaForm';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/estudantes" element={<Estudantes />} />
        <Route path="/estudantes/novo" element={<EstudanteForm />} />
        <Route path="/estudantes/:id" element={<EstudanteDetalhe />} />
        <Route path="/estudantes/:id/editar" element={<EstudanteForm />} />
        <Route path="/estudantes/:estudanteId/ocorrencias/nova" element={<OcorrenciaForm />} />
        <Route path="/ocorrencias/:id/editar" element={<OcorrenciaForm />} />
      </Route>

      <Route path="*" element={<Navigate to="/estudantes" replace />} />
    </Routes>
  );
}