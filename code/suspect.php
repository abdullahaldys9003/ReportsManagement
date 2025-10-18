<?php
// تأكد من عدم وجود أي إخراج قبل هذا الهيدر
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// =====================
// 1️⃣ دالة إضافة مشتبه به
// =====================
function addSuspect($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        INSERT INTO suspects (full_name, phone, gender, address, status, age, national_id, districts_id, neighborhoods_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    $stmt->bind_param(
        "sssssisii",
        $data['full_name'],
        $data['phone'],
        $data['gender'],
        $data['address'],
        $data['status'],
        $data['age'],
        $data['national_id'],
        $data['districts_id'],
        $data['neighborhoods_id']
    );

    if ($stmt->execute()) {
        $newId = $conn->insert_id;
        $result = ["status" => "success", "message" => "تمت إضافة المشتبه به بنجاح", "id" => $newId];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();

    return $result;
}

// =====================
// 2️⃣ دالة تعديل مشتبه به
// =====================
function updateSuspect($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        UPDATE suspects SET 
            full_name = ?, phone = ?, gender = ?, address = ?, status = ?, 
            age = ?, national_id = ?, districts_id = ?, neighborhoods_id = ? 
        WHERE id = ?
    ");

    $stmt->bind_param(
        "sssssisiii",
        $data['full_name'], $data['phone_number'], $data['gender'], $data['address'], $data['status'],
        $data['age'], $data['national_id'], $data['districts_id'], $data['neighborhoods_id'], $id
    );

    if ($stmt->execute()) {
        $result = $stmt->affected_rows > 0 ?
            ["status" => "success", "message" => "تم تعديل بيانات المشتبه به بنجاح"] :
            ["status" => "warning", "message" => "لم يتم تعديل أي بيانات"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 3️⃣ دالة حذف مشتبه به
// =====================
function deleteSuspect($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("DELETE FROM suspects WHERE id=?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $result = $stmt->affected_rows > 0 ?
            ["status" => "success", "message" => "تم حذف المشتبه به بنجاح"] :
            ["status" => "warning", "message" => "لم يتم العثور على المشتبه به"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }
    
    $stmt->close();
    $conn->close();
    return $result;
}

// =====================
// 4️⃣ دالة عرض جميع المشتبه بهم
// =====================
function getSuspects($id = null) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    // إعداد الاستعلام الأساسي
$sql = "
    SELECT 
        s.*, 
        d.name AS district_name, 
        n.name AS neighborhood_name,
        r.report_number AS ReportNumber,
        rs.report_id AS report_suspect_id
    FROM suspects s
    INNER JOIN report_suspect rs ON s.id = rs.suspect_id
    INNER JOIN reports r ON rs.report_id = r.report_id  -- ✅ JOIN مهم
    LEFT JOIN districts d ON s.districts_id = d.id
    LEFT JOIN neighborhoods n ON s.neighborhoods_id = n.id
";

    // إذا تم تمرير id، نضيف شرط WHERE
    if ($id !== null) {
        $id = (int)$id; // تأكد من تحويله إلى عدد صحيح لتجنب SQL Injection
        $sql .= " WHERE s.id = $id";
    }

    $sql .= " ORDER BY s.created_at DESC";

    $result = $conn->query($sql);
    $suspects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $suspects[] = $row;
        }
    }

    $conn->close();
    return $suspects;
}
function getNotificationSuspects($id = null) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    // إعداد الاستعلام الأساسي
    $sql = "
        SELECT s.*, d.name AS district_name, n.name AS neighborhood_name
        FROM suspects s
        LEFT JOIN districts d ON s.districts_id = d.id
        LEFT JOIN neighborhoods n ON s.neighborhoods_id = n.id
    ";

    // إذا تم تمرير id، نضيف شرط WHERE
    if ($id !== null) {
        $id = (int)$id; // تأكد من تحويله إلى عدد صحيح لتجنب SQL Injection
        $sql .= " WHERE s.id = $id";
    }

    $sql .= " ORDER BY s.created_at DESC";

    $result = $conn->query($sql);
    $suspects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $suspects[] = $row;
        }
    }

    $conn->close();
    return $suspects;
}

function getAllReportsWidt($id = null) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    // إعداد الاستعلام الأساسي
    $sql = "
        SELECT 
    r.report_id,
    r.description,
    r.created_at,
    r.status_report,
    mt.type_name AS main_type,
    st.sub_type_name AS sub_type,
    d.department_name,
    dis.name AS district_name,
    n.name AS neighborhood_name,
    -- معلومات المبلغ
    rp.name_reporter,
    rp.phone_reporter,
    rp.id_national_reporter,
    -- معلومات المشتبه به
    s.full_name AS suspect_name,
    s.phone AS suspect_phone,
    s.status AS suspect_status
FROM reports r
INNER JOIN report_main_types mt ON r.main_id = mt.id
INNER JOIN report_sub_types st ON r.sub_id = st.id
INNER JOIN districts dis ON r.districts_id = dis.id
INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
INNER JOIN report_department rd ON r.report_id = rd.report_id
INNER JOIN department d ON rd.department_id = d.id
LEFT JOIN report_reporter rr ON r.report_id = rr.report_id
LEFT JOIN reporters rp ON rr.reporter_id = rp.id
LEFT JOIN report_suspect rs ON r.report_id = rs.report_id
LEFT JOIN suspects s ON rs.suspect_id = s.id
WHERE d.id = 1  -- تغيير الرقم حسب القسم المطلوب
ORDER BY r.created_at DESC";

    $result = $conn->query($sql);
    $suspects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $suspects[] = $row;
        }
    }

    $conn->close();
    return $suspects;
}

/*
function getSuspectByCard($cardNumber) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        SELECT s.*, d.name AS district_name, n.name AS neighborhood_name
        FROM suspects s
        LEFT JOIN districts d ON s.districts_id = d.id
        LEFT JOIN neighborhoods n ON s.neighborhoods_id = n.id
        WHERE s.national_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $cardNumber);
    $stmt->execute();
    $result = $stmt->get_result();

    $suspect = $result->fetch_assoc(); // إذا لم يوجد سيكون null

    $stmt->close();
    $conn->close();

    return $suspect;
}*/

function getSuspectByCard($cardNumber) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        SELECT
            s.full_name AS 'FullName',
            s.national_id AS 'NationalID',
            s.phone AS 'PhoneNumber',
            s.age AS 'Age',
            s.gender AS 'Gender',
            s.status AS 'Status',
            s.address AS 'Address',
            d.name AS 'District',
            n.name AS 'Neighborhood',
            r.report_id AS 'ReportNumber',
            DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS 'ReportDate',
            r.description AS 'ReportDescription',
            rmt.type_name AS 'MainReportType',
            rst.sub_type_name AS 'SubType',
            CASE 
                WHEN r.status_report = 'opened' THEN 'Open'
                WHEN r.status_report = 'closed' THEN 'Closed'
                WHEN r.status_report = 'prosse' THEN 'InProgress'
            END AS 'ReportStatus'
        FROM suspects s
        LEFT JOIN report_suspect rs ON s.id = rs.suspect_id
        LEFT JOIN reports r ON rs.report_id = r.report_id
        LEFT JOIN report_main_types rmt ON r.main_id = rmt.id
        LEFT JOIN report_sub_types rst ON r.sub_id = rst.id
        LEFT JOIN districts d ON s.districts_id = d.id
        LEFT JOIN neighborhoods n ON s.neighborhoods_id = n.id
        WHERE s.national_id = ?
        LIMIT 1
    ");
    $stmt->bind_param("s", $cardNumber);
    $stmt->execute();
    $result = $stmt->get_result();

    $suspect = $result->fetch_assoc(); // إذا لم يوجد سيكون null

    $stmt->close();
    $conn->close();

    return $suspect;
}
/*
function getSuspectByName($fullName) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        SELECT
            s.full_name AS 'FullName',
            s.national_id AS 'NationalID',
            s.phone AS 'PhoneNumber',
            s.age AS 'Age',
            s.gender AS 'Gender',
            s.status AS 'Status',
            s.address AS 'Address',
            d.name AS 'District',
            n.name AS 'Neighborhood',
            r.report_id AS 'ReportNumber',
            DATE_FORMAT(r.created_at, '%Y-%m-%d %H:%i') AS 'ReportDate',
            r.description AS 'ReportDescription',
            rmt.type_name AS 'MainReportType',
            rst.sub_type_name AS 'SubType',
            CASE 
                WHEN r.status_report = 'opened' THEN 'Open'
                WHEN r.status_report = 'closed' THEN 'Closed'
                WHEN r.status_report = 'prosse' THEN 'InProgress'
            END AS 'ReportStatus'
        FROM suspects s
        LEFT JOIN report_suspect rs ON s.id = rs.suspect_id
        LEFT JOIN reports r ON rs.report_id = r.report_id
        LEFT JOIN report_main_types rmt ON r.main_id = rmt.id
        LEFT JOIN report_sub_types rst ON r.sub_id = rst.id
        LEFT JOIN districts d ON s.districts_id = d.id
        LEFT JOIN neighborhoods n ON s.neighborhoods_id = n.id
        WHERE s.full_name LIKE ?
        LIMIT 1
    ");

    $searchName = "%$fullName%"; // للبحث الجزئي عن الاسم
    $stmt->bind_param("s", $searchName);
    $stmt->execute();
    $result = $stmt->get_result();

    $suspect = $result->fetch_assoc();

    $stmt->close();
    $conn->close();

    return $suspect;
}
*/

function getSuspectById($reportId) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
    
    $sql = "SELECT 
        s.id,
        s.full_name,
        s.phone AS 'phone_number',
        s.national_id AS 'national_id',
        s.address AS 'address',
        s.age AS 'age',
        s.gender AS 'gender',
        s.status AS 'status',
        d.name AS 'district',
        neighborhoods_id,
        districts_id,
        n.name AS 'neighborhood',
        g.name AS 'governorate',
        s.created_at AS 'created_date'
    FROM suspects s
    INNER JOIN report_suspect rs ON s.id = rs.suspect_id
    INNER JOIN districts d ON s.districts_id = d.id
    INNER JOIN neighborhoods n ON s.neighborhoods_id = n.id
    INNER JOIN governorates g ON d.governorate_id = g.id
    WHERE rs.report_id = $reportId
    ORDER BY s.id";

    $result = $conn->query($sql);
    $suspects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $suspects[] = $row;
        }
    }

    $conn->close();
    return $suspects;
}
function getSuspectByReportId($reportId) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
    
    $sql = "SELECT 
        s.id,
        s.full_name,
        s.phone,
        s.national_id AS 'national_id',
        s.address AS 'address',
        s.age AS 'age',
        s.gender AS 'gender',
        s.status AS 'status',
        d.name AS 'district_name',
        neighborhoods_id,
        districts_id,
        n.name AS 'neighborhood_name',
        g.name AS 'governorate',
        s.created_at AS 'created_date'
    FROM suspects s
    INNER JOIN report_suspect rs ON s.id = rs.suspect_id
    INNER JOIN districts d ON s.districts_id = d.id
    INNER JOIN neighborhoods n ON s.neighborhoods_id = n.id
    INNER JOIN governorates g ON d.governorate_id = g.id
    WHERE rs.report_id = $reportId
    ORDER BY s.id";

    $result = $conn->query($sql);
    $suspects = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $suspects[] = $row;
        }
    }

    $conn->close();
    return $suspects;
}

function getReporterByReportId($reportId) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");
    
    $sql = "SELECT 
        rp.id AS 'reporter_id',
        rp.name_reporter AS 'reporter_name',
        rp.phone_reporter AS 'reporter_phone',
        rp.email_reporter AS 'reporter_email',
        rp.id_national_reporter AS 'reporter_national_id',
        rp.address_reporter AS 'reporter_address',
          rp.neighborhoods_id,
          rp.districts_id,
        d.name AS 'district',
        n.name AS 'neighborhood',
        g.name AS 'governorate'
    FROM reporters rp
    INNER JOIN report_reporter rr ON rp.id = rr.reporter_id
    INNER JOIN reports r ON rr.report_id = r.report_id
    INNER JOIN districts d ON rp.districts_id = d.id
    INNER JOIN neighborhoods n ON rp.neighborhoods_id = n.id
    INNER JOIN governorates g ON d.governorate_id = g.id
    WHERE r.report_id = $reportId";

    $result = $conn->query($sql);
    $reporterData = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $reporterData[] = $row;
        }
    }

    $conn->close();
    return $reporterData;
}


function updateSuspectStatus($id,$status) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE suspects SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        $result = $stmt->affected_rows > 0 ?
            ["status" => "success", "message" => "تم تحديث الحالة بنجاح"] :
            ["status" => $status , "message" => "لم يتم العثور على المشتبه به"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

function updateReportsStatus($id,$status) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE reports SET status_report = ? WHERE report_id = ?");
    $stmt->bind_param("si", $status, $id);

    if ($stmt->execute()) {
        $result = $stmt->affected_rows > 0 ?
            ["status" => "success", "message" => "تم تحديث الحالة بنجاح"] :
            ["status" => $status , "message" => "لم يتم العثور على المشتبه به"];
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();
    return $result;
}

function getAllReports($id = null) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return [];
    $conn->set_charset("utf8mb4");

    $sql = "
        SELECT 
            r.report_id,
            r.description,
            r.created_at,
            r.status_report,
            mt.type_name AS main_type,
            st.sub_type_name AS sub_type,
            st.id AS report_sub_id,
            mt.id AS report_main_id,
            dis.id AS districts_id,
            n.id AS neighborhoods_id,
            d.department_name,
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

    if ($id !== null) {
        $id = (int)$id;
        $sql .= " WHERE r.report_id = $id";
    }

    $sql .= " ORDER BY r.created_at DESC";

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
// 🚀 موجه العمليات
// =====================
function operation_suspects($operation, $data = null) {
    switch ($operation) {
        case "insert":
            echo json_encode($data ? addSuspect($data) : ["status" => "error", "message" => "لا توجد بيانات للإضافة"]);
            break;
        case "update":
            echo json_encode($data && isset($data['id']) ? updateSuspect($data['id'], $data) : ["status" => "error", "message" => "بيانات غير كافية للتعديل"]);
            break;
        case "delete":
            echo json_encode($data && isset($data['id']) ? deleteSuspect($data['id']) : ["status" => "error", "message" => "لم يتم تحديد ID للحذف"]);
            break;
        case "show":
            echo json_encode(getSuspects());
            break;
        case "showById":
            $id = $_GET['id'];
          if($id){
             echo json_encode(getSuspectById($id));
          } else {
            $id= $data['id'];
            echo json_encode(getSuspectById($id));
          }
            break;
        case "getNotificationSuspects":
        //  $id = $_GET['id'];
            $id= $data['id'];
            echo json_encode(getNotificationSuspects($id));
            break;
        case "getSuspectByCard":
        //  $id = $_GET['id'];
            $national_id= $data['national_id'];
            echo json_encode(getSuspectByCard($national_id));
            break;
        case "showAllReports":
            echo json_encode(getAllReports());
            break;
        case "showByReportId":
            $id = $_GET['id'];
            echo json_encode(getReporterByReportId($id));
            break;
        case "getSuspectByReportId":
          $id = $_GET['id'];
           if($id) {
             echo json_encode(getSuspectByReportId($id));
             }
            break;
        case "updateStatus":
    echo json_encode(updateSuspectStatus($data['id'], $data['status']));
    break;
      case "updateReportsStatus":
       $id = $_GET['id'];
       $status = $_GET['status'];
    echo json_encode(updateReportsStatus($id, $status));
    break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للمشتبه بهم"]);
    }
}
?>