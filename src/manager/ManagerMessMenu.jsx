import { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import PageHeader from "../components/PageHeader";
import "../styles/managerleave.css";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function ManagerMessMenu() {
  const [week, setWeek] = useState([]);

  useEffect(() => {
    generateWeek();
  }, []);

  const generateWeek = async () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);

    const temp = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      temp.push({
        day: days[i],
        date: d.toISOString().slice(0, 10),
        breakfast: "",
        lunch: "",
        snacks: "",
        dinner: ""
      });
    }

    // ✅ fetch existing menu (FIXED)
    const { data, error } = await supabase
      .from("mess_menu")
      .select("*")
      .gte("menu_date", temp[0].date)
      .lte("menu_date", temp[6].date);

    if (error) {
      console.error(error);
      setWeek(temp);
      return;
    }

    // ✅ merge db data with week template
    const merged = temp.map(day => {
      const found = data?.find(m => m.menu_date === day.date);
      return found
        ? { ...day, ...found, date: found.menu_date }
        : day;
    });

    setWeek(merged);
  };

  const updateCell = (index, field, value) => {
    const updated = [...week];
    updated[index][field] = value;
    setWeek(updated);
  };

  const saveWeek = async () => {
    const payload = week.map(d => ({
      menu_date: d.date,
      breakfast: d.breakfast,
      lunch: d.lunch,
      snacks: d.snacks,
      dinner: d.dinner
    }));

    const { error } = await supabase
      .from("mess_menu")
      .upsert(payload, { onConflict: "menu_date" });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Weekly menu saved ✅");
  };

  return (
    <div className="manager-page">
      <PageHeader title="Weekly Mess Menu" homePath="/manager/dashboard" />

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
          {week.map((d, i) => (
            <tr key={d.date}>
              <td>{d.day}</td>
              <td>{d.date}</td>

              {["breakfast","lunch","snacks","dinner"].map(meal => (
                <td key={meal}>
                  <input
                    value={d[meal] || ""}
                    onChange={e => updateCell(i, meal, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button className="approve" onClick={saveWeek}>
        Save Weekly Menu
      </button>
    </div>
  );
}
