export class CandlestickKuCoin {
    openTime;
    openPrice;
    closePrice;
    highPrice;
    lowPrice;
    transactionVolume;
    transactionAmount;

    /**
     * 
     * @param {string[]?} data
     */
    constructor(data) {
        if (data) {
            if (data.length !== 7) {
                throw new Error('Invalid data length. Expected 12 elements.');
            }

            this.openTime = parseInt(data[0]);
            this.openPrice = parseFloat(data[1]);
            this.closePrice = parseFloat(data[2]);
            this.highPrice = parseFloat(data[3]);
            this.lowPrice = parseFloat(data[4]);
            this.transactionVolume = parseFloat(data[5]);
            this.transactionAmount = parseFloat(data[6]);
        }
        else {
            this.openTime = 0;
            this.openPrice = 0;
            this.closePrice = 0;
            this.highPrice = 0;
            this.lowPrice = 0;
            this.transactionVolume = 0;
            this.transactionAmount = 0;
        }
    }
}

export class TechnicalAnalysis {
    SMA;
    EMA;
    RSI;
    MACD;
    BollingerBands;
    /**
     * 
     * @param {CandlestickKuCoin[]} candlesticks
     * @param {number} period
     */
    constructor(candlesticks, period) {
        this.SMA = calculateSMA(candlesticks, period);
        this.EMA = calculateEMA(candlesticks, Math.floor(1.5 * period));
        this.RSI = calculateRSI(candlesticks, period + 1);
        this.MACD = calculateMACD(candlesticks, Math.floor(1.5 * period), Math.floor(2 * period), period);
        this.BollingerBands = calculateBollingerBands(candlesticks, Math.floor(1.5 * period));
    }
}



// Function to calculate Simple Moving Average (SMA)
/**
 * 
 * @param {CandlestickKuCoin[]} candlesticks
 * @param {number} period
 * @returns
 */
export function calculateSMA(candlesticks, period) {
    if (candlesticks.length < period) {
        throw new Error('Not enough data to calculate SMA');
    }

    let sum = 0;
    for (let i = candlesticks.length - period; i < candlesticks.length; i++) {
        sum += candlesticks[i].closePrice;
    }
    return sum / period;
}


// Function to calculate Exponential Moving Average (EMA)
/**
 * 
 * @param {CandlestickKuCoin[]} candlesticks
 * @param {number} period
 * @returns
 */
export function calculateEMA(candlesticks, period) {
    if (candlesticks.length < period) {
        throw new Error('Not enough data to calculate EMA');
    }

    const k = 2 / (period + 1);
    let ema = calculateSMA(candlesticks.slice(0, period), period); // Start with SMA as EMA seed

    for (let i = period; i < candlesticks.length; i++) {
        ema = candlesticks[i].closePrice * k + ema * (1 - k);
    }

    return ema;
}

// Function to calculate Relative Strength Index (RSI)
/**
 * 
 * @param {CandlestickKuCoin[]} candlesticks
 * @param {number} period
 * @returns
 */
export function calculateRSI(candlesticks, period = 14) {
    if (candlesticks.length < period + 1) {
        throw new Error('Not enough data to calculate RSI');
    }

    let gains = 0, losses = 0;

    for (let i = candlesticks.length - period - 1; i < candlesticks.length - 1; i++) {
        const change = candlesticks[i + 1].closePrice - candlesticks[i].closePrice;
        if (change > 0) {
            gains += change;
        } else {
            losses -= change;
        }
    }

    const averageGain = gains / period;
    const averageLoss = losses / period;

    const rs = averageGain / averageLoss;
    return 100 - (100 / (1 + rs));
}

// Function to calculate MACD
/**
 * 
 * @param {CandlestickKuCoin[]} candlesticks
 * @param {number} shortPeriod
 * @param {number} longPeriod
 * @param {number} signalPeriod
 * @returns
 */
export function calculateMACD(candlesticks, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
    if (candlesticks.length < longPeriod + signalPeriod) {
        throw new Error('Not enough data to calculate MACD');
    }

    const shortEMA = calculateEMA(candlesticks, shortPeriod);
    const longEMA = calculateEMA(candlesticks, longPeriod);
    const macdLine = shortEMA - longEMA;

    // Calculate Signal Line (EMA of MACD Line)
    const macdCandlesticks = candlesticks.slice(longPeriod - 1);
    const signalLine = calculateEMA(macdCandlesticks, signalPeriod);

    return {
        macdLine,
        signalLine,
        histogram: macdLine - signalLine
    };
}

// Function to calculate Bollinger Bands
/**
 * 
 * @param {CandlestickKuCoin[]} candlesticks
 * @param {number} period
 * @param {number} numStdDev
 * @returns
 */
export function calculateBollingerBands(candlesticks, period = 20, numStdDev = 2) {
    if (candlesticks.length < period) {
        throw new Error('Not enough data to calculate Bollinger Bands');
    }

    const sma = calculateSMA(candlesticks, period);
    let varianceSum = 0;

    for (let i = candlesticks.length - period; i < candlesticks.length; i++) {
        varianceSum += Math.pow(candlesticks[i].closePrice - sma, 2);
    }

    const variance = varianceSum / period;
    const stdDev = Math.sqrt(variance);

    return {
        upperBand: sma + numStdDev * stdDev,
        middleBand: sma,
        lowerBand: sma - numStdDev * stdDev
    };
}