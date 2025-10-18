// UI/DepartmentsForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class DepartmentsForm : Form
    {
        private DepartmentService departmentService = new DepartmentService();

        public DepartmentsForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = departmentService.GetDepartments();
            dataGridView1.Columns["Id"].Visible = false;
            dataGridView1.Columns["NeighborhoodsId"].Visible = false;
            dataGridView1.Columns["DistrictsId"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddDepartmentForm addForm = new AddDepartmentForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                var department = addForm.GetDepartment();
                int newId = departmentService.AddDepartment(department);
                MessageBox.Show($"تم إضافة الإدارة بنجاح بررقم: {newId}");
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
                    string name = grid.Rows[e.RowIndex].Cells["DepartmentName"].Value?.ToString();
                    string address = grid.Rows[e.RowIndex].Cells["Address"].Value?.ToString();
                    int neighborhoodId = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["NeighborhoodsId"].Value);
                    int districtId = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["DistrictsId"].Value);

                    var department = new Department
                    {
                        Id = id,
                        DepartmentName = name,
                        Address = address,
                        NeighborhoodsId = neighborhoodId,
                        DistrictsId = districtId
                    };

                    AddDepartmentForm editForm = new AddDepartmentForm("update", department);
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        var updatedDepartment = editForm.GetDepartment();
                        bool success = departmentService.UpdateDepartment(updatedDepartment);
                        MessageBox.Show(success ? "تم التحديث بنجاح" : "فشل التحديث");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    string name = grid.Rows[e.RowIndex].Cells["DepartmentName"].Value?.ToString();

                    DialogResult result = MessageBox.Show(
                        $"هل تريد حذف الإدارة '{name}'؟", 
                        "تأكيد الحذف", 
                        MessageBoxButtons.YesNo, 
                        MessageBoxIcon.Warning);

                    if (result == DialogResult.Yes)
                    {
                        bool success = departmentService.DeleteDepartment(id);
                        MessageBox.Show(success ? "تم الحذف بنجاح" : "فشل الحذف");
                        LoadData();
                    }
                }
            }
        }
    }
}