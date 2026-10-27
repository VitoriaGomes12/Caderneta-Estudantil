const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const pasta = path.join(__dirname, '../../database');
fs.mkdirSync(pasta, { recursive: true });

const db = new Database(path.join(pasta, 'dados.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS utilizador (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS estudante (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    numero_processo TEXT NOT NULL UNIQUE,
    nome TEXT NOT NULL,
    bi TEXT UNIQUE,
    data_nascimento TEXT,
    contacto TEXT,
    encarregado TEXT,
    turma TEXT,
    criado_em TEXT DEFAULT (datetime('now'))
  );
`);

// Cria o professor na primeira execução
const existe = db.prepare('SELECT COUNT(*) AS total FROM utilizador').get();
if (existe.total === 0) {
  const username = process.env.PROF_USER || 'professor';
  const password = process.env.PROF_PASS || 'admin123';
  db.prepare('INSERT INTO utilizador (username, password_hash) VALUES (?, ?)')
    .run(username, bcrypt.hashSync(password, 10));
  console.log(`Utilizador "${username}" criado.`);
}

module.exports = db;