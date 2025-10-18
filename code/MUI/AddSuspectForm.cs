// UI/AddSuspectForm.cs
using System;
using System.Windows.Forms;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI
{
    public partial class AddSuspectForm : Form
    {
        private string mode;
        private Suspect suspect;

        public AddSuspectForm(string mode = "add", Suspect suspect = null)
        {
            InitializeComponent();
            this.mode = mode;
            this.suspect = suspect;
            SetupForm();
        }

        private void SetupForm()
        {
            cmbGender.Items.AddRange(new string[] { "ذكر", "أنثى" });
            cmbStatus.Items.AddRange(new string[] { "Wanted", "Arrested", "Cleared" });

            if (mode == "update" && suspect != null)
            {
                this.Text = "تعديل المشتبه به";
                btnSave.Text = "تحديث";
                txtFullName.Text = suspect.FullName;
                txtPhone.Text = suspect.Phone;
                cmbGender.SelectedItem = suspect.Gender;
                txtAddress.Text = suspect.Address;
                cmbStatus.SelectedItem = suspect.Status;
                txtAge.Text = suspect.Age.ToString();
                txtNationalId.Text = suspect.NationalId;
            }
            else
            {
                this.Text = "إضافة مشتبه به جديد";
                btnSave.Text = "إضافة";
            }
        }

        private void btnSave_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrEmpty(txtFullName.Text) || string.IsNullOrEmpty(txtPhone.Text) ||
                cmbGender.SelectedIndex == -1 || string.IsNullOrEmpty(txtAddress.Text) ||
                cmbStatus.SelectedIndex == -1 || string.IsNullOrEmpty(txtAge.Text) ||
                string.IsNullOrEmpty(txtNationalId.Text))
            {
                MessageBox.Show("يرجى إكمال جميع البيانات المطلوبة");
                return;
            }

            if (!int.TryParse(txtAge.Text, out int age))
            {
                MessageBox.Show("يرجى إدخال عمر صحيح");
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

        public Suspect GetSuspect()
        {
            int age = int.Parse(txtAge.Text);

            if (mode == "update" && suspect != null)
            {
                suspect.FullName = txtFullName.Text;
                suspect.Phone = txtPhone.Text;
                suspect.Gender = cmbGender.SelectedItem.ToString();
                suspect.Address = txtAddress.Text;
                suspect.Status = cmbStatus.SelectedItem.ToString();
                suspect.Age = age;
                suspect.NationalId = txtNationalId.Text;
                return suspect;
            }
            else
            {
                return new Suspect
                {
                    FullName = txtFullName.Text,
                    Phone = txtPhone.Text,
                    Gender = cmbGender.SelectedItem.ToString(),
                    Address = txtAddress.Text,
                    Status = cmbStatus.SelectedItem.ToString(),
                    Age = age,
                    NationalId = txtNationalId.Text
                };
            }
        }
    }
}