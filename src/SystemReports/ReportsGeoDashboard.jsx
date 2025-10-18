import React, { useState, useEffect } from 'react';

const ReportsGeoDashboard = () => {
  // حالة لتخزين بيانات التقرير
  const [reportData, setReportData] = useState([]);
  // حالة لإدارة التحميل
  const [isLoading, setIsLoading] = useState(true);
  // حالة لإدارة الأخطاء
  const [error, setError] = useState(null);

  // محاكاة جلب البيانات من API (ستستبدل هذا بـ fetch أو axios حقيقي)
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        // استبدل هذا الرابط بوصلة API الخاصة بك
        // const response = await fetch('/api/geographic-reports');
        // const data = await response.json();
        
        // محاكاة بيانات وهمية للتوضيح
        const mockData = [
          {
            "المحافظة": "عدن",
            "المديرية": "المنصورة",
            "الحي": "الشيخ عبدالله",
            "عدد البلاغات": 15,
            "أنواع البلاغات": "انقطاع المياه، انقطاع الكهرباء"
          },
          {
            "المحافظة": "عدن",
            "المديرية": "دار سعد",
            "الحي": "المنتزه",
            "عدد البلاغات": 8,
            "أنواع البلاغات": "أضرار في الطرق"
          }
        ];
        setReportData(mockData);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []); // مصفوفة الاعتمادات الفارغة تعني أن هذا effect يعمل مرة واحدة عند التmontage

  if (isLoading) return <div className="text-center py-8">جاري تحميل البيانات...</div>;
  if (error) return <div className="text-center py-8 text-red-500">خطأ: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-right">تقرير إحصائي للبلاغات حسب المناطق</h2>
      
      {/* جدول لعرض البيانات */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-right">المحافظة</th>
              <th className="py-3 px-4 border-b text-right">المديرية</th>
              <th className="py-3 px-4 border-b text-right">الحي</th>
              <th className="py-3 px-4 border-b text-right">عدد البلاغات</th>
              <th className="py-3 px-4 border-b text-right">أنواع البلاغات</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b text-right">{item['المحافظة']}</td>
                <td className="py-3 px-4 border-b text-right">{item['المديرية']}</td>
                <td className="py-3 px-4 border-b text-right">{item['الحي']}</td>
                <td className="py-3 px-4 border-b text-right font-medium">{item['عدد البلاغات']}</td>
                <td className="py-3 px-4 border-b text-right">{item['أنواع البلاغات']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* يمكنك إضافة مخططات Chart.js أو D3.js هنا لاحقًا لعرض مرئيات بيانية */}
      
    </div>
  );
};

export default ReportsGeoDashboard;