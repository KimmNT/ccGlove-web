import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/orderStyle.scss";
import "../../assets/sass/inforOrderStyle.scss";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";

export default function SummaryOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop, setIsOnTop] = useState(false);
  const [paymentCount, setPaymentCount] = useState(0);

  useEffect(() => {
    setPaymentCount(state.paymentCount);

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

  console.log(isOnTop);

  const handleNavigateBack = () => {
    navigateToPage("/inforOrder", {
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
    </div>
  );
}
