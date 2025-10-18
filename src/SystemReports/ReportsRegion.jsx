import { useMemo, useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

import axios from 'axios';

import {
  Chip,
  Box,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  alpha,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
// الأيقونات
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// ثيم أنيق مع ألوان هادئة
const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Cairo',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const ReportsRegion = () => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  // دالة لجلب البيانات من API
  const fetchReportData = async () => {
    try {
      // في التطبيق الحقيقي، استبدل هذا بطلب API الفعلي
      const response = await axios.get('/api/reports/statistics', {
        params: { period }
      });
      
      // معالجة البيانات لتتناسب مع هيكل الاستعلام
      const processedData = response.data.map(item => ({
        Main_Type: item.type_name,
        Sub_Type: item.sub_type_name,
        Governorate: item.name, // المحافظة
        District: item.district_name,
        Report_Count: item.report_count,
        Resolution_Rate: item.resolution_rate
      }));
      
      setData(processedData);
      setLoading(false);
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
      
      // استخدام بيانات وهمية للعرض في حالة فشل الجلب
      const mockData = [
        {
          Main_Type: 'سرقة',
          Sub_Type: 'سرقة مركبات',
          Governorate: 'عدن',
          District: 'مديرية السلام',
          Report_Count: 125,
          Resolution_Rate: 72.5
        },
        {
          Main_Type: 'حريق',
          Sub_Type: 'حريق منزل',
          Governorate: 'عدن',
          District: 'مديرية المعافر',
          Report_Count: 89,
          Resolution_Rate: 81.2
        },
        {
          Main_Type: 'حادث مروري',
          Sub_Type: 'تصادم',
          Governorate: 'عدن',
          District: 'مديرية القاهرة',
          Report_Count: 156,
          Resolution_Rate: 78.3
        },
        {
          Main_Type: 'بلاغ طبي',
          Sub_Type: 'حالة طارئة',
          Governorate: 'عدن',
          District: 'مديرية صالة',
          Report_Count: 72,
          Resolution_Rate: 85.7
        },
        {
          Main_Type: 'انقطاع خدمات',
          Sub_Type: 'انقطاع مياه',
          Governorate: 'عدن',
          District: 'مديرية السلام',
          Report_Count: 94,
          Resolution_Rate: 68.2
        },
      ];
      
      setData(mockData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [period]);

  // حساب الإحصائيات الإجمالية
  const totalStats = useMemo(() => {
    return data.reduce((acc, item) => ({
      Report_Count: acc.Report_Count + item.Report_Count,
      Resolution_Rate: acc.Resolution_Rate + item.Resolution_Rate,
      totalItems: acc.totalItems + 1,
    }), {
      Report_Count: 0,
      Resolution_Rate: 0,
      totalItems: 0,
    });
  }, [data]);

  const averageResolutionRate = totalStats.totalItems > 0 
    ? (totalStats.Resolution_Rate / totalStats.totalItems) 
    : 0;

  const columns = useMemo(
    () => [
      {
        accessorKey: 'Main_Type',
        header: 'النوع الرئيسي',
        size: 120,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            color="primary" 
            variant="outlined"
            size="small"
          />
        ),
      },
      {
        accessorKey: 'Sub_Type',
        header: 'النوع الفرعي',
        size: 120,
      },
      {
        accessorKey: 'Governorate',
        header: 'المحافظة',
        size: 100,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationCityIcon sx={{ fontSize: 18, mr: 0.5 }} />
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: 'District',
        header: 'المديرية',
        size: 100,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MapIcon sx={{ fontSize: 18, mr: 0.5 }} />
            {cell.getValue()}
          </Box>
        ),
      },
      {
        accessorKey: 'Report_Count',
        header: 'عدد البلاغات',
        size: 100,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            color={
              cell.getValue() > 100 ? "error" : 
              cell.getValue() > 50 ? "warning" : "info"
            } 
            size="small"
          />
        ),
      },
      {
        accessorKey: 'Resolution_Rate',
        header: 'معدل الحل %',
        size: 100,
        Cell: ({ cell }) => (
          <Chip 
            label={`${cell.getValue().toFixed(1)}%`} 
            color={
              cell.getValue() >= 80 ? "success" : 
              cell.getValue() >= 60 ? "warning" : "error"
            } 
            size="small"
          />
        ),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    paginationDisplayMode: 'pages',
    muiPaginationProps: {
      size: 'small',
      shape: 'rounded',
    },
    enableSorting: true,
    initialState: {
      density: 'compact',
      sorting: [{ id: 'Report_Count', desc: true }]
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e0e0e0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
        overflow: 'auto',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>الفترة</InputLabel>
          <Select
            value={period}
            label="الفترة"
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="week">أسبوع</MenuItem>
            <MenuItem value="month">شهر</MenuItem>
            <MenuItem value="quarter">ربع سنة</MenuItem>
            <MenuItem value="year">سنة</MenuItem>
          </Select>
        </FormControl>
      </Box>
    ),
    state: {
      isLoading: loading,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} />
          إحصائيات البلاغات حسب النوع والمنطقة
        </Typography>
        
        {/* بطاقات الإحصائيات */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  إجمالي البلاغات
                </Typography>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  {totalStats.Report_Count}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.1) }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  متوسط معدل الحل
                </Typography>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  {averageResolutionRate.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.info.main, 0.1) }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  عدد الأنواع
                </Typography>
                <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AccountBalanceIcon sx={{ mr: 1 }} />
                  {totalStats.totalItems}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography color="textSecondary" gutterBottom>
                  الفترة المحددة
                </Typography>
                <Typography variant="h6" component="div">
                  {period === 'week' ? 'أسبوع' : 
                   period === 'month' ? 'شهر' : 
                   period === 'quarter' ? 'ربع سنة' : 'سنة'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper>
            <MaterialReactTable table={table} />
          </Paper>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default ReportsRegion;