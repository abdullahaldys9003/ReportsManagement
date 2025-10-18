import file_1 from '@assets/images/file_Images/file_1.jpg';

import file_2 from '../assets/images/Files_Images/file_2.jpg';

import file_3 from '../assets/images/Files_Images/file_3.jpg';

import file_4 from '../assets/images/Files_Images/file_4.jpg';

const filesData = [
  {
    id: 1,
    name: "file",
    description: "توضح الشاشة الرئيسية للتطبيق وكيفية استخدامه.",
    src: file_1,
    language: "HTML", // إضافة اسم اللغة هنا
  },
  {
    id: 2,
    name: "file",
    description: "تظهر كيفية رفع الملفات إلى التطبيق.",
    src: file_2,
    language: "HTML", // إضافة اسم اللغة هنا
  },
  {
    id: 3,
    name: "file",
    description: "توضح كيفية البحث عن الملفات في التطبيق.",
    src: file_3,
    language: "HTML", // إضافة اسم اللغة هنا
  },
  {
    id: 4,
    name: "file",
    description: "تظهر عرض تفاصيل الملفات المختارة.",
    src: file_4,
    language: "HTML", // إضافة اسم اللغة هنا
  },
];

export default filesData;