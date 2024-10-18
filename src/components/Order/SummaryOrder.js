import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/orderStyle.scss";
import "../../assets/sass/summaryStyle.scss";
import { IoIosArrowForward } from "react-icons/io";
import {
  FaArrowAltCircleRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

export default function SummaryOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop, setIsOnTop] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [discountList, setDiscountList] = useState([]);
  const [discountInput, setDiscountInput] = useState("");
  const [discountResult, setDiscountResult] = useState(0);
  const [discountString, setDiscountString] = useState("");
  const [discountValue, setDiscountValue] = useState(0);

  useEffect(() => {
    setPaymentCount(state.paymentCount);
    setOrderId(generateOrderID());
    getDiscountByEmail();

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

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleNavigateBack = () => {
    navigateToPage("/inforOrder", {
      orderType: state.orderType,
      paymentCount: state.paymentCount,
      workingTime: state.workingTime,
      userInfo: {
        firstName: state.userInfo.firstName,
        lastName: state.userInfo.lastName,
        phone: state.userInfo.phone,
        email: state.userInfo.email,
        prefecture: state.userInfo.prefecture,
        city: state.userInfo.city,
        district: state.userInfo.district,
        postCode: state.userInfo.postCode,
        addDetail: state.userInfo.addDetail,
      },
    });
  };

  const getDiscountByEmail = async () => {
    try {
      const q = query(
        collection(db, "discountList")
        // where("orderEmail", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => doc.data());
      setDiscountList(results);
    } catch (error) {
      console.error("Error searching by email: ", error);
    }
  };

  const getRandomNumber = (min, max) => {
    const random = Math.random() * (max - min) + min;
    return parseInt(random);
  };

  const generateOrderID = () => {
    const date = new Date();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    //for time
    const currentHour = date.getHours();
    const currentMinute = date.getMinutes();
    const currentSecond = date.getSeconds();
    const currentTime = `${currentHour}${currentMinute}${currentSecond}`;
    //for date
    const currentDay = date.getDate();
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear().toString().substring(2, 4);
    const currentDate = `${currentMonth}${currentDay}${currentYear}`;

    const generatedID = `${currentTime}${currentDate}${getRandomNumber(
      0,
      1000
    )}`;

    return generatedID;
  };

  const handleCheckDiscountCode = () => {
    const matchingDiscountValue = discountList.filter(
      (discount) => discount.discountCode === discountInput
    );
    if (matchingDiscountValue.length > 0) {
      matchingDiscountValue.map((discount) =>
        setDiscountResult(discount.discountValue)
      );
      // setDiscountResult(matchingDiscountValue);
      setDiscountString("");
    } else {
      setDiscountString(
        "We cannot find this coupon. Please check it and try again."
      );
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountResult([]);
    setDiscountString("");
    setDiscountValue(0);
  };

  const handleNavigate = async () => {
    navigateToPage("/paymentOrder", {
      orderType: state.orderType,
      paymentCount:
        paymentCount +
        paymentCount * 0.1 -
        (paymentCount * discountValue) / 100,
      userInfo: state.userInfo,
      workingTime: state.workingTime,
      orderID: orderId,
      discountCode: discountValue > 0 ? discountInput : "",
    });
  };

  console.log(discountList);

  return (
    <div className="summary__container">
      <div className={`page__headline ${isOnTop && `onTop`}`}>
        <div
          className="page__headline_icon_container"
          onClick={handleNavigateBack}
        >
          <FaArrowLeft className="page__headline_icon" />
        </div>
        <div className="page__headline_title">Order Sumarry</div>
      </div>
      <div className="summary__content">
        <div className="summary__content_item background">
          <div className="summary__id">Order ID: #{orderId}</div>
          <div className="summary__price">
            <div className="price__item">
              <div className="price__item_title">Sub total:</div>
              <div className="price__item_value">{paymentCount}¥</div>
            </div>
            <div className="price__item">
              <div className="price__item_title">Taxes:</div>
              <div className="price__item_value">10%</div>
            </div>
            {discountResult > 0 ? (
              <div className="price__item">
                <div className="price__item_title">Discount:</div>
                <div className="price__item_value">-{discountResult}%</div>
              </div>
            ) : (
              <></>
            )}
            <div className="price__item">
              <div className="price__item_title total">Total:</div>
              {discountResult > 0 ? (
                <div className="price__item_value total">
                  {paymentCount +
                    paymentCount * 0.1 -
                    (paymentCount + paymentCount * 0.1) *
                      (discountResult / 100)}
                  ¥
                </div>
              ) : (
                <div className="price__item_value total">
                  {paymentCount + paymentCount * 0.1}¥
                </div>
              )}
            </div>
          </div>
          <div className="summary__discount">
            <input
              placeholder="Enter your discount code"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
            />
            <div className="discount__btn" onClick={handleCheckDiscountCode}>
              Apply
            </div>
          </div>
        </div>
        <div className="summary__content_item">
          <div className="summary__item">
            <div className="item__content">
              <div className="content__value">
                {`${state.userInfo.firstName} ${state.userInfo.lastName}`}
              </div>
              <div className="content__value">{`${state.userInfo.phone}`}</div>
              <div className="content__value">{`${state.userInfo.email}`}</div>
            </div>
            <FaArrowRight className="item__btn_display" />
          </div>
          <div className="summary__item">
            <div className="item__content">
              {state.orderType === 0 ? (
                <div className="content__value">Service: Hourly</div>
              ) : state.orderType === 1 ? (
                <div className="content__value">Service: Daily</div>
              ) : (
                <div className="content__value">Service: Custom</div>
              )}
              {state.workingTime.map((item, index) => (
                <div className="content__value_detail" key={index}>
                  <div className="content__value">
                    Date: {item.selectedDate}
                  </div>
                  <div className="content__value">
                    Work time: {item.startTime}:00-
                    {item.startTime + item.duration}
                    :00 ({item.duration}hrs)
                  </div>
                </div>
              ))}
            </div>
            {state.workingTime.length > 1 ? (
              <FaArrowRight className="item__btn_display" />
            ) : (
              <></>
            )}
          </div>
          <div
            className="order__payment one__item_row"
            onClick={handleNavigate}
          >
            <div className="order__payment_value">checkout now</div>
          </div>
        </div>
      </div>
    </div>
  );
}
