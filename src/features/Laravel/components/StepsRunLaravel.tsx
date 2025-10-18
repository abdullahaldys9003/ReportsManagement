import React from 'react';

import ProgramSetup from '@common/components/Steppers/ProgramSetup/ProgramSetup';


import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx';

 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 import pythonData  from '../services/pythonData';


 const steps = pythonData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا


const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />}
   name = "acode"
  />
));

const StepsRunLaravel = ({ name }) => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {pythonData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}
    </ProgramsSetupSteps>
  );
};

export default StepsRunLaravel;
