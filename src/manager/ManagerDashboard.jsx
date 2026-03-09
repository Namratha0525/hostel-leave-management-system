import { NavLink, Outlet } from "react-router-dom";
import "../styles/dashboard.css";

export default function ManagerDashboard() {
  return (
    <div className="dashboard manager-dashboard">
      <aside className="sidebar">
        <h2 className="logo">HostelMate</h2>
        <nav className="nav">
          <NavLink
            to="pending"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Pending Requests
          </NavLink>

          <NavLink
            to="approved"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Approved Requests
          </NavLink>

          {/* ✅ NEW: REJECTED LEAVES */}
          <NavLink
            to="rejected"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Rejected Requests
          </NavLink>

          <NavLink
            to="closed"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Closed Applications
          </NavLink>

          <NavLink
            to="mess-menu"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Mess Menu
          </NavLink>

          <NavLink
            to="announcements"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Announcements
          </NavLink>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
