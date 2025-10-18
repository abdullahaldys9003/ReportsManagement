import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CodePreview from '@common/components/Tabs/CodePreview/CodePreview.tsx';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import CardHeaderSection from '../../CardHeaderSection/CardHeaderSection';

import ImageStepper from '../ImageStepper/ImageStepper';
import ImageDisplay from '../../ImageDisplay/ImageDisplay';

//import ImageDescription from '../../ImageDescription/ImageDescription.jsx';



export default function ProgramSetup({ images, d, name }) {

const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  if (!images || images.length === 0) {
    return <Typography>No images available.</Typography>;
  }



  return (
  <>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>انشاء مشروع git hunb من خلال termux</Typography>
        </AccordionSummary>
        <AccordionDetails>
<Card elevation={10}>
  <CardContent>
    <ImageStepper
      images={images}
      activeStep={activeStep}
      handleNext={handleNext}
      handleBack={handleBack}
    />
  <CodePreview explanation={images[activeStep].direction} codeSnippet={images[activeStep].code} output={images[activeStep].output} />
    

  </CardContent>
    </Card>
    </AccordionDetails>
   </Accordion>
      
      
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography>ما هي الأدوات الأساسية التي ستحتاجها؟</Typography>
        </AccordionSummary>
        <AccordionDetails>

        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography>كيف سيجعلك هذا مستعدًا للعمل؟</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            باستخدام الأدوات التي ستتعلمها هنا، ستكون جاهزًا للدخول إلى سوق العمل بمهارات حقيقية. سواء كنت تخطط لتطوير مواقع ويب أو العمل في شركة، ستتعلم نفس الأساليب التي يستخدمها المحترفون.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>بيئة البرمجة الواقعية:</b> باستخدام Termux و Node.js، ستكون بيئتك البرمجية على الهاتف مشابهة تمامًا لما ستستخدمه في بيئات العمل الحقيقية.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>الانتقال السهل للكمبيوتر:</b> بمجرد أن تتقن العمل على الهاتف، سيكون الانتقال إلى العمل على جهاز الكمبيوتر سهلاً جداً لأن الأدوات متشابهة.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>إدارة المشاريع والتعاون:</b> ستتعلم كيفية استخدام Git، وهي أداة شائعة جدًا في الفرق البرمجية لإدارة التعاون في المشاريع. هذا سيساعدك على العمل مع فرق أو حتى إدارة مشاريعك الشخصية بكفاءة.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography>خطوات عملية للبدء</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            لتبدأ برحلتك البرمجية من الهاتف، اتبع هذه الخطوات البسيطة:
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            1. <b>تثبيت Termux:</b> ابدأ بتحميل تطبيق Termux من متجر Google Play ثم فتحه لبدء تثبيت الأدوات.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            2. <b>تثبيت Node.js و npm:</b> استخدم Termux لتثبيت Node.js باستخدام الأوامر المناسبة.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            3. <b>تثبيت محرر النصوص:</b> قم بتحميل وتثبيت Acode أو Sublime Text لاستخدامه في كتابة الأكواد.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            4. <b>إنشاء أول مشروع:</b> ابدأ مشروعك الأول بكتابة كود HTML، CSS، و JavaScript. ثم استخدم Node.js لتشغيله.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </>
  );
}


