// UI/AddNeighborhoodForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddNeighborhoodForm : Form
    {
        private string _mode;
        private Neighborhood _neighborhood;
        private DistrictService _districtService = new DistrictService();

        public AddNeighborhoodForm(string mode = "add", Neighborhood neighborhood = null)
        {
            InitializeComponent();
            _mode = mode;
            _neighborhood = neighborhood;
            SetupForm();
        }

        private void SetupForm()
        {
            cmbDistrict.DataSource = _districtService.GetDistricts();
            cmbDistrict.DisplayMember = "Name";
            cmbDistrict.ValueMember = "Id";

            if (_mode == "update" && _neighborhood != null)
            {
                this.Text = "تعديل الحي";
                btnSave.Text = "تحديث";
                txtName.Text = _neighborhood.Name;
                cmbDistrict.SelectedValue = _neighborhood.DistrictId;
            }
            else
            {
                this.Text = "إضافة حي جديد";
                btnSave.Text = "إضافة";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtName.Text) || cmbDistrict.SelectedIndex == -1)
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

        public Neighborhood GetNeighborhood()
        {
            if (_mode == "update" && _neighborhood != null)
            {
                _neighborhood.Name = txtName.Text;
                _neighborhood.DistrictId = (int)cmbDistrict.SelectedValue;
                return _neighborhood;
            }
            else
            {
                return new Neighborhood 
                { 
                    Name = txtName.Text,
                    DistrictId = (int)cmbDistrict.SelectedValue
                };
            }
        }
    }
}