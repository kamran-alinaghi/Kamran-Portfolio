using MongoDB.Bson;

namespace Kamran_Portfolio.Models.Categorizing
{
    public class CategorizingProjectModel
    {
        public ObjectId? _id { get; set; }
        public int? UserId { get; set; }
        public int? ProductId { get; set; }
        public string? ProjectName { get; set; }
        public IEnumerable<ColumnContent>? ColumnList { get; set; }
        public IEnumerable<RowContent>? RowList { get; set; }
    }
}
