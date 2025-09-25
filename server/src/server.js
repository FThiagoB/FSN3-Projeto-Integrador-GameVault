//server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const gamesRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const addressRoutes = require("./routes/addressRoutes");
const couponRoutes = require("./routes/couponRoutes");
const shippingMethodRoutes = require("./routes/shippingMethodRoutes");
const adminRoutes = require("./routes/adminRoutes");

app = express();
const porta = 4500;

// Permite lidar com corpo da requisição em JSON ou URLEncoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
  "/uploads/games",
  express.static(path.join(__dirname, "src", "uploads", "games"))
);

// Usa as rotas definidas no arquivo de rotas
app.use(authRoutes);
app.use(gamesRoutes);
app.use(userRoutes);
app.use(orderRoutes);
app.use(addressRoutes);
app.use(couponRoutes)
app.use(shippingMethodRoutes);
app.use(adminRoutes);

app.listen(porta, () => {
  console.log(`Servidor iniciado na porta http://localhost:${porta}`);
});
