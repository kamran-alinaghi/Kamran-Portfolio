using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Kamran_Portfolio.Models;

namespace Kamran_Portfolio.Data
{
    public class Kamran_PortfolioContext : DbContext
    {
        public Kamran_PortfolioContext (DbContextOptions<Kamran_PortfolioContext> options)
            : base(options)
        {
        }

        public DbSet<Kamran_Portfolio.Models.UserInfo> UserInfo { get; set; } = default!;
    }
}
