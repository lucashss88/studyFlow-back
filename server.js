const app = require('./app');
const { syncDB, resetDB} = require('./models');

const PORT = process.env.PORT || 5000;

syncDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
});
