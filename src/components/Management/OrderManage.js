import React, { useEffect, useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import { FaArrowRightLong, FaMagnifyingGlass, FaStar } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuPackage2 } from "react-icons/lu";
import { MdDone, MdOutlineCleaningServices } from "react-icons/md";
import { IoMdClose, IoMdDoneAll } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import StaffSelection from "./Modals/StaffSelection";
import DescribeChange from "./Modals/DescribeChange";
import UserInfoChange from "./Modals/UserInfoChange";
import emailjs from "@emailjs/browser";

export default function OrderManage({ data, refresh }) {
  const [filteredOrders, setFilteredOrders] = useState(data);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [typeSelect, setTypeSelect] = useState(3);
  const [stateSelect, setStateSelect] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderStatus, setOrderStatus] = useState(0);

  const [orderDescribe, setOrderDescribe] = useState("");
  const [isDescribe, setIsDescribe] = useState(false);

  const [orderUser, setOrderUser] = useState(null);
  const [isUser, setIsUser] = useState(false);

  const [orderWorkingTime, setOrderWorkingTime] = useState([]);

  const [isStaff, setIsStaff] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStaffID, setSelectedStaffID] = useState("");

  const [isSave, setIsSave] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    handleFilter();
  }, [data]);

  // Function to handle the input change and filter data
  const handleSearch = (e) => {
    setInputValue(e.target.value);
  };
  // Filter functions
  const filterByInput = (data, input) => {
    return data.filter(
      (item) =>
        item.user.userFirstName.toLowerCase().includes(input.toLowerCase()) ||
        item.user.userLastName.toLowerCase().includes(input.toLowerCase()) ||
        item.belongTo.empName.toLowerCase().includes(input.toLowerCase()) ||
        item.id.toLowerCase().includes(input.toLowerCase())
    );
  };

  const filterByStatus = (data, status) => {
    return data.filter((item) => item.status === parseInt(status));
  };

  const filterByType = (data, type) => {
    return data.filter((item) => item.type === parseInt(type));
  };

  const filterByDateRange = (data, startDate, endDate) => {
    return data.filter((item) => {
      const itemDate = new Date(item.created.date).getTime();
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Combined filter function
  const handleFilter = () => {
    let result = data;

    if (inputValue) {
      result = filterByInput(result, inputValue);
    }

    if (stateSelect !== 5) {
      result = filterByStatus(result, stateSelect);
    }

    if (typeSelect !== 3) {
      result = filterByType(result, typeSelect);
    }

    if (fromDate !== null && toDate !== null) {
      result = filterByDateRange(result, fromDate, toDate);
    }

    setFilteredOrders(result);
  };

  const handleReset = () => {
    setInputValue("");
    setFromDate(null);
    setToDate(null);
    setTypeSelect(3);
    setStateSelect(5);
    setFilteredOrders(data);
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
            <FaArrowRightLong className="detail__item_arrow" />
          </>
        );
      case 1:
        return (
          <>
            <div className="confirmed">
              Confirmed <MdDone />
            </div>
            <FaArrowRightLong className="detail__item_arrow" />
          </>
        );
      case 2:
        return (
          <>
            <div className="working">
              Working <MdOutlineCleaningServices />
            </div>
            <FaArrowRightLong className="detail__item_arrow" />
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
  const renderStatusActions = () => {
    switch (orderStatus) {
      case 0: // Pending
        return (
          <>
            <div onClick={() => handleStatusUpdate(1)} className="confirmed">
              Confirmed <MdDone />
            </div>
            <div onClick={() => handleStatusUpdate(4)} className="cancel">
              Cancelled <IoMdClose />
            </div>
          </>
        );
      case 1: // Confirmed
        return (
          <>
            <div onClick={() => handleStatusUpdate(2)} className="working">
              Working <MdOutlineCleaningServices />
            </div>
            <div onClick={() => handleStatusUpdate(4)} className="cancel">
              Cancelled <IoMdClose />
            </div>
          </>
        );
      case 2: // Working
        return (
          <>
            <div onClick={() => handleStatusUpdate(3)} className="done">
              Done <IoMdDoneAll />
            </div>
          </>
        );
      default:
        return null; // No action buttons for Done or Cancelled
    }
  };
  // Handles the status update when an action is clicked
  const handleStatusUpdate = (newStatus) => {
    setOrderStatus(newStatus);
  };
  const getServiceType = (type) => {
    switch (type) {
      case 0:
        return "Hourly Service";
      case 1:
        return "Daily Service";
      case 2:
        return "Custom Service";
    }
  };
  const handleGetOrderDetail = (order) => {
    setIsDetail(true);
    setSelectedOrder(order);
    setOrderWorkingTime(order.workingTime);
    setOrderStatus(order.status);
    setOrderDescribe(order.describe);
    setOrderUser(order.user);
    setSelectedStaff(order.belongTo.empName);
    setSelectedStaffID(order.belongTo.empID);
  };
  const handleSelectedStaff = (staff) => {
    setSelectedStaff(staff.userName);
    setSelectedStaffID(staff.id);
  };
  const handleChangeDescribe = (describe) => {
    setOrderDescribe(describe);
  };
  const handleChangeUserInfo = (userInfo) => {
    setOrderUser(userInfo);
  };
  const handleIsSave = () => {
    setIsSave(true);
  };
  const handleNotSave = () => {
    setIsSave(false);
    setIsDetail(false);
  };
  const handleSave = async () => {
    const now = new Date();
    const date = now.toLocaleDateString(); // e.g., '8/5/2024'
    const time = now.toLocaleTimeString(); // e.g., '3:45:30 PM'
    setIsDetail(false);
    setIsSave(false);
    if (orderStatus === 1) {
      await sendEmail();
    }
    const orderRef = doc(db, "orderList", selectedOrder?.idFireBase);
    await updateDoc(orderRef, {
      belongTo: {
        empID:
          selectedStaffID !== null && selectedStaffID !== undefined
            ? selectedStaffID
            : "",
        empName:
          selectedStaff !== null && selectedStaff !== undefined
            ? selectedStaff
            : "",
      },
      completed: {
        date:
          orderStatus === 3 || orderStatus === 4
            ? date
            : selectedOrder?.completed.date,
        time:
          orderStatus === 3 || orderStatus === 4
            ? time
            : selectedOrder?.completed.time,
      },
      created: {
        date: selectedOrder?.created.date,
        time: selectedOrder?.created.time,
      },
      describe: orderDescribe,
      id: selectedOrder?.id,
      payment: {
        paymentCVV: selectedOrder?.payment.paymentCVV,
        paymentDate: selectedOrder?.payment.paymentDate,
        paymentNumer: selectedOrder?.payment.paymentNumer,
        paymentOption: selectedOrder?.payment.paymentOption,
      },
      ratingState: selectedOrder?.ratingState,
      status: orderStatus,
      total: selectedOrder?.total,
      type: selectedOrder?.type,
      user: {
        userAddress: orderUser?.userAddress,
        userEmail: orderUser?.userEmail,
        userFirstName: orderUser?.userFirstName,
        userLastName: orderUser?.userLastName,
        userPhone: orderUser?.userPhone,
        userPostCode: orderUser?.userPostCode,
      },
      working: {
        date: orderStatus === 2 ? date : selectedOrder?.working.date,
        time: orderStatus === 2 ? time : selectedOrder?.working.time,
      },
      workingTime: orderWorkingTime,
    });
    refresh();
  };
  // Function to send email
  const sendEmail = () => {
    // Template parameters to be sent via EmailJS
    const templateParams = {
      email__subject_content: `Your order #${selectedOrder?.id} has beed confirmed!`,
      user_name: `${selectedOrder?.user.userFirstName} ${selectedOrder?.user.userLastName}`,
      user_email: selectedOrder?.user.userEmail,
      email__content_welcome: "Thank you for your order!",
      email__content_headline:
        "We are excited to let you know that your order has been successfully placed and is now being processed. Here are the details of your order:",
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
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
  const handleDeleteOrder = async () => {
    try {
      await deleteDoc(doc(db, "orderList", selectedOrder?.idFireBase));
      refresh();
      setIsDelete(false);
      setIsDetail(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="ordermanage__container">
      <div className="ordermanage__content">
        <div className="ordermanage__navbar">
          <div className="ordermanage__search">
            <div className="ordermanage__search_item">
              <div className="search__title">ID, user name, staff name...</div>
              <div className="search__content input">
                <input
                  type="text"
                  className="search__input"
                  value={inputValue}
                  onChange={handleSearch}
                />
                <FaMagnifyingGlass className="search__btn" />
              </div>
            </div>
            <div className="ordermanage__search_break"></div>
            <div className="ordermanage__search_item">
              <div className="search__title">Order status</div>
              <div className="search__content">
                <div
                  onClick={() => setStateSelect(5)}
                  className={`search__content_state ${
                    stateSelect === 5 ? `all__active` : ``
                  }`}
                >
                  All
                </div>
                <div
                  onClick={() => setStateSelect(0)}
                  className={`search__content_state ${
                    stateSelect === 0 ? `pending__active` : ``
                  }`}
                >
                  Pending
                </div>
                <div
                  onClick={() => setStateSelect(1)}
                  className={`search__content_state ${
                    stateSelect === 1 ? `confirmed__active` : ``
                  }`}
                >
                  Confirmed
                </div>
                <div
                  onClick={() => setStateSelect(2)}
                  className={`search__content_state ${
                    stateSelect === 2 ? `working__active` : ``
                  }`}
                >
                  Working
                </div>
                <div
                  onClick={() => setStateSelect(3)}
                  className={`search__content_state ${
                    stateSelect === 3 ? `done__active` : ``
                  }`}
                >
                  Done
                </div>
                <div
                  onClick={() => setStateSelect(4)}
                  className={`search__content_state ${
                    stateSelect === 4 ? `cancel__active` : ``
                  }`}
                >
                  Cancel
                </div>
              </div>
            </div>
            <div className="ordermanage__search_break"></div>
            <div className="ordermanage__search_item">
              <div className="search__title">Order type</div>
              <div className="search__content">
                <div
                  onClick={() => setTypeSelect(3)}
                  className={`search__content_option ${
                    typeSelect === 3 ? `search__content_option_active` : ``
                  }`}
                >
                  All
                </div>
                <div
                  onClick={() => setTypeSelect(0)}
                  className={`search__content_option ${
                    typeSelect === 0 ? `search__content_option_active` : ``
                  }`}
                >
                  Hourly
                </div>
                <div
                  onClick={() => setTypeSelect(1)}
                  className={`search__content_option ${
                    typeSelect === 1 ? `search__content_option_active` : ``
                  }`}
                >
                  Daily
                </div>
                {/* <div
                  onClick={() => setTypeSelect(2)}
                  className={`search__content_option ${
                    typeSelect === 2 ? `search__content_option_active` : ``
                  }`}
                >
                  Custom Service
                </div> */}
              </div>
            </div>
            <div className="ordermanage__search_break"></div>
            <div className="ordermanage__search_item">
              <div className="search__title">Date</div>
              <div className="search__content">
                <div className="search__content_date">
                  <div className="search__content_title">From</div>
                  <DatePicker
                    className="date__picker"
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="d/M/yyyy"
                  />
                </div>
                <div className="search__content_date">
                  <div className="search__content_title">To</div>
                  <DatePicker
                    className="date__picker"
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="d/M/yyyy"
                  />
                </div>
              </div>
            </div>
            <div className="ordermanage__search_break"></div>
            <div className="ordermanage__search_item">
              <div className="search__content">
                <div
                  className="search__content_btn btn clear"
                  onClick={handleReset}
                >
                  Clear
                </div>
                <div
                  className="search__content_btn btn search"
                  onClick={handleFilter}
                >
                  Search
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ordermanage__navbar notAbsolute"></div>
        <div className="ordermanage__data">
          <div className="data__content">
            <div className="data__list">
              {filteredOrders.length > 0 ? (
                <>
                  {filteredOrders?.map((item, index) => (
                    <div
                      key={index}
                      className="data__item"
                      onClick={() => handleGetOrderDetail(item)}
                    >
                      <div className="data__item_headline">#{item.id}</div>
                      <div className="data__item_group">
                        <div className="data__item_title">User name</div>
                        <div className="data__item_value">
                          {item.user.userFirstName} {item.user.userLastName}
                        </div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">Service</div>
                        {item.type === 0 ? (
                          <div className="data__item_value">Hourly Service</div>
                        ) : item.type === 1 ? (
                          <div className="data__item_value">Daily Service</div>
                        ) : (
                          <div className="data__item_value">Custom Service</div>
                        )}
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">Created date</div>
                        <div className="data__item_value">
                          {item.created.date}
                        </div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">Order state</div>
                        {item.status === 0 ? (
                          <div className="data__item_value pending">
                            Pending <LuPackage2 />
                          </div>
                        ) : item.status === 1 ? (
                          <div className="data__item_value confirmed">
                            Confirmed <MdDone />
                          </div>
                        ) : item.status === 2 ? (
                          <div className="data__item_value working">
                            Working <MdOutlineCleaningServices />
                          </div>
                        ) : item.status === 3 ? (
                          <div className="data__item_value done">
                            Done <IoMdDoneAll />
                          </div>
                        ) : (
                          <div className="data__item_value cancel">
                            Cancel <IoMdClose />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="data__item_no_matching">
                  No orders match your filter
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`ordermanage__detail ${isDetail ? `detail__active` : ``}`}
      >
        <div className="detail__content">
          <div className="detail__box">
            {/* Order ID */}
            <div className="detail__item headline">#{selectedOrder?.id}</div>
            <div className="detail__item_break_vertical"></div>
            {/* Status Action Buttons */}
            <div className="detail__item">
              {getOrderStatus(orderStatus)}
              {renderStatusActions()}
            </div>
            {selectedOrder?.ratingState === 0 ? (
              <></>
            ) : (
              <>
                <div className="detail__item_break_vertical"></div>
                <div className="detail__item rating">
                  <FaStar />
                </div>
              </>
            )}
          </div>
          <div className="detail__item_break"></div>
          {/* Time line */}
          <div className="detail__box">
            <div className="detail__item">
              <div className="detail__item_title">Created at</div>
              <div className="detail__item_value border">
                {selectedOrder?.created.date} <br />
                {selectedOrder?.created.time}
              </div>
            </div>
            {selectedOrder?.working.date !== "" && (
              <>
                <FaArrowRightLong className="detail__item_arrow" />
                <div className="detail__item">
                  <div className="detail__item_title ">Working at</div>
                  <div className="detail__item_value border">
                    {selectedOrder?.working.date} <br />
                    {selectedOrder?.working.time}
                  </div>
                </div>
              </>
            )}
            {selectedOrder?.completed.date !== "" && (
              <>
                <FaArrowRightLong className="detail__item_arrow" />
                <div className="detail__item">
                  <div className="detail__item_title">Completed at</div>
                  <div className="detail__item_value border">
                    {selectedOrder?.completed.date} <br />
                    {selectedOrder?.completed.time}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="detail__item_break"></div>
          <div className="detail__box">
            {/* Service Type */}
            <div className="detail__item background">
              <div className="detail__item_title">Service</div>
              <div className="detail__item_value">
                {getServiceType(selectedOrder?.type)}
              </div>
            </div>
            <div className="detail__item_break_vertical"></div>
            {/* Total */}
            <div className="detail__item background">
              <div className="detail__item_title">Total</div>
              <div className="detail__item_value">{selectedOrder?.total}¥</div>
            </div>
            {/* Payment option */}
            {/* <div className="detail__item background">
              <div className="detail__item_title">Payment type</div>
              {selectedOrder?.payment.paymentOption === 1 ? (
                <>
                  <div className="detail__item_value atm">ATM</div>
                  <div className="detail__item_atm">
                    <div className="atm__value">
                      {selectedOrder?.payment.paymentNumer}
                    </div>
                    -
                    <div className="atm__value">
                      {selectedOrder?.payment.paymentCVV}
                    </div>
                    -
                    <div className="atm__value">
                      {selectedOrder?.payment.paymentDate}
                    </div>
                  </div>
                </>
              ) : (
                <div className="detail__item_value">Cash</div>
              )}
            </div> */}
          </div>
          <div className="detail__item_break"></div>
          {/* Working time */}
          <div className="detail__box">
            <div className="detail__working_list">
              {orderWorkingTime.map((working, index) => (
                <div className="working__item border" key={index}>
                  {working.title === "" ? (
                    <>
                      <div className="working__item_box">
                        <div className="item__title">Start date</div>
                        <div className="item__value">
                          {working.selectedDate}
                        </div>
                      </div>
                      <div className="working__item_box">
                        <div className="item__title">Working time</div>
                        <div className="item__value">
                          {working.startTime}:00 -{" "}
                          {working.startTime + working.duration}:00 (
                          {working.duration}hrs)
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="working__item_box">
                        <div className="item__title">Title</div>
                        {working.title !== "" ? (
                          <div className="item__value">{working.title}</div>
                        ) : (
                          <div className="item__value">...</div>
                        )}
                      </div>
                      <div className="working__item_box">
                        <div className="item__title">Detail</div>
                        {working.detail !== "" ? (
                          <div className="item__value">{working.detail}</div>
                        ) : (
                          <div className="item__value">...</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="detail__item_break"></div>
          <div className="detail__box">
            {/* describe */}
            <div
              className="detail__item_info border"
              onClick={() => setIsDescribe(true)}
            >
              <div className="detail__item_title">Describe</div>
              {orderDescribe !== "" ? (
                <div className="detail__item_value">{orderDescribe}</div>
              ) : (
                <div className="detail__item_value">...</div>
              )}
            </div>
            {/* User Name */}
            <div
              className="detail__item_info half__width border"
              onClick={() => setIsUser(true)}
            >
              <div className="detail__item_value">
                Name: {orderUser?.userFirstName} {orderUser?.userLastName}
              </div>
              <div className="detail__item_value">
                Email: {orderUser?.userEmail}
              </div>
              <div className="detail__item_value">
                Phone number: {orderUser?.userPhone}
              </div>
              <div className="detail__item_value">
                Address: {orderUser?.userAddress} - {orderUser?.userPostCode}
              </div>
            </div>
          </div>
          {/* Belong to */}
          <div className="detail__box more__on_top">
            {selectedOrder?.status === 0 || selectedOrder?.status === 1 ? (
              <div
                className="detail__item half__width"
                onClick={() => setIsStaff(true)}
              >
                {selectedStaff !== "" ? (
                  <>
                    <div className="detail__item_value owner">
                      Responsible: {selectedStaff}
                    </div>
                  </>
                ) : (
                  <div className="detail__item_value">
                    Not assigned to any staff yet!
                  </div>
                )}
              </div>
            ) : (
              <div className="detail__item half__width">
                {selectedStaff !== "" ? (
                  <>
                    <div className="detail__item_value owner">
                      Responsible: {selectedStaff}
                    </div>
                  </>
                ) : (
                  <div className="detail__item_value">
                    Not assigned to any staff yet!
                  </div>
                )}
              </div>
            )}
            <div className="detail__btn_container">
              <div className="btn delete" onClick={() => setIsDelete(true)}>
                Delete this order
              </div>
              <div className="btn close" onClick={handleIsSave}>
                done
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ordermanage__get_latest" onClick={refresh}>
        <TbRefresh className="ordermanage__get_latest_icon" />
      </div>
      {isStaff && (
        <StaffSelection
          closeModal={() => setIsStaff(false)}
          selectedItem={handleSelectedStaff}
        />
      )}
      {isDescribe && (
        <DescribeChange
          closeModal={() => setIsDescribe(false)}
          changeContent={handleChangeDescribe}
          currentContent={orderDescribe}
        />
      )}
      {isUser && (
        <UserInfoChange
          closeModal={() => setIsUser(false)}
          changeContent={handleChangeUserInfo}
          currentContent={orderUser}
        />
      )}
      {isSave && (
        <div className="order__edit_container">
          <div className="save__content">
            <div className="save__title">
              Would you like to save the changes?
            </div>
            <div className="save__btn_container">
              <div className="save__btn btn close" onClick={handleNotSave}>
                no
              </div>
              <div className="save__btn btn save" onClick={handleSave}>
                yes
              </div>
            </div>
          </div>
        </div>
      )}
      {isDelete && (
        <div className="order__edit_container">
          <div className="save__content">
            <div className="save__title">
              Are you sure you want to delete this order?
            </div>
            <div className="save__btn_container">
              <div
                className="save__btn btn close"
                onClick={() => setIsDelete(false)}
              >
                cancel
              </div>
              <div className="save__btn btn delete" onClick={handleDeleteOrder}>
                delete
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
