using Kamran_Portfolio.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace Kamran_Portfolio.Data
{
    public class LoginContext : DbContext
    {
        public DbSet<UserInfo> UserInfo { get; set; } = default!;
        //public DbSet<ProductItems> ProductItems { get; set; }
        //public DbSet<UserProducts> UserProducts { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
            .AddJsonFile("appsettings.json")
            .Build();
            
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("Kamran_PortfolioContext"));
        }
    }
}
