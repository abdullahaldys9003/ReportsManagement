// DAL/CheckpointDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class CheckpointDAL
    {
        public static List<Checkpoint> GetAll()
        {
            List<Checkpoint> checkpoints = new List<Checkpoint>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM checkpoints";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    checkpoints.Add(new Checkpoint
                    {
                        Id = reader.GetInt32("id"),
                        Name = reader.GetString("name"),
                        CreatedAt = reader.GetDateTime("created_at")
                    });
                }
            }
            return checkpoints;
        }

        public static void Insert(Checkpoint checkpoint)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "INSERT INTO checkpoints (name) VALUES (@name)";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", checkpoint.Name);
                cmd.ExecuteNonQuery();
            }
        }
    }
}