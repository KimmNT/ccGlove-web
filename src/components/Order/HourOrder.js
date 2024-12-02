import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaClock, FaCoins, FaRegCalendarCheck } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function HourOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState(3);
  const [startTime, setStartTime] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [isPopUp, setIsPopUp] = useState(false);
  const [isDuration, setIsDuration] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [alertValue, setAlertValue] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isOnTop, setIsOnTop] = useState(false);
  const [disabledDatesList, setDisabledDatesList] = useState([]);
  const [notBooking, setNotBooking] = useState(false);

  const durationTime = [
    { time: 3 },
    { time: 4 },
    { time: 5 },
    { time: 6 },
    { time: 7 },
    { time: 8 },
    { time: 9 },
    { time: 10 },
    { time: 11 },
    { time: 12 },
    { time: 13 },
    { time: 14 },
    { time: 15 },
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
    if (state) {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentDay = moment().startOf("day");

      state.workingTime.workingTime.forEach((working) => {
        const selectedDay = moment(working.selectedDate);

        if (
          selectedDay.isSame(currentDay, "day") &&
          (currentHour >= 17 || currentHour < 8) // Outside working hours
        ) {
          setNotBooking(true);
        } else if (selectedDay.isSame(currentDay, "day")) {
          // Set booking details for today
          setSelectedDate(selectedDay.format("DD/MM/YYYY"));
          setStartTime(working.startTime);
          setDuration(working.duration);
        }
      });
    } else {
      const currentHour = getCurrentHour();
      if (currentHour > 7 && currentHour < 16) {
        setStartTime(currentHour + 4);
        console.log("allow to booking");
        console.log("for today");
      } else if (currentHour >= 16 && currentHour < 18) {
        setIsAlert(true);
        setStartTime(0);
        setAlertValue(
          "Sorry, we’re fully booked for today. Please select another day."
        );
        setIsClose(true);
        console.log("allow to booking");
        console.log("for the next day");
      } else if (currentHour < 8 || currentHour >= 17) {
        setNotBooking(true);
        console.log("not allow to booking");
      }
    }
  }, [state]);

  useEffect(() => {
    setPaymentCount(duration * 3000);
  }, [duration]);

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

  const isDateDisabled = ({ date, view }) => {
    // Disable only specific dates
    if (view === "month") {
      // Format the current date to DD/MM/YYYY
      const formattedDate = `${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

      // Check if the formatted date is in the disabledDates array
      return disabledDatesList.includes(formattedDate);
    }
    return false; // Only check for month view
  };

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setIsClose(false);
    const selectedDay = moment(newDate);
    const currentDay = moment().startOf("day"); // Get current day without time
    const currentTime = new Date();

    if (selectedDay.isBefore(currentDay)) {
      setAlertValue("You cannot select a day from the past!");
      setIsAlert(true);
      setStartTime(0);
      setIsClose(true);
    }
    if (selectedDay.isSame(currentDay, "day") && currentTime.getHours() >= 16) {
      setAlertValue(
        "Sorry, we’re fully booked for today. Please select another day."
      );
      setStartTime(0);
      setIsAlert(true);
      setIsClose(true);
    }
  };

  const getCurrentHour = () => {
    const date = new Date();
    return date.getHours();
  };

  const getCurrentDate = moment().format("DD/MM/YYYY");

  const generateTimesArray = () => {
    if (getCurrentDate === moment(selectedDate).format("DD/MM/YYYY")) {
      const currentHour = getCurrentHour();
      const times = [];
      for (let i = currentHour + 4; i <= 22; i++) {
        times.push({ time: i });
      }
      return times;
    } else {
      const times = [];
      for (let i = 7; i <= 22; i++) {
        times.push({ time: i });
      }
      return times;
    }
  };

  const numbers = generateTimesArray();

  const maxTime = 22 - duration;
  const sortedNumbers = numbers
    .filter((number) => number.time <= maxTime)
    .sort((a, b) => a.time - b.time);

  const handleNavigate = () => {
    navigateToPage("/inforOrder", {
      moveFrom: "hourly",
      orderType: 0,
      paymentCount: paymentCount,
      workingTime: [
        {
          detail: "",
          duration: duration,
          selectedDate: moment(selectedDate).format("DD/MM/YYYY"),
          startTime: startTime,
          title: "",
        },
      ],
    });
  };

  const handleNavigateBack = () => {
    navigateToPage("/");
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
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
          <div className="page__headline_title">Hourly Service</div>
        </div>
        {notBooking ? (
          <div className="order__not_booking">
            <div className="not__booking_text">Closed for booking.</div>
            <div className="not__booking_text">
              Please visit us later at 08:00 tomorrow.
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
                    <FaClock /> 07:00 - 22:00
                  </div>
                  <div className="order__value">
                    <FaRegCalendarCheck /> 08:00 - 17:00
                  </div>
                </div>
                <div className="order__value">
                  <FaCoins /> 3000¥/h (at least 3hrs)
                </div>
              </div>
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={isDateDisabled}
              />
            </div>
            {isClose ? (
              <></>
            ) : (
              <div className="order__hours">
                <div className="order__hours_headline">
                  Choose working hours
                </div>
                <div className="order__hours_content">
                  <div
                    className="order__hours_item"
                    onClick={() => {
                      setIsPopUp(true);
                      setIsDuration(true);
                    }}
                  >
                    <div className="item__title">Duration</div>
                    <div className="item__break"></div>
                    <div className="item__value">{duration} hrs</div>
                  </div>
                  <div
                    className="order__hours_item"
                    onClick={() => {
                      setIsPopUp(true);
                      setIsDuration(false);
                    }}
                  >
                    <div className="item__title">Start time</div>
                    <div className="item__break"></div>
                    <div className="item__value">{startTime}:00</div>
                  </div>
                </div>
                {startTime > 0 && (
                  <div className="order__payment" onClick={handleNavigate}>
                    <div className="order__payment_value">
                      {formatNumber(paymentCount)}¥
                    </div>
                    <div className="order__payment_btn">
                      <IoIosArrowForward className="order__payment_icon" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {isPopUp && (
          <div className="pop__container">
            <div className="pop__content pop__container_larger">
              {isDuration ? (
                <>
                  <div className="pop__headline">Choose duration</div>
                  <div className="pop__value">
                    {durationTime.map((duration, index) => (
                      <div
                        key={index}
                        className="value__item"
                        onClick={() => {
                          setDuration(duration.time);
                          setIsPopUp(false);
                          setStartTime(0);
                        }}
                      >
                        {duration.time}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="pop__headline">Choose start time</div>
                  <div className="pop__value">
                    {sortedNumbers.length === 0 ? (
                      <div className="value__empty">
                        Please choose another duration
                      </div>
                    ) : (
                      <>
                        {sortedNumbers.map((number, index) => (
                          <div
                            key={index}
                            className="value__item"
                            onClick={() => {
                              setStartTime(number.time);
                              setIsPopUp(false);
                            }}
                          >
                            {number.time}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </>
              )}
              <div className="pop__btn_container">
                <div></div>
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
