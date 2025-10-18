<?php



function getDepartment_statistics() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
SELECT 
    dep.department_name,
    COUNT(r.report_id) AS total_reports,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,
    SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS prosse_reports
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
INNER JOIN department dep ON rd.department_id = dep.id
GROUP BY dep.department_name
ORDER BY dep.department_name;
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
/*
function getDepartment_statistics_2() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
    SELECT
    rmt.type_name,
    rst.sub_type_name,
    COUNT(r.report_id) AS 'total',
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS 'opened',
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS 'closed',
    SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS 'prosse'
FROM reports r
INNER JOIN report_main_types rmt ON r.main_id = rmt.id
INNER JOIN report_sub_types rst ON r.sub_id = rst.id
GROUP BY rmt.type_name, rst.sub_type_name
ORDER BY rmt.type_name, COUNT(r.report_id) DESC;
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
*/
function getReportsCountByTypeAndStatus($period = 'month') {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
    
    // تحديد الفترة الزمنية
    $dateCondition = "";
    switch($period) {
        case 'week':
            $dateCondition = "WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)";
            break;
        case 'month':
            $dateCondition = "WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
            break;
        case 'quarter':
            $dateCondition = "WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)";
            break;
        case 'year':
            $dateCondition = "WHERE r.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
            break;
        default:
            $dateCondition = ""; // جميع البيانات
    }
    
    $sql = "
    SELECT
        rmt.type_name,
        rst.sub_type_name,
        COUNT(r.report_id) AS 'total',
        SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS 'opened',
        SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS 'closed',
        SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS 'prosse'
    FROM reports r
    INNER JOIN report_main_types rmt ON r.main_id = rmt.id
    INNER JOIN report_sub_types rst ON r.sub_id = rst.id
    $dateCondition
    GROUP BY rmt.type_name, rst.sub_type_name
    ORDER BY rmt.type_name, COUNT(r.report_id) DESC;
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

function getDepartment_statistics_3() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
    SELECT 
    (SELECT COUNT(*) FROM reports) as 'totalReports',
    (SELECT COUNT(*) FROM reports WHERE status_report = 'opened') as 'openReports',
    (SELECT COUNT(*) FROM reports WHERE status_report = 'closed') as 'closedReports',
    (SELECT COUNT(*) FROM suspects) as 'عدد المشتبه بهم',
    (SELECT COUNT(*) FROM department) as 'totalDepartments',
    (SELECT COUNT(*) FROM employees) as 'totalEmployees',
    (SELECT COUNT(*) FROM reporters) as 'عدد المبلغين',
    (SELECT COUNT(*) FROM employees) as 'عدد الموظفين';
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
function getDepartment_statistics_4() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
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
ORDER BY COUNT(r.report_id) DESC';
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
function getDepartment_statistics_5() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
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
ORDER BY COUNT(r.report_id) DESC';
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
function getDepartment_statistics_6() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
    SELECT 
    dep.department_name AS department_name,
    n.name As neighborhood_name,
    dep.id AS department_id,
    COALESCE(rm.type_name, 'غير محدد') AS crime_type,
    COUNT(rd.report_id) AS total_reports,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,
    SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS prosse_reports
FROM department dep
LEFT JOIN report_department rd ON dep.id = rd.department_id
LEFT JOIN reports r ON rd.report_id = r.report_id
LEFT JOIN report_main_types rm ON r.main_id = rm.id
LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
WHERE dep.id = 1
GROUP BY dep.department_name, dep.id, rm.type_name
ORDER BY total_reports DESC;
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
    
    /*
    
    [
  {
    "department_name": "اسم القسم",
    "neighborhood_name": "اسم الحي", 
    "department_id": 1,
    "crime_type": "نوع الجريمة",
    "total_reports": 50,
    "opened_reports": 20,
    "closed_reports": 15,
    "prosse_reports": 15
  },
  {
    "department_name": "اسم القسم",
    "neighborhood_name": "اسم حي آخر",
    "department_id": 1,
    "crime_type": "نوع جريمة آخر",
    "total_reports": 30,
    "opened_reports": 10,
    "closed_reports": 12,
    "prosse_reports": 8
  }
  // ... المزيد من الكائنات
]
    
    */
}
function getDepartment_statistics_7() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
       $sql = "
SELECT 

    (SELECT rst.sub_type_name 
     FROM reports r1 
     JOIN report_sub_types rst ON r1.sub_id = rst.id 
     GROUP BY rst.sub_type_name 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS most_common_sub_type,
    

    (SELECT CASE 
        WHEN DAYNAME(created_at) = 'Sunday' THEN 'الأحد'
        WHEN DAYNAME(created_at) = 'Monday' THEN 'الإثنين'
        WHEN DAYNAME(created_at) = 'Tuesday' THEN 'الثلاثاء'
        WHEN DAYNAME(created_at) = 'Wednesday' THEN 'الأربعاء'
        WHEN DAYNAME(created_at) = 'Thursday' THEN 'الخميس'
        WHEN DAYNAME(created_at) = 'Friday' THEN 'الجمعة'
        WHEN DAYNAME(created_at) = 'Saturday' THEN 'السبت'
    END
     FROM reports 
     GROUP BY DAYNAME(created_at), DAYOFWEEK(created_at) 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS most_common_day,
    

    (SELECT CONCAT(HOUR(created_at), ':00') 
     FROM reports 
     GROUP BY HOUR(created_at) 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS most_common_hour,
    

    (SELECT CONCAT(d.name, ' - ', n.name) 
     FROM reports r3 
     JOIN districts d ON r3.districts_id = d.id 
     JOIN neighborhoods n ON r3.neighborhoods_id = n.id 
     GROUP BY d.name, n.name 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS most_common_area
FROM DUAL;
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


//districts_id
function getAllDepartments() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }

    $sql = "SELECT * FROM department";
    $res = $conn->query($sql);
    $data = [];
    while ($row = $res->fetch_assoc()) {
        $data[] = $row;
    }

    $conn->close();
    return ["status" => "success", "data" => $data];
}



function operation_department_statistics($operation, $data = null) {
    switch ($operation) {
        case "show":
            echo json_encode(getDepartment_statistics());
            break;
        case "getReportsCountByTypeAndStatus":
          $period = $_GET['period'];
            echo json_encode(getReportsCountByTypeAndStatus($period));
            break;
        case "show_3":
            echo json_encode(getDepartment_statistics_3());
            break;
        case "show_4":
            echo json_encode(getDepartment_statistics_4());
            break;
        case "show_6":
            echo json_encode(getDepartment_statistics_6());
            break;
        case "show_7":
            echo json_encode(getDepartment_statistics_7());
            break;
        case "getAllDepartments":
            echo json_encode(getAllDepartments());
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}

?>