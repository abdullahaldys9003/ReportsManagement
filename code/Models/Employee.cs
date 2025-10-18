// Models/Employee.cs
using System;

namespace DepartmentsSystem.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public string NameFull { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string NumberPhone { get; set; }
        public string PositionType { get; set; }
        public DateTime CreatedAt { get; set; }
        public int DepartmentId { get; set; }
    }
}