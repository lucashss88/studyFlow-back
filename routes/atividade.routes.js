const express = require('express');
const router = express.Router();
const { Atividade, Disciplina } = require('../models');
const authenticate = require('../middlewares/authMiddleware');
const { Op, fn, col} = require('sequelize');

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

router.get('/recentes', async (req, res) => {
    try{
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);

        const atividadesRecentes = await Atividade.findAll({
            where: {
                data: {
                    [Op.gte]: seteDiasAtras
                },
                finalizada: true,
                usuarioId: req.userId
            },
            order: [['data', 'ASC']]
        });
        res.json(atividadesRecentes);
    } catch (e) {
        console.log(e);
        res.status(500).send('Erro ao buscar atividades recentes');
    }
});

router.get('/por-disciplina', async (req, res) => {
    const {periodo = 'semana'} = req.query;

    const hoje = new Date();
    let dataInicio;

    switch (periodo) {
        case 'dia':
            dataInicio = new Date(hoje);
            break;
        case 'mes':
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
            break;
        case 'semana':
        default:
            dataInicio = new Date();
            dataInicio.setDate(hoje.getDate() - 6);
    }

    try {
        const resultados = await Atividade.findAll({
            where: {
                data: {
                    [Op.gte]: dataInicio,
                },
                finalizada:true,
                usuarioId: req.userId
            },
            include: [{model: Disciplina, as: 'disciplina', attributes: ['nome']}],
            attributes: [
                [fn('SUM', col('duracao')), 'totalDuracao'],
                [col('disciplina.Nome'), 'disciplinaNome']
            ],
            group: ['disciplina.nome'],
            raw: true
        });

        res.json(resultados);
    } catch (e) {
        console.log(e);
        res.status(500).json({erro: 'Erro ao obter dados'});
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
