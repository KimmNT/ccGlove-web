import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaClock, FaCoins } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdArrowOutward } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function CustomOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const [isOnTop, setIsOnTop] = useState(false);
  const [customeServiceList, setCustomServiceList] = useState([]);
  const [filterService, setFilterService] = useState([]);

  const [serviceType, setServiceType] = useState([]);
  const [isType, setIsType] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  const [selectedService, setSelectedService] = useState(null);
  const [isSerivce, setIsService] = useState(false);

  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
    // Check when the component mounts
    checkIfAtTop();

    // Optionally, you can listen to scroll events and check in real-time
    window.addEventListener("scroll", checkIfAtTop);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("scroll", checkIfAtTop);
  }, []);

  useEffect(() => {
    getServicesList();
  }, []);

  //for random show service type
  // useEffect(() => {
  //   setRandomNumber(getRandomNumber(0, serviceType.length));
  // }, [serviceType]);

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleNavigateBack = () => {
    navigateToPage("/");
  };

  const getServicesList = async () => {
    try {
      const data = await getDocs(collection(db, "servicesList"));
      const dataList = data.docs.map((doc) => {
        const eachData = doc.data();
        return {
          idFireBase: doc.id,
          ...eachData,
        };
      });
      setFilterService(dataList);
      setCustomServiceList(dataList);
      setServiceType([...new Set(dataList.map((data) => data.type))]);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error as needed
    }
  };

  const handleSortService = (type) => {
    setSelectedType(type);
    if (type === "all") {
      setFilterService(customeServiceList);
    } else {
      const sorted = customeServiceList.filter(
        (service) => service.type === type
      );
      setFilterService(sorted);
      setIsType(false);
    }
  };

  const handleSelectedItem = (item) => {
    setSelectedService(item);
    setIsService(true);
  };

  const getRandomNumber = (min, max) => {
    return parseInt(Math.random() * (max - min) + min);
  };

  return (
    <div className="order__container">
      <div className={`page__headline ${isOnTop && `onTop`}`}>
        <div
          className="page__headline_icon_container"
          onClick={handleNavigateBack}
        >
          <FaArrowLeft className="page__headline_icon" />
        </div>
        <div className="page__headline_title">Custom Services</div>
      </div>
      <div className="order__content">
        <div className="order__custom">
          <div className="order__custom_item">
            <div className="custom__type_list">
              <div
                className={`type__item ${
                  selectedType === "all" ? `type__item_active` : ``
                }`}
                onClick={() => handleSortService("all")}
              >
                All
              </div>
              {serviceType
                // .slice(randomNumber, randomNumber + 3)
                .map((type, index) => (
                  <div
                    className={`type__item ${
                      selectedType === type ? `type__item_active` : ``
                    }`}
                    key={index}
                    onClick={() => handleSortService(type)}
                  >
                    {type}
                  </div>
                ))}
            </div>
          </div>
          <div className="custom__service_list">
            {filterService.map((service, index) => (
              <div
                className="service__item"
                key={index}
                onClick={() => handleSelectedItem(service)}
              >
                {service.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      {isSerivce && (
        <div className="order__pop_container">
          <div className="order__pop_content">
            <div className="order__pop_item headline">
              {selectedService?.name}
            </div>
            <div className="order__pop_item describe">
              {selectedService?.detail}
            </div>
            <a
              href={selectedService?.link}
              target="_blank"
              className="order__pop_item link"
            >
              Click here for more information
              <MdArrowOutward className="link__icon" />
            </a>
            <div className="order__pop_btn_container">
              <div></div>
              <div className="btn close" onClick={() => setIsService(false)}>
                close
              </div>
            </div>
          </div>
        </div>
      )}
      {/* FOR HIDE/SHOW SERVICE TYPE */}
      {/* {isType && (
        <div className="order__pop_container">
          <div className="order__pop_content">
            <div className="order__pop_list">
              {serviceType.map((type, index) => (
                <div
                  className="pop__list_item"
                  key={index}
                  onClick={() => handleSortService(type)}
                >
                  {type}
                </div>
              ))}
            </div>
            <div className="order__pop_btn_container">
              <div></div>
              <div className="btn close" onClick={() => setIsType(false)}>
                close
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
