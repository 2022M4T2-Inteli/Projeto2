const router = require('express').Router()

const Beacon = require('../models/Beacon')

// Create - criação de dados 
router.post('/', async (req, res) => {
    //req.body

    //{IDAtivo: "063389", Serie:65363, Modelo = Ipad, Cor: prata}
    const{ IDAtivo, Serie, Modelo, Cor } = req.body

    if(!IDAtivo){
        res.status(422).json({ error: 'o IDAtivo é obrigatório!'})
        return
    }

    const aparelhos = {
      IDAtivo,
      Serie,
      Modelo,
      Cor  
    }

    try {

        //criando dados
        await Beacon.create(aparelhos)

        res.status(201).json({message: 'aparelho inserido no sistema com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }

})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try{
        const beacons = await Beacon.find()

        res.status(200).json(beacons)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
 //extrair o dado da requisição, pela url = req.params
 const id = req.params.id 

 try{
    const aparelhos = await Beacon.findOne({ _id: id })

    if(!aparelhos){
        res.status(422).json({message: 'O usuário não foi encontrado'})
        return
    }

    res.status(200).json(aparelhos)

    } catch (error){
        res.status(500).json({ error: error})
    }
})

//update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const{ IDAtivo, Serie, Modelo, Cor } = req.body

    const aparelhos = {
        IDAtivo,
        Serie,
        Modelo,
        Cor,
    }

    try {

        const updateBeacon = await Beacon.updateOne({_id: id}, aparelhos)

        console.log(updateBeacon)

        if (updateBeacon.matchedCount === 0){
            res.status(422).json({message: 'O usuário não foi encontrado'})
            return
        }

        res.status(200).json(aparelhos)

    }  catch(error) {
        res.status(500).json({ error: error})
    }

})

// Delete - deletar dados 
    router.delete('/:id', async (req, res) => {

        const id = req.params.id 

        const aparelhos = await Beacon.findOne({ _id: id })

        if(!aparelhos){
            res.status(422).json({message: 'O usuário não foi encontrado'})
            return
        }

        try{

            await Beacon.deleteOne({ _id: id})

            res.status(200).json({message: 'Usuário removido com sucesso'})

        }catch(error){
            res.status(500).json({ error: error})
        }
    })

    module.exports = router 