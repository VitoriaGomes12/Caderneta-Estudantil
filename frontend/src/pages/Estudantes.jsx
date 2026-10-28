import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

function iniciais(nome) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

export default function Estudantes() {
  const toast = useToast();
  const [estudantes, setEstudantes] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [q, setQ] = useState('');
  const [turma, setTurma] = useState('');
  const [erro, setErro] = useState('');
  const [carregado, setCarregado] = useState(false);

  async function carregar() {
    try {
      const { data } = await api.get('/estudantes', { params: { q, turma } });
      setEstudantes(data);
      const resp = await api.get('/estudantes/turmas');
      setTurmas(resp.data);
      setErro('');
    } catch {
      setErro('Não foi possível carregar os estudantes.');
    } finally {
      setCarregado(true);
    }
  }

  useEffect(() => {
    carregar();
  }, [q, turma]);

  async function apagar(estudante) {
    const aviso = `Apagar ${estudante.nome}? As ocorrências dele também serão apagadas.`;
    if (!window.confirm(aviso)) return;
    try {
      await api.delete(`/estudantes/${estudante.id}`);
      toast.sucesso('Estudante apagado.');
      carregar();
    } catch {
      toast.erro('Não foi possível apagar o estudante.');
    }
  }

  const semFiltros = !q && !turma;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Estudantes</h1>
          <p>
            {estudantes.length} {estudantes.length === 1 ? 'estudante' : 'estudantes'}
            {!semFiltros && ' encontrados'}
          </p>
        </div>
        <Link to="/estudantes/novo" className="btn btn-primary">
          Novo estudante
        </Link>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Pesquisar por nome, nº de processo ou BI"
            aria-label="Pesquisar estudantes"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            aria-label="Filtrar por turma"
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

      <div className="painel">
        <div className="table-responsive">
          <table className="tabela">
            <thead>
              <tr>
                <th>Nº processo</th>
                <th>Estudante</th>
                <th>Turma</th>
                <th>Contacto</th>
                <th>Ocorrências</th>
                <th className="acoes">Acções</th>
              </tr>
            </thead>
            <tbody>
              {carregado && estudantes.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="vazio">
                      {semFiltros ? (
                        <>
                          <strong>Ainda não há estudantes.</strong>
                          Cadastra o primeiro para começar a registar ocorrências.
                        </>
                      ) : (
                        <>
                          <strong>Nenhum estudante encontrado.</strong>
                          Tenta outro nome, nº de processo ou turma.
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {estudantes.map((e) => (
                <tr key={e.id}>
                  <td className="text-nowrap">{e.numero_processo}</td>
                  <td>
                    <Link to={`/estudantes/${e.id}`} className="aluno">
                      <span className="avatar">{iniciais(e.nome)}</span>
                      <span>{e.nome}</span>
                    </Link>
                  </td>
                  <td>{e.turma}</td>
                  <td className="text-nowrap">{e.contacto}</td>
                  <td className="text-nowrap">
                    <Link to={`/estudantes/${e.id}`} className="ocorr-link">
                      {e.total_ocorrencias > 0 ? (
                        <>
                          <span className="contagem">{e.total_ocorrencias}</span>
                          {e.total_graves > 0 && (
                            <span className="tag tag-grave ms-2">
                              {e.total_graves} {e.total_graves === 1 ? 'grave' : 'graves'}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-muted">Sem ocorrências</span>
                      )}
                    </Link>
                  </td>
                  <td className="acoes">
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