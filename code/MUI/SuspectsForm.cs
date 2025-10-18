// UI/SuspectsForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class SuspectsForm : Form
    {
        private SuspectService suspectService = new SuspectService();

        public SuspectsForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = suspectService.GetSuspects();
            dataGridView1.Columns["Id"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddSuspectForm addForm = new AddSuspectForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                Suspect suspect = addForm.GetSuspect();
                suspectService.AddSuspect(suspect);
                MessageBox.Show("تم إضافة المشتبه به بنجاح");
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
                    Suspect suspect = new Suspect
                    {
                        Id = id,
                        FullName = grid.Rows[e.RowIndex].Cells["FullName"].Value.ToString(),
                        Phone = grid.Rows[e.RowIndex].Cells["Phone"].Value.ToString(),
                        Gender = grid.Rows[e.RowIndex].Cells["Gender"].Value.ToString(),
                        Address = grid.Rows[e.RowIndex].Cells["Address"].Value.ToString(),
                        Status = grid.Rows[e.RowIndex].Cells["Status"].Value.ToString(),
                        Age = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Age"].Value),
                        NationalId = grid.Rows[e.RowIndex].Cells["NationalId"].Value.ToString()
                    };

                    AddSuspectForm editForm = new AddSuspectForm("update", suspect);
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        Suspect updatedSuspect = editForm.GetSuspect();
                        MessageBox.Show("تم التحديث بنجاح");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    string name = grid.Rows[e.RowIndex].Cells["FullName"].Value.ToString();

                    DialogResult result = MessageBox.Show(
                        "هل تريد حذف المشتبه به '" + name + "'؟",
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