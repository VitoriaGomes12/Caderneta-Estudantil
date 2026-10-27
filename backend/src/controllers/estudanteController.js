const Estudante = require('../models/Estudante');

// Limpa os espaços e transforma campos vazios em null
function limpar(body) {
  const campo = (valor) => {
    const texto = (valor ?? '').toString().trim();
    return texto === '' ? null : texto;
  };

  return {
    numero_processo: campo(body.numero_processo),
    nome: campo(body.nome),
    bi: campo(body.bi),
    data_nascimento: campo(body.data_nascimento),
    contacto: campo(body.contacto),
    encarregado: campo(body.encarregado),
    turma: campo(body.turma),
  };
}

function tratarErro(err, res) {
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ erro: 'Já existe um estudante com esse nº de processo ou BI.' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}

exports.listar = (req, res) => {
  const { q, turma } = req.query;
  res.json(Estudante.listar({ q, turma }));
};

exports.turmas = (req, res) => {
  res.json(Estudante.turmas());
};

exports.buscar = (req, res) => {
  const estudante = Estudante.buscarPorId(req.params.id);
  if (!estudante) return res.status(404).json({ erro: 'Estudante não encontrado.' });
  res.json(estudante);
};

exports.criar = (req, res) => {
  const dados = limpar(req.body);

  if (!dados.nome || !dados.numero_processo) {
    return res.status(400).json({ erro: 'Nome e nº de processo são obrigatórios.' });
  }

  try {
    res.status(201).json(Estudante.criar(dados));
  } catch (err) {
    tratarErro(err, res);
  }
};

exports.atualizar = (req, res) => {
  if (!Estudante.buscarPorId(req.params.id)) {
    return res.status(404).json({ erro: 'Estudante não encontrado.' });
  }

  const dados = limpar(req.body);

  if (!dados.nome || !dados.numero_processo) {
    return res.status(400).json({ erro: 'Nome e nº de processo são obrigatórios.' });
  }

  try {
    res.json(Estudante.atualizar(req.params.id, dados));
  } catch (err) {
    tratarErro(err, res);
  }
};

exports.apagar = (req, res) => {
  const resultado = Estudante.apagar(req.params.id);
  if (resultado.changes === 0) {
    return res.status(404).json({ erro: 'Estudante não encontrado.' });
  }
  res.status(204).end();
};