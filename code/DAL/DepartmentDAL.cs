// DAL/DepartmentDAL.cs
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class DepartmentDAL
    {
        public static List<Department> GetAll()
        {
            List<Department> departments = new List<Department>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM department";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    departments.Add(new Department
                    {
                        Id = reader.GetInt32("id"),
                        DepartmentName = reader.GetString("department_name"),
                        Address = reader.GetString("address"),
                        CreatedAt = reader.GetDateTime("created_at"),
                        NeighborhoodsId = reader.GetInt32("neighborhoods_id"),
                        DistrictsId = reader.GetInt32("districts_id")
                    });
                }
            }
            return departments;
        }

        public static void Insert(Department dept)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"INSERT INTO department 
                (department_name, address, neighborhoods_id, districts_id)
                VALUES (@name, @address, @neighborhoodId, @districtId)";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", dept.DepartmentName);
                cmd.Parameters.AddWithValue("@address", dept.Address);
                cmd.Parameters.AddWithValue("@neighborhoodId", dept.NeighborhoodsId);
                cmd.Parameters.AddWithValue("@districtId", dept.DistrictsId);

                cmd.ExecuteNonQuery();
            }
        }

        public static void Update(Department dept)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"UPDATE department SET 
                department_name=@name, address=@address, 
                neighborhoods_id=@neighborhoodId, districts_id=@districtId 
                WHERE id=@id";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", dept.Id);
                cmd.Parameters.AddWithValue("@name", dept.DepartmentName);
                cmd.Parameters.AddWithValue("@address", dept.Address);
                cmd.Parameters.AddWithValue("@neighborhoodId", dept.NeighborhoodsId);
                cmd.Parameters.AddWithValue("@districtId", dept.DistrictsId);

                cmd.ExecuteNonQuery();
            }
        }

        public static void Delete(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM department WHERE id=@id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.ExecuteNonQuery();
            }
        }
    }
}