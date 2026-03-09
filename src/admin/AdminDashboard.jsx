import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import "../styles/dashboard.css";
import "../styles/admin.css";

export default function AdminDashboard() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error('Auth error or no user:', authError);
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError || !profile || profile.role !== "admin") {
          console.error('Not an admin:', profileError || 'No admin role found');
          navigate("/login");
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error verifying admin:', error);
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (checking) {
    return (
      <div className="dashboard">
        <main className="content">
          <p>Validating admin access…</p>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="dashboard">
        <main className="content">
          <p>Access Denied. Redirecting to login...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">HostelMate</h2>
        <div className="admin-badge">Admin Panel</div>

        <nav className="nav">
          {/* Dashboard Overview */}
          <NavLink
            to="overview"
            end
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="nav-icon" aria-hidden="true"></i> Overview
          </NavLink>

          {/* User Management */}
          <div className="nav-section">User Management</div>
          <NavLink
            to="users"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="nav-icon" aria-hidden="true"></i> User Directory
          </NavLink>
          <NavLink
            to="managers"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="nav-icon" aria-hidden="true"></i> Manage Managers
          </NavLink>

          {/* Leave Management */}
          <div className="nav-section">Leave Management</div>
          <NavLink
            to="leaves"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <i className="nav-icon" aria-hidden="true"></i> Leave Monitor
          </NavLink>

          
        </nav>

        <div className="nav-footer">
          <button 
            className="logout-btn"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
