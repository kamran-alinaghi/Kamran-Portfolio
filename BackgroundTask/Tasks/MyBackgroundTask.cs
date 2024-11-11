using Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts;
using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using Kamran_Portfolio.Data.TechnicalAnalysis.ParamClasses;

namespace Kamran_Portfolio.BackgroundTask.Tasks
{
    public class MyBackgroundTask : BackgroundService
    {
        private KuCoinFutureKLineContext futureDB = new KuCoinFutureKLineContext();
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            long minutes = 5;
            while (!stoppingToken.IsCancellationRequested)
            {
                futureDB = new KuCoinFutureKLineContext();
                KuCoinFutureKLineModel? lastInstance = futureDB.KuCoin_Future_KLine_DB.OrderByDescending(u => u.Id).FirstOrDefault();
                long inputId = lastInstance != null ? lastInstance.Id + 1 : 1;
                long lastSeconds = lastInstance != null ? lastInstance.openTime : 0;
                List<FutureKLineParams> coinList = GetCoinList(minutes, lastSeconds);

                foreach (FutureKLineParams coin in coinList)
                {
                    string coinResults = GetFutureAPI(coin).Result;
                    KuCoinAPIsResponseObject<string[]> result = new KuCoinAPIsResponseObject<string[]>(coinResults);
                    if (result.data != null)
                    {
                        foreach (var d in result.data)
                        {
                            futureDB.Add(new KuCoinFutureKLineModel(coin.symbol, inputId, d));
                            inputId++;
                        }
                    }
                }
                futureDB.SaveChanges();
                futureDB.Dispose();
                await Task.Delay(TimeSpan.FromMinutes(minutes), stoppingToken); // Adjust interval as needed
            }
        }







        private void FutureCalculation()
        {

        }

        private List<FutureKLineParams> GetCoinList(long minutes, long startPoint)
        {
            KuCoinFutureSymbolsContext tokensDB = new KuCoinFutureSymbolsContext();
            List<FutureKLineParams> futureKLineParams = new List<FutureKLineParams>();
            //IQueryable<string> tokenSymbols = from symbol in tokensDB.KuCoin_Future_Symbols select symbol.symbol;
            List<string> tokenSymbols = new List<string>();
            tokenSymbols.Add("XBTUSDTM");
            foreach (string token in tokenSymbols) { futureKLineParams.Add(new FutureKLineParams(token, minutes, startPoint)); }
            return futureKLineParams;
        }

        private async Task<string> GetFutureAPI(FutureKLineParams requestBody)
        {
            HttpClient client = new HttpClient();
            string str = "https://api-futures.kucoin.com/api/v1/kline/query?symbol=" + requestBody.symbol +
                    "&granularity=" + requestBody.granularity.ToString() +
                    (requestBody.from != null ? "&from=" + requestBody.from.ToString() : "") +
                    (requestBody.to != null ? "&to=" + requestBody.to.ToString() : "");
            var responseString = await client.GetStringAsync(str);
            return responseString;
        }
    }
}
