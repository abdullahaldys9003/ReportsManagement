import { Box, Typography,Button,Tooltip,
  IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { MaterialReactTable,useMaterialReactTable} from 'material-react-table';
import { getAllItems,createItem,deleteItem,updateItem } from '../api/crudApi.js';

 import { mapToSelectOptions } from "../helps/filtersValueLable.js";
 //
 import Notification from '../common/components/Notification.jsx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
// داخل مكون UserManagement

export default function UserManagement() {
const [notifOpen, setNotifOpen] = useState(false);
const [notifMessage, setNotifMessage] = useState('');
const [notifSeverity, setNotifSeverity] = useState('success');

  const [usersData, setUsersData] = useState([]);
  const [departmentsData, setDepartmentsData] = useState([]);

const handelCreateItem = async ({ values }) => {
  const params = { tableName: "employees", operation: "add" };
  const data = await createItem(values, "index.php", params);
   //alert(JSON.stringify(data));
  if (data.success) {
    setUsersData([...usersData, values]);
    setNotifMessage("تم إضافة الموظف بنجاح");
    setNotifSeverity("success");
    setNotifOpen(true);
    // تحديث البيانات بعد الإضافة

  } else {
    setNotifMessage("حدث خطأ أثناء الإضافة");
    setNotifSeverity("error");
    setNotifOpen(true);
  }
};
const handelUpdateItem = async ({ values }) => {
  const params = { tableName: "employees", operation: "update" };

  try {
    const data = await updateItem(values, "index.php", params);

    if (data.success) {
      // تحديث الصف في الحالة دون إعادة تحميل
      setUsersData(prevData =>
        prevData.map(emp =>
          emp.employee_id === values.employee_id ? { ...emp, ...values } : emp
        )
      );

      setNotifMessage(data.message || "تم تعديل بيانات الموظف بنجاح");
      setNotifSeverity("success");
      setNotifOpen(true);
    } else {
      setNotifMessage(data.message || "حدث خطأ أثناء التعديل");
      setNotifSeverity("error");
      setNotifOpen(true);
    }
  } catch (err) {
    // عرض رسالة الخطأ المفصّلة
    setNotifMessage(err.message);
    setNotifSeverity("error");
    setNotifOpen(true);
  }
};



const handleDelete = async (row) => {
  const params = { 
    tableName: "employees", 
    operation: "delete", 
    id: row.original.employee_id 
  };
  
  const result = await deleteItem(
    row.original.employee_id,
    "index.php",
    params
  );  

  
  if (result.success) {
    // تحديث البيانات بعد الحذف الناجح
    setUsersData(prevData => 
      prevData.filter(user => user.employee_id !== row.original.employee_id)
    );
    
    // إظهار الإشعار
    setNotifMessage(result.message);
    setNotifSeverity("success");
    setNotifOpen(true);
  } else {
    setNotifMessage(result.message);
    setNotifSeverity("error");
    setNotifOpen(true);
  }
};

  // تحميل البيانات أول مرة
  useEffect(() => {
  const  fetchUsersData = async () =>{
  const result = await getAllItems("index.php", { 
    tableName: "employees", 
    operation: "show" 
  });

   setUsersData(result);
  //  alert(JSON.stringify(result));
}
    fetchUsersData();
  }, []);

  useEffect(() => {
  const  getDepartmentName = async () =>{
  const result = await getAllItems("index.php", { 
    tableName: "departments", 
    operation: "getDepartments" 
  });
   setDepartmentsData(result.data);
  //alert(JSON.stringify(result));
}
    getDepartmentName();
  }, []);




const columns = [
  {
    accessorKey: 'employee_id',
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
    accessorKey: 'name_full',
    header: 'اسم الموظف',
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
    accessorKey: 'username',
    header: 'اسم المستخدم',
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
    accessorKey: 'password',
    header: 'كلمة السر',
    size: 150,
    muiEditTextFieldProps: {
      type: 'password',
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
    accessorKey: 'email',
    header: 'البريد الإلكتروني',
    size: 150,
    muiEditTextFieldProps: {
      type: 'email',
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
    accessorKey: 'number_phone',
    header: 'رقم الهاتف',
    size: 150,
    muiEditTextFieldProps: {
      type: 'tel',
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
  accessorKey: 'position_type',
  header: 'الدور',
  size: 150,
  editSelectOptions: [
    { label: 'مشرف', value: 'admin' },
    { label: 'موظف', value: 'user' },
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
    accessorKey: 'department_id',
    header: 'اسم القسم',
    size: 150,
    editSelectOptions: mapToSelectOptions(departmentsData, 'id', 'department_name') || [],
     Cell: ({ cell,row}) => {
        
        return  row?.original.department_name;
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
    data: usersData || [],
    enableRtl: true,
    muiTableContainerProps: {
      sx: { maxWidth: '800px', maxHeight: '600px', overflow: 'auto' },
    },
  initialState: { columnVisibility: { employee_id: false },
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
          <IconButton color="error" onClick={()=> {handleDelete(row)}} >
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
  onCreatingRowSave:handelCreateItem,
  onEditingRowSave: handelUpdateItem,
    muiTablePaperProps: {
     // elevation: 2,
      sx: { borderRadius: 2 },
    },
  });

  return (
<Box 
  p={1} 
  m={1}
>
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
