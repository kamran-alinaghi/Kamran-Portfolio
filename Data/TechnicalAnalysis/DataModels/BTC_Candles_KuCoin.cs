using System.Numerics;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataModels
{
    public class BTC_Candles_KuCoin
    {
        public BigInteger openTime {  get; set; }
        public float openPrice { get; set; }
        public float closePrice { get; set; }
        public float highPrice { get; set; }
        public float lowPrice { get; set; }
        public float transactionVolume { get; set; }
        public float transactionAmount { get; set; }
    }
}
