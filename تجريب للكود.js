// تحديد إذا كان الحقل يحتاج إلى select
var getFieldType = function (fieldName) {
    if (!dataReports)
        return null; // إضافة هذا السطر
    var selectFields = {
        // ... باقي الكود
        'neighborhoods_reports': {
            options: getNeighborhoodOptions(neighborhoods, dataReports.districts_reports_id),
            label: 'اختر الحي'
        },
        'neighborhood_suspect_name': {
            options: neighborhoods.filter(function (n) { return n.district_id === (dataReports === null || dataReports === void 0 ? void 0 : dataReports.district_suspects); })
                .map(function (neighborhood) { return ({ value: neighborhood.id, label: neighborhood.name }); }),
            label: 'اختر حي المبلغ عنه'
        },
        'neighborhood_reporter_name': {
            options: neighborhoods.filter(function (n) { return n.district_id === (dataReports === null || dataReports === void 0 ? void 0 : dataReports.districts_reporter); })
                .map(function (neighborhood) { return ({ value: neighborhood.id, label: neighborhood.name }); }),
            label: 'اختر حي المبلغ'
        }
    };
    return selectFields[fieldName] || null;
};
