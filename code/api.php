<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// بيانات تجريبية
$products = [
    ["id" => 1, "name" => "Laptop", "price" => 1500],
    ["id" => 2, "name" => "Phone", "price" => 800],
    ["id" => 3, "name" => "Tablet", "price" => 600]
];

echo json_encode($products);
?>