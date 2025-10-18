<?php
include "db_connection.php"; // ملف الاتصال بقاعدة البيانات

// =====================
// 1️⃣ دالة إضافة نقطة تفتيش
// =====================
function addCheckpoint($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO checkpoints (name, created_at) VALUES (?, ?)");
    $stmt->bind_param("ss", $data['name'], $data['created_at']);

    if ($stmt->execute()) {
        echo "✅ تم إضافة نقطة التفتيش بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة تعديل نقطة تفتيش
// =====================
function updateCheckpoint($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE checkpoints SET name = ?, created_at = ? WHERE id = ?");
    $stmt->bind_param("ssi", $data['name'], $data['created_at'], $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم تعديل نقطة التفتيش بنجاح.";
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
// 3️⃣ دالة حذف نقطة تفتيش
// =====================
function deleteCheckpoint($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM checkpoints WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم حذف نقطة التفتيش بنجاح.";
        } else {
            echo "⚠️ لم يتم العثور على نقطة التفتيش بالـ ID المحدد.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 4️⃣ دالة عرض جميع نقاط التفتيش
// =====================
function getCheckpoints() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $result = $conn->query("SELECT * FROM checkpoints");
    $checkpoints = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $checkpoints[] = $row;
        }
    }
    $conn->close();
    return $checkpoints;
}

// =====================
// مثال على switch داخل switch
// =====================
$table = "checkpoints"; // اسم الجدول
$operation = "add";      // العمليات: add, update, delete, show

$checkpointData = [
    "name" => "نقطة التفتيش الرئيسية",
    "created_at" => date("Y-m-d H:i:s")
];

switch ($table) {
    case "checkpoints":
        switch ($operation) {
            case "add":
                addCheckpoint($checkpointData);
                break;
            case "update":
                updateCheckpoint(1, ["name" => "نقطة التفتيش الفرعية", "created_at" => date("Y-m-d H:i:s")]);
                break;
            case "delete":
                deleteCheckpoint(1);
                break;
            case "show":
                $all = getCheckpoints();
                echo "<pre>"; print_r($all); echo "</pre>";
                break;
            default:
                echo "عملية غير معروفة لنقاط التفتيش";
        }
        break;
    default:
        echo "الجدول غير موجود";
}
?>