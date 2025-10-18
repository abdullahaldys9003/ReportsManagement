import { getAllItems,createItem,updateItem,deleteItem,addItem} from '../api/crudApi.js';

export const useHooksApi = () => {
  const handleCreate = async ({
    values,
    table
  }) => { 

  await addItem(
    values,
   "index.php",
     {
    tableName: "departments",
    operation: "add",
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
    tableName: "departments",
    operation: "updateDepartment",
    },
);
  //table.setCreatingRow(null);
};

  const handleDelete = async (id
  ) => {
    alert(id.original.id);
    if(!id){
      alert("يجب ادخال البيانات");
      return;
    }
  
  const re = await deleteItem(
    {id:id.original.id},
   "index.php",
     {
    tableName: "departments",
    operation: "delete",
    },
);
alert(JSON.stringify(re));
  //table.setCreatingRow(null);
};



  return {
    handleCreate,
    handleSaveUpdate,
    handleDelete,
  };
};


