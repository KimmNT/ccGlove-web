import { useEffect, useRef, useState } from "react";
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import Shining from "../assets/images/shining.png";
import emailjs from "@emailjs/browser";
import { FaCheck } from "react-icons/fa";

export default function ContactPage() {
  const textareaRef = useRef(null);

  const [userEmail, setuserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [userMessag, setUserMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
  }, []);

  const sendEmail = (value) => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      subject_message: `New message from ${userName}`,
      welcome_text: "Hello ccgloves",
      sub_message: "Here is my information:",
      user_email: `Customer email: ${value}`,
      user_name: userName,
      user_phone: `Customer phone number: ${userPhone}`,
      message: userMessag,
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

  const handleSendEmail = () => {
    if (
      userName !== "" &&
      userMessag !== "" &&
      (userEmail !== "") & (userPhone !== "")
    ) {
      if (userEmail.includes("@gmail.com")) {
        setIsSending(true);
        sendEmail(userEmail);
      } else {
        setIsSending(true);
        sendEmail(fixEmailDomain(userEmail));
      }
    } else {
      setIsAlert(true);
    }
  };
  return (
    <div className="content">
      <div className="home__container">
        <div className="home__headline_title home__headline_full">
          <div className="slogan ">
            <span className="slogan__hightlight">Connect</span> with Our Team
          </div>
          <img src={Shining} alt="shining" className="shining rolling" />
        </div>
        <div className="home__box colored home__box_row">
          <img
            src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108189/geaeaj3jr7jfxjsrniyp.jpg"
            alt="cleaning"
            className="contact__image"
          />
          <div className="contact__input">
            <div className="box__content">
              <div className="box__value">
                <div className="value__item text_on_left">
                  Please provide your information, and we will get back to you
                  shortly!
                </div>
              </div>
            </div>
            <div className="box__images">
              <div className="image__group">
                <div className="contact contact__form">
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
                    placeholder="Enter your message"
                    value={userMessag}
                    ref={textareaRef}
                    rows={3}
                    onChange={(e) => setUserMessage(e.target.value)}
                  ></textarea>
                  {isSent ? (
                    <div className="btn__form btn sent">
                      <FaCheck />
                    </div>
                  ) : (
                    <button
                      className="btn__form btn"
                      onClick={handleSendEmail}
                      disabled={isSending}
                    >
                      {isSending ? `SENDING...` : `SUBMIT`}
                    </button>
                  )}
                </div>
              </div>
              <div className="break__text">OR</div>
              <div className="image__group">
                <div className="contact__info">
                  <div className="contact__info_item">
                    <div className="contact__info_title">Hotline</div>
                    <div className="contact__info_value">070-3965-0906</div>
                  </div>
                  <div className="contact__info_item">
                    <div className="contact__info_title">Email</div>
                    <div className="contact__info_value">
                      info@ccgniseko.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isAlert && (
          <div className="pop__container">
            <div className="pop__content">
              <div className="pop__headline">
                Please fill all requirement fields
              </div>
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
    </div>
  );
}
