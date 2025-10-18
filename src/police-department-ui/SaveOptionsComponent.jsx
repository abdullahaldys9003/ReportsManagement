import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { Save, Send, RateReview, LocationOn } from '@mui/icons-material';

// مكون خيارات الحفظ المبسط
const SaveOptionsComponent = ({ onSave, isSaving = false }) => {
  const [saveOption, setSaveOption] = useState('');

  const saveOptions = [
    {
      value: 'direct',
      label: 'رفع مباشر إلى الإدارة',
      icon: <Send fontSize="small" />
    },
    {
      value: 'review', 
      label: 'وضعه تحت المراجعة',
      icon: <RateReview fontSize="small" />
    },
    {
      value: 'local',
      label: 'حفظ محليًا',
      icon: <LocationOn fontSize="small" />
    }
  ];

  const handleSave = () => {
    if (!saveOption) return;
    onSave(saveOption);
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>اختر طريقة الحفظ</InputLabel>
        <Select
          value={saveOption}
          onChange={(e) => setSaveOption(e.target.value)}
          label="اختر طريقة الحفظ"
        >
          {saveOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon}
                {option.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={handleSave}
        disabled={!saveOption || isSaving}
        size="small"
      >
        {isSaving ? 'جاري الحفظ...' : 'حفظ'}
      </Button>
    </Box>
  );
};

// دالة التعامل مع الحفظ
export const handleSaveReport = async (saveOption, reportData) => {
  const dataWithOption = {
    ...reportData,
    save_option: saveOption,
    status: getStatusByOption(saveOption),
    save_timestamp: new Date().toISOString()
  };

  try {
    const response = await axios.post(`http://${ho}:8084`, dataWithOption, {
      params: { 
        tableName: "reports", 
        operation: "insert" 
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// تحديد الحالة حسب الخيار
const getStatusByOption = (option) => {
  const statusMap = {
    'direct': 'submitted_to_management',
    'review': 'under_review', 
    'local': 'local_saved'
  };
  return statusMap[option] || 'draft';
};

export default SaveOptionsComponent;