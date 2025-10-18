// BLL/ReportTypeService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class ReportTypeService
    {
        public List<ReportMainType> GetMainTypes() => ReportMainTypeDAL.GetAll();
        public List<ReportSubType> GetSubTypes() => ReportSubTypeDAL.GetAll();
        public List<ReportSubType> GetSubTypesByMain(int mainTypeId) => ReportSubTypeDAL.GetByMainType(mainTypeId);
    }
}