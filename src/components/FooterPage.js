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
import { FaAndroid, FaApple, FaInstagram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaLine } from "react-icons/fa";

export default function FooterPage() {
  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="footer__headline">ccgloves</div>
        <div className="footer__info">
          <a href="https://www.instagram.com/ccgniseko/" target="_blank">
            <FaInstagram className="social__icon instagram" />
          </a>
          <a href="https://wa.me/qr/FTONB2SAVSF3O1/" target="_blank">
            <IoLogoWhatsapp className="social__icon instagram" />
          </a>
          <a href="https://line.me/ti/p/UrMJR91o61" target="_blank">
            <FaLine className="social__icon instagram" />
          </a>
          <FaAndroid className="social__icon android" />
          <FaApple className="social__icon ios" />
        </div>
      </div>
      <div className="footer__rights_container">
        <div className="footer__rights">@jk</div>
        <div className="footer__rights">ccgloves@ccgniseko.com</div>
        <div className="footer__rights">Policy</div>
        <div className="footer__rights">All rights reserved</div>
      </div>
    </div>
  );
}
