import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import { FaAndroid, FaApple, FaInstagram } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaLine } from "react-icons/fa";
import LineQRCode from "../assets/images/line_qrcode.jpeg";
import { useState } from "react";

export default function FooterPage() {
  const [isLineClicked, setIsLineClicked] = useState(false);
  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="footer__headline">ccgloves</div>
        <div className="footer__info">
          <a href="https://www.instagram.com/ccgniseko/" target="_blank">
            <FaInstagram className="social__icon instagram" />
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=817039650906&text&type=phone_number&app_absent=0"
            target="_blank"
          >
            <IoLogoWhatsapp className="social__icon instagram" />
          </a>
          <div className="footer__info_item">
            {isLineClicked && (
              <img
                src={LineQRCode}
                alt="line__qrcode"
                className="footer__info_image"
              />
            )}
            <div onClick={() => setIsLineClicked(!isLineClicked)}>
              <FaLine className="social__icon instagram" />
            </div>
          </div>
          <FaAndroid className="social__icon android" />
          <FaApple className="social__icon ios" />
        </div>
      </div>
      <div className="footer__rights_container">
        <div className="footer__rights">@jk</div>
        <div className="footer__rights">ccgloves@ccgniseko.com</div>
        <a href="https://google.com" target="_blank" className="footer__rights">
          Private and Policy
        </a>
        <div className="footer__rights">All rights reserved</div>
      </div>
    </div>
  );
}
