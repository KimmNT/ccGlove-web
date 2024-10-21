import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

export default function Testing() {
  const [selectedDates, setSelectedDates] = useState([]); // Store multiple selected dates
  const [calendarKey, setCalendarKey] = useState(0); // Track calendar key for force re-render

  const toggleDateSelection = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");

    if (isDateSelected(date)) {
      // Remove the date if it's already selected
      setSelectedDates((prevDates) =>
        prevDates.filter((dateObj) => dateObj.selectedDate !== formattedDate)
      );
    } else {
      // Add the date if it's not selected
      setSelectedDates((prevDates) => [
        ...prevDates,
        {
          selectedDate: formattedDate,
          startTime: 7, // Default value
          duration: 3, // Default value
          title: "",
          detail: "",
        },
      ]);
    }

    // Force re-render by updating the key
    setCalendarKey(calendarKey + 1);
  };

  const isDateSelected = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    return selectedDates.some(
      (dateObj) => dateObj.selectedDate === formattedDate
    );
  };

  return (
    <div>
      <Calendar
        key={calendarKey} // Add a key prop that changes on every date toggle
        onClickDay={toggleDateSelection}
        tileClassName={({ date, view }) =>
          view === "month" && isDateSelected(date)
            ? "selected-date"
            : "not-selected-date"
        }
      />
      <div>
        <h3>Selected Dates:</h3>
        <ul>
          {selectedDates.map((date, index) => (
            <li key={index}>{date.selectedDate}</li>
          ))}
        </ul>
      </div>

      {/* Add your custom CSS for selected dates */}
      <style jsx>{`
        .selected-date {
          background-color: #ffc107;
          color: white;
        }
      `}</style>
    </div>
  );
}
