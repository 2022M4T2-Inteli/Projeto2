const getEletric = () => {
    
const tbodyEle = document.getElementById("tbodyEle");
tbodyEle.innerHTML = "";

    $.ajax({
        async: true,
        url: "http://10.128.64.173:5500/Eletronicos",
        type: 'GET',
        success: data => {
            data.forEach(element => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td>${element.IDEletronico}</td>
                <td id="oi">${element.NumeroPatrimonio}</td>
                <td id="oi">${element.NumeroSerie}</td>
                <td>${element.Modelo}</td>
                <td>${element.Cor}</td>
                <td>${element.LocalizacaoX}</td>
                <td>${element.LocalizacaoY}</td>
                        `
                tbodyEle.appendChild(tr);
            });
        }
    })
}

getEletric();