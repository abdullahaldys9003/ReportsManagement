import ProgramSetup from '../../../common/components/Steppers/ProgramSetup/ProgramSetup.jsx';
import React from 'react';

import ProgramsSetupSteps from '../../../common/components/ProgramSetupSteps.tsx'; // تأكد من مسار الاستيراد
// import DownloadProgramButton from '../uploadAcode.tsx';
 import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';
 
 
 import cssData  from '../services/cssData';

 const steps = cssData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا
 
const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />}
   name = "css"
  />
));

const StepsRunCss = ({ name }) => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {cssData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}
    </ProgramsSetupSteps>
  );
};

export default StepsRunCss;
