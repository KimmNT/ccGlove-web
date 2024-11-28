import React, { useEffect, useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import "react-datepicker/dist/react-datepicker.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import moment from "moment";
import { FaTimes } from "react-icons/fa";

export default function WorkingDate({ data, refresh }) {
  const [isCreate, setIsCreate] = useState(false);
  const [idFireBase, setIdFireBase] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDates, setSelectedDates] = useState([]);
  const [savedSelectedDates, setSavedSelectedDates] = useState([]); //for show/hide save button

  useEffect(() => {
    const disabledDates = data.flatMap((date) => date.disableList || []); // Extract and flatten all disableList arrays
    setSelectedDates(disabledDates);
    data.map((date) => setIdFireBase(date.idFireBase));
    setSavedSelectedDates(disabledDates);
  }, [data]);

  const getDaysInMonth = (month, year) => {
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  };

  const handleDateToggle = (date) => {
    const formattedDate = moment(date).format("MM/DD/YYYY");
    setSelectedDates((prev) => {
      const updatedDates = prev.includes(formattedDate)
        ? prev.filter((d) => d !== formattedDate) // Remove if already selected
        : [...prev, formattedDate]; // Add if not selected

      // Sort the dates using `moment`
      return updatedDates.sort((a, b) =>
        moment(a, "MM/DD/YYYY").diff(moment(b, "MM/DD/YYYY"))
      );
    });
  };

  const handleRemoveDate = (index) => {
    setSelectedDates((prev) => prev.filter((_, i) => i !== index));
  };

  const years = [
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
    new Date().getFullYear() + 3,
  ];
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

  const handleSaveDisableDates = async () => {
    const itemRef = doc(db, "disableDatesList", idFireBase);
    await updateDoc(itemRef, {
      disableList: selectedDates,
    });
    setIsCreate(false);
    refresh();
  };

  return (
    <div className="ordermanage__container">
      <div className="working__date_container">
        <div className="working__list">
          {years.map((year) => (
            <div
              onClick={() => setSelectedYear(year)}
              className={`working__list_item ${
                selectedYear === year ? `working__list_item_active` : ``
              }`}
              value={year}
              key={year}
            >
              {year}
            </div>
          ))}
        </div>
        <div className="working__list">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              className={`working__list_item ${
                selectedMonth === i ? `working__list_item_active` : ``
              }`}
              value={i}
              key={i}
              onClick={() => setSelectedMonth(i)}
            >
              {moment().month(i).format("MMMM")}
            </div>
          ))}
        </div>
        <div className="working__list">
          {daysInMonth.map((date) => (
            <div
              key={date}
              onClick={() => handleDateToggle(date)}
              className="working__list_item working__date_selection"
              style={{
                color: selectedDates.includes(moment(date).format("MM/DD/YYYY"))
                  ? "#fff"
                  : "#000",
                backgroundColor: selectedDates.includes(
                  moment(date).format("MM/DD/YYYY")
                )
                  ? "#141e46"
                  : "#FFF",
              }}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
        {selectedDates.length === 0 ? (
          <></>
        ) : (
          <div className="working__list">
            {selectedDates.map((date, index) => (
              <div key={index} className="working__list_item date__item">
                <div className="date__item_value">{date}</div>
                <div
                  className="date__item_remove"
                  onClick={() => handleRemoveDate(index)}
                >
                  <FaTimes className="date__item_remove_icon" />
                </div>
              </div>
            ))}
            <div
              className="working__list_item save"
              onClick={() => setIsCreate(true)}
            >
              save
            </div>
          </div>
        )}
      </div>
      {isCreate && (
        <div className="serivce__create_container">
          <div className="service__content remove__width">
            <div className="service__headline delete__title">
              Do you want to set these dates to disable (full booking date) ?
            </div>
            <div className="service__item_one_box">
              {selectedDates.map((date, index) => (
                <div key={index} className="service__item_one_box_item">
                  {date}
                </div>
              ))}
            </div>
            <div className="service__btn_container">
              <div></div>
              <div className="service__btn_group">
                <div
                  className="service__btn btn close"
                  onClick={() => setIsCreate(false)}
                >
                  close
                </div>
                <div
                  className="service__btn btn create"
                  onClick={handleSaveDisableDates}
                >
                  yes
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
