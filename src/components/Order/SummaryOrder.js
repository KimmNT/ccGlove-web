import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/orderStyle.scss";
import "../../assets/sass/summaryStyle.scss";
import { FaArrowLeft, FaArrowRight, FaMinus, FaTimes } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

export default function SummaryOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const currentDate = new Date(`${month}/${day}/${year}`);

  const [isOnTop, setIsOnTop] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [discountList, setDiscountList] = useState([]);
  const [discountInput, setDiscountInput] = useState("");
  const [discountResult, setDiscountResult] = useState(0);
  const [discountString, setDiscountString] = useState("");
  const [discountID, setDiscountID] = useState("");
  const [discountReuse, setDiscountReuse] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setPaymentCount(state.paymentCount);
    if (state.discountInfo != null) {
      setDiscountResult(state.discountInfo.discountResult);
      setDiscountID(state.discountInfo.discountID);
      setDiscountInput(state.discountInfo.discountCode);
      setDiscountReuse(state.discountInfo.discountReuse);
    }
    setOrderId(generateOrderID());
    getDiscountList();

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
  }, [state]);

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleNavigateBack = () => {
    navigateToPage("/inforOrder", {
      moveFrom: state.moveFrom,
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

  const getDiscountList = async () => {
    try {
      const q = query(
        collection(db, "discountList")
        // where("orderEmail", "==", userInfo.email)
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        idFireBase: doc.id,
      }));
      // setDiscountList(results);
      setDiscountList(handleReturnValidItem(results, currentDate, 6));
    } catch (error) {
      console.error("Error searching by email: ", error);
    }
  };

  const handleReturnValidItem = (discountArray, date, expiredInMonth) => {
    const sixMonthsEarlier = new Date(date);
    sixMonthsEarlier.setMonth(sixMonthsEarlier.getMonth() - expiredInMonth);

    // Filter and sort the array based on discountCreatedDate
    const filteredDiscounts = discountArray
      .map((discount) => ({
        ...discount,
        discountCreatedDate: new Date(discount.discountCreatedDate), // Convert discountCreatedDate to a Date object
      }))
      .filter((discount) => discount.discountCreatedDate > sixMonthsEarlier) // Filter discounts strictly later than sixMonthsEarlier
      .sort((a, b) => a.discountCreatedDate - b.discountCreatedDate) // Sort based on discountCreatedDate
      .map((discount) => ({
        ...discount,
        discountCreatedDate:
          discount.discountCreatedDate.toLocaleDateString("en-US"), // Convert discountCreatedDate back to MM/DD/YYYY format
      }));

    return filteredDiscounts;
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
      (discount) => discount.discountCode === discountInput.toUpperCase()
    );
    if (matchingDiscountValue.length > 0) {
      matchingDiscountValue.map((discount) => {
        setDiscountResult(discount.discountValue);
        setDiscountID(discount.idFireBase);
        setDiscountReuse(discount.discountReuse);
      });
      setDiscountString("");
    } else {
      setDiscountResult(0);
      setDiscountString(
        "We couldn't find your discount code, or it has expired. Please check and try again later."
      );
    }
  };

  const handleNotUseDiscount = () => {
    setDiscountResult(0);
    setDiscountString("");
    setDiscountInput("");
  };

  const handleNavigate = async () => {
    setIsProcessing(true);
    const paymentValue =
      paymentCount * 1.037 * 1.1 * (1 - discountResult / 100);
    console.log(Math.round(paymentValue));
    const response = await fetch(
      `https://ccglove-web-api.onrender.com/api/payments/create-payment-intent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(paymentValue) }),
      }
    );

    const data = await response.json();
    const clientSecret = data.clientSecret;

    // Navigate only after retrieving the clientSecret
    navigateToPage("/paymentOrder", {
      moveFrom: state.moveFrom,
      orderType: state.orderType,
      paymentCount: paymentValue,
      discountInfo: {
        discountID: discountID,
        discountResult: discountResult,
        discountCode: discountResult > 0 ? discountInput : "",
        discountReuse: discountReuse,
      },
      userInfo: state.userInfo,
      workingTime: state.workingTime,
      orderID: orderId,
      clientSecret: clientSecret, // Pass the clientSecret here
    });
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

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
              <div className="price__item_title">Service price:</div>
              <div className="price__item_value">
                {formatNumber(paymentCount)}¥
              </div>
            </div>
            <div className="price__item">
              <div className="price__item_title">Payment fee:</div>
              <div className="price__item_value">
                {formatNumber(paymentCount * 0.037)}¥
              </div>
            </div>
            <div className="price__item_break"></div>
            <div className="price__item">
              <div className="price__item_title">Subtotal:</div>
              <div className="price__item_value">
                {formatNumber(paymentCount * 1.037)}¥
              </div>
            </div>
            <div className="price__item">
              <div className="price__item_title">Taxes:</div>
              <div className="price__item_value">10%</div>
            </div>
            {discountResult > 0 ? (
              <div className="price__item">
                <div className="price__item_title">Discount:</div>
                <div className="price__item_value">
                  <div className="price__discount">-{discountResult}%</div>
                  <div className="price__remove" onClick={handleNotUseDiscount}>
                    <FaTimes />
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="price__item_break"></div>
            <div className="price__item">
              <div className="price__item_value total">Total:</div>
              {/* {discountResult > 0 ? (
                <div className="price__item_value total">
                  {formatNumber(
                    paymentCount * 1.037 * 1.1 * (1 - discountResult / 100)
                  )}
                  ¥
                </div>
              ) : (
                <div className="price__item_value total">
                  {formatNumber(
                    paymentCount * 1.037 * 1.1 * (1 - discountResult / 100)
                  )}¥
                </div>
              )} */}
              <div className="price__item_value total">
                {Math.round(
                  paymentCount * 1.037 * 1.1 * (1 - discountResult / 100)
                )}
                ¥
              </div>
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
          <div className="summary__string">{discountString}</div>
        </div>
        <div className="summary__content_item">
          <div className="summary__item">
            <div className="item__content">
              <div className="content__title">Name:</div>
              <div className="content__value">
                {" "}
                {`${state.userInfo.firstName} ${state.userInfo.lastName}`}
              </div>
            </div>
            <div className="item__content">
              <div className="content__title">Phone:</div>
              <div className="content__value">{`${state.userInfo.phone}`}</div>
            </div>
            <div className="item__content">
              <div className="content__title">Email:</div>
              <div className="content__value">{`${state.userInfo.email}`}</div>
            </div>
            <div className="item__content">
              <div className="content__title">Address:</div>
              <div className="content__value">
                {`${state.userInfo.addDetail}, ${state.userInfo.district}, ${state.userInfo.city}, ${state.userInfo.prefecture}`}
              </div>
            </div>
            <div className="item__content">
              <div className="content__title">Post code:</div>
              <div className="content__value">
                {`${state.userInfo.postCode}`}
              </div>
            </div>
          </div>
          <div className="summary__item">
            <div className="item__content">
              <div className="content__title">Service:</div>
              <div className="content__value">
                {state.orderType === 0 ? (
                  <div className="content__value">Hourly Service</div>
                ) : state.orderType === 1 ? (
                  <div className="content__value">Daily Service</div>
                ) : (
                  <div className="content__value">Custom Service</div>
                )}
              </div>
            </div>
            <div className="item__content item__as_list">
              {state.workingTime.map((item, index) => (
                <div className="list__item" key={index}>
                  {state.orderType === 3 ? (
                    <>
                      <div className="list__item_value">
                        Title: {item.title}
                      </div>
                      <div className="list__item_value">
                        Detail: {item.detail}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="list__item_value">
                        Date: {item.selectedDate}
                      </div>
                      <div className="list__item_value">
                        Work time: {item.startTime}:00-
                        {item.startTime + item.duration}
                        :00 ({item.duration}hrs)
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {state.workingTime.length > 1 ? (
              <FaArrowRight className="item__btn_display" />
            ) : (
              <></>
            )}
          </div>
          <button
            className="order__payment one__item_row"
            onClick={handleNavigate}
            disabled={isProcessing}
          >
            <div className="order__payment_value">
              {isProcessing ? `processing` : `checkout now`}
            </div>
          </button>
        </div>
      </div>
      {isProcessing && (
        <div className="pop__container">
          <div className="pop__content">
            <div className="pop__headline">
              Your order is being created. <br /> Please wait a moment
            </div>
            <div className="dot__animation">
              <div className="dot__item delay__one"></div>
              <div className="dot__item delay__two"></div>
              <div className="dot__item delay__three"></div>
              <div className="dot__item delay__four"></div>
              <div className="dot__item delay__five"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
