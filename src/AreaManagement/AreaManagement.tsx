//إدارة الاحياء 
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

// بيانات وهمية للمديريات
const mockDistricts = [
  { id: 1, name: 'مديرية الشيخ عثمان' },
  { id: 2, name: 'مديرية التواهي' },
  { id: 3, name: 'مديرية المنصورة' },
  { id: 4, name: 'مديرية الشيخ عثمان' },
  { id: 5, name: 'مديرية كريتر' },
];

// بيانات وهمية للأحياء
const mockNeighborhoods = [
  { id: 1, name: 'حي النصر', district_id: 1 },
  { id: 2, name: 'حي البريقة', district_id: 1 },
  { id: 3, name: 'حي العشاش', district_id: 2 },
  { id: 4, name: 'حي التواهي', district_id: 2 },
  { id: 5, name: 'حي المنصورة', district_id: 3 },
  { id: 6, name: 'حي الإسكان', district_id: 3 },
  { id: 7, name: 'حي العيدروس', district_id: 4 },
  { id: 8, name: 'حي الصافية', district_id: 4 },
  { id: 9, name: 'حي كريتر', district_id: 5 },
  { id: 10, name: 'حي المعلا', district_id: 5 },
  { id: 11, name: 'حي مستقل (بدون مديرية)', district_id: null },
];

// Hook لجلب المديريات (بيانات وهمية)
const useGetDistricts = () => {
  return useQuery({
    queryKey: ['districts'],
    queryFn: async () => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockDistricts;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لجلب الأحياء (بيانات وهمية)
const useGetNeighborhoods = () => {
  return useQuery({
    queryKey: ['neighborhoods'],
    queryFn: async () => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockNeighborhoods;
    },
    refetchOnWindowFocus: false,
  });
};

// Hook لإضافة/تعديل/حذف المديريات (بيانات وهمية)
const useManageDistrict = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ operation, data, districtId }) => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (operation === "insert") {
        const newId = Math.max(...mockDistricts.map(d => d.id)) + 1;
        const newDistrict = { id: newId, name: data.name };
        mockDistricts.push(newDistrict);
        return newDistrict;
      } else if (operation === "update") {
        const index = mockDistricts.findIndex(d => d.id === districtId);
        if (index !== -1) {
          mockDistricts[index] = { ...mockDistricts[index], name: data.name };
        }
        return mockDistricts[index];
      } else if (operation === "delete") {
        const index = mockDistricts.findIndex(d => d.id === districtId);
        if (index !== -1) {
          mockDistricts.splice(index, 1);
        }
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['districts'] });
    },
  });
};

// Hook لإضافة/تعديل/حذف الأحياء (بيانات وهمية)
const useManageNeighborhood = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ operation, data, neighborhoodId }) => {
      // محاكاة تأخير الشبكة
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (operation === "insert") {
        const newId = Math.max(...mockNeighborhoods.map(n => n.id)) + 1;
        const newNeighborhood = { 
          id: newId, 
          name: data.name, 
          district_id: data.district_id || null 
        };
        mockNeighborhoods.push(newNeighborhood);
        return newNeighborhood;
      } else if (operation === "update") {
        const index = mockNeighborhoods.findIndex(n => n.id === neighborhoodId);
        if (index !== -1) {
          mockNeighborhoods[index] = { 
            ...mockNeighborhoods[index], 
            name: data.name, 
            district_id: data.district_id || null 
          };
        }
        return mockNeighborhoods[index];
      } else if (operation === "delete") {
        const index = mockNeighborhoods.findIndex(n => n.id === neighborhoodId);
        if (index !== -1) {
          mockNeighborhoods.splice(index, 1);
        }
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['neighborhoods'] });
    },
  });
};

// المكون الرئيسي لإدارة المديريات والأحياء
const DistrictsAndNeighborhoodsManager = () => {
  const [districtDialogOpen, setDistrictDialogOpen] = useState(false);
  const [neighborhoodDialogOpen, setNeighborhoodDialogOpen] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [editingNeighborhood, setEditingNeighborhood] = useState(null);
  const [newDistrictName, setNewDistrictName] = useState('');
  const [newNeighborhoodName, setNewNeighborhoodName] = useState('');
  const [selectedDistrictForNeighborhood, setSelectedDistrictForNeighborhood] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // جلب البيانات
  const { data: districts = [], isLoading: isLoadingDistricts, error: districtsError } = useGetDistricts();
  const { data: neighborhoods = [], isLoading: isLoadingNeighborhoods, error: neighborhoodsError } = useGetNeighborhoods();
  
  // hooks لإدارة المديريات والأحياء
  const { mutateAsync: manageDistrict, isPending: isManagingDistrict } = useManageDistrict();
  const { mutateAsync: manageNeighborhood, isPending: isManagingNeighborhood } = useManageNeighborhood();

  // معالجة الأخطاء
  useEffect(() => {
    if (districtsError) {
      setError(`خطأ في تحميل المديريات: ${districtsError.message}`);
    } else if (neighborhoodsError) {
      setError(`خطأ في تحميل الأحياء: ${neighborhoodsError.message}`);
    } else {
      setError('');
    }
  }, [districtsError, neighborhoodsError]);

  // معالجة فتح/إغلاق حوار المديرية
  const handleDistrictDialogOpen = (district = null) => {
    setEditingDistrict(district);
    setNewDistrictName(district ? district.name : '');
    setDistrictDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleDistrictDialogClose = () => {
    setDistrictDialogOpen(false);
    setEditingDistrict(null);
    setNewDistrictName('');
  };

  // معالجة فتح/إغلاق حوار الحي
  const handleNeighborhoodDialogOpen = (neighborhood = null) => {
    setEditingNeighborhood(neighborhood);
    setNewNeighborhoodName(neighborhood ? neighborhood.name : '');
    setSelectedDistrictForNeighborhood(neighborhood ? neighborhood.district_id : '');
    setNeighborhoodDialogOpen(true);
    setError('');
    setSuccess('');
  };

  const handleNeighborhoodDialogClose = () => {
    setNeighborhoodDialogOpen(false);
    setEditingNeighborhood(null);
    setNewNeighborhoodName('');
    setSelectedDistrictForNeighborhood('');
  };

  // حفظ المديرية
  const handleSaveDistrict = async () => {
    if (!newDistrictName.trim()) {
      setError('يرجى إدخال اسم المديرية');
      return;
    }

    try {
      const districtData = {
        name: newDistrictName.trim()
      };

      if (editingDistrict) {
        await manageDistrict({
          operation: "update",
          data: districtData,
          districtId: editingDistrict.id
        });
        setSuccess('تم تعديل المديرية بنجاح');
      } else {
        await manageDistrict({
          operation: "insert",
          data: districtData
        });
        setSuccess('تم إضافة المديرية بنجاح');
      }

      setTimeout(() => {
        setSuccess('');
        handleDistrictDialogClose();
      }, 1500);
    } catch (err) {
      setError(`خطأ في حفظ المديرية: ${err.message}`);
    }
  };

  // حفظ الحي
  const handleSaveNeighborhood = async () => {
    if (!newNeighborhoodName.trim()) {
      setError('يرجى إدخال اسم الحي');
      return;
    }

    try {
      const neighborhoodData = {
        name: newNeighborhoodName.trim(),
        district_id: selectedDistrictForNeighborhood || null
      };

      if (editingNeighborhood) {
        await manageNeighborhood({
          operation: "update",
          data: neighborhoodData,
          neighborhoodId: editingNeighborhood.id
        });
        setSuccess('تم تعديل الحي بنجاح');
      } else {
        await manageNeighborhood({
          operation: "insert",
          data: neighborhoodData
        });
        setSuccess('تم إضافة الحي بنجاح');
      }

      setTimeout(() => {
        setSuccess('');
        handleNeighborhoodDialogClose();
      }, 1500);
    } catch (err) {
      setError(`خطأ في حفظ الحي: ${err.message}`);
    }
  };

  // حذف المديرية
  const handleDeleteDistrict = async (district) => {
    if (window.confirm(`هل أنت متأكد من حذف المديرية "${district.name}"؟`)) {
      try {
        await manageDistrict({
          operation: "delete",
          districtId: district.id
        });
        setSuccess('تم حذف المديرية بنجاح');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError(`خطأ في حذف المديرية: ${err.message}`);
      }
    }
  };

  // حذف الحي
  const handleDeleteNeighborhood = async (neighborhood) => {
    if (window.confirm(`هل أنت متأكد من حذف الحي "${neighborhood.name}"؟`)) {
      try {
        await manageNeighborhood({
          operation: "delete",
          neighborhoodId: neighborhood.id
        });
        setSuccess('تم حذف الحي بنجاح');
        setTimeout(() => setSuccess(''), 2000);
      } catch (err) {
        setError(`خطأ في حذف الحي: ${err.message}`);
      }
    }
  };

  // عرض رسالة التحميل
  if (isLoadingDistricts || isLoadingNeighborhoods) {
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
        إدارة المديريات والأحياء
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleDistrictDialogOpen()}
          disabled={isManagingDistrict}
        >
          إضافة مديرية
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleNeighborhoodDialogOpen()}
          disabled={isManagingNeighborhood}
        >
          إضافة حي
        </Button>
      </Stack>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* عرض المديريات */}
        <Box sx={{ flex: 1, minWidth: 300, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            المديريات ({districts.length})
          </Typography>
          {districts.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              لا توجد مديريات مضافة
            </Typography>
          ) : (
            <Stack spacing={1}>
              {districts.map(district => (
                <Box key={district.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography>{district.name}</Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleDistrictDialogOpen(district)} disabled={isManagingDistrict}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteDistrict(district)} disabled={isManagingDistrict}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Box>

        {/* عرض الأحياء */}
        <Box sx={{ flex: 1, minWidth: 300, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            الأحياء ({neighborhoods.length})
          </Typography>
          {neighborhoods.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              لا توجد أحياء مضافة
            </Typography>
          ) : (
            <Stack spacing={1}>
              {neighborhoods.map(neighborhood => {
                const district = districts.find(d => d.id === neighborhood.district_id);
                return (
                  <Box key={neighborhood.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <Box>
                      <Typography>{neighborhood.name}</Typography>
                      {district ? (
                        <Typography variant="body2" color="textSecondary">
                          تابع ل: {district.name}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          بدون مديرية
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleNeighborhoodDialogOpen(neighborhood)} disabled={isManagingNeighborhood}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteNeighborhood(neighborhood)} disabled={isManagingNeighborhood}>
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

      {/* حوار إضافة/تعديل المديرية */}
      <Dialog open={districtDialogOpen} onClose={handleDistrictDialogClose}>
        <DialogTitle>
          {editingDistrict ? 'تعديل المديرية' : 'إضافة مديرية جديدة'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم المديرية"
            fullWidth
            variant="outlined"
            value={newDistrictName}
            onChange={(e) => setNewDistrictName(e.target.value)}
            sx={{ mt: 2, minWidth: '300px' }}
            disabled={isManagingDistrict}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDistrictDialogClose} disabled={isManagingDistrict}>إلغاء</Button>
          <Button 
            onClick={handleSaveDistrict} 
            variant="contained"
            disabled={isManagingDistrict || !newDistrictName.trim()}
          >
            {editingDistrict ? 'تعديل' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار إضافة/تعديل الحي */}
      <Dialog open={neighborhoodDialogOpen} onClose={handleNeighborhoodDialogClose}>
        <DialogTitle>
          {editingNeighborhood ? 'تعديل الحي' : 'إضافة حي جديد'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="اسم الحي"
            fullWidth
            variant="outlined"
            value={newNeighborhoodName}
            onChange={(e) => setNewNeighborhoodName(e.target.value)}
            sx={{ mt: 2 }}
            disabled={isManagingNeighborhood}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>المديرية (اختياري)</InputLabel>
            <Select
              value={selectedDistrictForNeighborhood}
              label="المديرية (اختياري)"
              onChange={(e) => setSelectedDistrictForNeighborhood(e.target.value)}
              disabled={isManagingNeighborhood}
            >
              <MenuItem value="">بدون مديرية</MenuItem>
              {districts.map(district => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNeighborhoodDialogClose} disabled={isManagingNeighborhood}>إلغاء</Button>
          <Button 
            onClick={handleSaveNeighborhood} 
            variant="contained"
            disabled={isManagingNeighborhood || !newNeighborhoodName.trim()}
          >
            {editingNeighborhood ? 'تعديل' : 'إضافة'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// إنشاء QueryClient
const queryClient = new QueryClient();

// المكون الرئيسي للتطبيق
const AreaManagement = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DistrictsAndNeighborhoodsManager />
    </QueryClientProvider>
  );
};

export default AreaManagement;