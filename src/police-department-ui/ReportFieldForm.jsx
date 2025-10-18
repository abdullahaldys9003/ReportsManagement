import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { getNeighborhoodOptions } from "./helps.js";
import SendIcon from '@mui/icons-material/Send';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { createItem, getAllItems } from '../api/crudApi.js';

// دالة جلب البيانات
const getDataReports = async (report_id) => {
  const result = await getAllItems("index.php", {
    tableName: 'reports',
    operation: 'getReportWithDetails',
    id: report_id,
  });
    alert(JSON.stringify(result,null,2));
  return result;
};

// دالة جلب البيانات المساعدة
const getLookupData = async (tableName) => {
  const result = await getAllItems("index.php", {
    tableName: tableName,
    operation: 'show'
  });
  //alert(JSON.stringify(result,null,2));
  return result;
};

export default function DepartmentFeedbackForm({ report_id }) {
  const [mode, setMode] = useState('correction');
  const [submitted, setSubmitted] = useState(false);
  const [dataReports, setDataReports] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // بيانات القوائم المساعدة
  const [mainTypes, setMainTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);

  const [formData, setFormData] = useState({
    field_name: '',
    field_title: '',
    current_value: '',
    suggested_correction: '',
    error_description: '',
    note: '',
    report_id: report_id || ''
  });

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    const fetchData = async () => {
      if (!report_id) return;
      
      setLoading(true);
      try {
        // جلب بيانات البلاغ
        const reportsData = await getDataReports(report_id);
        setDataReports(reportsData);

        // جلب البيانات المساعدة
        const [mainTypesData, subTypesData, districtsData, neighborhoodsData] = await Promise.all([
          getLookupData('report_main_types'),
          getLookupData('report_sub_types'),
          getLookupData('districts'),
          getLookupData('neighborhoods')
        ]);

        setMainTypes(mainTypesData);
        setSubTypes(subTypesData);
        setDistricts(districtsData);
        setNeighborhoods(neighborhoodsData);

      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [report_id]);

  // تحديد إذا كان الحقل يحتاج إلى select
  const getFieldType = (fieldName) => {
    if (!dataReports) return null;

    const selectFields = {
      // الحقول التي تحتاج select مع خياراتها
      'main_type_name': {
        options: mainTypes.map(type =>({ value: type.id, label: type.type_name })),
        label: 'اختر النوع الرئيسي'
      },
      'sub_type_name': {
        options: subTypes.map(type => ({ value: type.id, label: type.sub_type_name })),
        label: 'اختر النوع الفرعي'
      },
      'districts_reports': {
        options: districts.map(district => ({ value: district.id, label: district.name })),
        label: 'اختر المديرية'
      },
      'neighborhoods_reports': {
        options: getNeighborhoodOptions(neighborhoods,dataReports.districts_reports_id),
        label: 'اختر الحي'
      },
      'district_suspect_name': {
        options: districts.map(district => ({ value: district.id, label: district.name })),
        label: 'اختر مديرية المبلغ عنه'
      },
      'neighborhood_suspect_name': {
        options: getNeighborhoodOptions(neighborhoods,dataReports.districts_suspect_id),
        label: 'اختر حي المبلغ عنه'
      },
      'district_reporter_name': {
        options: districts.map(district => ({ value: district.id, label: district.name })),
        label: 'اختر مديرية المبلغ'
      },
      'neighborhood_reporter_name': {
        options: neighborhoods.filter(n => n.district_id === dataReports?.districts_reporter)
          .map(neighborhood => ({ value: neighborhood.id, label: neighborhood.name })),
        label: 'اختر حي المبلغ'
      },

      'gender': {
        options: [
          { value: 'male', label: 'ذكر' },
          { value: 'female', label: 'أنثى' }
        ],
        label: 'اختر الجنس'
      },
    };
    return selectFields[fieldName] || null;
  };

  // قائمة أسماء الحقول المتاحة
  const fieldOptions = [
    // === بيانات البلاغ الأساسية ===
    { value: 'description', label: 'وصف البلاغ', group: 'البلاغ' },
    //{ value: 'status_report', label: 'حالة البلاغ', group: 'البلاغ' },
    { value: 'main_type_name', label: 'نوع البلاغ الرئيسي', group: 'البلاغ' },
    { value: 'sub_type_name', label: 'نوع البلاغ الفرعي', group: 'البلاغ' },
    { value: 'districts_reports', label: 'مديرية البلاغ', group: 'البلاغ' },
    { value: 'neighborhoods_reports', label: 'حي البلاغ', group: 'البلاغ' },
    // === بيانات المبلغ عنه (المشتبه به) ===
    { value: 'suspect_name', label: 'الاسم الكامل', group: 'المبلغ عنه' },
    { value: 'phone', label: 'رقم الهاتف', group: 'المبلغ عنه' },
    { value: 'national_id', label: 'الهوية الوطنية', group: 'المبلغ عنه' },
    { value: 'address', label: 'العنوان', group: 'المبلغ عنه' },
    { value: 'age', label: 'العمر', group: 'المبلغ عنه' },
    { value: 'gender', label: 'الجنس', group: 'المبلغ عنه' },
    { value: 'district_suspect_name', label: 'مديرية المبلغ عنه', group: 'المبلغ عنه' },
    { value: 'neighborhood_suspect_name', label: 'حي المبلغ عنه', group: 'المبلغ عنه' },

    // === بيانات المبلغ ===
    { value: 'name_reporter', label: 'اسم المبلغ', group: 'المبلغ' },
    { value: 'phone_reporter', label: 'هاتف المبلغ', group: 'المبلغ' },
    { value: 'email_reporter', label: 'بريد المبلغ', group: 'المبلغ' },
    { value: 'id_national_reporter', label: 'هوية المبلغ', group: 'المبلغ' },
    { value: 'address_reporter', label: 'عنوان المبلغ', group: 'المبلغ' },
    { value: 'district_reporter_name', label: 'مديرية المبلغ', group: 'المبلغ' },
    { value: 'neighborhood_reporter_name', label: 'حي المبلغ', group: 'المبلغ' },
  ];

  // دالة منفصلة لتغيير الحقل
  const handleFieldChange = (e) => {
    const fieldName = e.target.value;
    alert(fieldName);
    // الحصول على القيمة الحالية من البيانات
    let currentValue = '';
    if (dataReports && dataReports[fieldName]) {
      currentValue = dataReports[fieldName];
    } else {
      currentValue = 'لا توجد بيانات';
    }
    
    setFormData(prev => ({
      ...prev,
      field_name: fieldName,
      current_value: currentValue,
      suggested_correction: '' // مسح التصحيح المقترح عند تغيير الحقل
    }));
  };

  // دالة لتغيير باقي الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // دالة لتغيير التصحيح المقترح (لحقول Select)
  
  const handleSuggestionChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, suggested_correction: value }));
  };

  // تغيير نوع البلاغ (ملاحظة / خطأ)
  const handleModeChange = (event, newMode) => {
    if (newMode) setMode(newMode);
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!report_id) {
      alert('❌ يرجى التأكد من وجود رقم البلاغ');
      return;
    }

    let payload = {
      report_id: report_id,
      department_id: 1,
      user_by: 2,
      status: 'reported'
    };

    if (mode === 'correction') {
      payload = {
        ...payload,
        type: 'correction',
        field_name: formData.field_name,
        field_label: fieldOptions.find(f => f.value === formData.field_name)?.label || '',
        current_value: formData.current_value,
        suggested_correction: formData.suggested_correction,
        error_description: formData.error_description,
        field_title: formData.field_title,
      };
    } else {
      payload = {
        ...payload,
        type: 'note',
        note: formData.note,
      };
    }

    try {
      const params = { tableName: "error_reports", operation: "addErrorReport" };
      await createItem(payload, "index.php", params);

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          field_name: '',
          field_title: '',
          current_value: '',
          suggested_correction: '',
          error_description: '',
          note: '',
          report_id: report_id
        });
      }, 3000);

    } catch (error) {
      console.error('❌ فشل في إرسال البيانات:', error);
      alert('❌ فشل في الإرسال');
    }
  };

  // الحصول على نوع الحقل المحدد
  const selectedFieldType = getFieldType(formData.field_name);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* عنوان */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          {mode === 'correction' ? (
            <ReportProblemIcon color="warning" />
          ) : (
            <NoteAltIcon color="info" />
          )}
          <Typography variant="h4" component="h1">
            {mode === 'correction' ? "طلب تصحيح بيانات" : "إرسال ملاحظة عامة"}
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          البلاغ رقم: <strong>#{report_id}</strong>
        </Typography>

        {/* عرض حالة التحميل */}
        {loading && (
          <Alert severity="info" sx={{ mb: 3 }}>
            جاري تحميل بيانات البلاغ...
          </Alert>
        )}

        {/* اختيار النوع */}
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          sx={{ mb: 3 }}
        >
          <ToggleButton value="correction">تصحيح خطأ</ToggleButton>
          <ToggleButton value="note">ملاحظة عامة</ToggleButton>
        </ToggleButtonGroup>

        {/* رسالة نجاح */}
        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ✅ تم إرسال الطلب بنجاح!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {mode === 'correction' && (
              <>
                {/* اختيار الحقل */}
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>الحقل الذي به خطأ</InputLabel>
                    <Select
                      name="field_name"
                      value={formData.field_name}
                      onChange={handleFieldChange}
                      label="الحقل الذي به خطأ"
                      disabled={loading}
                    >
                      {fieldOptions.map(field => (
                        <MenuItem key={field.value} value={field.value}>
                          {field.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* عنوان الحقل */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="عنوان الملاحظة (اختياري)"
                    name="field_title"
                    value={formData.field_title}
                    onChange={handleChange}
                    placeholder="مثال: خطأ في الاسم"
                  />
                </Grid>

                {/* القيمة الحالية (تظهر تلقائياً) */}
                {formData.field_name && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="القيمة الحالية في النظام"
                      value={formData.current_value}
                      multiline
                      rows={2}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          backgroundColor: 'grey.100',
                        }
                      }}
                      helperText="هذه القيمة الحالية في النظام (غير قابلة للتعديل)"
                    />
                  </Grid>
                )}

                {/* التصحيح المقترح - حقل Select ديناميكي */}
                {formData.field_name && selectedFieldType ? (
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>{selectedFieldType.label}</InputLabel>
                      <Select
                        value={formData.suggested_correction}
                        onChange={handleSuggestionChange}
                        label={selectedFieldType.label}
                      >
                        {selectedFieldType.options.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                ) : (
                  // التصحيح المقترح - حقل نصي عادي
                  formData.field_name && (
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        label="التصحيح المقترح"
                        name="suggested_correction"
                        value={formData.suggested_correction}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        placeholder="أدخل القيمة الصحيحة التي تقترحها"
                      />
                    </Grid>
                  )
                )}

                {/* وصف الخطأ */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="وصف الخطأ"
                    name="error_description"
                    value={formData.error_description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="اشرح طبيعة الخطأ ولماذا يحتاج إلى تصحيح..."
                  />
                </Grid>
              </>
            )}

            {mode === 'note' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="الملاحظة"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="أدخل ملاحظتك هنا..."
                />
              </Grid>
            )}

            {/* زر الإرسال */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color={mode === 'correction' ? "warning" : "info"}
                startIcon={<SendIcon />}
                size="large"
                fullWidth
                disabled={mode === 'correction' ? 
                  !formData.field_name || !formData.suggested_correction || !formData.error_description : 
                  !formData.note
                }
              >
                {mode === 'correction' ? "إرسال طلب تصحيح" : "إرسال الملاحظة"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}