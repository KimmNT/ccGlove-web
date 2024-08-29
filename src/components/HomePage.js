// HomePage.jsx
import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import Bloom from "../assets/images/broom.png";
import Spray from "../assets/images/spray.png";
import Shining from "../assets/images/shining.png";
import Cleaning1 from "../assets/images/cleaning1.jpg";
import Cleaning3 from "../assets/images/cleaning3.jpg";
import Cleaning4 from "../assets/images/cleaning4.jpg";
import Cleaning5 from "../assets/images/sheduling.jpg";
import {
  FaCalendarCheck,
  FaClock,
  FaLongArrowAltRight,
  FaToolbox,
} from "react-icons/fa";
import { FaFaceGrinBeam } from "react-icons/fa6";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function HomePage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const data = await getDocs(collection(db, "reviewsList")); // Fetch all documents from the "orderList" collection

      const reviewData = data.docs.map((doc) => ({
        firestoreId: doc.id, // Firestore-generated document ID
        ...doc.data(), // All other data fields in the document, including your custom 'id'
      }));

      setReviews(reviewData); // Update state or do whatever you need with the retrieved data
    } catch (error) {
      console.error("Error fetching services:", error);
      alert("Failed to fetch services. Please try again later."); // Basic error handling
    }
  };

  return (
    <div className="home__container">
      <div className="home__headline">
        <div className="slogan ">
          We are here for your{" "}
          <span className="slogan__hightlight">cleaning</span> time!
        </div>
        <div className="sub__slogan small__text">
          Let us handle the cleaning while you enjoy more time for what matters
          most.
          <img src={Shining} alt="shining" className="shining rolling" />
        </div>
        <div className="headline__btn_book">
          <div className="btn__book_text">book now</div>
          <FaLongArrowAltRight className="btn__book_icon" />
        </div>
      </div>
      <div className="home__box">
        <div className="box__content colored">
          <div className="box__title">Who we are</div>
          <div className="box__value">
            <div className="value__item small__text">
              We specialize in thorough, detailed cleaning that goes beyond the
              surface, giving you peace of mind and a fresh, hygienic space
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
              src={Cleaning1}
              alt="cleaning"
              className="image__item movingUpDown"
            />
            <img
              src={Cleaning4}
              alt="cleaning"
              className="image__item movingDownUp"
            />
          </div>
          <div className="image__group">
            <img
              src={Cleaning3}
              alt="cleaning"
              className="image__item movingLeftRight"
            />
          </div>
        </div>
      </div>
      <div className="home__box">
        <div className="box__content">
          <div className="box__title">
            What we offer{" "}
            <img src={Bloom} alt="bloom" className="small__image" />
          </div>
          <div className="box__value">
            <div className="value__item small__text">
              We offer a variety of services, including hourly rentals, daily
              rentals, or a customizable option to best suit your needs.
            </div>
          </div>
        </div>
        <div className="box__images">
          <div className="image__group">
            <div className="service">
              <div className="service_headline">
                <FaClock className="headline__icon" />
                <div className="headline__text">Hire in Hours</div>
              </div>
              <div className="service_content">
                <div className="content__slogan">
                  Quick and efficient cleaning
                </div>
                <div className="content__value">
                  Perfect for those who need a quick and efficient clean! Our
                  ‘Hire in Hours’ service is ideal for small apartments,
                  specific areas, or quick touch-ups. Book our professional
                  cleaners by the hour to get the job done without any hassle.
                </div>
              </div>
              <div className="service__btn">
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
                  Choose from specialized services
                </div>
                <div className="content__value">
                  Whether it’s a deep clean, regular maintenance, or office
                  cleaning, our team is available to work multiple hours across
                  several days to ensure your space remains spotless and fresh.
                </div>
              </div>
              <div className="service__btn">
                Book by the Days
                <FaLongArrowAltRight className="service__btn_icon" />
              </div>
            </div>
          </div>
          <div className="image__group">
            <div className="service">
              <div className="service_headline">
                <FaToolbox className="headline__icon" />
                <div className="headline__text">Hire with Custom Service</div>
              </div>
              <div className="service_content">
                <div className="content__slogan">
                  Extensive cleaning over multiple days
                </div>
                <div className="content__value">
                  Our team is here to make your life easier by handling all
                  these tasks with efficiency and care. Tailor your service
                  package to include exactly what you need, all in one
                  convenient place.
                </div>
              </div>
              <div className="service__btn">
                <div>Customize Your Service</div>
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
        <div className="box__images">
          <div className="image__group">
            <div className="reason">
              <img src={Cleaning1} alt="cleaning" className="reason__image" />
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
              <img src={Cleaning3} alt="cleaning" className="reason__image" />
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
              <img src={Cleaning5} alt="cleaning" className="reason__image" />
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
      <div className="home__box">
        <div className="box__content">
          <div className="box__title">What people say</div>
        </div>
        <div className="box__images right">
          {reviews.map((review, index) => (
            <div className="image__group" key={index}>
              <div className="review">
                <div className="review__info">
                  <div className="info__item review__name">
                    {review.userName}
                  </div>
                  <div className="review__rate">
                    {review.orderService === 0 ? (
                      // <FaClock className="info__item review__service" />
                      <div className="info__item review__service">Hourly</div>
                    ) : review.orderService === 1 ? (
                      <FaCalendarCheck className="info__item review__service" />
                    ) : (
                      <FaToolbox className="info__item review__service" />
                    )}

                    <div className="info__item review__value">
                      {Math.round(review.rateOverall + 1)}/5
                      <FaFaceGrinBeam />
                    </div>
                  </div>
                </div>
                <div className="review__feedback">"{review.rateFeedback}"</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="home__box colored">
        <div className="box__content">
          <div className="box__title">
            Ready for a Cleaner Space ?
            <img src={Spray} alt="spray" className="small__image" />
          </div>
          <div className="box__value">
            <div className="value__item small__text">
              Please provide your email, and we will get back to you shortly!
            </div>
          </div>
        </div>
        <div className="box__images">
          <div className="image__group">
            <div className="contact">
              <input placeholder="Enter your email" />
              <div className="contact__btn">
                <FaLongArrowAltRight className="contact__btn_icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
