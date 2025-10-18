import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function ImageDescription({ description }) {
  // إعدادات الحركة
  const descriptionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      key={description}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={descriptionVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Box
      
        borderLeft='2px solid #1CC4DB'
        borderRight='2px solid #1CC4DB'
        boxShadow={6}
        p={3}
        my={3}
        borderRadius={5}
        mx="auto"
        style={{
          maxHeight: '200px', // تحديد الحد الأقصى للارتفاع
          maxWidth: '300px', // تحديد الحد الأقصى للعرض
          overflowY: 'auto', // إضافة شريط تمرير عمودي إذا لزم الأمر
          overflowX: 'auto', // إضافة شريط تمرير أفقي إذا لزم الأمر
          whiteSpace: 'normal', // السماح بتكسير النص عند الحاجة
          wordBreak: 'break-word' // كسر الكلمات الطويلة إذا لزم الأمر
        }}
      >
        <Typography variant="body1" color="textPrimary" align="center">
          {description}
        </Typography>
      </Box>
    </motion.div>
  );
}



