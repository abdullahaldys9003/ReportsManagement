import { getAllItems } from "../api/crudApi.js";
import React, { useEffect, useMemo, useState } from 'react';

const SuspectsTable = () => {
  const [suspectsData, setSuspectsData] = useState([]);

  const getSuspectsData = async () => {
    try {
      const params = { tableName: 'suspects', operation: 'show' }
      const response = await getAllItems("index.php", params);
      
      // ✅ تم تصحيح الخطأ هنا
      if (response) {
        setSuspectsData(response.data);
      } else {
        alert("تحقق من الشيكة");
      }
    } catch (err) {
      console.error("حدث خطأ:", err);
      alert("حدث خطأ في جلب البيانات");
    }
  }

  // ✅ إضافة useEffect لاستدعاء الدالة
  useEffect(() => {
    getSuspectsData();
  }, []);

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h2>الرسائل</h2>
      </div>
      {/* ✅ إضافة عرض البيانات */}
      <div>
        {suspectsData.map((suspect, index) => (
          <div key={index}>
            {JSON.stringify(suspect)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuspectsTable;