import { useEffect, useRef, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaCheck } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import CustomImage from "../../assets/images/custom.jpg";
import YearroundImage from "../../assets/images/yearround.jpg";

export default function YearroundOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const [isOnTop, setIsOnTop] = useState(false);
  const textareaRef = useRef(null);

  const [userEmail, setuserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [userMessag, setUserMessage] = useState("");
  const [customType, setCustomType] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const fixEmailDomain = (email) => {
    const targetDomain = "@gmail.com";

    // Check if the email already contains a domain
    const atIndex = email.indexOf("@");

    if (atIndex !== -1) {
      // Get everything after the @ symbol
      const currentDomain = email.slice(atIndex);

      // If the domain is not correct, replace it
      if (currentDomain !== targetDomain) {
        return email.slice(0, atIndex) + targetDomain;
      }
    }

    return email + targetDomain;
  };

  const sendEmail = (value) => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      subject_message: `New message from ${userName}`,
      welcome_text: "Hello ccgloves",
      sub_message: "Here is my information:",
      user_email: `Customer email: ${value}`,
      user_name: userName,
      user_phone: `Customer phone number: ${userPhone}`,
      message: `${
        customType === 0
          ? `I would like to know more about your year-round cleaning services. `
          : `I need a custom service. `
      } ${userMessag}`,
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
          setIsSent(true);
          setuserEmail("");
          setUserMessage("");
          setUserName("");
          setUserPhone("");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  const handleNavigateBack = () => {
    navigateToPage("/");
  };

  const handleSendEmail = () => {
    if (userEmail.includes("@gmail.com")) {
      setIsSending(true);
      sendEmail(userEmail);
    } else {
      setIsSending(true);
      sendEmail(fixEmailDomain(userEmail));
    }
  };

  return (
    <div className="order__container">
      {" "}
      <div className={`page__headline ${isOnTop && `onTop`}`}>
        <div
          className="page__headline_icon_container"
          onClick={handleNavigateBack}
        >
          <FaArrowLeft className="page__headline_icon" />
        </div>
        <div className="page__headline_title">Year-round Service</div>
      </div>
      <div className="order__content">
        <div className="order__year">
          <div className="order__year_btn_container">
            <div
              className={`order__year_btn ${
                customType === 0 ? `order__year_btn_active` : ``
              }`}
              onClick={() => {
                setCustomType(0);
                setIsSending(false);
                setIsSent(false);
              }}
            >
              Year-round Service
            </div>
            <div
              className={`order__year_btn ${
                customType === 1 ? `order__year_btn_active` : ``
              }`}
              onClick={() => {
                setCustomType(1);
                setIsSending(false);
                setIsSent(false);
              }}
            >
              Custom Service
            </div>
          </div>
          <div className="order__year_content colored">
            <div className="order__year_image_container">
              <img
                src={customType === 0 ? YearroundImage : CustomImage}
                alt="service image"
              />
            </div>
            <div className="order__year_option_container">
              {customType === 0 ? (
                <div className="order__year_describe ">
                  People who use year-round cleaning services include apartments
                  for rent, houses for rent, and dormitory for rent. We provide
                  not only cleaning but also amenities, soaps and kitchen
                  supplies.
                </div>
              ) : (
                <div className="order__year_describe ">
                  Custom service lets you tailor cleaning exactly to your needs,
                  giving you the flexibility and personalized care you deserve.
                </div>
              )}
              <input
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <input
                placeholder="Enter your phone number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
              />
              <input
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
              />
              <textarea
                className="contact__textarea"
                placeholder="Tell us more about your needs"
                value={userMessag}
                ref={textareaRef}
                rows={3}
                onChange={(e) => setUserMessage(e.target.value)}
              ></textarea>
              <div className="order__year_option_btn_container">
                {isSent ? (
                  <div className="order__year_option_btn sent">
                    <FaCheck />
                  </div>
                ) : (
                  <button
                    className="order__year_option_btn"
                    onClick={handleSendEmail}
                    disabled={isSending}
                  >
                    {isSending ? `SENDING...` : `SUBMIT`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
