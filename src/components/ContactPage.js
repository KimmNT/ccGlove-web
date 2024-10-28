import { useEffect, useRef, useState } from "react";
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import Shining from "../assets/images/shining.png";
import emailjs from "@emailjs/browser";
import Cleaning1 from "../assets/images/cleaning1.jpg";

export default function ContactPage() {
  const textareaRef = useRef(null);

  const [userEmail, setuserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [userMessag, setUserMessage] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
  }, []);

  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
    }
  };

  const sendEmail = (value) => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      user_email: value,
      user_name: userName,
      user_phone: userPhone,
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
          setUserPhone(0);
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
    if (userEmail.includes("@gmail.com")) {
      sendEmail(userEmail);
    } else {
      sendEmail(fixEmailDomain(userEmail));
    }
  };
  return (
    <div className="home__container">
      <div className="home__headline_title home__headline_full">
        <div className="slogan ">
          <span className="slogan__hightlight">Connect</span> with Our Team
        </div>
        <img src={Shining} alt="shining" className="shining rolling" />
      </div>
      <div className="home__box colored home__box_row">
        <img
          src="https://res-console.cloudinary.com/dovp2f63c/media_explorer_thumbnails/702db15cfbde74986b1549cbe7a723e0/detailed"
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
                <div
                  className="contact__btn btn__form"
                  onClick={handleSendEmail}
                >
                  <div className="contact__btn_icon">
                    {isSent ? `SENT` : `SUBMIT`}
                  </div>
                </div>
              </div>
            </div>
            <div className="break__text">OR</div>
            <div className="image__group">
              <div className="contact__info">
                <div className="contact__info_item">
                  <div className="contact__info_title">Hotline</div>
                  <div className="contact__info_value">07 039 650 906</div>
                </div>
                <div className="contact__info_item">
                  <div className="contact__info_title">Email</div>
                  <div className="contact__info_value">
                    ccsupport@ccgniseko.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
