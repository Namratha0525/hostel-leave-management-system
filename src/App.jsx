import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RoleSelect from "./auth/RoleSelect";
import Register from "./auth/Register";
import Login from "./auth/Login";
import AuthCallback from "./auth/AuthCallback";
import SetPassword from "./auth/SetPassword";

/* 🔹 STUDENT */
import StudentDashboard from "./student/StudentDashboard";
import StudentProfile from "./student/StudentProfile";
import ApplyLeave from "./student/ApplyLeave";
import LeaveCalendar from "./student/LeaveCalendar";
import StudentMessMenu from "./student/StudentMessMenu";
import StudentAnnouncements from "./student/StudentAnnouncements";

/* 🔹 MANAGER */
import ManagerDashboard from "./manager/ManagerDashboard";
import PendingLeaves from "./manager/PendingLeaves";
import ApprovedLeaves from "./manager/ApprovedLeaves";
import ClosedLeaves from "./manager/ClosedLeaves";
import ManagerMessMenu from "./manager/ManagerMessMenu";
import ManagerAnnouncements from "./manager/ManagerAnnouncements";
import RejectedLeaves from "./manager/RejectedLeaves"; // ✅ ADDED

/* 🔹 ADMIN */
import AdminDashboard from "./admin/AdminDashboard";
import AdminOverview from "./admin/AdminOverview";
import AdminManagers from "./admin/AdminManagers";
import AdminUsers from "./admin/AdminUsers";
import AdminLeaves from "./admin/AdminLeaves";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔹 Default */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* 🔹 Registration */}
        <Route path="/register" element={<RoleSelect />} />
        <Route path="/register/:role" element={<Register />} />

        {/* 🔹 Login */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Magic link callback */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* 🔹 First-time password setup */}
        <Route path="/set-password" element={<SetPassword />} />

        {/* ================= STUDENT DASHBOARD ================= */}
        <Route path="/student/dashboard" element={<StudentDashboard />}>
          <Route index element={<StudentProfile />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="calendar" element={<LeaveCalendar />} />
          <Route path="mess-menu" element={<StudentMessMenu />} />
          <Route path="announcements" element={<StudentAnnouncements />} />
          <Route path="*" element={<Navigate to="profile" />} />
        </Route>

        {/* ================= MANAGER DASHBOARD ================= */}
        <Route path="/manager/dashboard" element={<ManagerDashboard />}>
          <Route index element={<PendingLeaves />} />
          <Route path="pending" element={<PendingLeaves />} />
          <Route path="approved" element={<ApprovedLeaves />} />
          <Route path="rejected" element={<RejectedLeaves />} /> {/* ✅ ADDED */}
          <Route path="closed" element={<ClosedLeaves />} />
          <Route path="mess-menu" element={<ManagerMessMenu />} />
          <Route path="announcements" element={<ManagerAnnouncements />} />
          <Route path="*" element={<Navigate to="pending" />} />
        </Route>

        {/* ================= ADMIN DASHBOARD ================= */}
        /* ================= ADMIN DASHBOARD ================= */
<Route path="/admin/dashboard" element={<AdminDashboard />}>
  <Route index element={<AdminOverview />} />
  <Route path="overview" element={<AdminOverview />} />

  {/* ✅ ADD THESE TWO */}
  <Route path="users" element={<AdminUsers />} />
  <Route path="leaves" element={<AdminLeaves />} />

  <Route path="managers" element={<AdminManagers />} />
  <Route path="*" element={<Navigate to="overview" />} />
</Route>


        {/* 🔁 Global fallback */}
        <Route path="*" element={<Navigate to="/register" />} />

      </Routes>
    </BrowserRouter>
  );
}
