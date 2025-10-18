
using DepartmentsSystem.BLL;
using DepartmentsSystem.Models;

namespace DepartmentsSystem.UI


private GovernorateService governorateService = new GovernorateService();

private void LoadData()
       {
         dataGridView1.DataSource = governorateService.GetGovernorates();
          DataGridViewHelper.AddButtonColumns(dataGridView1);
         dataGridView1.CellContentClick += dataGridView1_CellContentClick;    
      }
        
private void btnAddGovernorate_Click(object sender, EventArgs e)
{

       if (string.IsNullOrEmpty(txtName.Text))
           {
           MessageBox.Show("يرجى إدخال اسم الدولة");
          return;
      }
      
      
    var governorate = new Governorate
    {
        Name = txtGovernorateName.Text
    };
    
         AddGovernorate addForm = new AddGovernorate("update",governorate);
        
       int newId = governorateService.AddGovernorate(governorate);
      LoadData();
}



private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
{
    if (e.RowIndex >= 0)
    {
        var grid = sender as DataGridView;
        string columnName = grid.Columns[e.ColumnIndex].HeaderText;

        if (columnName == "تعديل")
         string name = grid.Rows[e.RowIndex].Cells["Name"].Value?.ToString();
            string id = grid.Rows[e.RowIndex].Cells["Id"].Value?.ToString();
            
             var governorate = new Governorate
              {     Id = nint.Parse(id),
                    Name = name,
               };

         AddGovernorate addForm = new AddGovernorate("update",governorate);
         
            MessageBox.Show("تم الضغط على تعديل");
        }
        else if (columnName == "حذف")
        {
            MessageBox.Show("تم الضغط على حذف");
        }
    }
}



