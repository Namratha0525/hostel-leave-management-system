import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/managerleave.css";
import PageHeader from "../components/PageHeader";

export default function RejectedLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRejected = async () => {
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
          closed_at,
          students:students!leave_requests_std_usn_fkey (
            course,
            semester,
            room_no
          )
        `)
        .eq("status", "rejected")
        .order("closed_at", { ascending: false });

      if (error) {
        console.error("Load rejected error:", error);
        setLoading(false);
        return;
      }

      setLeaves(data || []);
      setLoading(false);
    };

    loadRejected();
  }, []);

  if (loading) return <p>Loading rejected leaves…</p>;

  return (
    <div className="manager-page">
      <PageHeader
        title="Rejected Leave Requests"
        homePath="/manager/dashboard"
      />

      {leaves.length === 0 ? (
        <p>No rejected requests</p>
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
              <th>Reason</th>
              <th>Emergency</th>
              <th>Rejected On</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.student_name} ({l.std_usn})</td>
                <td>{l.students.course}</td>
                <td>{l.students.semester}</td>
                <td>{l.students.room_no}</td>
                <td>{l.student_phone}</td>
                <td>{l.student_parents_ph}</td>
                <td>{l.leave_from_date}</td>
                <td>{l.leave_to_date}</td>
                <td>{l.reason_of_leave}</td>
                <td>{l.emergency ? "YES" : "NO"}</td>
                <td>{l.closed_at?.slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
