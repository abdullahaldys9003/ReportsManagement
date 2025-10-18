//handleSaveReport:317
//handleCreateReport 297
import React, { useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Hook لجلب الأحياء
const useGetNeighborhoods = () => {
  return useQuery({
    queryKey: ['neighborhoods'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8084', {
        params: { tableName: "neighborhoods", operation: "show" }
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لجلب أنواع البلاغات الرئيسية
const useGetReportStatus = () => {
  return useQuery({
    queryKey: ['reportStatus'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8084', {
        params: { tableName: "report_main_types", operation: "show" }      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لجلب الأنواع الفرعية
const useGetReportSubType = () => {
  return useQuery({
    queryKey: ['reportSubTypes'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8084', {
        params: { tableName: "report_sub_types", operation: "show" }
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لجلب البلاغات
const useGetReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await axios.get('http://127.0.0.1:8084', {
        params: { tableName: "police_alerts", operation: "show" }
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لإنشاء بلاغ
const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (report) => {

      const reportData = {

      };
       alert(JSON.stringify(reportData, null, 4));  
      const response = await axios.post('http://127.0.0.1:8084', reportData, {
        params: {
          tableName: "reports",
          operation: "insert"
        },
      });
    alert(JSON.stringify(response.data, null, 4));  
      return response.data;
           
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Hook لتحديث بلاغ
const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (report) => {
      alert(JSON.stringify(report, null, 4));

      const reportData = {

      };
      
      const response = await axios.post('http://127.0.0.1:8084', {
        tableName: "reports",
        operation: "update",
        data: reportData,
        where: `report_id = '${report.report_id}'`
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Hook لحذف بلاغ
const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reportId) => {
      const response = await axios.post('http://127.0.0.1:8084', {
        tableName: "reports",
        operation: "delete",
        where: `report_id = '${reportId}'`
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// المكون الرئيسي
const ReportsTable = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedMainType, setSelectedMainType] = useState('');
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);


  // جلب البيانات
  const { data: reportStatusOptions = [], isLoading: isLoadingStatus } = useGetReportStatus();
  const { data: reportSubTypes = [], isLoading: isLoadingSubType } = useGetReportSubType();
  const { data: reports = [], isError, isFetching, isLoading } = useGetReports();
  const { data: allNeighborhoods = [] } = useGetNeighborhoods();
  
  // دمج البيانات للحصول على أسماء الأنواع الفرعية
  const reportsWithSubTypeNames = useMemo(() => {
    if (!reports.length || !reportSubTypes.length) return [];
    
    return reports.map(report => {
      const subType = reportSubTypes.find(sub => sub.id == report.sub_id);
      const mainType = reportStatusOptions.find(main => main.id == report.main_id);
      
      return {
        ...report,
        sub_type_name: subType ? subType.sub_type_name : 'غير معروف',
        type_name: mainType ? mainType.type_name : 'غير معروف'
      };
    });
  }, [reports, reportSubTypes, reportStatusOptions]);


  const { mutateAsync: createReport, isPending: isCreatingReport } = useCreateReport();
  const { mutateAsync: updateReport, isPending: isUpdatingReport } = useUpdateReport();
  const { mutateAsync: deleteReport, isPending: isDeletingReport } = useDeleteReport();

  // دالة إنشاء بلاغ
  const handleCreateReport = async ({ values, table }) => {
    await createReport(values);
   // table.setCreatingRow(null);
  };

  // دالة تحديث بلاغ
  const handleSaveReport = async ({ values, table }) => {
    
    const newValidationErrors = validateReport(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }
    
    setValidationErrors({});
    
    const reportData = {  
      ...values,  
      sub_id: values.sub_type_name,
      main_id: values.type_name,
    };
    
    await updateReport(reportData);
    table.setEditingRow(null);
  };

  // دالة حذف بلاغ
  const openDeleteConfirmModal = (row) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا البلاغ؟')) {
      deleteReport(row.original.report_id);
    }
  };

  // تعريف أعمدة الجدول
  const columns = useMemo(() => [
      { accessorKey: 'alert_id', header: 'معرف الاشعار', size: 100 },
      { accessorKey: 'alert_title', header: 'عنوان الاشعار', size: 150 },
      { accessorKey: 'alert_message', header: 'محتوى الاشعار', size: 150 },
      { accessorKey: 'alert_date', header: 'تاريخ', size: 200 },
      { accessorKey: 'target_department', header: 'الكل', size: 120 },
  ], [
    validationErrors,
  ]);

  // تكوين الجدول
  const table = useMaterialReactTable({
    columns,
    data: reportsWithSubTypeNames,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.report_id,
    
    muiToolbarAlertBannerProps: isError
      ? {
          color: 'error',
          children: 'خطأ في تحميل البيانات',
        }
      : undefined,

    muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
        maxWidth: '800px',
        overflow: 'auto',
      },
    },

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateReport,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveReport,
    
    onEditingRowStart: (row) => {
  
},
enableEditing:true,
  editDisplayMode:"modal",

    // محتوى نافذة الإنشاء
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => ( 
      <>
        <DialogTitle variant="h5">إضافة بلاغ جديد</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),


    // محتوى نافذة التعديل
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">تعديل البلاغ</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap',maxWidth: '1200px',width:'80vw'}}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),

    // أزرار الإجراءات
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="تعديل">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    // زر الإضافة في أعلى الجدول
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        إضافة بلاغ جديد
      </Button>
    ),

    state: {
      isLoading: isLoading || isLoadingStatus || isLoadingSubType,
      isSaving: isCreatingReport || isUpdatingReport || isDeletingReport,
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
  });

  return <MaterialReactTable table={table}   muiEditModalProps={{
    fullWidth: true,
    maxWidth: false, // نلغي الحد الأقصى الافتراضي
    PaperProps: {
      sx: {
        width: '90vw',      // عرض النافذة 90% من الشاشة
        maxWidth: 'none',   // نلغي أي حد أقصى
      },
    },
  }} />;
};

// دالة التحقق من صحة البلاغ
function validateReport(report) {
  const errors = {};

  if (!report.type_name) errors.type_name = 'نوع البلاغ الرئيسي مطلوب';
  if (!report.sub_type_name) errors.sub_type_name = 'نوع البلاغ الفرعي مطلوب';
  if (!report.status_report) errors.status_report = 'حالة البلاغ مطلوبة';
  if (!report.description) errors.description = 'وصف البلاغ مطلوب';

  return errors;
}

// إنشاء QueryClient
const queryClient = new QueryClient();

// المكون الرئيسي للتطبيق
const ManageAlerts = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportsTable />
    </QueryClientProvider>
  );
};

export default ManageAlerts;