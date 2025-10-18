<?php

function addErrorReport($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO error_reports 
        (report_id, field_name, field_label, current_value, suggested_correction, error_description, department_id, user_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->bind_param(
        "isssssii", 
        $data['report_id'],
        $data['field_name'],
        $data['field_label'],
        $data['current_value'],
        $data['suggested_correction'],
        $data['error_description'],
        $data['department_id'],
        $data['user_by']
    );

    if ($stmt->execute()) {
        echo "✅ تم إرسال بلاغ الخطأ بنجاح. ID: " . $conn->insert_id;
    } else {
        echo "❌ خطأ في إرسال بلاغ الخطأ: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 2️⃣ دالة جلب بلاغات الأخطاء
// =====================
function getErrorReports() {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $sql = "SELECT er.*, r.description as report_description,
      d.department_name
            FROM error_reports er 
            LEFT JOIN reports r ON er.report_id = r.report_id 
            LEFT JOIN department d ON er.department_id = d.id
            ORDER BY er.reported_at DESC";
    
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

// =====================
// 3️⃣ دالة تحديث حالة بلاغ الخطأ
// =====================
function updateErrorReportStatus($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("UPDATE error_reports 
        SET status = ?, review_notes = ?, reviewed_at = NOW(), user_by = ? 
        WHERE id = ?");
    
    $stmt->bind_param(
        "ssii", 
        $data['status'],
        $data['review_notes'],
        $data['user_by'],
        $data['id']
    );

    if ($stmt->execute()) {
        echo "✅ تم تحديث حالة بلاغ الخطأ بنجاح";
    } else {
        echo "❌ خطأ في تحديث الحالة: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}

// =====================
// 4️⃣ دالة التصحيح النهائي
// =====================
/*function correctErrorReport($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    // 1. جلب بيانات بلاغ الخطأ
    $errorReport = getErrorReportById($data['id']);
    
    if (!$errorReport) {
        echo "❌ بلاغ الخطأ غير موجود";
        return;
    }

    // 2. تحديث البلاغ الأصلي
    $updateStmt = $conn->prepare("UPDATE reports SET {$errorReport['field_name']} = ? WHERE report_id = ?");
    $updateStmt->bind_param("si", $errorReport['suggested_correction'], $errorReport['report_id']);
    
    if ($updateStmt->execute()) {
        // 3. تحديث حالة بلاغ الخطأ إلى "تم التصحيح"
        $statusStmt = $conn->prepare("UPDATE error_reports SET status = 'corrected', corrected_at = NOW() WHERE id = ?");
        $statusStmt->bind_param("i", $data['id']);
        $statusStmt->execute();
        $statusStmt->close();
        
        echo "✅ تم تصحيح الخطأ بنجاح";
    } else {
        echo "❌ خطأ في تصحيح البيانات: " . $updateStmt->error;
    }

    $updateStmt->close();
    $conn->close();
}
*/

// =====================
// 5️⃣ دالة مساعدة: جلب بلاغ خطأ بواسطة ID
// =====================
function getErrorReportById($id) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("SELECT * FROM error_reports WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $report = $result->fetch_assoc();

    $stmt->close();
    $conn->close();

    return $report;
}


function correctErrorReport($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    // 1. جلب بيانات بلاغ الخطأ
    $errorReport = getErrorReportById($data['id']);
    
    if (!$errorReport) {
        echo "❌ بلاغ الخطأ غير موجود";
        return;
    }

    // 2. التحقق من أن البلاغ معتمد
    if ($errorReport['status'] !== 'approved') {
        echo "❌ يجب اعتماد البلاغ أولاً قبل التصحيح";
        return;
    }

    // 3. تحديد الجدول والحقل الصحيحين بناءً على field_name
    $tableInfo = getTableAndFieldInfo($errorReport['field_name']);
    
    if (!$tableInfo) {
        echo "❌ حقل غير معروف: " . $errorReport['field_name'];
        return;
    }

    // 4. تحديث البيانات في الجدول المناسب
    $updateStmt = $conn->prepare("UPDATE {$tableInfo['table']} SET {$tableInfo['field']} = ? WHERE {$tableInfo['id_field']} = ?");
    $updateStmt->bind_param("si", $errorReport['suggested_correction'], $errorReport['report_id']);
    
    if ($updateStmt->execute()) {
        // 5. تحديث حالة بلاغ الخطأ إلى "تم التصحيح"
        $statusStmt = $conn->prepare("UPDATE error_reports SET status = 'corrected', corrected_at = NOW() WHERE id = ?");
        $statusStmt->bind_param("i", $data['id']);
        $statusStmt->execute();
        $statusStmt->close();
        
        echo "✅ تم تصحيح الخطأ في {$tableInfo['table_arabic']} بنجاح";
    } else {
        echo "❌ خطأ في تصحيح البيانات: " . $updateStmt->error;
    }

    $updateStmt->close();
    $conn->close();
}

// دالة مساعدة لتحديد الجدول والحقل المناسبين
function getTableAndFieldInfo($fieldName) {
    $fieldMappings = [
        'report_id' => [
            'table' => 'reports',
            'field' => 'report_id',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'description' => [
            'table' => 'reports',
            'field' => 'description',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'status_report' => [
            'table' => 'reports', 
            'field' => 'status_report',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'main_id' => [
            'table' => 'reports',
            'field' => 'main_id',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'sub_id' => [
            'table' => 'reports',
            'field' => 'sub_id',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'districts_reports' => [
            'table' => 'reports',
            'field' => 'districts_id',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'neighborhoods_reports' => [
            'table' => 'reports',
            'field' => 'neighborhoods_id',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'created_at' => [
            'table' => 'reports',
            'field' => 'created_at',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],
        'archive' => [
            'table' => 'reports',
            'field' => 'archive',
            'id_field' => 'report_id',
            'table_arabic' => 'البلاغ'
        ],

        // ===================== حقول جدول suspects (المبلغ عنه) =====================
        'full_name' => [
            'table' => 'suspects',
            'field' => 'full_name',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'phone' => [
            'table' => 'suspects',
            'field' => 'phone',
            'id_field' => 'id', 
            'table_arabic' => 'المبلغ عنه'
        ],
        'national_id' => [
            'table' => 'suspects',
            'field' => 'national_id',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'address' => [
            'table' => 'suspects', 
            'field' => 'address',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'age' => [
            'table' => 'suspects',
            'field' => 'age',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'gender' => [
            'table' => 'suspects',
            'field' => 'gender',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'status' => [
            'table' => 'suspects',
            'field' => 'status',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'district_suspects' => [
            'table' => 'suspects',
            'field' => 'districts_id',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],
        'neighborhood_suspects' => [
            'table' => 'suspects',
            'field' => 'neighborhoods_id',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ عنه'
        ],

        // ===================== حقول جدول reporters (المبلغ) =====================
        'name_reporter' => [
            'table' => 'reporters',
            'field' => 'name_reporter',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ'
        ],
        'phone_reporter' => [
            'table' => 'reporters',
            'field' => 'phone_reporter', 
            'id_field' => 'id',
            'table_arabic' => 'المبلغ'
        ],
        'email_reporter' => [
            'table' => 'reporters',
            'field' => 'email_reporter',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ'
        ],
        'id_national_reporter' => [
            'table' => 'reporters',
            'field' => 'id_national_reporter',
            'id_field' => 'id', 
            'table_arabic' => 'المبلغ'
        ],
        'address_reporter' => [
            'table' => 'reporters',
            'field' => 'address_reporter',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ'
        ],
        'districts_reporter' => [
            'table' => 'reporters',
            'field' => 'districts_id',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ'
        ],
        'neighborhoods_reporter' => [
            'table' => 'reporters',
            'field' => 'neighborhoods_id',
            'id_field' => 'id',
            'table_arabic' => 'المبلغ'
        ]
    ];
    
    return $fieldMappings[$fieldName] ?? null;
}
// دالة مساعدة لجلب معرف المبلغ عنه أو المبلغ المرتبط بالبلاغ
function getRelatedRecordId($reportId, $fieldName) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    
    $tableInfo = getTableAndFieldInfo($fieldName);
    $relatedId = null;
    
    if ($tableInfo['table'] === 'suspects') {
        // جلب suspect_id من report_suspect
        $stmt = $conn->prepare("SELECT suspect_id FROM report_suspect WHERE report_id = ?");
        $stmt->bind_param("i", $reportId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $relatedId = $row['suspect_id'];
        }
        $stmt->close();
    } elseif ($tableInfo['table'] === 'reporters') {
        // جلب reporter_id من report_reporter  
        $stmt = $conn->prepare("SELECT reporter_id FROM report_reporter WHERE report_id = ?");
        $stmt->bind_param("i", $reportId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $relatedId = $row['reporter_id'];
        }
        $stmt->close();
    }
    
    $conn->close();
    return $relatedId;
}

// النسخة المحسنة من correctErrorReport
function correctErrorReportEnhanced($data) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) die("فشل الاتصال: " . $conn->connect_error);
    $conn->set_charset("utf8mb4");

    // 1. جلب بيانات بلاغ الخطأ
    $errorReport = getErrorReportById($data['id']);
    
    if (!$errorReport) {
        echo "❌ بلاغ الخطأ غير موجود";
        return;
    }

    // 2. التحقق من أن البلاغ معتمد
    if ($errorReport['status'] !== 'approved') {
        echo "❌ يجب اعتماد البلاغ أولاً قبل التصحيح";
        return;
    }

    // 3. تحديد الجدول والحقل الصحيحين
    $tableInfo = getTableAndFieldInfo($errorReport['field_name']);
    
    if (!$tableInfo) {
        echo "❌ حقل غير معروف: " . $errorReport['field_name'];
        return;
    }

    // 4. تحديد معرف السجل المراد تعديله
    $recordId = $errorReport['report_id']; // الافتراضي للبلاغ نفسه
    
    if ($tableInfo['table'] !== 'reports') {
        // للحقول في جداول أخرى، نحتاج لجلب المعرف المرتبط
        $recordId = getRelatedRecordId($errorReport['report_id'], $errorReport['field_name']);
        if (!$recordId) {
            echo "❌ لم يتم العثور على السجل المرتبط في جدول {$tableInfo['table_arabic']}";
            return;
        }
    }

    // 5. تحديث البيانات في الجدول المناسب
    $updateStmt = $conn->prepare("UPDATE {$tableInfo['table']} SET {$tableInfo['field']} = ? WHERE {$tableInfo['id_field']} = ?");
    $updateStmt->bind_param("si", $errorReport['suggested_correction'], $recordId);
    
    if ($updateStmt->execute()) {
        // 6. تحديث حالة بلاغ الخطأ إلى "تم التصحيح"
        $statusStmt = $conn->prepare("UPDATE error_reports SET status = 'corrected', corrected_at = NOW() WHERE id = ?");
        $statusStmt->bind_param("i", $data['id']);
        $statusStmt->execute();
        $statusStmt->close();
        
        echo "✅ تم تصحيح الخطأ في {$tableInfo['table_arabic']} بنجاح";
    } else {
        echo "❌ خطأ في تصحيح البيانات: " . $updateStmt->error;
    }

    $updateStmt->close();
    $conn->close();
}


// =====================
// 6️⃣ الدالة الرئيسية للعمليات
// =====================
function operation_error_reports($operation, $data = []) {
    switch ($operation) {
        case "addErrorReport":
            addErrorReport($data);
            break;
            
        case "getErrorReports":
            echo json_encode(getErrorReports());
            break;
            
        case "updateErrorReportStatus":
            updateErrorReportStatus($data);
            break;
            
        case "correctErrorReport":
            correctErrorReport($data);
            break;
            
        case "getErrorReportById":
            echo json_encode(getErrorReportById($data['id']));
            break;
            
        default:
            echo "العمليات المتاحة: addErrorReport, getErrorReports, updateErrorReportStatus, correctErrorReport, getErrorReportById";
    }
}
?>