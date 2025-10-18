import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'; // استيراد أيقونة التنزيل

const DownloadProgramButton = () => {
  const handleDownload = () => {
    const storeUrl = 'https://play.google.com/store/apps/details?id=com.foxdebug.acode'; // رابط صفحة Acode في Google Play
    window.open(storeUrl, '_blank'); // فتح المتجر في نافذة جديدة
  };
  return (
    <Button variant="contained" color="primary" onClick={handleDownload} startIcon={<DownloadIcon />}>
      Acode
    </Button>
  );
};
export default DownloadProgramButton;


