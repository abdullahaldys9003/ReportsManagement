<?php
/**
 * 📌 عمليات CRUD كاملة على جدول reporters
 * addReporter       -> إضافة
 * updateReporter    -> تعديل
 * deleteReporter    -> حذف
 * getReporterById   -> جلب سجل واحد
 * getAllReporters   -> جلب كل السجلات
 */

// =====================
// 1️⃣ إضافة سجل جديد
// =====================
function addReporter($reporterData) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    // تحقق من صحة البيانات
    if (empty($reporterData['name']) || empty($reporterData['phone']) || empty($reporterData['email'])
        || empty($reporterData['id_national']) || empty($reporterData['address'])) {
        return ["status" => "error", "message" => "جميع الحقول مطلوبة"];
    }
    if (!filter_var($reporterData['email'], FILTER_VALIDATE_EMAIL)) {
        return ["status" => "error", "message" => "البريد الإلكتروني غير صالح"];
    }
    if (!preg_match("/^\d{7,15}$/", $reporterData['phone'])) {
        return ["status" => "error", "message" => "رقم الهاتف غير صالح"];
    }
    if (!preg_match("/^\d+$/", $reporterData['id_national'])) {
        return ["status" => "error", "message" => "الرقم الوطني غير صالح"];
    }

    $stmt = $conn->prepare("
        INSERT INTO reporters
        (name_reporter, phone_reporter, email_reporter, id_national_reporter, address_reporter)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param(
        "sssss",
        $reporterData['name'],
        $reporterData['phone'],
        $reporterData['email'],
        $reporterData['id_national'],
        $reporterData['address']
    );

    if ($stmt->execute() === TRUE) {
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
function updateReporter($id, $reporterData) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        UPDATE reporters 
        SET name_reporter = ?, phone_reporter = ?, email_reporter = ?, 
           districts_id = ?, neighborhoods_id = ?,
            id_national_reporter = ?, address_reporter = ?
        WHERE id = ?
    ");
    $stmt->bind_param(
        "sssiissi",
        $reporterData['reporter_name'],
        $reporterData['reporter_phone'],
        $reporterData['reporter_email'],
        $reporterData['districts_id'],
        $reporterData['neighborhoods_id'],
        $reporterData['reporter_national_id'],
        $reporterData['reporter_address'],
        $id
    );

    if ($stmt->execute() === TRUE) {
        $result = ["status" => "success", "message" => "تم التعديل بنجاح"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 3️⃣ حذف سجل
// =====================
function deleteReporter($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }

    $stmt = $conn->prepare("DELETE FROM reporters WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute() === TRUE) {
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
function getReporterById($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }

    $stmt = $conn->prepare("SELECT * FROM reporters WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $data = $res->fetch_assoc();

    $stmt->close();
    $conn->close();

    if ($data) {
        return ["status" => "success", "data" => $data];
    } else {
        return ["status" => "error", "message" => "لم يتم العثور على السجل"];
    }
}

// =====================
// 5️⃣ جلب كل السجلات
// =====================
function getAllReporters() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }

    $sql = "SELECT * FROM reporters ORDER BY id DESC";
    $res = $conn->query($sql);
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    $conn->close();
    return ["status" => "success", "data" => $data];
}


function getReportersByReportId($reportId) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");
    
    $stmt = $conn->prepare("
        SELECT 
            r.id AS reporter_id,
            r.name_reporter,
            r.phone_reporter,
            r.email_reporter,
            r.id_national_reporter,
            r.address_reporter AS address,
            d.name AS district_name,
            n.name AS neighborhood_name,
            g.name AS governorate
        FROM reporters r
        INNER JOIN report_reporter rr ON r.id = rr.reporter_id
        INNER JOIN districts d ON r.districts_id = d.id
        INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
        INNER JOIN governorates g ON d.governorate_id = g.id
        WHERE rr.report_id = ?
        ORDER BY r.id DESC
    ");
    
    if (!$stmt) {
        $conn->close();
        return ["status" => "error", "message" => "خطأ في إعداد الاستعلام: " . $conn->error];
    }
    
    $stmt->bind_param("i", $reportId);
    
    if (!$stmt->execute()) {
        $stmt->close();
        $conn->close();
        return ["status" => "error", "message" => "خطأ في التنفيذ: " . $stmt->error];
    }
    
    $result = $stmt->get_result();
    $reporters = [];
    
    while ($row = $result->fetch_assoc()) {
        $reporters[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    return ["status" => "success", "data" => $reporters];
}

// =====================
// 6️⃣ دالة العمليات الموحدة للمبلغين
// =====================
function operation_reporters($operation, $data = null) {
    switch ($operation) {
        case "insert":
            echo json_encode($data ? addReporter($data) : ["status" => "error", "message" => "لا توجد بيانات للإضافة"]);
            break;
        case "update":
            echo json_encode($data && isset($data['id']) ? updateReporter($data['id'], $data) : ["status" => "error", "message" => "بيانات غير كافية للتعديل"]);
            break;
        case "delete":
            echo json_encode($data && isset($data['id']) ? deleteReporter($data['id']) : ["status" => "error", "message" => "لم يتم تحديد ID للحذف"]);
            break;
        case "show":
            echo json_encode(getAllReporters());
            break;
        case "showById":
            $id = $data['id'];
            echo json_encode(getReporterById($id));
            break;
        case "getReportersByReportId":
         $id = $_GET['id'];
          if($id) {
             echo json_encode(getReportersByReportId($id));
          } else {
            $id= $data['id'];
            echo json_encode(getReportersByReportId($id));
          }
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للمبلغين"]);
    }
}


?>