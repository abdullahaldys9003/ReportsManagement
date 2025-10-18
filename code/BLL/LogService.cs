// BLL/LogService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class LogService
    {
        public List<LogActivity> GetLogs() => LogActivityDAL.GetAll();
        public void AddLog(LogActivity log) => LogActivityDAL.Insert(log);
    }
}