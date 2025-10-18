/*
import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/system';

// تعريف نمط مخصص لـ CardMedia
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transition: 'opacity 0.10s ease-in-out',
  borderRadius: 10,
}));

// إنشاء موضوع مخصص لمكونات MUI
const theme = createTheme({
  components: {
    MuiCardMedia: {
      styleOverrides: {
        root: {
          maxWidth: '50%',
          maxHeight: '50%',
        },
      },
    },
  },
});

export default function ProgramSetup({ images, d,name}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  
  const maxSteps = images.length;

  // الدالة للانتقال إلى الخطوة التالية
  const handleNext = () => {
    if (activeStep < maxSteps - 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // الدالة للعودة إلى الخطوة السابقة
  const handleBack = () => {
    if (activeStep > 0) {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  // تحقق إذا كانت الصور موجودة
  if (!images || images.length === 0) {
    return <Typography>No images available.</Typography>;
  }
  
  return (
    <Card sx={null} elevation={10}>
      <CardHeader
        avatar={<Avatar aria-label="recipe">rrr</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={null}
        sx={{ borderBottom: 1 }}
      />
      <CardContent>
        <Grid container spacing={0} sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
          <Grid item xs={12} sm={5} md={6} sx={{ display: 'flex', justifyContent: "center" }}>
            <div>
              <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{ boxShadow: 2, width: 200 }}
                nextButton={
                  <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </Button>
                }
              />
              <Box boxShadow={2} p={1} width={200} display ="flex" justifyContent ="center">
                {images[activeStep]?.id === "termux" ? (
                  d
                ) : (
                  <>
                    <StyledCardMedia
                      component="img"
                      image={images[activeStep]?.src}
                      alt={images[activeStep]?.alt}
                    />
                  </>
                )}
              </Box>
            </div>
          </Grid>

          <Grid item xs={12} sm={5} md={6}>
            <Box boxShadow={2} p={2} my={2}>
              <Typography variant="body1">{images[activeStep].description}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}





*/



import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';

import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/system';

// تعريف نمط مخصص لـ CardMedia
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transition: 'opacity 0.10s ease-in-out',
  borderRadius: 10,
}));

// إنشاء موضوع مخصص لمكونات MUI
const theme = createTheme({
  components: {
    MuiCardMedia: {
      styleOverrides: {
        root: {
          maxWidth: '50%',
          maxHeight: '50%',
        },
      },
    },
  },
});

export default function ProgramSetup({ images}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  
  const maxSteps = images.length;

  // الدالة للانتقال إلى الخطوة التالية
  const handleNext = () => {
    if (activeStep < maxSteps - 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // الدالة للعودة إلى الخطوة السابقة
  const handleBack = () => {
    if (activeStep > 0) {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  // تحقق إذا كانت الصور موجودة
  if (!images || images.length === 0) {
    return <Typography>No images available.</Typography>;
  }
  
  return (
    <Card sx={null} elevation={10}>
      <CardHeader
        avatar={<Avatar aria-label="recipe">rrr</Avatar>}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={null}
        sx={{ borderBottom: 1 }}
      />
      <CardContent>
        <Grid container spacing={0} sx={{ mt: 2, maxHeight: 500, overflow: "auto" }}>
          <Grid item xs={12} sm={5} md={6} sx={{ display: 'flex', justifyContent: "center" }}>
            <div>
              <MobileStepper
                variant="text"
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                sx={{ boxShadow: 2, width: 200 }}
                nextButton={
                  <Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </Button>
                }
              />
              <Box boxShadow={2} p={1} width={200} display ="flex" justifyContent ="center">
                {images[activeStep]?.id === "termux" ? (
                ) : (
                  <>
                    <StyledCardMedia
                      component="img"
                      image={images[activeStep]?.src}
                      alt={images[activeStep]?.alt}
                    />
                  </>
                )}
              </Box>
            </div>
          </Grid>

          <Grid item xs={12} sm={5} md={6}>
            <Box boxShadow={2} p={2} my={2}>
              <Typography variant="body1">{images[activeStep].description}</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}





