import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'; // استيراد أيقونة التنزيل

const ProgramDownload = ({storeUrl}) => {

  const handleDownload = () => {
    window.open(storeUrl, '_blank'); // فتح المتجر في نافذة جديدة
  };
  
  return (
    <Button variant="contained" color="primary" onClick={handleDownload} startIcon={<DownloadIcon />}>
      Acode
    </Button>
  );
  
};

export default ProgramDownload;


