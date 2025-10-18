import React, { useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import WantedDetails from "../WantedDetails";
import{ getAllItems,createItem} from "../api/crudApi.js";
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
  TextField,
  Grid,
  Typography,
  Alert,
  Paper,
  Tabs,
  Tab,
  Avatar
} from '@mui/material';
import ErrorReportForm from "./ReportFieldForm";
import EditIcon from '@mui/icons-material/Edit';
//jaj
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import ReportIcon from '@mui/icons-material/Report';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { ho } from "../hosts.ts";
import ReportedSuspecTable from "./ReportedSuspecTable";
// Hook لجلب الأحياء
import ReportedReportersTable from "./ReportedReportersTable";
const useGetNeighborhoods = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
       const params = { tableName: "neighborhoods", operation: "show" };
        const response = await getAllItems("index.php",params);
        
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Hook لجلب أنواع البلاغات الرئيسية
const useGetReportStatus = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = { tableName: "report_main_types", operation: "show" };
        const response = await getAllItems("index.php",params);
        /*
        const response = await axios.get(`http://${ho}:8084`, {
          params: { tableName: "report_main_types", operation: "show" }
        });*/
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Hook لجلب الأنواع الفرعية
const useGetReportSubType = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = { tableName: "report_sub_types", operation: "show" };
        const response = await getAllItems("index.php",params);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Hook لجلب البلاغات
const useGetReports = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsFetching(true);
      try {
        const params={tableName: "reports", operation: "getReportsByDepartmentId",
          data: {
          limit: 10,
          status:"opened",
        }};
  
        const response = await getAllItems("index.php",params);
        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, isFetching, error };
};



const useCreateReport = () => {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (reportData) => {
    //setIsPending(true);
    try {

      // دمج البيانات الأساسية مع مصفوفات المبلغين والمبلغ عنهم
      const params= { tableName: "reports", operation: "insert",
      };
      reportData.status_report="opened";
      reportData.archive = 0;
     const response = await createItem(reportData,"index.php",params);

      if (response && response.status === "success") {
        alert('تم إضافة البلاغ بنجاح');
        return response;
      } else {
        alert(response?.message || 'حدث خطأ أثناء إضافة البلاغ');
        throw new Error(response.data?.message || 'Unknown error');
      }

    } catch (error) {
      console.error('خطأ في إضافة البلاغ:', error);
      alert('حدث خطأ: ' + (error.response?.data?.message || error.message));
      throw error;
    } finally {
     // setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
};
const useDeleteReport = () => {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async (reportId) => {
    setIsPending(true);
    try {
     const data = {
       archive:1,
       report_id:reportId,
     };
      const params= { tableName: "reports", operation: "updateArchive",
      };
  
     const response = await getAllItems("index.php",params);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending };
};

// مكون حقل الإدخال مع التحقق
const ValidatedTextField = React.memo(({ 
  value, 
  onChange, 
  error, 
  helperText, 
  required = false, 
  type = "text",
  ...props 
}) => {
  return (
    <TextField
      fullWidth
      value={value || ''}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      type={type}
      variant="outlined"
      size="small"
      {...props}
    />
  );
});

const ReportedPersonsTable = ({reportedPersons}) => (
  <Paper sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0' }}>
    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <PersonIcon /> المبلغ عنهم المضافين
    </Typography>
    {reportedPersons.length === 0 ? (
      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
        لم يتم إضافة أي مبلغ عنه بعد
      </Typography>
    ) : (
      <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
        {reportedPersons.map((person, index) => (
          <Box 
            key={person.id} 
            sx={{ 
              p: 1.5, 
              borderBottom: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: index % 2 === 0 ? '#fafafa' : 'white'
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {index + 1}. {person.fullName}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                الرقم الوطني: {person.nationalId} | الهاتف: {person.phone} | العمر: {person.age}
              </Typography>
            </Box>
            <IconButton 
              size="small" 
              color="error"
              onClick={() => removeReportedPerson(person.id)}
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    )}
  </Paper>
);

// مكون حقل التحديد مع التحقق
const ValidatedSelectField = React.memo(({ 
  value, 
  onChange, 
  error, 
  helperText, 
  required = false,
  options = [],
  ...props 
}) => {
  return (
    <FormControl fullWidth error={error} size="small">
      <Select
        value={value || ''}
        onChange={onChange}
        required={required}
        displayEmpty
        {...props}
      >
        <MenuItem value="" disabled={required}>
          <em>اختر...</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && (
        <Typography variant="caption" color="error">
          {helperText}
        </Typography>
      )}
    </FormControl>
  );
});

// المكون الرئيسي
const AddReports = () => {
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedMainType, setSelectedMainType] = useState('');
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState([]);
  const [filteredSuspectNeighborhoods, setFilteredSuspectNeighborhoods] = useState([]);
  const [filteredReporterNeighborhoods, setFilteredReporterNeighborhoods] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  // حفظ القيم الحالية للتعديل
  const [editingValues, setEditingValues] = useState({});

  // استخدام useRef لتخزين القيم المؤقتة بدون إعادة render
 const editingValuesRef = useRef({});
//-----------
const [reportedPersons, setReportedPersons] = useState([]); // قائمة المبلغ عنهم
const [reporters, setReporters] = useState([]); // قائمة المبلغين

const currentReportedPersonRef = useRef({});
const currentReporterRef = useRef({});
//--------------
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

  const { mutateAsync: deleteReport, isPending: isDeletingReport } = useDeleteReport();

  // دالة التحقق من صحة البيانات
  const validateReport = (values) => {
    const errors = {};
    
    // التحقق من البيانات الأساسية
    if (!values.main_id) errors.main_id = 'نوع البلاغ الرئيسي مطلوب';
    if (!values.sub_id) errors.sub_id = 'نوع البلاغ الفرعي مطلوب';
    if (!values.status_report) errors.status_report = 'حالة البلاغ مطلوبة';
    if (!values.description || values.description.trim().length < 10) 
      errors.description = 'وصف البلاغ مطلوب ويجب أن يكون على الأقل 10 أحرف';
    
    // التحقق من بيانات المبلغ عنه
    if (!values.fullName || values.fullName.trim().length < 13) 
      errors.fullName = 'الاسم الكامل مطلوب ويجب أن يكون على الأقل 13 أحرف';
    

    
    if (!values.age || values.age < 1 || values.age > 120) 
      errors.age = 'العمر يجب أن يكون بين 1 و 120';
    
    
    
    if (!values.address || values.address.trim().length < 5) 
      errors.address = 'العنوان مطلوب ويجب أن يكون على الأقل 5 أحرف';
    
    // التحقق من بيانات المبلغ
    if (!values.name_reporter || values.name_reporter.trim().length < 10) 
      errors.name_reporter = 'اسم المبلغ مطلوب ويجب أن يكون على الأقل 3 أحرف';
    

      
    
    if (!values.email_reporter || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email_reporter)) 
      errors.email_reporter = 'البريد الإلكتروني غير صحيح';
    

    
    if (!values.address_reporter || values.address_reporter.trim().length < 5) 
      errors.address_reporter = 'عنوان المبلغ مطلوب ويجب أن يكون على الأقل 5 أحرف';
    
    return errors;
  };

  // دالة إنشاء بلاغ
  const handleCreateReport = async ({ values}) => {
   //  alert(JSON.stringify(values));
     /*
    const newValidationErrors = validateReport(values);
    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      return;
    }
    */
    setValidationErrors({});
    await createReport(values);
  //  table.setCreatingRow(null);
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

  // دالة لتحديث الحقول بدون إعادة render مستمرة
  const updateEditingValue = (field, value) => {
    editingValuesRef.current[field] = value;
    setEditingValues(prev => ({ ...prev, [field]: value }));
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
      accessorKey: 'districts_reports',
      header: 'مديرية',
      enableEditing: false,
      size: 80,
    },
    {
      accessorKey: 'main_id',
      header: 'نوع البلاغ الرئيسي',
      editVariant: 'custom',
      Cell: ({ cell }) => {
        const mainType = reportStatusOptions.find(opt => opt.id === cell.getValue());
        return mainType ? mainType.type_name : cell.getValue();
      },
      Edit: ({ cell, column, table }) => (
        <ValidatedSelectField
          value={cell.getValue()}
          onChange={(e) => {
            cell.row._valuesCache[column.id] = e.target.value;
            setSelectedMainType(e.target.value);
          }}
          error={!!validationErrors?.main_id}
          helperText={validationErrors?.main_id}
          required={true}
          options={reportStatusOptionsFormatted}
          label="نوع البلاغ الرئيسي"
        />
      ),
    },
    {
      accessorKey: 'sub_id',
      header: 'نوع البلاغ الفرعي',
      editVariant: 'custom',
      Cell: ({ cell }) => {
        const subType = reportSubTypes.find(opt => opt.id == cell.getValue());
        return subType ? subType.sub_type_name : cell.getValue();
      },
      Edit: ({ cell, column, table }) => (
        <ValidatedSelectField
          value={cell.getValue()}
          onChange={(e) => {
            cell.row._valuesCache[column.id] = e.target.value;
          }}
          error={!!validationErrors?.sub_id}
          helperText={validationErrors?.sub_id}
          required={true}
          options={reportSubTypeOptionsFormatted}
          label="نوع البلاغ الفرعي"
        />
      ),
    },
    {
      accessorKey: 'status_report',
      header: 'حالة البلاغ',
      editVariant: 'custom',
      enableEditing: false,
      Cell: ({ cell }) => {
        const statusMap = {
          'opened': 'مفتوح',
          'closed': 'مغلق',
          'prosse': 'قيد المعالجة'
        };
        return statusMap[cell.getValue()] || cell.getValue();
      },
    },
    {
      accessorKey: 'description',
      header: 'وصف البلاغ',
      editVariant: 'custom',
      Cell: ({ cell }) => (
        <Box sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cell.getValue()}
        </Box>
      ),
      Edit: ({ cell, column, table }) => (
        <ValidatedTextField
          value={cell.getValue()}
          onChange={(e) => {
            cell.row._valuesCache[column.id] = e.target.value;
          }}
          error={!!validationErrors?.description}
          helperText={validationErrors?.description}
          required={true}
          multiline
          rows={3}
          label="وصف البلاغ"
        />
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'تاريخ الإرسال',
      enableEditing: false,
    },
  ], [validationErrors, reportStatusOptionsFormatted, reportSubTypeOptionsFormatted, reportSubTypes, reportStatusOptions]);


// إضافة مبلغ عنه جديد إلى القائمة
const addReportedPerson = () => {
  const currentData = { ...editingValuesRef.current };
 // alert(JSON.stringify(reportedPersonData));
  // استخراج بيانات المبلغ عنه فقط
  const reportedPersonData = {
    fullName: currentData.fullName,
    phone: currentData.phone,
    gender: currentData.gender,
    age: currentData.age,
    nationalId: currentData.nationalId,
    address: currentData.address,
    district_suspects: currentData.district_suspects,
    neighborhood_suspects: currentData.neighborhood_suspects,
    id: Date.now() // معرف فريد
  };
  
  // التحقق من البيانات المطلوبة
  if (!reportedPersonData.fullName || !reportedPersonData.nationalId) {
    alert('الرجاء إدخال الاسم الكامل والرقم الوطني للمبلغ عنه');
    return;
  }
  
  setReportedPersons(prev => [...prev, reportedPersonData]);
  clearReportedPersonFields();
};

const addReportes = () => {
  const currentData = { ...editingValuesRef.current };
    //phone_reporter
    //email_reporter
    //id_national_reporter
    //address_reporter
    //districts_reporter
    //neighborhoods_reporter
  const reportedReporterData = {
    name_reporter: currentData.name_reporter,
    email_reporter: currentData.email_reporter,
    phone_reporter: currentData.phone_reporter,
    id_national_reporter: currentData.id_national_reporter,
    address_reporter: currentData.address_reporter,
    address: currentData.address,
    districts_reporter: currentData.districts_reporter,
    neighborhoods_reporter: currentData.neighborhoods_reporter,
    id: Date.now() // معرف فريد
  };
  

  setReporters(prev => [...prev, reportedReporterData]);
  clearReportedReportersFields();
};

// مسح حقول المبلغ عنه
const clearReportedPersonFields = () => {
  const fieldsToClear = [
    'fullName', 'phone', 'gender', 'age', 
    'nationalId', 'address', 'district_suspects', 'neighborhood_suspects'
  ];
  
  fieldsToClear.forEach(field => {
    editingValuesRef.current[field] = '';
  });
  
  setEditingValues(prev => {
    const newValues = { ...prev };
    fieldsToClear.forEach(field => {
      newValues[field] = '';
    });
    return newValues;
  });
  
  setFilteredSuspectNeighborhoods([]);
};
const clearReportedReportersFields = () => {
  const fieldsToClear = [
    'name_reporter', 'email_reporter', 'phone_reporter', 'id_national_reporter', 
    'address_reporter', 'districts_reporter', 'neighborhoods_reporter'
  ];
  
  fieldsToClear.forEach(field => {
    editingValuesRef.current[field] = '';
  });
  
  setEditingValues(prev => {
    const newValues = { ...prev };
    fieldsToClear.forEach(field => {
      newValues[field] = '';
    });
    return newValues;
  });
  
  setFilteredSuspectNeighborhoods([]);
};

// حذف مبلغ عنه من القائمة
const removeReportedPerson = (id) => {
  setReportedPersons(prev => prev.filter(person => person.id !== id));
};
const removeReportedReporters = (id) => {
  setReporters(prev => prev.filter(person => person.id !== id));
};


  // تكوين الجدول
  const table = useMaterialReactTable({
    columns,
    data: reportsWithSubTypeNames || [],
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
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
  //  onCreatingRowSave:(values,table) =>{ handleCreateReport(values,table,report) },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveReport,
    
    onEditingRowStart: (row) => {
      setEditingValues(row.original);
      editingValuesRef.current = { ...row.original };
      setSelectedMainType(row.original.main_id);
    },
    
    enableEditing: true,

    // محتوى نافذة الإنشاء
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <Box>
        <DialogTitle variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReportIcon /> إضافة بلاغ جديد
        </DialogTitle>
        <DialogContent>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 2 }}>
            <Tab icon={<ReportIcon />} label="معلومات البلاغ" />
            <Tab icon={<PersonIcon />} label="المبلغ عنه" />
            <Tab icon={<ContactPhoneIcon />} label="المبلغ" />
          </Tabs>
          
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>نوع البلاغ الرئيسي</Typography>
                <ValidatedSelectField
                  value={editingValues.main_id || ''}
                  onChange={(e) => {
                    updateEditingValue('main_id', e.target.value);
                    setSelectedMainType(e.target.value);
                  }}
                  error={!!validationErrors?.main_id}
                  helperText={validationErrors?.main_id}
                  required={true}
                  options={reportStatusOptionsFormatted}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>نوع البلاغ الفرعي</Typography>
                <ValidatedSelectField
                  value={editingValues.sub_id || ''}
                  onChange={(e) => updateEditingValue('sub_id', e.target.value)}
                  error={!!validationErrors?.sub_id}
                  helperText={validationErrors?.sub_id}
                  required={true}
                  options={reportSubTypeOptionsFormatted}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>وصف البلاغ</Typography>
                <ValidatedTextField
                  value={editingValues.description || ''}
                  onChange={(e) => updateEditingValue('description', e.target.value)}
                  error={!!validationErrors?.description}
                  helperText={validationErrors?.description}
                  required={true}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>مديرية البلاغ</Typography>
                <ValidatedSelectField
                  value={editingValues.districts_reports || ''}
                  onChange={(e) => {
                    updateEditingValue('districts_reports', e.target.value);
                    handleDistrictChange(e.target.value, 'report');
                  }}
                  error={!!validationErrors?.districts_reports}
                  helperText={validationErrors?.districts_reports}
                  required={true}
                  options={districData}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>حي البلاغ</Typography>
                <ValidatedSelectField
                  value={editingValues.neighborhoods_reports || ''}
                  onChange={(e) => updateEditingValue('neighborhoods_reports', e.target.value)}
                  error={!!validationErrors?.neighborhoods_reports}
                  helperText={validationErrors?.neighborhoods_reports}
                  required={true}
                  options={filteredNeighborhoods}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              </Grid>
            </Grid>
          )}
                         
          {activeTab === 1 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>الاسم الكامل</Typography>
                <ValidatedTextField
                  value={editingValues.fullName || ''}
                  onChange={(e) => updateEditingValue('fullName', e.target.value)}
                  error={!!validationErrors?.fullName}
                  helperText={validationErrors?.fullName}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>رقم الهاتف</Typography>
                <ValidatedTextField
                  value={editingValues.phone || ''}
                  onChange={(e) => updateEditingValue('phone', e.target.value)}
                  error={!!validationErrors?.phone}
                  helperText={validationErrors?.phone}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>الجنس</Typography>
                <ValidatedSelectField
                  value={editingValues.gender || ''}
                  onChange={(e) => updateEditingValue('gender', e.target.value)}
                  error={!!validationErrors?.gender}
                  helperText={validationErrors?.gender}
                  required={true}
                  options={[
                    { value: 'male', label: 'ذكر' },
                    { value: 'female', label: 'أنثى' }
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>العمر</Typography>
                <ValidatedTextField
                  value={editingValues.age || ''}
                  onChange={(e) => updateEditingValue('age', e.target.value)}
                  error={!!validationErrors?.age}
                  helperText={validationErrors?.age}
                  required={true}
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>الرقم الوطني</Typography>
                <ValidatedTextField
                  value={editingValues.nationalId || ''}
                  onChange={(e) => updateEditingValue('nationalId', e.target.value)}
                  error={!!validationErrors?.nationalId}
                  helperText={validationErrors?.nationalId}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>العنوان</Typography>
                <ValidatedTextField
                  value={editingValues.address || ''}
                  onChange={(e) => updateEditingValue('address', e.target.value)}
                  error={!!validationErrors?.address}
                  helperText={validationErrors?.address}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>مديرية المبلغ عنه</Typography>
                <ValidatedSelectField
                  value={editingValues.district_suspects || ''}
                  onChange={(e) => {
                    updateEditingValue('district_suspects', e.target.value);
                    handleDistrictChange(e.target.value, 'suspect');
                  }}
                  error={!!validationErrors?.district_suspects}
                  helperText={validationErrors?.district_suspects}
                  required={true}
                  options={districData}
                />
              
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>حي المبلغ عنه</Typography>
                <ValidatedSelectField
                  value={editingValues.neighborhood_suspects || ''}
                  onChange={(e) => updateEditingValue('neighborhood_suspects', e.target.value)}
                  error={!!validationErrors?.neighborhood_suspects}
                  helperText={validationErrors?.neighborhood_suspects}
                  required={true}
                  options={filteredSuspectNeighborhoods}
                />
              </Grid>
              <Grid>
          </Grid>
            </Grid>
          )}
          
          {activeTab === 2 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>اسم المبلغ</Typography>
                <ValidatedTextField
                  value={editingValues.name_reporter || ''}
                  onChange={(e) => updateEditingValue('name_reporter', e.target.value)}
                  error={!!validationErrors?.name_reporter}
                  helperText={validationErrors?.name_reporter}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>رقم هاتف المبلغ</Typography>
                <ValidatedTextField
                  value={editingValues.phone_reporter || ''}
                  onChange={(e) => updateEditingValue('phone_reporter', e.target.value)}
                  error={!!validationErrors?.phone_reporter}
                  helperText={validationErrors?.phone_reporter}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>البريد الإلكتروني</Typography>
                <ValidatedTextField
                  value={editingValues.email_reporter || ''}
                  onChange={(e) => updateEditingValue('email_reporter', e.target.value)}
                  error={!!validationErrors?.email_reporter}
                  helperText={validationErrors?.email_reporter}
                  required={true}
                  type="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>رقم البطاقة الوطنية</Typography>
                <ValidatedTextField
                  value={editingValues.id_national_reporter || ''}
                  onChange={(e) => updateEditingValue('id_national_reporter', e.target.value)}
                  error={!!validationErrors?.id_national_reporter}
                  helperText={validationErrors?.id_national_reporter}
                  required={true}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>عنوان المبلغ</Typography>
                <ValidatedTextField
                  value={editingValues.address_reporter || ''}
                  onChange={(e) => updateEditingValue('address_reporter', e.target.value)}
                  error={!!validationErrors?.address_reporter}
                  helperText={validationErrors?.address_reporter}
                  required={true}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>مديرية المبلغ</Typography>
                <ValidatedSelectField
                  value={editingValues.districts_reporter || ''}
                  onChange={(e) => {
                    updateEditingValue('districts_reporter', e.target.value);
                    handleDistrictChange(e.target.value, 'reporter');
                  }}
                  error={!!validationErrors?.districts_reporter}
                  helperText={validationErrors?.districts_reporter}
                  required={true}
                  options={districData}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>حي المبلغ</Typography>
                <ValidatedSelectField
                  value={editingValues.neighborhoods_reporter || ''}
                  onChange={(e) => updateEditingValue('neighborhoods_reporter', e.target.value)}
                  error={!!validationErrors?.neighborhoods_reporter}
                  helperText={validationErrors?.neighborhoods_reporter}
                  required={true}
                  options={filteredReporterNeighborhoods}
                />
              </Grid>

            </Grid>
          )}
          
          {Object.keys(validationErrors).length > 0 && (
            <Alert severity="error" sx={{ mt: 2 }}>
              يوجد أخطاء في البيانات المدخلة، يرجى مراجعتها.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          {activeTab > 0 ? (
            <Button onClick={() => setActiveTab(activeTab - 1)}>السابق</Button>
          ) : (
            <Button onClick={() => table.setCreatingRow(null)}>إلغاء</Button>
          )}
          {activeTab < 2 ? (
            <Button variant="contained" onClick={() => setActiveTab(activeTab + 1)}>التالي</Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                handleCreateReport({ values: editingValuesRef.current});
              }}
            >
            حفظ
            </Button>
          )}
        </DialogActions>
      </Box>
    ),

    renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          display: 'grid',
          margin: 'auto',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
        }}
      >
      <WantedDetails reportId={row.original.report_id} rol={false}  />

      </Box>
    ),
    // أزرار الإجراءات
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="ارشفة">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <Inventory2Icon />
          </IconButton>

        </Tooltip>
      </Box>
    ),

    // زر الإضافة في أعلى الجدول
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        startIcon={<ReportIcon />}
        onClick={() => {
          table.setCreatingRow(true);
          setEditingValues({});
          editingValuesRef.current = {};
          setActiveTab(0);
        }}
      >
        إضافة بلاغ جديد
      </Button>
    ),
  muiEditModalProps: {
    sx: {
      '& .MuiDialog-container': {
        '& .MuiPaper-root': {
          maxWidth:'200px',
          height: '95vh',
          maxHeight: 'none',
        },
      },
    },
  },
   renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (<ErrorReportForm report_id={row.original.report_id} />),
  muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
        minWidth: '600px',
        maxWidth: '1200px',
        overflow: 'auto',
      },
    },
    initialState: {
    columnVisibility: {
    neighborhood_id: false,
    neighborhood_name: false,
    location_id: false,
    fileStatus:false,
  },},
    positionExpandColumn: 'last',
    state: {
      isLoading: isLoading || isLoadingStatus || isLoadingSubType,
      isSaving: isCreatingReport || isDeletingReport,
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default AddReports;