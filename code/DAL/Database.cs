// DAL/Database.cs
using MySql.Data.MySqlClient;

namespace DepartmentsSystem.DAL
{
    public class Database
    {
        private static string connectionString ="server=localhost;port=3306;user=root;password=root;database=departments_system;";

        public static MySqlConnection GetConnection()
        {
            return new MySqlConnection(connectionString);
        }
    }
}


private static string connectionString = 
    "server=localhost;port=3306;user=root;password=root;database=departments_system;Connection Timeout=60;SslMode=none;";