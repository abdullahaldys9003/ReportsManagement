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
        private ReporterService reporterService = new ReporterService();
        private SuspectService suspectService = new SuspectService();
        private ReportTypeService reportTypeService = new ReportTypeService();

        public MainForm()
        {
            InitializeComponent();
            LoadAllData();
        }

        private void LoadAllData()
        {
            // تحميل جميع البيانات
            dataGridViewEmployees.DataSource = employeeService.GetEmployees();
            dataGridViewDepartments.DataSource = departmentService.GetDepartments();
            dataGridViewReports.DataSource = reportService.GetReports();
            dataGridViewReporters.DataSource = reporterService.GetReporters();
            dataGridViewSuspects.DataSource = suspectService.GetSuspects();

            // تحميل أنواع البلاغات
            cmbMainTypes.DataSource = reportTypeService.GetMainTypes();
            cmbMainTypes.DisplayMember = "TypeName";
            cmbMainTypes.ValueMember = "Id";
        }

        private void cmbMainTypes_SelectedIndexChanged(object sender, EventArgs e)
        {
            // عند اختيار نوع رئيسي، تحميل الأنواع الفرعية
            if (cmbMainTypes.SelectedValue != null)
            {
                int mainTypeId = (int)cmbMainTypes.SelectedValue;
                cmbSubTypes.DataSource = reportTypeService.GetSubTypesByMain(mainTypeId);
                cmbSubTypes.DisplayMember = "SubTypeName";
                cmbSubTypes.ValueMember = "Id";
            }
        }

        private void btnAddReporter_Click(object sender, EventArgs e)
        {
            var reporter = new Reporter
            {
                NameReporter = txtReporterName.Text,
                PhoneReporter = txtReporterPhone.Text,
                EmailReporter = txtReporterEmail.Text,
                IdNationalReporter = txtReporterNationalId.Text,
                AddressReporter = txtReporterAddress.Text
            };

            reporterService.AddReporter(reporter);
            LoadAllData();
            MessageBox.Show("تم إضافة المبلغ بنجاح");
        }

        private void btnAddSuspect_Click(object sender, EventArgs e)
        {
            var suspect = new Suspect
            {
                FullName = txtSuspectName.Text,
                Phone = txtSuspectPhone.Text,
                Gender = cmbSuspectGender.Text,
                Address = txtSuspectAddress.Text,
                Status = cmbSuspectStatus.Text,
                Age = int.Parse(txtSuspectAge.Text),
                NationalId = txtSuspectNationalId.Text
            };

            suspectService.AddSuspect(suspect);
            LoadAllData();
            MessageBox.Show("تم إضافة المشتبه به بنجاح");
        }

        private void btnAddReport_Click(object sender, EventArgs e)
        {
            var report = new Report
            {
                StatusReport = cmbReportStatus.Text,
                Description = txtReportDescription.Text,
                MainId = (int)cmbMainTypes.SelectedValue,
                SubId = (int)cmbSubTypes.SelectedValue,
                Status = "open"
            };

            reportService.AddReport(report);
            LoadAllData();
            MessageBox.Show("تم إضافة البلاغ بنجاح");
        }
    }
}