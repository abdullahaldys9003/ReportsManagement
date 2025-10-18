
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function CustomAccordion() {
  return (
    <div dir ="rtl">
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography>لماذا البرمجة باستخدام الهاتف؟</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
          قد يعتقد البعض أن البرمجة تتطلب جهاز كمبيوتر قوي، لكن الحقيقة هي أنه يمكنك بدء تعلم البرمجة من هاتفك! الهدف من تعلم البرمجة باستخدام الهاتف هو توفير بيئة مرنة تساعدك على التعلم والتطوير في أي وقت ومكان. العديد من الأدوات التي سنستخدمها هنا مثل Termux تجعل هاتفك يبدو مثل جهاز كمبيوتر صغير في جيبك.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
          مع Termux، يمكنك تشغيل أوامر مشابهة تمامًا لما تستخدمه على الكمبيوتر الشخصي. هذا يمنحك حرية بدء مشاريعك البرمجية حتى لو كنت بعيدًا عن الكمبيوتر. في المستقبل، الانتقال إلى جهاز كمبيوتر سيكون أسهل لأنك قد تعلمت نفس الأدوات بالفعل.
          </Typography>
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
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            البرمجة تتطلب أدوات مثل المحررات النصية وبيئات العمل البرمجية. فيما يلي بعض الأدوات الأساسية التي ستحتاجها:
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>Termux:</b> تطبيق Terminal على هاتفك، يسمح لك بتثبيت واستخدام أدوات البرمجة المختلفة.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>محرر نصوص (Acode أو Sublime Text):</b> ستحتاج إلى محرر نصوص لكتابة أكواد HTML و CSS و JavaScript. هذه المحررات توفر واجهة مريحة وميزات متقدمة للمبرمجين.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>Node.js:</b> لتشغيل JavaScript على الهاتف، تحتاج إلى تثبيت Node.js، وهي بيئة تشغيل JavaScript التي ستساعدك في تنفيذ مشاريعك.
          </Typography>
          <Typography 
            variant="body1" 
            paragraph 
            sx={{ fontFamily: 'Amiri, serif', fontWeight: 400, fontSize: '16px'}}
          >
            <b>Git:</b> لإدارة المشاريع البرمجية ومتابعة التغييرات في الكود بسهولة، ستتعلم استخدام Git وهو أداة أساسية لأي مبرمج.
          </Typography>
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
    </div>
  );
}
