import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { TIPOS, GRAVIDADES } from '../constants';

// Data de hoje no formato AAAA-MM-DD, na hora local
const hoje = () => new Date().toLocaleDateString('en-CA');

export default function OcorrenciaForm() {
  const { estudanteId, id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    data: hoje(),
    tipo: TIPOS[0],
    gravidade: 'leve',
    descricao: '',
  });
  const [idEstudante, setIdEstudante] = useState(estudanteId || null);
  const [nomeEstudante, setNomeEstudante] = useState('');
  const [erro, setErro] = useState('');
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        let eid = estudanteId;

        if (id) {
          const { data } = await api.get(`/ocorrencias/${id}`);
          eid = data.estudante_id;
          setForm({
            data: data.data,
            tipo: data.tipo,
            gravidade: data.gravidade,
            descricao: data.descricao ?? '',
          });
        }

        setIdEstudante(eid);
        const resp = await api.get(`/estudantes/${eid}`);
        setNomeEstudante(resp.data.nome);
      } catch {
        setErro('Não foi possível carregar os dados.');
      }
    }
    carregar();
  }, [id, estudanteId]);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();

    if (form.data > hoje()) {
      setErro('A data da ocorrência não pode estar no futuro.');
      return;
    }

    setErro('');
    setAGuardar(true);
    try {
      if (id) {
        await api.put(`/ocorrencias/${id}`, form);
        toast.sucesso('Ocorrência actualizada.');
      } else {
        await api.post(`/estudantes/${estudanteId}/ocorrencias`, form);
        toast.sucesso('Ocorrência registada.');
      }
      navigate(`/estudantes/${idEstudante}`);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível guardar.');
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{id ? 'Editar ocorrência' : 'Nova ocorrência'}</h1>
          {nomeEstudante && <p>Estudante: {nomeEstudante}</p>}
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={enviar} className="painel">
        <div className="painel-corpo">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="data">Data *</label>
              <input
                id="data"
                type="date"
                className="form-control"
                name="data"
                max={hoje()}
                value={form.data}
                onChange={alterar}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="tipo">Tipo *</label>
              <select
                id="tipo"
                className="form-select"
                name="tipo"
                value={form.tipo}
                onChange={alterar}
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="gravidade">Gravidade *</label>
              <select
                id="gravidade"
                className="form-select"
                name="gravidade"
                value={form.gravidade}
                onChange={alterar}
              >
                {GRAVIDADES.map((g) => (
                  <option key={g.valor} value={g.valor}>{g.rotulo}</option>
                ))}
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                className="form-control"
                name="descricao"
                rows="4"
                maxLength="1000"
                value={form.descricao}
                onChange={alterar}
              />
            </div>
          </div>
        </div>
        <div className="painel-cabeca justify-content-end border-top border-bottom-0">
          <Link
            to={idEstudante ? `/estudantes/${idEstudante}` : '/estudantes'}
            className="btn btn-outline-secondary"
          >
            Cancelar
          </Link>
          <button className="btn btn-primary" disabled={aGuardar}>
            {aGuardar ? 'A guardar...' : 'Guardar ocorrência'}
          </button>
        </div>
      </form>
    </>
  );
}