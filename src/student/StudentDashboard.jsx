import { NavLink, Outlet } from "react-router-dom";
import "../styles/dashboard.css";

export default function StudentDashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">HostelMate</h2>

        <nav className="nav">
          <NavLink
            to="profile"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Profile
          </NavLink>

          <NavLink
            to="apply-leave"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Apply Leave
          </NavLink>

          <NavLink
            to="calendar"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Leave Calendar
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
