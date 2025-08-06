function createBarcode() {
    const text = document.getElementById("inputText").value;
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    let html = "<table><tbody>";

    lines.forEach(line => {
        let barcodeNumber = line.replace(/[^0-9]/g, "");
        let tableHtml;
        if(barcodeNumber.length === 13){
            let barcodeImage = `<img src="https://inticket.sej.co.jp/order/barcode?Code=${barcodeNumber}" alt="${barcodeNumber}">`;
            tableHtml = `${barcodeImage}<br>${barcodeNumber}<br><label for="note">メモ：</label><input type="text" name="note" size="24">`;
        }else{
            tableHtml = "払込番号は13桁です！";
        }
        html += `<tr><td>${tableHtml}</td></tr>`;
    });

    html += "</tbody></table>";

    document.getElementById("tableContainer").innerHTML = html;
}