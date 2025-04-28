module.exports = (sequelize, DataTypes) => {
    const Disciplina = sequelize.define('Disciplina', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Disciplina.associate = (models) => {
        Disciplina.belongsTo(models.User, {
            foreignKey: 'usuarioId',
            as: 'usuario',
        });

        Disciplina.hasMany(models.Atividade, {
            foreignKey: 'disciplinaId',
            as: 'atividades',
            onDelete: 'CASCADE',
        });
    };

    return Disciplina;
};
