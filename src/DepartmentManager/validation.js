// validation.js - ملف منفصل للتحقق من المدخلات

export const validateEmployeeInput = (data, isEdit = false) => {
  const errors = {};

  // التحقق من اسم الموظف
  if (!data.name_full || data.name_full.trim() === '') {
    errors.name_full = 'اسم الموظف مطلوب';
  } else if (data.name_full.length < 2) {
    errors.name_full = 'اسم الموظف يجب أن يكون على الأقل حرفين';
  }

  // التحقق من اسم المستخدم
  if (!data.username || data.username.trim() === '') {
    errors.username = 'اسم المستخدم مطلوب';
  } else if (data.username.length < 3) {
    errors.username = 'اسم المستخدم يجب أن يكون على الأقل 3 أحرف';
  }

  // التحقق من كلمة السر (غير مطلوبة في حالة التعديل إذا لم يتم تغييرها)
  if (!isEdit || data.password) {
    if (!data.password || data.password.trim() === '') {
      errors.password = 'كلمة السر مطلوبة';
    } else if (data.password.length < 6) {
      errors.password = 'كلمة السر يجب أن تكون على الأقل 6 أحرف';
    }
  }

  // التحقق من البريد الإلكتروني
  if (!data.email || data.email.trim() === '') {
    errors.email = 'البريد الإلكتروني مطلوب';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'صيغة البريد الإلكتروني غير صحيحة';
    }
  }

  // التحقق من رقم الهاتف
  if (!data.number_phone || data.number_phone.trim() === '') {
    errors.number_phone = 'رقم الهاتف مطلوب';
  } else {
    const phoneRegex = /^[\+]?[0-9]{8,15}$/;
    if (!phoneRegex.test(data.number_phone.replace(/\s/g, ''))) {
      errors.number_phone = 'رقم الهاتف غير صحيح';
    }
  }

  // التحقق من الدور
  if (!data.position_type || data.position_type.trim() === '') {
    errors.position_type = 'الدور مطلوب';
  }

  // التحقق من القسم
  if (!data.department_id || data.department_id === '') {
    errors.department_id = 'القسم مطلوب';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateEmployeeOnSubmit = (data, isEdit = false) => {
  return validateEmployeeInput(data, isEdit);
};