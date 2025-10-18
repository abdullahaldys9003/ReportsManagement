<?php


function getDepartment_statistics() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
/*
    $sql = "
        SELECT r.*, rm.type_name, rs.sub_type_name
        FROM reports r
        LEFT JOIN report_main_types rm ON r.main_id = rm.id
        LEFT JOIN report_sub_types rs ON r.sub_id = rs.id
    "; 
    */
       $sql = "
    SELECT 
    dep.department_name AS department_name,
    n.name AS neighborhood_name,
    d.name AS district_name,
    COUNT(r.report_id) AS total_reports,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports
FROM reports r
LEFT JOIN report_department rd ON r.report_id = rd.report_id
LEFT JOIN department dep ON rd.department_id = dep.id
LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
LEFT JOIN districts d ON r.districts_id = d.id
GROUP BY dep.department_name, n.name, d.name
ORDER BY dep.department_name, d.name, n.name;
";
    
    
    $result = $conn->query($sql);

    $reports = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reports[] = $row;
        }
    }

    $conn->close();
    return $reports;
}

function operation_department_statistics($operation, $data = null) {
    switch ($operation) {
        case "show":
            echo json_encode(getDepartment_statistics());
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}

?>