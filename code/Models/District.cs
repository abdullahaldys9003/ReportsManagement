// Models/District.cs
namespace DepartmentsSystem.Models
{
    public class District
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? GovernorateId { get; set; }
    }
}