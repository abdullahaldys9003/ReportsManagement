import * as React from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import {ho} from "../hosts";
// الثوابت - تأكد من تعيين القيمة الصحيحة لـ hoك
import SuspectDetails from "./SuspectDetails";
const getDataSuspects = async (id) => {
  try {
    const response = await axios.post(
      `http://${ho}:8084`,
      { national_id: id },
      {
        params: {
          tableName: "suspects",
          operation: "getSuspectByCard",
          id: id
        }
      }
    );
    alert(response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

function MyFormHelperText() {
  const { focused } = useFormControl() || {};

  const helperText = React.useMemo(() => {
    if (focused) {
      return 'يرجى إدخال رقم البطاقة للتحقق';
    }
    return 'أدخل رقم البطاقة الوطنية';
  }, [focused]);

  return <FormHelperText>{helperText}</FormHelperText>;
}

export default function CheckWanted() {
  const [id, setId] = React.useState('');
  const [suspectData, setSuspectData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleInputChange = (event) => {
    setId(event.target.value);
    // مسح البيانات السابقة عند تغيير الإدخال
    if (suspectData || error) {
      setSuspectData(null);
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!id.trim()) {
      setError('يرجى إدخال رقم البطاقة');
      return;
    }

    setLoading(true);
    setError('');
    setSuspectData(null);

    try {
      const data = await getDataSuspects(id);
      setSuspectData(data);
      alert(data.id);
    } catch (err) {
      setError('فشل في جلب البيانات. يرجى المحاولة مرة أخرى.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setId('');
    setSuspectData(null);
    setError('');
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', p: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        نظام التحقق من المطلوبين
      </Typography>
      
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <FormControl sx={{ width: '100%', mb: 2 }}>
          <OutlinedInput
            placeholder="أدخل رقم البطاقة الوطنية"
            value={id}
            onChange={handleInputChange}
            disabled={loading}
          />
          <MyFormHelperText />
        </FormControl>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !id.trim()}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'تحقق'}
          </Button>
          
          <Button
            type="button"
            variant="outlined"
            onClick={handleReset}
            disabled={loading}
            fullWidth
          >
            مسح
          </Button>
        </Box>
      </form>

      {/* عرض حالة التحميل */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
          <Typography sx={{ ml: 1 }}>جاري التحقق...</Typography>
        </Box>
      )}

      {/* عرض الأخطاء */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* عرض بيانات المطلوب */}
      {suspectData && (
        <Box sx={{ mt: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            نتائج التحقق:
          </Typography>
          
          {suspectData.length === 0 ? (
            <Alert severity="success">
              لا توجد بيانات مطلوبين لهذا الرقم
            </Alert>
          ) : (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                ⚠️ تم العثور على بيانات مطلوب
              </Alert>
              <Box>
              <Box>
              <SuspectDetails suspectData={suspectData} />
              </Box>
              {}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {/* عرض حالة عدم وجود بيانات بعد البحث */}
      {suspectData && suspectData.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
            ✓ الرقم غير مسجل في قائمة المطلوبين
        </Alert>
      )}
    </Box>
  );
}