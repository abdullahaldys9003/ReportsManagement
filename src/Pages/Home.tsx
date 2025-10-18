import React, { useState, useEffect } from 'react';
import { BarChart, PieChart } from '@mui/x-charts';
import axios from 'axios';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';

import { ho } from "../hosts";

import { getAllItems } from "../api/crudApi.js";
const getDashboardData = async () => {
   const result = await getAllItems("index.php", {
    tableName: "reports",
    operation: 'getDashboardStatistics'
  });
  alert(result);
  if(result.status="success")
  return result;
  else alert(result.message);
};

const HomePage = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    openReports: 0,
    inProgressReports: 0,
    closedReports: 0,
    totalDepartments: 0,
    totalEmployees: 0
  });
  const [reportTypesData, setReportTypesData] = useState([]);
  const [reportStatusData, setReportStatusData] = useState([]);
  const [reportsByDistrict, setReportsByDistrict] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDashboardData();
        
        if (result.status === 'success') {
          const data = result.data;
          
          // تعيين الإحصائيات الأساسية
          setStats({
            totalReports: data.stats.totalReports || 0,
            openReports: data.stats.openReports || 0,
            inProgressReports: data.stats.inProgressReports || 0,
            closedReports: data.stats.closedReports || 0,
            totalDepartments: data.stats.totalDepartments || 0,
            totalEmployees: data.stats.totalEmployees || 0
          });

          // تعيين أنواع البلاغات
          setReportTypesData(data.reportTypes || []);

          // تعيين حالة البلاغات مع تحويل النصوص
          const statusMap = {
            'opened': 'مفتوحة',
            'prosse': 'قيد المعالجة', 
            'closed': 'مغلقة'
          };
          
          const formattedStatusData = (data.reportStatus || []).map((item, index) => ({
            id: index + 1,
            status: statusMap[item.status] || item.status,
            value: item.value,
            color: item.color
          }));
          setReportStatusData(formattedStatusData);

          // تعيين البلاغات حسب المنطقة
          setReportsByDistrict(data.reportsByDistrict || []);

          // تعيين أحدث البلاغات مع تحويل النصوص
          const formattedRecentReports = (data.recentReports || []).map(report => ({
            ...report,
            status: statusMap[report.status] || report.status,
            date: new Date(report.date).toLocaleDateString('ar-EG')
          }));
          setRecentReports(formattedRecentReports);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ترجمة حالة البلاغات للألوان
  const getStatusColor = (status) => {
    switch(status) {
      case 'مفتوحة': return '#ffcdd2';
      case 'قيد المعالجة': return '#bbdefb';
      case 'مغلقة': return '#c8e6c9';
      default: return '#f5f5f5';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">جاري تحميل البيانات...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          لوحة تحكم نظام الإبلاغ
        </Typography>
        <Chip 
          label="عرض البلاغات المرسلة للإدارة" 
          color="success" 
          variant="outlined"
        />
      </Box>
      
      {/* بطاقات الإحصائيات السريعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي البلاغات المرسلة
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalReports}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                تم إرسالها للإدارة
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                بلاغات مفتوحة
              </Typography>
              <Typography variant="h4" component="div" color="error">
                {stats.openReports}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                قيد المعالجة
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {stats.inProgressReports}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                بلاغات مغلقة
              </Typography>
              <Typography variant="h4" component="div" color="success">
                {stats.closedReports}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                عدد الأقسام
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalDepartments}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                عدد الموظفين
              </Typography>
              <Typography variant="h4" component="div">
                {stats.totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* الرسوم البيانية */}
      <Grid container spacing={3}>
        {/* رسم بياني لأعداد البلاغات حسب النوع */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              البلاغات المرسلة حسب النوع
            </Typography>
            {reportTypesData.length > 0 ? (
              <BarChart
                xAxis={[{ 
                  scaleType: 'band', 
                  data: reportTypesData.map(item => item.type),
                  label: 'نوع البلاغ'
                }]}
                series={[{ 
                  data: reportTypesData.map(item => item.count),
                  label: 'عدد البلاغات'
                }]}
                width={500}
                height={300}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">لا توجد بلاغات مرسلة</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* رسم بياني دائري لحالة البلاغات */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              حالة البلاغات المرسلة
            </Typography>
            {reportStatusData.length > 0 ? (
              <PieChart
                series={[{
                  data: reportStatusData.map(item => ({
                    id: item.id,
                    value: item.value,
                    label: item.status
                  }))
                }]}
                width={400}
                height={200}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">لا توجد بلاغات مرسلة</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* رسم بياني لتوزيع البلاغات حسب المنطقة */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              توزيع البلاغات المرسلة حسب المنطقة
            </Typography>
            {reportsByDistrict.length > 0 ? (
              <BarChart
                xAxis={[{ 
                  scaleType: 'band', 
                  data: reportsByDistrict.map(item => item.district),
                  label: 'المنطقة'
                }]}
                series={[{ 
                  data: reportsByDistrict.map(item => item.count),
                  label: 'عدد البلاغات'
                }]}
                width={500}
                height={300}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">لا توجد بلاغات مرسلة</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* جدول أحدث البلاغات المرسلة */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                أحدث البلاغات المرسلة
              </Typography>
              <Chip 
                label="مرسلة للإدارة" 
                size="small" 
                color="success"
              />
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>رقم البلاغ</TableCell>
                    <TableCell>اسم القسم</TableCell>
                    <TableCell>النوع</TableCell>
                    <TableCell>التاريخ</TableCell>
                    <TableCell>الحالة</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentReports.length > 0 ? (
                    recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.id}</TableCell>
                      <TableCell>{report.department_name}</TableCell>
                        <TableCell>{report.type}</TableCell>
                        
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'inline-block',
                              px: 1,
                              borderRadius: 1,
                              backgroundColor: getStatusColor(report.status)
                            }}
                          >
                            {report.status}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography color="textSecondary">لا توجد بلاغات مرسلة</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;