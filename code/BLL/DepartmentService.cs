// BLL/DepartmentService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class DepartmentService
    {
        public List<Department> GetDepartments() => DepartmentDAL.GetAll();
        public void AddDepartment(Department dept) => DepartmentDAL.Insert(dept);
        public void UpdateDepartment(Department dept) => DepartmentDAL.Update(dept);
        public void DeleteDepartment(int id) => DepartmentDAL.Delete(id);
    }
}