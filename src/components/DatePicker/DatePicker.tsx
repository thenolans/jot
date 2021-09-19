import "react-day-picker/lib/style.css";

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
        container: "DayPicker bg-gray-100 rounded w-full",
        wrapper: "DayPicker-wrapper",
        interactionDisabled: "DayPicker--interactionDisabled",
        months: "DayPicker-Months",
        month: "DayPicker-Month",

        navBar: "DayPicker-NavBar",
        navButtonPrev: "DayPicker-NavButton DayPicker-NavButton--prev right-5",
        navButtonNext: "DayPicker-NavButton DayPicker-NavButton--next right-5",
        navButtonInteractionDisabled:
          "DayPicker-NavButton--interactionDisabled",

        caption: "DayPicker-Caption px-0",
        weekdays: "DayPicker-Weekdays",
        weekdaysRow: "DayPicker-WeekdaysRow",
        weekday: "DayPicker-Weekday",
        body: "DayPicker-Body",
        week: "DayPicker-Week",
        weekNumber: "DayPicker-WeekNumber",
        day: "DayPicker-Day p-0 w-10 h-10 hover:bg-gray-100",
        footer: "DayPicker-Footer",
        todayButton: "DayPicker-TodayButton",

        // default modifiers
        today: "today",
        selected: "text-white bg-yellow-600 hover:bg-yellow-700",
        disabled: "disabled",
        outside: "outside",
      }}
      onDayClick={onChange}
      selectedDays={value ? dayjs(value).toDate() : undefined}
    />
  );
}
