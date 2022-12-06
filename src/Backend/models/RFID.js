const mongoose = require('mongoose')

const RFID = mongoose.model('RFID', {
    Modelo: String,
    NumeroP: Number,
    Localizacao: String,

})

module.exports = RFID 