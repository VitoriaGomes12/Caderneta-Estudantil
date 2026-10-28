import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { TIPOS, GRAVIDADES, dadosGravidade, formatarData } from '../constants';

export default function EstudanteDetalhe() {
  const { id } = useParams();
  const toast = useToast();
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
      toast.erro('Não foi possível carregar as ocorrências.');
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
      toast.sucesso('Ocorrência apagada.');
      carregarOcorrencias();
    } catch {
      toast.erro('Não foi possível apagar a ocorrência.');
    }
  }

  if (erro) {
    return (
      <>
        <div className="alert alert-danger">{erro}</div>
        <Link to="/estudantes" className="btn btn-outline-secondary">Voltar aos estudantes</Link>
      </>
    );
  }

  if (!estudante) return <p className="text-muted">A carregar...</p>;

  const temFiltros = Object.values(filtros).some(Boolean);

  return (
    <>
      <div className="so-impressao mb-3">
        <strong>Caderneta estudantil</strong>
        <div>Ficha do estudante, emitida em {new Date().toLocaleDateString('pt-PT')}</div>
      </div>

      <div className="page-head no-print">
        <Link to="/estudantes" className="btn btn-outline-secondary">Voltar</Link>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => window.print()}>
            Imprimir ficha
          </button>
          <Link to={`/estudantes/${estudante.id}/editar`} className="btn btn-outline-primary">
            Editar dados
          </Link>
        </div>
      </div>

      <section className="ficha mb-4">
        <h1>{estudante.nome}</h1>
        <p className="ficha-sub">
          Processo {estudante.numero_processo}
          {estudante.turma && `, turma ${estudante.turma}`}
        </p>

        <div className="dados-grid">
          <div>
            <div className="dado-rotulo">BI</div>
            <div className="dado-valor">{estudante.bi || 'Não indicado'}</div>
          </div>
          <div>
            <div className="dado-rotulo">Data de nascimento</div>
            <div className="dado-valor">
              {formatarData(estudante.data_nascimento) || 'Não indicada'}
            </div>
          </div>
          <div>
            <div className="dado-rotulo">Contacto</div>
            <div className="dado-valor">{estudante.contacto || 'Não indicado'}</div>
          </div>
          <div>
            <div className="dado-rotulo">Encarregado de educação</div>
            <div className="dado-valor">{estudante.encarregado || 'Não indicado'}</div>
          </div>
        </div>
      </section>

      <section className="painel">
        <div className="painel-cabeca">
          <h2>Ocorrências ({ocorrencias.length})</h2>
          <Link
            to={`/estudantes/${estudante.id}/ocorrencias/nova`}
            className="btn btn-primary btn-sm no-print"
          >
            Nova ocorrência
          </Link>
        </div>

        <div className="painel-corpo pb-0 no-print">
          <div className="row g-2">
            <div className="col-md-3">
              <select
                className="form-select"
                name="tipo"
                aria-label="Filtrar por tipo"
                value={filtros.tipo}
                onChange={alterarFiltro}
              >
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
                aria-label="Filtrar por gravidade"
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
                aria-label="Data inicial"
                value={filtros.de}
                onChange={alterarFiltro}
              />
            </div>
            <div className="col-md-2">
              <input
                type="date"
                className="form-control"
                name="ate"
                aria-label="Data final"
                value={filtros.ate}
                onChange={alterarFiltro}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={limparFiltros}>
                Limpar
              </button>
            </div>
          </div>
        </div>

        <div className="painel-corpo">
          {ocorrencias.length === 0 ? (
            <div className="vazio">
              {temFiltros ? (
                <>
                  <strong>Nenhuma ocorrência com estes filtros.</strong>
                  Limpa os filtros para ver todas.
                </>
              ) : (
                <>
                  <strong>Sem ocorrências registadas.</strong>
                  Quando houver uma, regista-a em "Nova ocorrência".
                </>
              )}
            </div>
          ) : (
            <ul className="timeline">
              {ocorrencias.map((o) => {
                const g = dadosGravidade(o.gravidade);
                return (
                  <li key={o.id} className={`timeline-item ${o.gravidade}`}>
                    <div className="d-flex justify-content-between gap-3 flex-wrap">
                      <div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <strong>{o.tipo}</strong>
                          <span className={g.classe}>{g.rotulo}</span>
                          <span className="text-muted small">{formatarData(o.data)}</span>
                        </div>
                        {o.descricao && <p className="mb-0 mt-1">{o.descricao}</p>}
                      </div>
                      <div className="no-print text-nowrap">
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
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}