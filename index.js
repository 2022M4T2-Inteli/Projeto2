//configuração inicial
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5500;

// forma de ler JSON / middlewares
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//rotas da API
const aparelhosRoutes = require("./routes/aparelhosRoutes");
const RFIDRoutes = require("./routes/RFIDRoutes");

app.use("/aparelhos", aparelhosRoutes);
app.use("/RFID", RFIDRoutes);

//rota inicial / endpoint
app.get("/", (req, res) => {
  //mostrar req
  console.log(req);

  res.json({ message: "oi express!" });
});

require("dotenv").config();

//entregar uma porta
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_PASSWORD}@apicluster.cpk5sas.mongodb.net/bancobeacon?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("conectamos ao MongoDB!");
    app.listen(PORT);
    console.log(`App listening on http://127.0.0.1:${PORT}`);
  })
  .catch((err) => console.log(err));
