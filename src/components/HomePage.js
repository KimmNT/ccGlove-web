import { useEffect } from "react";
import usePageNavigation from "../uesPageNavigation";
import "../sass/shareStyle.scss"
import {FaHandHoldingWater, FaHome } from "react-icons/fa"

function HomePage() {
    
    const {navigateToPage} = usePageNavigation();

    const handlePassValue = () =>{
        navigateToPage("about",{value:"123123123"})
    }
  return (
    <div>
        <div className="text">home page</div>
        <div onClick={handlePassValue}>Passout</div>
        <div><FaHome/></div>
    </div>
  );
}

export default HomePage;
