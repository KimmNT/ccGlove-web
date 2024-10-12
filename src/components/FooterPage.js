import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import LogoPage from "./LogoPage";
import Bloom from "../assets/images/broom.png";
import Spray from "../assets/images/spray.png";
import Shining from "../assets/images/shining.png";
import Cleaning1 from "../assets/images/cleaning1.jpg";
import Cleaning2 from "../assets/images/cleaning2.jpg";
import Cleaning3 from "../assets/images/cleaning3.jpg";
import Cleaning4 from "../assets/images/cleaning4.jpg";
import Cleaning5 from "../assets/images/sheduling.jpg";
import {
  FaAndroid,
  FaApple,
  FaCalendarCheck,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLongArrowAltRight,
  FaMailBulk,
  FaPhone,
  FaPhoneAlt,
  FaToolbox,
} from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

export default function FooterPage() {
  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="footer__headline">ccgloves</div>
        <div className="footer__info">
          <a
            href="https://www.facebook.com/profile.php?id=61564462511708"
            target="_blank"
          >
            <FaFacebook className="social__icon facebook" />
          </a>
          <a href="https://www.instagram.com/ccgloves.cc/" target="_blank">
            <FaInstagram className="social__icon instagram" />
          </a>
          <FaAndroid className="social__icon android" />
          <FaApple className="social__icon ios" />
        </div>
      </div>
      <div className="footer__rights">@jk 2024 All rights reserved</div>
    </div>
  );
}
