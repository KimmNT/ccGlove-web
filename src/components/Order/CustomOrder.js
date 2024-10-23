import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/homeStyle.scss";
import "../../assets/sass/orderStyle.scss";
import { FaClock, FaCoins } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function CustomOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const [isOnTop, setIsOnTop] = useState(false);
  const [customeServiceList, setCustomServiceList] = useState([]);
  const [filterService, setFilterService] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

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
    }
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
        <div className="custom__type_list">
          <div className="type__item">All</div>
          {serviceType.map((type, index) => (
            <div className="type__item" key={index}>
              {type}
            </div>
          ))}
        </div>
        <div className="custom__service_list">
          {filterService.map((service, index) => (
            <div className="service__item" key={index}>
              {service.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
