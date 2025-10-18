// ReportsDashboard.jsx
import React, { useState, useEffect } from 'react';
import './ReportsDashboard.css';

import { getAllItems } from "../api/crudApi";

import SelectFilter from "./SelectFilter";

import { mapToSelectOptions } from "../helps/filtersValueLable";

const statusOptions = [
  { value: "", label: "جميع الحالات" },
  { value: "opened", label: "مفتوح" },
  { value: "closed", label: "مغلق" },
  { value: "prosse", label: "قيد المعالجة" }  // <-- بدون فاصلة منقوطة
];
const PoliceDepartmentReports = () => {
  const [activeTab, setActiveTab] = useState('detailed');
  const [dataPoliceDepartmentsReport, setDataPoliceDepartmentsReport] = useState([]);
  const [dataPoliceDepartmentsReportsSummary, setDataPoliceDepartmentsReportsSummary] = useState([]);
  const [dataPoliceDepartmentsPeriodicReports, setDataPoliceDepartmentsPeriodicReports] = useState([]);
  const [dataReportMainTypes, setDataReportMainTypes] = useState([]);
  const [searchDataReports, setSearchDataReports] = useState(1);
  const [mainTypeId,setMainTypeId] = useState(2);
  
   const [filters, setFilters] = useState({
    status: "",
    mainType: "",
    fromDate: "",
    toDate: "",
  });
    
  
 const [periodicType, setPeriodicType] = useState("daily");
    
const [periodicReports, setPeriodicReports] = useState([]);



useEffect(() => {
const fetchPoliceDepartmentsPeriodicReports = async (type) => {
  try {
    const params = {
      tableName:"PoliceDepartments",
      operation:"getPoliceDepartmentsPeriodicReports",
      id:1,
      period: type, // daily | weekly | monthly | quarterly
    };
    const result = await getAllItems("index.php", params);
    setDataPoliceDepartmentsPeriodicReports(result.data);
  } catch (error) {
    alert(error);
  }
};
  fetchPoliceDepartmentsPeriodicReports(periodicType);
}, [periodicType]);

  useEffect(() => {
  const fetchPoliceDepartments = async () => {
     const filtersObject = { ...filters };
    try {
      const params = {
        tableName:"PoliceDepartments",
        operation:"getPoliceDepartmentsReports",
        id:1,
        filters:filtersObject,
      };
     const result = await getAllItems("index.php",params);
      setDataPoliceDepartmentsReport(result); // النتيجة الفعلية من السيرفر
     // alert(JSON.stringify(result,2,null));
    } catch (error) {
      alert(JSON.stringify(error,2,null));
    }
  };
  //
  const fetchPoliceDepartmentsReportsSummary = async () => {
    try {
      const params = {
        tableName:"PoliceDepartments",
        operation:"getPoliceDepartmentsReportsSummary",
        id:1,

      };
     const result = await getAllItems("index.php",params);
      setDataPoliceDepartmentsReportsSummary(result.data); // النتيجة الفعلية من السيرفر
    //  alert(JSON.stringify(result,2,null));
    } catch (error) {
      alert(JSON.stringify(error,2,null));
    }
  };
  const fetchReportMainTypes = async () => {

    try {
      const params = {
        tableName:"reportMainTypes",
        operation:"fetchReportMainTypes",
        
      };
     const result = await getAllItems("index.php",params);
      setDataReportMainTypes(result); // النتيجة الفعلية من السيرفر
     //alert(JSON.stringify(result,2,null));
    } catch (error) {
      alert(JSON.stringify(error,2,null));
    }
  };

  fetchPoliceDepartments();
  fetchReportMainTypes();
  fetchPoliceDepartmentsReportsSummary();
}, [searchDataReports]); 


  // بيانات تجريبية للتقارير
  const reportsData = [
    { id: 1001, date: '01/09/2025', type: 'سرقة سيارات', description: 'سرقة سيارة تويوتا كورولا لون أبيض', area: 'العاصيفرة', status: 'قيد المعالجة' },
    { id: 1002, date: '31/08/2025', type: 'اعتداء لفظي', description: 'مشاجرة كلامية بين جارين', area: 'جبل حبشي', status: 'مغلق' },
    { id: 1003, date: '30/08/2025', type: 'سرقة بنوك', description: 'محاولة سرقة من صراف آلي', area: 'المسراخ', status: 'مفتوح' },
    { id: 1004, date: '29/08/2025', type: 'اعتداء جسدي', description: 'اعتداء بالضرب على موظف', area: 'العاصيفرة', status: 'مغلق' },
    { id: 1005, date: '28/08/2025', type: 'تهديد', description: 'تهديد عبر الهاتف', area: 'جبل حبشي', status: 'قيد المعالجة' },
  ];

  // بيانات إحصائية
  const summaryData = [
    { type: 'سرقة سيارات', count: 12, percentage: '28.6%', closed: 8, inProgress: 3, open: 1 },
    { type: 'سرقة بنوك', count: 5, percentage: '11.9%', closed: 2, inProgress: 2, open: 1 },
    { type: 'اعتداء جسدي', count: 15, percentage: '35.7%', closed: 10, inProgress: 5, open: 0 },
    { type: 'اعتداء لفظي', count: 7, percentage: '16.7%', closed: 2, inProgress: 4, open: 1 },
    { type: 'تهديد', count: 3, percentage: '7.1%', closed: 0, inProgress: 1, open: 2 },
  ];

  // بيانات تحليلية
  const analyticalData = [
    { pattern: 'سرقة السيارات', frequency: 'مرتفع في أيام الجمعة', peakTimes: 'من 10 مساءً إلى 2 صباحاً', affectedAreas: 'العاصيفرة', recommendation: 'زيادة الدوريات في المنطقة' },
    { pattern: 'الاعتداءات الجسدية', frequency: 'مرتفع في عطلات نهاية الأسبوع', peakTimes: 'من 6 مساءً إلى 11 مساءً', affectedAreas: 'جبل حبشي', recommendation: 'التعاون مع مقاهي المنطقة' },
    { pattern: 'سرقة البنوك', frequency: 'منخفض ولكن قيمته عالية', peakTimes: 'من 1 ظهراً إلى 3 عصراً', affectedAreas: 'المسراخ', recommendation: 'تركيب كاميرات مراقبة إضافية' },
  ];

  // بيانات دورية
  const periodicData = [
    { metric: 'إجمالي البلاغات', value: 8, yesterday: 10, lastWeek: 9, change: '-20%', changeType: 'negative' },
    { metric: 'البلاغات المغلقة', value: 5, yesterday: 4, lastWeek: 6, change: '+25%', changeType: 'positive' },
    { metric: 'البلاغات الجديدة', value: 3, yesterday: 6, lastWeek: 3, change: '-50%', changeType: 'negative' },
    { metric: 'متوسط وقت المعالجة', value: '4.5 ساعة', yesterday: '5.2 ساعة', lastWeek: '6.1 ساعة', change: '-13.5%', changeType: 'positive' },
  ];

const handelSetFilters = (value) => {

  setFilters(prev => ({ ...prev, status: value }));
};
const handelSetFiltersMainType = (value) => {
 // alert(value);
  setFilters(prev => ({ ...prev, mainType: value }));
};

const handelSearchDataReports=()=>{
    setSearchDataReports(prev => (prev+1));
    //alert(searchDataReports);
};

const handelFiltersPoliceDepartmentsReportsSummary = (maindId) => {
  

  const data = dataPoliceDepartmentsReportsSummary.filter(item => item.main_id == maindId ).map(item => item);
    setDataPoliceDepartmentsReportsSummary(data);
   setMainTypeId(maindId);
   // alert(maindId);*/
};
  const renderDetailedReports = () => (
    <div className="report-section">
      <div className="section-header">
        <h2><i className="fas fa-list"></i> التقارير التفصيلية</h2>
        <div>عرض جميع البيانات</div>
      </div>
      
      <div className="filters">
        <div className="filter">
         <SelectFilter
        label="نوع البلاغ"
        options={(mapToSelectOptions(dataReportMainTypes,"id","type_name"))}
        value={filters.mainType}
        onChange={handelSetFiltersMainType}
      />
        </div>
        <div className="filter">
         <SelectFilter
        label="حالة البلاغ"
        options={statusOptions}
        value={filters.status}
        onChange={handelSetFilters}
      />
        </div>
        <div className="filter">
        <label>من تاريخ</label>
        <input
        type="date"
        value={filters.fromDate}
        onChange={(e) => setFilters({...filters, fromDate: e.target.value })} />
        </div>
        <div className="filter">
        <label>إلى تاريخ</label>
        <input
        type="date"
        value={filters.toDate}
        onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
        </div>

      </div>
      
      <div className="actions">
        <button className="btn btn-primary" onClick={handelSearchDataReports} ><i className="fas fa-search"></i> بحث</button>
        <button className="btn btn-secondary"><i className="fas fa-file-export"></i> تصدير</button>
      </div>
      
<table>
  <thead>
    <tr>
      <th>رقم البلاغ</th>
      <th>تاريخ البلاغ</th>
      <th>النوع الرئيسي</th>
      <th>النوع الفرعي</th>
      <th>الوصف</th>
      <th>الحي / المنطقة</th>
      <th>الحالة</th>
    </tr>
  </thead>
  <tbody>
    {dataPoliceDepartmentsReport.data?.map(report => (
      <tr key={report.report_number}>
        <td>{report.report_number}</td>
        <td>{report.report_date}</td>
        <td>{report.main_type}</td>
        <td>{report.sub_type}</td>
        <td>{report.description}</td>
        <td>{report.district} / {report.neighborhood}</td>
        <td>
          <span className={`badge ${
            report.report_status === 'مغلق' ? 'badge-success' : 
            report.report_status === 'قيد المعالجة' ? 'badge-warning' : 'badge-danger'
          }`}>
            {report.report_status}
          </span>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    
    </div>
  );

  const renderSummaryReports = () => (
    <div className="report-section">
      <table>
        <thead>
          <tr>
            <th>نوع البلاغ</th>
            <th>عدد البلاغات</th>

            <th>مغلق</th>
            <th>قيد المعالجة</th>
            <th>مفتوح</th>
          </tr>
        </thead>
        <tbody>
          {dataPoliceDepartmentsReportsSummary.map((item, index) => (
            <tr key={index}>
              <td>{item.sub_type}</td>
              <td>{item.total_reports}</td>

              <td>{item.closed_reports}</td>
              <td>{item.processing_reports}</td>
              <td>{item.opened_reports}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAnalyticalReports = () => (
    <div className="report-section">
      <div className="section-header">
        <h2><i className="fas fa-chart-line"></i> التقارير التحليلية</h2>
        <div>تحليل الاتجاهات والأنماط</div>
      </div>
      
      <div className="filters">
        <div className="filter">
          <label>نوع التحليل</label>
          <select>
            <option>الاتجاهات الزمنية</option>
            <option>المقارنة بين المناطق</option>
            <option>تحليل الأنماط</option>
          </select>
        </div>
        <div className="filter">
          <label>الفترة الزمنية</label>
          <select>
            <option>آخر 7 أيام</option>
            <option>آخر 30 يوم</option>
            <option>آخر 3 أشهر</option>
            <option>آخر سنة</option>
          </select>
        </div>
      </div>
      
      <div className="chart-container">
        <h3 style={{textAlign: 'center', marginBottom: '20px'}}>اتجاه البلاغات خلال آخر 30 يوم</h3>
        <div style={{display: 'flex', height: '300px', alignItems: 'flex-end', justifyContent: 'center', gap: '15px', padding: '20px'}}>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: '40px', background: '#1a56db', height: '250px'}}></div>
            <div style={{marginTop: '10px'}}>الأسبوع 1</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: '40px', background: '#1a56db', height: '180px'}}></div>
            <div style={{marginTop: '10px'}}>الأسبوع 2</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: '40px', background: '#1a56db', height: '220px'}}></div>
            <div style={{marginTop: '10px'}}>الأسبوع 3</div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{width: '40px', background: '#1a56db', height: '190px'}}></div>
            <div style={{marginTop: '10px'}}>الأ週وع 4</div>
          </div>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>النمط</th>
            <th>التكرار</th>
            <th>أوقات الذروة</th>
            <th>المناطق الأكثر تأثراً</th>
            <th>التوصية</th>
          </tr>
        </thead>
        <tbody>
          {analyticalData.map((item, index) => (
            <tr key={index}>
              <td>{item.pattern}</td>
              <td>{item.frequency}</td>
              <td>{item.peakTimes}</td>
              <td>{item.affectedAreas}</td>
              <td>{item.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPeriodicReports = () => (
    <div className="report-section">
      <div className="section-header">
        <h2><i className="fas fa-calendar-alt"></i> التقارير الدورية</h2>
        <div>يومية، أسبوعية، شهرية</div>
      </div>
      
      <div className="filters">
        <div className="filter">
          <label>نوع التقرير الدوري</label>
          <select value={periodicType} onChange={(e) => setPeriodicType(e.target.value)}>
          <option value="daily">تقرير يومي</option>
          <option value="weekly">تقرير أسبوعي</option>
          <option value="monthly">تقرير شهري</option>
          <option value="quarterly">تقرير ربع سنوي</option>
          </select>
        </div>
        <div className="filter">
          <label>اختر الفترة</label>
          <input type="date" />
        </div>
      </div>
      
      <div className="summary-cards">
        <div className="summary-card">
          <i className="fas fa-file-alt"></i>
          <h3>التقرير اليومي</h3>
          <p>01/09/2025</p>
        </div>
        <div className="summary-card">
          <i className="fas fa-file-alt"></i>
          <h3>التقرير الأسبوعي</h3>
          <p>الأسبوع 35, 2025</p>
        </div>
        <div className="summary-card">
          <i className="fas fa-file-alt"></i>
          <h3>التقرير الشهري</h3>
          <p>أغسطس 2025</p>
        </div>
        <div className="summary-card">
          <i className="fas fa-file-alt"></i>
          <h3>التقرير ربع السنوي</h3>
          <p>Q3 2025</p>
        </div>
      </div>
      
      <h3 style={{margin: '20px 0'}}>التقرير اليومي - 01/09/2025</h3>
      
      <table>
        <thead>
          <tr>
            <th>المؤشر</th>
            <th>القيمة</th>
            <th>المقارنة بالأمس</th>
            <th>المقارنة بالأسبوع الماضي</th>
            <th>التغيير</th>
          </tr>
        </thead>
        <tbody>
          {periodicData.map((item, index) => (
            <tr key={index}>
              <td>{item.metric}</td>
              <td>{item.value}</td>
              <td>{item.yesterday}</td>
              <td>{item.lastWeek}</td>
              <td style={{color: item.changeType === 'positive' ? 'green' : 'red'}}>
                {item.changeType === 'positive' ? '▲ ' : '▼ '}{item.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-shield-alt"></i>
            <h1>نظام الإدارة الأمنية - التقارير</h1>
          </div>
          <div className="user">
            <i className="fas fa-user-circle"></i>
            مسؤول النظام
          </div>
        </div>
      </header>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'detailed' ? 'active' : ''}`} 
          onClick={() => setActiveTab('detailed')}
        >
          التقارير التفصيلية
        </div>
        <div 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`} 
          onClick={() => setActiveTab('summary')}
        >
          التقارير الملخصة
        </div>

      </div>
      
      {activeTab === 'detailed' && renderDetailedReports()}
      {activeTab === 'summary' && renderSummaryReports()}

      {activeTab === 'periodic' && renderPeriodicReports()}

    </div>
  );
};

export default PoliceDepartmentReports;