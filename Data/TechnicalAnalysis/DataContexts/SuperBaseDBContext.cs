using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data.TechnicalAnalysis.DataContexts
{
    public class SuperBaseDBContext : DbContext
    {
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
