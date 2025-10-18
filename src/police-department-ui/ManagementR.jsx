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

import FieldCorrectionForm from "./FieldCorrectionForm";
const getReportersByReportId = async () => {
  const result = await getAllItems("index.php", {
    tableName: "reporters",
    operation: 'getReportersByReportId',
    id:49,
  });
 //   alert(JSON.stringify(result));
  if(result.status="success")
  return result.data;
  else alert(result.message);
};



export default function ManagementR() {
  
  const [dataDataReportMain, setDataReportMain] = useState([]);
  const [dataDepartments, setDatagetDepartments] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  const [selectDistrictsId, setSelectdistrictId] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultDataDepartment = await getReportersByReportId();
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
  { 
      accessorKey: 'name_reporter', 
      header: 'اسم المبلغ', 
      size: 150,
      editVariant: 'custom',
      
    },
  { 
      accessorKey: 'phone_reporter', 
      header: 'اسم رقم الهاتف', 
      size: 150,
      editVariant: 'custom',
      
    },
  { 
      accessorKey: 'id_national_reporter', 
      header: 'رقم الهوية', 
      size: 150,
      editVariant: 'custom',
      
    },
  { 
      accessorKey: 'email_reporter', 
      header: 'البريد', 
      size: 150,
      editVariant: 'custom',
      
    },
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
  { 
      accessorKey: 'address', 
      header: 'العنوان', 
      size: 150,
      editVariant: 'custom',
    },

],[districts,selectDistrictsId]);

  // وظيفة التحقق قبل الحفظ
  const handleSaveWithValidation = async ({ values, table, row }) => {
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
      renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        إضافة  
      </Button>
    ),
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