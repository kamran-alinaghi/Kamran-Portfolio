using Kamran_Portfolio.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace Kamran_Portfolio.Data.DataContexts
{
    public class LoginContext : DbContext
    {
        public DbSet<UserInfo> UserInfo { get; set; } = default!;
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();

            if (string.Equals(Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"), "Development")) { optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioContext")); }
            else { optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioServer")); }
        }
    }
}
