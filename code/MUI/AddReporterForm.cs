// UI/AddReporterForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddReporterForm : Form
    {
        private string mode;
        private Reporter reporter;

        public AddReporterForm(string mode = "add", Reporter reporter = null)
        {
            InitializeComponent();
            this.mode = mode;
            this.reporter = reporter;
            SetupForm();
        }

        private void SetupForm()
        {
            if (mode == "update" && reporter != null)
            {
                this.Text = "تعديل المبلغ";
                btnSave.Text = "تحديث";
                txtName.Text = reporter.NameReporter;
                txtPhone.Text = reporter.PhoneReporter;
                txtEmail.Text = reporter.EmailReporter;
                txtNationalId.Text = reporter.IdNationalReporter;
                txtAddress.Text = reporter.AddressReporter;
            }
            else
            {
                this.Text = "إضافة مبلغ جديد";
                btnSave.Text = "إضافة";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtName.Text) || string.IsNullOrEmpty(txtEmail.Text) ||
                string.IsNullOrEmpty(txtNationalId.Text) || string.IsNullOrEmpty(txtAddress.Text))
            {
                MessageBox.Show("يرجى إكمال جميع البيانات المطلوبة");
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

        public Reporter GetReporter()
        {
            if (mode == "update" && reporter != null)
            {
                reporter.NameReporter = txtName.Text;
                reporter.PhoneReporter = string.IsNullOrEmpty(txtPhone.Text) ? null : txtPhone.Text;
                reporter.EmailReporter = txtEmail.Text;
                reporter.IdNationalReporter = txtNationalId.Text;
                reporter.AddressReporter = txtAddress.Text;
                return reporter;
            }
            else
            {
                return new Reporter
                {
                    NameReporter = txtName.Text,
                    PhoneReporter = string.IsNullOrEmpty(txtPhone.Text) ? null : txtPhone.Text,
                    EmailReporter = txtEmail.Text,
                    IdNationalReporter = txtNationalId.Text,
                    AddressReporter = txtAddress.Text
                };
            }
        }
    }
}