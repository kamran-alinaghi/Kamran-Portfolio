namespace Kamran_Portfolio.Models.Categorizing
{
    public class ColumnModel
    {
        public int Id { get; set; }
        public int? UserDefinedProjectId { get; set; }
        public string? ColumnName { get; set; }
        public bool? IsBoolean { get; set; }
    }
}
