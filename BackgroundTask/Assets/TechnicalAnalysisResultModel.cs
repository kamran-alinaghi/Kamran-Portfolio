using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using System.Reflection.PortableExecutable;
using System.Runtime.Intrinsics.X86;

namespace Kamran_Portfolio.BackgroundTask.Assets
{
    public class TechnicalAnalysisResultModel
    {
        public long Id { get; set; }
        public double SMA { get; set; }
        public double ShortEMA { get; set; }
        public double LongEMA { get; set; }
        public double RSI { get; set; }
        public TechnicalMACD MACD { get; set; }
        public TechnicalBollingerBands BollingerBands { get; set; }


        public TechnicalAnalysisResultModel(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            //int minutes = Candles.Count / 3;
            if (Candles.Count >= 3 * minutes)
            {
                SMA = CalculateSMA(Candles, minutes);
                ShortEMA = CalculateEMA(Candles, minutes);
                LongEMA= CalculateEMA(Candles, minutes * 5 / 2);
                RSI = CalculateRSI(Candles, minutes);
                MACD = CalculateMACD(Candles, minutes);
                BollingerBands = CalculateBollingerBands(Candles, minutes);
            }
            else
            {
                Id = -1;
                MACD = new TechnicalMACD();
                BollingerBands = new TechnicalBollingerBands();
            }
        }

        public TechnicalAnalysisResultModel()
        {
            Id = -1;
            MACD = new TechnicalMACD();
            BollingerBands = new TechnicalBollingerBands();
        }



        private double CalculateSMA(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            double result = 0;
            for (int i = Candles.Count - minutes; i < Candles.Count; i++) { result += Candles[i].closePrice; }
            return result / minutes;
        }

        private double CalculateEMA(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            double k = 2 / (minutes + 1);
            double ema = 0;
            ema = CalculateSMA(Candles.GetRange(0, Candles.Count - minutes), minutes);
            for (int i = minutes; i < Candles.Count; i++) { ema = Candles[i].closePrice * k + ema * (1 - k); }

            return ema;
        }

        private double CalculateRSI(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            double gains = 0;
            double losses = 0;
            for (int i = Candles.Count - minutes - 1; i < Candles.Count - 1; i++)
            {
                double change = Candles[i + 1].closePrice - Candles[i].closePrice;
                if (change > 0) { gains += change; }
                else { losses -= change; }
            }
            double averageGain = gains / minutes;
            double averageLoss = losses / minutes;

            double rs = averageGain / averageLoss;
            return 100 - (100 / (1 + rs));
        }

        private TechnicalMACD CalculateMACD(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            TechnicalMACD result = new TechnicalMACD();
            double shortEMA = CalculateEMA(Candles, (int)Math.Floor(1.5 * minutes));
            double longEMA = CalculateEMA(Candles, 2 * minutes);
            result.MACDLine = shortEMA - longEMA;
            result.SignalLine = CalculateEMA(Candles.GetRange(2 * minutes - 1, 2 * minutes), minutes);
            result.Histogram = result.MACDLine - result.SignalLine;

            return result;
        }

        private TechnicalBollingerBands CalculateBollingerBands(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            int numStdDev = 2;
            int period = (int)Math.Floor(1.5 * minutes);
            TechnicalBollingerBands result = new TechnicalBollingerBands();
            double sma = CalculateSMA(Candles, period);
            double varianceSum = 0;
            for (int i = Candles.Count - period; i < Candles.Count; i++)
            {
                varianceSum += Math.Pow(Candles[i].closePrice - sma, 2);
            }
            double variance = varianceSum / period;
            double stdDev = Math.Sqrt(variance);

            result.UpperBand = sma + numStdDev * stdDev;
            result.MiddleBand = sma;
            result.LowerBand = sma - numStdDev * stdDev;
            return result;
        }
    }

    public class TechnicalMACD
    {
        public double MACDLine { get; set; }
        public double SignalLine { get; set; }
        public double Histogram { get; set; }
    }

    public class TechnicalBollingerBands
    {
        public double UpperBand { get; set; }
        public double MiddleBand { get; set; }
        public double LowerBand { get; set; }
    }
}
