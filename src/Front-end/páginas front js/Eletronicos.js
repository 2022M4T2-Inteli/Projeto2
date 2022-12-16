const PORT = 5500;
const HOST = "192.168.1.58" //"10.128.64.20";

var currentClass = "Sala-00";

const getEletric = () => {
const tbodyEle = document.getElementById("tbodyEle");
tbodyEle.innerHTML = "";

    $.ajax({
        async: true,
        url: `http://${HOST}:${PORT}/Eletronicos`,
        type: 'GET',
        success: data => {
            data.forEach(element => {
                getClass(element.LocalizacaoX, element.LocalizacaoY);
                const buttonOn = `<button type="button" class="btn back_button">
                                <a class="menu_give_button2" id="${element.IDEletronico}On"
                                onclick="Buzinar('${element.IDEletronico}On', ${element.IDEletronico})">RASTREAR</a></button>`;
                const buttonOff = `<button type="button" class="btn back_button">
                                <a class="menu_give_button2" id="${element.IDEletronico}Off"
                                onclick="Buzinar('${element.IDEletronico}Off', ${element.IDEletronico})">DESRASTREAR</a></button>`;
                
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td class="id">${element.IDEletronico}</td>
                <td class="nrPatri" id="oi">${element.NumeroPatrimonio}</td>
                <td class="nrSerie" id="oi">${element.NumeroSerie}</td>
                <td class="modelo">${element.Modelo}</td>
                <td class="cor">${element.Cor}</td>
                <td class="loc">${currentClass}</td>
                <td>${buttonOn}</td>
                <td>${buttonOff}</td>
                        `
                tbodyEle.appendChild(tr);

                const IDS = document.getElementsByClassName("id").length;
                for(var i=0; i<IDS-1; i++){
                    var trr = document.getElementsByTagName("tr")[i+1];
                    var id = String(document.getElementsByClassName("id")[i].innerHTML);
                    if (id == String(element.IDEletronico)) trr.remove();
                }
            });
        }
    })
}
getEletric();

const getClass = (posX, posY) => {
    if(posY >= 0 && posY < 5){
        if(posX >= 0 && posX < 5){ currentClass = "Sala-01"; return; }
        if(posX >= 5 && posX < 10){ currentClass = "Sala-02"; return; }
    }
    else if(posY >= 5 && posY < 10){
        if(posX >= 0 && posX < 5){ currentClass = "Sala-11"; return; }
        if(posX >= 5 && posX < 10){ currentClass = "Sala-12"; return; }
    }
}

function Buzinar(index, id){
      var currentvalue = document.getElementById(index).innerHTML.toLocaleLowerCase();
      console.log(currentvalue);
      if(currentvalue == "rastrear"){
        $.post("http://"+HOST+":"+PORT+"/buzina", {buzina:1, id:id}, ()=>{console.log("Mandou 1!")});
      }
      else if(currentvalue == "desrastrear"){
        $.post("http://"+HOST+":"+PORT+"/buzina", {buzina:0, id:id}, ()=>{console.log("Mandou 0!")});
      }
}
