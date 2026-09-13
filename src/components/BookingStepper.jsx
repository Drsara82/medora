import { Check } from "lucide-react";

export function BookingStepper({ current }) {
  return (
    <ol className="stepper" aria-label="Booking progress">
      {["Schedule", "Patient details", "Review"].map((label, index) => (
        <li
          className={
            current === index + 1
              ? "current"
              : current > index + 1
                ? "done"
                : ""
          }
          aria-current={current === index + 1 ? "step" : undefined}
          key={label}
        >
          <span>{current > index + 1 ? <Check /> : index + 1}</span>
          {label}
        </li>
      ))}
    </ol>
  );
}
