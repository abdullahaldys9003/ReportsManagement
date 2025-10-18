// Models/Report.cs
using System;

namespace DepartmentsSystem.Models
{
    public class Report
    {
        public int ReportId { get; set; }
        public string StatusReport { get; set; }
        public string Description { get; set; }
        public int MainId { get; set; }
        public int SubId { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}