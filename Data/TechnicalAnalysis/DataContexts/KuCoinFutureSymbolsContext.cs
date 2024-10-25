using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts
{
    public class KuCoinFutureSymbolsContext : SuperBaseDBContext
    {
        public DbSet<KuCoinFutureSymbols> KuCoin_Future_Symbols { get; set; } = default!;
    }
}
