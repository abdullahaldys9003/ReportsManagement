<?php

function addNeighborhood($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO neighborhoods (name, district_id) VALUES (?, ?)");
    $stmt->bind_param("si", $data['name'], $data['district_id']);

    if ($stmt->execute()) {
        echo "✅ تم إضافة الحي بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة تعديل حي
// =====================
function updateNeighborhood($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE neighborhoods SET name = ?, district_id = ? WHERE id = ?");
    $stmt->bind_param("sii", $data['name'], $data['district_id'], $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم تعديل الحي بنجاح.";
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
// 3️⃣ دالة حذف حي
// =====================
function deleteNeighborhood($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM neighborhoods WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo "✅ تم حذف الحي بنجاح.";
        } else {
            echo "⚠️ لم يتم العثور على الحي بالـ ID المحدد.";
        }
    } else {
        echo "❌ خطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 4️⃣ دالة عرض جميع الأحياء
// =====================
function getNeighborhoods() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");
    
    $sql ="SELECT 
    n.district_id AS district_id,
    d.name AS district_name,
    n.id AS neighborhood_id,
    n.name AS neighborhood_name
FROM neighborhoods n
LEFT JOIN districts d ON n.district_id = d.id
    ";
    
    $result = $conn->query($sql);
    $neighborhoods = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $neighborhoods[] = $row;
        }
    }
    $conn->close();
    return $neighborhoods;
}
function getAllNeighborhoods() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");
    
    $sql ="SELECT 
    n.district_id AS district_id,
    d.name AS district_name,
    n.id AS neighborhood_id,
    n.name AS neighborhood_name
FROM neighborhoods n
LEFT JOIN districts d ON n.district_id = d.id
    ";
    
    $result = $conn->query($sql);
    $neighborhoods = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $neighborhoods[] = $row;
        }
    }
    $conn->close();
    return $neighborhoods;
}

// =====================
// مثال على switch داخل switch
// =====================



function operationNeighborhoods($operation) {
    switch ($operation) {
        case "show":
            echo json_encode(getNeighborhoods());
            break;
        case "getAllNeighborhoods":
            echo json_encode(getAllNeighborhoods());
            break;
        default:
            echo "الجدول غير موجود";
    }
}


?>