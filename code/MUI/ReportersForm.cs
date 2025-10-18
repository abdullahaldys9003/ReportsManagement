// UI/ReportersForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class ReportersForm : Form
    {
        private ReporterService reporterService = new ReporterService();

        public ReportersForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = reporterService.GetReporters();
            dataGridView1.Columns["Id"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddReporterForm addForm = new AddReporterForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                Reporter reporter = addForm.GetReporter();
                reporterService.AddReporter(reporter);
                MessageBox.Show("تم إضافة المبلغ بنجاح");
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
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    Reporter reporter = new Reporter
                    {
                        Id = id,
                        NameReporter = grid.Rows[e.RowIndex].Cells["NameReporter"].Value.ToString(),
                        PhoneReporter = grid.Rows[e.RowIndex].Cells["PhoneReporter"].Value != null ? grid.Rows[e.RowIndex].Cells["PhoneReporter"].Value.ToString() : null,
                        EmailReporter = grid.Rows[e.RowIndex].Cells["EmailReporter"].Value.ToString(),
                        IdNationalReporter = grid.Rows[e.RowIndex].Cells["IdNationalReporter"].Value.ToString(),
                        AddressReporter = grid.Rows[e.RowIndex].Cells["AddressReporter"].Value.ToString()
                    };

                    AddReporterForm editForm = new AddReporterForm("update", reporter);
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        Reporter updatedReporter = editForm.GetReporter();
                        MessageBox.Show("تم التحديث بنجاح");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    string name = grid.Rows[e.RowIndex].Cells["NameReporter"].Value.ToString();

                    DialogResult result = MessageBox.Show(
                        "هل تريد حذف المبلغ '" + name + "'؟",
                        "تأكيد الحذف",
                        MessageBoxButtons.YesNo,
                        MessageBoxIcon.Warning);

                    if (result == DialogResult.Yes)
                    {
                        MessageBox.Show("تم الحذف بنجاح");
                        LoadData();
                    }
                }
            }
        }
    }
}