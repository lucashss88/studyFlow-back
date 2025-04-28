const express = require('express');
const router = express.Router();
const { Atividade, Disciplina } = require('../models');
const authenticate = require('../middlewares/authMiddleware');

router.use(authenticate);

router.post('/', async (req, res) => {
    const { nome, data, disciplinaId } = req.body;
    try {
        const atividade = await Atividade.create({
            nome,
            data,
            disciplinaId,
            usuarioId: req.userId,
        });
        res.status(201).json(atividade);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar atividade' });
    }
});

router.get('/', async (req, res) => {
    try {
        const atividades = await Atividade.findAll({
            where: { usuarioId: req.userId },
            include: { model: Disciplina, as: 'disciplina', attributes: ['nome'] },
        });
        res.json(atividades);
    } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        res.status(500).json({ error: 'Erro ao buscar atividades' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    try{
        const atividade = await Atividade.findByPk(id);
        if (!atividade) {
            return res.status(404).json({ message: 'Atividade não encontrada' });
        }

        atividade.nome = nome;
        await atividade.save();

        res.json({ message: 'Atividade atualizada com suceso' });
    } catch (error) {
        console.error('Erro ao editar atividade:', error);
        res.status(500).json({ mensagem: 'Erro interno ao editar atividade' });
    }
});

router.put('/:id/finalizar', async (req, res) => {
    const { id } = req.params;
    const { duracao } = req.body;

    try {
        const atividade = await Atividade.findOne({
            where: { id, usuarioId: req.userId },
        });

        if (!atividade) {
            return res.status(404).json({ error: 'Atividade não encontrada' });
        }

        atividade.duracao = duracao;
        atividade.finalizada = true;
        await atividade.save();

        res.json(atividade);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao finalizar atividade' });
    }
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const atividade = await Atividade.findByPk(id);
        if (!atividade) {
            return res.status(404).json({ mensagem: 'Atividade não encontrada' });
        }

        await atividade.destroy();
    } catch (error) {
        console.error('Erro ao excluir atividade:', error);
        res.status(500).json({ mensagem: 'Erro interno ao excluir atividade' });
    }
})

module.exports = router;
