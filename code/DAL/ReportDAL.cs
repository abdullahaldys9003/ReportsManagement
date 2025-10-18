// DAL/ReportDAL.cs
using System;
using System.Collections.Generic;
using MySql.Data.MySqlClient;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.DAL
{
    public class ReportDAL
    {
        public static List<Report> GetAll()
        {
            List<Report> reports = new List<Report>();
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "SELECT * FROM reports";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    reports.Add(new Report
                    {
                        ReportId = reader.GetInt32("report_id"),
                        StatusReport = reader.GetString("status_report"),
                        Description = reader.GetString("description"),
                        MainId = reader.GetInt32("main_id"),
                        SubId = reader.GetInt32("sub_id"),
                        Status = reader.GetString("status_"),
                        CreatedAt = reader.GetDateTime("created_at")
                    });
                }
            }
            return reports;
        }

        public static void Insert(Report report)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = @"INSERT INTO reports 
                (status_report, description, main_id, sub_id, status_)
                VALUES (@statusReport, @description, @mainId, @subId, @status)";
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@statusReport", report.StatusReport);
                cmd.Parameters.AddWithValue("@description", report.Description);
                cmd.Parameters.AddWithValue("@mainId", report.MainId);
                cmd.Parameters.AddWithValue("@subId", report.SubId);
                cmd.Parameters.AddWithValue("@status", report.Status);

                cmd.ExecuteNonQuery();
            }
        }

        public static void UpdateStatus(int reportId, string status)
        {
            using (var conn = Database.GetConnection())
            {
                conn.Open();
                string query = "UPDATE reports SET status_=@status WHERE report_id=@id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@id", reportId);
                cmd.Parameters.AddWithValue("@status", status);
                cmd.ExecuteNonQuery();
            }
        }
    }
}


// في ReporterDAL.cs
public static void DeleteReporter(int id)
{
    using (var conn = Database.GetConnection())
    {
        conn.Open();
        string query = "DELETE FROM reporters WHERE id = @id";
        MySqlCommand cmd = new MySqlCommand(query, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.ExecuteNonQuery();
    }
}

// في SuspectDAL.cs
public static void DeleteSuspect(int id)
{
    using (var conn = Database.GetConnection())
    {
        conn.Open();
        string query = "DELETE FROM suspects WHERE id = @id";
        MySqlCommand cmd = new MySqlCommand(query, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.ExecuteNonQuery();
    }
}

// في ReportDAL.cs
public static void DeleteReport(int id)
{
    using (var conn = Database.GetConnection())
    {
        conn.Open();
        
        // حذف العلاقات أولاً
        string deleteRelations = "DELETE FROM report_reporter WHERE report_id = @id;" +
                               "DELETE FROM report_suspect WHERE report_id = @id;";
        MySqlCommand cmd1 = new MySqlCommand(deleteRelations, conn);
        cmd1.Parameters.AddWithValue("@id", id);
        cmd1.ExecuteNonQuery();
        
        // ثم حذف البلاغ
        string query = "DELETE FROM reports WHERE report_id = @id";
        MySqlCommand cmd2 = new MySqlCommand(query, conn);
        cmd2.Parameters.AddWithValue("@id", id);
        cmd2.ExecuteNonQuery();
    }
}

public static int AddReportWithRelations(Report report, int reporterId, int suspectId)
{
    using (var conn = Database.GetConnection())
    {
        conn.Open();
        using (var transaction = conn.BeginTransaction())
        {
            try
            {
                // إضافة البلاغ
                string reportQuery = @"INSERT INTO reports (status_report, description, main_id, sub_id, status_)
                                     VALUES (@statusReport, @description, @mainId, @subId, @status);
                                     SELECT LAST_INSERT_ID();";
                
                MySqlCommand cmd = new MySqlCommand(reportQuery, conn);
                cmd.Transaction = transaction;
                cmd.Parameters.AddWithValue("@statusReport", report.StatusReport);
                cmd.Parameters.AddWithValue("@description", report.Description);
                cmd.Parameters.AddWithValue("@mainId", report.MainId);
                cmd.Parameters.AddWithValue("@subId", report.SubId);
                cmd.Parameters.AddWithValue("@status", report.Status);
                
                int reportId = Convert.ToInt32(cmd.ExecuteScalar());
                
                // إضافة العلاقة مع المبلغ
                string reporterQuery = "INSERT INTO report_reporter (report_id, reporter_id) VALUES (@reportId, @reporterId)";
                MySqlCommand cmd2 = new MySqlCommand(reporterQuery, conn);
                cmd2.Transaction = transaction;
                cmd2.Parameters.AddWithValue("@reportId", reportId);
                cmd2.Parameters.AddWithValue("@reporterId", reporterId);
                cmd2.ExecuteNonQuery();
                
                // إضافة العلاقة مع المشتبه به
                string suspectQuery = "INSERT INTO report_suspect (report_id, suspect_id) VALUES (@reportId, @suspectId)";
                MySqlCommand cmd3 = new MySqlCommand(suspectQuery, conn);
                cmd3.Transaction = transaction;
                cmd3.Parameters.AddWithValue("@reportId", reportId);
                cmd3.Parameters.AddWithValue("@suspectId", suspectId);
                cmd3.ExecuteNonQuery();
                
                transaction.Commit();
                return reportId;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
        }
    }
}

