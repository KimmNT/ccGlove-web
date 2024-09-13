import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/orderStyle.scss";
import "../../assets/sass/inforOrderStyle.scss";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import "react-calendar/dist/Calendar.css";

export default function HourOrder() {
  const { navigateToPage,state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop,setIsOnTop] = useState(false)
  const [firstName,setFirstName] = useState("")
  const [paymentCount, setPaymentCount] = useState(0);


  useEffect(()=>{
    setPaymentCount(state.paymentCount)

    window.scrollTo({
        top: 0,       // Scroll to the top
        behavior: 'smooth'  // Smooth scrolling transition
      });    
       // Check when the component mounts
    checkIfAtTop();
    
    // Optionally, you can listen to scroll events and check in real-time
    window.addEventListener('scroll', checkIfAtTop);
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', checkIfAtTop);

  },[])


  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true)
    } else {
        setIsOnTop(false)
    }
  };

  const handleNavigateBack = () =>{
    navigateToPage("/order/hourlyOrder",{workingTime:state})
  }

  const handleNavigate = () =>{
    navigateToPage("/inforOrder",{
    //   workingTime:[
    //     {
    //       detail:"",
    //       duration:duration,
    //       selectedDate:moment(selectedDate).format("DD/MM/YYYY"),
    //       startTime:startTime,
    //       title:""
    //     }
    //   ]
    })
  }

  return (
    <div className="info__container">
        <div className={`info__headline ${isOnTop && `onTop`}`}>
            <div className="info__headline_icon_container" onClick={handleNavigateBack}><FaArrowLeft className="info__headline_icon"/></div>
        <div className="info__headline_title">Information</div>
        </div>
        <div className="info__list">
           <div className="info__item double">
                <div className="item__input">
                    <div className="item__input_title">First name</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
                <div className="item__input">
                    <div className="item__input_title">Last name</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
            </div>
           <div className="info__item one">
                <div className="item__input">
                    <div className="item__input_title">Phone number</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
            </div>
           <div className="info__item one">
                <div className="item__input">
                    <div className="item__input_title">Email address</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
            </div>
            <div className="info__item double">
                <div className="item__input">
                    <div className="item__input_title">Prefecture</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
                <div className="item__input">
                    <div className="item__input_title">City</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
            </div>
            <div className="info__item double">
                <div className="item__input">
                    <div className="item__input_title">District/Area</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
                <div className="item__input">
                    <div className="item__input_title">Post code</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
            </div>
            <div className="info__item one">
                <div className="item__input">
                    <div className="item__input_title">Block/Street</div>
                <input 
                    placeholder="Type here" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                />
                </div>
            </div>
        </div>
        <div className="order__payment" onClick={handleNavigate}>
          <div className="order__payment_value">{paymentCount}¥</div>
          <div className="order__payment_container">
            <div className="order__payment_content">
              <IoIosArrowForward className="order__payment_icon" />
            </div>
          </div>
        </div>
    </div>
  );
}
