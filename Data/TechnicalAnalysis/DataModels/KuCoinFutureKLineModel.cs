using System.Numerics;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataModels
{
    public class KuCoinFutureKLineModel
    {
        public long Id { get; set; }
        public string? coinName { get; set; }
        public long openTime { get; set; }
        public double openPrice { get; set; }
        public double highPrice { get; set; }
        public double lowPrice { get; set; }
        public double closePrice { get; set; }
        public double tradingVolume { get; set; }

        public KuCoinFutureKLineModel() { }

        public KuCoinFutureKLineModel(string[] inputArray)
        {
            if (inputArray.Length != 6) { throw new Exception("Wrong Length"); }
            openTime = long.Parse(inputArray[0]);
            openPrice = double.Parse(inputArray[1]);
            highPrice = double.Parse(inputArray[2]);
            lowPrice = double.Parse(inputArray[3]);
            closePrice = double.Parse(inputArray[4]);
            tradingVolume = double.Parse(inputArray[5]);
        }

        public KuCoinFutureKLineModel(long Id, string[] inputArray) : this(inputArray)
        {
            this.Id = Id;
        }

        public KuCoinFutureKLineModel(string coinName, long Id, string[] inputArray) : this(Id, inputArray)
        {
            this.coinName = coinName;
        }

    }
}
