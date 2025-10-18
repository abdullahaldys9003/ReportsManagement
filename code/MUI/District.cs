// UI/DistrictsForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class DistrictsForm : Form
    {
        private DistrictService districtService = new DistrictService();
        private GovernorateService governorateService = new GovernorateService();
        
        public DistrictsForm()
        {
            InitializeComponent();
            LoadGovernorates();
            LoadDistricts();
            AddButtonColumns();
        }

        private void LoadGovernorates()
        {
            cmbGovernorate.DataSource = governorateService.GetGovernorates();
            
            cmbGovernorate.DisplayMember = "Name";
            cmbGovernorate.ValueMember = "Id";
            cmbGovernorate.SelectedIndex = -1;
        }

        private void LoadDistricts()
        {
            dataGridView1.DataSource = districtService.GetDistricts();
            dataGridView1.Columns["Id"].Visible = false;
            dataGridView1.Columns["GovernorateId"].Visible = false;
        }

        private void AddButtonColumns()
        {
            // زر تعديل
            DataGridViewButtonColumn editButton = new DataGridViewButtonColumn();
            editButton.HeaderText = "تعديل";
            editButton.Text = "تعديل";
            editButton.UseColumnTextForButtonValue = true;
            dataGridView1.Columns.Add(editButton);

            // زر حذف
            DataGridViewButtonColumn deleteButton = new DataGridViewButtonColumn();
            deleteButton.HeaderText = "حذف";
            deleteButton.Text = "حذف";
            deleteButton.UseColumnTextForButtonValue = true;
            dataGridView1.Columns.Add(deleteButton);

            dataGridView1.CellContentClick += dataGridView1_CellContentClick;
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                string columnName = dataGridView1.Columns[e.ColumnIndex].HeaderText;

                if (columnName == "تعديل")
                {
                    int id = Convert.ToInt32(dataGridView1.Rows[e.RowIndex].Cells["Id"].Value);
                    EditDistrict(id);
                }
                else if (columnName == "حذف")
                {
                    int id = Convert.ToInt32(dataGridView1.Rows[e.RowIndex].Cells["Id"].Value);
                    DeleteDistrict(id);
                }
            }
        }

        private void EditDistrict(int id)
        {
            var district = districtService.GetDistrict(id);
            if (district != null)
            {
                txtName.Text = district.Name;
                cmbGovernorate.SelectedValue = district.GovernorateId;
                btnSave.Text = "تحديث";
                btnSave.Tag = id;
            }
        }

        private void DeleteDistrict(int id)
        {
            DialogResult result = MessageBox.Show("هل تريد حذف هذه المنطقة؟", "تأكيد الحذف", MessageBoxButtons.YesNo);
            if (result == DialogResult.Yes)
            {
                bool success = districtService.DeleteDistrict(id);
                MessageBox.Show(success ? "تم الحذف بنجاح" : "فشل الحذف");
                LoadDistricts();
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtName.Text) || cmbGovernorate.SelectedIndex == -1)
            {
                MessageBox.Show("يرجى إكمال جميع البيانات");
                return;
            }

            if (btnSave.Tag != null) // تعديل
            {
                int id = (int)btnSave.Tag;
                var district = new District
                {
                    Id = id,
                    Name = txtName.Text,
                    GovernorateId = (int)cmbGovernorate.SelectedValue
                };

                bool success = districtService.UpdateDistrict(district);
                MessageBox.Show(success ? "تم التحديث بنجاح" : "فشل التحديث");
                btnSave.Tag = null;
                btnSave.Text = "إضافة";
            }
            else // إضافة
            {
                var district = new District
                {
                    Name = txtName.Text,
                    GovernorateId = (int)cmbGovernorate.SelectedValue
                };

                int newId = districtService.AddDistrict(district);
                MessageBox.Show($"تم الإضافة بنجاح برقم: {newId}");
            }

            ClearForm();
            LoadDistricts();
        }

        private void ClearForm()
        {
            txtName.Clear();
            cmbGovernorate.SelectedIndex = -1;
        }

        private void btnRefresh_Click(object sender, EventArgs e)
        {
            LoadDistricts();
        }
    }
}