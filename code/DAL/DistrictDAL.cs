// DAL/DistrictDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class DistrictDAL
    {
        public static List<District> GetAll()
        {
            List<District> districts = new List<District>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM districts";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    districts.Add(new District
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        GovernorateId = reader.IsDBNull(reader.GetOrdinal("governorate_id")) ? 
                                       (int?)null : reader.GetInt32("governorate_id")
                    });
                }
            }
            return districts;
        }

        public static District GetById(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM districts WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new District
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        GovernorateId = reader.IsDBNull(reader.GetOrdinal("governorate_id")) ? 
                                       (int?)null : reader.GetInt32("governorate_id")
                    };
                }
                return null;
            }
        }

        public static int Insert(District district)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "INSERT INTO districts (name, governorate_id) VALUES (@name, @governorateId); SELECT LAST_INSERT_ID();";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", district.Name);
                cmd.Parameters.AddWithValue("@governorateId", district.GovernorateId);
                
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public static bool Update(District district)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "UPDATE districts SET name = @name, governorate_id = @governorateId WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", district.Id);
                cmd.Parameters.AddWithValue("@name", district.Name);
                cmd.Parameters.AddWithValue("@governorateId", district.GovernorateId);
                
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }

        public static bool Delete(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM districts WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }
    }
}