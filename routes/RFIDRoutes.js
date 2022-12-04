const router = require("express").Router();

const RFID = require("../models/RFID.js");

// Create - criação de dados
router.post("/", async (req, res) => {
  //req.body

  //{Modelo: "Apple", numeroP: "94839", Localizacao: "sala 1" }
  const { Modelo, NumeroP, Localizacao } = req.body;
  if (!req.body.NumeroP) {
    res.status(422).json({ error: "o NumeroP é obrigatório!" });
    return;
  }
  const posicao = {
    Modelo,
    NumeroP,
    Localizacao,
  };

  try {
    //criando dados
    await RFID.create(posicao);

    res
      .status(201)
      .json({ message: "aparelho inserido no sistema com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// //Read - leitura de dados
router.get('/', async (req, res) => {
    try{
        const getAll = await RFID.find();

        res.status(200).json(getAll)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

router.get('/:id', async (req, res) => {
 //extrair o dado da requisição, pela url = req.params
 const id = req.params.id

 try{
    const getOne = await RFID.findOne({ _id: id })

    if(!getOne){
        res.status(422).json({message: 'O ativo não foi encontrado'})
        return
    }

    res.status(200).json(getOne)

    } catch (error){
        res.status(500).json({ error: error})
    }
})

//update - atualização de dados (PUT, PATCH)
router.patch('/:id', async (req, res) => {

    const id = req.params.id

    const{ Modelo, NumeroP, Localizacao } = req.body

    const updateOne = {
        Modelo,
        NumeroP,
        Localizacao,
    }

    try {

        const updateRFID = await RFID.updateOne({_id: id}, updateOne)

        console.log(updateRFID)

        if (updateRFID.matchedCount === 0){
            res.status(422).json({message: 'O ativo não foi encontrado'})
            return
        }

        res.status(200).json(updateOne)

    }  catch(error) {
        res.status(500).json({ error: error})
    }

})

// // Delete - deletar dados
//     router.delete('/:id', async (req, res) => {

//         const id = req.params.id

//         const aparelhos = await Beacon.findOne({ _id: id })

//         if(!aparelhos){
//             res.status(422).json({message: 'O usuário não foi encontrado'})
//             return
//         }

//         try{

//             await Beacon.deleteOne({ _id: id})

//             res.status(200).json({message: 'Usuário removido com sucesso'})

//         }catch(error){
//             res.status(500).json({ error: error})
//         }
//     })

module.exports = router;
