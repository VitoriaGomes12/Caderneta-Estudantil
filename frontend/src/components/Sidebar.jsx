import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

function Icone({ d }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ICONES = {
  painel: 'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zM13 3v6h8V3h-8z',
  estudantes:
    'M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  copia: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  sair: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
};

const classeNav = ({ isActive }) => 'nav-item' + (isActive ? ' active' : '');

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  function sair() {
    logout();
    navigate('/login');
  }

  async function copiaSeguranca() {
    try {
      const { data } = await api.get('/backup', { responseType: 'blob' });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `copia-caderneta-${new Date().toLocaleDateString('en-CA')}.db`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.sucesso('Cópia de segurança descarregada.');
    } catch {
      toast.erro('Não foi possível criar a cópia de segurança.');
    }
  }

  return (
    <aside className="sidebar">
      <Link to="/painel" className="brand">
        <span className="brand-mark" />
        Caderneta
      </Link>

      <nav className="nav-lista">
        <NavLink to="/painel" className={classeNav}>
          <Icone d={ICONES.painel} /> Painel
        </NavLink>
        <NavLink to="/estudantes" className={classeNav}>
          <Icone d={ICONES.estudantes} /> Estudantes
        </NavLink>
      </nav>

      <div className="sidebar-fim">
        <button className="nav-item" onClick={copiaSeguranca}>
          <Icone d={ICONES.copia} /> Cópia de segurança
        </button>
        <button className="nav-item" onClick={sair}>
          <Icone d={ICONES.sair} /> Sair
        </button>
      </div>
    </aside>
  );
}