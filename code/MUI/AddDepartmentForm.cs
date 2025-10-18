// UI/AddDepartmentForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddDepartmentForm : Form
    {
        private string _mode;
        private Department _department;
        private NeighborhoodService _neighborhoodService = new NeighborhoodService();
        private DistrictService _districtService = new DistrictService();

        public AddDepartmentForm(string mode = "add", Department department = null)
        {
            InitializeComponent();
            _mode = mode;
            _department = department;
            SetupForm();
        }

        private void SetupForm()
        {
            cmbNeighborhood.DataSource = _neighborhoodService.GetNeighborhoods();
            cmbNeighborhood.DisplayMember = "Name";
            cmbNeighborhood.ValueMember = "Id";

            cmbDistrict.DataSource = _districtService.GetDistricts();
            cmbDistrict.DisplayMember = "Name";
            cmbDistrict.ValueMember = "Id";

            if (_mode == "update" && _department != null)
            {
                this.Text = "تعديل الإدارة";
                btnSave.Text = "تحديث";
                txtName.Text = _department.DepartmentName;
                txtAddress.Text = _department.Address;
                cmbNeighborhood.SelectedValue = _department.NeighborhoodsId;
                cmbDistrict.SelectedValue = _department.DistrictsId;
            }
            else
            {
                this.Text = "إضافة إدارة جديدة";
                btnSave.Text = "إضافة";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtName.Text) || string.IsNullOrEmpty(txtAddress.Text) || 
                cmbNeighborhood.SelectedIndex == -1 || cmbDistrict.SelectedIndex == -1)
            {
                MessageBox.Show("يرجى إكمال جميع البيانات");
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

        public Department GetDepartment()
        {
            if (_mode == "update" && _department != null)
            {
                _department.DepartmentName = txtName.Text;
                _department.Address = txtAddress.Text;
                _department.NeighborhoodsId = (int)cmbNeighborhood.SelectedValue;
                _department.DistrictsId = (int)cmbDistrict.SelectedValue;
                return _department;
            }
            else
            {
                return new Department 
                { 
                    DepartmentName = txtName.Text,
                    Address = txtAddress.Text,
                    NeighborhoodsId = (int)cmbNeighborhood.SelectedValue,
                    DistrictsId = (int)cmbDistrict.SelectedValue
                };
            }
        }
    }
}