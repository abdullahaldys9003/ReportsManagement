import { lazy, Suspense, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
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

// تعريف نوع User
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
};

// بيانات وهمية للمستخدمين
const fakeData: User[] = [
  {
    id: '1',
    firstName: 'أحمد',
    lastName: 'علي',
    email: 'ahmed.ali@example.com',
    state: 'القاهرة',
  },
  {
    id: '2',
    firstName: 'محمد',
    lastName: 'عمر',
    email: 'mohamed.omar@example.com',
    state: 'الإسكندرية',
  },
  {
    id: '3',
    firstName: 'فاطمة',
    lastName: 'إبراهيم',
    email: 'fatima.ibrahim@example.com',
    state: 'الجيزة',
  },
  {
    id: '4',
    firstName: 'سارة',
    lastName: 'مصطفى',
    email: 'sara.mostafa@example.com',
    state: 'المنصورة',
  },
  {
    id: '5',
    firstName: 'يوسف',
    lastName: 'خالد',
    email: 'youssef.khaled@example.com',
    state: 'أسوان',
  },
];

// قائمة المحافظات/الولايات
const usStates = [
  'القاهرة',
  'الإسكندرية',
  'الجيزة',
  'المنصورة',
  'أسوان',
  'الأقصر',
  'أسوان',
  'بورسعيد',
  'السويس',
  'دمياط',
];

const Example = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'المعرف',
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: 'firstName',
        header: 'الاسم الأول',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'الاسم الأخير',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'البريد الإلكتروني',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        header: 'المحافظة',
        editVariant: 'select',
        editSelectOptions: usStates,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUser();

  //CREATE action
  const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createUser(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<User>) => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
      deleteUser(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'خطأ في تحميل البيانات',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
       /* minHeight: '500px',*/
       width:700,
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">إضافة مستخدم جديد</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">تعديل المستخدم</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
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
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        إضافة مستخدم جديد
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new user to api)
function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(
        ['users'],
        (prevUsers: any) =>
          [
            ...prevUsers,
            {
              ...newUserInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as User[],
      );
    },
  });
}

//READ hook (get users from api)
function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: User) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (newUserInfo: User) => {
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.map((prevUser: User) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
  });
}

//DELETE hook (delete user in api)
function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevUsers: any) =>
        prevUsers?.filter((user: User) => user.id !== userId),
      );
    },
  });
}

const queryClient = new QueryClient();

export default function AddAlerts() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\.,;:\s@"]+(\.[^<>()[\]\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateUser(user: User) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'الاسم الأول مطلوب'
      : '',
    lastName: !validateRequired(user.lastName) ? 'الاسم الأخير مطلوب' : '',
    email: !validateEmail(user.email) ? 'صيغة البريد الإلكتروني غير صحيحة' : '',
  };
}