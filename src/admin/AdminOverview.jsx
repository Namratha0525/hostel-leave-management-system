import { useEffect, useState } from "react";
import { fetchAdmin } from "./adminApi";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const response = await fetchAdmin("/admin/overview");
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="manager-page">
        <PageHeader title="Admin Overview" homePath="/admin/dashboard" />
        <p>Loading overview…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manager-page">
        <PageHeader title="Admin Overview" homePath="/admin/dashboard" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="manager-page">
      <PageHeader title="Admin Overview" homePath="/admin/dashboard" />

      <div className="overview-grid">
        <div className="overview-card">
          <h3>Total Students</h3>
          <p>{data?.students ?? 0}</p>
        </div>
        <div className="overview-card">
          <h3>Total Managers</h3>
          <p>{data?.managers ?? 0}</p>
        </div>
        <div className="overview-card">
          <h3>Pending Leaves</h3>
          <p>{data?.leaves?.pending ?? 0}</p>
        </div>
        <div className="overview-card">
          <h3>Approved Leaves</h3>
          <p>{data?.leaves?.approved ?? 0}</p>
        </div>
        <div className="overview-card">
          <h3>Rejected Leaves</h3>
          <p>{data?.leaves?.rejected ?? 0}</p>
        </div>
        <div className="overview-card">
          <h3>Emergency Flags</h3>
          <p>{data?.emergencyFlags ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
