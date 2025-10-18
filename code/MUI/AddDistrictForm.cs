// UI/AddDistrictForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddDistrictForm : Form
    {
        private string _mode;
        private District _district;
        private GovernorateService _governorateService = new GovernorateService();

        public AddDistrictForm(string mode = "add", District district = null)
        {
            InitializeComponent();
            _mode = mode;
            _district = district;
            SetupForm();
        }

        private void SetupForm()
        {
            cmbGovernorate.DataSource = _governorateService.GetGovernorates();
            cmbGovernorate.DisplayMember = "Name";
            cmbGovernorate.ValueMember = "Id";

            if (_mode == "update" && _district != null)
            {
                this.Text = "تعديل المنطقة";
                btnSave.Text = "تحديث";
                txtName.Text = _district.Name;
                cmbGovernorate.SelectedValue = _district.GovernorateId;
            }
            else
            {
                this.Text = "إضافة منطقة جديدة";
                btnSave.Text = "إضافة";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtName.Text) || cmbGovernorate.SelectedIndex == -1)
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

        public District GetDistrict()
        {
            if (_mode == "update" && _district != null)
            {
                _district.Name = txtName.Text;
                _district.GovernorateId = (int)cmbGovernorate.SelectedValue;
                return _district;
            }
            else
            {
                return new District 
                { 
                    Name = txtName.Text,
                    GovernorateId = (int)cmbGovernorate.SelectedValue
                };
            }
        }
    }
}