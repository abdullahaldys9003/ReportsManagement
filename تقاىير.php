

SELECT
    rmt.type_name AS 'النوع الرئيسي',
    rst.sub_type_name AS 'النوع الفرعي',
    COUNT(r.report_id) AS 'إجمالي البلاغات',
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS 'مفتوحة',
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS 'مغلقة',
    SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS 'قيد المعالجة'
FROM reports r
INNER JOIN report_main_types rmt ON r.main_id = rmt.id
INNER JOIN report_sub_types rst ON r.sub_id = rst.id
GROUP BY rmt.type_name, rst.sub_type_name
ORDER BY rmt.type_name, COUNT(r.report_id) DESC;





SELECT 
    g.name as 'المحافظة',
    d.name as 'المديرية',
    n.name as 'الحي',
    COUNT(r.report_id) as 'عدد البلاغات',
    GROUP_CONCAT(DISTINCT mt.type_name SEPARATOR '، ') as 'أنواع البلاغات'
FROM reports r
JOIN districts d ON r.districts_id = d.id
JOIN governorates g ON d.governorate_id = g.id
JOIN neighborhoods n ON r.neighborhoods_id = n.id
JOIN report_main_types mt ON r.main_id = mt.id
GROUP BY g.name, d.name, n.name
ORDER BY COUNT(r.report_id) DESC;


احصائيات عن عدد الموضيفة اانشتبهه 

-- إحصائيات سريعة
SELECT 
    (SELECT COUNT(*) FROM reports) as 'إجمالي البلاغات',
    (SELECT COUNT(*) FROM reports WHERE status_report = 'opened') as 'بلاغات مفتوحة',
    (SELECT COUNT(*) FROM reports WHERE status_report = 'closed') as 'بلاغات مغلقة',
    (SELECT COUNT(*) FROM suspects) as 'عدد المشتبه بهم',
    (SELECT COUNT(*) FROM reporters) as 'عدد المبلغين',
    (SELECT COUNT(*) FROM employees) as 'عدد الموظفين'; 
    
    
    function getPoliceDepartmentsReports($department_id, $status = null, $main_type = null, $from_date = null, $to_date = null) {
    $conn = createConnection();
    if (is_array($conn)) return $conn; // خطأ في الاتصال

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

    $types = "i"; // نوع المعاملات
    $params = [$department_id];

    if ($status) {
        $query .= " AND r.status_report = ?";
        $types .= "s";
        $params[] = $status;
    }

    if ($main_type) {
        $query .= " AND rmt.type_name = ?";
        $types .= "s";
        $params[] = $main_type;
    }

    if ($from_date) {
        $query .= " AND r.created_at >= ?";
        $types .= "s";
        $params[] = $from_date . " 00:00:00";
    }

    if ($to_date) {
        $query .= " AND r.created_at <= ?";
        $types .= "s";
        $params[] = $to_date . " 23:59:59";
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


SELECT 
    rmt.type_name AS main_type,
    rst.sub_type_name AS sub_type,
    COUNT(*) AS total_reports,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,
    SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS processing_reports
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
INNER JOIN department dep ON rd.department_id = dep.id
INNER JOIN report_main_types rmt ON r.main_id = rmt.id
INNER JOIN report_sub_types rst ON r.sub_id = rst.id
WHERE dep.id = 1
GROUP BY rmt.type_name, rst.sub_type_name
ORDER BY rmt.type_name, rst.sub_type_name;




-- 📊 استعلام المقارنة الشامل للقسم 1 (مصحح)
SELECT 
    'إجمالي البلاغات' AS metric,
    COUNT(*) AS current_value,
    (SELECT COUNT(*) FROM reports r2 
     INNER JOIN report_department rd2 ON r2.report_id = rd2.report_id 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND rd2.department_id = 1) AS yesterday_value,
    (SELECT COUNT(*) FROM reports r3 
     INNER JOIN report_department rd3 ON r3.report_id = rd3.report_id 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND rd3.department_id = 1) AS last_week_value
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
WHERE DATE(r.created_at) = CURDATE() 
AND rd.department_id = 1

UNION ALL

SELECT 
    'البلاغات المغلقة' AS metric,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS current_value,
    (SELECT COUNT(*) FROM reports r2 
     INNER JOIN report_department rd2 ON r2.report_id = rd2.report_id 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND r2.status_report = 'closed' 
     AND rd2.department_id = 1) AS yesterday_value,
    (SELECT COUNT(*) FROM reports r3 
     INNER JOIN report_department rd3 ON r3.report_id = rd3.report_id 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND r3.status_report = 'closed' 
     AND rd3.department_id = 1) AS last_week_value
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
WHERE DATE(r.created_at) = CURDATE() 
AND rd.department_id = 1

UNION ALL

SELECT 
    'البلاغات الجديدة' AS metric,
    COUNT(*) AS current_value,
    (SELECT COUNT(*) FROM reports r2 
     INNER JOIN report_department rd2 ON r2.report_id = rd2.report_id 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND rd2.department_id = 1) AS yesterday_value,
    (SELECT COUNT(*) FROM reports r3 
     INNER JOIN report_department rd3 ON r3.report_id = rd3.report_id 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND rd3.department_id = 1) AS last_week_value
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
WHERE DATE(r.created_at) = CURDATE() 
AND rd.department_id = 1

UNION ALL

SELECT 
    'نسبة الإنجاز %' AS metric,
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / COUNT(*) * 100), 1) AS current_value,
    (SELECT ROUND((SUM(CASE WHEN r2.status_report = 'closed' THEN 1 ELSE 0 END) / COUNT(*) * 100), 1)
     FROM reports r2 
     INNER JOIN report_department rd2 ON r2.report_id = rd2.report_id 
     WHERE DATE(r2.created_at) = CURDATE() - INTERVAL 1 DAY 
     AND rd2.department_id = 1) AS yesterday_value,
    (SELECT ROUND((SUM(CASE WHEN r3.status_report = 'closed' THEN 1 ELSE 0 END) / COUNT(*) * 100), 1)
     FROM reports r3 
     INNER JOIN report_department rd3 ON r3.report_id = rd3.report_id 
     WHERE YEARWEEK(r3.created_at, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) 
     AND rd3.department_id = 1) AS last_week_value
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
WHERE DATE(r.created_at) = CURDATE() 
AND rd.department_id = 1;