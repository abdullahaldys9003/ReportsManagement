// BLL/DistrictService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class DistrictService
    {
        public List<District> GetDistricts() => DistrictDAL.GetAll();
        public District GetDistrict(int id) => DistrictDAL.GetById(id);
        public int AddDistrict(District district) => DistrictDAL.Insert(district);
        public bool UpdateDistrict(District district) => DistrictDAL.Update(district);
        public bool DeleteDistrict(int id) => DistrictDAL.Delete(id);
    }
}