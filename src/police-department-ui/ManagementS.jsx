//
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import { useMemo, useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons
} from 'material-react-table';

import { useHooksApi } from "./useHooksApi";
import { useDataStore } from "../store/dataStore.js";
//import { validateEmployeeInput, validateEmployeeOnSubmit } from './validation';

const {
    handleCreate,
    handleDelete,
    handleSaveUpdate,
  } = useHooksApi();

import { mapToSelectOptions,filterByIdWithValueLabel } from "../helps/filtersValueLable.js"; 
import { getAllItems } from '../api/crudApi.js';


const getSuspectByReportId = async () => {
  const result = await getAllItems("index.php", {
    tableName: "suspects",
    operation: 'getSuspectByReportId',
    id:49,
  });
  alert(JSON.stringify(result));

  if(result.status="success")
  return result;
  else alert(result.message);
};



export default function ManagementS() {
  
  const [dataDataReportMain, setDataReportMain] = useState([]);
  const [dataDepartments, setDatagetDepartments] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const [selectDistrictsId, setSelectdistrictId] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultDataDepartment = await getSuspectByReportId();
        setDatagetDepartments(resultDataDepartment);
        
      } catch (error) {
        alert(error.message);
      }
    };
    fetchData();
  }, []);


 const { 
    districts, 
    loading,
    neighborhoods,
    fetchAllData,
    initialized 
  } = useDataStore();

useEffect(() => {
    // الجلب يحدث فقط إذا لم يتم التهيئة بعد

    if (!initialized) {
      fetchAllData();
    }
  }, [initialized, fetchAllData]);
  
const filterDataDepartments = () => {
    return dataDepartments.map(item => ({
      value: item.id,
      label: item.department_name
    }));
  }

  const columns = useMemo(() => [
      { accessorKey: 'national_id', header: 'الرقم الهوية', size: 150 },
      { accessorKey: 'age', header: 'العمر', size: 80 },
      { accessorKey: 'gender', header: 'الجنس', size: 80 },
      { accessorKey: 'phone', header: 'رقم الهاتف', size: 150 },
      { accessorKey: 'address', header: 'العنوان', size: 250},
      { accessorKey: 'created_date', header: 'تاريخ الاضافة', size: 250},
      { 
      accessorKey: 'districts_id', 
      header: 'اسم المديرية', 
      size: 150,
      editVariant: 'custom',
      editVariant: 'select',
      editSelectOptions: mapToSelectOptions(districts,"id","name"),
      muiEditTextFieldProps: {  
        select: true,
         onChange: async (e) => {
          const districtId = e.target.value;
          setSelectdistrictId(districtId);
         
          // تصفية الأحياء حسب المديرية
          
         
          // تصفية الأحياء المعزولة حسب المديرية
          
        },
      },
      Cell: ({ row }) => row.original.district_name,
    
  },
   { 
      accessorKey: 'neighborhoods_id', 
      header: 'اسم الحي', 
      size: 150,
      editVariant: 'custom',
        editSelectOptions:filterByIdWithValueLabel(neighborhoods,selectDistrictsId,"district_id","neighborhood_name"),
          muiEditTextFieldProps: {  
        select: true,
      },
      Cell: ({ row }) => row.original.neighborhood_name,
  },
],[districts,selectDistrictsId]);

  // وظيفة التحقق قبل الحفظ
  const handleSaveWithValidation = async ({ values, table, row }) => {
    /*
    const isEdit = !!row;
    const validationResult = validateEmployeeOnSubmit(values, isEdit);
    
    if (!validationResult.isValid) {
      setValidationErrors(validationResult.errors);
      return;
    }
    
    //setValidationErrors({});
     await handleCreate({ values, table });
   /* 
    if (isEdit) {
      await handleSaveUpdate({ values, table, row });
    } else {
      await handleCreate({ values, table });
    }*/
  };

  // وظيفة التحقق أثناء الكتابة
  const handleValidateField = (cell, value) => {
    const field = cell.column.columnDef.accessorKey;
    const tempData = { [field]: value };
    const validationResult = validateEmployeeInput(tempData);
    
    setValidationErrors(prev => ({
      ...prev,
      [field]: validationResult.errors[field]
    }));
  };

  const table = useMaterialReactTable({
    columns,
    data: dataDepartments || [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRtl: true,
  enableTopToolbar: false,
  enableBottomToolbar: false,
  enableColumnActions: false,
  enableColumnFilters: false,
  enablePagination: false,
  enableSorting: false,
  enableHiding: false,
  enableFullScreenToggle: false,
  enableDensityToggle: false,
  enableRowSelection: false,
    muiTableContainerProps: {
      sx: {
       maxWidth:'800px',
        maxHeight: '600px',
        overflow: 'auto',
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="تعديل">
          <IconButton onClick={() => {
            setValidationErrors({});
            table.setEditingRow(row);
          }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton color="error" onClick={()=> {handleDelete(row, table)}} >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="عرض التفاصيل">
          <IconButton color="primary">
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
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

jaja

      </Box>
    ), 
    onEditingRowSave: handleCreate,
    onCreatingRowSave: handleSaveWithValidation,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          setValidationErrors({});
          table.setCreatingRow(true);
        }}
      >
        إضافة  
      </Button>
    ),
    muiTablePaperProps: {
      elevation: 2,
      sx: {
        borderRadius: 2,
      },
    },
  });

  return (
    <Box sx={{ p: 2 }}>

      <MaterialReactTable table={table} />
    </Box>
  );
}