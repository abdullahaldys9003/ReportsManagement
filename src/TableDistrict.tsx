import { useMemo } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';

import {
  Chip,
  Box,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  alpha,
} from '@mui/material';
// الأيقونات
import MosqueIcon from '@mui/icons-material/Mosque';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LocationCityIcon from '@mui/icons-material/LocationCity';

// ثيم أنيق مع ألوان هادئة
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // أخضر داكن أنيق
      light: '#81C784',
      dark: '#1B5E20',
    },
    secondary: {
      main: '#0288D1', // أزرق أنيق
      light: '#B3E5FC',
      dark: '#01579B',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Tajawal", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha('#2E7D32', 0.05),
          },
        },
      },
    },
  },
});

// بيانات المثال
const data = [
  {
    city: "عدن",
    district: "المديرية الأولى",
    neighborhood_name: "حي النزهة",
    alley_name: "حارة الانصار",
    time_period: "ليلًا",
    most_active_time: "من 8 مساءً إلى 12 منتصف الليل",
    improvement: -5,
    complaints: 22
  },
  {
    city: "تعز",
    district: "المديرية المركزية",
    neighborhood_name: "حي السلام",
    alley_name: "الحارة الشهيد عيسى",
    time_period: "نهارًا",
    most_active_time: "من 10 صباحًا إلى 2 ظهرًا",
    improvement: 22,
    complaints: 22
  },
  {
    city: "صنعاء",
    district: "مديرية التحرير",
    neighborhood_name: "حي الروضة",
    alley_name: "الحارة الجنوبية",
    time_period: "ليلًا",
    most_active_time: "من 9 مساءً إلى 2 فجرًا",
    improvement: 12,
    complaints: 22
  },
  {
    city: "حضرموت",
    district: "مديرية المكلا",
    neighborhood_name: "حي الورود",
    alley_name: "الحارة الشمالية",
    time_period: "نهارًا",
    most_active_time: "من 8 صباحًا إلى 1 ظهرًا",
    improvement: 12,
    complaints: 155
  }
];

const TableDistrict = () => {
  const columns = useMemo<MRT_ColumnDef<typeof data[0]>[]>(
    () => [
      {
        accessorKey: 'city',
        header: 'اسم االقسم',
        size: 100,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocationCityIcon color="primary" fontSize="small" />
            <Typography variant="body2" fontWeight="500">
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'district',
        header: 'عدد البلاغات المغلقة',
        size: 120,
        Cell: ({ cell }) => (
          <Chip
            label={cell.getValue<string>()}
            size="small"
            variant="outlined"
            color="primary"
          />
        ),
      },
      {
        accessorKey: 'neighborhood_name',
        header: 'البلاغات المفتوحة',
        size: 120,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MosqueIcon color="secondary" fontSize="small" />
            <Typography variant="body2">
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'alley_name',
        header: 'الحارة',
        size: 120,
        Cell: ({ cell }) => (
          <Typography variant="body2" >
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        accessorKey: 'time_period',
        header: 'الفترة',
        size: 90,
        Cell: ({ cell }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: cell.getValue() === 'ليلًا' ? '#E8F5E9' : '#FFF8E1',
              px: 1,
              py: 0.5,
              borderRadius: '8px',
              width: 'fit-content',
            }}
          >
            {cell.getValue() === 'ليلًا' ? (
              <NightsStayIcon color="primary" fontSize="small" />
            ) : (
              <WbSunnyIcon color="secondary" fontSize="small" />
            )}
            <Typography variant="body2" fontSize="0.75rem">
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'most_active_time',
        header: 'الأوقات النشطة',
        size: 150,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeFilledIcon color="action" fontSize="small" />
            <Typography variant="body2" fontSize="0.75rem">
              {cell.getValue<string>()}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'complaints',
        header: 'البلاغات',
        size: 90,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          return (
            <Chip
              label={value}
              size="small"
              color={
                value > 100 ? 'error' : value > 50 ? 'warning' : 'primary'
              }
            />
          );
        },
      },
      {
        accessorKey: 'improvement',
        header: 'التطور',
        size: 90,
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          const isPositive = value > 0;
          
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isPositive ? (
                <ArrowUpwardIcon color="success" fontSize="small" />
              ) : (
                <ArrowDownwardIcon color="error" fontSize="small" />
              )}
              <Typography
                variant="body2"
                color={isPositive ? 'success.main' : 'error.main'}
                fontWeight="500"
              >
                {Math.abs(value)}%
              </Typography>
            </Box>
          );
        },
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
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Paper sx={{ m: 1 }}>
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              color: 'primary.main',
              fontWeight: '600',
              textAlign: 'center',
              mb: 3,
            }}
          >
            نظام مراقبة الأحياء السكنية
          </Typography>
          <MaterialReactTable table={table} />
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default TableDistrict;