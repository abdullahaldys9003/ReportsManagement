<?php
include "db_connection.php"; // ملف الاتصال بقاعدة البيانات

// =====================
// 1️⃣ دالة إضافة محافظة
// =====================
function addGovernorate($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO governorates (name) VALUES (?)");
    $stmt->bind_param("s", $data['name']);

    if ($stmt->execute()) {
        echo "✅ تم إضافة المحافظة بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة تعديل محافظة
// =====================
function updateGovernorate($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE governorates SET name = ? WHERE id = ?");
    $stmt->bind_param("si", $data['name'], $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم تعديل المحافظة بنجاح.";
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
// 3️⃣ دالة حذف محافظة
// =====================
function deleteGovernorate($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM governorates WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم حذف المحافظة بنجاح.";
        } else {
            echo "⚠️ لم يتم العثور على المحافظة بالـ ID المحدد.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 4️⃣ دالة عرض كل المحافظات
// =====================
function getGovernorates() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $result = $conn->query("SELECT * FROM governorates");
    $governorates = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $governorates[] = $row;
        }
    }
    $conn->close();
    return $governorates;
}

// =====================
// مثال على switch داخل switch
// =====================
$table = "governorates"; // اسم الجدول
$operation = "add";       // العمليات: add, update, delete, show

$governorateData = [
    "name" => "المحافظة الجديدة"
];

switch ($table) {
    case "governorates":
        switch ($operation) {
            case "add":
                addGovernorate($governorateData);
                break;
            case "update":
                updateGovernorate(1, ["name" => "تعز"]); // تعديل ID=1
                break;
            case "delete":
                deleteGovernorate(3); // حذف ID=3
                break;
            case "show":
                $all = getGovernorates();
                echo "<pre>"; print_r($all); echo "</pre>";
                break;
            default:
                echo "عملية غير معروفة للمحافظات";
        }
        break;
    default:
        echo "الجدول غير موجود";
}
?>