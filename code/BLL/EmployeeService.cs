// BLL/EmployeeService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class EmployeeService
    {
        public List<Employee> GetEmployees() => EmployeeDAL.GetAll();
        public Employee GetEmployee(int id) => EmployeeDAL.GetById(id);
        public void AddEmployee(Employee emp) => EmployeeDAL.Insert(emp);
        public void UpdateEmployee(Employee emp) => EmployeeDAL.Update(emp);
        public void DeleteEmployee(int id) => EmployeeDAL.Delete(id);
        public Employee Login(string username, string password) => EmployeeDAL.Login(username, password);
    }
}



// BLL/EmployeeService.cs
using System.Collections.Generic;
using DepartmentsSystem.Models;
using DepartmentsSystem.DAL;

namespace DepartmentsSystem.BLL
{
    public class EmployeeService
    {
        // جلب جميع الموظفين
        public List<Employee> GetEmployees()
        {
            return EmployeeDAL.GetAll();
        }

        // جلب موظف واحد حسب المعرف
        public Employee GetEmployee(int id)
        {
            return EmployeeDAL.GetById(id);
        }

        // إضافة موظف جديد
        public void AddEmployee(Employee emp)
        {
            if (emp == null)
            {
                throw new System.ArgumentNullException(nameof(emp), "Employee cannot be null");
            }

            EmployeeDAL.Insert(emp);
        }

        // تحديث بيانات موظف
        public void UpdateEmployee(Employee emp)
        {
            if (emp == null)
            {
                throw new System.ArgumentNullException(nameof(emp), "Employee cannot be null");
            }

            var existing = EmployeeDAL.GetById(emp.Id);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Employee with Id {emp.Id} not found.");
            }

            EmployeeDAL.Update(emp);
        }

        // حذف موظف حسب المعرف
        public void DeleteEmployee(int id)
        {
            var existing = EmployeeDAL.GetById(id);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Employee with Id {id} not found.");
            }

            EmployeeDAL.Delete(id);
        }

        // تسجيل دخول موظف
        public Employee Login(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                throw new System.ArgumentException("Username and password cannot be empty");
            }

            var emp = EmployeeDAL.Login(username, password);
            if (emp == null)
            {
                throw new System.UnauthorizedAccessException("Invalid username or password");
            }

            return emp;
        }
    }
}