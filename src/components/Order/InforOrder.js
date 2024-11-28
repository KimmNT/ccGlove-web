import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/shareStyle.scss";
import "../../assets/sass/orderStyle.scss";
import "../../assets/sass/inforOrderStyle.scss";
import { IoIosArrowForward } from "react-icons/io";
import { FaArrowLeft } from "react-icons/fa";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";

export default function HourOrder() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  const [isOnTop, setIsOnTop] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prefecture, setPrefecture] = useState("Hokkaido");
  const [district, setDistrict] = useState("Abuta");
  const [town, setTown] = useState("");
  const [postCode, setPostCode] = useState("");
  const [addDetail, setAddDetail] = useState("");
  const [paymentCount, setPaymentCount] = useState(0);
  const [isAlert, setIsAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [areaList, setAreaList] = useState([]);
  const [movingFee, setMovingFee] = useState(0);

  useEffect(() => {
    getAreaList();
    const loadSavedInfo = JSON.parse(localStorage.getItem("czk6nazxt0"));
    if (loadSavedInfo !== null) {
      setFirstName(loadSavedInfo.firstName);
      setLastName(loadSavedInfo.lastName);
      setPhone(loadSavedInfo.phone);
      setEmail(loadSavedInfo.email);
      // setPrefecture(loadSavedInfo.prefecture);
      // setDistrict(loadSavedInfo.district);
      setTown(loadSavedInfo.town);
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
      // setPrefecture(state.userInfo.prefecture);
      // setDistrict(state.userInfo.district);
      setTown(state.userInfo.town);
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

  const getAreaList = async () => {
    try {
      const q = query(collection(db, "areaList"));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        idFireBase: doc.id,
      }));
      setAreaList(results);
    } catch (error) {
      console.error("Error searching by email: ", error);
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
      town !== "" &&
      addDetail !== ""
    ) {
      if (isSaved) {
        const saveInfo = {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          town: town,
          addDetail: addDetail,
          postCode: postCode,
        };
        localStorage.setItem("czk6nazxt0", JSON.stringify(saveInfo));
      }
      navigateToPage("/summaryOrder", {
        moveFrom: state.moveFrom,
        orderType: state.orderType,
        paymentCount: paymentCount,
        workingTime: state.workingTime,
        userInfo: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          email: email,
          prefecture: prefecture,
          district: district,
          town: town,
          postCode: postCode,
          addDetail: addDetail === undefined ? "" : addDetail,
          movingFee: handleGetFeeByArea(town),
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

  const handleGetFeeByArea = (area) => {
    const item = areaList.find((item) => item.areaName === area);
    return item ? parseInt(item.areaFee) : null; // Return null if no match is found
  };

  return (
    <div className="content">
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
              <div className="item__input_title">Prefecture</div>
              <input
                placeholder="Enter your prefecture"
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                disabled
              />
            </div>
            <div className="item__input">
              <div className="item__input_title">District</div>
              <input
                placeholder="Type here"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                disabled
              />
            </div>
          </div>
          <div className="info__item double">
            <div className="item__input">
              <div className="item__input_title">Town/Area*</div>
              <select
                className="selection"
                name="area"
                onChange={(e) => setTown(e.target.value)}
              >
                {town === "" ? (
                  <option value="" disabled selected>
                    Select an area
                  </option>
                ) : (
                  <option value={town} disabled selected>
                    {town}
                  </option>
                )}
                {areaList.map((area, index) => (
                  <option key={index} value={area.areaName}>
                    {area.areaName}
                  </option>
                ))}
              </select>
              {handleGetFeeByArea(town) > 0 ? (
                <div className="item__input_alert">
                  Transportation and travelling fee : {handleGetFeeByArea(town)}
                  ¥
                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="item__input">
              <div className="item__input_title">Post code</div>
              <input
                placeholder="Type here"
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
              />
            </div>
          </div>
          <div className="info__item one">
            <div className="item__input">
              <div className="item__input_title">Block/Street*</div>
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
            town !== "" &&
            addDetail !== "" && (
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
            {formatNumber(paymentCount)}¥{" "}
            {handleGetFeeByArea(town) > 0 ? (
              <div className="order__payment_value_adding">
                (+{formatNumber(handleGetFeeByArea(town))}¥)
              </div>
            ) : (
              ``
            )}
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
    </div>
  );
}
