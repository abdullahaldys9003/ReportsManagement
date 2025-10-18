import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Cancel,
  Edit,
  Refresh,
  Warning,
  Schedule,
  DoneAll,
  Block
} from '@mui/icons-material';
import axios from 'axios';
import { ho } from '../hosts';

const ManagerErrorReports = () => {
  const [errorReports, setErrorReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [actionDialog, setActionDialog] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // جلب جميع بلاغات الأخطاء
  const fetchErrorReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${ho}:8084`, {
        params: { 
          tableName: "error_reports", 
          operation: "getErrorReports" 
        }
      });
      setErrorReports(response.data);
    } catch (error) {
      console.error('Error fetching error reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorReports();
  }, []);

  // تصفية البلاغات حسب الحالة
  const filteredReports = errorReports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  // تحديث حالة بلاغ الخطأ
  const updateReportStatus = async (reportId, status, notes = '') => {
    try {
      await axios.post(`http://${ho}:8084`, {
        id: reportId,
        status: status,
        review_notes: notes,
        user_by: 1 // المدير الحالي
      }, {
        params: {
          tableName: "error_reports",
          operation: "updateErrorReportStatus"
        }
      });
      
      fetchErrorReports(); // إعادة تحميل البيانات
      setActionDialog(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // تطبيق التصحيح النهائي
  const applyCorrection = async (reportId) => {
    try {
      await axios.post(`http://${ho}:8084`, {
        id: reportId
      }, {
        params: {
          tableName: "error_reports",
          operation: "correctErrorReport"
        }
      });
      
      fetchErrorReports(); // إعادة تحميل البيانات
      setDetailDialog(false);
    } catch (error) {
      console.error('Error applying correction:', error);
    }
  };

  // تكوين الحالات والألوان
  const statusConfig = {
    reported: { label: 'تم الإبلاغ', color: 'warning', icon: <Warning /> },
    under_review: { label: 'قيد المراجعة', color: 'info', icon: <Schedule /> },
    approved: { label: 'معتمد', color: 'success', icon: <CheckCircle /> },
    rejected: { label: 'مرفوض', color: 'error', icon: <Block /> },
    corrected: { label: 'تم التصحيح', color: 'primary', icon: <DoneAll /> }
  };

  // إحصائيات سريعة
  const stats = {
    total: errorReports.length,
    reported: errorReports.filter(r => r.status === 'reported').length,
    under_review: errorReports.filter(r => r.status === 'under_review').length,
    approved: errorReports.filter(r => r.status === 'approved').length
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* العنوان والإحصائيات */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          لوحة إدارة بلاغات الأخطاء
        </Typography>
      </Box>

      {/* الفلاتر والأزرار */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>فلترة حسب الحالة</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="فلترة حسب الحالة"
            >
              <MenuItem value="all">جميع الحالات</MenuItem>
              <MenuItem value="reported">تم الإبلاغ</MenuItem>
              <MenuItem value="under_review">قيد المراجعة</MenuItem>
              <MenuItem value="approved">معتمد</MenuItem>
              <MenuItem value="rejected">مرفوض</MenuItem>
              <MenuItem value="corrected">تم التصحيح</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchErrorReports}
            disabled={loading}
          >
            تحديث البيانات
          </Button>
        </Box>
      </Paper>

      {/* جدول بلاغات الأخطاء */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>رقم البلاغ</TableCell>
              <TableCell>اسم القسم</TableCell>
              <TableCell>الحقل</TableCell>
              <TableCell>القيمة الحالية</TableCell>
              <TableCell>التصحيح المقترح</TableCell>
              <TableCell>الحالة</TableCell>
              <TableCell>تاريخ الإبلاغ</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id} hover>
                <TableCell>#{report.report_id}</TableCell>
                <TableCell>{report.department_name}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {report.field_label}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={report.current_value}>
                      {report.current_value}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ maxWidth: 200 }}>
                    <Typography variant="body2" noWrap title={report.suggested_correction}>
                      {report.suggested_correction}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={statusConfig[report.status]?.label}
                    color={statusConfig[report.status]?.color}
                    icon={statusConfig[report.status]?.icon}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(report.reported_at).toLocaleDateString('ar-SA')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="عرض التفاصيل">
                      <IconButton
                        color="info"
                        onClick={() => {
                          setSelectedReport(report);
                          setDetailDialog(true);
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>

                    {report.status === 'reported' && (
                      <Tooltip title="بدء المراجعة">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedReport(report);
                            setActionDialog(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    )}

                    {report.status === 'approved' && (
                      <Tooltip title="تطبيق التصحيح">
                        <IconButton
                          color="success"
                          onClick={() => applyCorrection(report.id)}
                        >
                          <CheckCircle />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* نافذة عرض التفاصيل */}
      <Dialog 
        open={detailDialog} 
        onClose={() => setDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          تفاصيل بلاغ الخطأ - #{selectedReport?.report_id}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">الحقل:</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedReport.field_label}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">الحالة:</Typography>
                <Chip
                  label={statusConfig[selectedReport.status]?.label}
                  color={statusConfig[selectedReport.status]?.color}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">القيمة الحالية:</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {selectedReport.current_value}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">التصحيح المقترح:</Typography>
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
                  <Typography variant="body1">
                    {selectedReport.suggested_correction}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">وصف الخطأ:</Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body1">
                    {selectedReport.error_description}
                  </Typography>
                </Paper>
              </Grid>
              {selectedReport.review_notes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">ملاحظات المراجع:</Typography>
                  <Paper sx={{ p: 2, bgcolor: 'info.light', color: 'white' }}>
                    <Typography variant="body1">
                      {selectedReport.review_notes}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)}>إغلاق</Button>
          {selectedReport?.status === 'approved' && (
            <Button 
              variant="contained" 
              color="success"
              onClick={() => applyCorrection(selectedReport.id)}
            >
              تطبيق التصحيح
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* نافذة اتخاذ الإجراء */}
      <Dialog 
        open={actionDialog} 
        onClose={() => setActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          مراجعة بلاغ الخطأ - #{selectedReport?.report_id}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="ملاحظات المراجعة"
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialog(false)}>إلغاء</Button>
          <Button 
            color="error"
            onClick={() => updateReportStatus(selectedReport?.id, 'rejected', reviewNotes)}
          >
            رفض
          </Button>
          <Button 
            color="info"
            onClick={() => updateReportStatus(selectedReport?.id, 'under_review', reviewNotes)}
          >
            قيد المراجعة
          </Button>
          <Button 
            variant="contained" 
            color="success"
            onClick={() => updateReportStatus(selectedReport?.id, 'approved', reviewNotes)}
          >
            اعتماد التصحيح
          </Button>
        </DialogActions>
      </Dialog>

      {loading && (
        <Alert severity="info" sx={{ mt: 2 }}>
          جاري تحميل البيانات...
        </Alert>
      )}
    </Container>
  );
};

export default ManagerErrorReports;