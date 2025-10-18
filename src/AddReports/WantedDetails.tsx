import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";
import TablePropertyItem from "./TablePropertyItem.tsx";

import { ho } from "./hosts.ts";
export default function WantedDetails({ reportId }) {
  const [personData, setPersonData] = useState<any[]>([]);
  const [reporterData, setReporterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // جلب بيانات المطلوب (المشتبه به)
        const suspectResponse = await axios.post(`http://${ho}:8084`, { id: reportId }, {
          params: {
            tableName: "suspects",
            operation: "showById"
          },
        });

        const suspectData = suspectResponse.data; 
        if (suspectData && suspectData.length > 0) {
          setPersonData([
            { field: "الاسم الكامل", value: suspectData[0].full_name || "غير محدد" },
            { field: "العمر", value: (suspectData[0].age ? suspectData[0].age + " سنة" : "غير محدد") },
            { field: "الجنس", value: suspectData[0].gender || "غير محدد" },
            { field: "المحافظة", value: suspectData[0].governorate || "غير محدد" },
            { field: "المديرية", value: suspectData[0].district || "غير محدد" },
            { field: "الحارة", value: suspectData[0].neighborhood || "غير محدد" },
            { field: "العنوان", value: suspectData[0].address || "غير محدد" },
            { field: "رقم الهوية", value: suspectData[0].national_id || "غير محدد" },
            { field: "رقم الهاتف", value: suspectData[0].phone_number || "غير محدد" },
            { field: "الحالة", value: suspectData[0].status || "غير محدد" },
            { field: "تاريخ الإضافة", value: suspectData[0].created_date ? new Date(suspectData[0].created_date).toLocaleDateString('ar-EG') : "غير محدد" }
          ]);
        } else {
          setError("لا توجد بيانات لهذا المطلوب");
        }

        // جلب بيانات المبلغ
        const reporterResponse = await axios.post(`http://${ho}:8084`, { id: reportId }, {
          params: {
            tableName: "suspects",
            operation: "showByReportId"
          },
        });

        const reporterData = reporterResponse.data;
        if (reporterData && reporterData.length > 0) {
          setReporterData([
            { field: "اسم المبلغ", value: reporterData[0].reporter_name || "غير محدد" },
            { field: "رقم الهاتف", value: reporterData[0].reporter_phone || "غير محدد" },
            { field: "البريد الإلكتروني", value: reporterData[0].reporter_email || "غير محدد" },
            { field: "رقم الهوية", value: reporterData[0].reporter_national_id || "غير محدد" },
            { field: "العنوان", value: reporterData[0].reporter_address || "غير محدد" },
            { field: "المحافظة", value: reporterData[0].governorate || "غير محدد" },
            { field: "المديرية", value: reporterData[0].district || "غير محدد" },
            { field: "الحارة", value: reporterData[0].neighborhood || "غير محدد" }
          ]);
        }

      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  if (loading) return <Box>جاري التحميل...</Box>;
  if (error) return <Box color="red">{error}</Box>;

  return (
    <Box
      sx={{
        fontFamily: "Tajawal, Arial, sans-serif",
        boxShadow: 2,
        width: "800px",
        p: 2,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* بطاقة بيانات المطلوب */}
        <Grid item xs={4} md={4}>
          <TablePropertyItem data={personData} title="بيانات المبلغ عنه" />
        </Grid>

        {/* بطاقة بيانات المبلغ */}
        <Grid item xs={4} md={4}>
          <TablePropertyItem data={reporterData} title="بيانات المبلغ" />
        </Grid>

        {/* الوصف النصي للحادث */}
        <Grid item xs={4} md={4}>
          <Box p={2}>
            وبحسب إفادة المبلّغ، فقد اكتشف الحادث عند (فتح المحل صباحًا/عودته مساءً …)، ولا يوجد لديه مشتبه محدد في الوقت الحالي.
            <br />
            تم انتقال الطقم الأمني مع المحقق إلى الموقع، وتبين وجود آثار (كسر/خلع/بعثرة في محتويات المحل)، وتم تثبيت الحالة في محضر رسمي، وأخذ إفادة المبلّغ، وجمع الاستدلالات الأولية.
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}