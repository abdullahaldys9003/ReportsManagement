import React, { useState } from 'react';

const FieldCorrectionForm = () => {
  const [formData, setFormData] = useState({
    fieldName: '',
    oldValue: '',
    newValue: '',
    errorDescription: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('بيانات التصحيح:', formData);
    // هنا يمكنك إرسال البيانات للخادم
    alert('تم إرسال طلب التصحيح بنجاح');
    
    // إعادة تعيين النموذج
    setFormData({
      fieldName: '',
      oldValue: '',
      newValue: '',
      errorDescription: ''
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
        نموذج تصحيح البيانات
      </h2>
      
      <form onSubmit={handleSubmit}>
        {/* اسم الحقل */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            اسم الحقل *
          </label>
          <input
            type="text"
            name="fieldName"
            value={formData.fieldName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="أدخل اسم الحقل المراد تصحيحه"
          />
        </div>

        {/* القيمة القديمة */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            القيمة القديمة *
          </label>
          <input
            type="text"
            name="oldValue"
            value={formData.oldValue}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: '#f8f8f8'
            }}
            placeholder="القيمة الحالية في النظام"
          />
        </div>

        {/* القيمة الجديدة */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            القيمة الجديدة (المصححة) *
          </label>
          <input
            type="text"
            name="newValue"
            value={formData.newValue}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              backgroundColor: '#f0f8f0'
            }}
            placeholder="أدخل القيمة الصحيحة"
          />
        </div>

        {/* وصف الخطأ */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            وصف الخطأ *
          </label>
          <textarea
            name="errorDescription"
            value={formData.errorDescription}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical'
            }}
            placeholder="اشرح الخطأ الموجود ولماذا تحتاج إلى تصحيحه"
          />
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          إرسال طلب التصحيح
        </button>
      </form>
    </div>
  );
};

export default FieldCorrectionForm;