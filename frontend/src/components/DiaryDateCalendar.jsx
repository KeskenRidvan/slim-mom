import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function parseDisplayDate(displayDate) {
  const [day, month, year] = String(displayDate || "").split(".");
  if (!day || !month || !year) return null;

  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function toDisplayDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

const CalendarToggle = forwardRef(function CalendarToggle(props, ref) {
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      className="diary-date-icon"
      aria-label="Select diary date"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2V6" />
        <path d="M8 2V6" />
        <path d="M3 9H21" />
      </svg>
    </button>
  );
});

export function DiaryDateCalendar({ value, onChange }) {
  return (
    <div className="diary-date-calendar">
      <span className="diary-date-label">{value}</span>
      <DatePicker
        selected={parseDisplayDate(value)}
        onChange={(nextValue) => onChange(toDisplayDate(nextValue))}
        dateFormat="dd.MM.yyyy"
        customInput={<CalendarToggle />}
      />
    </div>
  );
}
