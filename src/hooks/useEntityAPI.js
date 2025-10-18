import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useEntityQuery = (queryKey, fetchFn, options = {}) => {
 
  return useQuery({
    queryKey,
    queryFn: fetchFn,
    refetchOnWindowFocus: false,
    ...options, // المستخدم يمكنه تمرير onError من الخارج
  });
};

export const useEntityCreate = (
  queryKey,
  createFn, //function the createItem
  options
) => {
  const queryClient = useQueryClient();
  /*variables :{
  data: {},    // البيانات المطلوب إنشاؤها (بدون id)
  context: ''  // (اختياري) معلومات إضافية
}*/

  return useMutation({
    // دالة تنفيذ الإنشاء على الخادم
    mutationFn: async (variables) => {

      return createFn(variables.data, variables.url,variables.params);
    },
    
    // التحديث المتفائل قبل الاتصال بالخادم
    onMutate: async (variables) => {
      // 1. إلغاء أي استعلامات جارية لنفس المفتاح
      await queryClient.cancelQueries({ queryKey });
      
      // 2. جلب البيانات الحالية من الذاكرة المؤقتة
      const prevData = queryClient.getQueryData(queryKey) || [];
      
      // 3. إنشاء ID مؤقت للعنصر الجديد
      const tempId = prevData.length ? 
        Math.max(...prevData.map(e => e.id || 0)) + 1 : 
        1;
      
      // 4. تحديث الذاكرة المؤقتة بإضافة العنصر الجديد
      queryClient.setQueryData(queryKey, [
        ...prevData, 
        { ...variables.data, id: tempId }
      ]);
      
      // 5. إرجاع البيانات الأصلية للتراجع عند الخطأ
      return { 
        prevData, 
        context: variables.context 
      };
    },
    
    // معالجة الأخطاء
    onError: (err, variables, context) => {
      // 1. استعادة البيانات الأصلية عند فشل العملية
      queryClient.setQueryData(queryKey, context?.prevData);
      
      // 2. تنفيذ دالة onError الإضافية إذا وجدت
      if (options?.onError) {
        options.onError(err, variables, context);
      }
    },
    
    // عند نجاح العملية
    onSuccess: (data, variables, context) => {
      // تنفيذ دالة onSuccess الإضافية إذا وجدت
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    
    // بعد اكتمال العملية (سواء نجحت أو فشلت)
    onSettled: () => {
      // إعادة جلب البيانات من الخادم للتأكد من المزامنة
      queryClient.invalidateQueries({ queryKey });
    }
  });
};

export const useEntityUpdate = (queryKey, updateFn, options) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      return updateFn(variables.data, variables.url,variables.params);
    },
    onMutate: async (updatedEntity) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData(queryKey) || [];

      queryClient.setQueryData(
        queryKey,
        prevData.map(e => e.id === updatedEntity.id ? updatedEntity : e)
      );

      return { prevData };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.prevData);
      if (options && options.onError) {
        options.onError(err);
      }
    },
    onSuccess: (data) => {
      if (options && options.onSuccess) {
        options.onSuccess(data);
      }
    }
  });
};
/*
export const useEntityDelete = (queryKey, deleteFn, options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables) => {
      return deleteFn(variables.id, variables.context);
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const prevData = queryClient.getQueryData(queryKey) || [];
      queryClient.setQueryData(
        queryKey,
        prevData.filter(e => e.id !== id)
      );
      return { prevData, id };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(queryKey, context?.prevData);
      if (options && options.onError) {
        options.onError(err);
      }
    },
    onSuccess: (_, id) => {
      if (options && options.onSuccess) {
        options.onSuccess(id);
      }
    }
  });
};
*/