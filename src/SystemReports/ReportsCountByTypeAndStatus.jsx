
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

import { getAllItems } from "../api/crudApi.js";

// ثيم أنيق مع ألوان هادئة


const getDepartment_statistics = async (selectedPeriod) => {
    const params = { tableName: "department_statistics", operation: "getReportsCountByTypeAndStatus",
      period:selectedPeriod,
    };
     
   return getAllItems("index.php",params);
  
};

const ReportsCountByTypeAndStatus = () => {
  const [data, setData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDepartment_statistics(selectedPeriod);
        setData(result); // النتيجة الفعلية من السيرفر
      } catch (error) {
        console.error("حدث خطأ أثناء جلب البيانات:", error);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'type_name',
        header: 'البلاغ الرئيسي',
        size: 120,
      },
      {
        accessorKey: 'sub_type_name',
        header: 'النوع الفرعي',
        size: 100,
      },
      {
        accessorKey: 'total',
        header: 'مجموع البلاغات',
        size: 100,
      },

      {
        accessorKey: 'opened',
        header: 'البلاغات المفتوحة',
        size: 120,
      },
      {
        accessorKey: 'closed',
        header: 'البلاغات المغلقة',
        size: 120,
      },
      {
        accessorKey: 'prosse',
        header: 'بلاغات قيد المعالجة',
        size: 120,
      },
    ],
    []
  );

  // حساب الإحصائيات الإجمالية


  const table = useMaterialReactTable({
    columns,
    data,
    enablePagination: true,
    enableBottomToolbar: false,
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
      //  overflow: 'hidden',
      },
    },
  muiTableContainerProps: {
      sx: {
     //   maxWidth:'1110px',
        maxWidth:'800px',
        maxHeight: '600px',
        overflow: 'auto',
      },
    },
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>الفترة</InputLabel>
          <Select
            value={selectedPeriod}
            label="الفترة"
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <MenuItem value="week">أسبوع</MenuItem>
            <MenuItem value="month">شهر</MenuItem>
            <MenuItem value="year">سنة</MenuItem>
          </Select>
        </FormControl>
      </Box>
    ),
  });

  return (
    <Box>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Paper>
          <MaterialReactTable table={table} />
        </Paper>
      </Box>
    </Box>
  );
};

export default ReportsCountByTypeAndStatus;
