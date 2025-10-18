import React from 'react';

import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup.jsx';


import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx';

 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 import vueData  from '../services/vueData';


 const steps = vueData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا


const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />}
   name = "js"
  />
));

const StepsRunVue = ({ name }) => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {vueData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}
    </ProgramsSetupSteps>
  );
};

export default StepsRunVue;
