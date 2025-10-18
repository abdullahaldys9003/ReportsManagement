// Models/Suspect.cs
using System;

namespace DepartmentsSystem.Models
{
    public class Suspect
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string Status { get; set; }
        public int Age { get; set; }
        public string NationalId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}