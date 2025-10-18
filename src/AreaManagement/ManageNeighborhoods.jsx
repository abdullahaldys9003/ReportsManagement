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



import { getAllItems } from '../api/crudApi.js';

  function getDataDistricts () {
    const data = getAllItems("index.php",{ tableName: "districts", operation: "show"});
    
        return data;
  }
  function getDataNeighborhoods () {
    const data = getAllItems("index.php",{ tableName: "neighborhoods", operation: "show"});
    
        return data;
  }

export default function ManageNeighborhoods() {
  
  const [dataDistricts, setDataDistricts] = useState([]);
  const [dataNeighborhoods, setDataNeighborhoods] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultDistricts = await getDataDistricts();
        
        setDataDistricts(resultDistricts);
        const resultNeighborhoods = await getDataNeighborhoods();
        
        setDataNeighborhoods(resultNeighborhoods);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  const filterDataDistricts = () => {
    return dataDistricts.map(item => ({
      value: item.id,
      label: item.name
    }));
  }

  const columns = [
    { 
      accessorKey: 'neighborhood_id', 
      header: 'المعرف', 
      size: 80,
      enableEditing: false,
    },
    { 
      accessorKey: 'neighborhood_name', 
      header: 'اسم الحي', 
      size: 150,
    },
    { 
      accessorKey: 'district_id', 
      header: 'المنطقة', 
      size: 150,
      editVariant: 'select',
      editSelectOptions: filterDataDistricts(),
      muiEditTextFieldProps: {  
        select: true,
      },
      Cell: ({ cell }) => {
        const districtId = cell.getValue();
        const district = dataDistricts.find(d => d.id === districtId);
        return district ? district.name : 'غير محدد';
      }
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: dataNeighborhoods || [],
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
        <Tooltip title="عرض التفاصيل">
          <IconButton color="primary">
            <VisibilityIcon />
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
        إدارة الأحياء
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}