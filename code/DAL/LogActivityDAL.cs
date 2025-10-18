// DAL/LogActivityDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class LogActivityDAL
    {
        public static List<LogActivity> GetAll()
        {
            List<LogActivity> logs = new List<LogActivity>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM logs_activity";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    logs.Add(new LogActivity
                    {
                        IdActivity = reader.GetInt32("id_activity"),
                        IdUser = reader.GetInt32("id_user"),
                        TableTarget = reader.GetString("table_target"),
                        CreatedAt = reader.GetDateTime("createdAt"),
                        IdRecord = reader.GetInt32("id_record"),
                        Action = reader.GetString("action")
                    });
                }
            }
            return logs;
        }

        public static void Insert(LogActivity log)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"INSERT INTO logs_activity 
                (id_user, table_target, id_record, action)
                VALUES (@userId, @table, @recordId, @action)";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@userId", log.IdUser);
                cmd.Parameters.AddWithValue("@table", log.TableTarget);
                cmd.Parameters.AddWithValue("@recordId", log.IdRecord);
                cmd.Parameters.AddWithValue("@action", log.Action);

                cmd.ExecuteNonQuery();
            }
        }
    }
}