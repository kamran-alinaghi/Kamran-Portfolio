namespace Kamran_Portfolio.Data.TechnicalAnalysis.ParamClasses
{
    public class CoinRequestParams
    {
        public string? type { get; set; }
        public string? symbol { get; set; }
        public long? startAt { get; set; }
        public long? endAt { get; set; }
    }
}
