import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import { useMemo, useEffect, useState } from 'react';
import { useReportTypeSub } from "./useReportTypeSub";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons
} from 'material-react-table';


const {
    handleCreate,
  //  handleCreate,
    handleDelete,
    handleSaveUpdate,
  } = useReportTypeSub();
  
import { mapToSelectOptions,filterByIdWithValueLabel } from "../helps/filtersValueLable.js"; 

import { getAllItems } from '../api/crudApi.js';

  function getDataReportMain () {
    const data = getAllItems("index.php",{ tableName: "report_main_types", operation: "show"});
    
        return data;
  }
  
  function getDataDistricts () {
    const data = getAllItems("index.php",{ tableName: "districts", operation: "show"});
    
        return data;
  }
  function getDataNeighborhoods () {
    const data = getAllItems("index.php",{ tableName: "report_sub_types", operation: "show"});
    
        return data;
  }

export default function ReportTypeSub() {
  
  const [dataDistricts, setDataDistricts] = useState([]);
  const [dataDataReportSub, setDataDataReportSub] = useState([]);
   const [dataDataReportMain, setDataReportMain] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultDistricts = await getDataDistricts();
        
        setDataDistricts(resultDistricts);
        const result = await getDataNeighborhoods();
        
        setDataDataReportSub(result);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultReportMain = await getDataReportMain();
        setDataReportMain(resultReportMain);
      } catch (error) {
        alert(error.message);
      }
    };
    fetchData();
  }, []);
  
  const filterDataDataReportMain = () => {
    return dataDataReportMain.map(item => ({
      value: item.id,
      label: item.type_name
    }));
  }

  const columns = [
    { 
      accessorKey: 'sub_type_name', 
      header: 'البلاغ الفرعي', 
      size: 150,
    },
    { 
      accessorKey: 'main_type_id', 
      header: 'البلاغ الرئيسي', 
      size: 150,
      editVariant: 'select',
      editSelectOptions: filterDataDataReportMain(),
      muiEditTextFieldProps: {  
        select: true,
      },
      Cell: ({ cell }) => {
        const data = dataDataReportMain.find(d => d.id === cell.getValue());
        return data ? data.type_name : 'غير محدد';
      }
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: dataDataReportSub || [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRtl: true,
    muiTableContainerProps: {
      sx: {
       mainWidth:'800px',
        maxHeight: '600px',
        overflow: 'auto',
      },
    },
    onEditingRowSave: handleSaveUpdate,
    onCreatingRowSave: handleCreate,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="تعديل">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton color="error" >
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
        إضافة حي جديد
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
     اضافة انواع البلاغات الفرعية 
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}