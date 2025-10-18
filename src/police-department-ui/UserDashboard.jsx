import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import PoliceDepartmentReports from "./PoliceDepartmentReports.jsx";
import AddReports from './AddReports';
import DisplayNotifications from "./DisplayNotifications.jsx";

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
        <Box sx={{ p: 2 }}>
          <Typography component="div">{children}</Typography>
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

export default function UserDashboard() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      
      {/* Header */}
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 0 }} elevation={1}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: 'center',
          p: 2,
          gap: 2
        }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#333' }}>
            لوحة التحكم
          </Typography>
          
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ minWidth: 120 }}
          >
            تسجيل الخروج
          </Button>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ maxWidth: 'lg', mx: 'auto', px: { xs: 1, sm: 2 } }}>
        <Paper elevation={2} sx={{ width: '100%', borderRadius: 2 }}>
          
          {/* Tabs */}
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                minWidth: { xs: 100, sm: 120 },
                px: { xs: 1, sm: 2 }
              }
            }}
          >
            <Tab label="إضافة البلاغ" {...a11yProps(0)} />
            <Tab label="المهام والإشعارات" {...a11yProps(1)} />
            <Tab label="التقارير" {...a11yProps(2)} />
          </Tabs>

          {/* Tab Content */}
          <Box sx={{ minHeight: '50vh' }}>
            <TabPanel value={value} index={0}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                إضافة بلاغ جديد
              </Typography>
              <AddReports />
            </TabPanel>
            
            <TabPanel value={value} index={1}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                المهام والإشعارات
              </Typography>
              <DisplayNotifications />
            </TabPanel>
            
            <TabPanel value={value} index={2}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                التقارير
              </Typography>
              <PoliceDepartmentReports />
            </TabPanel>
          </Box>
        </Paper>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 3, 
        mt: 4,
        color: '#666',
        borderTop: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="body2">
          نظام الإبلاغ عن الحوادث
        </Typography>
      </Box>
    </Box>
  );
}