module.exports = (sequelize, DataTypes) => {
    const Atividade = sequelize.define('Atividade', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        finalizada: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Atividade.associate = (models) => {
        Atividade.belongsTo(models.User, {
            foreignKey: 'usuarioId',
            as: 'usuario',
        });

        Atividade.belongsTo(models.Disciplina, {
            foreignKey: 'disciplinaId',
            as: 'disciplina',
        });
    };

    return Atividade;
};
