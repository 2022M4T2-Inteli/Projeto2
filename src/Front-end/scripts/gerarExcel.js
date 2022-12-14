const getData = [
    {"ID": "1", "Modelo": "cell", "Localização": "sala"},
    {"ID": "2", "Modelo": "pc", "Localização": "sala 1"}
];


function generateExcel(){
    const id = document.getElementsByName("id").length;

    var data = '[';

    for(var i=0; i<id; i++){
        data += "{";
        data += 'IDEletronico:'+String(document.getElementsByName("id")[i].value)+",";
        data += 'NumeroPatrimonio:'+String(document.getElementsByName("nrPatri")[i].value)+",";
        data += 'NumeroSerie:'+String(document.getElementsByName("nrSerie")[i].value)+",";
        data += 'Modelo:'+String(document.getElementsByName("modelo")[i].value)+",";
        data += 'Cor:'+String(document.getElementsByName("cor")[i].value)+",";
        data += 'LocalizacaoX:'+String(document.getElementsByName("locX")[i].value)+",";
        data += 'LocalizacaoY:'+String(document.getElementsByName("locY")[i].value)+",";
        data += "},"
    }
    data += ']';
    console.log(data);
    data = JSON.parse(data);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Localização");
    XLSX.writeFile(wb, 'Relatório do Patrimônio.xlsx');
}