import { Box, Typography, Button, Tooltip, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { getAllItems, createItem, deleteItem, updateItem } from '../api/crudApi.js';

import { mapToSelectOptions, filterByIdWithValueLabel } from "../helps/filtersValueLable.js";
import Notification from '../common/components/Notification.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDataStore } from "../store/dataStore.js";

export default function DepartmentManager() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifSeverity, setNotifSeverity] = useState('success');

  const [departmentsData, setDepartmentsData] = useState([]);
  const [selectDistrictsId, setSelectdistrictId] = useState(null);

  const { 
    districts, 
    neighborhoods,
    fetchAllData,
    initialized 
  } = useDataStore();

  // تحميل بيانات الأقسام
  useEffect(() => {
    const fetchDepartmentsData = async () => {
      const result = await getAllItems("index.php", { 
        tableName: "departments", 
        operation: "getDepartments" 
      });
      if (result.success) {
        setDepartmentsData(result.data);
      } else {
        setNotifMessage(result.message || "حدث خطأ في تحميل البيانات");
        setNotifSeverity("error");
        setNotifOpen(true);
      }
    };
    fetchDepartmentsData();
  }, []);

  // تحميل البيانات العامة
  useEffect(() => {
    if (!initialized) {
      fetchAllData();
    }
  }, [initialized, fetchAllData]);

  // معالجة إنشاء قسم جديد
  const handelCreateItem = async ({ values }) => {
    const params = { tableName: "departments", operation: "add" };
    
    try {
      const data = await createItem(values, "index.php", params);
      
      if (data.success) {
        setDepartmentsData(prevData => [...prevData, { ...values, id: data.id }]);
        setNotifMessage("تم إضافة القسم بنجاح");
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

  // معالجة تحديث القسم
  const handelUpdateItem = async ({ values }) => {
    const params = { tableName: "departments", operation: "update" };

    try {
      const data = await updateItem(values, "index.php", params);
      if (data.success) {
        setDepartmentsData(prevData =>
          prevData.map(dept =>
            dept.id === values.id ? { ...dept, ...values } : dept
          )
        );

        setNotifMessage(data.message || "تم تعديل بيانات القسم بنجاح");
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

  // معالجة حذف القسم
  const handleDelete = async (row) => {
    const params = { 
      tableName: "departments", 
      operation: "delete", 
      id: row.original.id 
    };
    
    try {
      const result = await deleteItem(row.original.id, "index.php", params);
      
      if (result.success) {
        setDepartmentsData(prevData => 
          prevData.filter(dept => dept.id !== row.original.id)
        );
        
        setNotifMessage(result.message || "تم حذف القسم بنجاح");
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

  const columns = [
    {
      accessorKey: 'id',
      header: 'المعرف',
      size: 80,
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
      accessorKey: 'department_name',
      header: 'اسم القسم',
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
      accessorKey: 'districts_id',
      header: 'اسم المديرية',
      size: 150,
      editSelectOptions: mapToSelectOptions(districts, "id", "name") || [],
      muiEditTextFieldProps: {
        select: true,
        variant: 'outlined',
        size: 'small',
        onChange: (e) => {
          const districtId = e.target.value;
          setSelectdistrictId(districtId);
        },
        sx: {
          borderRadius: 2,
          backgroundColor: '#f5f7fa',
          '& .MuiInputBase-input': { textAlign: 'right' },
        },
      },
      Cell: ({ cell }) => {
        const districtId = cell.getValue();
        const district = districts.find(d => d.id === districtId);
        return district ? district.name : 'غير محدد';
      }
    },
    {
      accessorKey: 'neighborhoods_id',
      header: 'اسم الحي',
      size: 150,
      editSelectOptions: filterByIdWithValueLabel(neighborhoods, selectDistrictsId, "district_id", "neighborhood_name") || [],
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
        const neighborhoodId = cell.getValue();
        const neighborhood = neighborhoods.find(n => n.neighborhood_id == neighborhoodId);
        return neighborhood ? neighborhood.neighborhood_name : '';
      },
    },
    {
      accessorKey: 'type',
      header: 'نوع القسم',
      size: 150,
      editSelectOptions: [
        { value: 'police', label: 'قسم شرطة' },
        { value: 'point', label: 'نقطة تفتيش' },
      ],
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
    {
      accessorKey: 'address',
      header: 'العنوان',
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
      accessorKey: 'created_at',
      header: 'تاريخ الإنشاء',
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
  ];

  const table = useMaterialReactTable({
    columns,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    data: departmentsData || [],
    enableRtl: true,
    muiTableContainerProps: {
      sx: { 
        minWidth: '1000px', 
        maxHeight: '600px', 
        overflow: 'auto' 
      },
    },
    initialState: { 
      columnVisibility: { id: false },
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
        إضافة قسم جديد
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
        إدارة الأقسام
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