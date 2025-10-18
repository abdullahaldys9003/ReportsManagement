import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Dialog,
  Typography,
  Chip,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';

// بيانات وهمية لأنواع البلاغات الرئيسية
const mockMainReportTypes = [
  { id: 1, name: 'بلاغات البنية التحتية' },
  { id: 2, name: 'بلاغات الخدمات البلدية' },
  { id: 3, name: 'بلاغات السلامة العامة' },
  { id: 4, name: 'بلاغات المرور' },
  { id: 5, name: 'بلاغات أخرى' },
];

// بيانات وهمية لأنواع البلاغات الفرعية
const mockSubReportTypes = [
  { id: 1, name: 'أضرار في الطرق', main_type_id: 1 },
  { id: 2, name: 'انقطاع الكهرباء', main_type_id: 1 },
  { id: 3, name: 'تسرب مياه', main_type_id: 1 },
  { id: 4, name: 'جمع النفايات', main_type_id: 2 },
  { id: 5, name: 'تنظيف الشوارع', main_type_id: 2 },
  { id: 6, name: 'صيانة الحدائق', main_type_id: 2 },
  { id: 7, name: 'حرائق', main_type_id: 3 },
  { id: 8, name: 'حوادث', main_type_id: 3 },
  { id: 9, name: 'ازدحام مروري', main_type_id: 4 },
  { id: 10, name: 'حوادث مرورية', main_type_id: 4 },
  { id: 11, name: 'بلاغ عام', main_type_id: 5 },
];

// Hook لجلب أنواع البلاغات الرئيسية (بيانات وهمية)
const useGetMainReportTypes = () => {
  return useQuery({
    queryKey: ['mainReportTypes'],
    queryFn: async () => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMainReportTypes;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لجلب أنواع البلاغات الفرعية (بيانات وهمية)
const useGetSubReportTypes = () => {
  return useQuery({
    queryKey: ['subReportTypes'],
    queryFn: async () => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSubReportTypes;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لإضافة/تعديل/حذف أنواع البلاغات الرئيسية (بيانات وهمية)
const useManageMainReportType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ operation, data, mainTypeId }) => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (operation === "insert") {
        const newId = Math.max(...mockMainReportTypes.map(d => d.id)) + 1;
        const newMainType = { id: newId, name: data.name };
        mockMainReportTypes.push(newMainType);
        return newMainType;
      } else if (operation === "update") {
        const index = mockMainReportTypes.findIndex(d => d.id === mainTypeId);
        if (index !== -1) {
          mockMainReportTypes[index] = { ...mockMainReportTypes[index], name: data.name };
        }
        return mockMainReportTypes[index];
      } else if (operation === "delete") {
        const index = mockMainReportTypes.findIndex(d => d.id === mainTypeId);
        if (index !== -1) {
          mockMainReportTypes.splice(index, 1);
        }
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mainReportTypes'] });
    },
  });
};

// Hook لإضافة/تعديل/حذف أنواع البلاغات الفرعية (بيانات وهمية)
const useManageSubReportType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ operation, data, subTypeId }) => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (operation === "insert") {
        const newId = Math.max(...mockSubReportTypes.map(n => n.id)) + 1;
        const newSubType = { 
          id: newId, 
          name: data.name, 
          main_type_id: data.main_type_id || null 
        };
        mockSubReportTypes.push(newSubType);
        return newSubType;
      } else if (operation === "update") {
        const index = mockSubReportTypes.findIndex(n => n.id === subTypeId);
        if (index !== -1) {
          mockSubReportTypes[index] = { 
            ...mockSubReportTypes[index], 
            name: data.name, 
            main_type_id: data.main_type_id || null 
          };
        }
        return mockSubReportTypes[index];
      } else if (operation === "delete") {
        const index = mockSubReportTypes.findIndex(n => n.id === subTypeId);
        if (index !== -1) {
          mockSubReportTypes.splice(index, 1);
        }
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subReportTypes'] });
    },
  });
};

// المكون الرئيسي لإدارة أنواع البلاغات
const ReportTypesManager = () => {
  const [mainTypeDialogOpen, setMainTypeDialogOpen] = useState(false);
  const [subTypeDialogOpen, setSubTypeDialogOpen] = useState(false);
  const [editingMainType, setEditingMainType] = useState(null);
  const [editingSubType, setEditingSubType] = useState(null);
  const [newMainTypeName, setNewMainTypeName] = useState('');
  const [newSubTypeName, setNewSubTypeName] = useState('');
  const [selectedMainTypeForSubType, setSelectedMainTypeForSubType] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب البيانات
  const { data: mainReportTypes = [], isLoading: isLoadingMainTypes, error: mainTypesError } = useGetMainReportTypes();
  const { data: subReportTypes = [], isLoading: isLoadingSubTypes, error: subTypesError } = useGetSubReportTypes();
  
  // hooks لإدارة أنواع البلاغات
  const { mutateAsync: manageMainType, isPending: isManagingMainType } = useManageMainReportType();
  const { mutateAsync: manageSubType, isPending: isManagingSubType } = useManageSubReportType();

  // معالجة الأخطاء
  useEffect(() => {
    if (mainTypesError) {
      setError(`خطأ في تحميل أنواع البلاغات الرئيسية: ${mainTypesError.message}`);
    } else if (subTypesError) {
      setError(`خطأ في تحميل أنواع البلاغات الفرعية: ${subTypesError.message}`);
    } else {
      setError('');
    }
  }, [mainTypesError, subTypesError]);

  // معالجة فتح/إغلاق حوار النوع الرئيسي
  const handleMainTypeDialogOpen = (mainType = null) => {
    setEditingMainType(mainType);
    setNewMainTypeName(mainType ? mainType.name : '');
    setMainTypeDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleMainTypeDialogClose = () => {
    setMainTypeDialogOpen(false);
    setEditingMainType(null);
    setNewMainTypeName('');
  };

  // معالجة فتح/إغلاق حوار النوع الفرعي
  const handleSubTypeDialogOpen = (subType = null) => {
    setEditingSubType(subType);
    setNewSubTypeName(subType ? subType.name : '');
    setSelectedMainTypeForSubType(subType ? subType.main_type_id : '');
    setSubTypeDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleSubTypeDialogClose = () => {
    setSubTypeDialogOpen(false);
    setEditingSubType(null);
    setNewSubTypeName('');
    setSelectedMainTypeForSubType('');
  };

  // حفظ النوع الرئيسي
  const handleSaveMainType = async () => {
    if (!newMainTypeName.trim()) {
      setError('يرجى إدخال اسم النوع الرئيسي');
      return;
    }

    try {
      const mainTypeData = {
        name: newMainTypeName.trim()
      };

      if (editingMainType) {
        await manageMainType({
          operation: "update",
          data: mainTypeData,
          mainTypeId: editingMainType.id
        });
        setSuccess('تم تعديل النوع الرئيسي بنجاح');
      } else {
        await manageMainType({
          operation: "insert",
          data: mainTypeData
        });
        setSuccess('تم إضافة النوع الرئيسي بنجاح');
      }

      setTimeout(() => {
        setSuccess('');
        handleMainTypeDialogClose();
      }, 1500);
    } catch (err) {
      setError(`خطأ في حفظ النوع الرئيسي: ${err.message}`);
    }
  };

  // حفظ النوع الفرعي
  const handleSaveSubType = async () => {
    if (!newSubTypeName.trim()) {
      setError('يرجى إدخال اسم النوع الفرعي');
      return;
    }

    try {
      const subTypeData = {
        name: newSubTypeName.trim(),
        main_type_id: selectedMainTypeForSubType || null
      };

      if (editingSubType) {
        await manageSubType({
          operation: "update",
          data: subTypeData,
          subTypeId: editingSubType.id
        });
        setSuccess('تم تعديل النوع الفرعي بنجاح');
      } else {
        await manageSubType({
          operation: "insert",
          data: subTypeData
        });
        setSuccess('تم إضافة النوع الفرعي بنجاح');
      }

      setTimeout(() => {
        setSuccess('');
        handleSubTypeDialogClose();
      }, 1500);
    } catch (err) {
      setError(`خطأ في حفظ النوع الفرعي: ${err.message}`);
    }
  };

  // حذف النوع الرئيسي
  const handleDeleteMainType = async (mainType) => {
    // التحقق من وجود أنواع فرعية مرتبطة بهذا النوع الرئيسي
    const relatedSubTypes = subReportTypes.filter(st => st.main_type_id === mainType.id);
    if (relatedSubTypes.length > 0) {
      setError(`لا يمكن حذف هذا النوع الرئيسي لأنه يحتوي على ${relatedSubTypes.length} نوع فرعي مرتبط به`);
      return;
    }

    if (window.confirm(`هل أنت متأكد من حذف النوع الرئيسي "${mainType.name}"؟`)) {
      try {
        await manageMainType({
          operation: "delete",
          mainTypeId: mainType.id
        });
        setSuccess('تم حذف النوع الرئيسي بنجاح');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError(`خطأ في حذف النوع الرئيسي: ${err.message}`);
      }
    }
  };

  // حذف النوع الفرعي
  const handleDeleteSubType = async (subType) => {
    if (window.confirm(`هل أنت متأكد من حذف النوع الفرعي "${subType.name}"؟`)) {
      try {
        await manageSubType({
          operation: "delete",
          subTypeId: subType.id
        });
        setSuccess('تم حذف النوع الفرعي بنجاح');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError(`خطأ في حذف النوع الفرعي: ${err.message}`);
      }
    }
  };

  // عرض رسالة التحميل
  if (isLoadingMainTypes || isLoadingSubTypes) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Typography variant="h4" gutterBottom>
        إدارة أنواع البلاغات
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleMainTypeDialogOpen()}
          disabled={isManagingMainType}
        >
          إضافة نوع رئيسي
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleSubTypeDialogOpen()}
          disabled={isManagingSubType}
        >
          إضافة نوع فرعي
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* عرض الأنواع الرئيسية */}
        <Box sx={{ flex: 1, minWidth: 300, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            الأنواع الرئيسية ({mainReportTypes.length})
          </Typography>
          {mainReportTypes.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              لا توجد أنواع رئيسية مضافة
            </Typography>
          ) : (
            <Stack spacing={1}>
              {mainReportTypes.map(mainType => {
                const subTypesCount = subReportTypes.filter(st => st.main_type_id === mainType.id).length;
                return (
                  <Box key={mainType.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <Box>
                      <Typography>{mainType.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {subTypesCount} نوع فرعي مرتبط
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleMainTypeDialogOpen(mainType)} disabled={isManagingMainType}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteMainType(mainType)} disabled={isManagingMainType}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>

        {/* عرض الأنواع الفرعية */}
        <Box sx={{ flex: 1, minWidth: 300, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            الأنواع الفرعية ({subReportTypes.length})
          </Typography>
          {subReportTypes.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              لا توجد أنواع فرعية مضافة
            </Typography>
          ) : (
            <Stack spacing={1}>
              {subReportTypes.map(subType => {
                const mainType = mainReportTypes.find(d => d.id === subType.main_type_id);
                return (
                  <Box key={subType.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <Box>
                      <Typography>{subType.name}</Typography>
                      {mainType ? (
                        <Typography variant="body2" color="textSecondary">
                          تابع ل: {mainType.name}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          بدون نوع رئيسي
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleSubTypeDialogOpen(subType)} disabled={isManagingSubType}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteSubType(subType)} disabled={isManagingSubType}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      {/* حوار إضافة/تعديل النوع الرئيسي */}
      <Dialog open={mainTypeDialogOpen} onClose={handleMainTypeDialogClose}>
        <DialogTitle>
          {editingMainType ? 'تعديل النوع الرئيسي' : 'إضافة نوع رئيسي جديد'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم النوع الرئيسي"
            fullWidth
            variant="outlined"
            value={newMainTypeName}
            onChange={(e) => setNewMainTypeName(e.target.value)}
            sx={{ mt: 2, minWidth: '300px' }}
            disabled={isManagingMainType}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMainTypeDialogClose} disabled={isManagingMainType}>إلغاء</Button>
          <Button 
            onClick={handleSaveMainType} 
            variant="contained"
            disabled={isManagingMainType || !newMainTypeName.trim()}
          >
            {editingMainType ? 'تعديل' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار إضافة/تعديل النوع الفرعي */}
      <Dialog open={subTypeDialogOpen} onClose={handleSubTypeDialogClose}>
        <DialogTitle>
          {editingSubType ? 'تعديل النوع الفرعي' : 'إضافة نوع فرعي جديد'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم النوع الفرعي"
            fullWidth
            variant="outlined"
            value={newSubTypeName}
            onChange={(e) => setNewSubTypeName(e.target.value)}
            sx={{ mt: 2 }}
            disabled={isManagingSubType}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>النوع الرئيسي</InputLabel>
            <Select
              value={selectedMainTypeForSubType}
              label="النوع الرئيسي"
              onChange={(e) => setSelectedMainTypeForSubType(e.target.value)}
              disabled={isManagingSubType}
            >
              <MenuItem value="">بدون نوع رئيسي</MenuItem>
              {mainReportTypes.map(mainType => (
                <MenuItem key={mainType.id} value={mainType.id}>
                  {mainType.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubTypeDialogClose} disabled={isManagingSubType}>إلغاء</Button>
          <Button 
            onClick={handleSaveSubType} 
            variant="contained"
            disabled={isManagingSubType || !newSubTypeName.trim()}
          >
            {editingSubType ? 'تعديل' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// إنشاء QueryClient
const queryClient = new QueryClient();

// المكون الرئيسي للتطبيق
const ReportTypesManagement = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportTypesManager />
    </QueryClientProvider>
  );
};

export default ReportTypesManagement;