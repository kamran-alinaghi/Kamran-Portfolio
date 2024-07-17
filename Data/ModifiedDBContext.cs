using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data
{
    public class ModifiedDBContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

            if (String.Equals(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), "Development")) 
            { 
                optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioContext"));
                //optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioServer"));
            }
            else 
            { 
                optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioServer")); 
            }
        }
    }
}
