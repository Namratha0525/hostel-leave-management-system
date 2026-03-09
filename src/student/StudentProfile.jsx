import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import "../styles/profile.css";
import PageHeader from "../components/PageHeader";

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [semester, setSemester] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // 1️⃣ Get USN from user_profiles
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("std_usn")
        .eq("id", user.id)
        .single();

      if (profileError || !profile?.std_usn) {
        console.error("USN not found in user_profiles", profileError);
        setLoading(false);
        return;
      }

      // 2️⃣ Get student details using USN
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("usn", profile.std_usn)
        .single();

      if (studentError || !studentData) {
        console.error("Student not found", studentError);
        setLoading(false);
        return;
      }

      setStudent(studentData);
      setSemester(studentData.semester ?? "");
      setRoomNo(studentData.room_no ?? "");
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const saveChanges = async () => {
    if (!student) return;

    await supabase
      .from("students")
      .update({ semester, room_no: roomNo })
      .eq("usn", student.usn);

    setStudent({ ...student, semester, room_no: roomNo });
    setEditing(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>Profile not found</p>;

  return (
    <>
      <PageHeader title="Student Profile" homePath="/student/dashboard" />

      <div className="profile-card">
        <p><b>Name:</b> {student.name}</p>
        <p><b>USN:</b> {student.usn}</p>
        <p><b>Email:</b> {student.email}</p>
        <p><b>Course:</b> {student.course}</p>

        <p>
          <b>Semester:</b>{" "}
          {editing ? (
            <input
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          ) : (
            student.semester
          )}
        </p>

        <p>
          <b>Room No:</b>{" "}
          {editing ? (
            <input
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
            />
          ) : (
            student.room_no
          )}
        </p>

        {!editing ? (
          <button onClick={() => setEditing(true)}>Edit</button>
        ) : (
          <>
            <button onClick={saveChanges}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </>
  );
}
