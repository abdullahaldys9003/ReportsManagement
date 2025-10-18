import Section from '../../common/components/Sections/Section.tsx';

import SectionTitle from '../../common/components/Sections/SectionTitle.tsx';

 import Paper from '@mui/material/Paper';
  import Box from '@mui/material/Box';
import FrontendBasics from './FrontendBasics.tsx';

const frontendLanguages = [ {name:'html'}, {name:'css'}, {name :'JavaScript'}, {name :'react'}];

const FrontendSection = () => {
  return (
    <>
    <Box sx={{ mb: 4 }}>
      <SectionTitle title = "Frontend Technologies" />
      <Paper elevation={24} sx={{ p: 2}}>
            <FrontendBasics />
         <Section items={frontendLanguages} />
      </Paper>
    </Box>
    </>

  )
}

export default FrontendSection;