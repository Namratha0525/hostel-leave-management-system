import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function StudentMessMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    const today = new Date();

    // get monday of current week
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const { data, error } = await supabase
      .from("mess_menu")
      .select("*")
      .gte("menu_date", monday.toISOString().slice(0, 10))
      .lte("menu_date", sunday.toISOString().slice(0, 10))
      .order("menu_date");

    if (error) {
      console.error(error);
      setMenu([]);
    } else {
      setMenu(data || []);
    }

    setLoading(false);
  };

  return (
    <div className="manager-page">
      <PageHeader title="This Week's Mess Menu" homePath="/student/dashboard" />

      {loading ? (
        <p>Loading...</p>
      ) : menu.length === 0 ? (
        <p>No menu published</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Date</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Snacks</th>
              <th>Dinner</th>
            </tr>
          </thead>

          <tbody>
            {menu.map((m) => (
              <tr key={m.menu_date}>
                <td>{days[new Date(m.menu_date).getDay()]}</td>
                <td>{m.menu_date}</td>
                <td>{m.breakfast || "-"}</td>
                <td>{m.lunch || "-"}</td>
                <td>{m.snacks || "-"}</td>
                <td>{m.dinner || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
