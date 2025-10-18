
//department_id:3
//getAlertsByDepartmentId
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
  Button,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { useMemo, useEffect, useState } from 'react';
import { getAllItems, updateItem } from '../api/crudApi.js'; // تأكد من وجود updateItem
import CardWanted from "./CardWanted";
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons
} from 'material-react-table';


export default function ViewCheckpointTasks() {
  const [dataAlerts, setDataAlerts] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [dataSuspects, setDataSuspects] = useState(null);

  const getDataAlerts = () => {
    const params = {
      tableName: "police_alerts",
      operation: "getAlertsByDepartmentId",
      id: 3,
    };
    
    return getAllItems("index.php", params);
  };
  const getDataSuspects= (id=13) => {
    const params = {
      tableName: "suspects",
      operation: "showById",
      id:id,
    };
    
    return getAllItems("index.php", params);
  };

  // دالة تحديث حالة القراءة
  const updateReadStatus = async (alertId, newStatus) => {
    try {
      setUpdatingId(alertId);
      const updateData = {
        alert_id: alertId,
        status: newStatus,
      };
    const params = {
      tableName: "police_alerts",
      operation: "updateStatus",
    };
      const result = await updateItem(updateData,"index.php",params);

      if (result.status === "success") {
        // تحديث البيانات المحلية
        setDataAlerts(prev => prev.map(alert => 
          alert.alert_id === alertId 
            ? { ...alert, status: newStatus, read_date: updateData.read_date }
            : alert
        ));
      } else {
        alert("فشل في تحديث الحالة: " + result.message);
      }
    } catch (error) {
      alert("خطأ في التحديث: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDataAlerts();
        setDataAlerts(result);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { 
      accessorKey: 'alert_id', 
      header: 'معرف', 
      size: 80 
    },
    { 
      accessorKey: 'alert_title', 
      header: 'عنوان التنبيه', 
      size: 150 
    },
    { 
      accessorKey: 'alert_message', 
      header: 'محتوى التنبيه', 
      size: 250 
    },
    {
      accessorKey: 'status',
      header: 'حالة المهمة',
      size: 120,
      Cell: ({ cell, row }) => {
        const status = cell.getValue();
        const getStatusColor = (status) => {
          switch (status) {
            case 'in_progress': return { bg: '#ffebee', color: '#c62828', text: 'قيد المعالجة' };
            case 'completed': return { bg: '#e8f5e8', color: '#2e7d32', text: 'تم الانتهاء' };
            case 'rejected': return { bg: '#fff3e0', color: '#f57c00', text: 'مرفوض' };
            default: return { bg: '#f5f5f5', color: '#757575', text: status };
          }
        };

        const statusInfo = getStatusColor(status);

        return (
          <FormControl size="small" fullWidth>
            <Select
              value={status}
              onChange={(e) => updateReadStatus(row.original.alert_id, e.target.value)}
              disabled={updatingId === row.original.alert_id}
              sx={{
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                fontWeight: 'bold',
                '& .MuiSelect-select': {
                  padding: '6px 12px',
                  textAlign: 'center'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                }
              }}
            >
              <MenuItem value="in_progress">
                <Box sx={{ color: '#c62828', fontWeight: 'bold' }}>قيد المعالجة</Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box sx={{ color: '#2e7d32', fontWeight: 'bold' }}>تم الانتهاء</Box>
              </MenuItem>
              <MenuItem value="result">
                <Box sx={{ color: '#f57c00', fontWeight: 'bold' }}>مرفوض</Box>
              </MenuItem>
            </Select>
          </FormControl>
        );
      },
    },

    { 
      accessorKey: 'alert_date', 
      header: 'تاريخ الإرسال', 
      size: 120,
      Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString('ar-SA')
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: dataAlerts || [],
    enableRtl: true,
    initialState: {
      sorting: [{ id: 'alert_date', desc: true }] // أحدث التنبيهات أولاً
    },
  renderDetailPanel: ({ row }) => (
      <Box
        sx={{
          display: 'grid',
          margin: 'auto',
          gridTemplateColumns: '1fr 1fr',
          width: '100%',
        }}
      >
      <CardWanted id={row.original.suspects_id} />
    
      </Box>
    ),
    muiTableContainerProps: {
      sx: {
        maxHeight: '500px',
        maxWidth: '800px',
        overflow: 'auto',
      },
    },
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, textAlign: 'center' }}>
        الإشعارات - القسم 3
      </Typography>
      <MaterialReactTable table={table} />
    </Box>
  );
}