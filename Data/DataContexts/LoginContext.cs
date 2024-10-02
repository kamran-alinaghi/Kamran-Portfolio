using Kamran_Portfolio.Models;
using Microsoft.EntityFrameworkCore;
using System.Configuration;

namespace Kamran_Portfolio.Data.DataContexts
{
    public class LoginContext : ModifiedDBContext
    {
        public DbSet<UserInfo> UserInfo { get; set; } = default!;
        
    }
}
