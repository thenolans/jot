import "react-day-picker/lib/style.css";
import "./DatePicker.css";

import dayjs from "dayjs";
import DayPicker from "react-day-picker";

type Props = {
  onChange: (date: Date) => void;
  value: Date | null;
};

export default function DatePicker({ onChange, value }: Props) {
  return (
    <DayPicker
      classNames={{
        container: "DayPicker",
        wrapper: "DayPicker-wrapper",
        interactionDisabled: "DayPicker--interactionDisabled",
        months: "DayPicker-Months",
        month: "DayPicker-Month",

        navBar: "DayPicker-NavBar",
        navButtonPrev: "DayPicker-NavButton DayPicker-NavButton--prev",
        navButtonNext: "DayPicker-NavButton DayPicker-NavButton--next",
        navButtonInteractionDisabled:
          "DayPicker-NavButton--interactionDisabled",

        caption: "DayPicker-Caption",
        weekdays: "DayPicker-Weekdays",
        weekdaysRow: "DayPicker-WeekdaysRow",
        weekday: "DayPicker-Weekday",
        body: "DayPicker-Body",
        week: "DayPicker-Week",
        weekNumber: "DayPicker-WeekNumber",
        day: "DayPicker-Day",
        footer: "DayPicker-Footer",
        todayButton: "DayPicker-TodayButton",

        // default modifiers
        today: "today",
        selected: "DayPicker-Day--selected",
        disabled: "DayPicker-Day--disabled",
        outside: "DayPicker-Day--outside",
      }}
      onDayClick={onChange}
      selectedDays={value ? dayjs(value).toDate() : undefined}
    />
  );
}
