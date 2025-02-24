import { CandlestickKuCoin, calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands, TechnicalAnalysis, KLineFutureKuCoin } from "./Classes/CandlestickClassKuCoin.js";
const btn = document.getElementById("get");
const txt = document.getElementById("txt");
const timeFrameInput = document.getElementById("time-frame-input");
const candleList = [new CandlestickKuCoin(null)];
candleList.length = 0;
btn.onclick = function () { return BtnActions(); };



let count = Date.now();
count = Math.floor(count / 60000) * 60000;
count -= 600000;





function BtnActions() {
    count -= 300000;
    //GetFutureAPI(Math.floor((Date.now() - 12000000)), Math.floor(Date.now()));
    TestAPI();
}



function GetAPI(startTime, endTime) {
    $.ajax({
        url: "/TechnicalAPIs/GetCoin",
        type: 'POST',
        data: JSON.stringify({
            type: "1min",
            symbol: "BTC-USDT",
            startAt: startTime,
            endAt: endTime
        }),
        success: function (result) {
            const d = JSON.parse(result)
            SuccessFunction(d.data);
        },
        error: function (ajaxContext) {
            alert(JSON.stringify(ajaxContext));
        }
    });
}

function GetFutureAPI(startTime, endTime) {
    $.ajax({
        url: "/TechnicalAPIs/SaveCoins",
        type: 'POST',
        success: function (result) {
            //const d = JSON.parse(result);
            //alert(JSON.stringify(d.data.length));
            //SuccessFuture(d.data);
            alert(result);
        },
        error: function (ajaxContext) {
            alert(JSON.stringify(ajaxContext));
        }
    });
}

function TestAPI() {
    $.ajax({
        url: "/TechnicalAPIs/TestAPI",
        type: 'GET',
        success: function (result) {
            download(result, 'json.txt', 'text/plain');
            let tttt = JSON.parse(result);
            txt.innerText = tttt.length;
            //alert(result);
        },
        error: function (ajaxContext) {
            alert(JSON.stringify(ajaxContext));
        }
    });
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

/**
 * 
 * @param {Array<string[]>} result
 */
function SuccessFunction(result) {
    candleList.length = 0;
    const p = 480;
    for (let i = 0; i < result.length; i++) {
        candleList.push(new CandlestickKuCoin(result[i]));
    }
    const ta = new TechnicalAnalysis(candleList, p);
    txt.innerHTML = " minutes: " + candleList.length + "<br>";
    txt.innerHTML += "24 hours ago: " + Math.floor((Date.now() - 86400000) / 1000) + "<br>";
    txt.innerHTML += "Now Time: " + Math.floor(Date.now() / 1000) + "<br>";
    txt.innerHTML += "Current Price: " + candleList[candleList.length - 1].closePrice + "<br>";

    txt.innerHTML += "SMA: " + ta.SMA + "<br>";
    txt.innerHTML += "EMA: " + ta.EMA + "<br>";
    txt.innerHTML += "RSI: " + ta.RSI + "<br>";
    txt.innerHTML += "MACD: {<br>    macdLine: " + ta.MACD.macdLine + "<br>    signalLine: " + ta.MACD.signalLine + "<br>    histogram: " + ta.MACD.histogram + "<br>}<br>";
    txt.innerHTML += "Bollinger Bands: {<br>    upperBand: " + ta.BollingerBands.upperBand + "<br>    middleBand: " + ta.BollingerBands.middleBand + "<br>    lowerBand: " + ta.BollingerBands.lowerBand + "<br>}<br>";
}

/**
 * 
 * @param {Array<string[]>} result
 */
function SuccessFuture(result) {
    candleList.length = 0;
    const p = 10;
    for (let i = 0; i < result.length; i++) {
        candleList.push(new KLineFutureKuCoin(result[i]));
    }
    const ta = new TechnicalAnalysis(candleList, p);
    txt.innerHTML = " minutes: " + candleList.length + "<br>";
    txt.innerHTML += "24 hours ago: " + Math.floor((Date.now() - 86400000) / 1000) + "<br>";
    txt.innerHTML += "Now Time: " + Math.floor(Date.now() / 1000) + "<br>";
    txt.innerHTML += "Current Price: " + candleList[candleList.length - 1].closePrice + "<br>";

    txt.innerHTML += "SMA: " + ta.SMA + "<br>";
    txt.innerHTML += "EMA: " + ta.EMA + "<br>";
    txt.innerHTML += "RSI: " + ta.RSI + "<br>";
    txt.innerHTML += "MACD: {<br>    macdLine: " + ta.MACD.macdLine + "<br>    signalLine: " + ta.MACD.signalLine + "<br>    histogram: " + ta.MACD.histogram + "<br>}<br>";
    txt.innerHTML += "Bollinger Bands: {<br>    upperBand: " + ta.BollingerBands.upperBand + "<br>    middleBand: " + ta.BollingerBands.middleBand + "<br>    lowerBand: " + ta.BollingerBands.lowerBand + "<br>}<br>";
}
