// utils/exportUtils.js
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const getStatusArabic = (status) => {
    const statusMap = {
        'opened': 'مفتوح',
        'closed': 'مغلق', 
        'in_progress': 'قيد المعالجة',
        'pending': 'معلق',
        'prosse': 'قيد المعالجة'
    };
    return statusMap[status] || status;
};

export const exportToPDF = async (rows, setExporting, setSnackbar) => {
    if (!rows || rows.length === 0) {
        setSnackbar({
            open: true,
            message: 'لا توجد بيانات للتصدير',
            severity: 'warning'
        });
        return false;
    }

    setExporting(true);
    
    try {
        const doc = new jsPDF();
        
        // إضافة عنوان
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('تقارير البلاغات', 105, 15, { align: 'center' });
        
        // تحضير البيانات للجدول
        const tableHeaders = [
            'رقم البلاغ',
            'وصف البلاغ', 
            'البلاغ الرئيسي',
            'البلاغ الفرعي',
            'حالة البلاغ',
            'القسم',
            'المديرية',
            'الحي',
            'تاريخ البلاغ'
        ];

        const tableData = rows.map(row => [
            row.original?.report_id?.toString() || '',
            row.original?.description?.toString() || '',
            row.original?.main_type?.toString() || '',
            row.original?.sub_type?.toString() || '',
            getStatusArabic(row.original?.status_report),
            row.original?.department_name?.toString() || '',
            row.original?.district_name?.toString() || '',
            row.original?.neighborhood_name?.toString() || '',
            row.original?.created_at ? 
                new Date(row.original.created_at).toLocaleDateString('ar-EG') : ''
        ]);

        // إضافة الجدول
        autoTable(doc, {
            head: [tableHeaders],
            body: tableData,
            startY: 25,
            styles: {
                font: 'helvetica',
                fontSize: 8,
                cellPadding: 3,
                halign: 'right'
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'right'
            },
            bodyStyles: {
                halign: 'right'
            },
            columnStyles: {
                0: { cellWidth: 25 }, // رقم البلاغ
                1: { cellWidth: 40 }, // الوصف
                2: { cellWidth: 30 }, // الرئيسي
                3: { cellWidth: 30 }, // الفرعي
                4: { cellWidth: 25 }, // الحالة
                5: { cellWidth: 25 }, // القسم
                6: { cellWidth: 25 }, // المديرية
                7: { cellWidth: 25 }, // الحي
                8: { cellWidth: 30 }  // التاريخ
            },
            margin: { left: 10, right: 10 }
        });

        // إضافة تذييل
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `تم التصدير في: ${new Date().toLocaleDateString('ar-EG')} - الصفحة ${i} من ${pageCount}`,
                10,
                doc.internal.pageSize.height - 10
            );
        }

        doc.save('تقارير_البلاغات.pdf');
        return true;
        
    } catch (error) {
        console.error('Error exporting PDF:', error);
        setSnackbar({
            open: true,
            message: 'فشل في التصدير',
            severity: 'error'
        });
        return false;
    } finally {
        setExporting(false);
    }
};