const fs = require('fs');
const os = require('os');
const path = require('path');
const db = require('../config/database');

const contar = (sql) => db.prepare(sql).get().n;

exports.painel = (req, res) => {
  res.json({
    total_estudantes: contar('SELECT COUNT(*) AS n FROM estudante'),
    total_ocorrencias: contar('SELECT COUNT(*) AS n FROM ocorrencia'),
    ocorrencias_mes: contar(
      `SELECT COUNT(*) AS n FROM ocorrencia
       WHERE strftime('%Y-%m', data) = strftime('%Y-%m', 'now', 'localtime')`
    ),
    graves: contar(`SELECT COUNT(*) AS n FROM ocorrencia WHERE gravidade = 'grave'`),
    por_tipo: db
      .prepare(`SELECT tipo, COUNT(*) AS total FROM ocorrencia
                GROUP BY tipo ORDER BY total DESC`)
      .all(),
    por_gravidade: db
      .prepare(`SELECT gravidade, COUNT(*) AS total FROM ocorrencia
                GROUP BY gravidade`)
      .all(),
    recentes: db
      .prepare(`SELECT o.id, o.estudante_id, o.data, o.tipo, o.gravidade,
                       e.nome AS estudante_nome
                FROM ocorrencia o
                JOIN estudante e ON e.id = o.estudante_id
                ORDER BY o.data DESC, o.id DESC
                LIMIT 6`)
      .all(),
  });
};

exports.backup = async (req, res) => {
  const destino = path.join(os.tmpdir(), `caderneta-${Date.now()}.db`);
  try {
    await db.backup(destino);
    const nome = `copia-caderneta-${new Date().toLocaleDateString('en-CA')}.db`;
    res.download(destino, nome, () => fs.unlink(destino, () => {}));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Não foi possível criar a cópia de segurança.' });
  }
};