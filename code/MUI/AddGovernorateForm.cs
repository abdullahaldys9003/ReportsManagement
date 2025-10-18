// UI/AddGovernorateForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddGovernorateForm : Form
    {
        private string _mode;
        private Governorate _governorate;

        public AddGovernorateForm(string mode = "add", Governorate governorate = null)
        {
            InitializeComponent();
            _mode = mode;
            _governorate = governorate;
            SetupForm();
        }

        private void SetupForm()
        {
            if (_mode == "update" && _governorate != null)
            {
                this.Text = "تعديل المحافظة";
                btnSave.Text = "تحديث";
                txtName.Text = _governorate.Name;
            }
            else
            {
                this.Text = "إضافة محافظة جديدة";
                btnSave.Text = "إضافة";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtName.Text))
            {
                MessageBox.Show("يرجى إدخال اسم المحافظة");
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

        public Governorate GetGovernorate()
        {
            if (_mode == "update" && _governorate != null)
            {
                _governorate.Name = txtName.Text;
                return _governorate;
            }
            else
            {
                return new Governorate { Name = txtName.Text };
            }
        }
    }
}