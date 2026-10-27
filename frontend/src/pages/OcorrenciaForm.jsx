import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { TIPOS, GRAVIDADES } from '../constants';

// Data de hoje no formato AAAA-MM-DD, na hora local
const hoje = () => new Date().toLocaleDateString('en-CA');

export default function OcorrenciaForm() {
  const { estudanteId, id } = useParams();
  const navigate = useNavigate();

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
    setErro('');
    setAGuardar(true);
    try {
      if (id) {
        await api.put(`/ocorrencias/${id}`, form);
      } else {
        await api.post(`/estudantes/${estudanteId}/ocorrencias`, form);
      }
      navigate(`/estudantes/${idEstudante}`);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao guardar.');
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <>
      <h3 className="mb-1">{id ? 'Editar ocorrência' : 'Nova ocorrência'}</h3>
      {nomeEstudante && <p className="text-muted">Estudante: {nomeEstudante}</p>}

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={enviar} className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Data *</label>
              <input
                type="date"
                className="form-control"
                name="data"
                value={form.data}
                onChange={alterar}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Tipo *</label>
              <select className="form-select" name="tipo" value={form.tipo} onChange={alterar}>
                {TIPOS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Gravidade *</label>
              <select
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
              <label className="form-label">Descrição</label>
              <textarea
                className="form-control"
                name="descricao"
                rows="4"
                value={form.descricao}
                onChange={alterar}
              />
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <Link
            to={idEstudante ? `/estudantes/${idEstudante}` : '/estudantes'}
            className="btn btn-outline-secondary"
          >
            Cancelar
          </Link>
          <button className="btn btn-primary" disabled={aGuardar}>
            {aGuardar ? 'A guardar...' : 'Guardar'}
          </button>
        </div>
      </form>
    </>
  );
}