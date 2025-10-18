import { useMemo,useEffect,useState} from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
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
} from '@mui/material';
// الأيقونات
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// ثيم أنيق مع ألوان هادئة



const ho ='127.0.0.1';
const getDepartment_statistics = async () => {
      const response = await axios.get(`http://${ho}:8084`, {
        params: { tableName: "department_statistics", operation: "show_6" }
      });
      return response.data;
      
};


// بيانات وهمية بناء على الاستعلام المقدم


const DepartmentReportsTable = () => {
  const [data, setData] = useState([]);
  
 
 useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await getDepartment_statistics();
      setData(result); // النتيجة الفعلية من السيرفر
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
  };

  fetchData();
}, []);
 
  const columns = useMemo<MRT_ColumnDef<typeof data[0]>[]>(
    () => [
      {
        accessorKey: 'neighborhood_name',
        header: 'اسم المنطقة',
        size: 100,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapIcon color="action" fontSize="small" />
            <Typography variant="body2">
              {cell.getValue<string>()}
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
            icon={<AssignmentIcon />}
            label={cell.getValue<number>()}
            size="small"
            color="primary"
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'crime_type',
        header: 'نوع البلاغ',
        size: 100,
      },
      {
        accessorKey: 'opened_reports',
        header: 'البلاغات المفتوحة',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            icon={<PendingActionsIcon />}
            label={cell.getValue<number>()}
            size="small"
            color="warning"
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'closed_reports',
        header: 'البلاغات المغلقة',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            icon={<CheckCircleIcon />}
            label={cell.getValue<number>()}
            size="small"
            color="success"
            variant="outlined"
          />
        ),
      },
      {
        accessorKey: 'prosse_reports',
        header: 'قيد المعالجة',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            icon={<CheckCircleIcon />}
            label={cell.getValue<number>()}
            size="small"
            color="success"
            variant="outlined"
          />
        ),
      },
    ],
    []
  );

  // حساب الإحصائيات الإجمالية
  const totalStats = useMemo(() => {
    return data.reduce((acc, item) => ({
      total_reports: acc.total_reports + item.total_reports,
      opened_reports: acc.opened_reports + item.opened_reports,
      closed_reports: acc.closed_reports + item.closed_reports,
    }), { total_reports: 0, opened_reports: 0, closed_reports: 0 });
  }, []);

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
      sorting: [{ id: 'total_reports', desc: true }]
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      },
    },
  muiTableContainerProps: {
      sx: {
        maxHeight: '500px',
        maxWidth: '800px',
        overflow: 'auto',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>الفترة</InputLabel>
          <Select
            value="month"
            label="الفترة"
            onChange={() => {}}
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

  return (

      <Box sx={{ p: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'primary.main',
            fontWeight: '600',
            textAlign: 'center',
            mb: 3,
          }}
        >
           تقارير القسم
        </Typography>
        
        {/* بطاقات الإحصائيات الإجمالية */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
        </Grid>

        <Paper>
          <MaterialReactTable table={table} />
        </Paper>
      </Box>

  );
};

export default DepartmentReportsTable;