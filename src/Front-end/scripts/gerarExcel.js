const getData = [
    {"ID": "1", "Modelo": "cell", "Localização": "sala"},
    {"ID": "2", "Modelo": "pc", "Localização": "sala 1"},
];


function generateExcel(){
    const id = document.getElementsByName("id").length;

    var data = [['IDEletronico','NumeroPatrimonio','NumeroSerie','Modelo','Cor','LocalizacaoX','LocalizacaoY']];

    for(var i=0; i<id; i++){
        var content = [];
        content.push(String(document.getElementsByName("id")[i].value));
        content.push(String(document.getElementsByName("nrPatri")[i].value));
        content.push(String(document.getElementsByName("nrSerie")[i].value));
        content.push(String(document.getElementsByName("modelo")[i].value));
        content.push(String(document.getElementsByName("cor")[i].value));
        content.push(String(document.getElementsByName("locX")[i].value));
        content.push(String(document.getElementsByName("locY")[i].value));
        data.push(content);
    }
    console.log(data);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    wb.SheetNames.push("Localização");
    wb.Sheets["Localização"] = ws;
    XLSX.utils.book_append_sheet(wb, ws, "Localização");
    XLSX.writeFile(wb, 'Relatório do Patrimônio.xlsx');
}