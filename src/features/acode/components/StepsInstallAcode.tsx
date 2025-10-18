import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup.jsx';

import React from 'react';
import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx'; 

 
 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 
 import htmlData  from '../services/htmlData';



 const steps = htmlData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا
 

const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />} 
    name ="html"
  />
));


const StepsInstallAcode = () => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {htmlData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}
    </ProgramsSetupSteps>
  );
};


export default StepsInstallAcode;

