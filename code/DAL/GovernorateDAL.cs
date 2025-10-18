// DAL/GovernorateDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class GovernorateDAL
    {
        public static List<Governorate> GetAll()
        {
            List<Governorate> governorates = new List<Governorate>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM governorates";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    governorates.Add(new Governorate
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name")
                    });
                }
            }
            return governorates;
        }

        public static Governorate GetById(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM governorates WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                var reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    return new Governorate
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name")
                    };
                }
                return null;
            }
        }

        public static int Insert(Governorate governorate)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "INSERT INTO governorates (name) VALUES (@name); SELECT LAST_INSERT_ID();";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", governorate.Name);
                
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
        }

        public static bool Update(Governorate governorate)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "UPDATE governorates SET name = @name WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", governorate.Id);
                cmd.Parameters.AddWithValue("@name", governorate.Name);
                
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }

        public static bool Delete(int id)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "DELETE FROM governorates WHERE id = @id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                
                int affected = cmd.ExecuteNonQuery();
                return affected > 0;
            }
        }
    }
}