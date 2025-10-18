
مرح Gemini، لدي قاعدة بيانات SQL تحتوي على جداول العملاء ، التالية واجهة React لعرض البيانات. أريد مساعدتك في تعديل الاستعلامات وعرض النتائج بشكل ديناميكي.


قاعدة البيانات: departments_system
الجداول والحقول
1. checkpoints
id (int, PK, AUTO_INCREMENT)

name (varchar(100))

created_at (datetime, default=current_timestamp)

2. department

id (int, PK, AUTO_INCREMENT)

department_name (varchar(100))

address (varchar(70))

created_at (datetime, default=current_timestamp)

neighborhoods_id (int, FK → neighborhoods.id)

districts_id (int, FK → districts.id)


3. districts

id (int, PK, AUTO_INCREMENT)

name (varchar(255))

governorate_id (int, FK → governorates.id)


4. employees

employee_id (int, PK, AUTO_INCREMENT)

name_full (varchar(110))

username (varchar(50))

password (varchar(255))

email (varchar(100))

number_phone (varchar(20))

position_type (varchar(60))

created_at (datetime, default=current_timestamp)

department_id (int, FK → department.id)


5. governorates

id (int, PK, AUTO_INCREMENT)

name (varchar(255))


6. neighborhoods

id (int, PK, AUTO_INCREMENT)

name (varchar(15))

district_id (int, FK → districts.id)


7. reporters

id (int, PK, AUTO_INCREMENT)

name_reporter (varchar(100))

phone_reporter (varchar(20), NULLABLE)

email_reporter (varchar(100))

id_national_reporter (varchar(20))

address_reporter (varchar(255))

districts_id (int, FK → districts.id)

neighborhoods_id (int, FK → neighborhoods.id)


8. reports

report_id (int, PK, AUTO_INCREMENT)

created_at (datetime, default=current_timestamp)

description (text)

main_id (int, FK → report_main_types.id)

sub_id (int, FK → report_sub_types.id)

status_report (enum: opened, closed, prosse)

districts_id (int, FK → districts.id)

neighborhoods_id (int, FK → neighborhoods.id)


9. report_department

report_id (int, FK → reports.report_id)

department_id (int, FK → department.id)

created_at (timestamp, default=current_timestamp)


10. report_main_types

id (int, PK, AUTO_INCREMENT)

type_name (varchar(100))


11. report_sub_types

id (int, PK, AUTO_INCREMENT)

main_type_id (int, FK → report_main_types.id)

sub_type_name (varchar(100))


12. report_reporter

report_id (int, FK → reports.report_id)

reporter_id (int, FK → reporters.id)


13. report_suspect

report_id (int, FK → reports.report_id)

suspect_id (int, FK → suspects.id)


14. suspects

id (int, PK, AUTO_INCREMENT)

full_name (varchar(230))

phone (varchar(20))

gender (enum: ذكر, انثى)

address (varchar(255))

status (enum: Wanted, Arrested, Cleared)

age (int)

created_at (datetime, default=current_timestamp)

national_id (varchar(15))

districts_id (int, FK → districts.id)

neighborhoods_id (int, FK → neighborhoods.id)



---

العلاقات بين الجداول (FKs)

department.districts_id → districts.id

department.neighborhoods_id → neighborhoods.id

districts.governorate_id → governorates.id

employees.department_id → department.id

logs_activity.id_user → employees.employee_id

neighborhoods.district_id → districts.id

reporters.districts_id → districts.id

reporters.neighborhoods_id → neighborhoods.id

reports.main_id → report_main_types.id

reports.sub_id → report_sub_types.id

reports.districts_id → districts.id

reports.neighborhoods_id → neighborhoods.id

report_department.report_id → reports.report_id

report_department.department_id → department.id

report_reporter.reporter_id → reporters.id

report_reporter.report_id → reports.report_id

report_sub_types.main_type_id → report_main_types.id

report_suspect.report_id → reports.report_id

report_suspect.suspect_id → suspects.id

suspects.districts_id → districts.id

suspects.neighborhoods_id → neighborhoods.id


وهذا شكل الكود الخاص بتنفيذ اكواد  الخلفييه هذا شكل الهيكل الاساسي فعندما اقول لك ان تعدل بيانات لجدول ما او تنشي وضائف لجدول ما اجعله بنفس هذا الشكل مع النسمية المناسبة 

<?php

// =====================
// 1️⃣ دالة إضافة تقرير
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
    
    try {
        // 1. إضافة البلاغ
        $stmt = $conn->prepare("
            INSERT INTO reports (description, main_id, sub_id, status_report, districts_id, neighborhoods_id,
            created_at)
            VALUES (?, ?, ?, ?,?,?, NOW())
        ");
        $stmt->bind_param(
            "siisii",
            $reportData['description'],
            $reportData['main_id'],
            $reportData['sub_id'],
            $reportData['status_report'],
            $reportData['districts_reports'], // districts_reports -> districts_id
            $reportData['neighborhoods_reports'] // neighborhoods_reports -> neighborhoods_id
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
        if (!empty($reportData['full_name'])) {
            $stmt = $conn->prepare("
                INSERT INTO suspects (full_name, phone, gender, address, age, national_id, districts_id,
                 neighborhoods_id,
                 created_at)
                VALUES (?, ?, ?, ?,?, ?, ?, ?, NOW())
            ");
            $stmt->bind_param(
                "ssssisii",
                $reportData['full_name'],
                $reportData['phone'],
                $reportData['gender'],
                $reportData['address'],
                $reportData['age'],
                $reportData['national_id'],
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

// =====================
// 2️⃣ دالة تعديل تقرير
// =====================
function updateReport($id, $data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("
        UPDATE reports SET status_report=?, description=?, main_id=?, sub_id=? WHERE report_id=?
    ");

    $stmt->bind_param(
        "ssiis",
        $data['status_report'],
        $data['description'],
        $data['main_id'],
        $data['sub_id'],
        $id
    );

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $result = ["status" => "success", "message" => "تم تعديل التقرير بنجاح"];
        } else {
            $result = ["status" => "warning", "message" => "لم يتم تعديل أي بيانات"];
        }
    } else {
        $result = ["status" => "error", "message" => $stmt->error];
    }

    $stmt->close();
    $conn->close();

    return $result;
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
    SELECT r.*, rm.type_name, rs.sub_type_name, d.name AS districts_reports, n.name AS neighborhoods_reports
    FROM reports r
    LEFT JOIN report_main_types rm ON r.main_id = rm.id
    LEFT JOIN report_sub_types rs ON r.sub_id = rs.id
    LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
    LEFT JOIN districts d ON r.districts_id = d.id
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

function sendOperation($operation, $data = null) {
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
                $res = updateReport($data['report_id'], $data);
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
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}

?>
وهذا ملف php الرئيسي

<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include("reports.php");
include("report_main_types.php");
include("report_sub_types.php");
include("neighborhoods.php");
include("departmentReportsTable.php");
include("alerts.php");
include("suspect.php");
// الحصول على البيانات من GET أو POST


$table = $_GET['tableName'];
$operation = $_GET['operation'];


// الحصول على البيانات المرسلة في body
$input = json_decode(file_get_contents('php://input'), true);

switch ($table) {
    case "reports":
        if ($operation === "insert" || $operation ==="update") {
            sendOperation($operation, $input);
        } else {
            sendOperation($operation);
        }
        break;
    case "report_main_types":
        operation_report_main_types($operation);
        break;
    case "report_sub_types":
        operation_report_sub_types($operation);
        break;
    case "suspect":
        operation_report_sub_types($operation);
        break;
    case "neighborhoods":
        operation_neighborhoods($operation);
        break;
    case "department_statistics":
        operation_department_statistics($operation);
        break;
    case "police_alerts":
        sendAlertOperation($operation);
        break;
    case "suspect":
        operation_suspects($operation);
        break;
    default:
        echo json_encode(["error" => "الجدول غير موجود"]);
}

?>



--- كود الواجهة ---
[React/mui هنا]

import { useMemo,useEffect,useState} from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

import axios from 'axios';

//example data type
type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};


const getDepartment_statistics = async () => {
      const response = await axios.get('http://127.0.0.1:8084', {
        params: { tableName: "department_statistics", operation: "show" }
      });
      alert(JSON.stringify(response.data),2,null);
      return response.data;
      
};
//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const SuspectsTable = () => {
  
  const [data, setData] = useState([]);
  
 useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await getDepartment_statistics();
      setData(result); // النتيجة الفعلية من السيرفر
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
    }
  };

  fetchData();
}, []);
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'اسم المشتبهه به',
        size: 150,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        size: 150,
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'حالة المشتبهه به',
        size: 200,
      },
      {
        accessorKey: 'city',
        header: 'عدد البلاغات المرتبطة به',
        size: 150,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 150,
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return <MaterialReactTable table={table} />;
};

export default SuspectsTable;

