using Kamran_Portfolio.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace Kamran_Portfolio.Data
{
    public class LoginContext : DbContext
    {
        public DbSet<UserInfo> UserInfo { get; set; } = default!;
        string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

            if (String.Equals(env, "Development")) { optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioContext")); }
            else { optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioServer")); }
        }
    }
}
