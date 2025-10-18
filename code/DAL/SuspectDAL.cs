// DAL/SuspectDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class SuspectDAL
    {
        public static List<Suspect> GetAll()
        {
            List<Suspect> suspects = new List<Suspect>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM suspects";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    suspects.Add(new Suspect
                    {
                        Id = reader.GetInt32("id"),
                        FullName = reader.GetString("full_name"),
                        Phone = reader.GetString("phone"),
                        Gender = reader.GetString("gender"),
                        Address = reader.GetString("address"),
                        Status = reader.GetString("status"),
                        Age = reader.GetInt32("age"),
                        NationalId = reader.GetString("national_id"),
                        CreatedAt = reader.GetDateTime("created_at")
                    });
                }
            }
            return suspects;
        }

        public static void Insert(Suspect suspect)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"INSERT INTO suspects 
                (full_name, phone, gender, address, status, age, national_id)
                VALUES (@name, @phone, @gender, @address, @status, @age, @nationalId)";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", suspect.FullName);
                cmd.Parameters.AddWithValue("@phone", suspect.Phone);
                cmd.Parameters.AddWithValue("@gender", suspect.Gender);
                cmd.Parameters.AddWithValue("@address", suspect.Address);
                cmd.Parameters.AddWithValue("@status", suspect.Status);
                cmd.Parameters.AddWithValue("@age", suspect.Age);
                cmd.Parameters.AddWithValue("@nationalId", suspect.NationalId);

                cmd.ExecuteNonQuery();
            }
        }

        public static void UpdateStatus(int id, string status)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "UPDATE suspects SET status=@status WHERE id=@id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.Parameters.AddWithValue("@status", status);
                cmd.ExecuteNonQuery();
            } 
        }
    }
}