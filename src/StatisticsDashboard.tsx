// UI/StatisticsDashboard.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assignment,
  Person,
  Warning,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatisticsDashboard = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      // بيانات وهمية للإحصائيات
      const mockStats = {
        totalReports: 1247,
        totalReporters: 893,
        totalSuspects: 562,
        resolvedReports: 843,
        pendingReports: 404,
        averageResolutionTime: '2.3 أيام',
        
        reportsByType: {
          labels: ['سرقة', 'اعتداء', 'تحرش', 'نشل', 'احتيال', 'أخرى'],
          data: [320, 280, 150, 120, 200, 177]
        },
        
        reportsByStatus: {
          labels: ['مكتمل', 'قيد التحقيق', 'معلق', 'مرفوض'],
          data: [843, 254, 120, 30]
        },
        
        monthlyTrend: {
          labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
          data: [180, 210, 190, 230, 250, 280]
        },
        
        topReporters: [
          { name: 'أحمد محمد', count: 12 },
          { name: 'فاطمة علي', count: 9 },
          { name: 'محمد حسين', count: 8 },
          { name: 'سارة عبدالله', count: 7 }
        ],
        
        topSuspects: [
          { name: 'علي أحمد', reports: 5 },
          { name: 'حسين محمد', reports: 4 },
          { name: 'فاضل عبدالله', reports: 4 },
          { name: 'محمود سعيد', reports: 3 }
        ],
        
        reportsByHour: Array.from({ length: 24 }, (_, i) => Math.floor(Math.random() * 50) + 20),
        
        resolutionRate: 68, // نسبة الحل %
        satisfactionRate: 92 // نسبة الرضا %
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>جاري تحميل الإحصائيات...</Typography>;
  }

  if (!stats) {
    return <Typography>حدث خطأ في تحميل البيانات</Typography>;
  }

  // إعداد بيانات المخططات
  const reportsByTypeData = {
    labels: stats.reportsByType.labels,
    datasets: [
      {
        label: 'عدد البلاغات',
        data: stats.reportsByType.data,
        backgroundColor: [
          alpha(theme.palette.primary.main, 0.8),
          alpha(theme.palette.secondary.main, 0.8),
          alpha(theme.palette.error.main, 0.8),
          alpha(theme.palette.warning.main, 0.8),
          alpha(theme.palette.info.main, 0.8),
          alpha(theme.palette.success.main, 0.8)
        ],
        borderWidth: 0,
      },
    ],
  };

  const reportsByStatusData = {
    labels: stats.reportsByStatus.labels,
    datasets: [
      {
        data: stats.reportsByStatus.data,
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.info.main,
          theme.palette.error.main
        ],
        borderWidth: 0,
      },
    ],
  };

  const monthlyTrendData = {
    labels: stats.monthlyTrend.labels,
    datasets: [
      {
        label: 'عدد البلاغات',
        data: stats.monthlyTrend.data,
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const hourlyDistributionData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'عدد البلاغات',
        data: stats.reportsByHour,
        backgroundColor: alpha(theme.palette.primary.main, 0.6),
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        rtl: true,
      },
    },
  };

  const StatCard = ({ title, value, icon, trend, subtitle }: any) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ color: trend === 'up' ? 'success.main' : 'error.main' }}>
            {icon}
          </Box>
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {trend === 'up' ? '+12%' : '-5%'} عن الشهر الماضي
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* العنوان ومحدد الوقت */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">لوحة تحليل البلاغات</Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>الفترة</InputLabel>
          <Select
            value={timeRange}
            label="الفترة"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">أسبوع</MenuItem>
            <MenuItem value="month">شهر</MenuItem>
            <MenuItem value="quarter">ربع سنة</MenuItem>
            <MenuItem value="year">سنة</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* بطاقات الإحصائيات السريعة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="إجمالي البلاغات"
            value={stats.totalReports.toLocaleString()}
            icon={<Assignment sx={{ fontSize: 40 }} />}
            trend="up"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="البلاغات المكتملة"
            value={stats.resolvedReports.toLocaleString()}
            icon={<CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />}
            subtitle={`${stats.resolutionRate}% نسبة الحل`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="البلاغات قيد التحقيق"
            value={stats.pendingReports.toLocaleString()}
            icon={<Schedule sx={{ fontSize: 40, color: 'warning.main' }} />}
            trend="down"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="متوسط وقت الحل"
            value={stats.averageResolutionTime}
            icon={<TrendingUp sx={{ fontSize: 40, color: 'info.main' }} />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* توزيع البلاغات حسب النوع */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              توزيع البلاغات حسب النوع
            </Typography>
            <Bar data={reportsByTypeData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* توزيع البلاغات حسب الحالة */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              توزيع البلاغات حسب الحالة
            </Typography>
            <Doughnut data={reportsByStatusData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* الاتجاه الشهري */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              الاتجاه الشهري للبلاغات
            </Typography>
            <Line data={monthlyTrendData} options={chartOptions} />
          </Paper>
        </Grid>

        {/* التوزيع اليومي */}
        <Grid item xs={4} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              التوزيع اليومي للبلاغات
            </Typography>
            <Bar 
              data={hourlyDistributionData} 
              options={{
                ...chartOptions,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'الساعة'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'عدد البلاغات'
                    }
                  }
                }
              }} 
            />
          </Paper>
        </Grid>

        {/* أكثر المبلغين */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              أكثر المبلغين نشاطاً
            </Typography>
            <Box sx={{ mt: 2 }}>
              {stats.topReporters.map((reporter: any, index: number) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography>{reporter.name}</Typography>
                  </Box>
                  <Chip label={`${reporter.count} بلاغ`} size="small" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* أكثر المشتبه بهم */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              أكثر المشتبه بهم تكرراً
            </Typography>
            <Box sx={{ mt: 2 }}>
              {stats.topSuspects.map((suspect: any, index: number) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Warning sx={{ mr: 1, color: 'error.main' }} />
                    <Typography>{suspect.name}</Typography>
                  </Box>
                  <Chip label={`${suspect.reports} بلاغ`} size="small" color="error" />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* مؤشرات الأداء */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              مؤشرات الأداء الرئيسية
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="primary.main">
                    {stats.resolutionRate}%
                  </Typography>
                  <Typography variant="body2">نسبة حل البلاغات</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="success.main">
                    {stats.satisfactionRate}%
                  </Typography>
                  <Typography variant="body2">معدل رضا المبلغين</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="info.main">
                    2.3
                  </Typography>
                  <Typography variant="body2">متوسط أيام الحل</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" color="warning.main">
                    89%
                  </Typography>
                  <Typography variant="body2">معدل الاستجابة</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatisticsDashboard;