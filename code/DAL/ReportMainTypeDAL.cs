// DAL/ReportMainTypeDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class ReportMainTypeDAL
    {
        public static List<ReportMainType> GetAll()
        {
            List<ReportMainType> types = new List<ReportMainType>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM report_main_types";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    types.Add(new ReportMainType
                    {
                        Id = reader.GetInt32("id"),
                        TypeName = reader.GetString("type_name")
                    });
                }
            }
            return types;
        }
    }
}