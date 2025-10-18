// بيانات البلاغات (مثل جدول reports)
const reports = [
  { report_id: 1, description: "سرقة منزل" },
  { report_id: 2, description: "اعتداء" },
  { report_id: 3, description: "مخدرات" }
];

// بيانات الربط (مثل جدول report_department)
const reportDepartments = [
  { report_id: 1, department_id: 1 },
  { report_id: 1, department_id: 2 },
  { report_id: 2, department_id: 1 },
  { report_id: 3, department_id: 3 }
];

// ===== طريقة 1: باستخدام حلقات مزدوجة (واضحة ومباشرة) =====
function innerJoinNested(reports, reportDepartments) {
  const result = [];
  for (const r of reports) {
    for (const rd of reportDepartments) {
      if (r.report_id === rd.report_id) { // شرط الربط
        result.push({
          report_id: r.report_id,
          description: r.description,
          department_id: rd.department_id
        });
      }
    }
  }
  return result;
}

// ===== طريقة 2: باستخدام filter + map (أسلوب وظيفي) =====
function innerJoinFunctional(reports, reportDepartments) {
  // لكل تقرير: ابحث عن كل روابطه في جدول الربط ثم اصنع صفوف النتيجة
  return reports.flatMap(r =>
    reportDepartments
      .filter(rd => rd.report_id === r.report_id)
      .map(rd => ({
        report_id: r.report_id,
        description: r.description,
        department_id: rd.department_id
      }))
  );
}

// تجربة وعرض النتائج
console.log("=== Nested Join ===");
console.table(innerJoinNested(reports, reportDepartments));

console.log("=== Functional Join ===");
console.table(innerJoinFunctional(reports, reportDepartments));



SELECT 
    r.report_id,
    r.status_report,
    r.description,
    r.created_at,

    d.department_name,
    d.address
FROM reports r
JOIN report_department rd ON r.report_id = rd.report_id
JOIN department d ON rd.department_id = d.id
ORDER BY r.created_at DESC
LIMIT 25



SELECT 
    d.department_name,
    COUNT(r.report_id) AS total_reports,
    SUM(CASE WHEN r.status_report = 'open' THEN 1 ELSE 0 END) AS open_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports
FROM department d
LEFT JOIN report_department rd ON d.id = rd.department_id
LEFT JOIN reports r ON rd.report_id = r.report_id
GROUP BY d.department_name
ORDER BY total_reports DESC






SELECT 
    mt.type_name AS 'النوع الرئيسي',
    st.sub_type_name AS 'النوع الفرعي',
    g.name AS 'المحافظة',
    d.name AS 'المديرية',
    COUNT(r.report_id) AS 'عدد البلاغات',
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) * 100.0 / 
           COUNT(r.report_id)), 2) AS 'معدل الحل %'
FROM reports r
JOIN report_main_types mt ON r.main_id = mt.id
JOIN report_sub_types st ON r.sub_id = st.id
JOIN report_department rdep ON r.report_id = rdep.report_id
JOIN department dep ON rdep.department_id = dep.id
JOIN neighborhoods n ON dep.neighborhoods_id = n.id
JOIN districts d ON n.district_id = d.id
JOIN governorates g ON d.governorate_id = g.id
GROUP BY mt.type_name, st.sub_type_name, g.name, d.name
ORDER BY COUNT(r.report_id) DESC




SELECT 
    r.report_id AS 'رقم البلاغ',
    r.description AS 'وصف البلاغ',
    r.created_at AS 'تاريخ التقديم',
    DATEDIFF(NOW(), r.created_at) AS 'الأيام المنقضية',
    d.department_name AS 'القسم المختص',
    e.name_full AS 'المسؤول',
    r.status_report AS 'حالة المراجعة'
FROM reports r
JOIN report_department rd ON r.report_id = rd.report_id
JOIN department d ON rd.department_id = d.id
LEFT JOIN employees e ON d.id = e.department_id
WHERE r.status_ = 'in_progress'
ORDER BY DATEDIFF(NOW(), r.created_at) DESC



اريد اسم المديرية واسم الحي واسم القسم وعدد البلاغات من كل منهم والمفتوح منها والمغلق منها



SELECT 
    dep.department_name AS department_name,
    n.name AS neighborhood_name,
    d.name AS district_name,
    COUNT(r.report_id) AS total_reports,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports
FROM reports r
LEFT JOIN report_department rd ON r.report_id = rd.report_id
LEFT JOIN department dep ON rd.department_id = dep.id
LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
LEFT JOIN districts d ON r.districts_id = d.id
GROUP BY dep.department_name, n.name, d.name
ORDER BY dep.department_name, d.name, n.name;


عدد البلاغات حسب الحالة

SELECT 
    status_report,
    COUNT(*) AS total_reports
FROM reports
GROUP BY status_report;




SELECT
    d.name AS 'المديرية',
    n.name AS 'الحي',
    COUNT(r.report_id) AS 'عدد البلاغات',
    -- نسبة البلاغات في هذا الحي من إجمالي بلاغات مديريته
    ROUND(
        (COUNT(r.report_id) * 100.0 / SUM(COUNT(r.report_id)) OVER (PARTITION BY d.name)
    ), 2) AS 'النسبة داخل المديرية %'
FROM reports r
INNER JOIN districts d ON r.districts_id = d.id
INNER JOIN neighborhoods n ON r.neighborhoods_id = n.id
GROUP BY d.name, n.name
ORDER BY d.name, COUNT(r.report_id) DESC;




SELECT 
    mt.type_name AS 'النوع الرئيسي',
    st.sub_type_name AS 'النوع الفرعي',
    g.name AS 'المحافظة',
    d.name AS 'المديرية',
    COUNT(r.report_id) AS 'عدد البلاغات',
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) * 100.0 / 
           COUNT(r.report_id)), 2) AS 'معدل الحل %'
FROM reports r
JOIN report_main_types mt ON r.main_id = mt.id
JOIN report_sub_types st ON r.sub_id = st.id
JOIN report_department rdep ON r.report_id = rdep.report_id
JOIN department dep ON rdep.department_id = dep.id
JOIN neighborhoods n ON dep.neighborhoods_id = n.id
JOIN districts d ON n.district_id = d.id
JOIN governorates g ON d.governorate_id = g.id
GROUP BY mt.type_name, st.sub_type_name, g.name, d.name
ORDER BY COUNT(r.report_id) DESC


SELECT 
    dep.department_name AS department_name,
    dep.id AS department_id,
    n.name AS neighborhood_name,
    d.name AS district_name,
    COUNT(r.report_id) AS total_reports,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS opened_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,
    SUM(CASE WHEN r.status_report = 'prosse' THEN 1 ELSE 0 END) AS prosse_reports
FROM department dep
LEFT JOIN report_department rd ON dep.id = rd.department_id
LEFT JOIN reports r ON rd.report_id = r.report_id
LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
LEFT JOIN districts d ON r.districts_id = d.id
WHERE dep.id = 1
GROUP BY dep.department_name, dep.id, n.name, d.name
ORDER BY dep.department_name, d.name, n.name;


الجرائم الاكثر انتشارا
SELECT 
    rm.type_name AS crime_type,
    COUNT(r.report_id) AS total_cases,
    SUM(CASE WHEN r.status_report = 'opened' THEN 1 ELSE 0 END) AS pending_cases,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS resolved_cases,
    ROUND((COUNT(r.report_id) * 100.0 / (SELECT COUNT(*) FROM reports)), 2) AS percentage
FROM reports r
LEFT JOIN report_main_types rm ON r.main_id = rm.id
GROUP BY rm.type_name
ORDER BY total_cases DESC;



المناطق الاكثر خطورة
SELECT 
    d.name AS district,
    n.name AS neighborhood,
    COUNT(r.report_id) AS total_reports,
    COUNT(DISTINCT r.main_id) AS crime_variety,
    COUNT(CASE WHEN r.status_report = 'opened' THEN 1 END) AS active_cases
FROM reports r
LEFT JOIN districts d ON r.districts_id = d.id
LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
GROUP BY d.name, n.name
HAVING total_reports > 0
ORDER BY total_reports DESC
LIMIT 10;


تقارير المواسم الاكثر البلاغات
SELECT 
    HOUR(r.created_at) AS hour_of_day,
    DAYNAME(r.created_at) AS day_of_week,
    MONTHNAME(r.created_at) AS month_name,
    COUNT(r.report_id) AS total_cases,
    rm.type_name AS crime_type
FROM reports r
LEFT JOIN report_main_types rm ON r.main_id = rm.id
GROUP BY HOUR(r.created_at), DAYNAME(r.created_at), MONTHNAME(r.created_at), rm.type_name
ORDER BY total_cases DESC;

CREATE TABLE error_reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    
    -- بيانات الخطأ
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(100) NOT NULL,
    current_value TEXT,           -- القيمة الخاطئة الحالية
    suggested_correction TEXT,    -- التصحيح المقترح من المستخدم
    error_description TEXT,       -- وصف الخطأ
    
    -- حالة البلاغ
    status ENUM('reported', 'under_review', 'approved', 'rejected', 'corrected') DEFAULT 'reported',
    
    -- المستخدمين
    department_id INT,              -- من أبلغ عن الخطأ
    user_by INT,              -- من راجع البلاغ
    -- التواريخ
    reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    corrected_at DATETIME,
   
    -- ملاحظات المراجع
    review_notes TEXT
)



function getReportWithDetails($reportId) {
    $conn = new mysqli("localhost:3306", "root", "root", "departments_system");
    if ($conn->connect_error) return null;
    
    $sql = "
        SELECT 
            r.*,
            rmt.type_name as main_type_name,
            rst.sub_type_name as sub_type_name,
            d.name as district_name,
            n.name as neighborhood_name,
            s.full_name as suspect_name,
            rep.name_reporter as reporter_name
        FROM reports r
        LEFT JOIN report_main_types rmt ON r.main_id = rmt.id
        LEFT JOIN report_sub_types rst ON r.sub_id = rst.id
        LEFT JOIN districts d ON r.districts_id = d.id
        LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
        LEFT JOIN report_suspect rs ON r.report_id = rs.report_id
        LEFT JOIN suspects s ON rs.suspect_id = s.id
        LEFT JOIN report_reporter rr ON r.report_id = rr.report_id
        LEFT JOIN reporters rep ON rr.reporter_id = rep.id
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



        SELECT 
            r.*,
            rmt.type_name as main_type_name,
            rst.sub_type_name as sub_type_name,
            d.name as district_name,
            n.name as neighborhood_name,
            s.full_name as suspect_name,
            rep.name_reporter as reporter_name
        FROM reports r
        LEFT JOIN report_main_types rmt ON r.main_id = rmt.id
        LEFT JOIN report_sub_types rst ON r.sub_id = rst.id
        LEFT JOIN districts d ON r.districts_id = d.id
        LEFT JOIN neighborhoods n ON r.neighborhoods_id = n.id
        LEFT JOIN report_suspect rs ON r.report_id = rs.report_id
        LEFT JOIN suspects s ON rs.suspect_id = s.id
        LEFT JOIN report_reporter rr ON r.report_id = rr.report_id
        LEFT JOIN reporters rep ON rr.reporter_id = rep.id
        WHERE r.report_id = 49
        
        
        
CREATE TABLE department_report_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_id INT NOT NULL,
    department_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_at DATETIME NULL,
    sent_to_management BOOLEAN DEFAULT FALSE,
    sent_at DATETIME NULL,
    FOREIGN KEY (report_id) REFERENCES reports(report_id),
    FOREIGN KEY (department_id) REFERENCES department(id),
    FOREIGN KEY (reviewer_id) REFERENCES employees(employee_id)
);



-- البلاغات الموجودة
SELECT report_id, description, status_report FROM reports;

-- العلاقات بين البلاغات والأقسام
SELECT * FROM report_department;

-- الأقسام الموجودة
SELECT id, department_name FROM department;

