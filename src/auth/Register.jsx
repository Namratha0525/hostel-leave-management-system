import { useState } from "react";
import { supabase } from "../supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function Register() {
  const { role } = useParams();
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const sendLink = async () => {
    let email;

    if (role === "student") {
      const usn = value.trim().toUpperCase();
      const { data } = await supabase
        .from("students")
        .select("email")
        .ilike("usn", usn)
        .maybeSingle();

      if (!data) return alert("Student not found");
      email = data.email;
      localStorage.setItem("usn", usn);
    } 
    else if (role === "manager") {
      const managerEmail = value.trim().toLowerCase();
      const { data } = await supabase
        .from("manager")
        .select("email")
        .eq("email", managerEmail)
        .maybeSingle();

      if (!data) return alert("Manager not found");
      email = data.email;
    } 
    else if (role === "admin") {
      const adminEmail = value.trim().toLowerCase();
      const { data } = await supabase
        .from("admins")
        .select("email")
        .eq("email", adminEmail)
        .maybeSingle();

      if (!data) return alert("Admin not found");
      email = data.email;
    } 
    else {
      alert("Invalid role");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) return alert("Failed to send login link");

    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    alert("Login link sent");
    navigate("/login");
  };

  return (
    <MainLayout>
      {/* IMPORTANT: background INSIDE layout */}
      <div className="register-bg">
        <div className="register-card">
          <h2>{role.toUpperCase()} Registration</h2>

          <input
            className="register-input"
            placeholder={role === "student" ? "Enter USN" : "Enter Email"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button className={`register-btn ${role}`} onClick={sendLink}>
            Send Login Link
          </button>

          <p>
            Already registered? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
