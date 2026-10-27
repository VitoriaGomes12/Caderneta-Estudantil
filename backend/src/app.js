require('dotenv').config();

const express = require('express');
require('./config/database'); // inicia a base de dados

const auth = require('./middlewares/auth');
const authRoutes = require('./routes/authRoutes');
const estudanteRoutes = require('./routes/estudanteRoutes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/estudantes', auth, estudanteRoutes); // protegido pelo login

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API a correr em http://localhost:${PORT}`));