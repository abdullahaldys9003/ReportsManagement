<?php

function addReportSubType($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO report_sub_types (main_type_id, sub_type_name) VALUES (?, ?)");
    $stmt->bind_param("is", $data['main_type_id'], $data['sub_type_name']);

    if ($stmt->execute()) {
        echo "✅ تم إضافة النوع الفرعي بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة تعديل نوع فرعي للتقرير
// =====================
function updateReportSubType($id, $data) { 
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE report_sub_types SET main_type_id = ?, sub_type_name = ? WHERE id = ?");
    $stmt->bind_param("isi", $data['main_type_id'], $data['sub_type_name'], $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم تعديل النوع الفرعي بنجاح.";
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
// 3️⃣ دالة حذف نوع فرعي للتقرير
// =====================
function deleteReportSubType($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM report_sub_types WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم حذف النوع الفرعي بنجاح.";
        } else {
            echo "⚠️ لم يتم العثور على النوع الفرعي بالـ ID المحدد.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 4️⃣ دالة عرض كل الأنواع الفرعية
// =====================
function getReportSubTypes() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $result = $conn->query("SELECT * FROM report_sub_types");
    $subTypes = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $subTypes[] = $row;
        }
    }
    $conn->close();
    return $subTypes;
}


function operation_report_sub_types($operation) {
    switch ($operation) {
        case "show":
            echo json_encode(getReportSubTypes());
            break;
        default:
            echo "الجدول غير موجود";
    }
}
?>