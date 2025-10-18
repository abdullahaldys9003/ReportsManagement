import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import ManagementR from "./ManagementR";
import ManagementS from "./ManagementS";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`horizontal-tabpanel-${index}`}
      aria-labelledby={`horizontal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `horizontal-tab-${index}`,
    'aria-controls': `horizontal-tabpanel-${index}`,
  };
}

export default function TabSR() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* شريط التبويبات */}
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="بيانات المبلغين" {...a11yProps(0)} />
        <Tab label="بيانات المشتبه بهم" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <ManagementR />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ManagementS />
      </TabPanel>
    </Box>
  );
}