function generateExcel(){
    const id = document.getElementsByClassName("id").length;

    var data = [['ID','Nr Patri','Nr Série','Modelo','Cor','Local']];

    for(var i=0; i<id; i++){
        var content = [];
        content.push(String(document.getElementsByClassName("id")[i].innerHTML));
        content.push(String(document.getElementsByClassName("nrPatri")[i].innerHTML));
        content.push(String(document.getElementsByClassName("nrSerie")[i].innerHTML));
        content.push(String(document.getElementsByClassName("modelo")[i].innerHTML));
        content.push(String(document.getElementsByClassName("cor")[i].innerHTML));
        content.push(String(document.getElementsByClassName("loc")[i].innerHTML));
        data.push(content);
    }
    console.log(data);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    wb.SheetNames.push("Localização");
    wb.Sheets["Localização"] = ws;
    XLSX.writeFile(wb, 'Relatório do Patrimônio.xlsx');
}