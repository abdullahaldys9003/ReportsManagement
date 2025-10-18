<?php
/**
 * 📌 عمليات CRUD كاملة على جدول department
 * addDepartment       -> إضافة
 * updateDepartment    -> تعديل
 * deleteDepartment    -> حذف
 * getDepartmentById   -> جلب سجل واحد
 * getAllDepartments   -> جلب كل السجلات
 */

// =====================
// 1️⃣ إضافة سجل جديد
// =====================
require_once 'conn.php';
function addDepartment($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        INSERT INTO department (department_name, address, neighborhoods_id, districts_id, type) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param(
        "ssiis", 
        $data['department_name'], 
        $data['address'], 
        $data['neighborhoods_id'], 
        $data['districts_id'],
        $data['type']
    );

    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $result = ["status" => "success", "message" => "تمت الإضافة بنجاح", "id" => $newId];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 2️⃣ تعديل سجل
// =====================
function updateDepartment($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["success" => false, "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        UPDATE department 
        SET department_name = ?, address = ?, neighborhoods_id = ?, districts_id = ?, type = ? 
        WHERE id = ?
    ");
    
    $stmt->bind_param(
        "ssiisi", 
        $data['department_name'], 
        $data['address'], 
        $data['neighborhoods_id'], 
        $data['districts_id'],
        $data['type'],
        $id
    );

    if ($stmt->execute()) {
        $result = ["success" => true, "message" => "تم التعديل بنجاح"];
    } else {
        $result = ["success" => false, "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 3️⃣ حذف سجل
// =====================
function deleteDepartment($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }

    $stmt = $conn->prepare("DELETE FROM department WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $result = ["status" => "success", "message" => "تم الحذف بنجاح"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 4️⃣ جلب سجل واحد
// =====================
function getDepartmentById($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["success" => false, "message" => "فشل الاتصال: " . $conn->connect_error];
    }

    $stmt = $conn->prepare("SELECT *,n.name As neighborhoods_name,d.name As districts_name FROM department dep
      INNER JOIN neighborhoods n ON dep.neighborhoods_id = n.id
          INNER JOIN districts d ON dep.districts_id = d.id  WHERE dep.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $data = $res->fetch_assoc();

    $stmt->close();
    $conn->close();

    if ($data) {
        return ["success" => true, "data" => $data];
    } else {
        return ["success" => false, "message" => "لم يتم العثور على السجل"];
    }
}

// =====================
// 5️⃣ جلب كل السجلات
// =====================


function getDepartments() {
     $conn = createConnection();

    $sql = "SELECT *,d.name AS     districts_name FROM department AS dep 
       LEFT JOIN districts d ON dep.districts_id = d.id
    ";
    $res = $conn->query($sql);
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    $conn->close();
    return ["success" => true, "data" => $data];
}

function operationDepartments($operation,$data=null) {
    switch ($operation) {
            case "getDepartments":
               echo json_encode(getDepartments());
                break;
            case "delete":
               echo json_encode(deleteDepartment($data["id"]));
                break;
            case "add":
               echo json_encode(addDepartment($data));
                break;
            case "update":
               echo json_encode(updateDepartment($data['id'],$data));
                break;
            case "getDepartmentById":
               echo json_encode(getDepartmentById($_GET['id']));
                break;
            default:
                echo "عملية غير معروفة لأنواع التقرير";
        }
} 

?>
