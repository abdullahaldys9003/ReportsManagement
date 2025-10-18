// DAL/NeighborhoodDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class NeighborhoodDAL
    {
        public static List<Neighborhood> GetAll()
        {
            List<Neighborhood> neighborhoods = new List<Neighborhood>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM neighborhoods";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    neighborhoods.Add(new Neighborhood
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        DistrictId = reader.GetInt32("district_id")
                    });
                }
            }
            return neighborhoods;
        }

        public static Neighborhood GetById(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM neighborhoods WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new Neighborhood
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        DistrictId = reader.GetInt32("district_id")
                    };
                }
                return null;
            }
        }

        public static int Insert(Neighborhood neighborhood)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "INSERT INTO neighborhoods (name, district_id) VALUES (@name, @districtId); SELECT LAST_INSERT_ID();";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", neighborhood.Name);
                cmd.Parameters.AddWithValue("@districtId", neighborhood.DistrictId);
                
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public static bool Update(Neighborhood neighborhood)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "UPDATE neighborhoods SET name = @name, district_id = @districtId WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", neighborhood.Id);
                cmd.Parameters.AddWithValue("@name", neighborhood.Name);
                cmd.Parameters.AddWithValue("@districtId", neighborhood.DistrictId);
                
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }

        public static bool Delete(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM neighborhoods WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }
    }
}