import { useEffect, useState } from "react";
import { fetchAdmin } from "./adminApi";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

export default function AdminManagers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const loadManagers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdmin("/admin/users");
      setManagers(data.managers ?? []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSaving(true);
    try {
      await fetchAdmin("/admin/managers", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
        }),
      });

      setName("");
      setEmail("");
      setPhone("");
      await loadManagers();
      alert("Manager added. They can now sign in via the manager registration flow.");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="manager-page">
      <PageHeader title="Manage Managers" homePath="/admin/dashboard" />

      <div className="admin-table-wrapper" style={{ marginBottom: 24 }}>
        <h3 style={{ color: "#c7d2fe", marginTop: 0 }}>Add Manager</h3>
        <form className="manager-form" onSubmit={submit}>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Add Manager"}
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading managers…</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <h3 style={{ color: "#c7d2fe", marginTop: 0 }}>Existing Managers</h3>
          {managers.length === 0 ? (
            <p>No managers in system.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((mgr) => (
                  <tr key={mgr.id}>
                    <td>{mgr.name}</td>
                    <td>{mgr.email}</td>
                    <td>{mgr.phone || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
