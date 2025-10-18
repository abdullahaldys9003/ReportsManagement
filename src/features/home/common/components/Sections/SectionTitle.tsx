import React, { useState } from 'react';
import { Typography, Divider } from '@mui/material';
const SectionTitle = ({ title }) => {
  const [active, setActive] = useState(false);

  const toggleLine = () => {
    setActive(!active);
  };
  return (
    <>
      <Typography 
        variant="h6" 
        onClick={toggleLine}
        sx={{ cursor: 'pointer', textAlign: 'center' }}
      >
        {title}
      </Typography>
     
      <Divider 
        sx={{
          width: active ? '60%' : '50%', // عرض الخط حسب حالة النقر
          transition: 'width 0.3s ease-in-out', // الانتقال السلس للعرض
          backgroundColor: 'primary.main', // لون الخط
          height: '0.4px', // سمك الخط
          mx: 'auto', // محاذاة الخط في المنتصف
          mb: 1 // مسافة صغيرة بين العنوان والخط
        }}
      />
    </>
  );
};
export default SectionTitle;
