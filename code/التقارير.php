-- 📊 استعلام المقارنة الشامل للقسم 1 (للشهر الحالي)
SELECT 
    'إجمالي البلاغات' AS metric,
    COUNT(*) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_month_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 MONTH) 
     AND MONTH(r3.created_at) = MONTH(CURDATE() - INTERVAL 2 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_months_ago_value,
    -- إضافة: متوسط البلاغات اليومي لهذا الشهر
    ROUND(COUNT(*) / DAY(LAST_DAY(CURDATE())), 1) AS daily_avg_this_month

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE()) 
AND MONTH(r.created_at) = MONTH(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'البلاغات المغلقة' AS metric,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND r2.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_month_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 MONTH) 
     AND MONTH(r3.created_at) = MONTH(CURDATE() - INTERVAL 2 MONTH)
     AND r3.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_months_ago_value,
    -- إضافة: نسبة الإنجاز الشهري
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1) AS monthly_completion_rate

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE()) 
AND MONTH(r.created_at) = MONTH(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'البلاغات الجديدة' AS metric,
    COUNT(*) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_month_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 MONTH) 
     AND MONTH(r3.created_at) = MONTH(CURDATE() - INTERVAL 2 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_months_ago_value,
    -- إضافة: معدل النمو الشهري
    ROUND(((COUNT(*) - COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0)) / NULLIF(COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0), 0)) * 100, 1) AS monthly_growth_rate

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE()) 
AND MONTH(r.created_at) = MONTH(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'متوسط وقت المعالجة (ساعة)' AS metric,
    COALESCE(ROUND(AVG(TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at)), 1), 0) AS current_value,
    COALESCE((SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, r2.created_at, r2.updated_at)), 1) 
     FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND r2.updated_at IS NOT NULL
     AND r2.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_month_value,
    COALESCE((SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, r3.created_at, r3.updated_at)), 1) 
     FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 MONTH) 
     AND MONTH(r3.created_at) = MONTH(CURDATE() - INTERVAL 2 MONTH)
     AND r3.updated_at IS NOT NULL
     AND r3.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_months_ago_value,
    -- إضافة: أفضل وقت معالجة لهذا الشهر
    COALESCE(MIN(TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at)), 0) AS best_time_this_month

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE()) 
AND MONTH(r.created_at) = MONTH(CURDATE())
AND r.status_report = 'closed'
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'نسبة الإنجاز %' AS metric,
    COALESCE(ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1), 0) AS current_value,
    COALESCE((SELECT ROUND((SUM(CASE WHEN r2.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1)
     FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) 
     AND MONTH(r2.created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_month_value,
    COALESCE((SELECT ROUND((SUM(CASE WHEN r3.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1)
     FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 MONTH) 
     AND MONTH(r3.created_at) = MONTH(CURDATE() - INTERVAL 2 MONTH)
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_months_ago_value,
    -- إضافة: الهدف الشهري
    85.0 AS monthly_target
FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE()) 
AND MONTH(r.created_at) = MONTH(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1);



السنوي

-- 📊 استعلام المقارنة الشامل للقسم 1 (للسنة الحالية) - مصحح
SELECT 
    'إجمالي البلاغات' AS metric,
    COUNT(*) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_year_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_years_ago_value,
    -- إضافة: متوسط البلاغات الشهري لهذه السنة
    ROUND(COUNT(*) / MONTH(CURDATE()), 1) AS monthly_avg_this_year

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'البلاغات المغلقة' AS metric,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND r2.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_year_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 YEAR)
     AND r3.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_years_ago_value,
    -- إضافة: نسبة الإنجاز السنوي
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1) AS yearly_completion_rate

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'البلاغات الجديدة' AS metric,
    COUNT(*) AS current_value,
    COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_year_value,
    COALESCE((SELECT COUNT(*) FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_years_ago_value,
    -- إضافة: معدل النمو السنوي
    ROUND(((COUNT(*) - COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0)) / NULLIF(COALESCE((SELECT COUNT(*) FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0), 0)) * 100, 1) AS yearly_growth_rate

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'متوسط وقت المعالجة (ساعة)' AS metric,
    COALESCE(ROUND(AVG(TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at)), 1), 0) AS current_value,
    COALESCE((SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, r2.created_at, r2.updated_at)), 1) 
     FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND r2.updated_at IS NOT NULL
     AND r2.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_year_value,
    COALESCE((SELECT ROUND(AVG(TIMESTAMPDIFF(HOUR, r3.created_at, r3.updated_at)), 1) 
     FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 YEAR)
     AND r3.updated_at IS NOT NULL
     AND r3.status_report = 'closed'
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_years_ago_value,
    -- إضافة: أفضل وقت معالجة لهذه السنة
    COALESCE(MIN(TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at)), 0) AS best_time_this_year

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE())
AND r.status_report = 'closed'
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'نسبة الإنجاز %' AS metric,
    COALESCE(ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1), 0) AS current_value,
    COALESCE((SELECT ROUND((SUM(CASE WHEN r2.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1)
     FROM reports r2 
     WHERE YEAR(r2.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd2 WHERE rd2.report_id = r2.report_id AND rd2.department_id = 1)
     ), 0) AS last_year_value,
    COALESCE((SELECT ROUND((SUM(CASE WHEN r3.status_report = 'closed' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0) * 100), 1)
     FROM reports r3 
     WHERE YEAR(r3.created_at) = YEAR(CURDATE() - INTERVAL 2 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd3 WHERE rd3.report_id = r3.report_id AND rd3.department_id = 1)
     ), 0) AS two_years_ago_value,
    -- إضافة: الهدف السنوي
    80.0 AS yearly_target

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)

UNION ALL

SELECT 
    'أعلى شهر في الأداء' AS metric,
    (SELECT COUNT(*) FROM reports r4 
     WHERE YEAR(r4.created_at) = YEAR(CURDATE())
     AND EXISTS (SELECT 1 FROM report_department rd4 WHERE rd4.report_id = r4.report_id AND rd4.department_id = 1)
     GROUP BY MONTH(r4.created_at) 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS current_value,
    (SELECT COUNT(*) FROM reports r5 
     WHERE YEAR(r5.created_at) = YEAR(CURDATE() - INTERVAL 1 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd5 WHERE rd5.report_id = r5.report_id AND rd5.department_id = 1)
     GROUP BY MONTH(r5.created_at) 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS last_year_value,
    (SELECT COUNT(*) FROM reports r6 
     WHERE YEAR(r6.created_at) = YEAR(CURDATE() - INTERVAL 2 YEAR)
     AND EXISTS (SELECT 1 FROM report_department rd6 WHERE rd6.report_id = r6.report_id AND rd6.department_id = 1)
     GROUP BY MONTH(r6.created_at) 
     ORDER BY COUNT(*) DESC 
     LIMIT 1) AS two_years_ago_value,
    -- إضافة: اسم الشهر الأعلى أداء
    (SELECT MONTHNAME(STR_TO_DATE(CONCAT('2025-', best_month, '-01'), '%Y-%m-%d')) 
     FROM (SELECT MONTH(created_at) as best_month 
           FROM reports 
           WHERE YEAR(created_at) = YEAR(CURDATE())
           AND EXISTS (SELECT 1 FROM report_department WHERE report_department.report_id = reports.report_id AND department_id = 1)
           GROUP BY MONTH(created_at) 
           ORDER BY COUNT(*) DESC 
           LIMIT 1) AS current_best) AS best_month_name

FROM reports r
WHERE YEAR(r.created_at) = YEAR(CURDATE())
AND EXISTS (SELECT 1 FROM report_department rd WHERE rd.report_id = r.report_id AND rd.department_id = 1)
GROUP BY metric;





ALTER TABLE reporters 
MODIFY COLUMN phone_reporter VARCHAR(20) DEFAULT 'غير محدد',
MODIFY COLUMN email_reporter VARCHAR(100) DEFAULT 'لا يوجد',
MODIFY COLUMN id_national_reporter VARCHAR(20) DEFAULT 'غير معروف',
MODIFY COLUMN address_reporter TEXT DEFAULT 'لم يتم التحديد';


-- جدول suspects
ALTER TABLE suspects 
MODIFY COLUMN phone VARCHAR(20) DEFAULT 'غير محدد',
MODIFY COLUMN gender VARCHAR(10) DEFAULT 'غير محدد',
MODIFY COLUMN address TEXT DEFAULT 'غير معروف',
MODIFY COLUMN age INT DEFAULT 0,
MODIFY COLUMN national_id VARCHAR(20) DEFAULT 'لا يوجد';





-- عرض توزيع البلاغات على الأشهر للقسم 3
SELECT 
    YEAR(created_at) AS year,
    MONTH(created_at) AS month,
    COUNT(*) AS total_reports,
    SUM(CASE WHEN status_report = 'closed' THEN 1 ELSE 0 END) AS closed,
    SUM(CASE WHEN status_report = 'prosse' THEN 1 ELSE 0 END) AS in_progress,
    SUM(CASE WHEN status_report = 'opened' THEN 1 ELSE 0 END) AS opened,
    ROUND(AVG(CASE WHEN updated_at IS NOT NULL THEN TIMESTAMPDIFF(HOUR, created_at, updated_at) ELSE NULL END), 1) AS avg_processing_hours
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
WHERE rd.department_id = 3
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY year DESC, month DESC;

-- مقارنة بين الأقسام الثلاثة لهذه السنة
SELECT 
    rd.department_id,
    COUNT(*) AS total_reports,
    SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) AS closed_reports,
    ROUND((SUM(CASE WHEN r.status_report = 'closed' THEN 1 ELSE 0 END) / COUNT(*) * 100), 1) AS completion_rate,
    ROUND(AVG(CASE WHEN r.updated_at IS NOT NULL THEN TIMESTAMPDIFF(HOUR, r.created_at, r.updated_at) ELSE NULL END), 1) AS avg_processing_hours
FROM reports r
INNER JOIN report_department rd ON r.report_id = rd.report_id
WHERE YEAR(r.created_at) = 2025
AND rd.department_id IN (1, 2, 3)
GROUP BY rd.department_id
ORDER BY rd.department_id;