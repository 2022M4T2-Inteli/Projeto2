const getData = [
    {"ID": "1", "Modelo": "cell", "Localização": "sala"},
    {"ID": "2", "Modelo": "pc", "Localização": "sala 1"}
];


function generateExcel(){
    const data = getData;
    console.log(data);
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Localização");
    XLSX.writeFile(wb, 'Relatório do Patrimônio.xlsx');
}