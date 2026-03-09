import { useEffect } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // 1️⃣ Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/login");
        return;
      }

      // 2️⃣ Fetch profile if exists
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
        alert(profileError.message);
        navigate("/login");
        return;
      }

      // 3️⃣ Create profile if NOT exists
      if (!profile) {
        const role = localStorage.getItem("role");

        // 🟣 STUDENT PROFILE
        if (role === "student") {
          const { error } = await supabase.from("user_profiles").insert({
            id: user.id,
            role: "student",
            std_usn: localStorage.getItem("usn"),
            password_set: false,
          });

          if (error) {
            console.error(error);
            alert(error.message);
            navigate("/login");
            return;
          }
        }

        // 🟣 MANAGER PROFILE (IMPORTANT FIX)
        if (role === "manager") {
          const { data: manager, error: mgrErr } = await supabase
            .from("manager")
            .select("id")
            .eq("email", user.email)
            .single();

          if (mgrErr || !manager) {
            alert("Manager record not found");
            navigate("/login");
            return;
          }

          const { error } = await supabase.from("user_profiles").insert({
            id: user.id,
            role: "manager",
            manager_id: manager.id,
            password_set: false,
          });

          if (error) {
            console.error(error);
            alert(error.message);
            navigate("/login");
            return;
          }
        }

        // 🟣 ADMIN PROFILE
        if (role === "admin") {
          const { data: adminRecord, error: adminError } = await supabase
            .from("admins")
            .select("id")
            .eq("email", user.email)
            .single();

          if (adminError || !adminRecord) {
            alert("Admin record not found");
            navigate("/login");
            return;
          }

          const { error } = await supabase.from("user_profiles").insert({
            id: user.id,
            role: "admin",
            password_set: false,
          });

          if (error) {
            console.error(error);
            alert(error.message);
            navigate("/login");
            return;
          }
        }

        navigate("/set-password");
        return;
      }

      // 4️⃣ Password not set
      if (!profile.password_set) {
        navigate("/set-password");
        return;
      }

      // 5️⃣ Normal login
      const roleRedirects = {
        student: "/student/dashboard",
        manager: "/manager/dashboard",
        admin: "/admin/dashboard",
      };

      navigate(roleRedirects[profile.role] ?? "/login");
    };

    handleAuth();
  }, [navigate]);

  return (
    <MainLayout>
      <div className="card">
        <h2>Signing you in…</h2>
        <p>Please wait</p>
      </div>
    </MainLayout>
  );
}
