using Kamran_Portfolio.Data.TechnicalAnalysis.ParamClasses;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization;
using System.Net.Http;
using System.Text;

namespace Kamran_Portfolio.Controllers
{
    public class TechnicalAPIs : Controller
    {
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

        
        
        
        
        
        
        
        
        public async Task<string> GetAPI(CoinRequestParams requestBody)
        {
            var responseString = await client.GetStringAsync("https://api.kucoin.com/api/v1/market/candles?type=" + 
                requestBody.type + "&symbol=" + requestBody.symbol + "&startAt="+ requestBody.startAt.ToString() + "&endAt=" + requestBody.endAt);
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
