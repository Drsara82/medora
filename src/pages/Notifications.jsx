import { useState } from "react";
import { Bell } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";

export function Notifications() {
  const { notifications, setNotifications } = useStore();
  const [filter, setFilter] = useState("all");
  const list = notifications.filter(
    (item) =>
      filter === "all" ||
      (filter === "unread" ? !item.read : item.category === filter),
  );
  const mark = (id) =>
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  return (
    <section className="page narrow-page">
      <PageMeta title="Notifications | Medora" />
      <div className="page-title">
        <span className="eyebrow">Local updates</span>
        <h1>Notifications</h1>
        <p>
          These messages describe demo activity on this device; no external
          notifications are sent.
        </p>
      </div>
      <div className="notification-tools">
        <div className="tabs">
          {["all", "unread", "Appointment", "Saved"].map((item) => (
            <button
              type="button"
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="clear-filters"
          onClick={() =>
            setNotifications((items) =>
              items.map((item) => ({ ...item, read: true })),
            )
          }
        >
          Mark all as read
        </button>
      </div>
      {list.length ? (
        <div className="notification-list">
          {list.map((item) => (
            <article className={item.read ? "read" : "unread"} key={item.id}>
              <span className="notification-icon">
                <Bell />
              </span>
              <div>
                <small>
                  {item.category} · {item.read ? "Read" : "Unread"}
                </small>
                <h2>{item.title}</h2>
                <p>{item.message}</p>
              </div>
              {!item.read && (
                <button type="button" onClick={() => mark(item.id)}>
                  Mark as read
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty">
          <Bell />
          <h2>No notifications here</h2>
          <p>Try another filter or return later after using the demo.</p>
        </div>
      )}
    </section>
  );
}
