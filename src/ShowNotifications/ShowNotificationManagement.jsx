import { Box, Typography, Button, Tooltip, IconButton, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllItems, createItem, deleteItem, updateItem } from '../api/crudApi.js';

import { mapToSelectOptions } from "../helps/filtersValueLable.js";
import Notification from '../common/components/Notification.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const alertStatuses = [
  { value: 'new', label: 'جديد' },
  { value: 'in_progress', label: 'قيد المعالجة' },
  { value: 'completed', label: 'تم الحل' },
  { value: 'cancelled', label: 'ملغي' },
  { value: 'escalated', label: 'مرفوع' }
];


 const config = {
  tableName: "police_alerts",
  operations: {
    show: "show",
    add: "addAlerts", 
    update: "updateAlerts",
    delete: "deleteAlerts"
  }};
  
export default function ShowNotificationManagement() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSeverity, setNotifSeverity] = useState('success');

  const [alertsData, setAlertsData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);

  const handelCreateItem = async ({ values }) => {
    const params = { 
      tableName:config.tableName, 
      operation: config.operation.add, 
    };
    
    try {
      const data = await createItem(values, "index.php", params);
      
      if (data.success) {
        setAlertsData(prevData => [...prevData, { ...values, alert_id: data.id }]);
        setNotifMessage("تم إضافة التنبيه بنجاح");
        setNotifSeverity("success");
        setNotifOpen(true);
      } else {
        setNotifMessage(data.message || "حدث خطأ أثناء الإضافة");
        setNotifSeverity("error");
        setNotifOpen(true);
      }
    } catch (err) {
      setNotifMessage(err.message || "حدث خطأ أثناء الإضافة");
      setNotifSeverity("error");
      setNotifOpen(true);
    }
  };

  const handelUpdateItem = async ({ values }) => {
    const params = { 
      tableName: "police_alerts", 
      operation: "updateAlerts" 
    };

    try {
      const data = await updateItem(values, "index.php", params);

      if (data.success) {
        setAlertsData(prevData =>
          prevData.map(alert =>
            alert.alert_id === values.alert_id ? { ...alert, ...values } : alert
          )
        );

        setNotifMessage(data.message || "تم تعديل التنبيه بنجاح");
        setNotifSeverity("success");
        setNotifOpen(true);
      } else {
        setNotifMessage(data.message || "حدث خطأ أثناء التعديل");
        setNotifSeverity("error");
        setNotifOpen(true);
      }
    } catch (err) {
      setNotifMessage(err.message || "حدث خطأ أثناء التعديل");
      setNotifSeverity("error");
      setNotifOpen(true);
    }
  };

  const handleDelete = async (row) => {
    const params = { 
      tableName: "police_alerts", 
      operation: "deleteAlerts", 
      id: row.original.alert_id 
    };
    
    try {
      const result = await deleteItem(row.original.alert_id, "index.php", params);
      
      if (result.success) {
        setAlertsData(prevData => 
          prevData.filter(alert => alert.alert_id !== row.original.alert_id)
        );
        
        setNotifMessage(result.message || "تم حذف التنبيه بنجاح");
        setNotifSeverity("success");
        setNotifOpen(true);
      } else {
        setNotifMessage(result.message || "حدث خطأ أثناء الحذف");
        setNotifSeverity("error");
        setNotifOpen(true);
      }
    } catch (err) {
      setNotifMessage(err.message || "حدث خطأ أثناء الحذف");
      setNotifSeverity("error");
      setNotifOpen(true);
    }
  };

  // تحميل بيانات التنبيهات
  useEffect(() => {
    const fetchAlertsData = async () => {
      try {
        const result = await getAllItems("index.php", { 
          tableName: "police_alerts", 
          operation: "show" 
        });
        //alert(JSON.stringify(result));
        if (result.success) {
          setAlertsData(result.data || []);
        } else {
          setNotifMessage(result.message || "حدث خطأ في تحميل البيانات");
          setNotifSeverity("error");
          setNotifOpen(true);
        }
      } catch (error) {
        setNotifMessage(error.message || "حدث خطأ في تحميل البيانات");
        setNotifSeverity("error");
        setNotifOpen(true);
      }
    };
    fetchAlertsData();
  }, []);

  // تحميل بيانات الأقسام
  useEffect(() => {
    const getDepartments = async () => {
      try {
        const result = await getAllItems("index.php", { 
          tableName: "departments", 
          operation: "getDepartments" 
        });
        alert(JSON.stringify(result));
        if (result.success) {
          setDepartmentsData(result.data || []);
        }
      } catch (error) {
        console.error("Error loading departments:", error);
      }
    };
    getDepartments();
  }, []);

  const columns = [

    {
      accessorKey: 'alert_title',
      header: 'عنوان التنبيه',
      size: 150,
      muiEditTextFieldProps: {
        variant: 'outlined',
        size: 'small',
        sx: {
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
          '& .MuiInputBase-input': { textAlign: 'right' },
        },
      },
    },
    {
      accessorKey: 'alert_message',
      header: 'محتوى التنبيه',
      size: 250,
      muiEditTextFieldProps: {
        variant: 'outlined',
        size: 'small',
        multiline: true,
        rows: 3,
        sx: {
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
          '& .MuiInputBase-input': { textAlign: 'right' },
        },
      },
    },
    {
      accessorKey: 'status',
      header: 'حالة التنبيه',
      size: 130,
    enableEditing: false,
      editSelectOptions: alertStatuses,
      muiEditTextFieldProps: {
        select: true,
        variant: 'outlined',
        size: 'small',
        sx: {
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
          '& .MuiInputBase-input': { textAlign: 'right' },
        },
      },
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const statusConfig = {
          new: { color: 'primary', label: 'جديد' },
          in_progress: { color: 'warning', label: 'قيد المعالجة' },
          completed: { color: 'success', label: 'تم الحل' },
          cancelled: { color: 'error', label: 'ملغي' },
          escalated: { color: 'secondary', label: 'مرفوع' }
        };
        
        const config = statusConfig[status] || { color: 'default', label: status };
        
        return (
          <Chip 
            label={config.label}
            color={config.color}
            size="small"
          />
        );
      }
    },
    {
      accessorKey: 'alert_date',
      header: 'تاريخ الإرسال',
      size: 150,
      enableEditing: false,
      muiEditTextFieldProps: {
        variant: 'outlined',
        size: 'small',
        sx: {
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
          '& .MuiInputBase-input': { textAlign: 'right' },
        },
      },
    },
    {
      accessorKey: 'department_id',
      header: 'اسم القسم',
      size: 150,
      editSelectOptions: mapToSelectOptions(departmentsData, 'id', 'department_name') || [],
      Cell: ({ row }) => {
        return row.original.department_name || '';
      },
      muiEditTextFieldProps: {
        select: true,
        variant: 'outlined',
        size: 'small',
        sx: {
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
          '& .MuiInputBase-input': { textAlign: 'right' },
        },
      },
    },
  ];

  const table = useMaterialReactTable({
    columns,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    data: alertsData || [],
    enableRtl: true,
    muiTableContainerProps: {
      sx: { maxWidth: '800px', maxHeight: '600px', overflow: 'auto' },
    },
    initialState: { 
      columnVisibility: { alert_id: false },
      density: 'compact',
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="تعديل">
          <IconButton onClick={() => {
            table.setEditingRow(row);
          }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton color="error" onClick={() => { handleDelete(row) }} >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        إنشاء سجل جديد
      </Button>
    ),
    onCreatingRowSave: handelCreateItem,
    onEditingRowSave: handelUpdateItem,
    muiTablePaperProps: {
      sx: { borderRadius: 2 },
    },
  });

  return (
    <Box p={1} m={1}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        إدارة التنبيهات
      </Typography>
      <MaterialReactTable table={table} />
      <Notification
        open={notifOpen}
        setOpen={setNotifOpen}
        message={notifMessage}
        severity={notifSeverity}
      />
    </Box>
  );
}