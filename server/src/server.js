const express = require("express");
const gamesRoutes = require("./routes/gameRoutes");
const porta = 4500;

app = express();

// Permite lidar com corpo da requisição em JSON ou URLEncoded
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

// Usa as rotas definidas no arquivo de rotas
app.use( gamesRoutes );

app.listen( porta, () => {
    console.log(`Servidor iniciado na porta ${porta}`);
})