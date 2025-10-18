
import { 
  useEntityQuery, 
  useEntityCreate, 
  useEntityUpdate, 
 // useEntityDelete 
} from '../hooks/useEntityAPI.js';

import { getAllItems,createItem,updateItem } from '../api/crudApi.js';
const PERSON_QUERY_KEY = ['notifications'];
export const useNotificationsAPI = () => {
 const getQuery = useEntityQuery(PERSON_QUERY_KEY, () => getAllItems("index.php",{tableName: "police_alerts", operation: "show"}), {
  select: (data) => data,
  onError : (err) => {
    alert(err.message);
  }
});


const createMutation = useEntityCreate(PERSON_QUERY_KEY, createItem, {
    onSuccess: (newPerson) => {
      alert("تم الارسال بنجاح");
    }
  });
  
  const updateMutation = useEntityUpdate(PERSON_QUERY_KEY, updateItem);
 
 
 const handleSaveUpdate= async ({ 
    values, 
    table 
  }) => {
    try{
    const dataAlerts = {
      alert_id:values.alert_id,
      alert_title:values.alert_title,
      alert_message:values.alert_message,
      department_id:values.department_name,
      suspects_id:31,
    };
    await updateMutation.mutateAsync({
    data: dataAlerts,
    params:{
    tableName: "police_alerts",
    operation: "updateAlerts"},
    url: "index.php",
    });
   // table.setEditingRow(null);
    } catch (error){
      alert(error.message);
    }
  };
  
  const handleCreate = async ({
    values,
    table
  }) => {
    const dataAlerts = {
      alert_title:values.alert_title,
      alert_message:values.alert_message,
      department_id:values.department_name,
      suspects_id:31,
    };
    alert(JSON.stringify(dataAlerts));
  await createMutation.mutateAsync({
  data: dataAlerts,
  params:{
    tableName: "police_alerts",
    operation: "addAlerts"},
    url: "index.php"
});
  //table.setCreatingRow(null);
};

  //createMutation.mutateAsync() → createItem(url, data) → fetch()
/*

 const createMutation = useEntityCreate(PERSON_QUERY_KEY, createItem, {
    onSuccess: (newPerson) => {
      alert("تم الارسال بنجاح");
    }
  });


const handleCreate = async ({
    values,
    table
  }) => {
  await createMutation.mutateAsync({
  data: values,
  context: "add_wanted"
});
  table.setCreatingRow(null);
};

  const updateMutation = useEntityUpdate(PERSON_QUERY_KEY, updateItem);

  const deleteMutation = useEntityDelete(PERSON_QUERY_KEY, deleteItem);
*/
  return {
    handleCreate,
    getQuery,
    handleSaveUpdate,
    /*
    
    //createMutation, 
    updateMutation,
    deleteMutation
    */
  };
};


