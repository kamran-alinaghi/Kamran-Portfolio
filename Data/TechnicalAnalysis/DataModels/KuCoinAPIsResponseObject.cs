namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataModels
{
    public class KuCoinAPIsResponseObject<T>
    {
        public string? code { get; set; }
        public List<T>? data { get; set; }

        public KuCoinAPIsResponseObject()
        {
            code = string.Empty;
            data = new List<T>();
        }

        public KuCoinAPIsResponseObject(string JsonObject)
        {
            KuCoinAPIsResponseObject<T>? tempValues = new KuCoinAPIsResponseObject<T>();
            tempValues = Newtonsoft.Json.JsonConvert.DeserializeObject<KuCoinAPIsResponseObject<T>>(JsonObject);
            if (tempValues != null)
            {
                this.code = tempValues.code;
                this.data = tempValues.data;
            }
        }
    }
}
