import { api } from './crudApi';

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/index.php', credentials, {
      params: {
        tableName: 'auth',
        operation: 'login'
      }
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.user,
        token: response.data.token,
        message: response.data.message
      };
    } else {
      return {
        success: false,
        message: response.data.message || 'بيانات الدخول غير صحيحة'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'حدث خطأ في الاتصال بالخادم'
    };
  }
};

// التحقق من حالة تسجيل الدخول
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// تسجيل الخروج
export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  window.location.href = '/login';
};