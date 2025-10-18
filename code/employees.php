<?php
// =====================
// 1️⃣ دالة إضافة موظف
// =====================
function addEmployee($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["success" => false, "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    try {
        // التحقق من وجود البريد الإلكتروني
        $checkStmt = $conn->prepare("SELECT employee_id FROM employees WHERE email = ?");
        $checkStmt->bind_param("s", $data['email']);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            throw new Exception("البريد الإلكتروني موجود مسبقاً");
        }
        $checkStmt->close();

        // إضافة الموظف
        $stmt = $conn->prepare("
            INSERT INTO employees 
            (name_full, username, password, email, number_phone, position_type, department_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->bind_param(
            "ssssssi",
            $data['name_full'],
            $data['username'],
            $data['password'],
            $data['email'],
            $data['number_phone'],
            $data['position_type'],
            $data['department_id']
        );

        if ($stmt->execute()) {
            $result = ["success" => true, "message" => "✅ تم إضافة الموظف بنجاح", "id" => $conn->insert_id];
        } else {
            throw new Exception("❌ فشل في إضافة الموظف: " . $stmt->error);
        }

    } catch (Exception $e) {
        $result = ["success" => false, "message" => $e->getMessage()];
    } finally {
        // إغلاق الاتصال مباشرة بدون التحقق بـ ping
        if ($conn) {
            $conn->close();
        }
    }
    
    return $result;
}

// =====================
// 2️⃣ دالة تعديل موظف
// =====================
function updateEmployee($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        UPDATE employees SET 
        name_full = ?, username = ?, password = ?, email = ?, number_phone = ?, position_type = ?, department_id = ? 
        WHERE employee_id = ?
    ");
    $stmt->bind_param(
        "ssssssii",
        $data['name_full'],
        $data['username'],
        $data['password'],
        $data['email'],
        $data['number_phone'],
        $data['position_type'],
        $data['department_id'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
          $result = ["success" => true, "message" => "✅ تم التعديل الموظف بنجاح"];
        } else {
            $result = ["success" => false, "message" => "حصل خطاء اثناء االتعديل اعد المحاولة"];
        }
    } else {
       $result = ["success" => false, "message" => $stmt->error];
      }

    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 3️⃣ دالة حذف موظف
// =====================
function deleteEmployee($id) {
    // التحقق من صحة المدخلات
    if (!is_numeric($id) || $id <= 0) {
        return [
            'success' => false,
            'message' => '❌ رقم الموظف غير صحيح.',
            'data' => null
        ];
    }

    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    
    // التحقق من الاتصال بقاعدة البيانات
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'فشل الاتصال بقاعدة البيانات: ' . $conn->connect_error,
            'data' => null
        ];
    }
    
    $conn->set_charset("utf8mb4");
    
    try {
        $stmt = $conn->prepare("DELETE FROM employees WHERE employee_id = ?");
        
        if (!$stmt) {
            throw new Exception("فشل في إعداد الاستعلام: " . $conn->error);
        }
        
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $result = [
                    'success' => true,
                    'message' => '✅ تم حذف الموظف بنجاح.',
                    'data' => [
                        'deleted_id' => $id,
                        'affected_rows' => $stmt->affected_rows
                    ]
                ];
            } else {
                $result = [
                    'success' => false,
                    'message' => '⚠️ لم يتم العثور على الموظف بالـ ID المحدد.',
                    'data' => [
                        'searched_id' => $id
                    ]
                ];
            }
        } else {
            throw new Exception("فشل في تنفيذ الاستعلام: " . $stmt->error);
        }
        
    } catch (Exception $e) {
        $result = [
            'success' => false,
            'message' => '❌ حدث خطأ: ' . $e->getMessage(),
            'data' => null
        ];
    } finally {
        // إغلاق الموارد في جميع الأحوال
        if (isset($stmt)) {
            $stmt->close();
        }
        $conn->close();
    }
    
    return $result;
}

// =====================
// 4️⃣ دالة عرض الموظفين
// =====================
function getEmployees() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $result = $conn->query("SELECT * , dep.department_name FROM employees emp
      INNER JOIN  department dep ON emp.department_id = dep.id
  ");
    $employees = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
    }
    $conn->close();
    return $employees;
}

function getEmployeeById($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    // استخدام prepared statement للحماية من SQL injection
    $stmt = $conn->prepare("SELECT emp.*, dep.department_name,
      dep.address,
      emp.name_full,
      d.name AS districts_name,
      n.name AS neighborhoods_name
         FROM employees emp
          INNER JOIN department dep ON emp.department_id = dep.id
          INNER JOIN neighborhoods n ON dep.neighborhoods_id  1 = n.id
          INNER JOIN districts d ON dep.districts_id  1 = d.id
             WHERE dep.id = ?");
    
    if (!$stmt) {
        die("خطأ في إعداد الاستعلام: " . $conn->error);
    }
    
    $stmt->bind_param("i", $id); // استخدام "s" للسلسلة النصية أو "i" للرقم
    $stmt->execute();
    
    $result = $stmt->get_result();
    $employees = [];
    
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
    }
    
    $stmt->close();
    $conn->close();
    return $employees;
}

function operation_employees($operation,$data=null) {
switch ($operation) {
  case "add":
    echo json_encode(addEmployee($data));
                break;
            case "update":
             echo json_encode(updateEmployee($data["employee_id"],$data));
                break;
            case "delete":
           echo json_encode(deleteEmployee($_GET["id"]));
                break;
            case "show":
               echo json_encode(getEmployees());
                break;
            default:
                echo "عملية غير معروفة لأنواع التقرير";
        }
} 
?>