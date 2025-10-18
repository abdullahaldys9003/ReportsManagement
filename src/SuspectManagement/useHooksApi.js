
import { getAllItems,createItem,updateItem,deleteItem,addItem} from '../api/crudApi.js';

export const useHooksApi = () => {


  const getAllReportNumbers = async () => {

    const ruslte = await getAllItems(
      "index.php",
      {
        tableName: "reports",
        operation: "getAllReportNumbers",
    },
  );
   //  alert(JSON.stringify(ruslte));
    return ruslte;
  };
  

  const handleCreate = async ({
    values,
    table
  }) => { 
    alert(values);

  await addItem(
    values,
   "index.php",
     {
    tableName: "suspects",
    operation: "insert",
    },
);
  //table.setCreatingRow(null);
};

  const handleSaveUpdate = async ({
    values,
    table
  }) => { 
    
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
    values,
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
    getAllReportNumbers,
  };
};


