"use client";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,

  Typography,
  TableHead
} from "@mui/material";
import {
  NotificationsActive,
  Public,
  Lock,
  Edit,
  Print,
  Share,
} from "@mui/icons-material";

import TablePropertyItem from  "./TablePropertyItem.tsx";

const personData = [
  { field: "الاسم الكامل", value: "أحمد محمد علي" },
  { field: "العمر", value: "32 سنة" },
  { field: "الجنسية", value: "يمنية" },
  { field: "المحافظة", value: "تعز" },
  {field :"المديرية",value:"القاهرة "},
  { field: "الحي", value: "طيبة " },
  { field: "رقم الهواية", value: "72617262726163 " },
];

const previousreports = [
  { field: "الوصف", value: "0" },
];

/*
const reportInformation = [
  { field: "رقم البلاغ", value: "133" },
  {field:"تاريخ البلاغ",value:"	2023-05-15 14:30"},
  {field:"الموقع",value:"مديرية السلام-حي عصيفرة-امام مسجد التوحيد"},
  {field:"المصدر",value:"قسم عصيفرة"},
  {field:"ساعه البلاغ",value:"12:00 م"},
  {field:"يوم البلاغ",value:"الاحد"} ,
  { field: "الشهر", value: "يناير " },
  { field: "السنة", value: "2024 " },
  {field:"حالة البلاغ",value:"قيد التحقيق"},
  {field:"الالولوية",value:"عالية"},
  {field:"نوع البلاغ",value:"سرقة منزل"},
  { field: "ملاحظات", value: "دخل بسرعة إلى أحد المباني خلف السوق وخرج بعد دقائق. بدا عليه القلق، وكان ينظر للخلف باستمرار." },
   { field: "مسؤؤل القسم", value: "محمد علي قائد سعيد" },
];
*/
const reportAnalysis = [
  { field: "الجهه", value: "لنفس الموقع" },
  { field: "من المواطنين", value: "133" },  
  { field: "جهات موثوقة", value: "133" },     
  { field: "مخابرات", value: "35" },     
  { field: "كاميرات مراقبة", value: "13" },     
];

const reporterData = [
  { field: "اسم المبلغ", value: "أحمد محمد علي" },
  { field: "عمر المبلغ", value: "32 سنة" },
  { field: "جنسية المبلغ", value: "يمنية" },
  { field: "مديرية المبلغ", value: "القاهرة" },
    { field: "رقم الهواية", value: "72617272613302 " },
  { field: "حي المبلغ", value: "طيبة" },
  { field: "رقم هاتف المبلغ", value: "771234567" }, // إضافة افتراضية
  { field: "صلة المبلغ بالواقعة", value: "شاهد عيان" } // إضافة افتراضية
];

export default function WantedDetails() {
  return (
    <Box
      sx={{
      //  direction: "rtl",
        fontFamily: "Tajawal, Arial, sans-serif",
        boxShadow: 2,
        width:"800px",
        p: 2,
      }}
    >
      <Grid container spacing={3} alignItems="center">
        {/* بطاقة بيانات المطلوب */}
        <Grid item xs={4} md={4}>
          <TablePropertyItem data={personData} title="بيانات المبلغ عنه" />
        </Grid>


        <Grid item xs={4} md={4}>
          <TablePropertyItem data={reporterData} title="بيانات المبلغ" />
        </Grid>
        <Grid item xs={4} md={4}>
        <Box p={2} >وبحسب إفادة المبلّغ، فقد اكتشف الحادث عند (فتح المحل صباحًا/عودته مساءً …)، ولا يوجد لديه مشتبه محدد في الوقت الحالي.

تم انتقال الطقم الأمني مع المحقق إلى الموقع، وتبين وجود آثار (كسر/خلع/بعثرة في محتويات المحل)، وتم تثبيت الحالة في محضر رسمي، وأخذ إفادة المبلّغ، وجمع الاستدلالات الأولية.</Box>
        </Grid>
        
      </Grid>
    </Box>
  );
}