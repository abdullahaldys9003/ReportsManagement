import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ViewCheckpointTasks from "./ViewCheckpointTasks";
import CheckWanted from "./CheckWanted";
export default function PointsInterface() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
       <Tab label="عرض المهام" value="1" />
       <Tab label="التحقق" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
        <ViewCheckpointTasks />
        </TabPanel>
        <TabPanel value="2">
        <CheckWanted />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
