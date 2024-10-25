using System.Numerics;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.ParamClasses
{
    public class FutureKLineParams
    {
        public string symbol { get; set; }
        public int granularity { get; set; }
        public long? from { get; set; }
        public long? to { get; set; }

        public FutureKLineParams()
        {
            symbol = string.Empty;
            granularity = 1;
        }

        public FutureKLineParams(string symbolName, FutureKLineParams kLineParam)
        {
            symbol = symbolName;
            granularity = kLineParam.granularity;
            from = kLineParam.from;
            to = kLineParam.to;
        }

        public FutureKLineParams(string symbolName, long minuets, long startAt)
        {
            symbol = symbolName;
            DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
            long uinxT = dto.ToUnixTimeMilliseconds();
            if (uinxT % 10 == 0) { uinxT = uinxT + 1; }
            granularity = 1;
            to = uinxT;
            from = uinxT - (minuets * 90000); //Gets more data than we need to cover potential gap
            if (startAt > from) { from = startAt + 1; }
        }
    }
}
