const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ erro: 'Indica o utilizador e a palavra-passe.' });
  }

  const utilizador = db
    .prepare('SELECT * FROM utilizador WHERE username = ?')
    .get(username);

  if (!utilizador || !bcrypt.compareSync(password, utilizador.password_hash)) {
    return res.status(401).json({ erro: 'Utilizador ou palavra-passe incorrectos.' });
  }

  const token = jwt.sign(
    { id: utilizador.id, username: utilizador.username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, username: utilizador.username });
};