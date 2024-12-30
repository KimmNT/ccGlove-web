// HomePage.jsx
import { useEffect, useState } from "react";
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import "../assets/sass/historyStyle.scss";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { LuPackage2 } from "react-icons/lu";
import { MdDone, MdOutlineCleaningServices } from "react-icons/md";
import { IoMdClose, IoMdDoneAll } from "react-icons/io";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { HiOutlineEmojiHappy, HiOutlineEmojiSad } from "react-icons/hi";
import { BsEmojiGrin, BsEmojiHeartEyes } from "react-icons/bs";
import { GoStarFill } from "react-icons/go";
import emailjs from "@emailjs/browser";

export default function HistoryPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchList, setSearchList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSearchValue, setIsSearchValue] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [describeValue, setDescribeValue] = useState("");
  const [isRating, setIsRating] = useState(false);
  const [rateService, setRateService] = useState(4);
  const [rateStaff, setRateStaff] = useState(4);
  const [rateBooking, setRateBooking] = useState(4);
  const [rateFeedback, setRateFeedback] = useState("");
  const [discountCodeValue, setDiscountCodeValue] = useState("");
  const [isSent, setIsSent] = useState(false);

  const rating = [
    {
      icon: <HiOutlineEmojiSad />,
      title: "Bad",
      value: 1,
    },
    {
      icon: <HiOutlineEmojiHappy />,
      title: "Fine",
      value: 2,
    },
    {
      icon: <BsEmojiGrin />,
      title: "Good",
      value: 3,
    },
    {
      icon: <BsEmojiHeartEyes />,
      title: "Great",
      value: 4,
    },
  ];

  useEffect(() => {
    window.scrollTo({
      top: 0, // Scroll to the top
      behavior: "smooth", // Smooth scrolling transition
    });
    setDiscountCodeValue(generateDiscount());
  }, []);

  const handleSearchOrder = async () => {
    if (inputValue === "") {
      setAlertContent("Please fill in your order ID");
    } else {
      const orderRef = collection(db, "orderList");
      const getMatchingOrderID = query(orderRef, where("id", "==", inputValue));
      const orderSnapShot = await getDocs(getMatchingOrderID);
      const orderMatchingValue = orderSnapShot.docs.map((doc) => ({
        ...doc.data(),
        idFireBase: doc.id,
      }));
      setSearchList(orderMatchingValue);
      setIsSearchValue(true);
      setAlertContent("");
    }
  };

  // Displays the current order status
  const getOrderStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <>
            <div className="pending">
              Pending <LuPackage2 />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="confirmed">
              Confirmed <MdDone />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="working">
              Working <MdOutlineCleaningServices />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="done">
              Done <IoMdDoneAll />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="cancel">
              Cancelled <IoMdClose />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  const getServiceType = (type) => {
    switch (type) {
      case 0:
        return "Hourly Service";
      case 1:
        return "Daily Service";
      case 2:
        return "Custom Service";
      default:
        return "";
    }
  };

  const handleGetDetailOrder = (search) => {
    setIsDetail(true);
    setSelectedOrder(search);
  };

  const handleCancelOrder = async () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    setIsDetail(false);
    setIsCancel(false);
    const orderRef = doc(db, "orderList", selectedOrder?.idFireBase);
    await updateDoc(orderRef, {
      completed: {
        date: date,
        time: time,
      },
      status: 4,
      describe: describeValue,
    });
    handleSearchOrder();
  };

  const updateOrderByCustomId = async (customId, updateData) => {
    try {
      // Query for the document with the custom id
      const q = query(collection(db, "orderList"), where("id", "==", customId));
      const querySnapshot = await getDocs(q);

      // Check if the document exists
      if (!querySnapshot.empty) {
        // Get the first matching document (assuming id is unique)
        const docSnapshot = querySnapshot.docs[0];
        const docRef = doc(db, "orderList", docSnapshot.id);

        // Update the document
        await updateDoc(docRef, updateData);
        console.log("Document updated successfully!");
      } else {
        console.log("No matching document found.");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleSendReview = async () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    //add into reviews collection
    await addDoc(collection(db, "reviewsList"), {
      orderId: selectedOrder?.id,
      userName: `${selectedOrder?.user.userFirstName} ${selectedOrder?.user.userLastName}`,
      orderService: selectedOrder?.type,
      rateService: rateService,
      rateBooking: rateBooking,
      rateStaff: rateStaff,
      rateFeedback: rateFeedback,
      rateOverall: (rateService + rateBooking + rateStaff) / 3,
      state: 0,
    });
    //add into discounts collection
    await addDoc(collection(db, "discountList"), {
      discountCode: discountCodeValue,
      discountValue: 5,
      discountCreatedDate: date,
      discountReuse: 0,
    });
    //update ratingState to 1
    await updateOrderByCustomId(selectedOrder?.id, {
      ratingState: 1,
    });
    //send discountCode to user
    sendEmail();
    handleSearchOrder();
  };
  // Function to send email
  const sendEmail = () => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      email__subject_content: `Thank you for your rating!`,
      user_name: `${selectedOrder?.user.userFirstName} ${selectedOrder?.user.userLastName}`,
      user_email: selectedOrder?.user.userEmail,
      email__content_welcome: `This is your 5% discount code: #${discountCodeValue}`,
      email__content_headline:
        "We look forward to serving you again in the future!",
      order_id: selectedOrder?.id,
      order__created: selectedOrder?.created.date,
      order__type:
        selectedOrder?.type === 0
          ? "Hourly"
          : selectedOrder?.type === 1
          ? "Daily"
          : "Custom Service",
      order__total: selectedOrder?.total,
      user__address: selectedOrder?.user.userAddress,
    };
    emailjs
      .send(
        "service_w0kfb1d",
        "template_62uq3kh",
        templateParams,
        "UCOII6_f0u6pockwH"
      )
      .then(
        () => {
          setIsSent(true);
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
    setIsSent(true);
  };
  const generateDiscount = () => {
    const date = new Date();
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];
    //for date
    const currentDay = date.getDate();
    const currentMonth = months[date.getMonth()];
    const currentDate = `${currentDay}${currentMonth}`;

    //for time
    const currentHour = date.getHours();
    const currentMinute = date.getMinutes();
    const currentSecond = date.getSeconds();
    const currentTime = `${currentHour}${currentMinute}${currentSecond}`;

    const generatedCode = `${currentDate}${currentTime}`;

    return generatedCode;
  };

  const handleCloseModal = () => {
    setIsDetail(false);
    setIsRating(false);
  };
  return (
    <div className="content">
      <div className="home__container">
        <div className="home__headline_title home__headline_full">
          <div className="slogan ">
            Check your
            <span className="slogan__hightlight"> order!</span>
          </div>
        </div>
        <div className="history__container">
          <div className="history__search">
            <input
              placeholder="Enter your order ID"
              value={inputValue.toUpperCase()}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="history__btn" onClick={handleSearchOrder}>
              <FaMagnifyingGlass className="history__btn_icon" />
            </div>
          </div>
          <div className="history__alert">{alertContent}</div>
          {isSearchValue && (
            <div className="history__result__after_search">
              {searchList.length > 0 ? (
                <>
                  {searchList.map((search, index) => (
                    <div
                      key={index}
                      className="search__item"
                      onClick={() => handleGetDetailOrder(search)}
                    >
                      <div className="search__item_headline">#{search.id}</div>
                      <div className="search__item_box">
                        <div className="item__box_title">Service: </div>
                        <div className="item__box_value">
                          {getServiceType(search.type)}
                        </div>
                      </div>
                      <div className="search__item_box">
                        <div className="item__box_title">Created: </div>
                        <div className="item__box_value">
                          {search.created.date}
                        </div>
                      </div>
                      {search.completed.date !== "" ? (
                        <div className="search__item_box">
                          <div className="item__box_title">Completed: </div>
                          <div className="item__box_value">
                            {search.completed.date}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="search__item_box">
                        <div className="item__box_title">Total: </div>
                        <div className="item__box_value">{search.total}¥</div>
                      </div>
                      <div className="search__item_box">
                        <div className="item__box_title">Status: </div>
                        <div className="item__box_value">
                          {getOrderStatus(search.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div>
                  No order found or no orders placed yet
                  <br />
                  Please check your information and try again.
                </div>
              )}
            </div>
          )}
        </div>
        {isDetail && (
          <div className="history__result">
            <div className="history__result_content">
              <div className="result__item">
                <div className="result__item_headline">
                  #{selectedOrder?.id}
                </div>
                <div className="result__item_content">
                  <div className="result__item_box">
                    <div className="item__box">
                      <div className="item__box_title">Name: </div>
                      <div className="item__box_value">
                        {selectedOrder?.user.userFirstName}{" "}
                        {selectedOrder?.user.userLastName}
                      </div>
                    </div>
                    <div className="item__box">
                      <div className="item__box_title">Email: </div>
                      <div className="item__box_value">
                        {selectedOrder?.user.userEmail}
                      </div>
                    </div>
                    <div className="item__box">
                      <div className="item__box_title">Phone number: </div>
                      <div className="item__box_value">
                        {selectedOrder?.user.userPhone}
                      </div>
                    </div>
                    <div className="item__box">
                      <div className="item__box_title">Address: </div>
                      <div className="item__box_value">
                        {selectedOrder?.user.userAddress} -{" "}
                        {selectedOrder?.user.userPostCode}
                      </div>
                    </div>
                  </div>
                  <div className="result__item_box">
                    <div className="item__box">
                      <div className="item__box_title">Current status: </div>
                      <div className="item__box_value">
                        {getOrderStatus(selectedOrder?.status)}
                        {selectedOrder?.status === 3 && (
                          <>
                            {selectedOrder?.ratingState === 0 ? (
                              <div
                                onClick={() => setIsRating(true)}
                                className="item__box_rate"
                              >
                                <GoStarFill />
                              </div>
                            ) : (
                              <div className="item__box_rate">
                                Already rated
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="item__box">
                      <div className="item__box_title">Service: </div>
                      <div className="item__box_value">
                        {getServiceType(selectedOrder?.type)}
                      </div>
                    </div>
                    <div className="item__box">
                      <div className="item__box_title">Total: </div>
                      <div className="item__box_value">
                        {selectedOrder?.total}¥
                      </div>
                    </div>
                    <div className="item__box item__box_row">
                      <div className="item__box_title">Working time: </div>
                      <div className="item__box_list">
                        {selectedOrder?.workingTime.map((working, index) => (
                          <div key={index} className="list__item">
                            <div className="list__item_box">
                              <div className="list__item_title">Time:</div>
                              <div className="list__item_value">
                                {working.startTime}:00 -{" "}
                                {working.startTime + working.duration}:00
                              </div>
                            </div>
                            <div className="list__item_box">
                              <div className="list__item_title">Duration:</div>
                              <div className="list__item_value">
                                {working.duration}hrs
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="result__item_btn">
                  {selectedOrder?.status === 0 ||
                  selectedOrder?.status === 1 ? (
                    <div
                      className="btn cancel"
                      onClick={() => setIsCancel(true)}
                    >
                      cancel this order
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div
                    onClick={() => {
                      setIsDetail(false);
                    }}
                    className="btn success"
                  >
                    close
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isCancel && (
          <div className="history__result">
            <div className="history__result_content">
              <div className="result__item">
                <div className="result__item_headline">
                  Please tell us why you want to cancel this order
                </div>
                <textarea
                  placeholder="Enter your reason why cancel this order"
                  className="result__item_textarea"
                  value={describeValue}
                  rows={6}
                  onChange={(e) => setDescribeValue(e.target.value)}
                ></textarea>
                <div className="result__item_btn">
                  <div></div>
                  <div className="result__btn_group">
                    <div
                      onClick={() => {
                        setIsCancel(false);
                        setDescribeValue("");
                      }}
                      className="btn close"
                    >
                      cancel
                    </div>
                    <div onClick={handleCancelOrder} className="btn success">
                      submit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isRating && (
          <div className="history__result">
            <div className="history__result_content">
              <div className="result__item">
                <div className="result__item_headline">
                  Share your thoughts with us.
                </div>
                <div className="result__item_content not__in_row">
                  <div className="result__item_box">
                    <div className="item__box item__box_row">
                      <div className="item__box_title">Service quality: </div>
                      <div className="item__box_list">
                        {rating.map((rate, index) => (
                          <div
                            key={index}
                            onClick={() => setRateService(rate.value)}
                            className={`list__item_rate ${
                              rateService === rate.value
                                ? `rate__active`
                                : `rate__inactive`
                            }`}
                          >
                            <div className="list__item_box">
                              <div className="list__item_icon">{rate.icon}</div>
                              <div className="list__item_value">
                                {rate.title}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="result__item_box">
                    <div className="item__box item__box_row">
                      <div className="item__box_title">Booking process: </div>
                      <div className="item__box_list">
                        {rating.map((rate, index) => (
                          <div
                            key={index}
                            onClick={() => setRateBooking(rate.value)}
                            className={`list__item_rate ${
                              rateBooking === rate.value
                                ? `rate__active`
                                : `rate__inactive`
                            }`}
                          >
                            <div className="list__item_box">
                              <div className="list__item_icon">{rate.icon}</div>
                              <div className="list__item_value">
                                {rate.title}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="result__item_box">
                    <div className="item__box item__box_row">
                      <div className="item__box_title">Staff quality: </div>
                      <div className="item__box_list">
                        {rating.map((rate, index) => (
                          <div
                            key={index}
                            onClick={() => setRateStaff(rate.value)}
                            className={`list__item_rate ${
                              rateStaff === rate.value
                                ? `rate__active`
                                : `rate__inactive`
                            }`}
                          >
                            <div className="list__item_box">
                              <div className="list__item_icon">{rate.icon}</div>
                              <div className="list__item_value">
                                {rate.title}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="result__item_box">
                    <div className="item__box item__box_row">
                      <div className="item__box_title">Any other though: </div>
                      <textarea
                        className="item__box_textarea"
                        value={rateFeedback}
                        onChange={(e) => setRateFeedback(e.target.value)}
                        rows={5}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="result__item_btn">
                  <div></div>
                  <div className="result__btn_group">
                    {isSent ? (
                      <div className="discount__sent_text">
                        A discount code was sent to your email. Check your inbox
                        and spam folder.
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setIsRating(false);
                        }}
                        className="btn close"
                      >
                        cancel
                      </div>
                    )}
                    {isSent ? (
                      <div onClick={handleCloseModal} className="btn success">
                        done
                      </div>
                    ) : (
                      <div onClick={handleSendReview} className="btn success">
                        submit
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
