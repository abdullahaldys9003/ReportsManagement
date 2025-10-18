<?php



// إنشاء اتصال منفصل
function createConnection() {
$host = "sql12.freesqldatabase.com";
$username = "sql12803599";
$password = "cFCHQzjydv";
$database = "sql12803599";
$port = 3306;
$conn = new mysqli($host, $username, $password, $database, $port);

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


