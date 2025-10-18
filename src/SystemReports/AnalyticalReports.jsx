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
} from '@mui/material';
// الأيقونات
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// ثيم أنيق مع ألوان هادئة

import { ho }  from "../hosts";

const getStatisticsData = async () => {
  const response = await axios.get(`http://${ho}:8084`, {
    params: { 
      tableName: "department_statistics", 
      operation: "show_7",
    }
  });
  return response.data;
};

const AnalyticalReports = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getStatisticsData();
        setData(result); // النتيجة الفعلية من السيرفر
      } catch (error) {
        alert(error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'most_common_sub_type',
        header: 'الفئة',
        size: 120,
        Cell: ({ cell }) => {
          const category = cell.getValue();
          const categoryNames = {
            'report_type': 'نوع البلاغ',
            'day': 'اليوم',
            'hour': 'الساعة',
            'area': 'المنطقة'
          };
          return categoryNames[category] || category;
        }
      },
      {
        accessorKey: 'most_common_day',
        header: 'الايام',
        size: 200,
      },
      {
        accessorKey: 'most_common_hour',
        header: 'الساعة',
        size: 200,
      },
      {
        accessorKey: 'most_common_area',
        header: 'المناطق',
        size: 100,
        Cell: ({ cell }) => (
          <Chip 
            label={cell.getValue()} 
            color="primary" 
            variant="outlined"
            size="small"
          />
        )
      },
    ],
    []
  );

  // حساب الإحصائيات الإجمالية
  const totalReports = useMemo(() => {
    return data.reduce((sum, item) => sum + item.count, 0);
  }, [data]);

  // الحصول على أعلى القيم في كل فئة
  const topStats = useMemo(() => {
    const categories = {};
    data.forEach(item => {
      if (!categories[item.category] || item.count > categories[item.category].count) {
        categories[item.category] = item;
      }
    });
    return categories;
  }, [data]);

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
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e0e0e0',
      },
    },
    muiTableContainerProps: {
      sx: {
      mainWidth:'400px',
        maxHeight: '600px',
        overflow: 'auto',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          إحصائيات البلاغات
        </Typography>
        <Chip 
          label={`إجمالي البلاغات: ${totalReports}`} 
          color="primary" 
          variant="filled"
        />
      </Box>
    ),
  });

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <Paper>
          <MaterialReactTable table={table} />
        </Paper>
      </Box>
    </Box>
  );
};

export default AnalyticalReports;