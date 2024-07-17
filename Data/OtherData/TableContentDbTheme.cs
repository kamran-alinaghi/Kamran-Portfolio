namespace Kamran_Portfolio.Data.OtherData
{
    public class TableContentDbTheme
    {
        public string TableName { get; set; }
        public int TableId { get; set; }
        public int userId { get; set; }
        public List<ColumnContent> ColumnList { get; set; }
        public List<RowContent> RowList { get; set; }
        public DataChangeVerification IsDataChanged { get; set; }
    }

    public class DataChangeVerification
    {
        public bool Columns { get; set; }
        public bool Rows { get; set; }
        public bool Values { get; set; }
        public DataChangeVerification()
        {
            this.Columns = false;
            this.Rows = false;
            this.Values = false;
        }
        public void SetToFalse()
        {
            this.Columns = false;
            this.Rows = false;
            this.Values = false;
        }
    }

    public class ColumnContent
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool nOrQ { get; set; }
    }

    public class RowContent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<RowProperties> Properties { get; set; }
    }

    public class RowProperties
    {
        public bool Checked { get; set; }
        public double NumVal { get; set; }
    }

    public enum TableNames
    {
        Column,
        Row, 
        Values,
        UserDefinedProjects,
        ProductItems,
        Users,
        Products
    }
}
