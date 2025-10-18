// DAL/ReporterDAL.cs
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class ReporterDAL
    {
        public static List<Reporter> GetAll()
        {
            List<Reporter> reporters = new List<Reporter>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM reporters";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    reporters.Add(new Reporter
                    {
                        Id = reader.GetInt32("id"),
                        NameReporter = reader.GetString("name_reporter"),
                        PhoneReporter = reader.IsDBNull(reader.GetOrdinal("phone_reporter")) ? 
                                      null : reader.GetString("phone_reporter"),
                        EmailReporter = reader.GetString("email_reporter"),
                        IdNationalReporter = reader.GetString("id_national_reporter"),
                        AddressReporter = reader.GetString("address_reporter")
                    });
                }
            }
            return reporters;
        }

        public static void Insert(Reporter reporter)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"INSERT INTO reporters 
                (name_reporter, phone_reporter, email_reporter, id_national_reporter, address_reporter)
                VALUES (@name, @phone, @email, @nationalId, @address)";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@name", reporter.NameReporter);
                cmd.Parameters.AddWithValue("@phone", reporter.PhoneReporter);
                cmd.Parameters.AddWithValue("@email", reporter.EmailReporter);
                cmd.Parameters.AddWithValue("@nationalId", reporter.IdNationalReporter);
                cmd.Parameters.AddWithValue("@address", reporter.AddressReporter);

                cmd.ExecuteNonQuery();
            }
        }
    }
}