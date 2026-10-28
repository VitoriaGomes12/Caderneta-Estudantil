const Ocorrencia = require('../models/Ocorrencia');
const Estudante = require('../models/Estudante');

const GRAVIDADES = ['leve', 'media', 'grave'];

function limpar(body) {
  const campo = (valor) => {
    const texto = (valor ?? '').toString().trim();
    return texto === '' ? null : texto;
  };

  return {
    data: campo(body.data),
    tipo: campo(body.tipo),
    gravidade: campo(body.gravidade),
    descricao: campo(body.descricao),
  };
}

function validar(d) {
  if (!d.data || !d.tipo || !d.gravidade) {
    return 'Data, tipo e gravidade são obrigatórios.';
  }
  if (!GRAVIDADES.includes(d.gravidade)) {
    return 'Gravidade inválida.';
  }
  if (d.data > new Date().toLocaleDateString('en-CA')) {
    return 'A data da ocorrência não pode estar no futuro.';
  }
  if (d.descricao && d.descricao.length > 1000) {
    return 'A descrição pode ter no máximo 1000 caracteres.';
  }
  return null;
}

exports.listar = (req, res) => {
  const { estudanteId } = req.params;

  if (!Estudante.buscarPorId(estudanteId)) {
    return res.status(404).json({ erro: 'Estudante não encontrado.' });
  }

  const { tipo, gravidade, de, ate } = req.query;
  res.json(Ocorrencia.listarPorEstudante(estudanteId, { tipo, gravidade, de, ate }));
};

exports.criar = (req, res) => {
  const { estudanteId } = req.params;

  if (!Estudante.buscarPorId(estudanteId)) {
    return res.status(404).json({ erro: 'Estudante não encontrado.' });
  }

  const dados = limpar(req.body);
  const erro = validar(dados);
  if (erro) return res.status(400).json({ erro });

  res.status(201).json(Ocorrencia.criar(estudanteId, dados));
};

exports.buscar = (req, res) => {
  const ocorrencia = Ocorrencia.buscarPorId(req.params.id);
  if (!ocorrencia) return res.status(404).json({ erro: 'Ocorrência não encontrada.' });
  res.json(ocorrencia);
};

exports.atualizar = (req, res) => {
  if (!Ocorrencia.buscarPorId(req.params.id)) {
    return res.status(404).json({ erro: 'Ocorrência não encontrada.' });
  }

  const dados = limpar(req.body);
  const erro = validar(dados);
  if (erro) return res.status(400).json({ erro });

  res.json(Ocorrencia.atualizar(req.params.id, dados));
};

exports.apagar = (req, res) => {
  const resultado = Ocorrencia.apagar(req.params.id);
  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Ocorrência não encontrada.' });
  }
  res.status(204).end();
};