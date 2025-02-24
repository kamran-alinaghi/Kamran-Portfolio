using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using System.Reflection.PortableExecutable;
using System.Runtime.Intrinsics.X86;

namespace Kamran_Portfolio.BackgroundTask.Assets
{
    public class TechnicalAnalysisResultModel
    {
        //private const double tolerance = 0.05;
        public long Id { get; set; }
        public long PredictionTime { get; set; }
        public double CurrentPrice { get; set; }
        public double? FuturePrice { get; set; }
        public double SMA { get; set; }
        public double ShortEMA { get; set; }
        public double LongEMA { get; set; }
        public double RSI { get; set; }
        public TechnicalMACD MACD { get; set; }
        public TechnicalBollingerBands BollingerBands { get; set; }
        public PredictionItems predictionState { get; set; }


        public TechnicalAnalysisResultModel(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            if (Candles.Count >= 3 * minutes)
            {
                Id = Candles[Candles.Count - 1].openTime;
                PredictionTime = Id + minutes * 60000;
                CurrentPrice = Candles[Candles.Count - 1].closePrice;
                SMA = CalculateSMA(Candles, minutes);
                ShortEMA = CalculateEMA(Candles, minutes);
                LongEMA = CalculateEMA(Candles, minutes * 5 / 2);
                RSI = CalculateRSI(Candles, minutes);
                MACD = CalculateMACD(Candles, minutes);
                BollingerBands = CalculateBollingerBands(Candles, minutes);
                predictionState = GetPredictionState();
            }
            else
            {
                Id = -1;
                MACD = new TechnicalMACD();
                BollingerBands = new TechnicalBollingerBands();
                predictionState = new PredictionItems();
            }
        }

        private PredictionItems GetPredictionState()
        {
            PredictionItems predictionItems = new PredictionItems();
            predictionItems.SMAstate = CheckState(CurrentPrice, SMA);
            predictionItems.EMAstate = CheckState(ShortEMA, LongEMA);
            if (RSI > 70) { predictionItems.RSIstate = PredictionState.Falling; }
            else if (RSI < 30) { predictionItems.RSIstate = PredictionState.Rising; }
            else { predictionItems.RSIstate = PredictionState.Neutral; }

            predictionItems.MACDstate = CheckState(MACD.MACDLine, MACD.SignalLine);
            predictionItems.BBstate = CheckState(CurrentPrice, BollingerBands.MiddleBand);
            return predictionItems;
        }

        private PredictionState CheckState(double firstNumber, double secondNumber, double tolerance = 0)
        {
            PredictionState result;
            if (firstNumber > secondNumber * (1 + tolerance)) { result = PredictionState.Rising; }
            else if (firstNumber < secondNumber * (1 - tolerance)) { result = PredictionState.Falling; }
            else { result = PredictionState.Neutral; }
            return result;
        }

        public TechnicalAnalysisResultModel()
        {
            Id = -1;
            MACD = new TechnicalMACD();
            BollingerBands = new TechnicalBollingerBands();
            predictionState = new PredictionItems();
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
            List<double> gains = new List<double>();
            List<double> losses = new List<double>();
            for (int i = Candles.Count - minutes - 1; i < Candles.Count - 1; i++)
            {
                double change = Candles[i + 1].closePrice - Candles[i].closePrice;
                if (change > 0) { gains.Add(change); }
                else { losses.Add(Math.Abs(change)); }
            }
            double averageGain = gains.Count > 0 ? gains.Average() : 0;
            double averageLoss = losses.Count > 0 ? losses.Average() : 0;

            double result = averageLoss > 0 ? (100 - (100 / (1 + (averageGain / averageLoss)))) : 100;
            return result;
        }

        private TechnicalMACD CalculateMACD(List<KuCoinFutureKLineModel> Candles, int minutes)
        {
            List<double> priceList = new List<double>();
            for (int i = 0; i < Candles.Count; i++) { priceList.Add(Candles[i].closePrice); }
            int shortStart = (int)Math.Floor(1.7 * minutes);
            int longStart = (int)Math.Floor(3.7 * minutes);
            int signalStart = (int)Math.Floor(1.3 * minutes);
            TechnicalMACD result = new TechnicalMACD();

            List<double> shortList = CalculateEMAspan(priceList, shortStart);
            List<double> longList = CalculateEMAspan(priceList, longStart);
            List<double> diff = new List<double>();
            for (int i = 0; i < longList.Count; i++) { diff.Add(longList[i] - shortList[i + (longStart - shortStart)]); }
            List<double> signalList = CalculateEMAspan(diff, signalStart);

            result.MACDLine = diff[diff.Count - 1];
            result.SignalLine=signalList[signalList.Count - 1];
            result.Histogram = result.MACDLine - result.SignalLine;


            return result;
        }

        private List<double> CalculateEMAspan(List<double> priceList, int startIndex)
        {
            List<double> result = new List<double>();
            double k = 2 / (startIndex + 1);
            result.Add(priceList.GetRange(0, startIndex).Average());
            for (int i = startIndex; i < priceList.Count; i++) { result.Add(priceList[i] * k + result[i - startIndex] * (1 - k)); }
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

    public class PredictionItems
    {
        public PredictionState SMAstate { get; set; }
        public PredictionState EMAstate { get; set; }
        public PredictionState RSIstate { get; set; }
        public PredictionState MACDstate { get; set; }
        public PredictionState BBstate { get; set; }
        public PredictionItems()
        {
            SMAstate = PredictionState.Neutral;
            EMAstate = PredictionState.Neutral;
            RSIstate = PredictionState.Neutral;
            MACDstate = PredictionState.Neutral;
            BBstate = PredictionState.Neutral;
        }
    }

    public enum PredictionState
    {
        Falling,
        Neutral,
        Rising
    }
}
