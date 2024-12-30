import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/paymentStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaArrowLeft } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CryptoJS from "crypto-js";
import emailjs from "@emailjs/browser";
import CheckoutFromStripe from "./CheckoutFromStripe";

export default function PaymentOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop, setIsOnTop] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [alertValue, setAlertValue] = useState("");
  const [paymentCount, setPaymentCount] = useState(0);

  const [isStripePromise, setIsStripePromise] = useState(null);

  useEffect(() => {
    setPaymentCount(state.paymentCount);
    fetchAndDecryptKey();
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

  const decryptKey = (encryptedKey) => {
    const bytes = CryptoJS.AES.decrypt(
      encryptedKey,
      "egx8c9rbtz5q73klfdmn4w10hvoip6"
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const fetchAndDecryptKey = async () => {
    const response = await fetch(
      "https://ccglove-web-api.onrender.com/api/get-publish-key"
    );
    const data = await response.json();
    const stripePromise = loadStripe(decryptKey(data.encryptedKey));
    setIsStripePromise(stripePromise);
  };

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleRevertServicePrice = (grandTotal) => {
    const movingFee = state.userInfo.movingFee;

    const servicePrice =
      (grandTotal - 1.146 * movingFee) /
      1.146 /
      (1 - state.discountInfo.discountResult / 100);

    // Round and return the final value
    return Math.round(servicePrice);
  };

  const handleNavigateBack = () => {
    navigateToPage("/summaryOrder", {
      moveFrom: state.moveFrom,
      orderType: state.orderType,
      paymentCount: handleRevertServicePrice(paymentCount),
      discountInfo: state.discountInfo,
      workingTime: state.workingTime,
      userInfo: {
        firstName: state.userInfo.firstName,
        lastName: state.userInfo.lastName,
        phone: state.userInfo.phone,
        email: state.userInfo.email,
        prefecture: state.userInfo.prefecture,
        district: state.userInfo.district,
        town: state.userInfo.town,
        postCode: state.userInfo.postCode,
        addDetail: state.userInfo.addDetail,
        movingFee: state.userInfo.movingFee,
      },
    });
  };

  const handleNavigate = async () => {
    const now = new Date();
    const date = now.toLocaleDateString(); // e.g., '8/5/2024'
    const time = now.toLocaleTimeString(); // e.g., '3:45:30 PM'

    await addDoc(collection(db, "orderList"), {
      id: state.orderID,
      type: state.orderType,
      user: {
        userFirstName: state.userInfo.firstName,
        userLastName: state.userInfo.lastName,
        userEmail: state.userInfo.email,
        userPhone: state.userInfo.phone,
        userAddress: `${state.userInfo.addDetail}, ${state.userInfo.town}, ${state.userInfo.district}, ${state.userInfo.prefecture}`,
        userPostCode: state.userInfo.postCode,
      },
      status: 0,
      payment: {
        paymentOption: 1,
        paymentNumer: 0,
        paymentCVV: 0,
        paymentDate: 0,
      },
      workingTime: state.workingTime,
      total: state.paymentCount,
      created: {
        date: date,
        time: time,
      },
      working: {
        date: "",
        time: "",
      },
      completed: {
        date: "",
        time: "",
      },
      ratingState: 0,
      belongTo: {
        empId: "",
        empName: "",
      },
      describe: "",
    });
    sendEmail();
    if (
      state.discountInfo.discountID !== "" &&
      state.discountInfo.discountReuse === 0
    ) {
      //Remove discount code
      await deleteDoc(doc(db, "discountList", state.discountInfo.discountID));
    }
    navigateToPage("/completed", {
      orderID: state.orderID,
      from: "paymentOrder",
    });
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };
  const getServiceType = (type) => {
    switch (type) {
      case 0:
        return "Hourly Service";
      case 1:
        return "Daily Service";
      case 2:
        return "Custom Service";
      default:
        return "";
    }
  };
  const sendEmail = (value) => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      subject_message: `New order: #${state.orderID}`,
      welcome_text: `You have a new order #${state.orderID}`,
      sub_message: `https://ccgniseko.com/loginPage`,
      user_email: `Customer email: ${state.userInfo.email}`,
      user_name: `${state.userInfo.firstName} ${state.userInfo.lastName}`,
      user_phone: `Customer phone number: ${state.userInfo.phone}`,
      message: `You have a new ${getServiceType(state.orderType)} order from ${
        state.userInfo.firstName
      } ${
        state.userInfo.lastName
      }. Please visit Admin page for more information.`,
    };
    emailjs
      .send(
        "service_w0kfb1d",
        "template_7szuo82",
        templateParams,
        "UCOII6_f0u6pockwH"
      )
      .then(
        () => {
          console.log("SENT");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <Elements stripe={isStripePromise}>
      <div className="content">
        <div className="payment__container">
          <div className={`page__headline ${isOnTop && `onTop`}`}>
            <div
              className="page__headline_icon_container"
              onClick={handleNavigateBack}
            >
              <FaArrowLeft className="page__headline_icon" />
            </div>
            <div className="page__headline_title">Check Out</div>
          </div>
          <div className="payment__content">
            <div className="payment__info">
              <div className="payment__info_content">
                <div className="payment__info_item">
                  <div className="payment__info_item_title">Service:</div>
                  <div className="payment__info_item_value">
                    {getServiceType(state.orderType)}
                  </div>
                </div>
                <div className="payment__info_item">
                  <div className="payment__info_item_title highlight">
                    Total:
                  </div>
                  <div className="payment__info_item_value highlight">
                    {formatNumber(Math.round(paymentCount))}¥
                  </div>
                </div>
              </div>
            </div>
            <div className="payment__atm">
              {state.clientSecret && (
                <CheckoutFromStripe
                  clientSecret={state.clientSecret}
                  stateValue={state}
                />
              )}
            </div>
          </div>
          {isAlert && (
            <div className="pop__container">
              <div className="pop__content">
                <div className="pop__alert">{alertValue}</div>
                <div className="pop__close" onClick={() => setIsAlert(false)}>
                  close
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Elements>
  );
}
