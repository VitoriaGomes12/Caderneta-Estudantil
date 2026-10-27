import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { TIPOS, GRAVIDADES, dadosGravidade, formatarData } from '../constants';

export default function EstudanteDetalhe() {
  const { id } = useParams();
  const [estudante, setEstudante] = useState(null);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [filtros, setFiltros] = useState({ tipo: '', gravidade: '', de: '', ate: '' });
  const [erro, setErro] = useState('');

  useEffect(() => {
    api
      .get(`/estudantes/${id}`)
      .then(({ data }) => setEstudante(data))
      .catch(() => setErro('Estudante não encontrado.'));
  }, [id]);

  async function carregarOcorrencias() {
    try {
      const { data } = await api.get(`/estudantes/${id}/ocorrencias`, { params: filtros });
      setOcorrencias(data);
    } catch {
      setErro('Erro ao carregar as ocorrências.');
    }
  }

  useEffect(() => {
    carregarOcorrencias();
  }, [id, filtros]);

  function alterarFiltro(e) {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  }

  function limparFiltros() {
    setFiltros({ tipo: '', gravidade: '', de: '', ate: '' });
  }

  async function apagar(ocorrencia) {
    if (!window.confirm('Apagar esta ocorrência?')) return;
    try {
      await api.delete(`/ocorrencias/${ocorrencia.id}`);
      carregarOcorrencias();
    } catch {
      setErro('Erro ao apagar a ocorrência.');
    }
  }

  if (erro && !estudante) {
    return (
      <>
        <div className="alert alert-danger">{erro}</div>
        <Link to="/estudantes" className="btn btn-outline-secondary">Voltar</Link>
      </>
    );
  }

  if (!estudante) return <p className="text-muted">A carregar...</p>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">{estudante.nome}</h3>
        <div className="d-flex gap-2">
          <Link to="/estudantes" className="btn btn-outline-secondary">Voltar</Link>
          <Link to={`/estudantes/${estudante.id}/editar`} className="btn btn-outline-primary">
            Editar dados
          </Link>
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="text-muted small">Nº de processo</div>
              <div>{estudante.numero_processo}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">BI</div>
              <div>{estudante.bi || '—'}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Data de nascimento</div>
              <div>{formatarData(estudante.data_nascimento) || '—'}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Turma</div>
              <div>{estudante.turma || '—'}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Contacto</div>
              <div>{estudante.contacto || '—'}</div>
            </div>
            <div className="col-md-6">
              <div className="text-muted small">Encarregado de educação</div>
              <div>{estudante.encarregado || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Ocorrências ({ocorrencias.length})</h5>
        <Link
          to={`/estudantes/${estudante.id}/ocorrencias/nova`}
          className="btn btn-primary"
        >
          + Nova ocorrência
        </Link>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select className="form-select" name="tipo" value={filtros.tipo} onChange={alterarFiltro}>
            <option value="">Todos os tipos</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            name="gravidade"
            value={filtros.gravidade}
            onChange={alterarFiltro}
          >
            <option value="">Todas as gravidades</option>
            {GRAVIDADES.map((g) => (
              <option key={g.valor} value={g.valor}>{g.rotulo}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="de"
            value={filtros.de}
            onChange={alterarFiltro}
            title="De"
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            name="ate"
            value={filtros.ate}
            onChange={alterarFiltro}
            title="Até"
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-outline-secondary w-100" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Gravidade</th>
                <th>Descrição</th>
                <th className="text-end">Acções</th>
              </tr>
            </thead>
            <tbody>
              {ocorrencias.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    Nenhuma ocorrência encontrada.
                  </td>
                </tr>
              )}
              {ocorrencias.map((o) => {
                const g = dadosGravidade(o.gravidade);
                return (
                  <tr key={o.id}>
                    <td>{formatarData(o.data)}</td>
                    <td>{o.tipo}</td>
                    <td>
                      <span className={`badge ${g.classe}`}>{g.rotulo}</span>
                    </td>
                    <td>{o.descricao}</td>
                    <td className="text-end text-nowrap">
                      <Link
                        to={`/ocorrencias/${o.id}/editar`}
                        className="btn btn-sm btn-outline-secondary me-2"
                      >
                        Editar
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => apagar(o)}
                      >
                        Apagar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}