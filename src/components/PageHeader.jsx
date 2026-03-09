import { useNavigate } from "react-router-dom";
import "../styles/pageHeader.css";

export default function PageHeader({ title, homePath }) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <button className="nav-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <h2>{title}</h2>

      <button
        className="nav-btn"
        onClick={() => navigate(homePath)}
      >
        🏠 Home
      </button>
    </div>
  );
}