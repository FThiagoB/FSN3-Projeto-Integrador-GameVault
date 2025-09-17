const express = require("express");
const cors = require("cors")

const gamesRoutes = require("./routes/gameRoutes");

app = express();
const porta = 4500;

// Permite lidar com corpo da requisição em JSON ou URLEncoded
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );

app.use( cors() );

// Usa as rotas definidas no arquivo de rotas
app.use( gamesRoutes );

app.listen( porta, () => {
    console.log(`Servidor iniciado na porta ${porta}`);
})