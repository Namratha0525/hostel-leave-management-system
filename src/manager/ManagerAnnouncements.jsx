import { useState } from "react";
import { supabase } from "../supabase/client";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

export default function ManagerAnnouncements() {
  const [msg, setMsg] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const postAnnouncement = async () => {
    // ===============================
    // Basic validation
    // ===============================
    if (!msg || !fromDate || !toDate) {
      alert("Fill all fields");
      return;
    }

    if (toDate < fromDate) {
      alert("Visible Till date cannot be before Visible From");
      return;
    }

    setLoading(true);

    try {
      // ===============================
      // 1️⃣ Get logged-in user
      // ===============================
      const { data, error: authError } = await supabase.auth.getUser();

      if (authError || !data?.user) {
        throw new Error("User not authenticated");
      }

      const userId = data.user.id;
      console.log("AUTH USER ID:", userId);

      // ===============================
      // 2️⃣ Fetch user profile
      // ===============================
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      console.log("PROFILE RESPONSE:", profile, profileError);

      if (profileError || !profile) {
        throw new Error("Profile not found");
      }

      // ===============================
      // 3️⃣ Manager authorization
      // Manager = manager_id NOT NULL
      // ===============================
      if (!profile.manager_id) {
        throw new Error("Access denied: Manager account required");
      }

      // ===============================
      // 4️⃣ Insert announcement
      // ===============================
      const { error: insertError } = await supabase
        .from("announcements")
        .insert({
          msg,
          announced_by: profile.manager_id,
          visible_from: fromDate,
          visible_till: toDate,
        });

      if (insertError) {
        console.error("ANNOUNCEMENT INSERT ERROR:", insertError);
        throw insertError;
      }

      alert("Announcement posted ✅");

      // ===============================
      // 5️⃣ Reset form
      // ===============================
      setMsg("");
      setFromDate("");
      setToDate("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-page">
      <PageHeader title="Post Announcement" homePath="/manager/dashboard" />

      <div className="leave-card">
        <label>Announcement</label>
        <textarea
          rows="4"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <label>Visible From</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <label>Visible Till</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button onClick={postAnnouncement} disabled={loading}>
          related to above: {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
