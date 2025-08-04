import { useEffect, useState } from "react";
import { format } from "date-fns";
import '../css/mqtt.css'

export const Header = () => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = time.getHours();
  const greeting = hour < 12 ? "Buenos días" : "Buenas tardes";

  return (
  <header className="header">
    <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem"}}>
      {greeting}
    </h1>
    <div className="time-section">
      <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.25rem" }}>
        {format(time, "hh:mm a")}
      </h2>
      <h3 style={{ fontSize: "1rem", fontWeight: "normal", color: "#555" }}>
        {format(time, "EEEE, MMMM dd")}
      </h3>
    </div>
  </header>
);

};
