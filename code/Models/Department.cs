// Models/Department.cs
using System;

namespace DepartmentsSystem.Models
{
    public class Department
    {
        public int Id { get; set; }
        public string DepartmentName { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public int NeighborhoodsId { get; set; }
        public int DistrictsId { get; set; }
    }
}