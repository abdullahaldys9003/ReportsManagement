// Models/ReportSubType.cs
namespace DepartmentsSystem.Models
{
    public class ReportSubType
    {
        public int Id { get; set; }
        public int MainTypeId { get; set; }
        public string SubTypeName { get; set; }
    }
}