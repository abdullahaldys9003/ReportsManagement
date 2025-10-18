import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import TablePropertyItem from "../TablePropertyItem";
import { ho } from "../hosts";
import axios from "axios";

export default function SuspectInfo({ reportId }) {

  const [personData, setPersonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reportId) return;
    const fetchSuspectData = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `http://${ho}:8084`,
          { id: reportId },
          { params: { tableName: "suspects", operation: "getNotificationSuspects" } }
        );
        const data = res.data;
        if (data && data.length > 0) {
          const newPersonData = [
            { field: "الاسم الكامل", value: data[0].full_name || "غير محدد" },
            { field: "العمر", value: data[0].age ? data[0].age + " سنة" : "غير محدد" },
            { field: "الجنس", value: data[0].gender || "غير محدد" },

            { field: "المديرية", value: data[0].district_name || "غير محدد" },
            { field: "الحارة", value: data[0].neighborhood_name || "غير محدد" },
            { field: "العنوان", value: data[0].address || "غير محدد" },
            { field: "رقم الهوية", value: data[0].national_id || "غير محدد" },
            { field: "رقم الهاتف", value: data[0].phone || "غير محدد" },
            { field: "الحالة", value: data[0].status || "غير محدد" },
          ];
          setPersonData(newPersonData);
        } else {
          setError("لا توجد بيانات لهذا المطلوب");
        }
      } catch (err) {
        console.error(err);
        setError("فشل في جلب البيانات");
      } finally {
        setLoading(false);
      }
    };
    fetchSuspectData();
  }, [reportId]);

  if (loading) return <Box>جاري التحميل...</Box>;
  if (error) return <Box color="red">{error}</Box>;

  return (
    <Box
      sx={{
        fontFamily: "Tajawal, Arial, sans-serif",
        boxShadow: 2,
        width: "500px",
        p: 2,
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <TablePropertyItem data={personData} title="بيانات المبلّغ عنه" />
        </Grid>
      </Grid>
    </Box>
  );
}