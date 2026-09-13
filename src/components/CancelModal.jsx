import { Trash2 } from "lucide-react";
import { prettyDate } from "../utils";
import { doctors } from "../doctors";
import { Modal } from "./Modal";

export function CancelModal({ appointment, close, confirm }) {
  const d = doctors.find((x) => x.id === appointment.doctorId);
  return (
    <Modal close={close} label="Cancel appointment" small>
      <div className="danger-icon">
        <Trash2 />
      </div>
      <h2>Cancel this appointment?</h2>
      <p>
        Your sample appointment with <b>{d.name}</b> on{" "}
        <b>{prettyDate(appointment.date)}</b> at <b>{appointment.time}</b> will
        be marked as cancelled on this device.
      </p>
      <div className="modal-actions">
        <button type="button" className="button" onClick={close}>
          Keep appointment
        </button>
        <button type="button" className="danger" onClick={confirm}>
          Cancel appointment
        </button>
      </div>
    </Modal>
  );
}
