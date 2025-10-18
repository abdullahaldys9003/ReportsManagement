import React from 'react';

import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup.jsx';


import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx';

 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 import bootstrapData  from '../services/bootstrapData';


 const steps = bootstrapData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا


const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />}
   name = "js"
  />
));

const StepsRunBootstrap = ({ name }) => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {bootstrapData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}
    </ProgramsSetupSteps>
  );
};

export default StepsRunBootstrap;
