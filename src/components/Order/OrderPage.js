import { useEffect } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import Spray from "../../assets/images/spray.png";
import Bloom from "../../assets/images/broom.png";
import {
  FaCalendarCheck,
  FaClock,
  FaLongArrowAltRight,
  FaToolbox,
} from "react-icons/fa";
import "react-calendar/dist/Calendar.css";

export default function OrderPage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
  }, []);

  return (
    <div className="home__container">
      <div className="home__headline_title home__headline_full">
        <div className="slogan ">
          We’ll
          <span className="slogan__hightlight"> serve</span> you with our best
        </div>
      </div>
      <div className="home__box" id="services">
        <div className="box__content colored">
          <div className="box__title">
            What we offer{" "}
            <img src={Bloom} alt="bloom" className="small__image" />
          </div>
          <div className="box__value">
            <div className="value__item">
              We offer a variety of services, including hourly rentals, daily
              rentals, or a customizable option to best suit your needs.
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
                  Quick and efficient cleaning
                </div>
                <div className="content__value">
                  Perfect for those who need a quick and efficient clean! Our
                  ‘Hire in Hours’ service is ideal for small apartments,
                  specific areas, or quick touch-ups. Book our professional
                  cleaners by the hour to get the job done without any hassle.
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
                  Choose from specialized services
                </div>
                <div className="content__value">
                  Whether it’s a deep clean, regular maintenance, or office
                  cleaning, our team is available to work multiple hours across
                  several days to ensure your space remains spotless and fresh.
                </div>
              </div>
              <div
                className="service__btn"
                onClick={() => navigateToPage("/order")}
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
              <div
                className="service__btn"
                onClick={() =>
                  navigateToPage("/order/hourlyOrder", { nav: "home" })
                }
              >
                <div>Customize Your Service</div>
                <FaLongArrowAltRight className="service__btn_icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
