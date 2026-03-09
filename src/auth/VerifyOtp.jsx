import { useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const verifyOtp = async () => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const usn = localStorage.getItem("usn");

    // 1️⃣ Verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2️⃣ Set password
    const { error: passErr } = await supabase.auth.updateUser({
      password: password,
    });

    if (passErr) {
      alert(passErr.message);
      return;
    }

    // 3️⃣ 🔥 INSERT INTO user_profiles (THIS FIXES EVERYTHING)
    if (role === "student") {
      await supabase.from("user_profiles").insert({
        id: data.user.id,
        role: "student",
        std_usn: usn,
        manager_id: null,
      });

      // optional: keep this if you want auth_user_id in students table
      await supabase
        .from("students")
        .update({ auth_user_id: data.user.id })
        .eq("usn", usn);

    } else {
      await supabase.from("user_profiles").insert({
        id: data.user.id,
        role: "manager",
        manager_id: Number(localStorage.getItem("manager_id")),
        std_usn: null,
      });

      await supabase
        .from("manager")
        .update({ auth_user_id: data.user.id })
        .eq("email", email);
    }

    // 4️⃣ Done → go to login
    navigate("/login");
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <input
        type="password"
        placeholder="Set Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={verifyOtp}>Verify</button>
    </div>
  );
}
