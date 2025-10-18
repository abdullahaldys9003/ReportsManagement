
export const muiTableHeadCellProps = {
  sx: {
   // backgroundColor: '#3498db',
    fontSize: {
      xs: '10px',
      sm: '11px',
      md: '12px',
      lg: '13px',
      xl: '14px',
    },
    '& .Mui-TableHeadCell-Content': {
      padding: '0',
    },
    fontWeight: 'bold',
    '& th': {
      textAlign: 'center !important', // تأكيد توسيط النص
    },
  },
};

export const muiTableProps={
    sx: {
      textAlign: 'center !important',
      border: '0.5px solid #e0e0e0', // حدود خارجية للجدول
      '& td, & th': {
        border: '0.5px solid #e0e0e0', // حدود لجميع الخلايا
      },
    },
  };
export const muiTopToolbarProps={
    sx: {
      borderBottom: '1px solid',
      marginBottom: '8px',
    }
};
export const muiTablePaperProps = {
    elevation: 0, //change the mui box shadow
    //customize paper styles
    sx: {
      borderRadius: '0',
      border: '1px dashed #e0e0e0',
    },
  };
export const muiTableHeadCellFilterTextFieldProps={
  sx: {
    '& .MuiInputBase-input': {
      fontSize: '0.875rem',
      padding: '8px',
      color:"blue"
    },
    '& .MuiSvgIcon-root': {
      color: '#666',
    },
  },
};
//تنسيق اختيار من الاعلى الحقل المقابل ل تلك اانقاط
/*
export const muiFilterTextFieldProps= {
      sx: { m: '0.5rem 0', width: '100%' },
      variant: 'outlined',
};
*/
export const muiTableBodyRowProps = {
    sx: {
    '& td': {
      textAlign: 'center !important', // تأكيد توسيط النص
    },
  },
};
export const muiTableBodyCellProps = {
   sx: {
    border: '0.3px solid rgba(81, 81, 81, .5)',
    textAlign: 'center', // توسيط النص في الخلاي
  },
};
export const muiPaginationProps = {
       size: 'small',
       shape: 'rounded',
};
 
 
const muiEditTextFieldProps = {
    sx: {
      '& .MuiInputBase-root': {
        direction: 'rtl !important',
        backgroundColor: '#f5f5f5', // لون الخلفية
        borderRadius: '4px',       // زوايا مدورة
        border: '1px solid #ddd',  // حدود
      },
      '& .MuiInputBase-input': {
        textAlign: 'right',        // محاذاة النص
        padding: '12px',           // padding مخصص
        fontSize: '14px',          // حجم الخط
      },
    },
    variant: 'outlined',          // نمط الحقل
  }
  
export const tableOptions = {
  muiEditTextFieldProps:muiEditTextFieldProps,
  muiPaginationProps:muiPaginationProps,
  muiTableHeadCellProps: muiTableHeadCellProps,
  muiTablePaperProps:muiTablePaperProps,
  muiTableBodyRowProps:muiTableBodyRowProps,
  muiTableBodyCellProps:muiTableBodyCellProps,
  muiTableProps:muiTableProps,
  muiTopToolbarProps:muiTopToolbarProps,
  muiTableHeadCellFilterTextFieldProps:muiTableHeadCellFilterTextFieldProps,
};


/*
muiFilterTextFieldProps: {
      sx: { m: '0.5rem 0', width: '100%' },
      variant: 'outlined',
    },
    
    {
        accessorKey: 'id',
        header: 'ID',
        muiFilterTextFieldProps: { placeholder: 'ID' },
      },

    {
        accessorKey: 'gender',
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ],
        filterVariant: 'select',
      },
     muiSearchTextFieldProps={{
        placeholder: `Search ${data.length} rows`,
        sx: { minWidth: '300px' },
        variant: 'outlined',
      }} 
*/


/*
ازرار في ررأس الجدول
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircle />}
          sx={{
            background: 'linear-gradient(45deg, #388e3c 30%, #6abf69 90%)',
            boxShadow: '0 3px 5px 2px rgba(56, 142, 60, .3)',
          }}
        >
          تأكيد الاستلام
        </Button>
        
        <Button
          variant="contained"
          color="warning"
          startIcon={<HourglassEmpty />}
          sx={{
            background: 'linear-gradient(45deg, #ffa000 30%, #ffd149 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 160, 0, .3)',
          }}
        >
          جاري المعالجة
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #63a4ff 90%)',
            boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
          }}
        >
          نموذج جديد
        </Button>
        
        <Tooltip title="طباعة الجدول">
          <IconButton>
            <Print />
          </IconButton>
        </Tooltip>
      </Box>
    ),
*/

/*
اضافه حدود
muiTableBodyCellProps: {
      sx: {
        border: '0.3px solid rgba(81, 81, 81, .5)',
      },  
  },
    muiTableHeadCellProps: {
      sx: {
        border: '1px solid rgba(81, 81, 81, .5)',
       // fontStyle: 'italic',
        fontWeight: 'normal',
      },
    }, 
*/


/*
للفلترة من الاعلى بواسطة العمود
      {
        accessorKey: 'gender',
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: [
          { label: 'Male', value: 'Male' },
          { label: 'Female', value: 'Female' },
          { label: 'Other', value: 'Other' },
        ],
        filterVariant: 'select',
      },

*/