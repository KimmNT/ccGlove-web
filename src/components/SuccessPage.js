import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/resultStyle.scss";
import Completed from "../assets/images/completed.png";
import { useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const navigate = useNavigate();
  const location = useLocation();

  //   useEffect(() => {
  //     // Check if the user came from CheckOut page
  //     if (location.state?.from !== "paymentOrder") {
  //       // Redirect to Home if they didn't come from CheckOut
  //       navigate("/", { replace: true });
  //     }
  //   }, [location, navigate]);

  const handleNavigate = () => {
    navigateToPage("/");
  };
  return (
    <div className="result__container">
      <div className="result__content">
        <div className="result__title">Thank you for choosing us!</div>
        <div className="result__id">Your order ID: #{state.orderID}</div>
        <img src={Completed} alt="Completed image" />
        <div className="result__text">
          We'll be in touch shortly to confirm your order
        </div>
        <div className="order__checking" onClick={handleNavigate}>
          <div className="order__checking_value">back to home</div>
        </div>
      </div>
    </div>
  );
}
