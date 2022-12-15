const PORT = 5500;
const HOST = "10.128.64.20";

const getPositions = () => {
    const ctx = document.getElementById("ctx").getContext("2d");
    const Cwidht = 1100;
    const Cheight = 550;

    var Img = {
        terreo:new Image(),
        andar1:new Image(),
        andar2:new Image()
    }
    
    Img.terreo.src = "../assets/campus-terreo.jpg";
    console.log("AAAAAAAAAAAAAAA");
    drawMap();

    var drawMap = ()=>{
        let imgMap = Img.terreo;
        let width = imgMap.width;
		let height = imgMap.height;
        ctx.drawImage(imgMap,300,300,width,height);
    }

    $.ajax({
        async: true,
        url: `http://${HOST}:${PORT}/Eletronicos`,
        type: 'GET',
        success: data => {
            data.forEach(element => {
                console.log(element.LocalizacaoX, element.LocalizacaoY);
            })
        }
    });
}
getPositions();

