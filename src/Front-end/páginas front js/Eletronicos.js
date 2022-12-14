const PORT = 5500;
const hostname = "10.128.64.20";

const getEletric = () => {

const tbodyEle = document.getElementById("tbodyEle");
tbodyEle.innerHTML = "";

    $.ajax({
        async: true,
        url: `http://${hostname}:${PORT}/Eletronicos`,
        type: 'GET',
        success: data => {
            data.forEach(element => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td name="id">${element.IDEletronico}</td>
                <td name="nrPatri" id="oi">${element.NumeroPatrimonio}</td>
                <td name="nrSerie" id="oi">${element.NumeroSerie}</td>
                <td name="modelo">${element.Modelo}</td>
                <td name="cor">${element.Cor}</td>
                <td name="locX">${element.LocalizacaoX}</td>
                <td name="locY">${element.LocalizacaoY}</td>
                        `
                tbodyEle.appendChild(tr);
            });
        }
    })
}

getEletric();