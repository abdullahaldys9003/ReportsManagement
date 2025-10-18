// Helpers/DataGridViewHelper.cs
using System.Windows.Forms;

namespace DepartmentsSystem.Helpers
{
    public static class DataGridViewHelper
    {
        public static void AddButtonColumns(DataGridView dataGridView)
        {
            // إزالة الأزرار القديمة إذا موجودة
            RemoveButtonColumns(dataGridView);

            // زر تعديل
            DataGridViewButtonColumn editButton = new DataGridViewButtonColumn();
            editButton.HeaderText = "تعديل";
            editButton.Text = "تعديل";
            editButton.UseColumnTextForButtonValue = true;
            editButton.Width = 60;
            dataGridView.Columns.Add(editButton);

            // زر حذف
            DataGridViewButtonColumn deleteButton = new DataGridViewButtonColumn();
            deleteButton.HeaderText = "حذف";
            deleteButton.Text = "حذف";
            deleteButton.UseColumnTextForButtonValue = true;
            deleteButton.Width = 60;
            dataGridView.Columns.Add(deleteButton);
        }

        public static void RemoveButtonColumns(DataGridView dataGridView)
        {
            for (int i = dataGridView.Columns.Count - 1; i >= 0; i--)
            {
                if (dataGridView.Columns[i].HeaderText == "تعديل" || 
                    dataGridView.Columns[i].HeaderText == "حذف")
                {
                    dataGridView.Columns.RemoveAt(i);
                }
            }
        }
    }
}