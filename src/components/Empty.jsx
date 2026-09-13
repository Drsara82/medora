import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

export function Empty({
  title = "No appointments yet",
  text = "When you book a fictional doctor, your sample visit will appear here.",
  actionText = "Find a doctor",
  onAction,
}) {
  return (
    <div className="empty">
      <CalendarDays />
      <h2>{title}</h2>
      <p>{text}</p>
      {onAction ? (
        <button type="button" className="button" onClick={onAction}>
          {actionText}
        </button>
      ) : (
        <Link className="button" to="/doctors">
          {actionText}
        </Link>
      )}
    </div>
  );
}
