// UI/DistrictsForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class DistrictsForm : Form
    {
        private DistrictService districtService = new DistrictService();

        public DistrictsForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = districtService.GetDistricts();
            dataGridView1.Columns["Id"].Visible = false;
            dataGridView1.Columns["GovernorateId"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddDistrictForm addForm = new AddDistrictForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                var district = addForm.GetDistrict();
                int newId = districtService.AddDistrict(district);
                MessageBox.Show($"تم إضافة المنطقة بنجاح برقم: {newId}");
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
                var grid = sender as DataGridView;
                string columnName = grid.Columns[e.ColumnIndex].HeaderText;

                if (columnName == "تعديل")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    string name = grid.Rows[e.RowIndex].Cells["Name"].Value?.ToString();
                    int governorateId = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["GovernorateId"].Value);

                    var district = new District
                    {
                        Id = id,
                        Name = name,
                        GovernorateId = governorateId
                    };

                    AddDistrictForm editForm = new AddDistrictForm("update", district);
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        var updatedDistrict = editForm.GetDistrict();
                        bool success = districtService.UpdateDistrict(updatedDistrict);
                        MessageBox.Show(success ? "تم التحديث بنجاح" : "فشل التحديث");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    string name = grid.Rows[e.RowIndex].Cells["Name"].Value?.ToString();

                    DialogResult result = MessageBox.Show(
                        $"هل تريد حذف المنطقة '{name}'؟", 
                        "تأكيد الحذف", 
                        MessageBoxButtons.YesNo, 
                        MessageBoxIcon.Warning);

                    if (result == DialogResult.Yes)
                    {
                        bool success = districtService.DeleteDistrict(id);
                        MessageBox.Show(success ? "تم الحذف بنجاح" : "فشل الحذف");
                        LoadData();
                    }
                }
            }
        }
    }
}