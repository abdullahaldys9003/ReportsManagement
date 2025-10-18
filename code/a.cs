using System;
using System.Windows.Forms;

namespace EmployeesDemo
{
    public partial class MainForm : Form
    {
        // تعريف الكلاس داخل نفس الصفحة
        public class Employee
        {
            public string NameFull { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public MainForm()
        {
            InitializeComponent();
            this.Load += MainForm_Load; // عند تحميل الفورم
        }

        private void MainForm_Load(object sender, EventArgs e)
        {
            // مصفوفة من الكائنات (الموظفين)
            Employee[] employees = new Employee[]
            {
                new Employee { NameFull = "أحمد علي", Username = "ahmed123", Email = "ahmed@example.com", Password = "pass1" },
                new Employee { NameFull = "سارة محمد", Username = "sara2025", Email = "sara@example.com", Password = "pass2" },
                new Employee { NameFull = "خالد يوسف", Username = "khaled", Email = "khaled@example.com", Password = "pass3" }
            };

            // ربط المصفوفة بـ DataGridView مباشرة
            dataGridView1.AutoGenerateColumns = true; // التأكد من إنشاء الأعمدة تلقائياً
            dataGridView1.DataSource = employees;
        }
    }
}