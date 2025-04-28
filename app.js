const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const disciplinaRoutes = require('./routes/disciplina.routes');
const atividadeRoutes = require('./routes/atividade.routes');

app.use('/auth', authRoutes);
app.use('/disciplinas', disciplinaRoutes);
app.use('/atividades', atividadeRoutes);

module.exports = app;
