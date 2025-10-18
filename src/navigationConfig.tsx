// navigationConfig.js
// navigationConfig.js
import { faHtml5, faCss3, faJsSquare, faBootstrap, faReact, faVuejs, faNodeJs, faPhp, faLaravel, faPython } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import IconSwitcher from './common/components/icons/IconSwitcher.tsx';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import StorageIcon from '@mui/icons-material/Storage'; // أيقونة MySQL
import CodeIcon from '@mui/icons-material/Code'; // أيقونة Express

import ComputerIcon from '@mui/icons-material/Computer';
/*
const adminSections = [
  {
    segment: 'loginAuth',
    title: 'تسجيل الدخول - Login / Authentication',
  },
  {
    segment: 'manageReport',
    title: 'إدارة البلاغات - Reports Management',
  },
  {
    segment: 'manageWanted',
    title: 'إدارة المطلوبين - Wanted Persons Management',
  },
  {
    segment: 'manageEmployees',
    title: 'إدارة الموظفين - Employees Management',
  },
  {
    segment: 'manageDepartments',
    title: 'إدارة الأقسام - Departments Management',
  },
  {
    segment: 'manageLocations',
    title: 'إدارة الأماكن - Locations Management',
  },
  {
    segment: 'reportsOverview',
    title: 'إدارة التقارير - Reports Overview / Analytics',
  },
  {
    segment: 'manageNotifications',
    title: 'إدارة التنبيهات - Notifications Management',
  },
  {
    segment: 'manageCheckpoints',
    title: 'إدارة النقاط - Checkpoints Management',
  },
  {
    segment: 'manageActivities',
    title: 'إدارة الأنشطة - Activities Management',
  },
];*/
const NAVIGATION = [
    {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'home',
    title: 'الصفحة الرئيسة',
    icon: <DashboardIcon />,
  },
  {
    kind: 'divider',
  },

  {
    kind: 'header',
    title: 'languge',
  },
  {
  segment: 'manage',
  title: 'الإدارات',
  icon: <ComputerIcon />,
    children: [
     {
        segment: 'userManagement',
        title: 'إدارة المستخدمين',

      },
      {
        segment: 'departmentsManagement',
        title: 'إدارة الاقسام',
      },
      {
        segment: 'manageActivities',
        title: 'إدارة الأنشطة ',
      },
      /*
      {
       segment: 'manageCheckpoints',
       title: 'إدارة نقاط التفتيش',
       },*/
      {
        segment: 'manageReport',
        title: 'إدارة البلاغات',
      },
       {
       segment: 'reportTypeManagement',
       title: 'انواع البلاغات الجديدة',
      },
      {
     segment: 'manageNotifications',
      title: 'إدرة التنبيهات'
      },
      {
        segment: 'systemReportsManager',
        title: 'إدارة التقارير',
      },
        {
       segment: 'manageReceivingReports',
       title: 'إستقبال البلاغات',
      },     
    ],
  },
];
export default NAVIGATION;


