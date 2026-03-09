import "../App.css";

export default function MainLayout({ children }) {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <h1>Welcome to Hostel Mate</h1>
        <a href="/">Home</a>
        <a href="/login">Login</a>
      </aside>

      <main className="main-content auth-bg">
        <div className="auth-content">
          {children}
        </div>
      </main>
    </div>
  );
}
