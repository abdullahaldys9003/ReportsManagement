import React from 'react';
import { Card, CardContent, Typography, Grid, Chip, Box } from '@mui/material';

const SuspectDetails = ({ suspectData }) => {
  alert(suspectData);
  if (!suspectData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" align="center">
            لا توجد بيانات للمشتبه به
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'warning';
      case 'Closed': return 'success';
      case 'InProgress': return 'info';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardContent>
        {/* المعلومات الشخصية */}
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          البيانات الشخصية
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              الاسم الكامل
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.FullName}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              رقم الهوية الوطنية
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.NationalID}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              رقم الهاتف
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.PhoneNumber}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              العمر
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.Age}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              الجنس
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.Gender}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              الحالة
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.Status}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              العنوان
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.Address}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              المنطقة
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.District}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              الحارة
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {suspectData.Neighborhood}
            </Typography>
          </Grid>
        </Grid>

        {/* معلومات البلاغ */}
        {suspectData.ReportNumber && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
              معلومات البلاغ
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  رقم البلاغ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {suspectData.ReportNumber}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  تاريخ البلاغ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {suspectData.ReportDate}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  نوع البلاغ الرئيسي
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {suspectData.MainReportType}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  النوع الفرعي
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {suspectData.SubType}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  حالة البلاغ
                </Typography>
                <Chip 
                  label={suspectData.ReportStatus}
                  color={getStatusColor(suspectData.ReportStatus)}
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  وصف البلاغ
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {suspectData.ReportDescription}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SuspectDetails;