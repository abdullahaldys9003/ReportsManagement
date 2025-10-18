import React, { useEffect, useMemo, useState } from 'react';
import { 
  MaterialReactTable, 
  useMaterialReactTable 
} from 'material-react-table';
import ResponsiveTableContainer from "../common/components/ResponsiveTableContainer.jsx";
import { 
  Box, 
  Snackbar, 
  Alert, 
  FormControl, 
  Select, 
  MenuItem, 
  Chip, 
  CircularProgress,
  Paper,
  Stack,
  InputLabel,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Refresh,
  FilterList,
  ChangeCircle
} from '@mui/icons-material';

import { getAllItems, updateItem } from '../api/crudApi.js';
import WantedDetails from "../WantedDetails";

const ReceivingReports = () => {
  const [reportsData, setReportsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [updatingId, setUpdatingId] = useState(null);
  const [dataReportMainTypes, setDataReportMainTypes] = useState([]);
  const [dataReportSubTypes, setDataReportSubTypes] = useState([]);
  
  // State for filters
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [mainTypeFilter, setMainTypeFilter] = useState('');

  // الحصول على البيانات الأساسية
  const getDataReportMainTypes = () => getAllItems("index.php", { 
    tableName: "report_main_types", 
    operation: "show" 
  });

  const getDataReportSubTypes = () => getAllItems("index.php", { 
    tableName: "report_sub_types", 
    operation: "show" 
  });

  // الحصول على تقارير الأقسام
  const getAllDepartmentReports = async (count=10) => {
    setIsLoading(true);
    setError(null);
    const params = { 
      tableName: "reports", 
      operation: "getAllDepartmentReports",
      limit: count,
      user_id: 2,
      status: "opened",
    };
    
    try {
      const response = await getAllItems("index.php", params);
      if (response) {
        setReportsData(response);
      } else {
        setError('خطأ في البيانات المستلمة');
      }
    } catch {
      setError('فشل الاتصال بالخادم');
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث حالة البلاغ
  const updateReportStatus = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    const params = { 
      tableName: "reports", 
      operation: "updateReportStatus", 
      status: newStatus, 
      id: reportId,
      user_id: 2,
    };
    
    try {
      const response = await updateItem(null, "index.php", params);
      if (response && response.status === 'success') {
        setSnackbar({ 
          open: true, 
          message: 'تم تحديث حالة البلاغ بنجاح', 
          severity: 'success' 
        });
        getAllDepartmentReports(); // إعادة تحميل البيانات
      } else {
        setSnackbar({ 
          open: true, 
          message: response?.message || 'حدث خطأ', 
          severity: 'error' 
        });
      }
    } catch {
      setSnackbar({ 
        open: true, 
        message: 'فشل الاتصال بالخادم', 
        severity: 'error' 
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // جلب البيانات عند التحميل الأول
  useEffect(() => {
    const fetchData = async () => {
      await getAllDepartmentReports();
      setDataReportMainTypes(await getDataReportMainTypes());
      setDataReportSubTypes(await getDataReportSubTypes());
    };
    fetchData();
  }, []);

  // البيانات المصفاة
  const filteredData = useMemo(() => {
    let filtered = reportsData;

    if (departmentFilter) {
      filtered = filtered.filter(item => 
        item.department_name === departmentFilter
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(item => 
        item.status_report === statusFilter
      );
    }

    if (mainTypeFilter) {
      filtered = filtered.filter(item => 
        item.type_name === mainTypeFilter
      );
    }

    return filtered;
  }, [reportsData, departmentFilter, statusFilter, mainTypeFilter]);

  // خيارات الفلاتر
  const departmentOptions = useMemo(() => {
    const departments = [...new Set(reportsData.map(item => item.department_name))];
    return departments.filter(Boolean).sort();
  }, [reportsData]);

  const statusOptions = useMemo(() => {
    const statuses = [...new Set(reportsData.map(item => item.status_report))];
    return statuses.filter(Boolean).sort();
  }, [reportsData]);

  const mainTypeOptions = useMemo(() => {
    const mainTypes = [...new Set(reportsData.map(item => item.type_name))];
    return mainTypes.filter(Boolean).sort();
  }, [reportsData]);

  // دوال المساعدة
  const getStatusArabic = (status) => {
    const map = {
      opened: 'مفتوح',
      closed: 'مغلق',
      in_progress: 'قيد المعالجة',
      pending: 'معلق',
      prosse: 'قيد المعالجة'
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      opened: 'success',
      closed: 'error',
      in_progress: 'warning',
      pending: 'info',
      prosse: 'warning'
    };
    return colorMap[status] || 'default';
  };

  const handleStatusChange = (reportId, currentStatus) => {
    updateReportStatus(reportId, currentStatus);
  };

  const handleFilterReset = () => {
    setDepartmentFilter('');
    setStatusFilter('');
    setMainTypeFilter('');
  };

  const handleRefresh = () => {
    getAllDepartmentReports();
    handleFilterReset();
  };

  // أعمدة الجدول
  const columns = useMemo(() => [
    { 
      accessorKey: 'report_number', 
      header: 'رقم البلاغ', 
      size: 120,
      Cell: ({ cell }) => (
        <Box sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {cell.getValue()}
        </Box>
      )
    },
    { 
      accessorKey: 'department_name', 
      header: 'اسم القسم', 
      size: 120,
      Cell: ({ cell }) => (
        <Box sx={{ fontWeight: 'medium' }}>
          {cell.getValue()}
        </Box>
      )
    },
    { 
      accessorKey: 'type_name', 
      header: 'النوع الرئيسي', 
      size: 130,
      Cell: ({ cell }) => (
        <Chip 
          label={cell.getValue()} 
          size="small"
          variant="outlined"
          sx={{ 
            backgroundColor: '#f3e5f5',
            borderColor: '#8e24aa',
            color: '#6a1b9a',
            fontWeight: 'bold'
          }}
        />
      )
    },
    { 
      accessorKey: 'sub_type_name', 
      header: 'النوع الفرعي', 
      size: 130,
      Cell: ({ cell }) => (
        <Chip 
          label={cell.getValue()} 
          size="small"
          variant="outlined"
          sx={{ 
            backgroundColor: '#e3f2fd',
            borderColor: '#2196f3',
            color: '#1565c0'
          }}
        />
      )
    },
    { 
      accessorKey: 'status_report', 
      header: 'حالة البلاغ', 
      size: 140,
      Cell: ({ cell, row }) => {
        const status = cell.getValue();
        const isUpdating = updatingId === row.original.report_id;
        
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={getStatusArabic(status)} 
              color={getStatusColor(status)}
              size="small"
              sx={{ fontWeight: 'bold', minWidth: 80 }}
            />
            {isUpdating ? (
              <CircularProgress size={20} />
            ) : (
              <Tooltip title="تغيير حالة البلاغ">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={status}
                    onChange={(e) => handleStatusChange(row.original.report_id, e.target.value)}
                    displayEmpty
                    sx={{ fontSize: '0.75rem', height: '32px' }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ChangeCircle fontSize="small" />
                        {getStatusArabic(selected)}
                      </Box>
                    )}
                  >
                    <MenuItem value="opened">مفتوح</MenuItem>
                    <MenuItem value="prosse">قيد المعالجة</MenuItem>
                    <MenuItem value="closed">مغلق</MenuItem>
                  </Select>
                </FormControl>
              </Tooltip>
            )}
          </Box>
        );
      }
    },
    { 
      accessorKey: 'created_at', 
      header: 'تاريخ الإنشاء', 
      size: 120,
      Cell: ({ cell }) => (
        <Box sx={{ color: '#666', fontSize: '0.875rem' }}>
          {new Date(cell.getValue()).toLocaleDateString('ar-SA')}
        </Box>
      )
    },
  ], [updatingId]);

  // إعداد الجدول
  const table = useMaterialReactTable({
    columns,
    data: filteredData || [],
    enableRtl: true,
    enablePagination: true,
    enableBottomToolbar: true,
    enableRowNumbers: true,
    enableStickyHeader: true,
    enableGlobalFilter: true,
    enableFilters: true,
    enableExpanding: true,    
    state: { 
      isLoading, 
      showAlertBanner: !!error 
    },
    
    muiTablePaperProps: {
      sx: {
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        overflow: 'hidden'
      }
    },
     initialState: {
      density: 'compact',
    },  
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#1e3a8a',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px'
      }
    },
    
    renderDetailPanel: ({ row }) => (
      <Box sx={{ 
        backgroundColor: '#f8f9fa',
        padding: '16px',
        width: 600,
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <WantedDetails reportId={row.original.report_id} departmentId={row.original.department_id} />
      </Box>
    ),
  });

  return (
    <>
      {/* قسم الفلاتر */}
      <Box p={3} m={1}>
        <Paper sx={{ 
          p: 2, 
          borderRadius: '12px',
          border: '2px solid #e0e0e0',
          backgroundColor: '#f8f9fa'
        }}>
          <Stack direction="row" gap={2} sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList sx={{ color: '#1e3a8a' }} />
              <Box sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                فلاتر البحث:
              </Box>
            </Box>

            {/* فلتر القسم */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>اسم القسم</InputLabel>
              <Select
                value={departmentFilter}
                label="اسم القسم"
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <MenuItem value="">كل الأقسام</MenuItem>
                {departmentOptions.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* فلتر الحالة */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>حالة البلاغ</InputLabel>
              <Select
                value={statusFilter}
                label="حالة البلاغ"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">كل الحالات</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {getStatusArabic(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* فلتر النوع الرئيسي */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>النوع الرئيسي</InputLabel>
              <Select
                value={mainTypeFilter}
                label="النوع الرئيسي"
                onChange={(e) => setMainTypeFilter(e.target.value)}
              >
                <MenuItem value="">كل الأنواع</MenuItem>
                {mainTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* أزرار التحكم */}
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
            >
              تحديث
            </Button>
          </Stack>
        </Paper>
      </Box>
      <ResponsiveTableContainer table={table} />
      {/* التنبيهات */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReceivingReports;