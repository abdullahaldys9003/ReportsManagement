import { getAllItems, createItem, updateItem, deleteItem, addItem } from '../api/crudApi.js';

export const useHooksApi = () => {

  const handleCreate = async ({
    values,
    table
  }) => { 
    alert(JSON.stringify(values));
    await addItem(
      values,
      "index.php",
      {
        tableName: "departments",
        operation: "updateDepartment",
      },
    );
    // table.setCreatingRow(null);
  };

  const getAllDepartmentReport = async (conut=null) => {

    const ruslte = await getAllItems(
      "index.php",
      {
        tableName: "reports",
        operation: "getAllDepartmentReports",
        data: {
          limit: conut || 10,
          status: status || "opened",
        },
      },
    );
   // alert(JSON.stringify(ruslte));
    return ruslte;
  };

  const handleSaveUpdate = async ({
    values,
    table
  }) => { 
    alert(JSON.stringify(values));
    await updateItem(
      values,
      "index.php",
      {
        tableName: "departments",
        operation: "updateDepartment",
      },
    );
    // table.setCreatingRow(null);
  };

  const handleDelete = async ({
    values,
    table
  }) => { // تصحيح المعاملات لتكون كائن
    const data = {
      id: values.original.id,
    };
    
    if (!values.original.id) {
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
    // table.setCreatingRow(null);
  };

  return {
    handleCreate,
    handleSaveUpdate,
    handleDelete,
    getAllDepartmentReport, // إضافة الدالة المفقودة
  };
};