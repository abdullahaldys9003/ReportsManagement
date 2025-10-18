// UI/MainForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class MainForm : Form
    {
        private EmployeeService employeeService = new EmployeeService();
        private DepartmentService departmentService = new DepartmentService();
        private ReportService reportService = new ReportService();

        public MainForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            // تحميل الموظفين
            var employees = employeeService.GetEmployees();
            dataGridViewEmployees.DataSource = employees;

            // تحميل الإدارات
            var departments = departmentService.GetDepartments();
            dataGridViewDepartments.DataSource = departments;

            // تحميل البلاغات
            var reports = reportService.GetReports();
            dataGridViewReports.DataSource = reports;
        }

        private void btnAddEmployee_Click(object sender, EventArgs e)
        {
            var employee = new Employee
            {
                NameFull = txtName.Text,
                Username = txtUsername.Text,
                Password = txtPassword.Text,
                Email = txtEmail.Text,
                NumberPhone = txtPhone.Text,
                PositionType = txtPosition.Text,
                DepartmentId = int.Parse(txtDepartmentId.Text)
            };
            employeeService.AddEmployee(employee);
            LoadData();
            MessageBox.Show("تم إضافة الموظف بنجاح");
        }
        
        private void btnLogin_Click(object sender, EventArgs e)
        {
            var employee = employeeService.Login(txtLoginUsername.Text, txtLoginPassword.Text);
            if (employee != null)
            {
                MessageBox.Show($"مرحباً {employee.NameFull}");
                // فتح النافذة الرئيسية
            }
            else
            {
                MessageBox.Show("اسم المستخدم أو كلمة المرور غير صحيحة");
            }
        }

        private void btnAddReport_Click(object sender, EventArgs e)
        {
            var report = new Report
            {
                StatusReport = cmbStatusReport.Text,
                Description = txtDescription.Text,
                MainId = int.Parse(txtMainId.Text),
                SubId = int.Parse(txtSubId.Text),
                Status = cmbStatus.Text
            };

            reportService.AddReport(report);
            LoadData();
            MessageBox.Show("تم إضافة البلاغ بنجاح");
        }
    }
}