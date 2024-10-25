namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataModels
{
    public class FutureToken
    {
        public string? symbol { get; set; }
        public string? rootSymbol { get; set; }
        public string? type { get; set; }
        public long? firstOpenDate { get; set; }
        public string? expireDate { get; set; }
        public string? settleDate { get; set; }
        public string? baseCurrency { get; set; }
        public string? quoteCurrency { get; set; }
        public string? settleCurrency { get; set; }
        public double? maxOrderQty { get; set; }
        public double? maxPrice { get; set; }
        public double? lotSize { get; set; }
        public double? tickSize { get; set; }
        public double? indexPriceTickSize { get; set; }
        public double? multiplier { get; set; }
        public double? initialMargin { get; set; }
        public double? maintainMargin { get; set; }
        public double? maxRiskLimit { get; set; }
        public double? minRiskLimit { get; set; }
        public double? riskStep { get; set; }
        public double? makerFeeRate { get; set; }
        public double? takerFeeRate { get; set; }
        public double? takerFixFee { get; set; }
        public double? makerFixFee { get; set; }
        public double? settlementFee { get; set; }
        public bool? isDeleverage { get; set; }
        public bool? isQuanto { get; set; }
        public bool? isInverse { get; set; }
        public string? markMethod { get; set; }
        public string? fairMethod { get; set; }
        public string? fundingBaseSymbol { get; set; }
        public string? fundingQuoteSymbol { get; set; }
        public string? fundingRateSymbol { get; set; }
        public string? indexSymbol { get; set; }
        public string? settlementSymbol { get; set; }
        public string? status { get; set; }
        public double? fundingFeeRate { get; set; }
        public double? predictedFundingFeeRate { get; set; }
        public string? openInterest { get; set; }
        public double? turnoverOf24h { get; set; }
        public double? volumeOf24h { get; set; }
        public double? markPrice { get; set; }
        public double? indexPrice { get; set; }
        public double? lastTradePrice { get; set; }
        public long? nextFundingRateTime { get; set; }
        public double? maxLeverage { get; set; }
        public List<string>? sourceExchanges { get; set; }
        public string? premiumsSymbol1M { get; set; }
        public string? premiumsSymbol8H { get; set; }
        public string? fundingBaseSymbol1M { get; set; }
        public string? fundingQuoteSymbol1M { get; set; }
        public double? lowPrice { get; set; }
        public double? highPrice { get; set; }
        public double? priceChgPct { get; set; }
        public double? priceChg { get; set; }
    }
}
