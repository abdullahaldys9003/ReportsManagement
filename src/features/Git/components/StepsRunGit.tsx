import React from 'react';

import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup.jsx';
import Box from '@mui/material/Box';

import jsData  from '../services/jsData';


 const steps = jsData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا



const StepsRunGit = () => {
  return (
    <Box sx={{m:4}}>
  <ProgramSetup 
    images={jsData[0]} 
  />
    </Box>
  );
};

export default StepsRunGit;
