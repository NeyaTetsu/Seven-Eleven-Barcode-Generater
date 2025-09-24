(function (){
    let barcodeNumbers;
    barcodeNumbers = getLocalStrg("barcodeNumbers");
    barcodeNumbers = getUrlParam("barcodeNumbers");
    if(barcodeNumbers){
        let barcodeNumbersInputText = "";
        for(let i = 0; i < barcodeNumbers.length; i++){
            barcodeNumbersInputText = barcodeNumbersInputText.concat(`${barcodeNumbers[i]}\n`);
        }
        document.getElementById("inputText").value = barcodeNumbersInputText;
    }
}());

function createBarcode(){
    const text = document.getElementById("inputText").value;
    if (text.length == 0){
        return false;
    }
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    let html = '<table><tbody>';

    let barcodeNumbers = [];

    lines.forEach((line, i) => {
        let barcodeNumber = convertFormat(line);
        barcodeNumbers.push(barcodeNumber);
        let tableHtml;
        if(barcodeNumber.length === 13){
            let barcodeImage = `<img src="https://inticket.sej.co.jp/order/barcode?Code=${barcodeNumber}" alt="${barcodeNumber}">`;
            tableHtml = `${barcodeImage}<p>${barcodeNumber}</p><input type="text" id="note${i}" placeholder="メモ"><input type="checkbox" id="check${i}"><label for="check${i}">使用済み</label>`;
        }else{
            tableHtml = "<p>払込番号は13桁です！</p>";
        }
        html += `<tr><td>${tableHtml}</td></tr>`;
    });

    html += '</tbody></table><div class="split"></div>';

    document.getElementById("tableContainer").innerHTML = html;
    
    saveLocalStrg("barcodeNumbers", barcodeNumbers);
    localStrgStatus(true);
    saveUrlParam("barcodeNumbers", barcodeNumbers);
}

function copyURL(){
    if (!navigator.clipboard) {
        alert("このブラウザは非対応のようです\n申し訳ございません");
        return false;
    }
    let urlData = document.getElementById("shareURL").value;
    navigator.clipboard.writeText(urlData).then(
        () => {alert("URLをコピーしました");},
        () => {alert("URLのコピーに失敗しました");});
}

//適切なフォーマットにして返す（半角数字のみ）
function convertFormat(str){
    let a = convertFull2HalfNumber(str);
    let b = convertNumberOnly(a);
    return b;
}

//全角数字を半角数字に変換して返す
function convertFull2HalfNumber(str){
    const fullNums = "０１２３４５６７８９";
    return str.replace(/[０-９]/g, m=>fullNums.indexOf(m));
}

//半角数字以外の文字を消して返す
function convertNumberOnly(str){
    return str.replace(/[^0-9]/g, "");
}

//ローカルストレージ管理
function saveLocalStrg(key, data){
    localStorage.setItem(key, JSON.stringify(data));
}
function getLocalStrg(key){
    let data = localStorage.getItem(key);
    if(data){
        localStrgStatus(true);
    }
    return JSON.parse(data);
}
function clearLocalStrg(){
    localStorage.clear();
    localStrgStatus(false);
}

//ローカルストレージ情報を表示
function localStrgStatus(bool){
    let statusHtml = document.getElementById("savedData");
    if(bool){
        statusHtml.value = "保存データがあります";
    }else{
        statusHtml.value = "データを消去しました";
    }
}

//URL
function saveUrlParam(key, data){
    const url = new URL(window.location.href);
    url.searchParams.set(key, JSON.stringify(data));
    document.getElementById("shareURL").value = url.toString();
}
function getUrlParam(key){
    const url = new URL(window.location.href);
    let data = url.searchParams.get(key);
    return JSON.parse(data);
}