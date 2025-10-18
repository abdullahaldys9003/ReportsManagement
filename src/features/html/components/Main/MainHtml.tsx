import React from 'react';
import StepsRunHtml from '../StepsRunHtml';
import Paper from '@mui/material/Paper';
import ControlledOpenSpeedDial from '@common/components/ControlledOpenSpeedDial/ControlledOpenSpeedDial.tsx';
import Container from '@mui/material/Container';

const MainHtml = () => {
  return (
    <>
   <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper elevation={24} sx={{ padding: 0 }}>
      
  </Paper>
</Container>

<Container maxWidth="md" sx={{ marginY: 2 }}>
<Paper 
  elevation={24} 
  sx={{ 
    padding: 0, 
    backgroundColor: 'background.paper', // لون خلفية واضح
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)', // تعديل الظلال لإبراز التباين
    borderRadius: 2 // إضافة تقوس طفيف للزوايا لجمالية أكثر
  }}
>
  <StepsRunHtml name ="js" />
</Paper>
      <ControlledOpenSpeedDial />
</Container>
    </>
  )
}

export default MainHtml;