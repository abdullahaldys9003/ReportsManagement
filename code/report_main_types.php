<?php

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
function deleteReportMainType($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM report_main_types WHERE id = ?");
    $stmt->bind_param("i", $id);

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

// =====================
// 4️⃣ دالة عرض كل أنواع التقارير
// =====================
function getReportMainTypes() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");
    $result = $conn->query("SELECT * FROM report_main_types");
    $types = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $types[] = $row;
        }
    }
    $conn->close();
    return $types;
}

function operation_report_main_types($operation,$data=null) {
switch ($operation) {
            case "add":
          addReportMainType($data);
                break;
            case "update":
              updateReportMainType($data);
                break;
            case "delete":
              deleteReportMainType($_GET["id"]);
                break;
            case "show":
               echo json_encode(getReportMainTypes());
                break;
            default:
                echo "عملية غير معروفة لأنواع التقرير";
        }
} 
?>