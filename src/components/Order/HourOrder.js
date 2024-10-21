import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaClock, FaCoins } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

export default function HourOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState(3);
  const [startTime, setStartTime] = useState(0);
  const [isHolidaySelected, setIsHolidaySelected] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [isPopUp, setIsPopUp] = useState(false);
  const [isDuration, setIsDuration] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [alertValue, setAlertValue] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [isOnTop, setIsOnTop] = useState(false);

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

  const holidayArray = [
    {
      name: "Testing Day",
      date: "22/10",
    },
    {
      name: "Christmas Day",
      date: "25/12",
    },
    {
      name: "Lunar New Year",
      date: "31/12",
    },
    {
      name: "Lunar New Year",
      date: "01/01",
    },
    {
      name: "Lunar New Year",
      date: "02/01",
    },
    {
      name: "Lunar New Year",
      date: "03/01",
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
    if (state) {
      const currentTime = new Date();
      const currentDay = moment().startOf("day"); // Get current day without time
      state.workingTime.workingTime.map((working) => {
        if (
          moment(working.selectedDate).isSame(currentDay, "day") &&
          currentTime.getHours() >= 19
        ) {
          setAlertValue("Sorry we closed! Please choose another day.");
          setStartTime(0);
          setIsAlert(true);
        } else {
          setSelectedDate(
            moment(working.selectedDate, "DD/MM/YYYY").toString()
          );
          setStartTime(working.startTime);
          setDuration(working.duration);
          const holiday = isHoliday(
            moment(working.selectedDate, "DD/MM/YYYY").toString()
          );
          if (holiday) {
            setIsHolidaySelected(true);
            setIsAlert(true);
            setAlertValue(
              `Today is ${holiday.name}. We will add 1000¥/h to the total invoice for holiday occasions.`
            );
          } else {
            setIsHolidaySelected(false);
          }
        }
      });
    } else if (getCurrentHour() > 7 && getCurrentHour() < 16) {
      setStartTime(getCurrentHour() + 4);
    } else {
      setIsAlert(true);
      setStartTime(0);
      setAlertValue("Sorry we closed! Please choose another day.");
      setIsClose(true);
    }
  }, [state]);

  useEffect(() => {
    if (isHolidaySelected) {
      setPaymentCount(duration * 4000);
    } else {
      setPaymentCount(duration * 3000);
    }
  }, [duration, isHolidaySelected]);

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const isHoliday = (date) => {
    const formattedDate = moment(date).format("DD/MM");
    const holiday = holidayArray.find(
      (holiday) => holiday.date === formattedDate
    );
    return holiday;
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
      setAlertValue("Sorry we closed! Please choose another day.");
      setStartTime(0);
      setIsAlert(true);
      setIsClose(true);
    }
    const holiday = isHoliday(newDate);
    if (holiday) {
      setIsHolidaySelected(true);
      setIsAlert(true);
      setAlertValue(
        `Today is ${holiday.name}.We will add 1000¥/h to the total invoice for holiday occasions.`
      );
      setStartTime(0);
    } else {
      setIsHolidaySelected(false);
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
      <div className="order__content">
        <div className="order__headline_content">
          {" "}
          <div className="order__headline">
            <div className="order__value">
              <FaClock /> 07:00 - 22:00
            </div>
            <div className="order__value">
              <FaCoins /> 3000¥/h (at least 3hrs)
            </div>
          </div>
          <Calendar onChange={handleDateChange} value={selectedDate} />
        </div>
        {isClose ? (
          <></>
        ) : (
          <div className="order__hours">
            <div className="order__hours_headline">Choose working hours</div>
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
                <div className="order__payment_container">
                  <IoIosArrowForward className="order__payment_icon" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {isPopUp && (
        <div className="pop__container">
          <div className="pop__content pop__container_larger">
            <div className="pop__headline">Choose duration</div>
            {isDuration ? (
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
            ) : (
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
  );
}
