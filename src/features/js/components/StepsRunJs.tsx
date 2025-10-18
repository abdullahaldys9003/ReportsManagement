import React from 'react';

import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup.tsx';

import Grid from '@mui/material/Grid';
import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx';

 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 import jsData  from '../services/jsData';


 const steps = jsData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا



const StepsRunJs = () => {
  return (
  <ProgramSetup 
    images={jsData[0]} 
  />
  );
};

export default StepsRunJs;
