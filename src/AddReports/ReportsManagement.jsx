import {
  Chip,
  Box,
  Paper,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  alpha,
  Tooltip,
  IconButton,
  Button
} from '@mui/material';
import { useMemo, useEffect, useState } from 'react';
import { getAllItems } from '../api/crudApi.js';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons
} from 'material-react-table';

import { useNotificationsAPI } from './useNotificationsAPI.js';

export default function ReportsManagement() {
  const [dataDepartMemnt,setDataDepartment] = useState([]);
    const [dataDistricts,setDataDistricts] = useState([]);
  
  const {
    getQuery,
    handleCreate,
    handleSaveUpdate,
  } = useNotificationsAPI();
  
  const { 
    data: dataPoint = [], 
    isLoading,
    isError,
    isFetching
  } = getQuery;





  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    alert(districtId);
  };


  const  getDataDepartMemnt = () =>
    getAllItems("index.php",{ tableName: "department_statistics", operation: "getAllDepartments"});
    
  const  getDataDistricts = () =>
    getAllItems("index.php",{ tableName: "districts", operation: "show"});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDataDepartMemnt();
       const resultDistricts = await getDataDistricts();
         setDataDistricts(resultDistricts);
        setDataDepartment(result.data);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

         
         
  const filterDataDepartment =()=>{
    return dataDepartMemnt.map(item => ({
      value: item.id,
      label: item.department_name
    }));
  }
  
  const filterDataDistricts =() =>{
    return dataDistricts.map(item => ({
      value: item.id,
      label: item.department_name
    }));
  }

  const columns = [
    { accessorKey: 'alert_id', header: 'معرف', size: 150 },
    { accessorKey: 'alert_title', header: 'عنوان التنبيه', size: 150 },
    { accessorKey: 'alert_message', header: 'محتوى التنبيه', size: 250 },
    { 
      accessorKey: 'department_name', 
      header: 'الجهه المكلفة', 
      size: 150,
      editVariant: 'select',
      editSelectOptions: filterDataDepartment() || [],
      muiEditTextFieldProps: {  
        select: true,  
        onChange: handleDistrictChange,
    },  
    },
    { accessorKey: 'status', header: 'حالة المهمة', size: 150 },
    { accessorKey: 'alert_date', header: 'تاريخ ارسال ', size: 150 },
  ];
  
  const table = useMaterialReactTable({
    columns,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
   enableEditing: true,
    data: dataPoint || [],
    enableRtl: true,
    muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
        maxWidth: '800px',
        overflow: 'auto',
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="تعديل">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="عرض">
          <IconButton color="primary">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    onCreatingRowSave: handleCreate,
    onEditingRowSave: handleSaveUpdate,
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
  });

  return (
    <Box>
      <MaterialReactTable table={table} />
    </Box>
  );
}