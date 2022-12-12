const mongoose = require('mongoose')

const Eletronicos = mongoose.model('Eletronicos', {
    IDEletronico: String,
    NumeroPatrimonio: Number,
    NumeroSerie: Number,
    Modelo: String,
    Cor: String,
    LocalizacaoX: String,
    LocalizacaoY: String,

})

module.exports = Eletronicos