namespace Kamran_Portfolio.Models
{
    public class UserProductsModel
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? ProductId { get; set; }
        public DateTime? ActivationDate { get; set; }
        public DateTime? ExpireDate { get; set; }
    }
}
