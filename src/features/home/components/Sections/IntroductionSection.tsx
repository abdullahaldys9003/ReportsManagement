/*
import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const IntroductionSection = () => {
  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h2" gutterBottom>
            مقدمة
          </Typography>
          <Typography variant="body1" paragraph>
            مرحبًا بكم في دليلنا حول التطبيقات التي يمكن استخدامها لإنشاء مواقع ويب من خلال الهاتف!
          </Typography>
          <Typography variant="body1" paragraph>
            في عالم البرمجة الحديث، أصبح بإمكان المطورين إنشاء مواقع ويب وتطبيقات من خلال هواتفهم الذكية بفضل التطبيقات المتاحة. هذه التطبيقات تتيح للمستخدمين البرمجة أثناء التنقل، مما يسهل عملية التعلم والتطوير.
          </Typography>
          <Typography variant="h3" component="h3" gutterBottom>
            أهمية الموضوع
          </Typography>
          <Typography variant="body1" paragraph>
            يهدف هذا الدليل إلى توضيح كيفية استخدام التطبيقات المتاحة على الهواتف الذكية لكتابة وتشغيل أكواد جافا سكريبت وHTML، مما يجعل البرمجة أكثر سهولة ومرونة للمستخدمين.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default IntroductionSection;
*/
/*
import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const IntroductionSection = () => {
  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box boxShadow ={2} >
            <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px' }}
          >
            مقدمة
          </Typography>          
          </Box>
          
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px',boxShadow :2}}
          >
            مرحبًا بكم في دليلنا الشامل حول التطبيقات التي تتيح لكم إنشاء مواقع ويب تجارية متميزة عبر هواتفكم الذكية!
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px',boxShadow :1,p:1}}
          >
            في عصر التكنولوجيا المتطورة، أصبحت البرمجة والتطوير متاحة للجميع، حيث لم يعد يتطلب الأمر معدات أو بيئات عمل معقدة. بفضل الابتكارات الحالية، يستطيع المطورون اليوم تصميم وتطوير مواقع الويب والتطبيقات بكل سهولة ويسر من خلال هواتفهم الذكية. لقد أصبح بإمكانكم تحويل أفكاركم إلى واقع ملموس، وتقديم خدماتكم ومنتجاتكم للعالم دون قيود.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px',boxShadow:1,p:1}}
          >
            تحتوي هذه التطبيقات على أدوات قوية تمكّن المستخدمين من البرمجة أثناء التنقل، مما يفتح آفاقًا جديدة للتعلم والإبداع. يمكنكم الآن الاستفادة من هذه التكنولوجيا المتقدمة لتعزيز مهاراتكم وتوسيع آفاق أعمالكم. في هذا الدليل، سنستعرض مجموعة من التطبيقات التي تمثل أدوات فعّالة في إنشاء مواقع ويب تجارية مبتكرة، مما يعكس رؤيتنا في تقديم محتوى يساهم في تمكينكم في رحلتكم نحو النجاح.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px' }}
          >
            لنستكشف سويًا كيفية تحويل أفكاركم إلى تطبيقات عملية، ودعونا نبدأ هذه الرحلة المثيرة في عالم تطوير الويب!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default IntroductionSection;

*/


import CustomAccordion from '@common/components/Accordions/CustomAccordion';

import { Box, Typography, Container, Paper } from '@mui/material';
const IntroductionSection = () => {
  
  return (
    <Container maxWidth="md" sx={{ marginY: 4 }}>
      <Paper elevation={24} sx={{ padding: 3 }}>
       <Box sx={{ textAlign:null }}>
    <CustomAccordion />
    </Box>
  </Paper>
</Container>
    );
}
export default IntroductionSection;