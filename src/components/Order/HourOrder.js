import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaClock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

export default function HourOrder() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [duration, setDuration] = useState(3);
  const [startTime, setStartTime] = useState(0);
  const [isHolidaySelected, setIsHolidaySelected] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [isPopUp, setIsPopUp] = useState(false);
  const [isDuration, setIsDuration] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [alertValue, setAlertValue] = useState("");

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
      date: "06/09",
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
    if (getCurrentHour() > 7 && getCurrentHour() < 19) {
      setStartTime(getCurrentHour() + 4);
    } else {
      setIsClose(true);
      setAlertValue("Sorry we closed!");
    }
  }, []);

  useEffect(() => {
    if (isHolidaySelected) {
      setPaymentCount(duration * 4000);
    } else {
      setPaymentCount(duration * 3000);
    }
  }, [duration, isHolidaySelected]);

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
      setAlertValue("You cannot select a date from the past!");
      setIsClose(true);
      setStartTime(0);
    }
    if (selectedDay.isSame(currentDay, "day") && currentTime.getHours() >= 19) {
      setIsClose(true);
      setAlertValue("Sorry we closed!");
      setStartTime(0);
      return;
    }
    const holiday = isHoliday(newDate);
    if (holiday) {
      setIsHolidaySelected(true);
      console.log(
        `Today is ${holiday.name}`,
        "We will add 1000¥/h to the total invoice for holiday occasions."
      );
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

  return (
    <div className="order__container">
      <div className="order__headline">
        <FaClock className="order__headline_icon clock colored" />
        <div className="order__headline_value">
          <div className="order__value">Hourly cleaning service</div>
          <div className="order__value">Working hours: 07:00 - 22:00</div>
          <div className="order__value">3000¥/h (at least 3hrs)</div>
        </div>
      </div>
      {isClose && <div className="order__alert">{alertValue}</div>}
      <Calendar onChange={handleDateChange} value={selectedDate} />
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
        </div>
      )}
      {startTime > 0 && (
        <div className="order__payment">
          <div className="order__payment_value">{paymentCount}¥</div>
          <div className="order__payment_container">
            <div className="order__payment_content">
              <IoIosArrowForward className="order__payment_icon" />
            </div>
          </div>
        </div>
      )}
      {isPopUp && (
        <div className="pop__container">
          <div className="pop__content">
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
            <div className="pop__close" onClick={() => setIsPopUp(false)}>
              close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
