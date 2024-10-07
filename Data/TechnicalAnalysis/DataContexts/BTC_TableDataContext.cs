using Kamran_Portfolio.Data.TechnicalAnalysis.DataModels;
using Kamran_Portfolio.Models;
using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts
{
    public class BTC_TableDataContext: DbContext
    {
        public DbSet<BTC_Candles_KuCoin> BTC_KuCoin_DB { get; set; } = default!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

            optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioServer"));
        }
    }
}
