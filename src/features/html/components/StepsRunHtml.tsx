import React from 'react';
import ProgramSetup from '@common/components/ProgramSetup/ProgramSetup';




import ProgramsSetupSteps from '@common/components/ProgramSetupSteps.tsx';

import ProgramDownloadButton from '@common/components/ProgramDownload/ProgramDownloadButton';


 import htmlData  from '../services/jsData';


 const steps = htmlData.map((index) => `Step ${index}`); // أو قم بتعريف الخطوات كما تراه مناسبًا


const ProgramSetupItem = React.memo(({ data }) => (
  <ProgramSetup 
    images={data} 
    d={<ProgramDownloadButton program="acode" />}
   name = "html"
  />
));

const StepsRunHtml = () => {
  return (
    <ProgramsSetupSteps steps={steps}>
      {htmlData.map((data, index) => (
        <ProgramSetupItem key={index} data={data} />
      ))}

    </ProgramsSetupSteps>
  );
};

export default StepsRunHtml;
