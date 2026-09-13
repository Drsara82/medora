import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export function Modal({ children, close, label, small = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const controls = [
          ...ref.current.querySelectorAll(
            "button:not([disabled]),a,input,select",
          ),
        ];
        if (!controls.length) return;
        const first = controls[0],
          last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector("button:not([disabled])")?.focus();
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [close]);
  return (
    <div
      className="overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        className={`modal ${small ? "small" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
      >
        <button
          type="button"
          className="modal-close"
          onClick={close}
          aria-label="Close dialog"
        >
          <X />
        </button>
        {children}
      </div>
    </div>
  );
}
