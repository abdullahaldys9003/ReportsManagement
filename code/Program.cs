using System;
using System.Net.Http;
using System.Text;
using Newtonsoft.Json;

class Program
{
    static async System.Threading.Tasks.Task Main(string[] args)
    {
        // بيانات المرسل
        var reporterData = new
        {
            name_reporter = "أحمد علي سعيد",
            phone_reporter = "777123456",
            email_reporter = "ahmed@example.com",
            id_national_reporter = "1234567890",
            address_reporter = "صنعاء - شارع الزبيري"
        };

        // تحويل البيانات إلى JSON
        string jsonData = JsonConvert.SerializeObject(reporterData);
        var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

        // إرسال البيانات إلى PHP
        using (var client = new HttpClient())
        {
            try
            {
                HttpResponseMessage response = await client.PostAsync("http://yourdomain.com/receive_from_csharp.php", content);
                string responseString = await response.Content.ReadAsStringAsync();
                Console.WriteLine("استجابة الخادم: " + responseString);
            }
            catch (Exception ex)
            {
                Console.WriteLine("خطأ: " + ex.Message);
            }
        }
    }
}


using System;
using System.Data;
using System.Windows.Forms;

namespace DepartmentsSystem
{
    public partial class Form1 : Form
    {
        private DataTable table;

        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            // إنشاء جدول البيانات وربطه بالـ DataGridView
            table = CreateArabicData();
            dataGridView1.DataSource = table;

            // إضافة أعمدة الأزرار
            AddButtonColumns();
        }

        private DataTable CreateArabicData()
        {
            // إنشاء DataTable
            DataTable table = new DataTable();

            // إنشاء الأعمدة
            table.Columns.Add("رقم التقرير", typeof(int));
            table.Columns.Add("حالة التقرير", typeof(string));
            table.Columns.Add("الوصف", typeof(string));
            table.Columns.Add("الرقم الرئيسي", typeof(int));
            table.Columns.Add("الرقم الفرعي", typeof(int));
            table.Columns.Add("الحالة", typeof(string));
            table.Columns.Add("تاريخ الإنشاء", typeof(DateTime));

            // إضافة بيانات وهمية بالعربي
            table.Rows.Add(1, "قيد الانتظار", "تقرير عن الموارد البشرية", 101, 201, "مفتوح", DateTime.Now.AddDays(-5));
            table.Rows.Add(2, "مكتمل", "تقرير قسم المالية", 102, 202, "مغلق", DateTime.Now.AddDays(-3));
            table.Rows.Add(3, "قيد التنفيذ", "تقرير قسم تقنية المعلومات", 103, 203, "قيد المعالجة", DateTime.Now);

            return table;
        }

        private void AddButtonColumns()
        {
            // زر تعديل
            DataGridViewButtonColumn editButton = new DataGridViewButtonColumn();
            editButton.HeaderText = "تعديل";
            editButton.Text = "تعديل";
            editButton.UseColumnTextForButtonValue = true;
            dataGridView1.Columns.Add(editButton);

            // زر حذف
            DataGridViewButtonColumn deleteButton = new DataGridViewButtonColumn();
            deleteButton.HeaderText = "حذف";
            deleteButton.Text = "حذف";
            deleteButton.UseColumnTextForButtonValue = true;
            dataGridView1.Columns.Add(deleteButton);

            // ربط الحدث
            dataGridView1.CellContentClick += dataGridView1_CellContentClick;
        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                string columnName = dataGridView1.Columns[e.ColumnIndex].HeaderText;

                if (columnName == "تعديل")
                {
                    // منطق التعديل
                    MessageBox.Show("تعديل السجل رقم: " + dataGridView1.Rows[e.RowIndex].Cells["رقم التقرير"].Value);
                }
                else if (columnName == "حذف")
                {
                    // منطق الحذف
                    DialogResult result = MessageBox.Show("هل تريد حذف السجل؟", "تأكيد الحذف", MessageBoxButtons.YesNo);
                    if (result == DialogResult.Yes)
                    {
                        dataGridView1.Rows.RemoveAt(e.RowIndex);
                    }
                }
            }
        }
    }
}