import { CalendarDays, Info, MapPin, UserRound, Video } from "lucide-react";
import { prettyDate } from "../utils";

export function BookingSummary({ doctor, date, time, type }) {
  return (
    <aside className="booking-side-note">
      <span className="eyebrow">Your selection</span>
      <h2>Appointment summary</h2>
      <div className="booking-side-details">
        <p>
          <UserRound />
          <span>
            <small>Doctor</small>
            <b>{doctor.name}</b>
          </span>
        </p>
        <p>
          <CalendarDays />
          <span>
            <small>Date and time</small>
            <b>{prettyDate(date)}</b>
            <span>{time}</span>
          </span>
        </p>
        <p>
          {type === "Video" ? <Video /> : <MapPin />}
          <span>
            <small>Consultation</small>
            <b>{type}</b>
          </span>
        </p>
        <p className="booking-side-fee">
          <span>Demo fee</span>
          <b>SAR {doctor.fee}</b>
        </p>
      </div>
      <div className="booking-side-demo">
        <Info />
        <p>
          You can review everything before saving this appointment locally. No
          clinic is contacted.
        </p>
      </div>
    </aside>
  );
}
