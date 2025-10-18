import { useMemo, useEffect, useState } from 'react';
import { getAllItems, updateItem } from '../api/crudApi.js';
import axios from 'axios';
import TablePropertyItem from '../TablePropertyItem';
import {ho} from "../hosts";
// دالة محسنة لجلب البيانات
const getDataSuspects = async (id = 31) => {
  try {
    const response = await axios.post(
      `http://${ho}:8084`, 
      {id:id},
      // استبدل localhost بالعنوان الصحيح
    { params:{ 
        tableName: "suspects",
        operation: "showById",
        id: id
      }
    },
    );
    
    alert(response.data);
    return response.data;
  } catch (error) {
    alert(error);
    throw error;
  }
};

// دالة لتحويل بيانات المشتبه به إلى مصفوفة للعرض
const formatSuspectData = (suspectData) => {
  if (!suspectData || !suspectData[0]) return [];
  
  return [
    { field: "الاسم الكامل", value: suspectData[0].full_name || "غير محدد", key: "full_name" },
    { field: "معرف المنطقة", value: suspectData[0].districts_id || "غير محدد", key: 'districts_id' },
    { field: "المعرف", value: suspectData[0].id || "غير محدد", key: 'id' },
    { field: "معرف الحي", value: suspectData[0].neighborhoods_id || "غير محدد", key: 'neighborhoods_id' },
    { field: "العمر", value: suspectData[0].age ? suspectData[0].age + " سنة" : "غير محدد", key: "age" },
    { field: "الجنس", value: suspectData[0].gender || "غير محدد", key: "gender" },
    { field: "المحافظة", value: suspectData[0].governorate || "غير محدد", key: "governorate" },
    { field: "المديرية", value: suspectData[0].district || "غير محدد", key: "district" },
    { field: "الحارة", value: suspectData[0].neighborhood || "غير محدد", key: "neighborhood" },
    { field: "العنوان", value: suspectData[0].address || "غير محدد", key: "address" },
    { field: "رقم الهوية", value: suspectData[0].national_id || "غير محدد", key: "national_id" },
    { field: "رقم الهاتف", value: suspectData[0].phone_number || "غير محدد", key: "phone_number" },
    { field: "الحالة", value: suspectData[0].status || "غير محدد", key: "status" },
    { field: "تاريخ الإضافة", value: suspectData[0].created_date ? new Date(suspectData[0].created_date).toLocaleDateString('ar-EG') : "غير محدد", key: "created_date" }
  ];
};

// المكون الرئيسي
const CardWanted = ({ ide = 31 }) => {
  const [suspectData, setSuspectData] = useState([]);
  const [reporterData, setReporterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching data for ID:', ide);
        const data = await getDataSuspects(ide);
        console.log('Fetched data:', data);
        
        setSuspectData(data);
        setReporterData(formatSuspectData(data));
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('فشل في جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ide]);

  if (loading) {
    return <div>جاري تحميل البيانات...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <TablePropertyItem 
        data={reporterData} 
        title="بيانات المشتبه به" 
      />
    </div>
  );
};

export default CardWanted;