import React, { useState, useEffect } from 'react';

const MyCorrectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  // بيانات تجريبية - استبدلها ببيانات حقيقية من API
  const mockData = [
    {
      id: 1,
      fieldName: 'اسم المستخدم',
      oldValue: 'أحمد محمد',
      newValue: 'أحمد محمود',
      errorDescription: 'خطأ في كتابة اسم العائلة',
      status: 'pending',
      priority: 'medium',
      submittedDate: '2024-01-15',
      adminNotes: ''
    },
    {
      id: 2,
      fieldName: 'رقم الهاتف',
      oldValue: '771234567',
      newValue: '771234568',
      errorDescription: 'رقم الهاتف غير صحيح',
      status: 'approved',
      priority: 'high',
      submittedDate: '2024-01-10',
      adminNotes: 'تم التصحيح بنجاح'
    },
    {
      id: 3,
      fieldName: 'البريد الإلكتروني',
      oldValue: 'ahmed@gmail.com',
      newValue: 'ahmed.mohamed@company.com',
      errorDescription: 'البريد الإلكتروني القديم لم يعد مستخدم',
      status: 'rejected',
      priority: 'low',
      submittedDate: '2024-01-05',
      adminNotes: 'يجب تقديم وثيقة تثبت تغيير البريد الإلكتروني'
    }
  ];

  useEffect(() => {
    // محاكاة جلب البيانات من API
    setTimeout(() => {
      setRequests(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'قيد المراجعة';
      case 'approved': return 'مقبول';
      case 'rejected': return 'مرفوض';
      default: return status;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'low': return 'منخفضة';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>جاري تحميل طلبات التصحيح...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#333', margin: 0 }}>طلبات التصحيح الخاصة بي</h2>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontWeight: 'bold' }}>تصفية حسب:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="all">جميع الطلبات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">مقبولة</option>
            <option value="rejected">مرفوضة</option>
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '50px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '18px', color: '#6c757d', marginBottom: '10px' }}>
            لا توجد طلبات تصحيح
          </div>
          <div style={{ color: '#999' }}>
            {filter === 'all' ? 'لم تقم بإرسال أي طلبات تصحيح بعد' : `لا توجد طلبات بحالة ${getStatusText(filter)}`}
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredRequests.map((request) => (
            <div 
              key={request.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
                    {request.fieldName}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    تاريخ الإرسال: {request.submittedDate}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span 
                    style={{
                      padding: '4px 12px',
                      backgroundColor: getStatusColor(request.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getStatusText(request.status)}
                  </span>
                  
                  <span 
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      borderRadius: '20px',
                      fontSize: '12px'
                    }}
                  >
                    أولوية: {getPriorityText(request.priority)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>القيمة القديمة:</div>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '4px',
                    border: '1px solid #e9ecef',
                    fontSize: '14px'
                  }}>
                    {request.oldValue}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>القيمة الجديدة:</div>
                  <div style={{ 
                    padding: '8px', 
                    backgroundColor: '#f0f8f0', 
                    borderRadius: '4px',
                    border: '1px solid #d4edda',
                    fontSize: '14px'
                  }}>
                    {request.newValue}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>وصف الخطأ:</div>
                <div style={{ 
                  padding: '10px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  border: '1px solid #e9ecef',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {request.errorDescription}
                </div>
              </div>

              {request.adminNotes && (
                <div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>ملاحظات المسؤول:</div>
                  <div style={{ 
                    padding: '10px', 
                    backgroundColor: request.status === 'rejected' ? '#f8d7da' : '#d1ecf1',
                    borderRadius: '4px',
                    border: `1px solid ${request.status === 'rejected' ? '#f5c6cb' : '#bee5eb'}`,
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: request.status === 'rejected' ? '#721c24' : '#0c5460'
                  }}>
                    {request.adminNotes}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
        إجمالي الطلبات: {filteredRequests.length} من أصل {requests.length}
      </div>
    </div>
  );
};

export default MyCorrectionRequests;