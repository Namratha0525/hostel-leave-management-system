import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/calendar.css";
import PageHeader from "../components/PageHeader";

export default function LeaveCalendar() {
  const [leaves, setLeaves] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  /* ===============================
     LOAD LEAVE DATA
  =============================== */
  useEffect(() => {
    const loadLeaves = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("std_usn")
        .eq("id", user.id)
        .single();

      if (!profile?.std_usn) return;

      const { data, error } = await supabase
        .from("leave_requests")
        .select("leave_from_date, leave_to_date, status")
        .eq("std_usn", profile.std_usn);

      if (error) {
        console.error(error);
        return;
      }

      setLeaves(data || []);
    };

    loadLeaves();
  }, []);

  /* ===============================
     HELPERS
  =============================== */
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const startDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const getStatusClass = (status) => {
  if (!status) return "";

  const s = status.trim().toLowerCase();

  if (s === "approved" || s === "closed") return "approved";
  if (s === "rejected") return "rejected";
  return "requested";
};


  const isLeaveDay = (date) => {
    return leaves.find((leave) => {
      const from = new Date(leave.leave_from_date);
      const to = new Date(leave.leave_to_date);
      return date >= from && date <= to;
    });
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="calendar-page">
      <PageHeader title="My Leave Calendar" homePath="/student/dashboard" />

      <div className="calendar-card">
        <h2>
          {currentMonth.toLocaleString("default", { month: "long" })}{" "}
          {currentMonth.getFullYear()}
        </h2>

        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-name">{d}</div>
          ))}

          {Array(startDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} className="empty-day" />
          ))}

          {Array(daysInMonth).fill(null).map((_, i) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              i + 1
            );

            const leave = isLeaveDay(date);
            const statusClass = leave ? getStatusClass(leave.status) : "";

            return (
              <div key={i} className={`day ${statusClass}`}>
                {i + 1}
              </div>
            );
          })}
        </div>

        <div className="legend">
          <span className="requested">Requested</span>
          <span className="approved">Approved / Closed</span>
          <span className="rejected">Rejected</span>
        </div>
      </div>
    </div>
  );
}
