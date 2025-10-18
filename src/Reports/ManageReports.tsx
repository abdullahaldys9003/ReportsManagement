import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddReports from "./AddReports";

import ReporterTable from "./ReporterTable";
import SuspectReportsTable from "./SuspectReportsTable";

import ReportTypesManagement from "./AddNewReports/ReportTypesManagement";
import DepartmentReportsTable from "./DepartmentReportsTable";
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
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

function a11yProps(index: number) {
  return {
    id: `horizontal-tab-${index}`,
    'aria-controls': `horizontal-tabpanel-${index}`,
  };
}

export default function ManageReports() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* شريط التبويبات في الأعلى */}
<Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto">
  <Tab label="إضافة البلاغ" {...a11yProps(0)} />
  <Tab label="تقارير البلاغات" {...a11yProps(1)} />
  <Tab label="تقارير عن المشتبهه" {...a11yProps(2)} />
  <Tab label="المشتبهين" {...a11yProps(3)} />
  <Tab label="إضافة انواع جديدة" {...a11yProps(4)} />
</Tabs>

<TabPanel value={value} index={0}>
  <AddReports />
</TabPanel>

<TabPanel value={value} index={1}>
  <DepartmentReportsTable />
</TabPanel>

<TabPanel value={value} index={2}>
  <SuspectReportsTable />
</TabPanel>



<TabPanel value={value} index={4}>
  <ReportTypesManagement />
</TabPanel>
    </Box>
  );
}