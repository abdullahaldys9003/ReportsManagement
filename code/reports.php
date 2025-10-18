<?php

// =====================
// 1️⃣ دالة إضافة تقرير

function getLatestPendingReportTypesByDepartments($limit = 5) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    $sql = "
        SELECT 
            rmt.type_name AS main_type,
            rst.sub_type_name AS sub_type,
            d.department_name AS department,
            COUNT(r.report_id) AS reports_count,
            MAX(r.created_at) AS last_report_date
        FROM reports r
        INNER JOIN report_main_types rmt ON r.main_id = rmt.id
        INNER JOIN report_sub_types rst ON r.sub_id = rst.id
        INNER JOIN report_department rd ON r.report_id = rd.report_id
        INNER JOIN department d ON rd.department_id = d.id
        LEFT JOIN department_report_reviews drr ON r.report_id = drr.report_id
        WHERE r.archive = 0
        AND COALESCE(drr.sent_to_management, FALSE) = FALSE
        GROUP BY rmt.type_name, rst.sub_type_name, d.department_name
        ORDER BY MAX(r.created_at) DESC
        LIMIT ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $reportTypes = [];

    while ($row = $result->fetch_assoc()) {
        $reportTypes[] = $row;
    }

    $stmt->close();
    $conn->close();
    
    return $reportTypes;
}


function getDepartmentMonthlyPerformance($department_id = 3) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
    
    $sql = "
    SELECT    
        YEAR(r.created_at) AS year,    
        MONTH(r.created_at) AS month,    
        COUNT(*) AS total_reports,    
        SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,    
        SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS in_progress_reports,    
        SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,    
        ROUND(
            AVG(
                CASE 
                    WHEN r.updated_at IS NOT NULL AND r.updated_at > r.created_at 
                    THEN TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at) 
                    ELSE NULL 
                END
            ), 1
        ) AS avg_processing_hours,
        ROUND(
            (SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)),
            1
        ) AS completion_rate
    FROM reports r
    INNER JOIN report_department rd ON r.report_id = rd.report_id
    WHERE rd.department_id = ?
        AND r.created_at IS NOT NULL
    GROUP BY YEAR(r.created_at), MONTH(r.created_at)
    HAVING total_reports > 0
    ORDER BY year DESC, month DESC 
    LIMIT 0, 12
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $department_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $performance_data = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $performance_data[] = $row;
        }
    }
    
    $stmt->close();
    $conn->close();
    return $performance_data;
}


// =====================
function addReport($data) {

    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    // تقليم وتقصير النص إذا كان طويلاً
    $status_report = substr($data['status_report'], 0, 50); // تقليم إلى 50 حرف
    $description = substr($data['description'], 0, 500); // تقليم الوصف إذا needed

    $stmt = $conn->prepare("
        INSERT INTO reports (status_report, description, main_id, sub_id, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ");

    $stmt->bind_param(
        "ssii",
        $status_report, // استخدام المتغير المقصوص
        $description,
        $data['main_id'],
        $data['sub_id']
    );

    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $result = ["status" => "success", "message" => "تم إضافة التقرير بنجاح", "id" => $newId];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();

    return $result;
}

function createReportNumber() {
    return 'RPT-' . date('Ymd-His') . '-' . rand(100, 999);
}


function addCompleteReport($reportData) {
  
  $departmentId = 1; // غير هنا إلى departmentIds
  $userId=2;
    // بداية المعاملة
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");
    
    // بدء المعاملة
    $conn->begin_transaction();
    $reportNumber = createReportNumber();
    try {
        // 1. إضافة البلاغ
        $stmt = $conn->prepare("
            INSERT INTO reports (report_number,description, main_id, sub_id, status_report, districts_id, neighborhoods_id,
            created_at,archive)
            VALUES (?,?, ?, ?, ?,?,?, NOW(),?)
        ");
        $stmt->bind_param(
            "ssiisiis",
            $reportNumber,
            $reportData['description'],
            $reportData['main_id'],
            $reportData['sub_id'],
            $reportData['status_report'],
            $reportData['districts_reports'], // districts_reports -> districts_id
             // districts_reports -> districts_id
            $reportData['neighborhoods_reports'],// neighborhoods_reports -> neighborhoods_id
            $reportData['archive'],
        );
        $stmt->execute();
        $reportId = $conn->insert_id;
        $stmt->close();
        
        // 2. إضافة المبلغ (من بيانات المبلغ عنه)
        $stmt = $conn->prepare("
            INSERT INTO reporters (name_reporter, phone_reporter, email_reporter, id_national_reporter, address_reporter, districts_id, neighborhoods_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->bind_param(
            "sssssii",
            $reportData['name_reporter'],
            $reportData['phone_reporter'],
            $reportData['email_reporter'],
            $reportData['id_national_reporter'],
            $reportData['address_reporter'],
            $reportData['districts_reporter'], // districts_reporter -> districts_id
            $reportData['neighborhoods_reporter'] // neighborhoods_reporter -> neighborhoods_id
        );
        $stmt->execute();
        $reporterId = $conn->insert_id;
        $stmt->close();
        
        // 3. إضافة المبلغ عنه (من بيانات المشتبه به)
        $suspectId = null;
        if (!empty($reportData['fullName'])) {
            $stmt = $conn->prepare("
                INSERT INTO suspects (full_name, phone, gender, address, age, national_id, districts_id,
                 neighborhoods_id,
                 created_at)
                VALUES (?, ?, ?, ?,?, ?, ?, ?, NOW())
            ");
            $stmt->bind_param(
                "ssssisii",
                $reportData['fullName'],
                $reportData['phone'],
                $reportData['gender'],
                $reportData['address'],
                $reportData['age'],
                $reportData['nationalId'],
                $reportData['district_suspects'], // district_suspects -> districts_id
                $reportData['neighborhood_suspects'] // neighborhood_suspects -> neighborhoods_id
                
                
            );
            $stmt->execute();
            $suspectId = $conn->insert_id;
            $stmt->close();
        }
        
        // 4. ربط البلاغ بالمبلغ
        $stmt = $conn->prepare("INSERT INTO report_reporter (report_id, reporter_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $reportId, $reporterId);
        $stmt->execute();
        $stmt->close();
        
        // 5. ربط البلاغ بالمبلغ عنه (إذا وجد)
        if ($suspectId) {
            $stmt = $conn->prepare("INSERT INTO report_suspect (report_id, suspect_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $reportId, $suspectId);
            $stmt->execute();
            $stmt->close();
        }
        
        // 6. ربط البلاغ بالأقسام
            $stmt = $conn->prepare("INSERT INTO report_department (report_id, department_id) VALUES (?, ?)");
            $stmt->bind_param("ii", $reportId,$departmentId);
            $stmt->execute();
            $stmt->close();
        
        
        // 7. إضافة سجل النشاط
        $stmt = $conn->prepare("
            INSERT INTO logs_activity (id_user, table_target, id_record, action, createdAt)
            VALUES (?, 'reports', ?, 'create', NOW())
        ");
        $stmt->bind_param("ii", $userId, $reportId);
        $stmt->execute();
        $stmt->close();
        
        // تأكيد المعاملة
        $conn->commit();
        
        return [
            "status" => "success", 
            "message" => "تم إضافة البلاغ كاملاً بنجاح",
            "report_id" => $reportId,
            "reporter_id" => $reporterId,
            "suspect_id" => $suspectId
        ];
        
    } catch (Exception $e) {
        // تراجع عن المعاملة في حالة خطأ
        $conn->rollback();
        return ["status" => "error", "message" => "فشل في إضافة البلاغ: " . $e->getMessage()];
    } finally {
        $conn->close();
    }
}

function getAllDepartmentReports($limit = 5, $status = "opened") {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    $sql = "
        SELECT 
            r.report_id,
            r.description,
            r.created_at,
            r.status_report,
            r.report_number,
            mt.type_name,
            st.sub_type_name,
            st.id AS report_sub_id,
            mt.id AS report_main_id,
            dis.id AS districts_id,
            n.id AS neighborhoods_id,
            d.department_name,
            rd.department_id,
            dis.name AS district_name,
            n.name AS neighborhood_name
        FROM reports r
        INNER JOIN report_main_types mt ON r.main_id = mt.id
        INNER JOIN report_sub_types st ON r.sub_id = st.id
        INNER JOIN districts dis ON r.districts_id = dis.id
        INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
        LEFT JOIN report_department rd ON r.report_id = rd.report_id
        LEFT JOIN department d ON rd.department_id = d.id
    ";

    $whereConditions = [];
    
    
    if ($status !== null) {
        $status = $conn->real_escape_string($status);
        $whereConditions[] = "r.status_report = '$status'";
    }

    if (!empty($whereConditions)) {
        $sql .= " WHERE " . implode(" AND ", $whereConditions);
    }

    $sql .= " ORDER BY r.created_at DESC";

    if ($limit !== null) {
        $limit = (int)$limit;
        $sql .= " LIMIT $limit";
    }

    $result = $conn->query($sql);
    $reports = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reports[] = $row;
        }
    }

    $conn->close();
    return $reports;
}



// =====================
// 2️⃣ دالة تعديل تقرير
// =====================
function updateReport($id, $data) {
  try {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        UPDATE reports SET description=?, neighborhoods_id=?,districts_id =?,main_id=?, sub_id=? WHERE report_id=?
    ");
    
    if (!$stmt) {
      throw new Exception("فشل في إعداد الاستعلام: " . $conn->error);
    }
    
    $stmt->bind_param(
        "siiiis",
        $data['description'],
        $data['districts_id'],
        $data['neighborhoods_id'],
        $data['main_id'],
        $data['sub_id'],
        $id
    );
    
    if (!$stmt->execute()) {
      throw new Exception("فشل في تنفيذ الاستعلام: " . $stmt->error);
    }
    if ($stmt->affected_rows > 0) {
       $result = ["status" => "success", "message" => "تم تعديل  التنبيه بنجاح"];
        } else {
      $result = ["status" => "warning", "message" => "لم يتم تعديل أي بيانات"];
      }
    $stmt->close();
    $conn->close();

    return $result;
    
  } catch (Exception $e) {
        // إغلاق الاتصال في حالة الخطأ
        if (isset($stmt) && $stmt) {
            $stmt->close();
        }
        if (isset($conn) && $conn) {
            $conn->close();
        }
        
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

// =====================
// 3️⃣ دالة حذف تقرير
// =====================
function deleteReport($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM reports WHERE report_id=?");
    $stmt->bind_param("s", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $result = ["status" => "success", "message" => "تم حذف التقرير بنجاح"];
        } else {
            $result = ["status" => "warning", "message" => "لم يتم العثور على التقرير بالـ ID المحدد"];
        }
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();

    return $result;
}

// =====================
// 4️⃣ دالة عرض جميع التقارير
// =====================



function updateArchive($data) {
    try {
        $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
        if ($conn->connect_error) {
            return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
        }
        $conn->set_charset("utf8mb4");

        $stmt = $conn->prepare("
            UPDATE  reports SET archive = ? WHERE report_id = ?
        ");

        $stmt->bind_param(
            "ii",
            $data['archive'],
            $data['report_id']
        );

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $result = ["status" => "success", "message" => "تم تحديث الحالة بنجاح"];
            } else {
                $result = ["status" => "warning", "message" => "لم يتم تعديل أي بيانات"];
            }
        } else {
            $result = ["status" => "error", "message" => $stmt->error];
        }

        $stmt->close();
        $conn->close();
        return $result;

    } catch (Exception $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

//تم استخدامها في نموذج ارسال تصحيح
function getReportWithDetails($reportId) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    
    $sql = "
        SELECT 
            r.*,
            rmt.type_name as main_type_name,
            rst.sub_type_name as sub_type_name,
            r.districts_id as districts_reports_id,
            d.name as districts_reports,
            n.name as neighborhoods_reports,
            s.full_name as suspect_name,
            s.phone,
            s.national_id,
            s.address,
            s.age,
            s.gender,
            s.status,
            r.districts_id as districts_suspect_id, 
            ds.name as district_suspect_name,
            ns.name as neighborhood_suspect_name,
            rep.name_reporter,
            rep.phone_reporter,
            rep.email_reporter,
            rep.id_national_reporter,
            rep.address_reporter,
            dr.name as district_reporter_name,
            nr.name as neighborhood_reporter_name 
        FROM reports r
        LEFT JOIN report_main_types rmt ON r.main_id = rmt.id
        LEFT JOIN report_sub_types rst ON r.sub_id = rst.id
        LEFT JOIN districts d ON r.districts_id = d.id
        LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
        LEFT JOIN report_suspect rs ON r.report_id = rs.report_id
        LEFT JOIN suspects s ON rs.suspect_id = s.id
        LEFT JOIN districts ds ON s.districts_id = ds.id
         LEFT JOIN neighborhoods ns ON s.neighborhoods_id = ns.id
        LEFT JOIN report_reporter rr ON r.report_id = rr.report_id
        LEFT JOIN reporters rep ON rr.reporter_id = rep.id
       LEFT JOIN districts dr ON rep.districts_id = dr.id
       LEFT JOIN neighborhoods nr ON rep.neighborhoods_id = nr.id
        WHERE r.report_id = ?
    ";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $reportId);
    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_assoc();
    
    $stmt->close();
    $conn->close();
    
    return $report;
}



function getReports() {
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
    SELECT r.*, rm.type_name, rs.sub_type_name, d.name AS districts_reports, n.name AS neighborhoods_reports,
    rm.type_name
    FROM reports r
    LEFT JOIN report_main_types rm ON r.main_id = rm.id
    LEFT JOIN report_sub_types rs ON r.sub_id = rs.id
    LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
    LEFT JOIN districts d ON r.districts_id = d.id
    WHERE r.archive = 0
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



function getReportsByDepartmentId($departmentId = 1, $limit = 5, $status = null) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    $sql = "
        SELECT r.*, 
            mt.type_name,
            st.sub_type_name,
            st.id AS report_sub_id,
            mt.id AS report_main_id,
            dis.id AS districts_id,
            n.id AS neighborhoods_id,
            d.department_name,
            dis.name AS districts_reports,
            n.name AS neighborhoods_reports
        FROM reports r
        INNER JOIN report_main_types mt ON r.main_id = mt.id
        INNER JOIN report_sub_types st ON r.sub_id = st.id
        INNER JOIN districts dis ON r.districts_id = dis.id
        INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
        INNER JOIN report_department rd ON r.report_id = rd.report_id
        INNER JOIN department d ON rd.department_id = 1
        LEFT JOIN department_report_reviews drr ON r.report_id = drr.report_id
    ";

    $whereConditions = [];
    $whereConditions[] ="r.archive = 0";

    if ($departmentId !== null) {
        $departmentId = (int)$departmentId;
        $whereConditions[] = "d.id = $departmentId";
    }

    if ($status !== null) {
        $status = $conn->real_escape_string($status);
        $whereConditions[] = "r.status_report = '$status'";
    }

    // ⭐⭐ التعديل الرئيسي هنا ⭐⭐
    // إضافة شرط البلاغات التي لم ترسل للإدارة
    $whereConditions[] = "COALESCE(drr.sent_to_management, FALSE) = FALSE";

    if (!empty($whereConditions)) {
        $sql .= " WHERE " . implode(" AND ", $whereConditions);
    }

    $sql .= " ORDER BY r.created_at DESC";

    if ($limit !== null) {
        $limit = (int)$limit;
        $sql .= " LIMIT $limit";
    }

    $result = $conn->query($sql);
    $reports = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reports[] = $row;
        }
    }

    $conn->close();
    return $reports;
}


function getAllReportNumbers() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    
    $sql = "SELECT report_number FROM reports ORDER BY report_id";
    $result = $conn->query($sql);
    
    $reportNumbers = [];
    while ($row = $result->fetch_assoc()) {
        $reportNumbers[] = $row['report_number'];
    }
    
    $conn->close();
    return $reportNumbers;
}



function getPendingManagementReportsByDepartment($departmentId = 1, $limit = 5, $status = null) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    $sql = "
        SELECT 
            r.report_id,
            r.description,
            r.created_at,
            r.status_report,
            r.districts_id,
            r.neighborhoods_id,
            mt.type_name,
            mt.id AS report_main_id,
            st.sub_type_name,
            st.id AS report_sub_id,
            d.department_name,
            drr.sent_to_management,
            CASE 
                WHEN drr.id IS NULL THEN 'no_review'
                WHEN drr.sent_to_management = TRUE THEN 'sent'
                WHEN drr.sent_to_management = FALSE THEN 'pending'
                ELSE 'unknown'
            END as review_status
        FROM reports r
        INNER JOIN report_main_types mt ON r.main_id = mt.id
        INNER JOIN report_sub_types st ON r.sub_id = st.id
        INNER JOIN districts dis ON r.districts_id = dis.id
         INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
        INNER JOIN report_department rd ON r.report_id = rd.report_id
        INNER JOIN department d ON rd.department_id = d.id
        LEFT JOIN department_report_reviews drr ON r.report_id = drr.report_id
        WHERE d.id = $departmentId 
        AND COALESCE(drr.sent_to_management, FALSE) = FALSE
    ";

    if ($status !== null) {
        $status = $conn->real_escape_string($status);
        $sql .= " AND r.status_report = '$status'";
    }

    $sql .= " ORDER BY r.created_at DESC";

    if ($limit !== null) {
        $limit = (int)$limit;
        $sql .= " LIMIT $limit";
    }

    $result = $conn->query($sql);
    $reports = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reports[] = $row;
        }
    }

    $conn->close();
    return $reports;
}




function getDashboardStatistics() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $result = [];

    // 1. الإحصائيات الأساسية - البلاغات المرسلة للإدارة
    $stats_sql = "
        SELECT 
            (SELECT COUNT(*) FROM reports r 
             INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id 
             WHERE r.archive = 0 AND drr.sent_to_management = TRUE) as totalReports,
            
            (SELECT COUNT(*) FROM reports r 
             INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id 
             WHERE r.status_report = 'opened' AND r.archive = 0 
             AND drr.sent_to_management = TRUE) as openReports,
            
            (SELECT COUNT(*) FROM reports r 
             INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id 
             WHERE r.status_report = 'prosse' AND r.archive = 0 
             AND drr.sent_to_management = TRUE) as inProgressReports,
            
            (SELECT COUNT(*) FROM reports r 
             INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id 
             WHERE r.status_report = 'closed' AND r.archive = 0 
             AND drr.sent_to_management = TRUE) as closedReports,
            
            (SELECT COUNT(*) FROM department) as totalDepartments,
            (SELECT COUNT(*) FROM employees) as totalEmployees
    ";
    $stats_result = $conn->query($stats_sql);
    $result['stats'] = $stats_result->fetch_assoc();

    // 2. أنواع البلاغات المرسلة
    $types_sql = "
        SELECT 
            rmt.type_name as type,
            COUNT(r.report_id) as count
        FROM reports r
        INNER JOIN report_main_types rmt ON r.main_id = rmt.id
        INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id
        WHERE r.archive = 0 
        AND drr.sent_to_management = TRUE
        GROUP BY rmt.type_name
        ORDER BY count DESC
        LIMIT 5
    ";
    $types_result = $conn->query($types_sql);
    $result['reportTypes'] = [];
    while ($row = $types_result->fetch_assoc()) {
        $result['reportTypes'][] = $row;
    }

    // 3. حالة البلاغات المرسلة
    $status_sql = "
        SELECT 
            r.status_report as status,
            COUNT(*) as value
        FROM reports r
        INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id
        WHERE r.archive = 0 
        AND drr.sent_to_management = TRUE
        GROUP BY r.status_report
    ";
    $status_result = $conn->query($status_sql);
    $result['reportStatus'] = [];
    $status_colors = ['opened' => '#ff6384', 'prosse' => '#36a2eb', 'closed' => '#4bc0c0'];
    while ($row = $status_result->fetch_assoc()) {
        $result['reportStatus'][] = [
            'status' => $row['status'],
            'value' => $row['value'],
            'color' => $status_colors[$row['status']] ?? '#cccccc'
        ];
    }

    // 4. البلاغات المرسلة حسب المنطقة
    $districts_sql = "
        SELECT 
            d.name as district,
            COUNT(r.report_id) as count
        FROM reports r
        INNER JOIN districts d ON r.districts_id = d.id
        INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id
        WHERE r.archive = 0 
        AND drr.sent_to_management = TRUE
        GROUP BY d.name
        ORDER BY count DESC
        LIMIT 5
    ";
    $districts_result = $conn->query($districts_sql);
    $result['reportsByDistrict'] = [];
    while ($row = $districts_result->fetch_assoc()) {
        $result['reportsByDistrict'][] = $row;
    }

    // 5. أحدث البلاغات المرسلة
    $recent_sql = "
        SELECT 
            r.report_id as id,
            rmt.type_name as type,
            r.created_at as date,
            r.status_report as status,
          dp.department_name
        FROM reports r
        INNER JOIN report_main_types rmt ON r.main_id = rmt.id
        INNER JOIN department_report_reviews drr ON r.report_id = drr.report_id
        INNER JOIN department dp ON drr.department_id = dp.id
        WHERE r.archive = 0 
        AND drr.sent_to_management = TRUE
        ORDER BY r.created_at DESC
        LIMIT 5
    ";
    $recent_result = $conn->query($recent_sql);
    $result['recentReports'] = [];
    while ($row = $recent_result->fetch_assoc()) {
        $result['recentReports'][] = $row;
    }

    $conn->close();
    return ["status" => "success", "data" => $result];
}


function updateReportStatus($report_id, $new_status,$u) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال"];
    }
    $conn->set_charset("utf8mb4");

    // التحقق من وجود البلاغ
    $check = $conn->prepare("SELECT status_report FROM reports WHERE report_id = ?");
    $check->bind_param("i", $report_id);
    $check->execute();
    $result = $check->get_result();

    if ($result->num_rows == 0) {
        $conn->close();
        return ["status" => "error", "message" => "البلاغ غير موجود"];
    }

    $old_status = $result->fetch_assoc()['status_report'];

    // تحديث الحالة
    $update = $conn->prepare("UPDATE reports SET status_report = ?, updated_at = NOW() WHERE report_id = ?");
    $update->bind_param("si", $new_status, $report_id);

    if (!$update->execute()) {
        $conn->close();
        return ["status" => "error", "message" => "فشل في التحديث"];
    }

    $conn->close();
    return [
        "status" => "success",
        "message" => "تم التحديث بنجاح",
        "data" => [
            "report_id" => $report_id,
            "old_status" => $old_status,
            "new_status" => $new_status,
            "updated_at" => date('Y-m-d H:i:s')
        ]
    ];
}

function operationReports($operation, $data = null) {
    switch ($operation) {
        case "insert":
            if ($data) {
             $res = addCompleteReport($data);
                echo json_encode($res);
            } else {
                echo json_encode(["status" => "error", "message" => $data]);
            }
            break;
        case "update":
            if ($data && isset($data['report_id'])) {
              echo json_encode( updateReport($data['report_id'], $data));
            } else {
                echo json_encode(["status" => "error", "message" => "بيانات غير كافية للتعديل"]);
            }
            break;
        case "delete":
            if (isset($_GET['where'])) {
                // استخراج report_id من شرط WHERE
                preg_match("/report_id\s*=\s*'([^']+)'/", $_GET['where'], $matches);
                if (isset($matches[1])) {
                    $res = deleteReport($matches[1]);
                    echo json_encode($res);
                } else {
                    echo json_encode(["status" => "error", "message" => "صيغة الشرط غير صحيحة"]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "لم يتم تحديد الشرط"]);
            }
            break;
        case "show":
            echo json_encode(getReports());
            break;
        case "getDashboardStatistics":
            echo json_encode(getDashboardStatistics());
            break;
        case "getLatestPendingReportTypesByDepartments":
            echo json_encode(getLatestPendingReportTypesByDepartments());
            break;
        case "getReportsByDepartmentId":
            echo json_encode(getReportsByDepartmentId(1));
            break;
        case "updateArchive":
            echo json_encode(updateArchive($data));
            break;
        case "updateReportStatus":
            echo json_encode(updateReportStatus($_GET['id'],$_GET['status'],$_GET['user_id']));
            break;
        case "getReportWithDetails":
          $id = $_GET['id'];
            echo json_encode(getReportWithDetails($id));
            break;
        case "getDepartmentMonthlyPerformance":
            echo json_encode(getDepartmentMonthlyPerformance());
            break;
        case "getAllReportNumbers":
            echo json_encode(getAllReportNumbers());
            break;
        case "getPendingManagementReportsByDepartment":
          if(isset($_GET['data']) && isset($_GET['data']['limit'])) {
          $da = $_GET['data'];
          $limit = $da["limit"];
            echo json_encode(getPendingManagementReportsByDepartment(1,$limit)); } else {
              echo json_encode(getPendingManagementReportsByDepartment(1));
            }
          
            break;
        case "getAllDepartmentReports":
          $status = $_GET['status'];
          $limit = $_GET["limit"];
           echo json_encode(getAllDepartmentReports($limit,$status));
         break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}

?>