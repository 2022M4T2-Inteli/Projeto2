const PORT = 5500;
const HOST = "10.128.64.20";

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
                const button = `<button type="button" class="btn back_button">
                                <a class="menu_give_button" id="onoff" value="off"
                                onclick="Buzinar(${element.IDEletronico})">BUZINA</a></button>`;
                
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td class="id">${element.IDEletronico}</td>
                <td class="nrPatri" id="oi">${element.NumeroPatrimonio}</td>
                <td class="nrSerie" id="oi">${element.NumeroSerie}</td>
                <td class="modelo">${element.Modelo}</td>
                <td class="cor">${element.Cor}</td>
                <td class="loc">${currentClass}</td>
                <td>${button}</td>
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

function Buzinar(id){
      var currentvalue = document.getElementById('onoff').value;
      if(currentvalue == "off"){
        document.getElementById("onoff").value="On";
        $.post("http://"+HOST+"/buzina", {buzina:"1", id:id}, ()=>{});
      }else{
        document.getElementById("onoff").value="Off";
        $.post("http://"+HOST+"/buzina", {buzina:"0", id:id}, ()=>{});
      }
}
