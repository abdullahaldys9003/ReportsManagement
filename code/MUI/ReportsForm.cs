// UI/ReportsForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class ReportsForm : Form
    {
        private ReportService reportService = new ReportService();

        public ReportsForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = reportService.GetReports();
            dataGridView1.Columns["ReportId"].Visible = false;
            dataGridView1.Columns["MainId"].Visible = false;
            dataGridView1.Columns["SubId"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddReportForm addForm = new AddReportForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                Report report = addForm.GetReport();
                int reporterId = addForm.GetReporterId();
                int suspectId = addForm.GetSuspectId();
                
                MessageBox.Show("تم إضافة البلاغ بنجاح");
                LoadData();
            }
        }

        private void btnRefresh_Click(object sender, EventArgs e)
        {
            LoadData();
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                DataGridView grid = (DataGridView)sender;
                string columnName = grid.Columns[e.ColumnIndex].HeaderText;

                if (columnName == "تعديل")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["ReportId"].Value);
                    Report report = new Report
                    {
                        ReportId = id,
                        StatusReport = grid.Rows[e.RowIndex].Cells["StatusReport"].Value.ToString(),
                        Description = grid.Rows[e.RowIndex].Cells["Description"].Value.ToString(),
                        MainId = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["MainId"].Value),
                        SubId = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["SubId"].Value),
                        Status = grid.Rows[e.RowIndex].Cells["Status"].Value.ToString()
                    };

                    AddReportForm editForm = new AddReportForm("update", report);
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        Report updatedReport = editForm.GetReport();
                        reportService.UpdateReportStatus(updatedReport.ReportId, updatedReport.Status);
                        MessageBox.Show("تم تحديث حالة البلاغ بنجاح");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["ReportId"].Value);
                    string description = grid.Rows[e.RowIndex].Cells["Description"].Value.ToString();

                    DialogResult result = MessageBox.Show(
                        "هل تريد حذف البلاغ '" + description + "'؟",
                        "تأكيد الحذف",
                        MessageBoxButtons.YesNo,
                        MessageBoxIcon.Warning);

                    if (result == DialogResult.Yes)
                    {
                        MessageBox.Show("تم حذف البلاغ بنجاح");
                        LoadData();
                    }
                }
            }
        }
    }
}