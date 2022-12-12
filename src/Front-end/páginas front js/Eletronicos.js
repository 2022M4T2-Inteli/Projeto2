const tbodyEle = document.getElementById("tbodyEle");

$.ajax({
    async: true,
    url: "http://10.128.0.155:5500/Eletronicos",
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