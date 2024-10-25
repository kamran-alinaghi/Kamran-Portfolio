using System.Numerics;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataModels
{
    public class BTC_Candles_KuCoin
    {
        public int Id { get; set; }
        public Int64 openTime {  get; set; }
        public double openPrice { get; set; }
        public double closePrice { get; set; }
        public double highPrice { get; set; }
        public double lowPrice { get; set; }
        public double transactionVolume { get; set; }
        public double transactionAmount { get; set; }
    }
}
