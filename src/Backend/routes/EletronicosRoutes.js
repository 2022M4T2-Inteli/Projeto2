const router = require('express').Router()

const Eletronicos = require('../models/Eletronicos')

// Create - criação de dados 
router.post('/', async (req, res) => {
    //req.body

    //{ID: "0687689", NumeroPatrimonio: 77633, Modelo = apple, Cor: prata, Localizacao: sala 5}
    const{ IDEletronico, NumeroPatrimonio, NumeroSerie, Modelo, Cor, LocalizacaoX, LocalizacaoY} = req.body

    if(!IDEletronico){
        res.status(422).json({ error: 'o ID é obrigatório!'})
        return
    }

    const PostOne = {
      IDEletronico,
      NumeroPatrimonio,
      NumeroSerie,
      Modelo,
      Cor,
      LocalizacaoX,
      LocalizacaoY,
    }

    try {

        //criando dados
        await Eletronicos.create(PostOne)

        res.status(201).json({message: 'aparelho inserido no sistema com sucesso'})

    } catch (error) {
        res.status(500).json({error: error})
    }

})

//Read - leitura de dados
router.get('/', async (req, res) => {
    try{
        const eletronicos = await Eletronicos.find()

        res.status(200).json(eletronicos)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
 //extrair o dado da requisição, pela url = req.params
 const id = req.params.id 

 try{
    const GetOne = await Eletronicos.findOne({ _id: id })

    if(!GetOne){
        res.status(422).json({message: 'O eletronico não foi encontrado'})
        return
    }

    res.status(200).json(GetOne)

    } catch (error){
        res.status(500).json({ error: error})
    }
})

//update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const{ IDEletronico, NumeroPatrimonio, NumeroSerie, Modelo, Cor, LocalizacaoX, LocalizacaoY} = req.body

    const UpdateOne = {
      IDEletronico,
      NumeroPatrimonio,
      NumeroSerie,
      Modelo,
      Cor,
      LocalizacaoX,
      LocalizacaoY
    }

    try {

        const updateEletronicos = await Eletronicos.updateOne({_id: id}, UpdateOne)

        console.log(updateEletronicos)

        if (updateEletronicos.matchedCount === 0){
            res.status(422).json({message: 'O eletronico não foi encontrado'})
            return
        }

        res.status(200).json(UpdateOne)

    }  catch(error) {
        res.status(500).json({ error: error})
    }

})

// Delete - deletar dados 
    router.delete('/:id', async (req, res) => {

        const id = req.params.id 

        const DeleteOne = await Eletronicos.findOne({ _id: id })

        if(!DeleteOne){
            res.status(422).json({message: 'O aparelho não foi encontrado'})
            return
        }

        try{

            await Eletronicos.deleteOne({ _id: id})

            res.status(200).json({message: 'Aparelho removido com sucesso'})

        }catch(error){
            res.status(500).json({ error: error})
        }
    })

    module.exports = router 