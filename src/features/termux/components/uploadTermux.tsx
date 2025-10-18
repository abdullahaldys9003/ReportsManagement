import React from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download'; // استيراد أيقونة التنزيل
const DownloadTermux = () => {
  const handleDownload = () => {
    const repoUrl = 'https://github.com/termux/termux-app/releases/latest/download/termux-app_v0.118.1+github-debug_arm64-v8a.apk'; // رابط تحميل Termux
    const a = document.createElement('a');
    a.href = repoUrl;
    a.download = 'termux-app_v0.118.1.apk'; // اسم الملف عند التنزيل
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <Button variant="contained" color="primary" onClick={handleDownload} startIcon={<DownloadIcon />}>
     Termux
    </Button>
  );
};
export default DownloadTermux;

