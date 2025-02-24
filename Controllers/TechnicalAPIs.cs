using Kamran_Portfolio.BackgroundTask.Assets;
using Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts;
using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using Kamran_Portfolio.Data.TechnicalAnalysis.ParamClasses;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MongoDB.Bson.Serialization;
using System.Net.Http;
using System.Numerics;
using System.Runtime.CompilerServices;
using System.Text;

namespace Kamran_Portfolio.Controllers
{
    public class TechnicalAPIs : Controller
    {
        private BTC_TableDataContext db = new BTC_TableDataContext();
        private KuCoinFutureSymbolsContext tokensDB = new KuCoinFutureSymbolsContext();
        private KuCoinFutureKLineContext futureDB = new KuCoinFutureKLineContext();
        private static readonly HttpClient client = new HttpClient();
        private IHttpContextAccessor _contex;

        public TechnicalAPIs(IHttpContextAccessor contex)
        {
            _contex = contex;
        }

        [HttpPost]
        public string GetCoin()
        {
            string result = "Not working...";
            CoinRequestParams? param = GetRequestBody<CoinRequestParams>();
            if (param != null)
            {
                result = GetAPI(param).Result;
            }
            return result;
        }

        public string GetFutureChart()
        {
            string result = "Not working...";
            FutureKLineParams? param = GetRequestBody<FutureKLineParams>();
            if (param != null)
            {
                result = GetFutureAPI(param).Result;
            }
            return result;
        }

        [HttpGet]
        public string TestAPI()
        {
            long start = 1734123660000;
            //long start = 1735850660000;
            long end = 1735851660000;
            IQueryable<KuCoinFutureKLineModel> result = from data in futureDB.KuCoin_Future_KLine_DB 
                                                        where data.openTime > start && data.openTime < end 
                                                        select data;
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        [HttpGet]
        public string StoreFutureSymbols()
        {
            string str = client.GetStringAsync("https://api-futures.kucoin.com/api/v1/contracts/active").Result;
            KuCoinAPIsResponseObject<FutureToken> tokens = new KuCoinAPIsResponseObject<FutureToken>(str);
            if (tokens.data != null)
            {
                foreach (FutureToken token in tokens.data)
                {
                    IQueryable<KuCoinFutureSymbols>? symbolResult = from s in tokensDB.KuCoin_Future_Symbols
                                                                    where String.Equals(s.symbol, token.symbol) && String.Equals(s.baseCurrency, token.baseCurrency) && String.Equals(s.rootSymbol, token.rootSymbol)
                                                                    select s;
                    KuCoinFutureSymbols? tempSymbol = symbolResult.FirstOrDefault();
                    if (tempSymbol == null)
                    {
                        KuCoinFutureSymbols addingToken = new KuCoinFutureSymbols(token);
                        KuCoinFutureSymbols? lastSymbol = tokensDB.KuCoin_Future_Symbols.OrderByDescending(u => u.Id).FirstOrDefault();
                        if (lastSymbol != null) { addingToken.Id = lastSymbol.Id < 1 ? 1 : (lastSymbol.Id + 1); }
                        else { addingToken.Id = 1; }
                        tokensDB.Add(addingToken);
                        tokensDB.SaveChanges();
                    }
                }
            }
            return "Done!";
        }

        [HttpPost]
        public string FutureCalculation()
        {
            long now = GetRequestBody<long>();
            int timeframe = 480;
            //DateTimeOffset dto = new DateTimeOffset(DateTime.Now);
            long end = now - timeframe * 60000;
            if (end % 10 == 0) { end++; }
            long start = end - 6 * timeframe * 60000;
            IQueryable<KuCoinFutureKLineModel> futureCandles = from c in futureDB.KuCoin_Future_KLine_DB
                                                               where c.openTime > start && c.openTime <= end
                                                               select c;
            List<KuCoinFutureKLineModel> cand = futureCandles.ToList();
            TechnicalAnalysisResultModel resultModel = new TechnicalAnalysisResultModel(cand, timeframe);
            IQueryable<KuCoinFutureKLineModel> lastCandles = from c in futureDB.KuCoin_Future_KLine_DB
                                                             where c.openTime > (now - 30000) && c.openTime < (now + 30000)
                                                             select c;
            KuCoinFutureKLineModel? future = lastCandles.FirstOrDefault();
            if (future != null) { resultModel.FuturePrice = future.closePrice; }
            return Newtonsoft.Json.JsonConvert.SerializeObject(resultModel);
        }









        public async Task<string> GetFutureAPI(FutureKLineParams requestBody)
        {
            string str = "https://api-futures.kucoin.com/api/v1/kline/query?symbol=" + requestBody.symbol +
                "&granularity=" + requestBody.granularity.ToString() +
                (requestBody.from != null ? ("&from=" + requestBody.from.ToString()) : "") +
                (requestBody.to != null ? ("&to=" + requestBody.to.ToString()) : "");
            var responseString = await client.GetStringAsync(str);
            return responseString;
        }


        public async Task<string> GetAPI(CoinRequestParams requestBody)
        {
            var responseString = await client.GetStringAsync("https://api.kucoin.com/api/v1/market/candles?type=" +
                requestBody.type + "&symbol=" + requestBody.symbol + "&startAt=" + requestBody.startAt.ToString() + "&endAt=" + requestBody.endAt);
            return responseString;
        }


        private T? GetRequestBody<T>()
        {
            if (_contex.HttpContext != null)
            {
                StreamReader streamReader = new StreamReader(_contex.HttpContext.Request.Body);
                string str = streamReader.ReadToEndAsync().Result;
                T? p = Newtonsoft.Json.JsonConvert.DeserializeObject<T>(str);
                return p;
            }
            else { return default(T); }
        }
    }
}
