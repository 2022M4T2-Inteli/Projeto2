const mongoose = require('mongoose')

const Beacon = mongoose.model('Beacon', {
    IDAtivo: String,
    Serie: String,
    Modelo: String,
    Cor: String, 

})

module.exports = Beacon 