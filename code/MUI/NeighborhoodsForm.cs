// UI/NeighborhoodsForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class NeighborhoodsForm : Form
    {
        private NeighborhoodService neighborhoodService = new NeighborhoodService();

        public NeighborhoodsForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = neighborhoodService.GetNeighborhoods();
            dataGridView1.Columns["Id"].Visible = false;
            dataGridView1.Columns["DistrictId"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddNeighborhoodForm addForm = new AddNeighborhoodForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                var neighborhood = addForm.GetNeighborhood();
                int newId = neighborhoodService.AddNeighborhood(neighborhood);
                MessageBox.Show($"تم إضافة الحي بنجاح برقم: {newId}");
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
                    int districtId = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["DistrictId"].Value);

                    var neighborhood = new Neighborhood
                    {
                        Id = id,
                        Name = name,
                        DistrictId = districtId
                    };

                    AddNeighborhoodForm editForm = new AddNeighborhoodForm("update", neighborhood);
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        var updatedNeighborhood = editForm.GetNeighborhood();
                        bool success = neighborhoodService.UpdateNeighborhood(updatedNeighborhood);
                        MessageBox.Show(success ? "تم التحديث بنجاح" : "فشل التحديث");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    string name = grid.Rows[e.RowIndex].Cells["Name"].Value?.ToString();

                    DialogResult result = MessageBox.Show(
                        $"هل تريد حذف الحي '{name}'؟", 
                        "تأكيد الحذف", 
                        MessageBoxButtons.YesNo, 
                        MessageBoxIcon.Warning);

                    if (result == DialogResult.Yes)
                    {
                        bool success = neighborhoodService.DeleteNeighborhood(id);
                        MessageBox.Show(success ? "تم الحذف بنجاح" : "فشل الحذف");
                        LoadData();
                    }
                }
            }
        }
    }
}