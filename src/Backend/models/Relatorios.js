const mongoose = require('mongoose')

const Relatorios = mongoose.model('Relatorios', {
    ID: String,
    Mes: String,
    DispositivosEmprestados: Number,
    DispositosPerdidos: Number,

})

module.exports = Relatorios