import * as React from 'react';
import { Stepper, Step, StepLabel, StepIcon, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHtml5, faCss3Alt, faJsSquare } from '@fortawesome/free-brands-svg-icons';

export default function FrontendBasics() {
  const steps = [
    { icon: <FontAwesomeIcon icon={faHtml5} size="2x" style={{ color: 'white' }} />, label: 'HTML5' },
    { icon: <FontAwesomeIcon icon={faCss3Alt} size="2x" style={{ color: 'white' }} />, label: 'CSS3' },
    { icon: <FontAwesomeIcon icon={faJsSquare} size="2x" style={{ color: 'white' }} />, label: 'JavaScript' },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel
              StepIconComponent={() => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius:2}}>
                  {step.icon}
                </Box>
              )}
            />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}