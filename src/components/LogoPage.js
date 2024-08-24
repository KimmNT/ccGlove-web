import React from "react";
import Logo from "../assets/images/icon.png";
import "../assets/sass/shareStyle.scss";

export default function LogoPage() {
  return (
    <div className="logo__container">
      <img src={Logo} alt="Logo" />
    </div>
  );
}
