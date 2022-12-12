const mongoose = require('mongoose')

const Eletronicos = mongoose.model('Eletronicos', {
    IDEletronico: String,
    NumeroPatrimonio: Number,
    NumeroSerie: Number,
    Modelo: String,
    Cor: String,
    LocalizacaoX: Number,
    LocalizacaoY: Number,
})

module.exports = Eletronicos