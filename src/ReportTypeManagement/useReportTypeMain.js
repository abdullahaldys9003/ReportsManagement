
import { getAllItems,createItem,updateItem,deleteItem} from '../api/crudApi.js';

export const useReportTypeMain = () => {


  const handleCreate = async ({
    values,
    table
  }) => { 

  alert(JSON.stringify(values));
  await createItem(
    values,
   "index.php",
     {
    tableName: "report_main_types",
    operation: "add",
    },
);
  //table.setCreatingRow(null);
};

  const handleSaveUpdate = async ({
    values,
    table
  }) => { 
    if(!values.type_name){
      alert("يجب ادخال البيانات");
      return;
    }
  
  await updateItem(
    values,
   "index.php",
     {
    tableName: "report_main_types",
    operation: "update",
    },
);
  //table.setCreatingRow(null);
};

  const handleDelete = async (
    values,
    table
  ) => {
    const data ={
      id:values.original.id,
    };
    
    if(!values.original.id){
      alert("يجب ادخال البيانات");
      return;
    }
  
  await deleteItem(
    data,
   "index.php",
     {
    tableName: "report_main_types",
    operation: "delete",
    },
);
  //table.setCreatingRow(null);
};



  return {
    handleCreate,
    handleSaveUpdate,
    handleDelete,
  };
};


