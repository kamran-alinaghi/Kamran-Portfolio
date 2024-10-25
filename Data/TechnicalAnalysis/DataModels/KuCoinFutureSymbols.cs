namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataModels
{
    public class KuCoinFutureSymbols
    {
        public int Id { get; set; }
        public string? symbol { get; set; }
        public string? baseCurrency { get; set; }
        public string? rootSymbol { get; set; }

        public KuCoinFutureSymbols()
        {

        }

        public KuCoinFutureSymbols(FutureToken token)
        {
            symbol = token.symbol;
            baseCurrency = token.baseCurrency;
            rootSymbol = token.rootSymbol;
        }
    }
}
