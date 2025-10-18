//handleSaveReport:317
//handleCreateReport 297
import React, { useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WantedDetails from "./WantedDetails";
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
        params: { tableName: "report_main_types", operation: "show" }
      });
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
        params: { tableName: "reports", operation: "show" }
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
        description: report.description,
        status_report:"opened",
        main_id: report.main_id,
        sub_id: report.sub_id,
        districts_reports: report.districts_reports,
        neighborhoods_reports: report.neighborhoods_reports,
        full_name: report.fullName,
        phone: report.phone,
        gender: report.gender,
        age: report.age,
        national_id: report.nationalId,
        address: report.address,
        status: "Suspected",
       
        // بيانات المبلغ عنه
        district_suspects: report.district_suspects,
        neighborhood_suspects: report.neighborhood_suspects,
        name_reporter: report.name_reporter,
        phone_reporter: report.phone_reporter,
        email_reporter: report.email_reporter,
        id_national_reporter: report.id_national_reporter,
       districts_reporter: report.districts_reporter,
        neighborhoods_reporter: report.neighborhoods_reporter,     
        address_reporter: report.address_reporter,
        
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
      const reportData = {
        description: report.description,
        status_report: report.status_report,
        sub_id: report.sub_id,
        main_id: report.main_id,
        district_name: report.district_name,
        neighborhood_name: report.neighborhood_name,
        fullName: report.fullName,
        phone: report.phone,
        gender: report.gender,
        age: report.age,
        nationalId: report.nationalId,
        address: report.address,
        status: "Wanted",
        // بيانات المبلغ عنه
        district_suspects: report.district_suspects,
        neighborhood_suspects: report.neighborhood_suspects,
        name_reporter: report.name_reporter,
        phone_reporter: report.phone_reporter,
        email_reporter: report.email_reporter,
        id_national_reporter: report.id_national_reporter,
        address_reporter: report.address_reporter,
        districts_reporter: report.districts_reporter,
        neighborhoods_reporter: report.neighborhoods_reporter,
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
  const [filteredSuspectNeighborhoods, setFilteredSuspectNeighborhoods] = useState([]);
  const [filteredReporterNeighborhoods, setFilteredReporterNeighborhoods] = useState([]);
  
  // حفظ القيم الحالية للتعديل
  const [editingValues, setEditingValues] = useState({});

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

  // تصفية الأنواع الفرعية حسب النوع الرئيسي المحدد
  const filteredSubTypes = useMemo(() => 
    reportSubTypes.filter(subType => 
      selectedMainType ? subType.main_type_id == selectedMainType : true
    ),
    [reportSubTypes, selectedMainType]
  );

  // تحضير خيارات أنواع البلاغات
  const reportStatusOptionsFormatted = useMemo(() => 
    reportStatusOptions.map(opt => ({
      value: opt.id,
      label: opt.type_name,
    })),
    [reportStatusOptions]
  );

  // تحضير خيارات الأنواع الفرعية
  const reportSubTypeOptionsFormatted = useMemo(() => 
    filteredSubTypes.map(opt => ({
      value: opt.id,
      label: opt.sub_type_name,
    })),
    [filteredSubTypes]
  );

  // معالج تغيير المديرية للبلاغ
  const handleDistrictChange = (districtId, type) => {
    const filtered = allNeighborhoods
      .filter(item => item.district_id == districtId)
      .map(item => ({
        value: item.neighborhood_id,
        label: item.neighborhood_name
      }));
    
    if (type === 'report') {
      setFilteredNeighborhoods(filtered);
    } else if (type === 'suspect') {
      setFilteredSuspectNeighborhoods(filtered);
    } else if (type === 'reporter') {
      setFilteredReporterNeighborhoods(filtered);
    }
  };

  // إعداد بيانات المناطق
  const districData = useMemo(() => {
    const allDistricts = allNeighborhoods.map(item => ({
      value: item.district_id,
      label: item.district_name
    }));

    // لإزالة التكرار لأن نفس المنطقة قد تظهر أكثر من مرة
    const uniqueDistricts = Array.from(
      new Map(allDistricts.map(d => [d.value, d])).values()
    );
    
    return uniqueDistricts;
  }, [allNeighborhoods]);

  // hooks للعمليات
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
    {
      accessorKey: 'report_id',
      header: 'رقم البلاغ',
      enableEditing: false,
      size: 80,
    },
{
  accessorKey: 'main_id', // استخدم الحقل الحقيقي من البيانات
  header: 'نوع البلاغ الرئيسي',
  editVariant: 'select',
  editSelectOptions: reportStatusOptionsFormatted,
  muiEditTextFieldProps: {
    required: true,
    error: !!validationErrors?.main_id,
    helperText: validationErrors?.main_id,
    onChange: (e) => {
      setSelectedMainType(e.target.value);
      // تحديث القيمة في editingValues
      setEditingValues(prev => ({
        ...prev,
        main_id: e.target.value
      }));
    }
  },
  // إظهار الاسم بدلاً من ID في الخلية العادية
  Cell: ({ cell }) => {
    const mainType = reportStatusOptions.find(opt => opt.id === cell.getValue());
    return mainType ? mainType.type_name : cell.getValue();
  },
},
{
  accessorKey: 'sub_id',
  header: 'نوع البلاغ الفرعي',
  editVariant: 'select',
  editSelectOptions: reportSubTypeOptionsFormatted,
  muiEditTextFieldProps: {
    required: true,
    error: !!validationErrors?.sub_id,
    helperText: validationErrors?.sub_id,
    // إضافة renderValue لعرض الاسم بدلاً من ID
    renderValue: (selectedValue) => {
      const selectedOption = reportSubTypeOptionsFormatted.find(
        option => option.value == selectedValue
      );
      return selectedOption ? selectedOption.label : selectedValue;
    }
  },
  Cell: ({ cell }) => {
    const subType = reportSubTypes.find(opt => opt.id == cell.getValue());
    return subType ? subType.sub_type_name : cell.getValue();
  },
},
    {
      accessorKey: 'status_report',
      header: 'حالة البلاغ',
      editVariant: 'select',
      enableEditing: false,
      editSelectOptions: [
        { value: 'opened', label: 'مفتوح' },
        { value: 'closed', label: 'مغلق' },
        { value: 'prosse', label: 'قيد المعالجة' }
      ],
      muiEditTextFieldProps: {
        select: true,
        required: true,
        error: !!validationErrors?.status_report,
        helperText: validationErrors?.status_report,
      },
    },
   {
      accessorKey: 'description',
      header: 'وصف البلاغ',
      muiEditTextFieldProps: {
        multiline: true,
        rows: 3,
        error: !!validationErrors?.description,
        helperText: validationErrors?.description,
      },
    },
    {
      accessorKey: 'created_at',
      header: 'تاريخ الإرسال',
      enableEditing: false,
    },
    {
      accessorKey: 'districts_reports',
      header: 'مديرية البلاغ',
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          {cell.getValue()}
        </Box>
      ),
      editVariant: 'select',
      editSelectOptions: districData,
      muiEditTextFieldProps: {
        select: true,
        onChange: (e) => handleDistrictChange(e.target.value, 'report'),
        InputProps: {
          startAdornment: (
            <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          ),
        },
      },
    },
    {
      accessorKey: 'neighborhoods_reports',
      header: 'حي البلاغ',
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <MoreHorizIcon sx={{ color: 'action.active', mr: 1 }} />
          {cell.getValue()}
        </Box>
      ),
      editVariant: 'select',
      editSelectOptions: filteredNeighborhoods,
      muiEditTextFieldProps: {
        select: true,
      },
    },
  
    {
      accessorKey: 'fullName',
      header: 'الاسم الكامل',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'phone',
      header: 'رقم الهاتف',
      size: 120,
      muiEditTextFieldProps: {
        required: true,
        value:8282,
      },
    },
    {
      accessorKey: 'gender',
      header: 'الجنس',
      size: 100,
      editVariant: 'select',
      editSelectOptions: [
        { value: 'male', label: 'ذكر' },
        { value: 'female', label: 'أنثى' }
      ],
      muiEditTextFieldProps: {
        select: true,
        required: true,
      },
    },
    {
      accessorKey: 'age',
      header: 'العمر',
      size: 80,
      muiEditTextFieldProps: {
        required: true,
        type: 'number',
      },
    },
    {
      accessorKey: 'nationalId',
      header: 'الرقم الوطني',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'address',
      header: 'العنوان',
      size: 200,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'status',
      header: 'الحالة',
      size: 120,
      enableEditing: false,
      editVariant: 'select',
      editSelectOptions: [
        { value: 'active', label: 'نشط' },
        { value: 'inactive', label: 'غير نشط' }
      ],
      muiEditTextFieldProps: {
        select: true,
        required: true,
      },
    },
    // بيانات المبلغ عنه
    {
      accessorKey: 'district_suspects',
      header: 'مديرية المبلغ عنه',
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          {cell.getValue()}
        </Box>
      ),
      editVariant: 'select',
      editSelectOptions: districData,
      muiEditTextFieldProps: {
        select: true,
        onChange: (e) => handleDistrictChange(e.target.value, 'suspect'),
        InputProps: {
          startAdornment: (
            <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          ),
        },
      },
    },
    {
      accessorKey: 'neighborhood_suspects',
      header: 'حي المبلغ عنه',
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <MoreHorizIcon sx={{ color: 'action.active', mr: 1 }} />
          {cell.getValue()}
        </Box>
      ),
      editVariant: 'select',
      editSelectOptions: filteredSuspectNeighborhoods,
      muiEditTextFieldProps: {
        select: true,
      },
    },
    {
      accessorKey: 'name_reporter',
      header: 'اسم المبلغ عنه',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'phone_reporter',
      header: 'رقم المبلغ عنه',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'email_reporter',
      header: 'البريد الالكتروني',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'id_national_reporter',
      header: 'رقم البطاقة',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    {
      accessorKey: 'address_reporter',
      header: 'عنوان المبلغ عنه',
      size: 150,
      muiEditTextFieldProps: {
        required: true,
      },
    },
    // بيانات المبلغ (الشخص الذي قدم البلاغ)
    {
      accessorKey: 'districts_reporter',
      header: 'مديرية المبلغ',
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          {cell.getValue()}
        </Box>
      ),
      editVariant: 'select',
      editSelectOptions: districData,
      muiEditTextFieldProps: {
        select: true,
        onChange: (e) => handleDistrictChange(e.target.value, 'reporter'),
        InputProps: {
          startAdornment: (
            <LocationOnIcon sx={{ color: 'action.active', mr: 1 }} />
          ),
        },
      },
    },
    {
      accessorKey: 'neighborhoods_reporter',
      header: 'حي المبلغ',
      Cell: ({ cell }) => (
        <Box display="flex" alignItems="center">
          <MoreHorizIcon sx={{ color: 'action.active', mr: 1 }} />
          {cell.getValue()}
        </Box>
      ),
      editVariant: 'select',
      editSelectOptions: filteredReporterNeighborhoods,
      muiEditTextFieldProps: {
        select: true,
      },
    }, 
  ], [
    validationErrors, 
    reportStatusOptionsFormatted, 
    reportSubTypeOptionsFormatted, 
    filteredNeighborhoods,
    filteredSuspectNeighborhoods,
    filteredReporterNeighborhoods,
    districData
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
        maxWidth: '500px',
        minWidth: '600px',
        overflow: 'auto',
      },
    },
    initialState: {
      columnVisibility: {
        fullName: false,
        phone: false,
        gender: false,
        address: false,
        status: false,
        age: false,
        nationalId: false,
        neighborhood_suspects: false,
        district_suspects: false,
        name_reporter: false,
        phone_reporter: false,
        email_reporter: false,
        id_national_reporter: false,
        address_reporter: false,
        districts_reporter: false,   
        neighborhoods_reporter: false,
      },
    }, 
  renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          display: 'grid',
          margin: 'auto',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
        }}
      >
      <WantedDetails reportId={row.original.report_id} />

      </Box>
    ),
    positionExpandColumn: 'last',
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateReport,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveReport,
    
    onEditingRowStart: (row) => {
  setEditingValues(row.original);
  setSelectedMainType(row.original.main_id); // تعيين النوع الرئيسي الحالي
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
const ReportsManagement = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportsTable />
    </QueryClientProvider>
  );
};

export default ReportsManagement;