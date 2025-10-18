// DAL/ReportSubTypeDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class ReportSubTypeDAL
    {
        public static List<ReportSubType> GetAll()
        {
            List<ReportSubType> types = new List<ReportSubType>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM report_sub_types";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    types.Add(new ReportSubType
                    {
                        Id = reader.GetInt32("id"),
                        MainTypeId = reader.GetInt32("main_type_id"),
                        SubTypeName = reader.GetString("sub_type_name")
                    });
                }
            }
            return types;
        }

        public static List<ReportSubType> GetByMainType(int mainTypeId)
        {
            List<ReportSubType> types = new List<ReportSubType>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM report_sub_types WHERE main_type_id = @mainTypeId";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@mainTypeId", mainTypeId);
                
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    types.Add(new ReportSubType
                    {
                        Id = reader.GetInt32("id"),
                        MainTypeId = reader.GetInt32("main_type_id"),
                        SubTypeName = reader.GetString("sub_type_name")
                    });
                }
            }
            return types;
        }
    }
}