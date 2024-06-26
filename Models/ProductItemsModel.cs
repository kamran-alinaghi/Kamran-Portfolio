using Microsoft.AspNetCore.Mvc;

namespace Kamran_Portfolio.Models
{
    public class ProductItemsModel
    {
        public int Id { get; set; }
        public string? ProductName { get; set; }
        public string? ProductDescription { get; set; }
        public double? ProductPrice { get; set; }
    }
}
