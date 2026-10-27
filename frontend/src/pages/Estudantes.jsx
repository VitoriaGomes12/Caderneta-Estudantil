import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Estudantes() {
  const [estudantes, setEstudantes] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [q, setQ] = useState('');
  const [turma, setTurma] = useState('');
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      const { data } = await api.get('/estudantes', { params: { q, turma } });
      setEstudantes(data);
      const resp = await api.get('/estudantes/turmas');
      setTurmas(resp.data);
    } catch {
      setErro('Erro ao carregar os estudantes.');
    }
  }

  useEffect(() => {
    carregar();
  }, [q, turma]);

  async function apagar(estudante) {
    const aviso = `Apagar o estudante ${estudante.nome}? As ocorrências dele também serão apagadas.`;
    if (!window.confirm(aviso)) return;
    try {
      await api.delete(`/estudantes/${estudante.id}`);
      carregar();
    } catch {
      setErro('Erro ao apagar o estudante.');
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Estudantes</h3>
        <Link to="/estudantes/novo" className="btn btn-primary">
          + Novo estudante
        </Link>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Pesquisar por nome, nº de processo ou BI..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={turma}
            onChange={(e) => setTurma(e.target.value)}
          >
            <option value="">Todas as turmas</option>
            {turmas.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Nº Processo</th>
                <th>Nome</th>
                <th>Turma</th>
                <th>Contacto</th>
                <th>Ocorrências</th>
                <th className="text-end">Acções</th>
              </tr>
            </thead>
            <tbody>
              {estudantes.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    Nenhum estudante encontrado.
                  </td>
                </tr>
              )}
              {estudantes.map((e) => (
                <tr key={e.id}>
                  <td>{e.numero_processo}</td>
                  <td>
                    <Link
                      to={`/estudantes/${e.id}`}
                      className="text-decoration-none fw-semibold"
                    >
                      {e.nome}
                    </Link>
                  </td>
                  <td>{e.turma}</td>
                  <td>{e.contacto}</td>
                  <td className="text-nowrap">
                    <Link
                      to={`/estudantes/${e.id}`}
                      className="text-decoration-none"
                    >
                      {e.total_ocorrencias > 0 ? (
                        <>
                          <span className="badge bg-secondary me-1">
                            {e.total_ocorrencias}
                          </span>
                          {e.total_graves > 0 && (
                            <span className="badge bg-danger">
                              {e.total_graves} grave(s)
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted">Sem ocorrências</span>
                      )}
                    </Link>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link
                      to={`/estudantes/${e.id}/editar`}
                      className="btn btn-sm btn-outline-secondary me-2"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => apagar(e)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}