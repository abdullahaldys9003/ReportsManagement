

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


import { deleteItem } from "../api/crudApi.js";
import { useReportTypeMain } from "./useReportTypeMain";

const {
    handleCreate,
  //  handleCreate,
    handleDelete,
    handleSaveUpdate,
  } = useReportTypeMain();
  
import { getAllItems,deleteItemDirect} from '../api/crudApi.js';

  function getDataReportMain () {
    const data = getAllItems("index.php",{ tableName: "report_main_types", operation: "show"});
    
        return data;
  }
  
  function getDataNeighborhoods () {
    const data = getAllItems("index.php",{ tableName: "neighborhoods", operation: "show"});
    
        return data;
  }

export default function ReportTypeMain() {
  
  const [dataDataReportMain, setDataReportMain] = useState([]);
  const [dataNeighborhoods, setDataNeighborhoods] = useState([]);



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



  


  const columns = [
    { 
      accessorKey: 'type_name', 
      header: 'اسم البلاغ', 
      size: 150,
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: dataDataReportMain || [],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRtl: true,
    muiTableContainerProps: {
      sx: {
       mainWidth:'700px',
        maxHeight: '600px',
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
          <IconButton color="error" onClick={()=> {deleteItem(row.original.id,"index.php",{ tableName: "report_main_types", operation: "delete"})}} >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
   onEditingRowSave: handleSaveUpdate,
    onCreatingRowSave: handleCreate,
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
        الانواع الرئيسية 
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}