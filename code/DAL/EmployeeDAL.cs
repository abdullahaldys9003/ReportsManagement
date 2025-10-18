// DAL/EmployeeDAL.cs
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class EmployeeDAL
    {
        public static List<Employee> GetAll()
        {
            List<Employee> employees = new List<Employee>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM employees";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    employees.Add(new Employee
                    {
                        EmployeeId = reader.GetInt32("employee_id"),
                        NameFull = reader.GetString("name_full"),
                        Username = reader.GetString("username"),
                        Password = reader.GetString("password"),
                        Email = reader.GetString("email"),
                        NumberPhone = reader.GetString("number_phone"),
                        PositionType = reader.GetString("position_type"),
                        CreatedAt = reader.GetDateTime("created_at"),
                        DepartmentId = reader.GetInt32("department_id")
                    });
                }
            }
            return employees;
        }

        public static Employee GetById(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM employees WHERE employee_id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new Employee
                    {
                        EmployeeId = reader.GetInt32("employee_id"),
                        NameFull = reader.GetString("name_full"),
                        Username = reader.GetString("username"),
                        Password = reader.GetString("password"),
                        Email = reader.GetString("email"),
                        NumberPhone = reader.GetString("number_phone"),
                        PositionType = reader.GetString("position_type"),
                        CreatedAt = reader.GetDateTime("created_at"),
                        DepartmentId = reader.GetInt32("department_id")
                    };
                }
                return null;
            }
        }

        public static void Insert(Employee emp)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"INSERT INTO employees 
                (name_full, username, password, email, number_phone, position_type, department_id)
                VALUES (@name, @username, @password, @email, @phone, @position, @departmentId)";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", emp.NameFull);
                cmd.Parameters.AddWithValue("@username", emp.Username);
                cmd.Parameters.AddWithValue("@password", emp.Password);
                cmd.Parameters.AddWithValue("@email", emp.Email);
                cmd.Parameters.AddWithValue("@phone", emp.NumberPhone);
                cmd.Parameters.AddWithValue("@position", emp.PositionType);
                cmd.Parameters.AddWithValue("@departmentId", emp.DepartmentId);

                cmd.ExecuteNonQuery();
            }
        }

        public static void Update(Employee emp)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"UPDATE employees SET 
                name_full=@name, username=@username, password=@password,
                email=@email, number_phone=@phone, position_type=@position,
                department_id=@departmentId WHERE employee_id=@id";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", emp.EmployeeId);
                cmd.Parameters.AddWithValue("@name", emp.NameFull);
                cmd.Parameters.AddWithValue("@username", emp.Username);
                cmd.Parameters.AddWithValue("@password", emp.Password);
                cmd.Parameters.AddWithValue("@email", emp.Email);
                cmd.Parameters.AddWithValue("@phone", emp.NumberPhone);
                cmd.Parameters.AddWithValue("@position", emp.PositionType);
                cmd.Parameters.AddWithValue("@departmentId", emp.DepartmentId);

                cmd.ExecuteNonQuery();
            }
        }

        public static void Delete(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM employees WHERE employee_id=@id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();
            }
        }

        public static Employee Login(string username, string password)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM employees WHERE username=@username AND password=@password";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@username", username);
                cmd.Parameters.AddWithValue("@password", password);
                
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new Employee
                    {
                        EmployeeId = reader.GetInt32("employee_id"),
                        NameFull = reader.GetString("name_full"),
                        Username = reader.GetString("username"),
                        Password = reader.GetString("password"),
                        Email = reader.GetString("email"),
                        NumberPhone = reader.GetString("number_phone"),
                        PositionType = reader.GetString("position_type"),
                        CreatedAt = reader.GetDateTime("created_at"),
                        DepartmentId = reader.GetInt32("department_id")
                    };
                }
                return null;
            }
        }
    }
}