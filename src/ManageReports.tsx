import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

import AddReports from "./police-department-ui/AddReports";
import DepartmentReportsTable from "./DepartmentReportsTable";
import DisplayNotifications from "./police-department-ui/DisplayNotifications.jsx";

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

export default function ManageReports() {
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
        <Tab label="إضافة البلاغ" {...a11yProps(0)} />
        <Tab label="تقارير البلاغات" {...a11yProps(1)} />
        <Tab
          icon={
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          }
          {...a11yProps(2)}
        />
      </Tabs>

      <TabPanel value={value} index={0}>
        <AddReports />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <DepartmentReportsTable />
      </TabPanel>

      <TabPanel value={value} index={2}>
        <DisplayNotifications />
      </TabPanel>
    </Box>
  );
}