// BLL/SuspectService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class SuspectService
    {
        public List<Suspect> GetSuspects() => SuspectDAL.GetAll();
        public void AddSuspect(Suspect suspect) => SuspectDAL.Insert(suspect);
        public void UpdateSuspectStatus(int id, string status) => SuspectDAL.UpdateStatus(id, status);
    }
}