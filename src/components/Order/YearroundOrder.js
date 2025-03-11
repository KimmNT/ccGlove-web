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

  const [bathRoom, setBathRoom] = useState(0);
  const [toilet, setToilet] = useState(0);
  const [bed, setBed] = useState(0);
  const [kitchenSize, setKitchenSize] = useState(0);
  const [square, setSquare] = useState(0);

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
        customType === 1
          ? `I need a custom service. ${userMessag} `
          : `I need a year-round service. I have`
      }`,
      bathroom: customType === 0 ? `${bathRoom} bathroom(s)` : ``,
      toilet: customType === 0 ? `${toilet} toilet(s)` : ``,
      bed: customType === 0 ? `${bed} bed(s)` : ``,
      kitchenSize:
        customType === 0
          ? `Kitchen size: ${
              kitchenSize === 0 ? "S" : kitchenSize === 1 ? "M" : "L"
            }`
          : ``,
      square: customType === 0 ? `Total square: ${square} square meters` : ``,
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
          setBathRoom(0);
          setToilet(0);
          setBed(0);
          setKitchenSize(0);
          setSquare(0);
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
    <div className="content">
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
                    Tell us more about your places.
                  </div>
                ) : (
                  <div className="order__year_describe ">
                    Custom service lets you tailor cleaning exactly to your
                    needs, giving you the flexibility and personalized care you
                    deserve.
                  </div>
                )}
                {customType === 0 ? (
                  <>
                    <div className="order__year_selection">
                      <input
                        placeholder="Enter your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                      <div className="order__year_selection_item_breakline"></div>

                      <input
                        placeholder="Enter your phone number"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                      />
                      <div className="order__year_selection_item_breakline"></div>

                      <input
                        placeholder="Enter your email"
                        value={userEmail}
                        onChange={(e) => setuserEmail(e.target.value)}
                      />
                      <div className="order__year_selection_item_breakline"></div>

                      <div className="order__year_selection_item">
                        <div className="order__year_selection_title">
                          How many bathroom:
                        </div>
                        <div className="order__year_selection_input">
                          <input
                            value={bathRoom}
                            onChange={(e) => setBathRoom(e.target.value)}
                          />
                          <div className="order__year_selection_input_unit">
                            bathroom(s)
                          </div>
                        </div>
                      </div>
                      <div className="order__year_selection_item_breakline"></div>
                      <div className="order__year_selection_item">
                        <div className="order__year_selection_title">
                          How many toilet:
                        </div>
                        <div className="order__year_selection_input">
                          <input
                            value={toilet}
                            onChange={(e) => setToilet(e.target.value)}
                          />
                          <div className="order__year_selection_input_unit">
                            toilet(s)
                          </div>
                        </div>
                      </div>
                      <div className="order__year_selection_item_breakline"></div>
                      <div className="order__year_selection_item">
                        <div className="order__year_selection_title">
                          How many bed:
                        </div>
                        <div className="order__year_selection_input">
                          <input
                            value={bed}
                            onChange={(e) => setBed(e.target.value)}
                          />
                          <div className="order__year_selection_input_unit">
                            bed(s)
                          </div>
                        </div>
                      </div>
                      <div className="order__year_selection_item_breakline"></div>
                      <div className="order__year_selection_item">
                        <div className="order__year_selection_title">
                          Kitchen size:
                        </div>
                        <div className="order__year_selection_list">
                          <div
                            onClick={() => setKitchenSize(0)}
                            className={`order__year_selection_list_item ${
                              kitchenSize === 0
                                ? "order__year_selection_list_item_active"
                                : ""
                            }`}
                          >
                            s
                          </div>
                          <div
                            onClick={() => setKitchenSize(1)}
                            className={`order__year_selection_list_item ${
                              kitchenSize === 1
                                ? "order__year_selection_list_item_active"
                                : ""
                            }`}
                          >
                            m
                          </div>
                          <div
                            onClick={() => setKitchenSize(2)}
                            className={`order__year_selection_list_item ${
                              kitchenSize === 2
                                ? "order__year_selection_list_item_active"
                                : ""
                            }`}
                          >
                            l
                          </div>
                        </div>
                      </div>
                      <div className="order__year_selection_item_breakline"></div>
                      <div className="order__year_selection_item">
                        <div className="order__year_selection_title">
                          Total house square:
                        </div>
                        <div className="order__year_selection_input">
                          <input
                            value={square}
                            onChange={(e) => setSquare(e.target.value)}
                          />
                          <div className="order__year_selection_input_unit">
                            square meters
                          </div>
                        </div>
                      </div>
                    </div>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
