// utils/hashSenha.js
const bcrypt = require('bcryptjs');

const gerarSenhaHash = async () => {
    const senha = '123456'; // sua senha aqui
    const hash = await bcrypt.hash(senha, 10);
    console.log('Senha criptografada:', hash);
};

gerarSenhaHash();
