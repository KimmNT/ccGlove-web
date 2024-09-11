import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import Bloom from "../assets/images/broom.png";
import Spray from "../assets/images/spray.png";
import Shining from "../assets/images/shining.png";
import Cleaning1 from "../assets/images/cleaning1.jpg";
import Cleaning2 from "../assets/images/cleaning2.jpg";
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

export default function ContactPage() {
  return (
    <div className="home__container">
      <div className="home__headline">
        <div className="slogan ">
          <span className="slogan__hightlight">Connect</span> with Our Team
        </div>
        <img src={Shining} alt="shining" className="shining rolling" />
      </div>
      <div className="home__box colored">
        <div className="box__content">
          {/* <div className="box__title">
            Ready for a Cleaner Space ?
            <img src={Spray} alt="spray" className="small__image" />
          </div> */}
          <div className="box__value">
            <div className="value__item small__text">
              Please provide your information, and we will get back to you
              shortly!
            </div>
          </div>
        </div>
        <div className="box__images">
          <div className="image__group">
            <div className="contact contact__form">
              <input placeholder="Enter your name" />
              <input placeholder="Enter your phone number" />
              <input placeholder="Enter your email" />
              <div className="contact__btn btn__form">
                <div className="contact__btn_icon">SUBMIT</div>
              </div>
            </div>
          </div>
          <div className="break__text">OR</div>
          <div className="image__group">
            <div className="contact__info">
              <div className="contact__info_item">
                <div className="contact__info_title">Hotline</div>
                <div className="contact__info_value">031 293 123</div>
              </div>
              <div className="contact__info_item">
                <div className="contact__info_title">Email</div>
                <div className="contact__info_value">ccgloves.cc@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
