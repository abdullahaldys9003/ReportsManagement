// في Form_Load
private void Form1_Load(object sender, EventArgs e)
{
    var departments = DepartmentDAL.GetAll(); // ترجع List<Department>

    comboBoxDepartments.DataSource = departments;
    comboBoxDepartments.DisplayMember = "Name";      // الحقل الذي يظهر للمستخدم
    comboBoxDepartments.ValueMember = "DepartmentId"; // القيمة الحقيقية (ID)
}


int selectedId = (int)comboBoxDepartments.SelectedValue;
string selectedName = comboBoxDepartments.Text;