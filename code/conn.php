<?php
// إنشاء اتصال منفصل
function createConnection() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");
    return $conn;
}

function closeConnection($conn) {
    if ($conn) {
        $conn->close();
    }
}

?>


