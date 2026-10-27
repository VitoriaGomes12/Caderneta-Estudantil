import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [aEntrar, setAEntrar] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setAEntrar(true);
    try {
      await login(username, password);
      navigate('/estudantes');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível entrar.');
    } finally {
      setAEntrar(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 400, marginTop: '15vh' }}>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h4 className="mb-4 text-center">Sistema de Estudantes</h4>

          {erro && <div className="alert alert-danger">{erro}</div>}

          <form onSubmit={enviar}>
            <div className="mb-3">
              <label className="form-label">Utilizador</label>
              <input
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Palavra-passe</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100" disabled={aEntrar}>
              {aEntrar ? 'A entrar...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}