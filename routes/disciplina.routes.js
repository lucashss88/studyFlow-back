const express = require('express');
const router = express.Router();
const { Disciplina } = require('../models');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.post('/', async (req, res) => {
    const { nome } = req.body;
    try {
        const disciplina = await Disciplina.create({ nome, usuarioId: req.userId });
        res.status(201).json(disciplina);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar disciplina' });
    }
});

router.get('/', async (req, res) => {
    try {
        const disciplinas = await Disciplina.findAll({ where: { usuarioId: req.userId } });
        res.json(disciplinas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar disciplinas' });
    }
});

module.exports = router;
