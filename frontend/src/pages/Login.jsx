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
      navigate('/painel');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível entrar. Verifica a ligação ao servidor.');
    } finally {
      setAEntrar(false);
    }
  }

  return (
    <div className="login-pagina">
      <section className="login-capa">
        <span className="brand-mark" />
        <h1>Caderneta estudantil</h1>
        <p>Os dados dos estudantes e o registo de ocorrências, num só lugar.</p>
      </section>

      <section className="login-form-area">
        <form className="login-form" onSubmit={enviar}>
          <h2>Entrar</h2>

          {erro && <div className="alert alert-danger">{erro}</div>}

          <div className="mb-3">
            <label className="form-label" htmlFor="utilizador">Utilizador</label>
            <input
              id="utilizador"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="palavra-passe">Palavra-passe</label>
            <input
              id="palavra-passe"
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
      </section>
    </div>
  );
}