//configuração inicial
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5500;
const hostname = "10.128.64.20";

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
const EletronicosRoutes = require("./routes/EletronicosRoutes");
const RelatoriosRoutes = require("./routes/RelatoriosRoutes");

const RoutesFront = require("./routes/RoutesFront");

app.use("/aparelhos", aparelhosRoutes);
app.use("/RFID", RFIDRoutes);
app.use("/Eletronicos", EletronicosRoutes);
app.use("/Relatorios", RelatoriosRoutes);

app.use(express.static("../Front-end"));
const RouterFront = require('./routes/routesFront.js');
app.use('/', RouterFront);

//rota inicial / endpoint
app.get("/", (req, res) => {
  //mostrar req
  console.log(req);

  res.json({ message: "oi express!" });
});




app.post('/buzina', (req, res)=>{
  const buzina = req.body.buzina;
  const id = req.params.id;

  if(buzina == "1") res.send(buzina);
  else if (buzina == "0") res.send(buzina);

    console.log(buzina);
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
    app.listen(PORT, hostname, () => {
      console.log(`App listening on http://${hostname}:${PORT}/`);
  })
})
  .catch((err) => console.log(err));
