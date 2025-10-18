// BLL/ReporterService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class ReporterService
    {
        public List<Reporter> GetReporters() => ReporterDAL.GetAll();
        public void AddReporter(Reporter reporter) => ReporterDAL.Insert(reporter);
    }
}