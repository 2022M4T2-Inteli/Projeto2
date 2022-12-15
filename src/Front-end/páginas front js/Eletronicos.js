const PORT = 5500;
const hostname = "10.128.64.173";

const getEletric = async () => {
  const tbodyEle = document.getElementById("tbodyEle");
  tbodyEle.innerHTML = "";

  await $.ajax({
    async: true,

    url: `/Eletronicos`,
    type: "GET",
    success: (data) => {
      data.forEach((element) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td name="id" id="oi">${element.IDEletronico}</td>
                <td name="nrPatri">${element.NumeroPatrimonio}</td>
                <td name="nrSerie">${element.NumeroSerie}</td>
                <td name="modelo">${element.Modelo}</td>
                <td name="cor">${element.Cor}</td>
                <td name="locX">${element.LocalizacaoX}</td>
                <td name="locY">${element.LocalizacaoY}</td>
                        `;
        tbodyEle.appendChild(tr);
      });
    },
  });
};

getEletric();
