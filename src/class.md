@startuml
' #####################################################################
' #               COMPLETE UML CLASS DIAGRAM - POLICE SYSTEM         #
' #####################################################################

title "Complete UML Class Diagram - Police Management System"

skinparam class {
    BackgroundColor LightBlue
    ArrowColor Black
    BorderColor RoyalBlue
    HeaderBackgroundColor #FFAAAA
}

' #####################################################################
' #                         CORE ENTITIES                            #
' #####################################################################

class Governorate {
  + id: Integer {pk}
  + name: String
  + code: String
  + created_at: DateTime
  + is_active: Boolean
  --
  + create(): Governorate
  + update(data: Map): Boolean
  + delete(): Boolean
  + getDistricts(): List<District>
  + getStatistics(): Map<String, Object>
  + search(keyword: String): List<Governorate>
}

class District {
  + id: Integer {pk}
  + name: String
  + governorate_id: Integer {fk}
  + code: String
  + population: Integer
  + area: Double
  --
  + create(data: DistrictDTO): District
  + update(id: Integer, data: Map): Boolean
  + getNeighborhoods(): List<Neighborhood>
  + getGovernorate(): Governorate
  + getDepartments(): List<Department>
  + validateLocation(): Boolean
}

class Neighborhood {
  + id: Integer {pk}
  + name: String
  + district_id: Integer {fk}
  + zip_code: String
  + boundaries: String
  --
  + create(data: NeighborhoodDTO): Neighborhood
  + getDistrict(): District
  + validateWithDistrict(): Boolean
  + getLocationInfo(): Map<String, Object>
}

class Department {
  + id: Integer {pk}
  + department_name: String
  + address: String
  + type: String
  + phone: String
  + email: String
  + neighborhoods_id: Integer {fk}
  + districts_id: Integer {fk}
  + is_active: Boolean
  + created_at: DateTime
  ----------
  + getDepartments(): Department,
  + getDepartmentById();
  ----------

  + createDepartment(data: DepartmentDTO): Department
  + updateInfo(data: Map): Boolean
  + getEmployees(): List<Employee>
  + getAssignedReports(): List<Report>
  + getPerformanceReport(startDate: Date, endDate: Date): PerformanceReport
  + assignEmployee(employeeId: Integer): Boolean
  + searchDepartments(filters: Map): List<Department>
}

class Employee {
  + employee_id: Integer {pk}
  + name_full: String
  + username: String
  + password: String
  + email: String
  + number_phone: String
  + position_type: String
  + department_id: Integer {fk}
  + role: String
  + is_active: Boolean
  + created_at: DateTime
  + last_login: DateTime
  --
    createEmployee();
    updateEmployee();

  + register(data: EmployeeDTO): Employee
  + login(username: String, password: String): AuthResponse
  + logout(): Boolean
  + updateProfile(data: Map): Boolean
  + changePassword(oldPassword: String, newPassword: String): Boolean
  + resetPassword(): Boolean
  + getDepartment(): Department
  + hasPermission(permission: String): Boolean
  + getActivityLogs(): List<ActivityLog>
}

class ReportMainType {
  + id: Integer {pk}
  + type_name: String
  + description: String
  + severity_level: Integer
  + is_active: Boolean
  --
  + createType(data: ReportTypeDTO): ReportMainType
  + updateType(data: Map): Boolean
  + getSubTypes(): List<ReportSubType>
  + getReportsCount(startDate: Date, endDate: Date): Integer
  + validateSubType(subTypeId: Integer): Boolean
}

class ReportSubType {
  + id: Integer {pk}
  + main_type_id: Integer {fk}
  + sub_type_name: String
  + description: String
  + processing_time: Integer
  + is_active: Boolean
  --
  + createSubType(data: SubTypeDTO): ReportSubType
  + getMainType(): ReportMainType
  + updateSubType(data: Map): Boolean
  + getReports(): List<Report>
  + calculateAverageProcessingTime(): Double
}

class Report {
  + report_id: Integer {pk}
  + report_number: String
  + description: Text
  + status: String
  + priority: String
  + main_id: Integer {fk}
  + sub_id: Integer {fk}
  + districts_id: Integer {fk}
  + neighborhoods_id: Integer {fk}
  + created_by: Integer {fk}
  + assigned_to: Integer {fk}
  + created_at: DateTime
  + updated_at: DateTime
  + closed_at: DateTime
  + archive: Boolean
  --
  + createReport(data: ReportDTO): Report
  + generateReportNumber(): String
  + updateReportStatus(newStatus: String, notes: String): Boolean
  + updateReportStatus()
  + getDepartment_monthly_performance()
  + getReportsCountByTypeAndStatus
  +getReportsByDepartmentId(id:int):int
  + assignToDepartment(deptId: Integer): Boolean
  + assignToEmployee(empId: Integer): Boolean
  + closeReport(closureData: Map): Boolean
  + reopenReport(reason: String): Boolean
  + addNote(note: String, employeeId: Integer): Boolean
  + getTimeline(): List<TimelineEvent>
  + validateData(): ValidationResult
  + searchReports(filters: ReportFilter): List<Report>
}

class Reporter {
  + id: Integer {pk}
  + name_reporter: String
  + phone_reporter: String
  + email_reporter: String
  + id_national_reporter: String
  + address_reporter: Text
  + districts_id: Integer {fk}
  + neighborhoods_id: Integer {fk}
  + created_at: DateTime
  + is_verified: Boolean
  --
  + createOrFind(data: ReporterDTO): Reporter
  + updateInfo(data: Map): Boolean
  + verifyIdentity(): Boolean
  + getSubmittedReports(): List<Report>
  + findSimilarReporters(): List<Reporter>
  + validateContactInfo(): ValidationResult
  + getReportStatistics(): Map<String, Object>
}

class Suspect {
  + id: Integer {pk}
  + full_name: String
  + phone: String
  + address: Text
  + status: String
  + age: Integer
  + national_id: String
  + districts_id: Integer {fk}
  + neighborhoods_id: Integer {fk}
  + gender: String
  + description: Text
  + created_at: DateTime
  + last_known_location: String
  --
  + addSuspect(data: SuspectDTO): Suspect
  + updateStatus(newStatus: String, notes: String): Boolean
  + updateInfo(data: Map): Boolean
  + getRelatedReports(): List<Report>
  + searchSuspects(filters: SuspectFilter): List<Suspect>
  + createAlert(): PoliceAlert
  + addPhoto(photoData: Blob): Boolean
  + getCriminalRecord(): List<CriminalRecord>
}



class DepartmentReportReview {
  + id: Integer {pk}
  + report_id: Integer {fk}
  + department_id: Integer {fk}
  + reviewer_id: Integer {fk}
  + status: String
  + notes: Text
  + reviewed_at: DateTime
  + sent_to_management: Boolean
  + sent_at: DateTime
  + management_notes: Text
  --
  + createReview(data: ReviewDTO): DepartmentReportReview
  + updateReview(data: Map): Boolean
  + markAsSent(notes: String): Boolean
  + getReviewer(): Employee
  + getReport(): Report
  + getDepartment(): Department
  + calculateReviewTime(): Long
}

class ErrorReport {
  + id: Integer {pk}
  + report_id: Integer {fk}
  + field_name: String
  + field_label: String
  + current_value: Text
  + suggested_correction: Text
  + error_description: Text
  + status: String
  + department_id: Integer {fk}
  + user_by: Integer {fk}
  + reported_at: DateTime
  + reviewed_at: DateTime
  + corrected_at: DateTime
  + review_notes: Text
  + priority: String
  --
  + submitError(data: ErrorReportDTO): ErrorReport
  + reviewError(decision: String, notes: String): Boolean
  + correctError(correctionData: Map): Boolean
  + getOriginalReport(): Report
  + getReportingUser(): Employee
  + getAssignedDepartment(): Department
  + calculateResolutionTime(): Long
}

class PoliceAlert {
  + alert_id: Integer {pk}
  + alert_title: String
  + alert_message: Text
  + alert_date: DateTime
  + target_department: String
  + is_sent: Boolean
  + status: String
  + department_id: Integer {fk}
  + suspects_id: Integer {fk}
  + priority: String
  + expiration_date: DateTime
  + created_by: Integer {fk}
  --
  + addAlerts(data: AlertDTO): PoliceAlert
  + updateAlert(data: Map): Boolean
  + sendAlert(): Boolean
  + updateStatus(newStatus: String): Boolean
  + dispatchToCheckpoints(checkpointIds: List<Integer>): Boolean
  + getSuspect(): Suspect
  + getDepartment(): Department
  + getCheckpoints(): List<Checkpoint>
  + isExpired(): Boolean
}

class Checkpoint {
  + id: Integer {pk}
  + name: String
  + location: String
  + type: String
  + district_id: Integer {fk}
  + is_active: Boolean
  + created_at: DateTime
  + coordinates: String
  --
  + createCheckpoint(data: CheckpointDTO): Checkpoint
  + updateCheckpoint(data: Map): Boolean
  + getAlerts(): List<PoliceAlert>
  + getDistrict(): District
  + validateLocation(): Boolean
  + searchCheckpoints(filters: Map): List<Checkpoint>
}

class ActivityLog {
  + id_activity: Integer {pk}
  + id_user: Integer {fk}
  + table_target: String
  + action: String
  + id_record: Integer
  + details: Text
  + ip_address: String
  + user_agent: String
  + createdAt: DateTime
  --
  + logActivity(data: ActivityDTO): ActivityLog
  + getLogsByUser(userId: Integer, filters: Map): List<ActivityLog>
  + getLogsByTable(tableName: String, filters: Map): List<ActivityLog>
  + exportLogs(criteria: Map): ExportResult
  + cleanupOldLogs(retentionDays: Integer): Integer
}

' #####################################################################
' #                 MANY-TO-MANY RELATIONSHIP CLASSES               #
' #####################################################################

class ReportReporter {
  + report_id: Integer {fk}
  + reporter_id: Integer {fk}
  + is_primary: Boolean
  + created_at: DateTime
  --
  + linkReporter(): Boolean
  + unlinkReporter(): Boolean
  + getReport(): Report
  + getReporter(): Reporter
}

class ReportSuspect {
  + report_id: Integer {fk}
  + suspect_id: Integer {fk}
  + involvement_type: String
  + description: Text
  + created_at: DateTime
  --
  + linkSuspect(): Boolean
  + updateInvolvement(data: Map): Boolean
  + getReport(): Report
  + getSuspect(): Suspect
}

class ReportDepartment {
  + report_id: Integer {fk}
  + department_id: Integer {fk}
  + assigned_at: DateTime
  + assigned_by: Integer {fk}
  + status: String
  --
  + assignDepartment(): Boolean
  + updateAssignment(data: Map): Boolean
  + getReport(): Report
  + getDepartment(): Department
}

class AlertCheckpoint {
  + id: Integer {pk}
  + alert_id: Integer {fk}
  + checkpoint_id: Integer {fk}
  + assigned_at: DateTime
  + assigned_by: Integer {fk}
  + status: String
  + notes: Text
  --
  + assignCheckpoint(): Boolean
  + updateAssignment(data: Map): Boolean
  + getAlert(): PoliceAlert
  + getCheckpoint(): Checkpoint
}

' #####################################################################
' #                         UML RELATIONSHIPS                        #
' #####################################################################

' Composition Relationships
Governorate *-- "1..*" District
District *-- "1..*" Neighborhood

' Association Relationships
Department "1" -- "0..*" Employee
ReportMainType "1" -- "0..*" ReportSubType

' Navigation Associations
District "1" -- "0..*" Department
Neighborhood "1" -- "0..*" Department
District "1" -- "0..*" Report
Neighborhood "1" -- "0..*" Report
District "1" -- "0..*" Reporter
Neighborhood "1" -- "0..*" Reporter
District "1" -- "0..*" Suspect
Neighborhood "1" -- "0..*" Suspect

' Dependency Relationships
Employee ..> Report : reviews >
Reporter ..> Report : submits >
Suspect ..> Report : involved_in >
Department ..> DepartmentReportReview : conducts >
PoliceAlert ..> Checkpoint : dispatched_to >

' Many-to-Many Relationships
Report "1" -- "*" ReportReporter
Reporter "1" -- "*" ReportReporter

Report "1" -- "*" ReportSuspect
Suspect "1" -- "*" ReportSuspect

Report "1" -- "*" ReportDepartment
Department "1" -- "*" ReportDepartment

PoliceAlert "1" -- "*" AlertCheckpoint
Checkpoint "1" -- "*" AlertCheckpoint

' Special Relationships
ReportMainType ||..|| Report : categorizes
ReportSubType ||..|| Report : subcategorizes
Department ||..|| DepartmentReportReview : manages
Employee ||..|| ActivityLog : generates

@enduml



// تسجيل موظف جديد
Employee.register(employeeData) {
    التحقق من البيانات المدخلة
    التأكد من عدم تكرار اسم المستخدم
    تشفير كلمة المرور
    حفظ بيانات الموظف
    إرجاع كائن الموظف المسجل
}

// تسجيل الدخول
Employee.login(username, password) {
    التحقق من صحة اسم المستخدم وكلمة المرور
    تحديث وقت آخر دخول
    إنشاء جلسة عمل (Session)
    إرجاع بيانات المصادقة (Token)
}

// تسجيل الخروج
Employee.logout() {
    إنهاء جلسة العمل
    مسح بيانات الجلسة
    تسجيل عملية الخروج
}