import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddReports from "./AddReports";
import ReportersReport from "./ReportersReport";
import ReportTypesTable from "./ReportTypesTable";
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

export default function Mr() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* شريط التبويبات في الأعلى */}
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Horizontal tabs example"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >

        <Tab label="Item Seven" {...a11yProps(0)} />
        <Tab label="تقارير حسب النوع" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ReportersReport />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReportTypesTable />
      </TabPanel>
    </Box>
  );
}