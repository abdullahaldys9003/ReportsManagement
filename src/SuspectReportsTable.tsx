import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import Box from '@mui/material/Box';
// تعريف نوع البيانات مثل الاستعلام
type ReporterReport = {
  reporter_id: number;
  reporter_name: string;
  phone: string;
  email: string;
  total_reports: number;
  closed_reports: number;
  in_progress_reports: number;
  opened_reports: number;
  districts: string;
  neighborhoods: string;
  last_report_date: string;
};

// بيانات تجريبية (بدلها ببياناتك من الـ API)
const data: ReporterReport[] = [
  {
    reporter_id: 1,
    reporter_name: 'Ahmed Ali',
    phone: '0501234567',
    email: 'ahmed@example.com',
    total_reports: 12,
    closed_reports: 5,
    in_progress_reports: 3,
    opened_reports: 4,
    districts: 'District A, District B',
    neighborhoods: 'Neighborhood 1, Neighborhood 2',
    last_report_date: '2025-09-01',
  },
  {
    reporter_id: 2,
    reporter_name: 'Mona Saleh',
    phone: '0507654321',
    email: 'mona@example.com',
    total_reports: 8,
    closed_reports: 2,
    in_progress_reports: 4,
    opened_reports: 2,
    districts: 'District C',
    neighborhoods: 'Neighborhood 3',
    last_report_date: '2025-08-28',
  },
];

const SuspectReportsTable = () => {
  // تعريف الأعمدة
  const columns = useMemo<MRT_ColumnDef<ReporterReport>[]>(
    () => [
      { accessorKey: 'reporter_id', header: 'Reporter ID', size: 100 },
      { accessorKey: 'reporter_name', header: 'Reporter Name', size: 150 },
      { accessorKey: 'phone', header: 'Phone', size: 150 },
      { accessorKey: 'email', header: 'Email', size: 200 },
      { accessorKey: 'total_reports', header: 'Total Reports', size: 120 },
      { accessorKey: 'closed_reports', header: 'Closed Reports', size: 120 },
      { accessorKey: 'in_progress_reports', header: 'In Progress Reports', size: 150 },
      { accessorKey: 'opened_reports', header: 'Opened Reports', size: 120 },
      { accessorKey: 'districts', header: 'Districts', size: 200 },
      { accessorKey: 'neighborhoods', header: 'Neighborhoods', size: 200 },
      { accessorKey: 'last_report_date', header: 'Last Report Date', size: 150 },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableSorting: true,
    enablePagination: true,
    paginationDisplayMode: 'pages',
  });

  return (
  <Box sx={{ overflow: "auto", maxWidth:{xs:600,sm:800}}}>
    <MaterialReactTable table={table} />
  </Box>
);
};

export default SuspectReportsTable;