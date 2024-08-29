// HomePage.jsx
import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import LogoPage from "./LogoPage";
import {
  FaBars,
  FaGitter,
  FaLongArrowAltRight,
  FaTimes,
  FaUser,
} from "react-icons/fa";

export default function NavbarPage() {
  // State to store the width of the window
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isNavBar, setIsNavBar] = useState(false);

  // Function to update the state with the new window width
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  // useEffect hook to add and clean up the event listener for window resize
  useEffect(() => {
    // Add the event listener when the component mounts
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="container">
      <div className="navbar__container">
        <div className="navbar__header">
          <LogoPage />
          <div
            className={`navbar__icon ${isNavBar ? `hide` : ``}`}
            onClick={() => setIsNavBar(!isNavBar)}
          >
            <FaGitter />
          </div>
        </div>
        <div
          className={`menu__container ${
            isNavBar ? `menu__show` : `menu__hide`
          }`}
        >
          <div className="navbar__background"></div>
          <div className="navbar__menu">
            <div className="navbar__menu_content">
              <div className="menu__item">
                <div className="menu__item_value">home</div>
                <FaLongArrowAltRight className="menu__item_icon" />
              </div>
              <div className="menu__item">
                <div className="menu__item_value">about</div>
                <FaLongArrowAltRight className="menu__item_icon" />
              </div>
              <div className="menu__item">
                <div className="menu__item_value">history</div>
                <FaLongArrowAltRight className="menu__item_icon" />
              </div>
              <div className="menu__item">
                <div className="menu__item_value">contact</div>
                <FaLongArrowAltRight className="menu__item_icon" />
              </div>
            </div>
            <div className="navbar__menu_controller">
              <div className="menu__login">
                <div className="menu__login_value">log in now</div>
                <FaUser className="menu__login_icon" />
              </div>
              <div className="menu__close" onClick={() => setIsNavBar(false)}>
                <FaTimes />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
