import React, { useState } from "react";

export default function Testing() {
  const [filteredDates, setFilteredDates] = useState([]);

  const datesArray = ["06/15/2024", "04/18/2024", "10/18/2024"];

  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const currentDate = new Date(`${month}/${day}/${year}`);

  const handleReturnValidItem = (discountArray, date, expiredInMonth) => {
    const sixMonthsEarlier = new Date(date);
    sixMonthsEarlier.setMonth(sixMonthsEarlier.getMonth() - expiredInMonth);

    const filteredDates = discountArray
      .map((date) => new Date(date)) // Convert each string date to a Date object
      .filter((date) => date >= sixMonthsEarlier) // Keep only dates strictly earlier than sixMonthsEarlier
      .sort((a, b) => a - b) // Sort the dates in ascending order
      .map((date) => date.toLocaleDateString("en-US")); // Convert Date objects back to MM/DD/YYYY format

    setFilteredDates(filteredDates);
  };

  return (
    <div>
      <div>current date: {currentDate.toDateString()}</div>
      <button onClick={() => handleReturnValidItem(datesArray, currentDate, 5)}>
        filter valid dates
      </button>
      {filteredDates.map((date, index) => (
        <div key={index}>{date}</div>
      ))}
    </div>
  );
}
