// UI/AddReportForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddReportForm : Form
    {
        private string mode;
        private Report report;
        private ReportTypeService reportTypeService = new ReportTypeService();
        private ReporterService reporterService = new ReporterService();
        private SuspectService suspectService = new SuspectService();

        public AddReportForm(string mode = "add", Report report = null)
        {
            InitializeComponent();
            this.mode = mode;
            this.report = report;
            SetupForm();
        }

        private void SetupForm()
        {
            // تحميل أنواع البلاغات
            cmbMainType.DataSource = reportTypeService.GetMainTypes();
            cmbMainType.DisplayMember = "TypeName";
            cmbMainType.ValueMember = "Id";

            // تحميل المبلغين
            cmbReporter.DataSource = reporterService.GetReporters();
            cmbReporter.DisplayMember = "NameReporter";
            cmbReporter.ValueMember = "Id";

            // تحميل المشتبه بهم
            cmbSuspect.DataSource = suspectService.GetSuspects();
            
            cmbSuspect.DisplayMember = "FullName";
            cmbSuspect.ValueMember = "Id";

            cmbStatus.Items.AddRange(new string[] { "open", "in_progress", "closed" });
            cmbReportStatus.Items.AddRange(new string[] { "مغلق", "قيد المراجعة" });

            if (mode == "update" && report != null)
            {
                this.Text = "تعديل البلاغ";
                btnSave.Text = "تحديث";
                cmbReportStatus.SelectedItem = report.StatusReport;
                txtDescription.Text = report.Description;
                cmbMainType.SelectedValue = report.MainId;
                LoadSubTypes(report.MainId);
                cmbSubType.SelectedValue = report.SubId;
                cmbStatus.SelectedItem = report.Status;
            }
            else
            {
                this.Text = "إضافة بلاغ جديد";
                btnSave.Text = "إضافة";
            }
        }

        private void cmbMainType_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (cmbMainType.SelectedValue != null)
            {
                int mainTypeId = (int)cmbMainType.SelectedValue;
                LoadSubTypes(mainTypeId);
            }
        }

        private void LoadSubTypes(int mainTypeId)
        {
            cmbSubType.DataSource = reportTypeService.GetSubTypesByMain(mainTypeId);
            cmbSubType.DisplayMember = "SubTypeName";
            cmbSubType.ValueMember = "Id";
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (cmbReportStatus.SelectedIndex == -1 || string.IsNullOrEmpty(txtDescription.Text) ||
                cmbMainType.SelectedIndex == -1 || cmbSubType.SelectedIndex == -1 ||
                cmbStatus.SelectedIndex == -1 || cmbReporter.SelectedIndex == -1 ||
                cmbSuspect.SelectedIndex == -1)
            {
                MessageBox.Show("يرجى إكمال جميع البيانات المطلوبة");
                return;
            }

            this.DialogResult = DialogResult.OK;
            this.Close();
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }

        public Report GetReport()
        {
            if (mode == "update" && report != null)
            {
                report.StatusReport = cmbReportStatus.SelectedItem.ToString();
                report.Description = txtDescription.Text;
                report.MainId = (int)cmbMainType.SelectedValue;
                report.SubId = (int)cmbSubType.SelectedValue;
                report.Status = cmbStatus.SelectedItem.ToString();
                return report;
            }
            else
            {
                return new Report
                {
                    StatusReport = cmbReportStatus.SelectedItem.ToString(),
                    Description = txtDescription.Text,
                    MainId = (int)cmbMainType.SelectedValue,
                    SubId = (int)cmbSubType.SelectedValue,
                    Status = cmbStatus.SelectedItem.ToString()
                };
            }
        }

        public int GetReporterId()
        {
            return (int)cmbReporter.SelectedValue;
        }

        public int GetSuspectId()
        {
            return (int)cmbSuspect.SelectedValue;
        }
    }
}