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
import TabSR from "./TabSR";
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


  const getPendingManagementReportsByDepartment = async (conut=null) => {

    const ruslte = await getAllItems(
      "index.php",
      {
        tableName: "reports",
        operation: "getPendingManagementReportsByDepartment",
        data: {
          limit: conut || 10,
          status: status || "opened",
        },
      },
    );
    alert(JSON.stringify(ruslte));
    if(ruslte)
    return ruslte;
    else {
      alert("خطاء في جلب البيانات");
    }
  };
  
  
const getDataReportSubTypes = async () => {
  const result = await getAllItems("index.php", {
    tableName: "report_sub_types",
    operation: 'show'
  });

  if(result.status="success")
  return result;
  else alert(result.message);
};
const getDataReportMainTypes = async () => {
  const result = await getAllItems("index.php", {
    tableName: "report_main_types",
    operation: 'show'
  });
//alert(JSON.stringify(result));
  if(result.status="success")
  return result;
  else alert(result.message);
};


export default function ManagementSR() {
  
  const [dataDataReportMain, setDataReportMain] = useState([]);
  
   const [reportsData, setReportsData] = useState([]);
   const [dataReportSubTypes,setDataReportSubTypes] = useState([]);

  const [validationErrors, setValidationErrors] = useState({});

  const [selectDistrictsId, setSelectdistrictId] = useState(null);
  const [selectReportMainTypesId, setSelectReportMainTypesId] = useState(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });


const fechAllDepartmentReport = async() => {
      const data = await getPendingManagementReportsByDepartment(pagination.pageSize || 10);
       setReportsData(data);
         // alert(data)
  }
    


  useEffect(() => {
  fechAllDepartmentReport();
  }, [pagination.pageSize]);


  useEffect(() => {
    const fetchData = async () => {
      try {
       const reportMainTypes = await getDataReportMainTypes();
         setDataReportMain(reportMainTypes);
        const reportSubTypes = await getDataReportSubTypes();
        setDataReportSubTypes(reportSubTypes); 
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
    accessorKey: 'report_id', 
    header: 'المعرف', 
    size: 80,
    enableEditing: false,
  },
  { 
    accessorKey: 'description', 
    header: 'وصف البلاغ', 
    size: 80,
    enableEditing: false,
  },
  { 
    accessorKey: 'status_report', 
    header: 'حالة البلاغ', 
    size: 80,
    enableEditing: false,
  },
  {
    accessorKey: 'report_main_id',
    header: 'البلاغ الرئيسي',
    size: 120,
    editVariant: 'select',
    editSelectOptions: mapToSelectOptions(dataDataReportMain, "id", "type_name"),
    muiEditTextFieldProps: {  
      select: true,
      onChange: async (e) => {
        const reportMainTypesId = e.target.value;
        setSelectReportMainTypesId(reportMainTypesId);
      },
    },
    Cell: ({ row }) => row.original.type_name,
  },
  {
    accessorKey: 'report_sub_id',
    header: 'البلاغ الفرعي',
    size: 120,
    editVariant: 'select',
    editSelectOptions: filterByIdWithValueLabel(dataReportSubTypes, selectReportMainTypesId, "main_type_id", "sub_type_name"),
    muiEditTextFieldProps: {
      select: true,
      variant: 'outlined',
    },
    Cell: ({ row }) => row.original.sub_type_name,
  },
  { 
    accessorKey: 'districts_id', 
    header: 'اسم المديرية', 
    size: 150,
    editVariant: 'select',
    editSelectOptions: mapToSelectOptions(districts, "id", "name"),
    muiEditTextFieldProps: {  
      select: true,
      onChange: async (e) => {
        const districtId = e.target.value;
        setSelectdistrictId(districtId);
      },
    },
    Cell: ({ cell }) => {
      const districtId = cell.getValue();
      const district = districts.find(d => d.id === districtId);
      return district ? district.name : 'غير محدد';
    },
  },
  { 
    accessorKey: 'neighborhoods_id', 
    header: 'اسم الحي', 
    size: 150,
    editVariant: 'select',
    editSelectOptions: filterByIdWithValueLabel(neighborhoods, selectDistrictsId, "district_id", "neighborhood_name"),
    muiEditTextFieldProps: {  
      select: true,
    },
    Cell: ({ cell }) => {
      const neighborhoodId = cell.getValue();
      const neighborhood = neighborhoods.find(n => n.neighborhood_id == neighborhoodId);
      return neighborhood ? neighborhood.neighborhood_name : '';
    },
  },
], [districts, selectDistrictsId, selectReportMainTypesId]);

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
    data: reportsData || [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRtl: true,
   enableTopToolbar: false,
  enableBottomToolbar: true,
  enableColumnActions: false,
  enableColumnFilters: false,
  enablePagination: true,
  enableSorting: false,
  enableHiding: false,
  enableFullScreenToggle: false,
  enableDensityToggle: false,
   state: {
      pagination,
    },
   initialState: { pagination },
   onPaginationChange: setPagination,
  enableRowSelection: false,
    muiTableContainerProps: {
      sx: {
       maxWidth:'900px',
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
      <TabSR />

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
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
        مراجعة بيانات البلاغات والتحقق منها   
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}