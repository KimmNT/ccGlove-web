import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/orderStyle.scss";
import "../../assets/sass/inforOrderStyle.scss";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";

export default function HourOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop, setIsOnTop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postCode, setPostCode] = useState("");
  const [addDetail, setAddDetail] = useState("");
  const [paymentCount, setPaymentCount] = useState(0);
  const [isAlert, setIsAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");

  useEffect(() => {
    const loadSavedInfo = JSON.parse(localStorage.getItem("czk6nazxt0"));
    if (loadSavedInfo !== null) {
      setFirstName(loadSavedInfo.firstName);
      setLastName(loadSavedInfo.lastName);
      setPhone(loadSavedInfo.phone);
      setEmail(loadSavedInfo.email);
      setPrefecture(loadSavedInfo.prefecture);
      setCity(loadSavedInfo.city);
      setDistrict(loadSavedInfo.district);
      setPostCode(loadSavedInfo.postCode);
      setAddDetail(loadSavedInfo.addDetail);
    }
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
    setPaymentCount(state.paymentCount);
    if (state.userInfo != null) {
      setFirstName(state.userInfo.firstName);
      setLastName(state.userInfo.lastName);
      setPhone(state.userInfo.phone);
      setEmail(state.userInfo.email);
      setPrefecture(state.userInfo.prefecture);
      setCity(state.userInfo.city);
      setDistrict(state.userInfo.district);
      setPostCode(state.userInfo.postCode);
      setAddDetail(state.userInfo.addDetail);
    }
  }, [state]);

  const checkIfAtTop = () => {
    if (window.scrollY === 0 || document.documentElement.scrollTop === 0) {
      setIsOnTop(true);
    } else {
      setIsOnTop(false);
    }
  };

  const handleNavigateBack = () => {
    if (state.moveFrom === "hourly") {
      navigateToPage("/order/hourlyOrder", { workingTime: state });
    } else if (state.moveFrom === "daily") {
      navigateToPage("/order/dailyOrder", { workingTime: state });
    } else {
      navigateToPage("/order/customOrder", { workingTime: state });
    }
  };

  const handleNavigate = () => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      phone !== "" &&
      email !== "" &&
      prefecture !== "" &&
      city !== "" &&
      district !== "" &&
      postCode !== ""
    ) {
      if (isSaved) {
        const saveInfo = {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          prefecture: prefecture,
          city: city,
          district: district,
          postCode: postCode,
        };
        localStorage.setItem("czk6nazxt0", JSON.stringify(saveInfo));
      }
      navigateToPage("/summaryOrder", {
        moveFrom: state.moveFrom,
        orderType: state.orderType,
        paymentCount: state.paymentCount,
        workingTime: state.workingTime,
        userInfo: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          prefecture: prefecture,
          city: city,
          district: district,
          postCode: postCode,
          addDetail: addDetail === undefined ? "" : addDetail,
        },
      });
    } else {
      setIsAlert(true);
      setAlertContent("Please fill in all required fields!");
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <div className="info__container">
      <div className={`page__headline ${isOnTop && `onTop`}`}>
        <div
          className="page__headline_icon_container"
          onClick={handleNavigateBack}
        >
          <FaArrowLeft className="page__headline_icon" />
        </div>
        <div className="page__headline_title">Information</div>
      </div>
      <div className="info__list">
        <div className="info__item double">
          <div className="item__input">
            <div className="item__input_title">First name*</div>
            <input
              placeholder="Type here"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="item__input">
            <div className="item__input_title">Last name*</div>
            <input
              placeholder="Type here"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="info__item one">
          <div className="item__input">
            <div className="item__input_title">Phone number*</div>
            <input
              placeholder="Type here"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="info__item one">
          <div className="item__input">
            <div className="item__input_title">Email address*</div>
            <input
              placeholder="Type here"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="info__item double">
          <div className="item__input">
            <div className="item__input_title">Prefecture*</div>
            <input
              placeholder="Type here"
              value={prefecture}
              onChange={(e) => setPrefecture(e.target.value)}
            />
          </div>
          <div className="item__input">
            <div className="item__input_title">City*</div>
            <input
              placeholder="Type here"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="info__item double">
          <div className="item__input">
            <div className="item__input_title">District/Area*</div>
            <input
              placeholder="Type here"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
          <div className="item__input">
            <div className="item__input_title">Post code*</div>
            <input
              placeholder="Type here"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
            />
          </div>
        </div>
        <div className="info__item one">
          <div className="item__input">
            <div className="item__input_title">Block/Street</div>
            <input
              placeholder="Type here"
              value={addDetail}
              onChange={(e) => setAddDetail(e.target.value)}
            />
          </div>
        </div>
        {firstName !== "" &&
          lastName !== "" &&
          phone !== "" &&
          email !== "" &&
          prefecture !== "" &&
          city !== "" &&
          district !== "" &&
          postCode !== "" && (
            <div className="info__saved">
              <div
                onClick={() => setIsSaved(!isSaved)}
                className={`info__saved_checkbox ${isSaved && `saved`}`}
              ></div>
              <div className="info__saved_value">Save for future use</div>
            </div>
          )}
      </div>
      <div className="order__payment" onClick={handleNavigate}>
        <div className="order__payment_value">
          {formatNumber(paymentCount)}¥
        </div>
        <div className="order__payment_container">
          <div className="order__payment_btn">
            <IoIosArrowForward className="order__payment_icon" />
          </div>
        </div>
      </div>
      {isAlert && (
        <div className="pop__container">
          <div className="pop__content pop__container_larger">
            <div className="pop__alert">{alertContent}</div>
            <div className="pop__btn_container">
              <div></div>
              <div className="btn close" onClick={() => setIsAlert(false)}>
                close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
