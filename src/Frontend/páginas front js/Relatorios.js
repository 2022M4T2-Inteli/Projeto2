const PORT = 5500;
const hostname = "10.128.64.20";

const getEletric = async () => {
  const tbodyEle = document.getElementById("tbodyEle");
  tbodyEle.innerHTML = "";

  await $.ajax({
    async: true,

    url: `/Relatorios`,
    type: "GET",
    success: (data) => {
      data.forEach((element) => {
        const div = document.createElement("div");
        tr.innerHTML = `
                <div class="col-lg-3 col-12 d-flex card october">
                ${element.Mes}
                    <div class="d-flex mini_card_group">
                        <div class="d-flex mini_card number1">${element.DispositivosEmprestados}</div>
                        <div class="d-flex mini_card number2">${element.DispositivosPerdidos}</div>
                    </div>
                </div>
                        `;
        tbodyEle.appendChild(div);
      });
    },
  });
};

getEletric();
