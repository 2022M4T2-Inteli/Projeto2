const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencoder = bodyParser.urlencoded({extended:false});
const path = require('path');

  router.get("/Equipamentos", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Front-end/equi_cadastrados.html"));
  });

  router.get("/Mapa", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Front-end/mapa.html"));
  });

//   router.get("/infoDevice", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/infoDevice.html"));
//   });
//   router.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/loginpage.html"));
//   });
//   router.get("/paginaInicial", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/home.html"));
//   });
//   router.get("/requestlogin", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/requestlogin.html"));
//   });
//   router.get("/teste", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/teste.html"));
//   });
//   router.get("/teste2", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/teste2.html"));
//   });
//   router.get("/eletronicDevices", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/eletronicDevices.html"));
//   });
//   router.get("/mapNotEletronic", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/mapNotEletronic.html"));
//   });
//   router.get("/notEletronicMapteste", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/notEletronicMapteste.html"));
//   });
//   router.get("/home2", (req, res) => {
//     res.sendFile(path.join(__dirname, "../src/Frontend/paginas/home2.html"));
//   });

router.param('id', function(req, res, next, id) {
  req.id = id;
  next();
});


router.post('/buzina/:id', urlencoder, (req, res)=>{
  const id = req.params.id;
  const buzina = req.body.buzina;

  if(buzina == "1") res.send(buzina);
  else if (buzina == "0") res.send(buzina);

    console.log(buzina);
});

module.exports = router;