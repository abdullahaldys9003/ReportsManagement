import acodeData from '@common/services/acodeData';

import awebServerData from '../services/awebServerData';

import access_php_file from "@assets/images/images_php/access_php_file.jpg";

import save_file_php from "@assets/images/images_php/save_file_php.jpg";


import create_file_php from "@assets/images/images_php/create_file_php.jpg";



const data = [
    {
        id: 17,
        name: "Image 1",
        description: "بعد تثبيت التطبيق قم في الدخول الية ستجد هذه الواجهة انقر على تلك العلامات الثلاث المؤشر عليها بالسهم الاسود ثم انتقل االى الخطوة التالية",
        src: create_file_php,
        appName: "Acode", // اسم التطبيق
        language: "php"   // اسم اللغة
    },
    {
        id: 18,
        name: "Image 1",
        description: "بعد تثبيت التطبيق قم في الدخول الية ستجد هذه الواجهة انقر على تلك العلامات الثلاث المؤشر عليها بالسهم الاسود ثم انتقل االى الخطوة التالية",
        src: access_php_file,
        appName: "Acode", // اسم التطبيق
        language: "php"   // اسم اللغة
    },
    {
        id: 19,
        name: "Image 1",
        description: "بعد تثبيت التطبيق قم في الدخول الية ستجد هذه الواجهة انقر على تلك العلامات الثلاث المؤشر عليها بالسهم الاسود ثم انتقل االى الخطوة التالية",
        src: save_file_php,
        appName: "Acode", // اسم التطبيق
        language: "php"   // اسم اللغة
    },
 ];
 
const phpData = new Array([...acodeData,...data],awebServerData);


export default phpData;
