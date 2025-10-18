import React from 'react';
import { Box, Card, Typography, Paper, Grid, useTheme } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportersReport = () => {
  const theme = useTheme();

  // بيانات وهمية للتقرير
  const reportData = {
    totalReporters: 150,
    activeReporters: 75,
    activePercentage: 50,
    regions: [
      { name: 'المنطقة الشمالية', count: 45, percentage: 30 },
      { name: 'المنطقة الجنوبية', count: 35, percentage: 23.3 },
      { name: 'المنطقة الشرقية', count: 40, percentage: 26.7 },
      { name: 'المنطقة الغربية', count: 30, percentage: 20 },
    ],
    monthlyTrend: [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 145, 150],
    lastUpdated: '2025-09-06'
  };

  // بيانات لمخطط الدونات (نشطين vs غير نشطين)
  const doughnutData = {
    labels: ['نشطين', 'غير نشطين'],
    datasets: [
      {
        data: [reportData.activeReporters, reportData.totalReporters - reportData.activeReporters],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.grey[300],
        ],
        borderColor: [
          theme.palette.success.dark,
          theme.palette.grey[400],
        ],
        borderWidth: 2,
      },
    ],
  };

  // بيانات لمخطط الأعمدة (التوزيع حسب المنطقة)
  const barData = {
    labels: reportData.regions.map(region => region.name),
    datasets: [
      {
        label: 'عدد المبلغين',
        data: reportData.regions.map(region => region.count),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.warning.main,
        ],
        borderColor: [
          theme.palette.primary.dark,
          theme.palette.secondary.dark,
          theme.palette.info.dark,
          theme.palette.warning.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true,
      },
      title: {
        display: true,
        text: 'توزيع المبلغين حسب المنطقة',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true,
      },
      title: {
        display: true,
        text: 'نسبة المبلغين النشطين',
      },
    },
  };

  return (
    <Box sx={{ padding: 3, direction: 'rtl', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* رأس التقرير */}
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 3, 
          marginBottom: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          تقرير المبلغين - سبتمبر 2025
        </Typography>
        <Typography variant="subtitle1">
          آخر تحديث: {new Date(reportData.lastUpdated).toLocaleDateString('ar-SA')}
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* بطاقات الإحصائيات الرئيسية */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              إجمالي المبلغين
            </Typography>
            <Typography variant="h3" color="primary">
              {reportData.totalReporters}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ padding: 2, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
            <Typography variant="h6" color="success.main" gutterBottom>
              المبلغين النشطين
            </Typography>
            <Typography variant="h3" color="success.main">
              {reportData.activeReporters}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({reportData.activePercentage}%)
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
            <Typography variant="h6" color="warning.main" gutterBottom>
              متوسط المبلغين بالمنطقة
            </Typography>
            <Typography variant="h3" color="warning.main">
              {Math.round(reportData.regions.reduce((sum, region) => sum + region.count, 0) / reportData.regions.length)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ padding: 2, textAlign: 'center', backgroundColor: '#fbe9e7' }}>
            <Typography variant="h6" color="error.main" gutterBottom>
              غير النشطين
            </Typography>
            <Typography variant="h3" color="error.main">
              {reportData.totalReporters - reportData.activeReporters}
            </Typography>
          </Card>
        </Grid>

        {/* مخطط الدونات */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </Card>
        </Grid>

        {/* مخطط الأعمدة */}
        <Grid item xs={12} md={6}>
          <Card sx={{ padding: 2 }}>
            <Bar data={barData} options={options} />
          </Card>
        </Grid>

        {/* تفاصيل التوزيع حسب المنطقة */}
        <Grid item xs={12}>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ marginBottom: 2 }}>
              تفصيل حسب المنطقة:
            </Typography>
            <Grid container spacing={2}>
              {reportData.regions.map((region, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      padding: 2, 
                      textAlign: 'center',
                      borderLeft: `4px solid ${
                        index === 0 ? theme.palette.primary.main :
                        index === 1 ? theme.palette.secondary.main :
                        index === 2 ? theme.palette.info.main :
                        theme.palette.warning.main
                      }`
                    }}
                  >
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      {region.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {region.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      مبلغ ({region.percentage}%)
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* معلومات إضافية */}
        <Grid item xs={12}>
          <Card sx={{ padding: 3, backgroundColor: '#fffde7' }}>
            <Typography variant="h6" gutterBottom>
              ملاحظات وإحصائيات إضافية:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography variant="body1">
                  <strong>أعلى منطقة:</strong> {reportData.regions.reduce((max, region) => region.count > max.count ? region : max).name} 
                  ({Math.max(...reportData.regions.map(r => r.count))} مبلغ)
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>أقل منطقة:</strong> {reportData.regions.reduce((min, region) => region.count < min.count ? region : min).name} 
                  ({Math.min(...reportData.regions.map(r => r.count))} مبلغ)
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>معدل النمو:</strong> +15% عن الشهر الماضي
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>التوقعات:</strong> سيصل إجمالي المبلغين إلى 170 بحلول نهاية الشهر
                </Typography>
              </li>
            </Box>
          </Card>
        </Grid>

        {/* تذييل التقرير */}
        <Grid item xs={12}>
          <Paper sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" color="text.secondary">
              تم إنشاء هذا التقرير تلقائياً بواسطة نظام إدارة البلاغات • 
              للإبلاغ عن أي أخطاء أو استفسارات، يرجى التواصل مع الدعم الفني
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportersReport;