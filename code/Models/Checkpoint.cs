// Models/Checkpoint.cs
using System;

namespace DepartmentsSystem.Models
{
    public class Checkpoint
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}