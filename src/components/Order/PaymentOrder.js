import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/paymentStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaArrowLeft } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

export default function PaymentOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop, setIsOnTop] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [alertValue, setAlertValue] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isAlreadySaved, setIsAlreadySaved] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpYear, setCardExpYear] = useState(0);
  const [cardExpMonth, setCardExpMonth] = useState(0);
  const [cardCVC, setCardCVC] = useState(0);

  useEffect(() => {
    setPaymentCount(state.paymentCount);
    const loadSavedInfo = JSON.parse(localStorage.getItem("qqw6rtpl"));
    if (loadSavedInfo !== null) {
      setCardNumber(loadSavedInfo.cardNumber);
      setCardCVC(loadSavedInfo.cardCVC);
      setCardExpMonth(loadSavedInfo.cardExpMonth);
      setCardExpYear(loadSavedInfo.cardExpYear);
      setAlertValue(true);
    }

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

  // Luhn Algorithm for card number validation
  function validateCardNumber(cardNumber) {
    const regex = /^\d{13,19}$/; // 13 to 19 digits
    if (!regex.test(cardNumber)) {
      return false;
    }

    let sum = 0;
    let shouldDouble = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  // Validate CVC
  function validateCVC(cardCVC, cardNumber) {
    const amexRegex = /^3[47]/; // American Express starts with 34 or 37
    if (amexRegex.test(cardNumber)) {
      return /^\d{4}$/.test(cardCVC); // Amex has a 4-digit CVC
    } else {
      return /^\d{3}$/.test(cardCVC); // Others have a 3-digit CVC
    }
  }

  // Validate Expiration Date
  function validateExpiryDate(cardExpMonth, cardExpYear) {
    // Ensure month is valid
    if (cardExpMonth < 1 || cardExpMonth > 12) {
      return false;
    }

    // Combine year and month into a comparable format
    const expDate = new Date(`20${cardExpYear}`, cardExpMonth - 1);
    const today = new Date();

    return expDate > today;
  }

  function formatCardNumber(number) {
    const numStr = number.toString();
    let formatted = "";

    if (/^3[47]/.test(numStr)) {
      // American Express (15 digits, format: xxxx xxxxxx xxxxx)
      formatted = numStr.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
    } else if (/^3(?:0[0-5]|[68])/.test(numStr)) {
      // Diners Club (14 digits, format: xxxx xxxxxx xxxx)
      formatted = numStr.replace(/(\d{4})(\d{6})(\d{4})/, "$1 $2 $3");
    } else if (
      /^4/.test(numStr) ||
      /^5[1-5]/.test(numStr) ||
      /^6/.test(numStr)
    ) {
      // Visa, MasterCard, Discover (16 digits, format: xxxx xxxx xxxx xxxx)
      formatted = numStr.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4");
    } else {
      // Default case: Format as groups of 4 digits (for unknown lengths)
      formatted = numStr.replace(/(\d{4})(?=\d)/g, "$1 ");
    }

    return formatted.trim();
  }

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleNavigateBack = () => {
    navigateToPage("/summaryOrder", {
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

  const handleNavigate = async () => {
    let isValid = true; // Track if all validations pass
    let alertMessage = "";

    // Check if any field is empty
    if (
      cardNumber === "" ||
      cardCVC === 0 ||
      cardExpYear === 0 ||
      cardExpMonth === 0
    ) {
      alertMessage = "Please fill in your card information.";
      isValid = false;
    }
    // Validate card number
    if (!validateCardNumber(cardNumber)) {
      alertMessage =
        "Incorrect card information, please double-check your card details.";
      isValid = false;
    }

    // Validate CVC
    if (!validateCVC(cardCVC, cardNumber)) {
      alertMessage =
        "Incorrect card information, please double-check your card details.";
      isValid = false;
    }

    // Validate expiration date
    if (!validateExpiryDate(cardExpMonth, cardExpYear)) {
      alertMessage =
        "Incorrect card information, please double-check your card details.";
      isValid = false;
    }

    // If validation failed, set alert
    if (!isValid) {
      setIsAlert(true);
      setAlertValue(alertMessage);
    } else {
      const now = new Date();
      const date = now.toLocaleDateString(); // e.g., '8/5/2024'
      const time = now.toLocaleTimeString(); // e.g., '3:45:30 PM'

      // await addDoc(collection(db, "orderList"), {
      //   id: state.orderID,
      //   type: state.orderType,
      //   user: {
      //     userFirstName: state.userInfo.firstName,
      //     userLastName: state.userInfo.lastName,
      //     userEmail: state.userInfo.email,
      //     userPhone: state.userInfo.phone,
      //     userAddress: `${state.userInfo.addDetail}, ${state.userInfo.district}, ${state.userInfo.city}, ${state.userInfo.prefecture}`,
      //   },
      //   status: 0,
      //   payment: {
      //     // paymentState: 0,
      //     paymentOption: 1,
      //     paymentNumer: cardNumber,
      //     paymentCVV: cardCVC,
      //     paymentDate: `${cardExpMonth}/${cardExpYear}`,
      //   },
      //   workingTime: state.workingTime,
      //   total: state.paymentCount,
      //   created: {
      //     date: date,
      //     time: time,
      //   },
      //   working: {
      //     date: "",
      //     time: "",
      //   },
      //   completed: {
      //     date: "",
      //     time: "",
      //   },
      //   ratingState: 0,
      //   belongTo: {
      //     empId: "",
      //     empName: "",
      //   },
      //   describe: "",
      // });
      if (isSaved) {
        const saveInfo = {
          cardNumber: cardNumber,
          cardCVC: cardCVC,
          cardExpMonth: cardExpMonth,
          cardExpYear: cardExpYear,
        };
        await localStorage.setItem("qqw6rtpl", JSON.stringify(saveInfo));
      }
      navigateToPage("/completed", {
        orderID: state.orderID,
        from: "paymentOrder",
      });
    }
  };

  return (
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
        <div className="payment__total">Total: {paymentCount}¥</div>
        <div className="payment__atm">
          <div className="atm__item full">
            <div className="atm__item_title">Card number</div>
            <input
              placeholder="Card's number"
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="atm__item half">
            <div className="atm__item_title">CVC</div>
            <input
              className="center"
              placeholder="CVC"
              value={cardCVC}
              onChange={(e) => setCardCVC(e.target.value)}
            />
          </div>
          <div className="atm__item half">
            <div className="atm__item_title">Expired date</div>
            <div className="input__group">
              <input
                className="center"
                placeholder="MM"
                value={cardExpMonth}
                onChange={(e) => setCardExpMonth(e.target.value)}
              />
              /
              <input
                className="center"
                placeholder="YY"
                value={cardExpYear}
                onChange={(e) => setCardExpYear(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="payment__saved">
          <div
            onClick={() => setIsSaved(!isSaved)}
            className={`payment__saved_checkbox ${isSaved && `saved`}`}
          ></div>
          <div className="payment__saved_value">Save for future use</div>
        </div>
        <div className="order__checking" onClick={handleNavigate}>
          <div className="order__checking_value">finish your order</div>
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
  );
}
