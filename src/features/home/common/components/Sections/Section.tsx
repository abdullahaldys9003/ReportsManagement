import SectionTitle from './SectionTitle';
import React, { useState } from 'react';
import { Box, Typography, Divider, Card, CardContent, Grid, Paper, CardActions, Button } from '@mui/material';

import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5 } from '@fortawesome/free-brands-svg-icons'; 

import IconSwitcher from '@common/components/icons/IconSwitcher';
import { useNavigate } from 'react-router-dom';

const Section = ({items}) => {
  const [active, setActive] = useState(false);
   const navigate = useNavigate();
  const toggleLine = () => {
    setActive(!active);
  };
  
const handleButtonClick = (name) => {
    navigate(`/frontend/${name}`); // استبدل '/new-page' بالمسار المطلوب
  };
  return (
    <>
      <Typography variant="body2" sx={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif' }} />
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {items.map((item, index) => (
            <Grid item xs={12} sm={12} md={6} key={index}>
              <Card sx={{direction: 'rtl', borderLeft: '2px solid #1CC4DB', }} elevation={1}>
                <CardHeader
                  avatar={
                    <Avatar aria-label="language" sx ={{bg :'blue'}}>
                     <IconSwitcher language = {item.name} />
                    </Avatar>
                  }
                  action={null}
                  title={item.name}
                  titleTypographyProps={{ sx: { color: 'white' } }}
                  sx={{ direction: 'ltr' }}
                  subheader={null}
                />
                <CardContent>
                  <Typography variant="body2" sx={{ fontFamily: 'IBM Plex Sans Arabic, sans-serif', textAlign: 'center' }}>
                    HTML (لغة ترميز النص الفائق) هي لغة البرمجة الأساسية المستخدمة لإنشاء صفحات الويب. توفر هيكلًا للصفحات عبر استخدام عناصر مختلفة مثل العناوين والفقرات والروابط. يعتبر فهم HTML خطوة أولى أساسية لأي مطور ويب.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" variant="contained" onClick ={() => handleButtonClick(item.name)}>
                    ابدا الان
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
     </>
  );
};

export default Section;
