import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Link, Slide } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);
  const lastElementRef = useRef(null); // مرجع لآخر عنصر في الصفحة
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowFooter(true); // إظهار الفوتر عند الاقتراب من آخر عنصر
        } else {
          setShowFooter(false); // إخفاء الفوتر عند الابتعاد
        }
      },
      { threshold: 0.2 } // يبدأ بالعمل عند ظهور 50% من آخر عنصر
    );
    
    if (lastElementRef.current) {
      observer.observe(lastElementRef.current);
    }
    
    return () => {
      if (lastElementRef.current) {
        observer.unobserve(lastElementRef.current);
      }
    };
  }, []);
  
  return (
    <>
      {/* الفوتر مع تأثير الانزلاق عند ظهوره */}
      <Slide direction="up" in={showFooter} mountOnEnter unmountOnExit>
        
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection :'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            zIndex: 1000,
          }}
        >
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="https://www.facebook.com" color="inherit">
              <FacebookIcon />
            </Link>
            <Link href="https://www.twitter.com" color="inherit">
              <TwitterIcon />
            </Link>
            <Link href="https://t.me/yourchannel" color="inherit">
              <TelegramIcon />
            </Link>
            <Link href="mailto:youremail@example.com" color="inherit">
              <EmailIcon />
            </Link>
            <Link href="https://github.com/yourrepo" color="inherit">
              <GitHubIcon />
            </Link>
          </Box>
          <Typography variant="body1">abdullahabdlazyz9003@gmail.com</Typography>
        </Box>
      </Slide>
      
      {/* محتوى الصفحة مع آخر عنصر */}
      
      <Box sx={{ padding: '20px',mt:7}}>
     <Typography ref={lastElementRef} variant="body1">
        </Typography>
      </Box>
    </>
  );
};

export default Footer;