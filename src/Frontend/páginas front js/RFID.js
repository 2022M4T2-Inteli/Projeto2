const PORT = 5500;
const hostname = "10.128.64.20";

const getEletric = () => {

const tbodyEle = document.getElementById("tbodyEle");
tbodyEle.innerHTML = "";

    $.ajax({
        async: true,
        url: `/RFID`,
        type: 'GET',
        success: data => {
            data.forEach(element => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td name="id">${element.Modelo}</td>
                <td name="nrPatri" id="oi">${element.NumeroP}</td>
                <td name="locY">${element.Localizacao}</td>
                        `                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
                tbodyEle.appendChild(tr);
            });
        }
    })
}

getEletric();