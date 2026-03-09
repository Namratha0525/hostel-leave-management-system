import { useEffect, useState } from "react";
import { fetchAdmin } from "./adminApi";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

export default function AdminLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLeaves = async () => {
      try {
        const data = await fetchAdmin("/admin/leaves");
        setLeaves(data.leaves ?? []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLeaves();
  }, []);

  return (
    <div className="manager-page">
      <PageHeader title="Leave Monitor" homePath="/admin/dashboard" />

      {loading ? (
        <p>Loading leave requests…</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>USN</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Emergency</th>
              <th>Requested At</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l.id}>
                <td>{l.std_usn}</td>
                <td>{l.leave_from_date}</td>
                <td>{l.leave_to_date}</td>
                <td>{l.status}</td>
                <td>{l.emergency ? "Yes" : "No"}</td>
                <td>{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
