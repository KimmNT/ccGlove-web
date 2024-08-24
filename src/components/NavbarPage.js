// HomePage.jsx
import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import LogoPage from "./LogoPage";

export default function NavbarPage() {
  return (
    <div className="container">
      <div className="navbar__container">
        <div className="navbar__header">
          <LogoPage />
          <div className="navbar__menu">
            <div className="menu__item">Home</div>
            <div className="menu__item">About</div>
            <div className="menu__item">Order</div>
            <div className="menu__item">History</div>
            <div className="menu__item">Contact</div>
          </div>
        </div>
      </div>
    </div>
  );
}
