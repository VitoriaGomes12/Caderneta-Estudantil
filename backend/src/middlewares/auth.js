const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const cabecalho = req.headers.authorization || '';
  const token = cabecalho.startsWith('Bearer ') ? cabecalho.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: 'Não autenticado.' });
  }

  try {
    req.utilizador = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
  }
};