
private void Form1_Load(object sender, EventArgs e)
{
    DataGridViewHelper.AddButtonColumns(dataGridView1);
    dataGridView1.CellContentClick += dataGridView1_CellContentClick;
}


public static class DataGridViewHelper
{
    public static void AddButtonColumns(DataGridView grid)
    {
        // زر تعديل
        DataGridViewButtonColumn editButton = new DataGridViewButtonColumn();
        editButton.HeaderText = "تعديل";
        editButton.Text = "تعديل";
        editButton.UseColumnTextForButtonValue = true;
        grid.Columns.Add(editButton);

        // زر حذف
        DataGridViewButtonColumn deleteButton = new DataGridViewButtonColumn();
        deleteButton.HeaderText = "حذف";
        deleteButton.Text = "حذف";
        deleteButton.UseColumnTextForButtonValue = true;
        grid.Columns.Add(deleteButton);
    }
}