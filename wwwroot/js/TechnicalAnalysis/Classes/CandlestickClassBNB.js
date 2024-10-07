export class CandlestickBNB {
    openTime;
    openPrice;
    highPrice;
    lowPrice;
    closePrice;
    volume;
    closeTime;
    quoteAssetVolume;
    numberOfTrades;
    takerBuyBaseAssetVolume;
    takerBuyQuoteAssetVolume;

    /**
     * 
     * @param {string[]?} data
     */
    constructor(data) {
        if (data) {
            if (data.length !== 12) {
                throw new Error('Invalid data length. Expected 12 elements.');
            }

            this.openTime = data[0];
            this.openPrice = parseFloat(data[1]);
            this.highPrice = parseFloat(data[2]);
            this.lowPrice = parseFloat(data[3]);
            this.closePrice = parseFloat(data[4]);
            this.volume = parseFloat(data[5]);
            this.closeTime = data[6];
            this.quoteAssetVolume = parseFloat(data[7]);
            this.numberOfTrades = data[8];
            this.takerBuyBaseAssetVolume = parseFloat(data[9]);
            this.takerBuyQuoteAssetVolume = parseFloat(data[10]);
        }
        else {
            this.openTime = "";
            this.openPrice = 0;
            this.highPrice = 0;
            this.lowPrice = 0;
            this.closePrice = 0;
            this.volume = 0;
            this.closeTime = "";
            this.quoteAssetVolume = 0;
            this.numberOfTrades = "";
            this.takerBuyBaseAssetVolume = 0;
            this.takerBuyQuoteAssetVolume = 0;
        }
    }

    isBullish() {
        return this.closePrice > this.openPrice;
    }

    isBearish() {
        return this.closePrice < this.openPrice;
    }

    hasHighVolume(threshold) {
        return this.volume > threshold;
    }
}



// Function to calculate Simple Moving Average (SMA)
/**
 * 
 * @param {CandlestickBNB[]} candlesticks
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
 * @param {CandlestickBNB[]} candlesticks
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
 * @param {CandlestickBNB[]} candlesticks
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
 * @param {CandlestickBNB[]} candlesticks
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
 * @param {CandlestickBNB[]} candlesticks
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