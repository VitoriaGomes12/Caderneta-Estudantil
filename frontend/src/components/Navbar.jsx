import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/estudantes">
          Sistema de Estudantes
        </Link>
        <button className="btn btn-outline-light btn-sm" onClick={sair}>
          Sair
        </button>
      </div>
    </nav>
  );
}