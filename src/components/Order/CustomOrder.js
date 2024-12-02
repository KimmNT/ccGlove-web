import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { MdArrowOutward } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FaBarsStaggered } from "react-icons/fa6";

export default function CustomOrder() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate
  const [isOnTop, setIsOnTop] = useState(false);
  const [customeServiceList, setCustomServiceList] = useState([]);
  const [filterService, setFilterService] = useState([]);

  const [serviceType, setServiceType] = useState([]);
  const [isType, setIsType] = useState(false);
  const [selectedType, setSelectedType] = useState("All");

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
  useEffect(() => {
    setRandomNumber(getRandomNumber(0, serviceType.length));
  }, [serviceType]);

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
    if (type === "All") {
      setFilterService(customeServiceList);
      setIsType(false);
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
    <div className="content">
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
            <div className="custom__service_filter">
              <FaBarsStaggered
                className="order__custom_title_btn"
                onClick={() => setIsType(true)}
              />
              <div className="order__custom_title_value">{selectedType}</div>
            </div>
            <div className="custom__service_filter_deskop">
              <div className="custom__filter_list">
                <div
                  className={`custom__filter_list_item ${
                    selectedType === "All"
                      ? `custom__filter_list_item_active`
                      : ``
                  }`}
                  onClick={() => handleSortService("All")}
                >
                  All
                </div>
                {serviceType.map((type, index) => (
                  <div
                    className={`custom__filter_list_item ${
                      selectedType === type
                        ? `custom__filter_list_item_active`
                        : ``
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
                  <div className="service__item_title">{service.name}</div>
                  <div className="service__item_content">
                    {service.detail.substring(0, 100)}...
                  </div>
                </div>
              ))}
            </div>
            <div className="custom__service_list_desktop">
              {selectedType === "All" && (
                <div className="custom__service_list_desktop_headline">
                  {customeServiceList
                    .slice(randomNumber, randomNumber + 1)
                    .map((service, index) => (
                      <div
                        className="custom__service_list_desktop_headline_item"
                        key={index}
                      >
                        <div className="custom__service_list_desktop_headline_item_title">
                          {service.name}
                        </div>
                        <div className="custom__service_list_desktop_headline_item_content">
                          {service.detail}
                        </div>
                        <a
                          href={service.link}
                          target="_blank"
                          className="custom__service_list_desktop_headline_item_link"
                        >
                          Click here for more information
                          <MdArrowOutward className="link__icon" />
                        </a>
                      </div>
                    ))}
                </div>
              )}
              {filterService.map((service, index) => (
                <div
                  className="service__item"
                  key={index}
                  onClick={() => handleSelectedItem(service)}
                >
                  <div className="service__item_title">{service.name}</div>
                  <div className="service__item_content">
                    {service.detail.substring(0, 100)}...
                  </div>
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
        {isType && (
          <div className="order__pop_container">
            <div className="order__pop_content">
              <div className="order__pop_list">
                <div
                  className="pop__list_item"
                  onClick={() => handleSortService("All")}
                >
                  All
                </div>
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
        )}
      </div>
    </div>
  );
}
