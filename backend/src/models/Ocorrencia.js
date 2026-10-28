const db = require('../config/database');

const Ocorrencia = {
  listarPorEstudante(estudanteId, { tipo, gravidade, de, ate } = {}) {
    let sql = 'SELECT * FROM ocorrencia WHERE estudante_id = ?';
    const params = [estudanteId];

    if (tipo) {
      sql += ' AND tipo = ?';
      params.push(tipo);
    }
    if (gravidade) {
      sql += ' AND gravidade = ?';
      params.push(gravidade);
    }
    if (de) {
      sql += ' AND data >= ?';
      params.push(de);
    }
    if (ate) {
      sql += ' AND data <= ?';
      params.push(ate);
    }

    sql += ' ORDER BY data DESC, id DESC';
    return db.prepare(sql).all(...params);
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM ocorrencia WHERE id = ?').get(id);
  },

  criar(estudanteId, d) {
    const resultado = db
      .prepare(`INSERT INTO ocorrencia (estudante_id, data, tipo, gravidade, descricao)
                VALUES (?, ?, ?, ?, ?)`)
      .run(estudanteId, d.data, d.tipo, d.gravidade, d.descricao);
    return this.buscarPorId(resultado.lastInsertRowid);
  },

  atualizar(id, d) {
    db.prepare(`UPDATE ocorrencia SET data = ?, tipo = ?, gravidade = ?, descricao = ?
                WHERE id = ?`)
      .run(d.data, d.tipo, d.gravidade, d.descricao, id);
    return this.buscarPorId(id);
  },

  apagar(id) {
    return db.prepare('DELETE FROM ocorrencia WHERE id = ?').run(id);
  },
};

module.exports = Ocorrencia;