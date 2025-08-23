function createBarcode() {
    const text = document.getElementById("inputText").value;
    if (text.length == 0){
        return;
    }
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    let html = '<table><tbody>';

    lines.forEach(line => {
        let barcodeNumber = line.replace(/[^0-9]/g, "");
        let tableHtml;
        if(barcodeNumber.length === 13){
            let barcodeImage = `<img src="https://inticket.sej.co.jp/order/barcode?Code=${barcodeNumber}" alt="${barcodeNumber}">`;
            tableHtml = `${barcodeImage}<p>${barcodeNumber}</p><input type="text" name="note" placeholder="メモ"><input type="checkbox" id="check${barcodeNumber}"><label for="check${barcodeNumber}">バーコード読込済</label>`;
        }else{
            tableHtml = "<p>払込番号は13桁です！</p>";
        }
        html += `<tr><td>${tableHtml}</td></tr>`;
    });

    html += '</tbody></table><div class="split"></div>';

    document.getElementById("tableContainer").innerHTML = html;
}