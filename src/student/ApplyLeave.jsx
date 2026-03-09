import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/applyLeave.css";
import PageHeader from "../components/PageHeader";

export default function ApplyLeave() {
  const [student, setStudent] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeLeaving, setTimeLeaving] = useState("");
  const [timeReturn, setTimeReturn] = useState("");
  const [reason, setReason] = useState("");
  const [place, setPlace] = useState("");
  const [emergency, setEmergency] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("std_usn")
        .eq("id", user.id)
        .single();

      if (!profile?.std_usn) return;

      const { data } = await supabase
        .from("students")
        .select("name, usn, email, std_ph, parent_ph, course, semester, room_no")
        .eq("usn", profile.std_usn)
        .single();

      setStudent(data);
    };

    loadStudent();
  }, []);

  const submitLeave = async () => {
    if (!student) return;

    if (!fromDate || !toDate || !timeLeaving || !timeReturn || !reason || !place) {
      alert("Please fill all fields");
      return;
    }

    const from = new Date(fromDate);
    const today = new Date();
    const diffDays = Math.ceil((from - today) / (1000 * 60 * 60 * 24));

    if (!emergency && diffDays < 2) {
      alert("Leave must be applied at least 2 days in advance");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("leave_requests").insert({
      std_usn: student.usn,
      student_name: student.name,
      student_email: student.email,
      student_phone: student.std_ph,
      student_parents_ph: student.parent_ph,
      leave_from_date: fromDate,
      leave_to_date: toDate,
      time_of_leaving: timeLeaving,
      time_of_return: timeReturn,
      reason_of_leave: reason,
      place_during_leave: place,
      emergency,
      status: "requested",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Leave applied successfully ✅");
    setFromDate("");
    setToDate("");
    setTimeLeaving("");
    setTimeReturn("");
    setReason("");
    setPlace("");
    setEmergency(false);
  };

  if (!student) {
    return <p style={{ padding: "20px" }}>Loading student details…</p>;
  }

  return (
    <div className="apply-page">
      <PageHeader title="Apply Leave" />

      <div className="leave-card">

        {/* STUDENT INFO */}
        <div className="student-info">
          <p><b>Name:</b> {student.name}</p>
          <p><b>USN:</b> {student.usn}</p>
          <p><b>Course:</b> {student.course}</p>
          <p><b>Semester:</b> {student.semester}</p>
          <p><b>Room No:</b> {student.room_no}</p>
          <p><b>Email:</b> {student.email}</p>
          <p><b>Student Phone:</b> {student.std_ph}</p>
          <p><b>Parent Phone:</b> {student.parent_ph}</p>
        </div>

        {/* DATE ROW */}
        <div className="form-row">
          <div className="form-group">
            <label>From Date</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label>To Date</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
        </div>

        {/* TIME ROW */}
        <div className="form-row">
          <div className="form-group">
            <label>Time of Leaving</label>
            <input type="time" value={timeLeaving} onChange={e => setTimeLeaving(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Expected Time of Return</label>
            <input type="time" value={timeReturn} onChange={e => setTimeReturn(e.target.value)} />
          </div>
        </div>

        {/* TEXT AREAS */}
        <div className="form-group full-width">
          <label>Reason for Leave</label>
          <textarea rows="3" value={reason} onChange={e => setReason(e.target.value)} />
        </div>

        <div className="form-group full-width">
          <label>Place During Leave</label>
          <textarea rows="2" value={place} onChange={e => setPlace(e.target.value)} />
        </div>

        {/* EMERGENCY */}
        <div className="checkbox-group">
          <input type="checkbox" checked={emergency} onChange={e => setEmergency(e.target.checked)} />
          <span>Emergency Leave</span>
        </div>

        {/* ACTION */}
        <div className="action-row">
          <button className="submit-btn" onClick={submitLeave} disabled={loading}>
            {loading ? "Submitting..." : "Submit Leave"}
          </button>
        </div>

      </div>
    </div>
  );
}
