import { useEffect, useState } from "react";
import { fetchAdmin } from "./adminApi";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

export default function AdminUsers() {
  const [students, setStudents] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAdmin("/admin/users");
        setStudents(data.students ?? []);
        setManagers(data.managers ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="manager-page">
      <PageHeader title="User Directory" homePath="/admin/dashboard" />

      {loading ? (
        <p>Loading users…</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h3>Students</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>USN</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.usn}>
                  <td>{s.usn}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.course}</td>
                  <td>{s.semester}</td>
                  <td>{s.room_no}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 32 }}>Managers</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <tr key={m.id}>
                  <td>{m.manager_name}</td>
                  <td>{m.email}</td>
                  <td>{m.phoneno || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
