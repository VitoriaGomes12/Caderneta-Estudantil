import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';

const vazio = {
  numero_processo: '',
  nome: '',
  bi: '',
  data_nascimento: '',
  contacto: '',
  encarregado: '',
  turma: '',
};

export default function EstudanteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/estudantes/${id}`)
      .then(({ data }) => {
        // troca null por texto vazio para os inputs
        const dados = {};
        Object.keys(vazio).forEach((campo) => {
          dados[campo] = data[campo] ?? '';
        });
        setForm(dados);
      })
      .catch(() => setErro('Estudante não encontrado.'));
  }, [id]);

  function alterar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setAGuardar(true);
    try {
      if (id) {
        await api.put(`/estudantes/${id}`, form);
      } else {
        await api.post('/estudantes', form);
      }
      navigate('/estudantes');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao guardar.');
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <>
      <h3 className="mb-3">{id ? 'Editar estudante' : 'Novo estudante'}</h3>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={enviar} className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Nº de processo *</label>
              <input
                className="form-control"
                name="numero_processo"
                value={form.numero_processo}
                onChange={alterar}
                required
              />
            </div>
            <div className="col-md-8">
              <label className="form-label">Nome completo *</label>
              <input
                className="form-control"
                name="nome"
                value={form.nome}
                onChange={alterar}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">BI</label>
              <input
                className="form-control"
                name="bi"
                value={form.bi}
                onChange={alterar}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Data de nascimento</label>
              <input
                type="date"
                className="form-control"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={alterar}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Turma</label>
              <input
                className="form-control"
                name="turma"
                value={form.turma}
                onChange={alterar}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Contacto</label>
              <input
                className="form-control"
                name="contacto"
                value={form.contacto}
                onChange={alterar}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Encarregado de educação</label>
              <input
                className="form-control"
                name="encarregado"
                value={form.encarregado}
                onChange={alterar}
              />
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <Link to="/estudantes" className="btn btn-outline-secondary">
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