// HomePage.jsx
import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import Bloom from "../assets/images/broom.png";
import Spray from "../assets/images/spray.png";
import Shining from "../assets/images/shining.png";
import {
  FaCalendarCheck,
  FaClock,
  FaLongArrowAltRight,
  FaToolbox,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";

function HomePage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate
  const [userEmail, setuserEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      navigateToPage("/order");
    }
  };

  const sendEmail = (value) => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      user_email: value,
      user_name: value,
      user_phone: value,
      message:
        "I am interested in your services. Please contact me to discuss further details.",
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
      <div className="home__headline">
        <img
          className="home__headline_image"
          src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108189/geaeaj3jr7jfxjsrniyp.jpg"
          alt="cleaing"
        />
        <div className="home__headline_title">
          <div className="slogan">
            We are here for your
            <span className="slogan__hightlight"> cleaning needs!</span>
          </div>
          <div className="sub__slogan small__text">
            Let us handle the cleaning while you enjoy more time <br /> for what
            matters most.
            <img src={Shining} alt="shining" className="shining rolling" />
          </div>
          <div
            className="headline__btn_book"
            onClick={() => scrollToSection("services")}
          >
            <div className="btn__book_text">book now</div>
            <FaLongArrowAltRight className="btn__book_icon" />
          </div>
        </div>
      </div>
      <div className="home__box home__box_row">
        <div className="box__content colored">
          <div className="box__title">Why Choose Us</div>
          <div className="box__value">
            <div className="value__item small__text">
              We specialize in thorough, detailed cleaning that goes beyond the
              surface. Giving you peace of mind and a fresh, hygienic space
            </div>
            <div className="value__item small__text">
              Our dedicated team uses eco-friendly products and modern
              techniques to deliver a clean you can trust.
            </div>
          </div>
        </div>
        <div className="box__images">
          <div className="image__group">
            <img
              src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108198/wjuvvb5kcu69khxfukna.jpg"
              alt="cleaning"
              className="image__item up "
            />
            <img
              src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108197/kukxl63h8jqeiosuqb0z.jpg"
              alt="cleaning"
              className="image__item down"
            />
          </div>
          <div className="image__group">
            <img
              src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108206/gartvwalacmbbxxrszu1.jpg"
              alt="cleaning"
              className="image__item "
            />
          </div>
        </div>
      </div>
      <div className="home__box" id="services">
        <div className="box__content">
          <div className="box__title">
            What we offer{" "}
            <img src={Bloom} alt="bloom" className="small__image" />
          </div>
          <div className="box__value">
            <div className="value__item">
              We offer a range of services, including year-round, daily, and
              hourly cleaning, to ensure the perfect fit for your needs.
            </div>
          </div>
        </div>
        <div className="box__images box__images_row">
          <div className="image__group">
            <div className="service">
              <div className="service_headline">
                <FaClock className="headline__icon" />
                <div className="headline__text">Hire in Hours</div>
              </div>
              <div className="service_content">
                <div className="content__slogan">
                  Quick and efficient cleaning by the hour.
                </div>
                <div className="content__value">
                  Perfect for small spaces, specific areas, or quick
                  touch-ups—book our professional cleaners by the hour to get
                  the job done without any hassle.
                </div>
              </div>
              <div
                className="service__btn"
                onClick={() => navigateToPage("/order/hourlyOrder")}
              >
                Book by the Hour
                <FaLongArrowAltRight className="service__btn_icon" />
              </div>
            </div>
          </div>
          <div className="image__group">
            <div className="service">
              <div className="service_headline">
                <FaCalendarCheck className="headline__icon" />
                <div className="headline__text">Hire in Days</div>
              </div>
              <div className="service_content">
                <div className="content__slogan">
                  Extensive cleaning over multiple days
                </div>
                <div className="content__value">
                  Whether it's a deep clean, regular upkeep, or office cleaning,
                  we are available for multiple hours over several days to keep
                  your space spotless and fresh.
                </div>
              </div>
              <div
                className="service__btn"
                onClick={() => navigateToPage("/order/dailyOrder")}
              >
                Book by the Days
                <FaLongArrowAltRight className="service__btn_icon" />
              </div>
            </div>
          </div>
          <div className="image__group">
            <div className="service">
              <div className="service_headline">
                <FaToolbox className="headline__icon" />
                <div className="headline__text">Year-round/Custom Service</div>
              </div>
              <div className="service_content">
                <div className="content__slogan">
                  Tell us what you need, we’ll deliver our best.
                </div>
                <div className="content__value">
                  We also offer a year-round cleaning service designed to
                  maintain a pristine and inviting atmosphere in your space all
                  year long.
                </div>
              </div>
              <div
                className="service__btn"
                onClick={() => navigateToPage("/order/customOrder")}
              >
                <div>Customize your services</div>
                <FaLongArrowAltRight className="service__btn_icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="home__box">
        <div className="box__content colored">
          <div className="box__title">Why Choose Us</div>
          <div className="box__value">
            <div className="value__item small__text">
              We offer a variety of services, including hourly rentals, daily
              rentals, or a customizable option to best suit your needs.
            </div>
          </div>
        </div>
        <div className="box__images box__images_row">
          <div className="image__group">
            <div className="reason">
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108204/ods4vml5lkbnnvlkrivl.jpg"
                alt="cleaning"
                className="reason__image"
              />
              <div className="reason__content">
                <div className="reason__headline">
                  Experienced Professionals
                </div>
                <div className="reason__value">
                  Our skilled cleaners are trained to handle all types of
                  cleaning tasks efficiently.
                </div>
              </div>
            </div>
          </div>
          <div className="image__group">
            <div className="reason">
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108181/ulh0yhbtfzqemzs5n5ut.jpg"
                alt="cleaning"
                className="reason__image"
              />
              <div className="reason__content">
                <div className="reason__headline">Eco-Friendly Products</div>
                <div className="reason__value">
                  We use environmentally friendly products that are safe for you
                  and the planet.
                </div>
              </div>
            </div>
          </div>
          <div className="image__group">
            <div className="reason">
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108778/egtgtlt6glajasxjbxxj.jpg"
                alt="cleaning"
                className="reason__image"
              />
              <div className="reason__content">
                <div className="reason__headline">Flexible Scheduling</div>
                <div className="reason__value">
                  We offer flexible scheduling options to suit your busy
                  lifestyle.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="home__box colored home__box_row">
        <div className="box__content">
          <div className="box__title">
            Ready for a Cleaner Space ?
            <img src={Spray} alt="spray" className="small__image" />
          </div>
          <div className="box__value">
            <div className="value__item">
              Please provide your email, and we will get back to you shortly!
            </div>
          </div>
        </div>
        <div className="box__images ">
          <div className="image__group">
            <div className="contact">
              <input
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setuserEmail(e.target.value)}
              />
              <div className="contact__btn" onClick={handleSendEmail}>
                {isSent ? (
                  <div className="contact__btn_icon">
                    Email sent successfully
                  </div>
                ) : (
                  <FaLongArrowAltRight className="contact__btn_icon" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
