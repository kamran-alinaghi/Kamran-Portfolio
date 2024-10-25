using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts
{
    public class KuCoinFutureKLineContext: SuperBaseDBContext
    {
        public DbSet<KuCoinFutureKLineModel> KuCoin_Future_KLine_DB { get; set; } = default!;
    }
}
