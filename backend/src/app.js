require('dotenv').config();

const express = require('express');
require('./config/database'); // inicia a base de dados

const auth = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes');
const estudanteRoutes = require('./routes/estudanteRoutes');
const ocorrenciaRoutes = require('./routes/ocorrenciaRoutes');
const sistemaRoutes = require('./routes/sistemaRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/estudantes', auth, estudanteRoutes);
app.use('/api', auth, ocorrenciaRoutes);
app.use('/api', auth, sistemaRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}`));