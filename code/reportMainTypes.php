<?php
//reportMainTypes
require_once 'conn.php';
/*
function addReportMainType($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO report_main_types (type_name) VALUES (?)");
    $stmt->bind_param("s", $data['type_name']);

    if ($stmt->execute()) {
        echo "✅ تم إضافة نوع التقرير بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة تعديل نوع رئيسي للتقرير
// =====================
function updateReportMainType($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE report_main_types SET type_name = ? WHERE id = ?");
    $stmt->bind_param("si", $data['type_name'], $data['id']);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم تعديل نوع التقرير بنجاح.";
        } else {
            echo "⚠️ لم يتم تعديل أي صف أو لم تتغير البيانات.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 3️⃣ دالة حذف نوع رئيسي للتقرير
// =====================
function deleteReportMainType($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM report_main_types WHERE id = ?");
    $stmt->bind_param("i", $data['id']);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم حذف نوع التقرير بنجاح.";
        } else {
            echo "⚠️ لم يتم العثور على نوع التقرير بالـ ID المحدد.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
*/
// =====================
// 4️⃣ دالة عرض كل أنواع التقارير
// =====================
function fetchReportMainTypes() {
    $conn = createConnection();
    if (is_array($conn)) { // إذا كان هناك خطأ في الاتصال
        return $conn;
    }

    // إعداد الاستعلام باستخدام prepared statement
    $stmt = $conn->prepare("SELECT * FROM report_main_types");
    
    // تنفيذ الاستعلام
    $stmt->execute();
    
    // الحصول على النتائج
    $result = $stmt->get_result();
    $types = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $types[] = $row;
        }
    }

    // إغلاق البيان والاتصال
    $stmt->close();
    $conn->close();
    return $types;
}

function operationReportMainTypes($operation,$data=null) {
  switch ($operation) {
    case "fetchReportMainTypes":
      echo json_encode(fetchReportMainTypes());
      break;
      default:
        echo "عملية غير معروفة لأنواع التقرير";
  }
} 
?>