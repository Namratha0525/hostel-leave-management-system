import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

export default function StudentAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("announcements")
      .select("id, msg, created_at")
      .lte("visible_from", today)
      .gte("visible_till", today)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAnnouncements(data || []);
  };

  return (
    <div className="manager-page">
      <PageHeader title="Announcements" homePath="/student/dashboard" />

      {announcements.length === 0 ? (
        <p className="no-announcements">No announcements</p>
      ) : (
        <div className="announcement-list">
          {announcements.map((a) => (
            <div key={a.id} className="announcement-card">
              <p>{a.msg}</p>
              <small>
                Posted on: {a.created_at.slice(0, 10)}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
