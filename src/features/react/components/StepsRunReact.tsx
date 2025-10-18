import React from 'react';

import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup.jsx';


import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx';

 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 import reactData  from '../services/reactData';


 const steps = reactData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا


const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />}
   name = "js"
  />
));

const StepsRunReact = ({ name }) => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {reactData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}
    </ProgramsSetupSteps>
  );
};

export default StepsRunReact;
