import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";

export default function RoleSelect() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="card">
        <h2>Register as</h2>

        <button onClick={() => navigate("/register/student")}>
          Student
        </button>

        <button onClick={() => navigate("/register/manager")}>
          Manager
        </button>

        <button onClick={() => navigate("/register/admin")}>
          Admin
        </button>

        <p className="small-text">
          Already registered?{" "}
          <span
            className="text-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </MainLayout>
  );
}
