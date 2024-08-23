import { useEffect } from "react";
import usePageNavigation from "../uesPageNavigation";

function AboutPage() {

    const {state,navigateToPage} = usePageNavigation();

    const handleGoBack = () =>{
        navigateToPage("/")
    }

  return (
    <div>
        <div onClick={handleGoBack}>go back</div>
        <div>about page</div>
        <div>{state.value}</div>
    </div>
  );
}

export default AboutPage;
