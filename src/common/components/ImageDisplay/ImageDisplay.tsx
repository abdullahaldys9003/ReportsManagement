/*
import React from 'react';
import { styled } from '@mui/system';
import CardMedia from '@mui/material/CardMedia';

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transition: 'opacity 0.10s ease-in-out',
  borderRadius: 10,
}));

export default function ImageDisplay({ image }) {
  return <StyledCardMedia component="img" image={image?.src} alt={image?.alt} />;
}

*/


import React, { useState } from 'react';
import { styled } from '@mui/system';
import CardMedia from '@mui/material/CardMedia';
import { motion } from 'framer-motion';

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: 10,
  cursor: 'pointer',
}));

export default function ImageDisplay({ image }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleImage = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div onClick={toggleImage}>
        <StyledCardMedia component="img" image={image?.src} alt={image?.alt} />
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} // بدء بتأثير التلاشي
          animate={{ opacity: 1 }}  // التلاشي للظهور الكامل
          exit={{ opacity: 0 }}     // التلاشي عند الإغلاق
          transition={{ duration: 0.5 }} // مدة التلاشي
          onClick={toggleImage}
          style={{
            position: 'fixed',
            top: '60%',
            left: '50%',
            bottom:'60%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2000,
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '20px',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '80vw',  // تكبير العرض ليغطي 80% من العرض
            height: '80vh', // تكبير الارتفاع ليغطي 80% من الارتفاع
          }}
        >
          <StyledCardMedia 
            component="img" 
            image={image?.src} 
            alt={image?.alt} 
            style={{ width: '100%', height: '100%' }} // التأكد من أن الصورة تأخذ الحجم الكامل
          />
        </motion.div>
      )}
    </>
  );
}