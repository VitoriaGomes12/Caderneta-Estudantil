import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { GRAVIDADES, dadosGravidade, formatarData } from '../constants';

function saudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 19) return 'Boa tarde';
  return 'Boa noite';
}

export default function Painel() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    api
      .get('/painel')
      .then(({ data }) => setDados(data))
      .catch(() => setErro('Não foi possível carregar o painel.'));
  }, []);

  if (erro) return <div className="alert alert-danger">{erro}</div>;
  if (!dados) return <p className="text-muted">A carregar...</p>;

  const maxTipo = Math.max(1, ...dados.por_tipo.map((t) => t.total));
  const totalGravidade = dados.por_gravidade.reduce((soma, g) => soma + g.total, 0);
  const contagem = (valor) =>
    dados.por_gravidade.find((g) => g.gravidade === valor)?.total || 0;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Painel</h1>
          <p>{saudacao()}. Este é o resumo da caderneta.</p>
        </div>
        <Link to="/estudantes/novo" className="btn btn-primary">
          Novo estudante
        </Link>
      </div>

      <div className="painel resumo">
        <div className="resumo-item">
          <div className="resumo-num">{dados.total_estudantes}</div>
          <div className="resumo-txt">Estudantes</div>
        </div>
        <div className="resumo-item">
          <div className="resumo-num">{dados.total_ocorrencias}</div>
          <div className="resumo-txt">Ocorrências registadas</div>
        </div>
        <div className="resumo-item">
          <div className="resumo-num">{dados.ocorrencias_mes}</div>
          <div className="resumo-txt">Ocorrências este mês</div>
        </div>
        <div className="resumo-item alerta">
          <div className="resumo-num">{dados.graves}</div>
          <div className="resumo-txt">Ocorrências graves</div>
        </div>
      </div>

      <div className="painel-grid">
        <section className="painel">
          <div className="painel-cabeca">
            <h2>Ocorrências recentes</h2>
            <Link to="/estudantes" className="btn btn-sm btn-outline-secondary">
              Ver estudantes
            </Link>
          </div>

          {dados.recentes.length === 0 ? (
            <div className="vazio">
              <strong>Ainda não há ocorrências.</strong>
              Abre a ficha de um estudante para registar a primeira.
            </div>
          ) : (
            <ul className="recentes">
              {dados.recentes.map((o) => (
                <li key={o.id}>
                  <div>
                    <Link to={`/estudantes/${o.estudante_id}`} className="aluno">
                      {o.estudante_nome}
                    </Link>
                    <div className="text-muted small">{o.tipo}</div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="data">{formatarData(o.data)}</span>
                    <span className={dadosGravidade(o.gravidade).classe}>
                      {dadosGravidade(o.gravidade).rotulo}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="d-flex flex-column gap-3">
          <section className="painel">
            <div className="painel-cabeca">
              <h2>Ocorrências por tipo</h2>
            </div>
            <div className="painel-corpo">
              {dados.por_tipo.length === 0 && (
                <span className="text-muted">Sem dados para mostrar.</span>
              )}
              {dados.por_tipo.map((t) => (
                <div className="barra-linha" key={t.tipo}>
                  <span>{t.tipo}</span>
                  <div className="barra">
                    <span style={{ width: `${(t.total / maxTipo) * 100}%` }} />
                  </div>
                  <strong>{t.total}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="painel">
            <div className="painel-cabeca">
              <h2>Ocorrências por gravidade</h2>
            </div>
            <div className="painel-corpo">
              {totalGravidade === 0 ? (
                <span className="text-muted">Sem dados para mostrar.</span>
              ) : (
                <>
                  <div className="seg">
                    {GRAVIDADES.map(
                      (g) =>
                        contagem(g.valor) > 0 && (
                          <span
                            key={g.valor}
                            className={g.valor}
                            style={{ width: `${(contagem(g.valor) / totalGravidade) * 100}%` }}
                          />
                        )
                    )}
                  </div>
                  <div className="legenda">
                    {GRAVIDADES.map((g) => (
                      <span key={g.valor}>
                        <i className={g.valor} />
                        {g.rotulo}: {contagem(g.valor)}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}