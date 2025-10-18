
import { getAllItems,createItem,updateItem,deleteItem,addItem} from '../api/crudApi.js';

export const useReportTypeMain = () => {


  const handleCreate = async ({
    values,
    table
  }) => { 

  
  await addItem(
    values,
   "index.php",
     {
    tableName: "employees",
    operation: "add",
    },
    alert("تم الاضافه");
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
    tableName: "employees",
    operation: "update",
    },
);
alert("تم التعديل بنجاح");
   table.setCreatingRow(null);
};

  const handleDelete = async (
    values,
    table
  ) => {
    const data ={
      employee_id:values.original.employee_id,
    };

  
  await deleteItem(
    data,
   "index.php",
     {
    tableName: "employees",
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


