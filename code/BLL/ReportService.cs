// BLL/ReportService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class ReportService
    {
        public List<Report> GetReports() => ReportDAL.GetAll();
        public void AddReport(Report report) => ReportDAL.Insert(report);
        public void UpdateReportStatus(int reportId, string status) => ReportDAL.UpdateStatus(reportId, status);
    }
}