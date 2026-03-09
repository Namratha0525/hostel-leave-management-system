import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        alert("Session expired. Click the email link again.");
        navigate("/login");
        return;
      }

      setSessionReady(true);
    };

    checkSession();
  }, [navigate]);

  const savePassword = async () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // 1️⃣ Set auth password
    const { error: authError } = await supabase.auth.updateUser({ password });
    if (authError) {
      alert(authError.message);
      return;
    }

    // 2️⃣ Get user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("User not found");
      navigate("/login");
      return;
    }

    // 3️⃣ Update profile
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .update({ password_set: true })
      .eq("id", user.id)
      .select("role")
      .maybeSingle();

    if (error) {
      console.error("Profile update error:", error);
      alert("Profile update failed");
      return;
    }

    if (!profile) {
      alert("Profile missing. Please login again.");
      navigate("/login");
      return;
    }

    // 4️⃣ Redirect
    const roleRedirects = {
      student: "/student/dashboard",
      manager: "/manager/dashboard",
      admin: "/admin/dashboard",
    };

    navigate(roleRedirects[profile.role] ?? "/login");
  };

  if (!sessionReady) return <p>Preparing account…</p>;

  return (
    <MainLayout>
      <div className="card">
        <h2>Create Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={savePassword}>Continue</button>
      </div>
    </MainLayout>
  );
}
