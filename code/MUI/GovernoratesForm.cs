// UI/GovernoratesForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Helpers;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class GovernoratesForm : Form
    {
        private GovernorateService governorateService = new GovernorateService();

        public GovernoratesForm()
        {
            InitializeComponent();
            LoadData();
        }

        private void LoadData()
        {
            dataGridView1.DataSource = governorateService.GetGovernorates();
            dataGridView1.Columns["Id"].Visible = false;
            DataGridViewHelper.AddButtonColumns(dataGridView1);
        }

        private void btnAdd_Click(object sender, EventArgs e)
        {
            AddGovernorateForm addForm = new AddGovernorateForm();
            if (addForm.ShowDialog() == DialogResult.OK)
            {
                var governorate = addForm.GetGovernorate(); //اراجاع name من حقل ال FORM 
                int newId = governorateService.AddGovernorate(governorate);
                MessageBox.Show($"تم إضافة المحافظة بنجاح برقم: {newId}");
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

                    var governorate = new Governorate
                    {
                        Id = id,
                        Name = name
                    };

                    AddGovernorateForm editForm = new AddGovernorateForm("update", governorate);
                    
                    if (editForm.ShowDialog() == DialogResult.OK)
                    {
                        var updatedGovernorate = editForm.GetGovernorate();
                        bool success = governorateService.UpdateGovernorate(updatedGovernorate);
                        MessageBox.Show(success ? "تم التحديث بنجاح" : "فشل التحديث");
                        LoadData();
                    }
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(grid.Rows[e.RowIndex].Cells["Id"].Value);
                    
                    string name = grid.Rows[e.RowIndex].Cells["Name"].Value?.ToString();

                    DialogResult result = MessageBox.Show(
                        $"هل تريد حذف المحافظة '{name}'؟", 
                        "تأكيد الحذف", 
                        MessageBoxButtons.YesNo, 
                        MessageBoxIcon.Warning);

                    if (result == DialogResult.Yes)
                    {
                        bool success = governorateService.DeleteGovernorate(id);
                        MessageBox.Show(success ? "تم الحذف بنجاح" : "فشل الحذف");
                        LoadData();
                    }
                }
            }
        }
    }
}