import React from 'react'
import StepsInstallAcode from '../StepsInstallAcode';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import QuestionHtml from '../Accordions/QuestionHtml';
//تقسيمها sections
const MainHtml = () => {
  return (
    <>
   <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper elevation={24} sx={{ padding: 0 }}>
    <QuestionHtml />
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
  <StepsInstallAcode />
</Paper>
</Container>
    </>

  )
}
export default MainHtml