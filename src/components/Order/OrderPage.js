import { useEffect } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
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
    <div className="content">
      <div className="home__container">
        <div className="home__headline_title home__headline_full">
          <div className="slogan ">
            We’ll
            <span className="slogan__hightlight"> serve</span> you with our best
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
              <div className="service hour__background">
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
              <div className="service day__background">
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
              <div className="service year__background">
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
      </div>
    </div>
  );
}
