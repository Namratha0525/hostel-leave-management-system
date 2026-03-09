import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/managerleave.css";
import PageHeader from "../components/PageHeader";

export default function ApprovedLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD APPROVED LEAVES
  =============================== */
  useEffect(() => {
    const loadApproved = async () => {
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
          emergency,
          students:students!leave_requests_std_usn_fkey (
            course,
            semester,
            room_no
          )
        `)
        .eq("status", "approved")
        .order("approved_at", { ascending: false });

      if (error) {
        console.error("Load approved error:", error);
        setLoading(false);
        return;
      }

      setLeaves(data || []);
      setLoading(false);
    };

    loadApproved();
  }, []);

  /* ===============================
     CLOSE LEAVE (RLS SAFE)
  =============================== */
  const closeLeave = async (leaveId) => {
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "closed",
        closed_at: new Date(),
      })
      .eq("id", leaveId);

    if (error) {
      console.error(error);
      alert("Failed to close leave");
      return;
    }

    setLeaves(prev => prev.filter(l => l.id !== leaveId));
  };

  if (loading) return <p>Loading approved leaves…</p>;

  return (
    <div className="manager-page">
      <PageHeader
        title="Approved Leave Requests"
        homePath="/manager/dashboard"
      />

      {leaves.length === 0 ? (
        <p>No approved requests</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Room No</th>
              <th>Student Phone</th>
              <th>Parent Phone</th>
              <th>From</th>
              <th>To</th>
              <th>Leaving</th>
              <th>Return</th>
              <th>Reason</th>
              <th>Emergency</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.student_name} ({l.std_usn})</td>
                <td>{l.students?.course}</td>
                <td>{l.students?.semester}</td>
                <td>{l.students?.room_no}</td>
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
                    className="reject"
                    onClick={() => closeLeave(l.id)}
                  >
                    Close
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
