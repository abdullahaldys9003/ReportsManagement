<?php

function getAlerts() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return [
            'success' => false,
            'message' => 'تعذر الاتصال بقاعدة البيانات: ' . $conn->connect_error
        ];
    }
    
    $conn->set_charset("utf8mb4");

    // جرب هذا الاستعلام البسيط أولاً
    $sql = "SELECT * FROM police_alerts LIMIT 5";
    
    error_log("جاري تنفيذ الاستعلام: " . $sql); // لتتبع الخطأ

    $result = $conn->query($sql);
    
    if ($result === false) {
        $error = $conn->error;
        error_log("خطأ SQL: " . $error);
        $conn->close();
        return [
            'success' => false,
            'message' => 'خطأ في الاستعلام: ' . $error,
            'sql' => $sql
        ];
    }
    
    $alerts = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $alerts[] = $row;
        }
    }
    
    $conn->close();
    
    return [
        'success' => true,
        'data' => $alerts,
        'message' => 'تم جلب ' . count($alerts) . ' سجل',
        'count' => count($alerts)
    ];
}

function getAlertsByDepartmentId($departmentId) {
    try {
        $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
        if ($conn->connect_error) {
            throw new Exception("فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
        }
        $conn->set_charset("utf8mb4");

        $sql = "
            SELECT p.*, d.department_name 
            FROM police_alerts p
            LEFT JOIN department d ON p.department_id = d.id
            WHERE p.department_id = ?
        ";
        
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("فشل في إعداد الاستعلام: " . $conn->error);
        }
        
        $stmt->bind_param("i", $departmentId);
        $stmt->execute();
        $result = $stmt->get_result();

        $alerts = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $alerts[] = $row;
            }
        }

        $stmt->close();
        $conn->close();
        return $alerts;

    } catch (Exception $e) {
        // إغلاق الاتصال في حالة الخطأ
        if (isset($stmt) && $stmt) {
            $stmt->close();
        }
        if (isset($conn) && $conn) {
            $conn->close();
        }
        error_log("خطأ في getAlertsByDepartmentId: " . $e->getMessage());
        return [];
    }
}

function addAlerts($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["success" => false, "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        INSERT INTO police_alerts (alert_title, alert_message, department_id, suspects_id) 
        VALUES (?, ?, ?, ?)
    ");
    
    $stmt->bind_param(
        "ssii", 
        $data['alert_title'], 
        $data['alert_message'], 
        $data['department_id'], 
        $data['suspects_id']
    );

    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $result = ["success" => true, "message" => "تمت الإضافة بنجاح", "id" => $newId];
    } else {
        $result = ["success" => false , "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

function deleteAlerts($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM police_alerts WHERE alert_id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $result = ["status" => "success", "message" => "تم حذف الاشعار "];
        } else {
            $result = ["status" => "warning", "message" => "لم يتم العثور على التقرير بالـ ID المحدد"];
        }
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();

    return $result;
}

function updateAlerts($data) {
    try {
        $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
        
        if ($conn->connect_error) {
            throw new Exception("فشل الاتصال بقاعدة البيانات: " . $conn->connect_error);
        }
        
        $conn->set_charset("utf8mb4");
        
        // التحقق من وجود alert_id في البيانات
        if (!isset($data['alert_id']) || empty($data['alert_id'])) {
            throw new Exception("معرف التقرير غير موجود أو غير صالح");
        }
        
        $id = $data['alert_id'];
        
        $stmt = $conn->prepare("
            UPDATE police_alerts SET alert_title=?, alert_message=?, department_id=?, suspects_id=? WHERE alert_id=?
        ");
        
        if (!$stmt) {
            throw new Exception("فشل في إعداد الاستعلام: " . $conn->error);
        }
        
        $stmt->bind_param(
            "ssiii",
            $data['alert_title'],
            $data['alert_message'],
            $data['department_id'],
            $data['suspects_id'],
            $id
        );
        
        if (!$stmt->execute()) {
            throw new Exception("فشل في تنفيذ الاستعلام: " . $stmt->error);
        }
        
        if ($stmt->affected_rows > 0) {
            $result = ["success" => true, "message" => "تم تعديل  التنبيه بنجاح"];
        } else {
            $result = ["status" => false, "message" => "لم يتم تعديل أي بيانات"];
        }
        
        $stmt->close();
        $conn->close();
        
        return $result;
        
    } catch (Exception $e) {
        // إغلاق الاتصال في حالة الخطأ
        if (isset($stmt) && $stmt) {
            $stmt->close();
        }
        if (isset($conn) && $conn) {
            $conn->close();
        }
        
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

function updateStatus($data) {
    try {
        $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
        if ($conn->connect_error) {
            return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
        }
        $conn->set_charset("utf8mb4");

        $stmt = $conn->prepare("
            UPDATE police_alerts SET status = ? WHERE alert_id = ?
        ");

        $stmt->bind_param(
            "si",
            $data['status'],
            $data['alert_id']
        );

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $result = ["success" => true, "message" => "تم تحديث الحالة بنجاح"];
            } else {
                $result = ["success" => false, "message" => "لم يتم تعديل أي بيانات"];
            }
        } else {
            $result = ["suspects_id" => false, "message" => $stmt->error];
        }

        $stmt->close();
        $conn->close();
        return $result;

    } catch (Exception $e) {
        return ["success" => false, "message" => $e->getMessage()];
    }
}

// =====================
// 5️⃣ تنفيذ العمليات عبر API
// =====================
function sendAlertOperation($operation, $data = null) {
    switch ($operation) {
        case "show":
            echo json_encode(getAlerts());
            break;
        case "addAlerts":
            echo json_encode(addAlerts($data));
            break;
        case "deleteAlerts":
            echo json_encode(deleteAlerts($_GET['id']));
            break;
        case "updateAlerts":
            echo json_encode(updateAlerts($data));
            break;
        case "getAlertsByDepartmentId":
            $departmentId = $_GET['id'];
            echo json_encode(getAlertsByDepartmentId($departmentId));
            break;
        case "updateStatus":
            echo json_encode(updateStatus($data));
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة"]);
    }
}
?>