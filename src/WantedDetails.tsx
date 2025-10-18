import React, { useEffect, useState } from "react";
import { Box, Grid, Button, Tabs, Tab, Typography } from "@mui/material";
import EditableDataGrid from "./EditableDataGrid";
import TablePropertyItem from "./TablePropertyItem.tsx";
import FormDialog from "./common/components/CustomDialog";
import { updateItem, getAllItems } from "./api/crudApi";

export default function WantedDetails({ reportId, rol = false ,departmentId}) 
{

  // State management
  const [open, setOpen] = useState(false);
  const [personData, setPersonData] = useState([]);
  const [departMentData, setDepartMent] = useState([]);
  
  const [reporterData, setReporterData] = useState([]);
  const [dataDNs, setDataDNs] = useState({});
  const [dataDNr, setDataDNr] = useState({});
  const [suspectId, setSuspectId] = useState(null);
  const [reporterId, setReporterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editablePersonData, setEditablePersonData] = useState([]);
  const [editableReporterData, setEditableReporterData] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);

  // Data fetching
  useEffect(() => {
    if (!reportId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchSuspectData();
        await fetchReporterData();
        await getDepartmentById(departmentId);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format data for display (without empty fields)
  const formatDisplayData = (data, type = 'suspect') => {
    const baseData = [
      { field: "الاسم الكامل", value: data.full_name || "غير محدد", key: "full_name" },
      { field: "العمر", value: data.age ? data.age + " سنة" : "غير محدد", key: "age" },
      { field: "الجنس", value: data.gender || "غير محدد", key: "gender" },
      { field: "المحافظة", value: data.governorate || "غير محدد", key: "governorate" },
      { field: "المديرية", value: data.district || "غير محدد", key: "district" },
      { field: "الحارة", value: data.neighborhood || "غير محدد", key: "neighborhood" },
      { field: "العنوان", value: data.address || "غير محدد", key: "address" },
      { field: "رقم الهوية", value: data.national_id || "غير محدد", key: "national_id" },
      { field: "رقم الهاتف", value: data.phone_number || "غير محدد", key: "phone_number" },
      { field: "الحالة", value: data.status || "غير محدد", key: "status" }
    ];

    if (type === 'suspect') {
      baseData.push({
        field: "تاريخ الإضافة",
        value: data.created_date ? new Date(data.created_date).toLocaleDateString('ar-EG') : "غير محدد",
        key: "created_date"
      });
    }
    return baseData;
  };

  // Format data for editing (includes all fields including hidden ones)
  const formatEditableData = (data, type = 'suspect') => {
    const displayData = formatDisplayData(data, type);

    const hiddenFields = [
      { field: "", value: data.districts_id, key: 'districts_id' },
      { field: "", value: data.id, key: 'id' },
      { field: "", value: data.neighborhoods_id, key: 'neighborhoods_id' }
    ];
    if (type === 'reporter') {
      hiddenFields.push({ field: "", value: data.reporter_id, key: 'reporter_id' });
    }
    return [...displayData, ...hiddenFields];
  };

  // API calls
  const fetchSuspectData = async () => {
    const params = {
      tableName: "suspects",
      operation: "showById",
      id: reportId
    };

    try {
      const response = await getAllItems("index.php", params);
      const suspectData = response;
      if (suspectData && suspectData.length > 0) {
        const suspect = suspectData[0];
        setDataDNs({
          neighborhoods_id_suspect: suspect.neighborhoods_id,
          districts_id_suspect: suspect.districts_id,
        });
        setSuspectId(suspect.id);
        const displayData = formatDisplayData(suspect, 'suspect');
        const editableData = formatEditableData(suspect, 'suspect');
        setPersonData(displayData);
        setEditablePersonData(editableData);
      } else {
        setError("لا توجد بيانات لهذا المطلوب");
      }
    } catch (error) {
      console.error("Error fetching suspect data:", error);
      throw error;
    }
  };

  const fetchReporterData = async () => {
    const params = {
      tableName: "suspects",
      operation: "showByReportId",
      id: reportId
    };

    try {
      const response = await getAllItems("index.php", params);
      const reporterData = response;
      if (reporterData && reporterData.length > 0) {
        const reporter = reporterData[0];
        setDataDNr({
          neighborhoods_id_reporter: reporter.neighborhoods_id,
          districts_id_reporter: reporter.districts_id,
        });
        setReporterId(reporter.reporter_id);
        const displayData = [
          { field: "اسم المبلغ", value: reporter.reporter_name || "غير محدد", key: "reporter_name" },
          { field: "رقم الهاتف", value: reporter.reporter_phone || "غير محدد", key: "reporter_phone" },
          { field: "البريد الإلكتروني", value: reporter.reporter_email || "غير محدد", key: "reporter_email" },
          { field: "رقم الهوية", value: reporter.reporter_national_id || "غير محدد", key: "reporter_national_id" },
          { field: "العنوان", value: reporter.reporter_address || "غير محدد", key: "reporter_address" },
          { field: "المحافظة", value: reporter.governorate || "غير محدد", key: "reporter_governorate" },
          { field: "المديرية", value: reporter.district || "غير محدد", key: "reporter_district" },
          { field: "الحارة", value: reporter.neighborhood || "غير محدد", key: "reporter_neighborhood" }
        ];
        const editableData = [
          ...displayData,
          { field: "", value: reporter.districts_id, key: 'districts_id' },
          { field: "", value: reporter.reporter_id, key: 'id' },
          { field: "", value: reporter.neighborhoods_id, key: 'neighborhoods_id' }
        ];
        setReporterData(displayData);
        setEditableReporterData(editableData);
      }
    } catch (error) {
      console.error("Error fetching reporter data:", error);
      throw error;
    }
  };
  const getDepartmentById = async (departmentId) => {
    const params = {
      tableName: "departments",
      operation: "getDepartmentById",
      id: departmentId
    };

    try {
      const response = await getAllItems("index.php", params);
      if(response.success) {
        const data = response.data;
    //  alert(JSON.stringify(response));
    const baseData = [
      { field: "اسم القسم", value: data.department_name || "غير محدد", key: "department_name" },
      { field: "مديرية", value: data.districts_name || "غير محدد", key: "districts_name" },
      { field: "اسم الحي", value: data.neighborhoods_name || "غير محدد", key: "neighborhoods_name" },
    ];
    setDepartMent(baseData);
  }
    } catch (error) {
      console.error("Error fetching reporter data:", error);
      throw error;
    }
  };

  // Dialog handlers
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Data update handlers
  const handleSave = async () => {
    try {
      await updateSuspectData();
      await updateReporterData();

      // Refresh data after update
      await fetchSuspectData();
      await fetchReporterData();
      setOpen(false);
      alert("تم حفظ التعديلات بنجاح");
    } catch (error) {
      console.error("فشل في حفظ التعديلات:", error);
      alert("فشل في حفظ التعديلات");
    }
  };

  const updateSuspectData = async () => {
    const updatedSuspectData = {};
    editablePersonData.forEach(item => {
      updatedSuspectData[item.key] = item.value;
    });

    const params = { tableName: "suspects", operation: "update" };
    updatedSuspectData.id = suspectId;
    await updateItem(updatedSuspectData, "index.php", params);
  };

  const updateReporterData = async () => {
    const updatedReporterData = {};
    editableReporterData.forEach(item => {
      updatedReporterData[item.key] = item.value;
    });

    const params = { tableName: "reporters", operation: "update" };
    updatedReporterData.id = reporterId;
    await updateItem(updatedReporterData, "index.php", params);
  };

  const handleDataChange = (key, value, isReporter) => {
    if (isReporter) {
      setEditableReporterData(prev =>
        prev.map(item => item.key === key ? { ...item, value } : item)
      );
    } else {
      setEditablePersonData(prev =>
        prev.map(item => item.key === key ? { ...item, value } : item)
      );
    }
  };

  // Render states
  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;

  // Tab panel component
  const TabPanel = ({ children, value, index, ...other }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  };

  // Main render
  return (
    <Box
      sx={{
        fontFamily: "Tajawal, Arial, sans-serif",
        boxShadow: 2,
        width: "100%",
        borderRadius: 2,
        backgroundColor: "white"
      }}
    >
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="بيانات البلاغ">
          <Tab label="بيانات المطلوب" />
          <Tab label="بيانات المبلغ" />
          <Tab label="بيانات القسم" />
          <Tab label="بيانات الإجراءات" />
          <Tab label="التحقيقات" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      
      {/* بيانات المطلوب */}
      <TabPanel value={currentTab} index={0}>
        <TablePropertyItem data={personData} title="بيانات المطلوب" />
      </TabPanel>

      {/* بيانات المبلغ */}
      <TabPanel value={currentTab} index={1}>
        <TablePropertyItem data={reporterData} title="بيانات المبلغ" />
      </TabPanel>

      {/* بيانات القسم */}
      <TabPanel value={currentTab} index={2}>
        <Typography variant="h6" gutterBottom>
          بيانات القسم
        </Typography>
        <TablePropertyItem data={departMentData} title="بيانات المبلغ" />
      </TabPanel>

      {/* بيانات الإجراءات */}
      <TabPanel value={currentTab} index={3}>
        <Typography variant="h6" gutterBottom>
          بيانات الإجراءات
        </Typography>
        <Typography color="textSecondary">
          سيتم إضافة بيانات الإجراءات هنا عند توفرها
        </Typography>
      </TabPanel>

      {/* التحقيقات */}
      <TabPanel value={currentTab} index={4}>
        <Typography variant="h6" gutterBottom>
          التحقيقات
        </Typography>
        <Typography color="textSecondary">
          سيتم إضافة بيانات التحقيقات هنا عند توفرها
        </Typography>
      </TabPanel>

      {/* زر التعديل */}
      {rol && (
        <Box sx={{ textAlign: 'center', p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            variant="contained"
            onClick={handleClickOpen}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' }
            }}
          >
            تعديل البيانات
          </Button>
          <FormDialog
            open={open}
            handleClose={handleClose}
            handleSave={handleSave}
            title="تعديل البيانات"
            maxWidth="lg"
          >
            <EditableDataGrid
              dataDNs={dataDNs}
              dataDNr={dataDNr}
              personData={editablePersonData}
              reporterData={editableReporterData}
              onDataChange={handleDataChange}
            />
          </FormDialog>
        </Box>
      )}
    </Box>
  );
}