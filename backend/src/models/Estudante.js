const db = require('../config/database');

const Estudante = {
  listar({ q, turma } = {}) {
  let sql = `SELECT e.*,
    (SELECT COUNT(*) FROM ocorrencia o
      WHERE o.estudante_id = e.id) AS total_ocorrencias,
    (SELECT COUNT(*) FROM ocorrencia o
      WHERE o.estudante_id = e.id AND o.gravidade = 'grave') AS total_graves
    FROM estudante e WHERE 1=1`;
  const params = [];

  if (q) {
    sql += ' AND (nome LIKE ? OR numero_processo LIKE ? OR bi LIKE ?)';
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  if (turma) {
    sql += ' AND turma = ?';
    params.push(turma);
  }

  sql += ' ORDER BY nome COLLATE NOCASE';
  return db.prepare(sql).all(...params);
},

  turmas() {
    return db
      .prepare(`SELECT DISTINCT turma FROM estudante
                WHERE turma IS NOT NULL AND turma != ''
                ORDER BY turma`)
      .all()
      .map((linha) => linha.turma);
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM estudante WHERE id = ?').get(id);
  },

  criar(d) {
    const resultado = db
      .prepare(`INSERT INTO estudante
        (numero_processo, nome, bi, data_nascimento, contacto, encarregado, turma)
        VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(d.numero_processo, d.nome, d.bi, d.data_nascimento,
           d.contacto, d.encarregado, d.turma);
    return this.buscarPorId(resultado.lastInsertRowid);
  },

  atualizar(id, d) {
    db.prepare(`UPDATE estudante SET
        numero_processo = ?, nome = ?, bi = ?, data_nascimento = ?,
        contacto = ?, encarregado = ?, turma = ?
        WHERE id = ?`)
      .run(d.numero_processo, d.nome, d.bi, d.data_nascimento,
           d.contacto, d.encarregado, d.turma, id);
    return this.buscarPorId(id);
  },

  apagar(id) {
    return db.prepare('DELETE FROM estudante WHERE id = ?').run(id);
  },
};

module.exports = Estudante;