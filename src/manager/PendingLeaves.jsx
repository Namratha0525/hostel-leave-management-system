import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/managerleave.css";
import PageHeader from "../components/PageHeader";

export default function PendingLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD PENDING LEAVES
  =============================== */
  useEffect(() => {
    const loadLeaves = async () => {
      const { data, error } = await supabase
        .from("leave_requests")
        .select(`
          id,
          std_usn,
          student_name,
          student_phone,
          student_parents_ph,
          leave_from_date,
          leave_to_date,
          time_of_leaving,
          time_of_return,
          reason_of_leave,
          emergency
        `)
        .eq("status", "requested")
        .order("leave_from_date", { ascending: true });

      if (error) {
        console.error("Load pending error:", error);
        setLoading(false);
        return;
      }

      setLeaves(data || []);
      setLoading(false);
    };

    loadLeaves();
  }, []);

  /* ===============================
     APPROVE LEAVE ✅ RLS SAFE
  =============================== */
  const approveLeave = async (leaveId) => {
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "approved",
        approved_at: new Date(),
      })
      .eq("id", leaveId);

    if (error) {
      console.error(error);
      alert("Failed to approve leave");
      return;
    }

    setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
  };

  /* ===============================
     REJECT LEAVE ✅ RLS SAFE
  =============================== */
  const rejectLeave = async (leaveId) => {
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "rejected",
        approved_at: new Date(),
        closed_at: new Date(),
      })
      .eq("id", leaveId);

    if (error) {
      console.error(error);
      alert("Failed to reject leave");
      return;
    }

    setLeaves((prev) => prev.filter((l) => l.id !== leaveId));
  };

  if (loading) return <p>Loading pending leaves…</p>;

  return (
    <div className="manager-page">
      <PageHeader
        title="Pending Leave Requests"
        homePath="/manager/dashboard"
      />

      {leaves.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Student Phone</th>
              <th>Parent Phone</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Leaving Time</th>
              <th>Return Time</th>
              <th>Reason</th>
              <th>Emergency</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.student_name} ({l.std_usn})</td>
                <td>{l.student_phone}</td>
                <td>{l.student_parents_ph}</td>
                <td>{l.leave_from_date}</td>
                <td>{l.leave_to_date}</td>
                <td>{l.time_of_leaving || "-"}</td>
                <td>{l.time_of_return || "-"}</td>
                <td>{l.reason_of_leave}</td>
                <td>{l.emergency ? "YES" : "NO"}</td>
                <td>
                  <button
                    className="approve"
                    onClick={() => approveLeave(l.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject"
                    onClick={() => rejectLeave(l.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
