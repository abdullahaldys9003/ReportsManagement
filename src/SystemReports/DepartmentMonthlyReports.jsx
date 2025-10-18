import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CssBaseline,
  Typography,
} from '@mui/material';
import { getAllItems } from "../api/crudApi.js";

// دالة الجلب باستخدام getAllItems مع بارامتر القسم
const getDepartmentMonthlyReports = async (departmentId = 2) => {
  const params = { 
    tableName: "department_monthly_reports", 
    operation: "show",
    department_id: departmentId 
  };
  return getAllItems("index.php", params);
};

// تحويل رقم الشهر إلى اسم عربي
const getArabicMonthName = (monthNumber) => {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  return months[monthNumber - 1] || monthNumber;
};

const DepartmentMonthlyReports = () => {
  const [data, setData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDepartmentMonthlyReports(selectedDepartment);
        setData(result || []); // التأكد من أن البيانات مصفوفة
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        setData([]); // في حال حدوث خطأ نجعل البيانات فارغة
      }
    };
    fetchData();
  }, [selectedDepartment]);

  return (
    <Box sx={{ p: 2 }}>
      <CssBaseline />
      <Paper sx={{ p: 2 }}>
        <FormControl size="small" sx={{ mb: 2, minWidth: 150 }}>
          <InputLabel>القسم</InputLabel>
          <Select
            value={selectedDepartment}
            label="القسم"
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value={1}>القسم 1</MenuItem>
            <MenuItem value={2}>القسم 2</MenuItem>
            <MenuItem value={3}>القسم 3</MenuItem>
          </Select>
        </FormControl>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>السنة</th>
              <th style={thStyle}>الشهر</th>
              <th style={thStyle}>إجمالي البلاغات</th>
              <th style={thStyle}>البلاغات المغلقة</th>
              <th style={thStyle}>بلاغات قيد المعالجة</th>
              <th style={thStyle}>البلاغات المفتوحة</th>
              <th style={thStyle}>متوسط وقت المعالجة (ساعة)</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={`${row.year}-${row.month}`}>
                  <td style={tdStyle}>{row.year}</td>
                  <td style={tdStyle}>{getArabicMonthName(row.month)}</td>
                  <td style={tdStyle}>{row.total_reports}</td>
                  <td style={tdStyle}>{row.closed}</td>
                  <td style={tdStyle}>{row.in_progress}</td>
                  <td style={tdStyle}>{row.opened}</td>
                  <td style={tdStyle}>{row.avg_processing_hours || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan={7}>
                  لا توجد بيانات للعرض
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

// ستايل بسيط للرؤوس والخلايا
const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  background: '#f5f5f5',
  textAlign: 'center',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'center',
};

export default DepartmentMonthlyReports;

