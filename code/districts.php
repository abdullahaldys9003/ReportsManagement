<?php

function addDistrict($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO districts (name, governorate_id) VALUES (?, ?)");
    $stmt->bind_param("si", $data['name'], $data['governorate_id']);

    if ($stmt->execute()) {
        echo "✅ تم إضافة المديرية بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة تعديل مديرية
// =====================
function updateDistrict($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE districts SET name = ?, governorate_id = ? WHERE id = ?");
    $stmt->bind_param("sii", $data['name'], $data['governorate_id'], $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم تعديل المديرية بنجاح.";
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
// 3️⃣ دالة حذف مديرية
// =====================
function deleteDistrict($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM districts WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم حذف المديرية بنجاح.";
        } else {
            echo "⚠️ لم يتم العثور على المديرية بالـ ID المحدد.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 4️⃣ دالة عرض كل المديريات
// =====================
function getDistricts() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $result = $conn->query("SELECT * FROM districts");
    $districts = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $districts[] = $row;
        }
    }
    $conn->close();
    return $districts;
}

// =====================
// مثال على switch داخل switch

function operationDistricts($operation, $data = null) {
        switch ($operation) {
            case "add":
                addDistrict($districtData);
                break;
            case "update":
                updateDistrict(1, ["name" => "القاهره", "governorate_id" => 1]);
                break;
            case "delete":
                deleteDistrict(3);
                break;
            case "show":
              echo json_encode(getDistricts());
                break;
            default:
                echo "عملية غير معروفة للمديريات";
    };
}
?>