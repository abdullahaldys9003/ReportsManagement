<?php
/*
function addCompleteReportAll($reportData) {
    $departmentId = 1; // غير هنا إلى departmentIds
    $userId = 2;
    
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");
    
    $conn->begin_transaction();
    
    try {
        // 1. إنشاء رقم البلاغ الفريد
        $reportNumber = createReportNumber();
        
        // 2. إضافة البلاغ
        $reportId = insertReport($conn, $reportData, $reportNumber);
        
        // 3. إضافة المبلغ
        $reporterId = insertReporter($conn, $reportData);
        
        // 4. إضافة المبلغ عنه (إذا وجد)
        $suspectId = insertSuspect($conn, $reportData);
        
        // 5. ربط البلاغ بالمبلغ
        connectReportReporter($conn, $reportId, $reporterId);
        
        // 6. ربط البلاغ بالمبلغ عنه (إذا وجد)
        if ($suspectId) {
            connectReportSuspect($conn, $reportId, $suspectId);
        }
        
        // 7. ربط البلاغ بالأقسام
        connectReportDepartment($conn, $reportId, $departmentId);
        
        // 8. إضافة سجل النشاط
        insertActivityLog($conn, $userId, $reportId);
        
        $conn->commit();
        
        return [
            "status" => "success", 
            "message" => "تم إضافة البلاغ كاملاً بنجاح",
            "report_id" => $reportId,
            "report_number" => $reportNumber,
            "reporter_id" => $reporterId,
            "suspect_id" => $suspectId
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        return ["status" => "error", "message" => "فشل في إضافة البلاغ: " . $e->getMessage()];
    } finally {
        $conn->close();
    }
}

// =====================
// الدوال المساعدة
// =====================


function createReportNumber() {
    return 'RPT-' . date('Ymd-His') . '-' . rand(100, 999);
}


function insertReport($conn, $reportData, $reportNumber) {
    $stmt = $conn->prepare("
        INSERT INTO reports (
            report_number, description, main_id, sub_id, status_report, 
            districts_id, neighborhoods_id, created_at, archive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    ");
    
    $stmt->bind_param(
        "ssiisiii",
        $reportNumber,
        $reportData['description'],
        $reportData['main_id'],
        $reportData['sub_id'],
        $reportData['status_report'],
        $reportData['districts_reports'],
        $reportData['neighborhoods_reports'],
        $reportData['archive']
    );
    
    $stmt->execute();
    $reportId = $conn->insert_id;
    $stmt->close();
    
    return $reportId;
}


 
function insertReporter($conn, $reportData) {
    $stmt = $conn->prepare("
        INSERT INTO reporters (
            name_reporter, phone_reporter, email_reporter, id_national_reporter, 
            address_reporter, districts_id, neighborhoods_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    //phone_reporter
    //email_reporter
    //id_national_reporter
    //address_reporter
    //districts_reporter
    //neighborhoods_reporter
    
    $stmt->bind_param(
        "sssssii",
        $reportData['name_reporter'],
        $reportData['phone_reporter'],
        $reportData['email_reporter'],
        $reportData['id_national_reporter'],
        $reportData['address_reporter'],
        $reportData['districts_reporter'],
        $reportData['neighborhoods_reporter']
    );
    
    $stmt->execute();
    $reporterId = $conn->insert_id;
    $stmt->close();
    
    return $reporterId;
}


function insertSuspect($conn, $reportData) {
    if (empty($reportData['full_name'])) {
        return null;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO suspects (
            full_name, phone, gender, address, age, national_id, 
            districts_id, neighborhoods_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    $stmt->bind_param(
        "ssssisii",
        $reportData['full_name'],
        $reportData['phone'],
        $reportData['gender'],
        $reportData['address'],
        $reportData['age'],
        $reportData['national_id'],
        $reportData['district_suspects'],
        $reportData['neighborhood_suspects']
    );
    
    $stmt->execute();
    $suspectId = $conn->insert_id;
    $stmt->close();
    
    return $suspectId;
}


function connectReportReporter($conn, $reportId, $reporterId) {
    $stmt = $conn->prepare("INSERT INTO report_reporter (report_id, reporter_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $reportId, $reporterId);
    $stmt->execute();
    $stmt->close();
}


function connectReportSuspect($conn, $reportId, $suspectId) {
    $stmt = $conn->prepare("INSERT INTO report_suspect (report_id, suspect_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $reportId, $suspectId);
    $stmt->execute();
    $stmt->close();
}


function connectReportDepartment($conn, $reportId, $departmentId) {
    $stmt = $conn->prepare("INSERT INTO report_department (report_id, department_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $reportId, $departmentId);
    $stmt->execute();
    $stmt->close();
}


function insertActivityLog($conn, $userId, $reportId) {
    $stmt = $conn->prepare("
        INSERT INTO logs_activity (id_user, table_target, id_record, action, createdAt)
        VALUES (?, 'reports', ?, 'create', NOW())
    ");
    $stmt->bind_param("ii", $userId, $reportId);
    $stmt->execute();
    $stmt->close();
}

function operationReportManagement($operation, $data = null) {
    switch ($operation) {
        case "addCompleteReport":
            if ($data) {
             $res = addCompleteReportAll($data);
                echo json_encode($res);
            } else {
                echo json_encode(["status" => "error", "message" => $data]);
            }
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}
*/



function addCompleteReportAll($reportData) {
    $departmentId = 1; // غير هنا إلى departmentIds
    $userId = 2;
    
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) {
        return ["status" => "error", "message" => "فشل الاتصال: " . $conn->connect_error];
    }
    $conn->set_charset("utf8mb4");
    
    $conn->begin_transaction();
    
    try {
        // 1. إنشاء رقم البلاغ الفريد
        $reportNumber = createReportNumber();
        
        // 2. إضافة البلاغ الرئيسي
        $reportId = insertReport($conn, $reportData['report_data'], $reportNumber);
        
        // 3. إضافة المبلغين (مصفوفة)
        $reporterIds = insertReporters($conn, $reportData['reporters']);
        
        // 4. إضافة المبلغ عنهم (مصفوفة)
        $suspectIds = insertSuspects($conn, $reportData['reported_persons']);
        
        // 5. ربط البلاغ بالمبلغين
        connectReportReporters($conn, $reportId, $reporterIds);
        
        // 6. ربط البلاغ بالمبلغ عنهم
        if (!empty($suspectIds)) {
            connectReportSuspects($conn, $reportId, $suspectIds);
        }
        
        // 7. ربط البلاغ بالأقسام
        connectReportDepartment($conn, $reportId, $departmentId);
        
        // 8. إضافة سجل النشاط
        insertActivityLog($conn, $userId, $reportId);
        
        $conn->commit();
        
        return [
            "status" => "success", 
            "message" => "تم إضافة البلاغ كاملاً بنجاح",
            "report_id" => $reportId,
            "report_number" => $reportNumber,
            "reporter_ids" => $reporterIds,
            "suspect_ids" => $suspectIds
        ];
        
    } catch (Exception $e) {
        $conn->rollback();
        return ["status" => "error", "message" => "فشل في إضافة البلاغ: " . $e->getMessage()];
    } finally {
        $conn->close();
    }
}

// =====================
// الدوال المساعدة المعدلة
// =====================

/**
 * إنشاء رقم بلاغ فريد
 */
function createReportNumber() {
    return 'RPT-' . date('Ymd-His') . '-' . rand(100, 999);
}

/**
 * إضافة البلاغ الرئيسي
 */
function insertReport($conn, $reportData, $reportNumber) {
    $stmt = $conn->prepare("
        INSERT INTO reports (
            report_number, description, main_id, sub_id, status_report, 
            districts_id, neighborhoods_id, created_at, archive
        ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
    ");
    
    $stmt->bind_param(
        "ssiisiii",
        $reportNumber,
        $reportData['description'],
        $reportData['main_id'],
        $reportData['sub_id'],
        $reportData['status_report'],
        $reportData['districts_reports'],
        $reportData['neighborhoods_reports'],
        $reportData['archive']
    );
    
    $stmt->execute();
    $reportId = $conn->insert_id;
    $stmt->close();
    
    return $reportId;
}

/**
 * إضافة المبلغين (مصفوفة)
 */
function insertReporters($conn, $reporters) {
    $reporterIds = [];
    
    $stmt = $conn->prepare("
        INSERT INTO reporters (
            name_reporter, phone_reporter, email_reporter, id_national_reporter, 
            address_reporter, districts_id, neighborhoods_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    foreach ($reporters as $reporter) {
        $stmt->bind_param(
            "sssssii",
            $reporter['name_reporter'],
            $reporter['phone_reporter'],
            $reporter['email_reporter'],
            $reporter['id_national_reporter'],
            $reporter['address_reporter'],
            $reporter['districts_reporter'],
            $reporter['neighborhoods_reporter']
        );
        
        $stmt->execute();
        $reporterIds[] = $conn->insert_id;
    }
    
    $stmt->close();
    return $reporterIds;
}

/**
 * إضافة المبلغ عنهم (مصفوفة)
 */
function insertSuspects($conn, $suspects) {
    $suspectIds = [];
    
    if (empty($suspects)) {
        return $suspectIds;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO suspects (
            full_name, phone, gender, address, age, national_id, 
            districts_id, neighborhoods_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    foreach ($suspects as $suspect) {
        // التحقق من وجود البيانات الأساسية
        if (empty($suspect['full_name'])) {
            continue; // تخطي إذا لم يكن هناك اسم
        }
        
        $stmt->bind_param(
            "ssssisii",
            $suspect['full_name'],
            $suspect['phone'],
            $suspect['gender'],
            $suspect['address'],
            $suspect['age'],
            $suspect['national_id'],
            $suspect['district_suspects'],
            $suspect['neighborhood_suspects']
        );
        
        $stmt->execute();
        $suspectIds[] = $conn->insert_id;
    }
    
    $stmt->close();
    return $suspectIds;
}

/**
 * ربط البلاغ بالمبلغين (مصفوفة)
 */
function connectReportReporters($conn, $reportId, $reporterIds) {
    $stmt = $conn->prepare("INSERT INTO report_reporter (report_id, reporter_id) VALUES (?, ?)");
    
    foreach ($reporterIds as $reporterId) {
        $stmt->bind_param("ii", $reportId, $reporterId);
        $stmt->execute();
    }
    
    $stmt->close();
}

/**
 * ربط البلاغ بالمبلغ عنهم (مصفوفة)
 */
function connectReportSuspects($conn, $reportId, $suspectIds) {
    $stmt = $conn->prepare("INSERT INTO report_suspect (report_id, suspect_id) VALUES (?, ?)");
    
    foreach ($suspectIds as $suspectId) {
        $stmt->bind_param("ii", $reportId, $suspectId);
        $stmt->execute();
    }
    
    $stmt->close();
}

/**
 * ربط البلاغ بالقسم
 */
function connectReportDepartment($conn, $reportId, $departmentId) {
    $stmt = $conn->prepare("INSERT INTO report_department (report_id, department_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $reportId, $departmentId);
    $stmt->execute();
    $stmt->close();
}

/**
 * إضافة سجل النشاط
 */
function insertActivityLog($conn, $userId, $reportId) {
    $stmt = $conn->prepare("
        INSERT INTO logs_activity (id_user, table_target, id_record, action, createdAt)
        VALUES (?, 'reports', ?, 'create', NOW())
    ");
    $stmt->bind_param("ii", $userId, $reportId);
    $stmt->execute();
    $stmt->close();
}

function operationReportManagement($operation, $data = null) {
    switch ($operation) {
        case "addCompleteReport":
            if ($data) {
                // التحقق من هيكل البيانات
                if (!isset($data['report_data']) || !isset($data['reporters']) || !isset($data['reported_persons'])) {
                    echo json_encode(["status" => "error", "message" => "هيكل البيانات غير صحيح"]);
                    return;
                }
                
                $res = addCompleteReportAll($data);
                echo json_encode($res);
            } else {
                echo json_encode(["status" => "error", "message" => "لا توجد بيانات"]);
            }
            break;
        default:
            echo json_encode(["status" => "error", "message" => "عملية غير معروفة للتقارير"]);
    }
}

// دالة مساعدة للتحقق من البيانات (اختيارية)
function validateReportData($data) {
    $errors = [];
    
    // التحقق من البيانات الأساسية للبلاغ
    if (empty($data['report_data']['description'])) {
        $errors[] = "وصف البلاغ مطلوب";
    }
    
    if (empty($data['report_data']['main_id'])) {
        $errors[] = "نوع البلاغ الرئيسي مطلوب";
    }
    
    // التحقق من وجود مبلغ واحد على الأقل
    if (empty($data['reporters']) || count($data['reporters']) === 0) {
        $errors[] = "يجب وجود مبلغ واحد على الأقل";
    } else {
        // التحقق من بيانات المبلغين
        foreach ($data['reporters'] as $index => $reporter) {
            if (empty($reporter['name_reporter'])) {
                $errors[] = "اسم المبلغ " . ($index + 1) . " مطلوب";
            }
            if (empty($reporter['phone_reporter'])) {
                $errors[] = "هاتف المبلغ " . ($index + 1) . " مطلوب";
            }
        }
    }
    
    return $errors;
}

?>
