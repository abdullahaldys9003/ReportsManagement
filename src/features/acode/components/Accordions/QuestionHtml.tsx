import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Button from '@mui/material/Button';

export default function QuestionHtml() {
  return (
    <div dir="rtl">


      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
<Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '15px', fontFamily: 'Amiri, serif' }}>
  ما هو HTML؟
</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            HTML (لغة توصيف النصوص التشعبية) هي اللغة الأساسية المستخدمة لبناء هيكل صفحات الويب. هي التي تحدد كيف سيتم عرض النصوص والصور والروابط في المتصفح.
          </Typography>
   <Button 
  variant="contained" 
  color="primary" 
  sx={{ fontFamily: 'Amiri, serif', fontSize: '16px', marginTop: '10px' }}
  href="https://www.youtube.com/watch?v=your-video-link" 
  target="_blank"
>
  انقر هنا لمشاهدة الفيديو
</Button>   
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
<Typography 
  variant="h6" 
  sx={{ fontWeight: 'bold', fontSize: '15px', fontFamily: 'Amiri, serif', marginBottom: '10px' }}>
  هل يجب تعلم أي لغة قبل HTML؟
</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            لا يوجد حاجة لتعلم أي لغة برمجة قبل HTML لأنها ليست لغة برمجة بل لغة ترميز. يمكنك البدء بتعلمها مباشرة حتى لو لم تكن لديك خبرة سابقة.
          </Typography>

        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
<Typography 
  variant="h6" 
  sx={{ fontWeight: 'bold', fontSize: '18px', fontFamily: 'Amiri, serif' }}>
  كيف يمكنني كتابة وتشغيل HTML على الهاتف؟
</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            يمكنك استخدام تطبيقات مثل <b>Acode</b>  
            فقط ستحتاج الى هذا التطبيق للبدا في مسارك البرمجي في التعلم 
            ساشرح جميع الخطوات بالاسفل بالتفصيل من البدايه حتى النهاية
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
<Typography 
  variant="h6" 
  sx={{ fontWeight: 'bold', fontSize: '15px', fontFamily: 'Amiri, serif' }}>
 ؟ ماذا تفعل اذا وجدت صعوبة في التثبيت
</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            يمكنك استخدام تطبيقات مثل <b>Acode</b>  
            فقط ستحتاج الى هذا التطبيق للبدا في مسارك البرمجي في التعلم 
            ساشرح جميع الخطوات بالاسفل بالتفصيل من البدايه حتى النهاية
          </Typography>
        </AccordionDetails>
      </Accordion>      
    </div>
  );
}

