// BLL/GovernorateService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class GovernorateService
    {
        public List<Governorate> GetGovernorates() => GovernorateDAL.GetAll();
        public Governorate GetGovernorate(int id) => GovernorateDAL.GetById(id);
        public int AddGovernorate(Governorate governorate) => GovernorateDAL.Insert(governorate);
        public bool UpdateGovernorate(Governorate governorate) => GovernorateDAL.Update(governorate);
        public bool DeleteGovernorate(int id) => GovernorateDAL.Delete(id);
    }
}