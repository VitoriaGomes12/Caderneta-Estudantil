require('dotenv').config();
const db = require('./config/database');

const existentes = db.prepare('SELECT COUNT(*) AS n FROM estudante').get().n;
if (existentes > 0) {
  console.log('A base de dados já tem estudantes. Nada foi adicionado.');
  process.exit(0);
}

function dataRelativa(diasAtras) {
  const d = new Date();
  d.setDate(d.getDate() - diasAtras);
  return d.toLocaleDateString('en-CA');
}

const estudantes = [
  ['2026001', 'Ana Beatriz Fernandes', '000100001LA041', '2010-03-14', '923 000 101', 'Maria Fernandes', '10ª A'],
  ['2026002', 'Carlos Manuel Teixeira', '000100002LA042', '2009-11-02', '923 000 102', 'José Teixeira', '10ª A'],
  ['2026003', 'Helena da Silva Pinto', '000100003LA043', '2010-07-21', '923 000 103', 'Rosa Pinto', '10ª B'],
  ['2026004', 'João Paulo Mendes', '000100004LA044', '2009-05-30', '923 000 104', 'Paulo Mendes', '10ª B'],
  ['2026005', 'Luzia Domingas Gomes', '000100005LA045', '2010-01-09', '923 000 105', 'Domingas Gomes', '11ª A'],
  ['2026006', 'Miguel Ângelo Costa', '000100006LA046', '2008-12-18', '923 000 106', 'Ângela Costa', '11ª A'],
];

// [posição do estudante, dias atrás, tipo, gravidade, descrição]
const ocorrencias = [
  [0, 2, 'Atraso', 'leve', 'Chegou 15 minutos depois do início da aula.'],
  [0, 12, 'Elogio', 'leve', 'Ajudou os colegas no exercício de grupo.'],
  [1, 1, 'Falta de material', 'leve', 'Sem caderno e sem material de escrita.'],
  [1, 6, 'Indisciplina', 'media', 'Conversa constante durante a explicação.'],
  [1, 20, 'Conflito', 'grave', 'Discussão com um colega no recreio, foi preciso intervir.'],
  [2, 3, 'Falta', 'media', 'Faltou sem justificação.'],
  [3, 5, 'Atraso', 'leve', 'Terceiro atraso do mês.'],
  [3, 9, 'Indisciplina', 'grave', 'Recusou-se a cumprir uma instrução do professor.'],
  [4, 15, 'Elogio', 'leve', 'Excelente apresentação do trabalho de turma.'],
  [5, 4, 'Falta', 'media', 'Faltou às duas aulas da manhã.'],
];

const inserirEstudante = db.prepare(`
  INSERT INTO estudante
  (numero_processo, nome, bi, data_nascimento, contacto, encarregado, turma)
  VALUES (?, ?, ?, ?, ?, ?, ?)`);

const inserirOcorrencia = db.prepare(`
  INSERT INTO ocorrencia (estudante_id, data, tipo, gravidade, descricao)
  VALUES (?, ?, ?, ?, ?)`);

db.transaction(() => {
  const ids = estudantes.map((e) => inserirEstudante.run(...e).lastInsertRowid);
  ocorrencias.forEach(([pos, dias, tipo, gravidade, descricao]) => {
    inserirOcorrencia.run(ids[pos], dataRelativa(dias), tipo, gravidade, descricao);
  });
})();

console.log(`Adicionados ${estudantes.length} estudantes e ${ocorrencias.length} ocorrências de exemplo.`);