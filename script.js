//グローバル変数宣言
const url = new URL(window.location.href);
let barcodeNumbers = []; //Array
let barcodeCount = 0; //Number

(function (){
    const urlParam = getUrlParam("barcodeNumbers");
    const localStrg = getLocalStrg("barcodeNumbers");
    if(urlParam){
        barcodeNumbers = urlParam;
    }
    if(localStrg){
        if(!barcodeNumbers || confirm("「OK」を押すと、端末内に保存されたデータが上書きされます。よろしいですか？\n端末内のデータを保持したい場合は「キャンセル」を押してください！")){ 
            barcodeNumbers = localStrg;
        }
    }
    if(!barcodeNumbers){
        return false;
    }
    let barcodeNumbersInputText = "";
    for(let i = 0; i < barcodeNumbers.length; i++){
        barcodeNumbersInputText = barcodeNumbersInputText.concat(`${barcodeNumbers[i]}\n`);
    }
    document.getElementById("inputText").value = barcodeNumbersInputText;
}());

function createBarcode(){
    const text = document.getElementById("inputText").value;
    if (text.length == 0){
        return false;
    }
    const barcodeNotes = getNotes();

    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");

    let html = '<table><tbody>';
    barcodeNumbers = [];
    barcodeCount = 0;

    lines.forEach((line, i) => {
        let barcodeNumber = convertFormat(line);
        barcodeNumbers.push(barcodeNumber);
        let barcodeNote = "";
        if(barcodeNotes[i]){
            barcodeNote = barcodeNotes[i];
        }
        let tableHtml;
        if(barcodeNumber.length === 13){
            let barcodeImage = `<img src="https://inticket.sej.co.jp/order/barcode?Code=${barcodeNumber}" alt="${barcodeNumber}">`;
            tableHtml = `${barcodeImage}<p>${barcodeNumber}</p><input type="text" id="note${i}" placeholder="メモ" value="${barcodeNote}"><input type="checkbox" id="check${i}"><label for="check${i}">使用済み</label>`;
        }else{
            tableHtml = "<p>払込番号は13桁です！</p>";
        }
        html += `<tr><td>${tableHtml}</td></tr>`;
        barcodeCount++;
    });

    html += '</tbody></table>';

    document.getElementById("tableContainer").innerHTML = html;

    showOptionContainer();

    history.replaceState(null, '', url.pathname);

    saveLocalStrg("barcodeNumbers", barcodeNumbers);
    localStrgStatus(true);
    saveUrlParam("barcodeNumbers", barcodeNumbers);
    if(barcodeNotes){
        saveUrlParam("barcodeNotes", barcodeNotes);
    }
}

function showOptionContainer(){
    const optionContainer = document.getElementById("optionContainer");
    optionContainer.classList.remove("hide");
}

function saveNotes(){
    let barcodeNotes = [];
    for(let i = 0; i < barcodeCount; i++){
        const barcodeNote = document.getElementById(`note${i}`).value;
        barcodeNotes.push(barcodeNote);
    }
    saveLocalStrg("barcodeNumbers", barcodeNumbers);
    saveLocalStrg("barcodeNotes", barcodeNotes);
    localStrgStatus(true);
    saveUrlParam("barcodeNotes", barcodeNotes);
    alert("メモデータを保存しました\n※保存機能は開発途上です。データが吹き飛ぶ可能性をご理解のうえ、ご利用ください。");
}

function getNotes(){
    const urlParam = getUrlParam("barcodeNotes");
    const localStrg = getLocalStrg("barcodeNotes");
    if(urlParam){
        return localStrg;
    }else if(localStrg){
        return urlParam;
    }else{
        return false;
    }
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
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(data));
}
function getLocalStrg(key){
    let data = localStorage.getItem(key);
    if(data){
        localStrgStatus(true);
        return JSON.parse(data);
    }else{
        return false;
    }
}
function clearLocalStrg(){
    if(confirm("削除したデータは戻せません！\n本当に削除してよろしいですか？")){
        localStorage.clear();
        localStrgStatus(false);
    }
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
    url.searchParams.delete(key);
    url.searchParams.set(key, JSON.stringify(data));
    document.getElementById("shareURL").value = url.toString();
}
function getUrlParam(key){
    let data = url.searchParams.get(key);
    if(data){
        return JSON.parse(data);
    }else{
        return false;
    }
}