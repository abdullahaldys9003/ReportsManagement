// tableConfig.js
export const tableConfig = {
  initialState: {
    density: 'comfortable',
    pagination: { pageSize: 10, pageIndex: 0 },
  },
  muiTablePaperProps: {
    elevation: 2,
    sx: { borderRadius: '8px' },
  },
  muiTableHeadRowProps: {
    sx: { backgroundColor: '#1976d2' },
  },
  muiTableHeadCellProps: {
    sx: { 
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
    },
  },
  muiTableContainerProps: {
    sx: {
      maxHeight: '600px',
      maxWidth: '800px',
      overflow: 'auto',
    },
  },
};