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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function AboutPage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate
  const [userEmail, setuserEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
  }, []);

  useEffect(() => {
    getReviews();
  }, []);

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
    if (userEmail !== "") {
      if (userEmail.includes("@gmail.com")) {
        sendEmail(userEmail);
      } else {
        sendEmail(fixEmailDomain(userEmail));
      }
    }
  };

  const getReviews = async () => {
    try {
      const data = await getDocs(collection(db, "reviewsList")); // Fetch all documents from the "reviewsList" collection

      const reviewData = data.docs
        .map((doc) => ({
          firestoreId: doc.id, // Firestore-generated document ID
          ...doc.data(), // All other data fields in the document, including your custom 'state'
        }))
        .filter((review) => review.state === 1); // Filter the reviews where state is 1

      setReviews(reviewData); // Update state with filtered data
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("Failed to fetch reviews. Please try again later."); // Basic error handling
    }
  };

  return (
    <div className="content">
      <div className="home__container">
        <div className="home__headline_title home__headline_full">
          <div className="slogan ">
            Allow us to introduce
            <span className="slogan__hightlight"> ourselves!</span>
          </div>
          <img
            src={Shining}
            alt="shining"
            className="shining increase rolling"
          />
        </div>
        <div className="home__box">
          <div className="box__content">
            {/* <div className="box__title">Who we are</div> */}
            <div className="box__value colored">
              <div className="value__item">
                We specialize in thorough, detailed cleaning that goes beyond
                the surface. Giving you peace of mind and a fresh, hygienic
                space. Our dedicated team uses eco-friendly products and modern
                techniques to deliver a clean you can trust.
              </div>
            </div>
          </div>
          <div className="box__images">
            <div className="gallery">
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1732714021/u9ohujwqzj30loyehoev.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1729087226/brkvimh3kcgtbl5swap0.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1732714023/tcmubr3hjcevwvumit7x.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108192/mybvub1df99porw0oewc.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1732714022/iqkfmlvlcm1lvshhkakn.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108204/ods4vml5lkbnnvlkrivl.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1732714022/wf9vxnadbmsvqegwcjic.jpg"
                alt="cleaning"
                className="image__item "
              />
              <img
                src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108175/z8as2hhvlj2mhy0ijsdl.jpg"
                alt="cleaning"
                className="image__item "
              />
            </div>
          </div>
        </div>
        <div className="home__box">
          <div className="box__content">
            <div className="box__title box__title_smaller">
              We have collaborated with numerous clients,
            </div>
            <div className="box__title box__title_smaller colored">
              including Seasons Niseko, Tacito, K-tsuru and many more.
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
                <div className="service_content">
                  <div className="service_headline">
                    <FaClock className="headline__icon" />
                    <div className="headline__text">Hire in Hours</div>
                  </div>
                  <div className="service__content_value">
                    <div className="content__slogan">
                      Quick and efficient cleaning by the hour.
                    </div>
                    <div className="content__value">
                      Perfect for small spaces, specific areas, or quick
                      touch-ups—book our professional cleaners by the hour to
                      get the job done without any hassle.
                    </div>
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
                <div className="service_content">
                  <div className="service_headline">
                    <FaCalendarCheck className="headline__icon" />
                    <div className="headline__text">Hire in Days</div>
                  </div>
                  <div className="service__content_value">
                    <div className="content__slogan">
                      Extensive cleaning over multiple days
                    </div>
                    <div className="content__value">
                      Whether it's a deep clean, regular upkeep, or office
                      cleaning, we are available for multiple hours over several
                      days to keep your space spotless and fresh.
                    </div>
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
                <div className="service_content">
                  <div className="service_headline">
                    <FaToolbox className="headline__icon" />
                    <div className="headline__text">
                      Year-round/Custom Service
                    </div>
                  </div>
                  <div className="service__content_value">
                    <div className="content__slogan">
                      Tell us what you need, we’ll deliver our best.
                    </div>
                    <div className="content__value">
                      We also offer a year-round cleaning service designed to
                      maintain a pristine and inviting atmosphere in your space
                      all year long.
                    </div>
                  </div>
                </div>
                <div
                  className="service__btn"
                  onClick={() => navigateToPage("/order/yearroundOrder")}
                >
                  <div>Customize your services</div>
                  <FaLongArrowAltRight className="service__btn_icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="home__box">
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
                  src="https://res.cloudinary.com/dovp2f63c/image/upload/v1730108183/rl9hsaxoth8xgrnz5hnw.jpg"
                  alt="cleaning"
                  className="reason__image"
                />
                <div className="reason__content">
                  <div className="reason__headline">Eco-Friendly Products</div>
                  <div className="reason__value">
                    We use environmentally friendly products that are safe for
                    you and the planet.
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
        </div>
        {/* <div className="home__box">
        <div className="box__content">
          <div className="box__title">What people say</div>
        </div>
        <div className="review__list">
          {reviews.slice(1, 3).map((review, index) => (
            <div className="review__item" key={index}>
              <div className="review__info">
                <div className="info__item review__name">{review.userName}</div>
                <div className="review__rate">
                  {review.orderService === 0 ? (
                    <div className="review__service">
                      Service:
                      <FaClock className="info__item review__service" />
                      Hourly
                    </div>
                  ) : review.orderService === 1 ? (
                    <div className="review__service">
                      Service:
                      <FaCalendarCheck className="review__service" />
                      Daily
                    </div>
                  ) : (
                    <FaToolbox className="review__service" />
                  )}

                  <div className="review__value">
                    {Math.round(review.rateOverall + 1)}/5
                    <FaFaceGrinBeam className="review__value_icon" />
                  </div>
                </div>
              </div>
              {review.rateFeedback === "" ? (
                <div className="review__feedback">
                  "The best cleaning service I’ve used—consistent and
                  trustworthy."
                </div>
              ) : (
                <div className="review__feedback">"{review.rateFeedback}"</div>
              )}
            </div>
          ))}
          <div className="review__item">
            <div className="review__info">
              <div className="info__item review__name">Bukayashi</div>
              <div className="review__rate">
                <div className="review__service">
                  Service:
                  <FaClock className="info__item review__service" />
                  Hourly
                </div>

                <div className="review__value">
                  5/5
                  <FaFaceGrinBeam className="review__value_icon" />
                </div>
              </div>
            </div>
            <div className="review__feedback">"GOOD!!"</div>
            <div className="review__images">
              <img src={Review3} alt="review image" />
              <img src={Review4} alt="review image" />
            </div>
          </div>
          <div className="review__item">
            <div className="review__info">
              <div className="info__item review__name">Sonia</div>
              <div className="review__rate">
                <div className="review__service">
                  Service:
                  <FaCalendarCheck className="review__service" />
                  Daily
                </div>
                <div className="review__value">
                  5/5
                  <FaFaceGrinBeam className="review__value_icon" />
                </div>
              </div>
            </div>
            <div className="review__feedback">
              "Impressive attention to detail—my space has never looked this
              clean!"
            </div>
            <div className="review__images">
              <img src={Review5} alt="review image" />
              <img src={Review6} alt="review image" />
            </div>
          </div>
          <div className="review__item">
            <div className="review__info">
              <div className="info__item review__name">Yamamoto</div>
              <div className="review__rate">
                <div className="review__service">
                  Service:
                  <FaCalendarCheck className="review__service" />
                  Daily
                </div>
                <div className="review__value">
                  5/5
                  <FaFaceGrinBeam className="review__value_icon" />
                </div>
              </div>
            </div>
            <div className="review__feedback">
              "Efficient and professional service; the team did an amazing job."
            </div>
            <div className="review__images">
              <img src={Review1} alt="review image" />
              <img src={Review2} alt="review image" />
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
              {isSent ? (
                <div className="contact contact__center">
                  <div className="contact__btn">
                    <div className="contact__btn_icon">
                      Email sent successfully!
                    </div>
                  </div>
                </div>
              ) : (
                <div className="contact">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={userEmail}
                    onChange={(e) => setuserEmail(e.target.value)}
                  />
                  <div className="contact__btn" onClick={handleSendEmail}>
                    <FaLongArrowAltRight className="contact__btn_icon" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
