import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
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

// تعريف نوع المبلغ
type Reporter = {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  address: string;
};

// بيانات وهمية للمبلغين
const initialReporters: Reporter[] = [
  {
    id: '1',
    name: 'أحمد علي',
    phone: '777123456',
    email: 'ahmed@example.com',
    nationalId: '100200300',
    address: 'صنعاء - شارع التحرير',
  },
  {
    id: '2',
    name: 'سارة محمد',
    phone: '733987654',
    email: 'sara@example.com',
    nationalId: '200300400',
    address: 'عدن - كريتر',
  },
  {
    id: '3',
    name: 'محمد حسين',
    phone: '711555444',
    email: 'mohamed@example.com',
    nationalId: '300400500',
    address: 'تعز - المدينة',
  },
];

const ReporterTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  // تعريف أعمدة الجدول
  const columns = useMemo<MRT_ColumnDef<Reporter>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'المعرف',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'name',
        header: 'اسم المبلغ',
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'phone',
        header: 'رقم الهاتف',
        size: 120,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.phone,
          helperText: validationErrors?.phone,
        },
      },
      {
        accessorKey: 'email',
        header: 'البريد الإلكتروني',
        size: 200,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
        },
      },
      {
        accessorKey: 'nationalId',
        header: 'الرقم الوطني',
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.nationalId,
          helperText: validationErrors?.nationalId,
        },
      },
      {
        accessorKey: 'address',
        header: 'العنوان',
        size: 250,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.address,
          helperText: validationErrors?.address,
        },
      },
    ],
    [validationErrors],
  );

  // hook لإنشاء مبلغ
  const { mutateAsync: createReporter, isPending: isCreatingReporter } =
    useCreateReporter();
  
  // hook لقراءة المبلغين
  const {
    data: reporters = [],
    isError: isLoadingReportersError,
    isFetching: isFetchingReporters,
    isLoading: isLoadingReporters,
  } = useGetReporters();
  
  // hook لتحديث المبلغ
  const { mutateAsync: updateReporter, isPending: isUpdatingReporter } =
    useUpdateReporter();
  
  // hook لحذف المبلغ
  const { mutateAsync: deleteReporter, isPending: isDeletingReporter } =
    useDeleteReporter();

  // دالة إنشاء مبلغ جديد
  const handleCreateReporter: MRT_TableOptions<Reporter>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateReporter(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createReporter(values);
    table.setCreatingRow(null);
  };

  // دالة تحديث المبلغ
  const handleSaveReporter: MRT_TableOptions<Reporter>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateReporter(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateReporter(values);
    table.setEditingRow(null);
  };

  // دالة حذف المبلغ
  const openDeleteConfirmModal = (row: MRT_Row<Reporter>) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المبلغ؟')) {
      deleteReporter(row.original.id);
    }
  };

  // تكوين الجدول
  const table = useMaterialReactTable({
    columns,
    data: reporters,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingReportersError
      ? {
          color: 'error',
          children: 'خطأ في تحميل البيانات',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateReporter,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveReporter,
    
    // محتوى نافذة الإنشاء
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">إضافة مبلغ جديد</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => table.setCreatingRow(null)}>إلغاء</Button>
          <Button 
            variant="contained" 
            onClick={() => table.setCreatingRow(null)}
          >
            حفظ
          </Button>
        </DialogActions>
      </>
    ),

    // محتوى نافذة التعديل
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h5">تعديل بيانات المبلغ</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => table.setEditingRow(null)}>إلغاء</Button>
          <Button 
            variant="contained" 
            onClick={() => table.setEditingRow(null)}
          >
            حفظ التعديلات
          </Button>
        </DialogActions>
      </>
    ),

    // أزرار الإجراءات
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="تعديل">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="حذف">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    // زر الإضافة في أعلى الجدول
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        إضافة مبلغ جديد
      </Button>
    ),

    state: {
      isLoading: isLoadingReporters,
      isSaving: isCreatingReporter || isUpdatingReporter || isDeletingReporter,
      showAlertBanner: isLoadingReportersError,
      showProgressBars: isFetchingReporters,
    },
  });

  return <MaterialReactTable table={table} />;
};

// hook لإنشاء مبلغ
function useCreateReporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reporter: Reporter) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newReporterInfo: Reporter) => {
      queryClient.setQueryData(
        ['reporters'],
        (prevReporters: any) =>
          [
            ...prevReporters,
            {
              ...newReporterInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Reporter[],
      );
    },
  });
}

// hook لقراءة المبلغين
function useGetReporters() {
  return useQuery({
    queryKey: ['reporters'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return initialReporters;
    },
    refetchOnWindowFocus: false,
  });
}

// hook للتحديث
function useUpdateReporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reporter: Reporter) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newReporterInfo: Reporter) => {
      queryClient.setQueryData(['reporters'], (prevReporters: any) =>
        prevReporters?.map((prevReporter: Reporter) =>
          prevReporter.id === newReporterInfo.id ? newReporterInfo : prevReporter,
        ),
      );
    },
  });
}

// hook للحذف
function useDeleteReporter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reporterId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (reporterId: string) => {
      queryClient.setQueryData(['reporters'], (prevReporters: any) =>
        prevReporters?.filter((reporter: Reporter) => reporter.id !== reporterId),
      );
    },
  });
}

// دالة التحقق من الصحة
function validateReporter(reporter: Reporter) {
  const errors: Record<string, string> = {};

  if (!reporter.name) errors.name = 'اسم المبلغ مطلوب';
  if (!reporter.phone) errors.phone = 'رقم الهاتف مطلوب';
  if (!reporter.email) errors.email = 'البريد الإلكتروني مطلوب';
  if (!reporter.nationalId) errors.nationalId = 'الرقم الوطني مطلوب';
  if (!reporter.address) errors.address = 'العنوان مطلوب';

  // تحقق من صحة البريد الإلكتروني
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (reporter.email && !emailRegex.test(reporter.email)) {
    errors.email = 'صيغة البريد الإلكتروني غير صحيحة';
  }

  return errors;
}

const queryClient = new QueryClient();

export default function ReportersTable() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReporterTable />
    </QueryClientProvider>
  );
}