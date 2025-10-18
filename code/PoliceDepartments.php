<?php
//PoliceDepartments
//operationPoliceDepartments
//
include("conn.php");
/*
function getPoliceDepartmentsReports($department_id) {
    // إنشاء الاتصال
    $conn = createConnection();
    if (is_array($conn)) { // إذا كان هناك خطأ في الاتصال
        return $conn;
    }

    // تحضير الاستعلام
    $stmt = $conn->prepare("
        SELECT 
            r.report_id AS report_number,
            DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS report_date,
            rmt.type_name AS main_type,
            rst.sub_type_name AS sub_type,
            r.description AS description,
            d.name AS district,
            n.name AS neighborhood,
            CASE 
                WHEN r.status_report = 'opened' THEN 'مفتوح'
                WHEN r.status_report = 'closed' THEN 'مغلق'
                WHEN r.status_report = 'prosse' THEN 'قيد المعالجة'
            END AS report_status,
            dep.department_name AS department_name
        FROM reports r
        INNER JOIN report_department rd ON r.report_id = rd.report_id
        INNER JOIN department dep ON rd.department_id = dep.id
        INNER JOIN report_main_types rmt ON r.main_id = rmt.id
        INNER JOIN report_sub_types rst ON r.sub_id = rst.id
        INNER JOIN districts d ON r.districts_id = d.id
        INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
        WHERE dep.id = ?
        ORDER BY r.created_at DESC
    ");

    if (!$stmt) {
        closeConnection($conn);
        return ["status" => "error", "message" => "Query preparation failed: " . $conn->error];
    }

    // ربط المعامل وتنفيذ الاستعلام
    $stmt->bind_param("i", $department_id);
    
    if (!$stmt->execute()) {
        $stmt->close();
        closeConnection($conn);
        return ["status" => "error", "message" => "Execution failed: " . $stmt->error];
    }

    // جلب النتائج
    $result = $stmt->get_result();
    $reports = [];

    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }

    // إغلاق الاتصال
    $stmt->close();
    closeConnection($conn);

    return ["status" => "success", "data" => $reports];
}
*/


function getPoliceDepartmentsReports($department_id, $filters = null) {
    $conn = createConnection();
    if (is_array($conn)) return $conn;

    $query = "
        SELECT 
            r.report_id AS report_number,
            DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS report_date,
            rmt.type_name AS main_type,
            rst.sub_type_name AS sub_type,
            r.description AS description,
            d.name AS district,
            n.name AS neighborhood,
            CASE 
                WHEN r.status_report = 'opened' THEN 'مفتوح'
                WHEN r.status_report = 'closed' THEN 'مغلق'
                WHEN r.status_report = 'prosse' THEN 'قيد المعالجة'
            END AS report_status
        FROM reports r
        INNER JOIN report_department rd ON r.report_id = rd.report_id
        INNER JOIN department dep ON rd.department_id = dep.id
        INNER JOIN report_main_types rmt ON r.main_id = rmt.id
        INNER JOIN report_sub_types rst ON r.sub_id = rst.id
        INNER JOIN districts d ON r.districts_id = d.id
        INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
        WHERE dep.id = ?
    ";

    $types = "i";
    $params = [$department_id];

    $status    = $filters["status"]    ?? null;
    $mainType  = $filters["mainType"]  ?? null; // توحيد الاسم
    $fromDate  = $filters["fromDate"]  ?? null;
    $toDate    = $filters["toDate"]    ?? null;
    
    if ($status) {
        $query .= " AND r.status_report = ?";
        $types .= "s";
        $params[] = $status;
    }

    if ($mainType) {
        $query .= " AND rmt.id = ?";
        $types .= "i";
        $params[] = $mainType;
    }

    if ($fromDate) {
        $query .= " AND r.created_at >= ?";
        $types .= "s";
        $params[] = $fromDate . " 00:00:00";
    }

    if ($toDate) {
        $query .= " AND r.created_at <= ?";
        $types .= "s";
        $params[] = $toDate . " 23:59:59";
    }

    $query .= " ORDER BY r.created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $reports = [];
    while ($row = $result->fetch_assoc()) {
        $reports[] = $row;
    }

    $stmt->close();
    closeConnection($conn);
    return ["status" => "success", "data" => $reports];
}

function getPoliceDepartmentsReportsSummary($department_id) {
    $conn = createConnection();
    if (is_array($conn)) return $conn;

    $query = "
        SELECT 
            rmt.type_name AS main_type,
            rst.sub_type_name AS sub_type,
            r.main_id,
            COUNT(*) AS total_reports,
            SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
            SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,
            SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS processing_reports
        FROM reports r
        INNER JOIN report_department rd ON r.report_id = rd.report_id
        INNER JOIN department dep ON rd.department_id = dep.id
        INNER JOIN report_main_types rmt ON r.main_id = rmt.id
        INNER JOIN report_sub_types rst ON r.sub_id = rst.id
        WHERE dep.id = ?
        GROUP BY rmt.type_name, rst.sub_type_name
        ORDER BY rmt.type_name, rst.sub_type_name
    ";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $department_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $summary = [];
    while ($row = $result->fetch_assoc()) {
        $summary[] = $row;
    }

    $stmt->close();
    closeConnection($conn);
    return ["status" => "success", "data" => $summary];

}
function dailyWeeklyPoliceDepartmentsReportsSummary($department_id) {
    $conn = createConnection();
    if (is_array($conn)) return $conn;

    $query = "
SELECT 
    'إجمالي البلاغات' AS metric,
    COUNT(*) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0) AS yesterday_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = ?)
     ), 0) AS last_week_value,
    ROUND(COUNT(*) / NULLIF(DATEDIFF(MAX(r.created_at), MIN(r.created_at)) + 1, 0), 1) AS daily_avg
FROM reports r
WHERE DATE(r.created_at) = CURDATE() 
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = ?)

UNION ALL

SELECT 
    'البلاغات المغلقة' AS metric,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND r2.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0) AS yesterday_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND r3.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = ?)
     ), 0) AS last_week_value,
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1) AS completion_rate
FROM reports r
WHERE DATE(r.created_at) = CURDATE() 
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = ?)

UNION ALL

SELECT 
    'البلاغات الجديدة' AS metric,
    COUNT(*) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0) AS yesterday_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = ?)
     ), 0) AS last_week_value,
    ROUND(((COUNT(*) - COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0)) / NULLIF(COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0), 0)) * 100, 1) AS growth_rate
FROM reports r
WHERE DATE(r.created_at) = CURDATE() 
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = ?)

UNION ALL

SELECT 
    'متوسط وقت المعالجة (ساعة)' AS metric,
    COALESCE(ROUND(AVG(TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at)), 1), 0) AS current_value,
    COALESCE((SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, r2.created_at, r2.updated_at)), 1) 
     FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND r2.updated_at IS NOT NULL
     AND r2.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0) AS yesterday_value,
    COALESCE((SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, r3.created_at, r3.updated_at)), 1) 
     FROM reports r3 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND r3.updated_at IS NOT NULL
     AND r3.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = ?)
     ), 0) AS last_week_value,
    COALESCE(MIN(TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at)), 0) AS best_time
FROM reports r
WHERE DATE(r.created_at) = CURDATE() 
AND r.status_report = 'closed'
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = ?)

UNION ALL

SELECT 
    'نسبة الإنجاز %' AS metric,
    COALESCE(ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1), 0) AS current_value,
    COALESCE((SELECT ROUND((SUM(CASE WHEN r2.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1)
     FROM reports r2 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = ?)
     ), 0) AS yesterday_value,
    COALESCE((SELECT ROUND((SUM(CASE WHEN r3.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1)
     FROM reports r3 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = ?)
     ), 0) AS last_week_value,
    85.0 AS monthly_target
FROM reports r
WHERE DATE(r.created_at) = CURDATE() 
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = ?)";

    $stmt = $conn->prepare($query);

    // عدد مرات الـ "?" في الاستعلام = 21
    $stmt->bind_param(str_repeat("i", 21), 
        $department_id, $department_id, $department_id, $department_id, $department_id, 
        $department_id, $department_id, $department_id, $department_id, $department_id, 
        $department_id, $department_id, $department_id, $department_id, $department_id,
        $department_id, $department_id, $department_id, $department_id, $department_id,
        $department_id
    );

    $stmt->execute();
    $result = $stmt->get_result();

    $summary = [];
    while ($row = $result->fetch_assoc()) {
        $summary[] = $row;
    }

    $stmt->close();
    closeConnection($conn);
    return ["status" => "success", "data" => $summary];
}


function getPoliceDepartmentsPeriodicReports() {
  
}

function operationPoliceDepartments($operation, $data = null,$id=null,$filters=null) {
    switch ($operation) {
        case "getPoliceDepartmentsReports":
          //   echo json_encode($filters);
            echo json_encode(getPoliceDepartmentsReports($id,$filters));
            break;
        case "getPoliceDepartmentsReportsSummary":
            echo json_encode(getPoliceDepartmentsReportsSummary($id));
            break;
        case "dailyWeeklyPoliceDepartmentsReportsSummary":
            echo json_encode(dailyWeeklyPoliceDepartmentsReportsSummary($id));
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}


?>