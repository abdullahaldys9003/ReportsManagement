import React, { useMemo, useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import axios from 'axios';


// Data type definition for a Suspect, matching the database structure
type Suspect = {
  id: number;
  full_name: string;
  phone: string;
  gender: 'ذكر' | 'انثى';
  address: string;
  status: 'Wanted' | 'Arrested' | 'Cleared';
  age: number;
  created_at: string;
  national_id: string;
  district_name: string;
  neighborhood_name: string;
};

// Main component for the suspects table
const SuspectsTable = ({rId}) => {
  alert("jsjs");
  const [suspectsData, setSuspectsData] = useState<Suspect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch suspects data from the server
  const getSuspectsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // URL should point to your main router file (index.php)
      const response = await axios.get('http://127.0.0.1:8084/index.php', {
        params: { tableName: "suspects", operation: "show" }
      });
      if (Array.isArray(response.data)) {
        setSuspectsData(response.data);
      } else {
        setError(response.data.message || "خطأ غير متوقع في البيانات المستلمة");
      }
    } catch (err) {
      console.error("Error fetching suspects data:", err);
      setError("فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch data when the component mounts
  useEffect(() => {
    getSuspectsData();
  }, []);

  // Define table columns with Memoization for performance
  const columns = useMemo<MRT_ColumnDef<Suspect>[]>(
    () => [
      { accessorKey: 'full_name', header: 'الاسم الكامل', size: 200 },
      { accessorKey: 'status', header: 'الحالة', size: 120 },
      { accessorKey: 'national_id', header: 'الرقم الوطني', size: 150 },
      { accessorKey: 'age', header: 'العمر', size: 80 },
      { accessorKey: 'gender', header: 'الجنس', size: 80 },
      { accessorKey: 'phone', header: 'رقم الهاتف', size: 150 },
      { accessorKey: 'address', header: 'العنوان', size: 250 },
      { accessorKey: 'district_name', header: 'المديرية', size: 150 },
      { accessorKey: 'neighborhood_name', header: 'الحي', size: 150 },
      {
        accessorKey: 'created_at',
        header: 'تاريخ الإضافة',
        size: 180,
        Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString('ar-EG'),
      },
    ],
    [],
  );
  
  // Custom theme for Arabic support and styling
  

  const table = useMaterialReactTable({
    columns,
    data: suspectsData,
    enableRtl: true,
    state: {
      isLoading,
      showAlertBanner: error !== null,
    },
    muiToolbarAlertBannerProps: error ? {
        color: 'error',
        children: error,
    } : undefined,
    // Add a container with max-height to enable vertical scrolling
muiTableContainerProps: {
      sx: {
        maxHeight: '600px',
        maxWidth: '800px',
        overflow: 'auto',
      },
    },
  });

  return (

        <MaterialReactTable table={table} />
  
  );
};

export default SuspectsTable;