import { useEffect } from "react";
import usePageNavigation from "../uesPageNavigation";

function HomePage() {
    
    const {navigateToPage} = usePageNavigation();

    const handlePassValue = () =>{
        navigateToPage("about",{value:"123123123"})
    }
  return (
    <div>
        <div>home page</div>
        <div onClick={handlePassValue}>Passout</div>
    </div>
  );
}

export default HomePage;
