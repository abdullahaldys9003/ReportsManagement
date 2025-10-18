import React, { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import ImageDescription from '../../ImageDescription/ImageDescription.jsx';

export default function CodePreview ({explanation,codeSnippet,output}) {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  return (
    <Box sx={{ width: "100%", typography: "body1", mt: 2 }}>
      {/* التبويبات */}
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="الشرح" />
        <Tab label="الكود" />
        <Tab label="المخرج" />
      </Tabs>

      <Box sx={{ p: 3 }}>
        {tabValue === 0 && (
       <ImageDescription description={explanation} />
        )}
        {tabValue === 1 && (
<Box
  sx={{
    backgroundColor: '#f5f5f5',
    borderRadius: 1,
    padding: 2,
    fontFamily: 'monospace',
    whiteSpace: 'pre-line',
    overflow: 'auto',
    boxShadow: 1,
    direction: 'ltr', // إضافة هذا لضمان اتجاه الكتابة من اليسار لليمين
  }}
>
  {codeSnippet}
</Box>
        )}
        {tabValue === 2 && (
         <ImageDescription description={output} />
        )}
      </Box>
    </Box>
  );
}
