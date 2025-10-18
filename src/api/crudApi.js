// src/api/personApi.js
import axios from 'axios';
/*
const api = axios.create({
  baseURL: 'http://127.0.0.1:8081'
});
*/
/*
const api = axios.create({
  baseURL: 'http://127.0.0.1:8084'
});
*/
/*
const api = axios.create({
  baseURL: `${window.location.origin}/code/index.php`,
});
*/

const fullOrigin = window.location.origin; // "http://10.1.10.1:5173"

// إزالة البروتوكول والبوابة للحصول على IP فقط
const ipOnly = fullOrigin.replace(/^https?:\/\//, '').split(':')[0];

const api = axios.create({
  baseURL: `http://${ipOnly}:8084`,
});



export const getPersons = async () => {
  const response = await api.get('/get_users');
 // alert(response.data);
  return response.data;
};

export const createPerson = async (values) => {
  const response = await api.post('/add_user', values);
  return response.data;
};

export const updateItem = async (items= null, resourceName, params = null) => {
  try {
    const result = await api.post(`/${resourceName}`, items, {
      params: params,
    });
    return result?.data || result;
  } catch (error) {
    let errorMessage = 'حدث خطأ أثناء التحديث';

    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data?.message || error.response.data;

      switch (status) {
        case 400:
          errorMessage = 'بيانات غير صالحة: ' + (serverMessage || 'يرجى التحقق من المدخلات');
          break;
        case 401:
          errorMessage = 'غير مصرح بالوصول: يرجى تسجيل الدخول مرة أخرى';
          break;
        case 403:
          errorMessage = 'غير مسموح بالوصول إلى هذا المورد';
          break;
        case 404:
          errorMessage = `المورد "${resourceName}" غير موجود`;
          break;
        case 409:
          errorMessage = 'تعارض في البيانات: ' + (serverMessage || 'البيانات موجودة مسبقاً');
          break;
        case 422:
          errorMessage = 'بيانات غير صالحة: ' + (serverMessage || 'يرجى التحقق من المدخلات');
          break;
        case 500:
          errorMessage = 'خطأ في الخادم: يرجى المحاولة لاحقاً';
          break;
        default:
          errorMessage = `خطأ في الخادم (${status}): ${serverMessage || 'يرجى المحاولة لاحقاً'}`;
      }
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم: يرجى التحقق من اتصال الإنترنت';
    } else {
      errorMessage = error.message || 'حدث خطأ غير متوقع';
    }

    throw new Error(errorMessage);
  }
};



export const getAllItems = async (resourceName,param = null ) => {
      //  alert(JSON.stringify(param));
  try {
    const response = await api.get(`/${resourceName}`, { params: param });
   //    alert(response.data);
 // alert(JSON.stringify(response.data,null,2))
    return response.data || [];
  } catch (error) {
    // تسجيل فقط، ثم إعادة رمي الخطأ ليصل إلى React Query
      alert(error);
    throw error;
  }
};

// Create new item
export const createItem = async (items, resourceName,params) => {
  try {
    const response = await api.post(`/${resourceName}`, items,{params:{
          tableName: params.tableName,
          operation: params.operation,
        }});
    return response.data;
  } catch (error) {
    alert(error);
  }
};

export const addItem = async (items, resourceName, params) => {
  try {
    const response = await api.post(`/${resourceName}`, items, {
      params: {
        tableName: params.tableName,
        operation: params.operation,
      }
    });

    // التحقق من استجابة الخادم
    if (response.data && response.data.success === false) {
      throw new Error(response.data.message || "❌ فشل في العملية");
    }

    // إذا كانت العملية ناجحة
    if (response.data && response.data.success) {
      alert("تمت العملية بنجاح");
      return {
        success: true,
        data: response.data,
        message: response.data.message || "✅ تمت العملية بنجاح"
      };
    }

  alert(response.data.message);
    // إذا لم يكن هناك حقل success، نعتبر أن العملية ناجحة
    return {
      success: true,
      data: response.data,
      message: "✅ تمت العملية بنجاح"
    };

} catch (error) {
  
  let errorMessage = "❌ حدث خطأ غير متوقع";
  
  if (error.response) {
    errorMessage = error.response.data?.message || `❌ خطأ: ${error.response.status}`;
  } else if (error.request) {
    errorMessage = "❌ لا يمكن الاتصال بالخادم";
  } else {
    errorMessage = error.message || "❌ خطأ في إعداد الطلب";
  }

  // عرض الخطأ للمستخدم
  alert(`خطأ: ${errorMessage}`);

  return {
    success: false,
    error: errorMessage
  };
}
  
};


export const deleteItemDirect = async (id, resourceName) => {
  alert(id);
  try {
    const response = await api.delete(`/${resourceName}/${id}`);
    
  } catch (error) {
    console.error('Error deleting item:', error.message);
    throw error;
  }
};

export const deleteItem = async (id, resourceName,params) => {
  try {
    const response = await api.post(`/${resourceName}`,{ id:id },{
        params
        });
    return response.data;
    alert("تم الحذف");
  } catch (error) {
    alert(error);
  }
};
