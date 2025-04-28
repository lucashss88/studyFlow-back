const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importa os modelos
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Disciplina = require('./Disciplina')(sequelize, Sequelize.DataTypes);
db.Atividade = require('./Atividade')(sequelize, Sequelize.DataTypes);

Object.values(db).forEach((model) => {
    if (model.associate) {
        model.associate(db);
    }
});

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Banco de dados sincronizado!');
    } catch (error) {
        console.error('Erro ao sincronizar o banco de dados:', error);
    }
};

const resetDB = async () => {
    try {
        await sequelize.drop();         // apaga tudo
        await sequelize.sync({ force: true }); // recria do zero
        console.log('Banco resetado com sucesso!');
    } catch (error) {
        console.error('Erro ao resetar banco:', error);
    }
};

module.exports = { ...db, syncDB, resetDB };
