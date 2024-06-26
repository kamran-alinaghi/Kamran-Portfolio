using Kamran_Portfolio.Models;
using Kamran_Portfolio.Models.Categorizing;
using Microsoft.EntityFrameworkCore;

namespace Kamran_Portfolio.Data.DataContexts
{
    public class CategorizingProjectContext : ModifiedDBContext
    {
        public DbSet<UserProductsModel> UserProducts { get; set; }
        public DbSet<UserDefinedProjectModel> UserDefinedProjects { get; set; }
        public DbSet<ProductItemsModel> ProductItems { get; set; }
        public DbSet<ColumnModel> Categorizing_Columns { get; set; }
        public DbSet<RowModel> Categorizing_RowNames { get; set; }
        public DbSet<ValuesModel> Categorizing_Values { get; set; }
    }
}
