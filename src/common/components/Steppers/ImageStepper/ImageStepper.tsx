import React from 'react';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { useTheme } from '@mui/material/styles';

export default function ImageStepper({ images, activeStep, handleNext, handleBack }) {
  const theme = useTheme();
  const maxSteps = images.length;

  return (
    <MobileStepper
      variant="text"
      steps={maxSteps}
      position="static"
      activeStep={activeStep}
      sx={{ boxShadow: 2}}
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
  );
}