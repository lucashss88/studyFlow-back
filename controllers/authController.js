const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models')

const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const hash = await bcrypt.hash(senha, 10);
        const user = await User.create({ email, senha: hash });
        res.status(201).json({ token: gerarToken(user.id) });
    } catch (error) {
        res.status(400).json({ error: 'Erro ao registrar usuário' });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    console.log('Dados recebidos:', req.body);

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(senha, user.senha))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        res.json({ token: gerarToken(user.id) });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Erro ao realizar login' });
    }
};
