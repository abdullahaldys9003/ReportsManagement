import { 
  useEntityQuery, 
  useEntityCreate, 
  useEntityUpdate, 
  useEntityDelete 
} from '../hooks/useEntityAPI.js';

import { getAllItems, createItem, updateItem, deleteItem } from '../api/crudApi.js';

const NEIGHBORHOODS_QUERY_KEY = ['neighborhoods'];

export const useNeighborhoodsAPI = () => {
  const getQuery = useEntityQuery(NEIGHBORHOODS_QUERY_KEY, () => 
    getAllItems("index.php", { tableName: "neighborhoods", operation: "show" }), {
    select: (data) => data,
    onError: (err) => {
      alert(err.message);
    }
  });

  const createMutation = useEntityCreate(NEIGHBORHOODS_QUERY_KEY, createItem, {
    onSuccess: () => {
      alert("تم إضافة الحي بنجاح");
    }
  });
  
  const updateMutation = useEntityUpdate(NEIGHBORHOODS_QUERY_KEY, updateItem, {
    onSuccess: () => {
      alert("تم تعديل الحي بنجاح");
    }
  });

  const deleteMutation = useEntityDelete(NEIGHBORHOODS_QUERY_KEY, deleteItem, {
    onSuccess: () => {
      alert("تم حذف الحي بنجاح");
    }
  });

  const handleSaveUpdate = async ({ values, table, row }) => {
    try {
      const dataNeighborhood = {
        name: values.name,
        district_id: values.district_id
      };
      
      await updateMutation.mutateAsync({
        data: dataNeighborhood,
        params: {
          tableName: "neighborhoods",
          operation: "update"
        },
        url: "index.php",
        id: row.original.id
      });
      
      table.setEditingRow(null);
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleCreate = async ({ values, table }) => {
    try {
      const dataNeighborhood = {
        name: values.name,
        district_id: values.district_id
      };
      
      await createMutation.mutateAsync({
        data: dataNeighborhood,
        params: {
          tableName: "neighborhoods",
          operation: "add"
        },
        url: "index.php"
      });
      
      table.setCreatingRow(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (row) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحي؟')) {
      try {
        await deleteMutation.mutateAsync({
          params: {
            tableName: "neighborhoods",
            operation: "delete"
          },
          url: "index.php",
          id: row.original.id
        });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return {
    handleCreate,
    handleSaveUpdate,
    handleDelete,
    getQuery,
    createMutation,
    updateMutation,
    deleteMutation
  };
};