import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const vazio = {
  numero_processo: '',
  nome: '',
  bi: '',
  data_nascimento: '',
  contacto: '',
  encarregado: '',
  turma: '',
};

function validar(f) {
  if (f.nome.trim().length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
  if (!f.numero_processo.trim()) return 'Indica o nº de processo.';
  if (f.data_nascimento && f.data_nascimento > new Date().toLocaleDateString('en-CA')) {
    return 'A data de nascimento não pode estar no futuro.';
  }
  return null;
}

export default function EstudanteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(vazio);
  const [erro, setErro] = useState('');
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/estudantes/${id}`)
      .then(({ data }) => {
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
    const problema = validar(form);
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setAGuardar(true);
    try {
      if (id) {
        await api.put(`/estudantes/${id}`, form);
        toast.sucesso('Dados do estudante actualizados.');
      } else {
        await api.post('/estudantes', form);
        toast.sucesso('Estudante cadastrado.');
      }
      navigate('/estudantes');
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
          <h1>{id ? 'Editar estudante' : 'Novo estudante'}</h1>
          <p>Os campos com * são obrigatórios.</p>
        </div>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      <form onSubmit={enviar} className="painel">
        <div className="painel-corpo">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label" htmlFor="numero_processo">Nº de processo *</label>
              <input
                id="numero_processo"
                className="form-control"
                name="numero_processo"
                value={form.numero_processo}
                onChange={alterar}
                required
              />
            </div>
            <div className="col-md-8">
              <label className="form-label" htmlFor="nome">Nome completo *</label>
              <input
                id="nome"
                className="form-control"
                name="nome"
                value={form.nome}
                onChange={alterar}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="bi">BI</label>
              <input id="bi" className="form-control" name="bi" value={form.bi} onChange={alterar} />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="data_nascimento">Data de nascimento</label>
              <input
                id="data_nascimento"
                type="date"
                className="form-control"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={alterar}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="turma">Turma</label>
              <input
                id="turma"
                className="form-control"
                name="turma"
                value={form.turma}
                onChange={alterar}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="contacto">Contacto</label>
              <input
                id="contacto"
                className="form-control"
                name="contacto"
                value={form.contacto}
                onChange={alterar}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="encarregado">Encarregado de educação</label>
              <input
                id="encarregado"
                className="form-control"
                name="encarregado"
                value={form.encarregado}
                onChange={alterar}
              />
            </div>
          </div>
        </div>
        <div className="painel-cabeca justify-content-end border-top border-bottom-0">
          <Link to="/estudantes" className="btn btn-outline-secondary">Cancelar</Link>
          <button className="btn btn-primary" disabled={aGuardar}>
            {aGuardar ? 'A guardar...' : 'Guardar estudante'}
          </button>
        </div>
      </form>
    </>
  );
}