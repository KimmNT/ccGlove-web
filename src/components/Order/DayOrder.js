import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import {
  FaClock,
  FaCoins,
  FaEdit,
  FaPenAlt,
  FaRegCalendarCheck,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function DayOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [selectedDateUpdate, setSelectedDateUpdate] = useState(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarKey, setCalendarKey] = useState(0); // Track calendar key for force re-render
  const [duration, setDuration] = useState(3);
  const [paymentCount, setPaymentCount] = useState(0);
  const [isPopUp, setIsPopUp] = useState(false);
  const [alertValue, setAlertValue] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isOnTop, setIsOnTop] = useState(false);
  const [disabledDatesList, setDisabledDatesList] = useState([]);
  const [notBooking, setNotBooking] = useState(false);

  const startTimeArray = [
    {
      time: 7,
    },
    {
      time: 8,
    },
    {
      time: 9,
    },
    {
      time: 10,
    },
    {
      time: 11,
    },
    {
      time: 12,
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
    // Check when the component mounts
    checkIfAtTop();

    // Optionally, you can listen to scroll events and check in real-time
    window.addEventListener("scroll", checkIfAtTop);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("scroll", checkIfAtTop);
  }, []);

  useEffect(() => {
    getDisableWorkingDate();
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    if (state) {
      if (currentHour < 8 || currentHour >= 17) {
        setNotBooking(currentHour);
        console.log("not allow to booking");
      } else {
        setSelectedDates(state.workingTime.workingTime);
      }
    } else if (currentHour < 8 || currentHour >= 17) {
      setNotBooking(currentHour);
      console.log("not allow to booking");
    }
  }, [state]);

  useEffect(() => {
    setPaymentCount(selectedDates.length * 20000);
  }, [selectedDates]);

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const getDisableWorkingDate = async () => {
    try {
      const data = await getDocs(collection(db, "disableDatesList"));
      const listData = data.docs.map((doc) => {
        const itemData = doc.data();
        return {
          idFireBase: doc.id,
          ...itemData,
        };
      });
      const disabledDates = listData.flatMap((date) => date.disableList || []); // Extract and flatten all disableList arrays
      // setSelectedDates(disabledDates);
      setDisabledDatesList(disabledDates);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error as needed
    }
  };

  // Check if a particular date is selected based on the selectedDate field in the object
  const isDateSelected = (date) => {
    const formattedDate = moment(date).format("DD/MM/YYYY");
    return selectedDates.some(
      (dateObj) => dateObj.selectedDate === formattedDate
    );
  };

  const isDateDisabledStyle = ({ date, view }) => {
    if (view === "month" && isDateSelected(date)) {
      return "selected-date";
    }
    // Disable only specific dates
    if (view === "month") {
      // Format the current date to DD/MM/YYYY
      const formattedDate = `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

      // Check if the date is disabled or not
      return disabledDatesList.includes(formattedDate)
        ? "order__date_disabled"
        : "";
    }
    return "";
  };

  const isDisable = (newDate) => {
    const result = disabledDatesList.some(
      (date) => date === moment(newDate).format("MM/DD/YYYY")
    );
    return result;
  };

  const handleDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("DD/MM/YYYY");
    const currentDay = moment().startOf("day"); // Get current day without time
    const formattedDateMoment = moment(newDate); // Convert selected date to moment object

    // Check if selected date is in the past
    if (formattedDateMoment.isBefore(currentDay, "day")) {
      setAlertValue("You cannot select a day from the past!");
      setIsAlert(true);
      return;
    }
    if (isDisable(newDate)) {
      setAlertValue(
        "Sorry, we’re fully booked for today. Please select another day!"
      );
      setIsAlert(true);
      return;
    }
    if (formattedDateMoment.isSame(currentDay, "day")) {
      setAlertValue(
        "Sorry, we’re fully booked for today. Please select another day!"
      );
      setIsAlert(true);
      return;
    }
    // Check if the date is already selected
    if (
      isDateSelected(newDate)
      // selectedDates.find((dateObj) => dateObj.selectedDate === formattedDate)
    ) {
      // If it is already selected, remove it from the array
      setSelectedDates(
        selectedDates.filter(
          (dateObj) => dateObj.selectedDate !== formattedDate
        )
      );
      setCalendarKey(calendarKey + 1);
    } else {
      // Otherwise, add the date with custom fields
      setSelectedDates((prevSelectedDates) => {
        const newEntry = {
          selectedDate: formattedDate,
          startTime: 7, // You can customize this value
          duration: 8, // You can customize this value
          title: "",
          detail: "",
        };
        const updatedDates = [...prevSelectedDates, newEntry].sort(
          (a, b) =>
            moment(a.selectedDate, "DD/MM/YYYY").unix() -
            moment(b.selectedDate, "DD/MM/YYYY").unix()
        );
        return updatedDates;
      });
      setCalendarKey(calendarKey + 1);
    }
  };

  const getCurrentHour = () => {
    const date = new Date();
    return date.getHours();
  };

  const getCurrentDate = moment().format("DD/MM/YYYY");

  const generateTimesArray = () => {
    if (getCurrentDate === moment(selectedDates).format("DD/MM/YYYY")) {
      const currentHour = getCurrentHour();
      const times = [];
      for (let i = currentHour + 4; i <= 17; i++) {
        times.push({ time: i });
      }
      return times;
    } else {
      const times = [];
      for (let i = 7; i <= 17; i++) {
        times.push({ time: i });
      }
      return times;
    }
  };

  const numbers = generateTimesArray();

  const maxTime = 17 - duration;
  const sortedNumbers = numbers
    .filter((number) => number.time <= maxTime)
    .sort((a, b) => a.time - b.time);

  const handleNavigate = () => {
    navigateToPage("/inforOrder", {
      moveFrom: "daily",
      orderType: 1,
      paymentCount: paymentCount,
      workingTime: selectedDates,
    });
  };
  const handleNavigateBack = () => {
    navigateToPage("/");
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const handleUpdateDate = (item, index) => {
    setSelectedDateUpdate(item);
    setSelectedDateIndex(index);
    setIsPopUp(true);
  };
  const updateStartTime = (index, newStartTime) => {
    // Ensure the new start time is within the allowed range
    if (newStartTime >= 7 && newStartTime <= 12) {
      // Create a new copy of the selectedDates array
      const updatedDates = [...selectedDates];

      // Update the specific item's startTime
      updatedDates[index].startTime = newStartTime;

      // Update the state with the new array
      setSelectedDates(updatedDates);
      setIsPopUp(false);
    } else {
      console.log("Start time must be between 7 and 12.");
    }
  };

  const handleRemoveDate = (currentDate) => {
    // If it is already selected, remove it from the array
    setSelectedDates(
      selectedDates.filter((dateObj) => dateObj.selectedDate !== currentDate)
    );
    setCalendarKey(calendarKey + 1);
    setIsPopUp(false);
  };

  return (
    <div className="content">
      <div className="order__container">
        <div className={`page__headline ${isOnTop && `onTop`}`}>
          <div
            className="page__headline_icon_container"
            onClick={handleNavigateBack}
          >
            <FaArrowLeft className="page__headline_icon" />
          </div>
          <div className="page__headline_title">Daily Service</div>
        </div>
        {notBooking ? (
          <div className="order__not_booking">
            <div className="not__booking_text">Closed for booking.</div>
            <div className="not__booking_text">
              Please visit us later at 08:00 AM.
            </div>
            <div className="not__booking_text">Thank you!</div>
            <div className="not__booking_text booking__time">
              Booking time: 08:00 - 17:00
            </div>
          </div>
        ) : (
          <div className="order__content">
            <div className="order__headline_content">
              {" "}
              <div className="order__headline">
                <div className="order__value_column">
                  <div className="order__value">
                    <FaClock /> 09:00 - 17:00
                  </div>
                  <div className="order__value">
                    <FaRegCalendarCheck /> 08:00 - 17:00
                  </div>
                </div>
                <div className="order__value">
                  <FaCoins /> 20,000¥/8hrs (1hr break included)
                </div>
              </div>
              <Calendar
                key={calendarKey}
                onClickDay={handleDateChange} // Use onClickDay for selecting multiple days
                // tileDisabled={isDateDisabled}
                // tileClassName={({ date, view }) =>
                //   view === "month" && isDateSelected(date)
                //     ? "selected-date"
                //     : ""
                // }
                tileClassName={isDateDisabledStyle}
              />
            </div>
            {selectedDates.length > 0 && (
              <div className="order__days">
                <div className="order__days_headline">
                  {selectedDates.length} days
                </div>
                <div className="order__days_list">
                  {selectedDates.map((date, index) => (
                    <div
                      key={index}
                      className="day__item"
                      // onClick={() => handleUpdateDate(date, index)}
                    >
                      <div className="day__item_group">
                        <div className="day__item_group_title">Date</div>
                        <div className="day__item_group_value">
                          {date.selectedDate}
                        </div>
                      </div>
                      <div className="day__item_group">
                        <div className="day__item_group_title">Duration</div>
                        <div className="day__item_group_value">
                          {date.duration}hrs
                        </div>
                      </div>
                      <div className="day__item_group">
                        <div className="day__item_group_title">Start time</div>
                        <div className="day__item_group_value">
                          {/* {date.startTime}:00-{date.startTime + date.duration}
                          :00 */}
                          9:00-17:00
                        </div>
                      </div>
                      {/* <div className="day__item_group_close">
                        <FaEdit />
                      </div> */}
                    </div>
                  ))}
                </div>
                <div className="order__payment" onClick={handleNavigate}>
                  <div className="order__payment_value">
                    {formatNumber(paymentCount)}¥
                  </div>
                  <div className="order__payment_btn">
                    <IoIosArrowForward className="order__payment_icon" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {isPopUp && (
          <div className="pop__container">
            <div className="pop__content pop__container_larger">
              <div className="pop__headline">Update date</div>
              <div className="pop__list">
                <div className="pop__item">
                  <div className="pop__item_title">Date</div>
                  <div className="pop__item_value">
                    {selectedDateUpdate?.selectedDate}
                  </div>
                </div>
                <div className="pop__item_break"></div>
                <div className="pop__item">
                  <div className="pop__item_title">Duration</div>
                  <div className="pop__item_value">
                    {selectedDateUpdate?.duration} hours
                  </div>
                </div>
                <div className="pop__item_break"></div>

                <div className="pop__item">
                  <div className="pop__item_title">Start time</div>
                  <div className="pop__item_list">
                    {startTimeArray.map((startTime, index) => (
                      <div
                        onClick={() =>
                          updateStartTime(selectedDateIndex, startTime.time)
                        }
                        className={`pop__item_value ${
                          selectedDateUpdate?.startTime === startTime.time
                            ? `pop__item_value_active`
                            : ``
                        }`}
                        key={index}
                      >
                        {startTime.time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pop__btn_container">
                <div
                  className="btn delete"
                  onClick={() =>
                    handleRemoveDate(selectedDateUpdate?.selectedDate)
                  }
                >
                  remove this date
                </div>
                <div className="btn close" onClick={() => setIsPopUp(false)}>
                  close
                </div>
              </div>
            </div>
          </div>
        )}
        {isAlert && (
          <div className="pop__container">
            <div className="pop__content pop__container_larger">
              <div className="pop__alert">{alertValue}</div>
              <div className="pop__btn_container">
                <div></div>
                <div className="btn close" onClick={() => setIsAlert(false)}>
                  close
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
