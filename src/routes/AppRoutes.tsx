import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage from '../Pages/Home';
import UserManagement from '../UserManagement/UserManagement.jsx';
import DepartmentManager from "../DepartmentManager/DepartmentManager"
import AddReports from "../police-department-ui/AddReports.jsx";

import ReceivingReports from '../ReceivingReports/ReceivingReports.jsx';
import PoliceDepartmentReports from "../police-department-ui/PoliceDepartmentReports.jsx";
//import SuspectsTable from '../SuspectManagement/SuspectsTable.jsx';
/*
import ManageAlerts from '../ManageAlerts'
import UserManagement from '../UserManagement/UserManagement';
import ReceivingReports from '../ReceivingReports/ReceivingReports.jsx';
import SystemReportsManager from "../SystemReports/SystemReportsManager";
import ManageReports from '../ManageReports';
import SuspectsTable from '../SuspectManagement/SuspectsTable';
import ReportsDashboard from '../ReportManagement/ReportTypesTable';
import ManageNeighborhoods from "../AreaManagement/ManageNeighborhoods.jsx";
import ManagerErrorReports from "../ManagerErrorReports/ManagerErrorReports";

import PointsInterface from "../PointsInterface/PointsInterface";
import ReportTypeManagement from "../ReportTypeManagement/ReportTypeManagement";
import DepartmentManager from "../DepartmentManager/DepartmentManager"
import ShowNotificationManagement from "../ShowNotifications/ShowNotificationManagement";
*/

import SystemReportsManager from "../SystemReports/SystemReportsManager";

import ReportTypeManagement from "../ReportTypeManagement/ReportTypeManagement";
import ShowNotificationManagement from "../ShowNotifications/ShowNotificationManagement";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/home" />} />

      {/* صفحة الرئيسية */}
      <Route path="/home" element={<HomePage />} />

        <Route path="/manage/departmentsManagement" element={<DepartmentManager />} />
        <Route path="/manage/manageReport" element={<AddReports />} />
      <Route path="/manage/manageReceivingReports" element={<ReceivingReports />} />
{/*
     <Route path="/manage/systemReportsManager" element={<PoliceDepartmentReports />} />
  */}
        <Route path="/manage/manageNotifications" element={<ShowNotificationManagement />} />

      <Route path="/manage/reportTypeManagement" element={<ReportTypeManagement />} />

      <Route path="/manage/userManagement" element={<UserManagement />} />
     <Route path="/manage/systemReportsManager" element={<SystemReportsManager />} />
      {/*
      <Route path="/manage/managerErrorReports" element={<ManagerErrorReports />} />
      <Route path="/manage/userManagement" element={<UserManagement />} />
      <Route path="/manage/systemReportsManager" element={<SystemReportsManager />} />
      <Route path="/manage/manageReport" element={<ManageReports />} />
      <Route path="/manage/manageLocations" element={<ManageNeighborhoods />} />
      <Route path="/manage/suspectManagement" element={<SuspectsTable />} />
      <Route path="/manage/manageReceivingReports" element={<ReceivingReports />} />

      <Route path="/manage/manageNotifications" element={<ShowNotificationManagement />} />
      <Route path="/manage/pointsInterface" element={<PointsInterface />} />
      <Route path="/manage/reportTypeManagement" element={<ReportTypeManagement />} />
    </Routes> */}
   </Routes> );
};

export default AppRoutes;