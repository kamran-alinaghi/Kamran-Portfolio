namespace Kamran_Portfolio.Models.Categorizing
{
    public class UserDefinedProjectModel
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public int? ProductId { get; set; }
        public string? ProjectName { get; set; }
    }
}
