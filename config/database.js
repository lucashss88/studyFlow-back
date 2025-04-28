module.exports = {
    dialect: 'sqlite',
    storage: './database.sqlite',
    define: {
        timestamps: true, // adiciona createdAt e updatedAt
        underscored: true,
    },
};

