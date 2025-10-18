// Models/LogActivity.cs
using System;

namespace DepartmentsSystem.Models
{
    public class LogActivity
    {
        public int IdActivity { get; set; }
        public int IdUser { get; set; }
        public string TableTarget { get; set; }
        public DateTime CreatedAt { get; set; }
        public int IdRecord { get; set; }
        public string Action { get; set; }
    }
}