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
include("districts.php");
include("reporters.php");
include("error_reports.php");
include("employees.php");
include("PoliceDepartments.php");
include("reportMainTypes.php");
include("departments.php");

//include("departments.php");
//include("notifications.php");
//include("r.php");
// الحصول على البيانات من GET أو POST


$table = $_GET['tableName'];
$operation = $_GET['operation'];
$id = $_GET['id'] ?? null;  // إذا لم يوجد 'id'، يصبح null
$filters = $_GET['filters'] ?? [];
// الحصول على البيانات المرسلة في body
$input = json_decode(file_get_contents('php://input'), true);

switch ($table) {
    case "reports":
        if ($operation === "insert" || $operation ==="update") {
            operationReports($operation, $input);
        } else {
            operationReports($operation,$input);
        }
        break;
    case "report_main_types":
        operation_report_main_types($operation,$input);
        break;
    case "report_sub_types":
        operation_report_sub_types($operation);
        break;
    case "suspect":
        operation_report_sub_types($operation);
        break;
    case "neighborhoods":
        operationNeighborhoods($operation);
        break;
    case "department_statistics":
        operation_department_statistics($operation);
        break;
    case "employees":
        operation_employees($operation,$input);
        break;

    case "police_alerts":
        sendAlertOperation($operation,$input);
        break;
    case "suspects":
        operation_suspects($operation, $input);
        break;
    case "districts":
         operationDistricts($operation, $input);
        break;
    case "reporters":
         operation_reporters($operation, $input);
        break;
    case "error_reports":
         operation_error_reports($operation, $input);
        break;
    case "departments":
         operationDepartments($operation, $input);
        break;
    case "PoliceDepartments":
      $result = operationPoliceDepartments($operation,$input,$id,$filters);
        break;
    case "reportMainTypes":
      $result = operationReportMainTypes($operation,$input,$id);
        break;

    
    default:
        echo json_encode(["error" => "الجدول غير موجود"]);
}

?>

