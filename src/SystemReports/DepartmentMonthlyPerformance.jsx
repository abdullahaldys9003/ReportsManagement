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
  LinearProgress,
} from '@mui/material';

// الأيقونات
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { getAllItems } from "../api/crudApi.js";

// دالة لجلب بيانات الأداء الشهري
const getDepartmentMonthlyPerformance = async (departmentId = 3) => {
  const params = { 
    tableName: "reports", 
    operation: "getDepartmentMonthlyPerformance",
    department_id: departmentId
  };
  return getAllItems("index.php", params);
};

const DepartmentMonthlyPerformance = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState(3);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDepartmentMonthlyPerformance(selectedDepartment);
        setData(result || []);
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDepartment]);

  // تنسيق اسم الشهر
  const getMonthName = (monthNumber) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[monthNumber - 1] || monthNumber;
  };

  // حساب الإحصائيات الإجمالية
  const totalStats = useMemo(() => {
    if (!data.length) return null;
    
    return {
      totalReports: data.reduce((sum, item) => sum + (item.total_reports || 0), 0),
      closedReports: data.reduce((sum, item) => sum + (item.closed_reports || 0), 0),
      inProgressReports: data.reduce((sum, item) => sum + (item.in_progress_reports || 0), 0),
      openedReports: data.reduce((sum, item) => sum + (item.opened_reports || 0), 0),
      avgProcessingHours: (data.reduce((sum, item) => sum + (item.avg_processing_hours || 0), 0) / data.length).toFixed(1),
      avgCompletionRate: (data.reduce((sum, item) => sum + (item.completion_rate || 0), 0) / data.length).toFixed(1)
    };
  }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'year',
        header: 'السنة',
        size: 80,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight="bold">
            {cell.getValue()}
          </Typography>
        ),
      },
      {
        accessorKey: 'month',
        header: 'الشهر',
        size: 100,
        Cell: ({ cell, row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthIcon sx={{ color: 'primary.main', fontSize: 18 }} />
            <Typography variant="body2">
              {getMonthName(cell.getValue())}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'total_reports',
        header: 'إجمالي البلاغات',
        size: 100,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            size="small" 
            color="primary"
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'closed_reports',
        header: 'مغلقة',
        size: 90,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            size="small" 
            color="success"
            variant="filled"
          />
        ),
      },
      {
        accessorKey: 'in_progress_reports',
        header: 'قيد المعالجة',
        size: 110,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            size="small" 
            color="warning"
            variant="filled"
          />
        ),
      },
      {
        accessorKey: 'opened_reports',
        header: 'مفتوحة',
        size: 90,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            size="small" 
            color="error"
            variant="filled"
          />
        ),
      },
      {
        accessorKey: 'avg_processing_hours',
        header: 'متوسط وقت المعالجة',
        size: 130,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon sx={{ color: 'info.main', fontSize: 18 }} />
            <Typography variant="body2">
              {cell.getValue()} ساعة
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'completion_rate',
        header: 'نسبة الإنجاز',
        size: 110,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon sx={{ 
              color: cell.getValue() >= 70 ? 'success.main' : 
                     cell.getValue() >= 50 ? 'warning.main' : 'error.main', 
              fontSize: 18 
            }} />
            <Typography 
              variant="body2" 
              fontWeight="bold"
              sx={{ 
                color: cell.getValue() >= 70 ? 'success.main' : 
                       cell.getValue() >= 50 ? 'warning.main' : 'error.main'
              }}
            >
              {cell.getValue()}%
            </Typography>
          </Box>
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
    enableBottomToolbar: true,
    enableSorting: true,
    initialState: {
      density: 'compact',
      sorting: [{ id: 'year', desc: true }, { id: 'month', desc: true }]
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e0e0e0',
      },
    },
    muiTableContainerProps: {
      sx: {
        maxWidth: '1200px',
        maxHeight: '600px',
        overflow: 'auto',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>القسم</InputLabel>
          <Select
            value={selectedDepartment}
            label="القسم"
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value={1}>القسم 1</MenuItem>
            <MenuItem value={2}>القسم 2</MenuItem>
            <MenuItem value={3}>القسم 3</MenuItem>
            <MenuItem value={4}>القسم 4</MenuItem>
          </Select>
        </FormControl>
        
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
  });

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>جاري تحميل بيانات الأداء...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <CssBaseline />
      
      {/* بطاقات الإحصائيات الإجمالية */}


      {/* الجدول */}
      <Box sx={{ p: 2 }}>
        <Paper>
          <MaterialReactTable table={table} />
        </Paper>
      </Box>

      {!loading && data.length === 0 && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            لا توجد بيانات للأداء الشهري
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DepartmentMonthlyPerformance;