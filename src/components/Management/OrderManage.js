import React, { useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import { FaArrowRightLong, FaMagnifyingGlass, FaStar } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuPackage2 } from "react-icons/lu";
import { MdDone, MdEmail, MdOutlineCleaningServices } from "react-icons/md";
import {
  IoIosClose,
  IoIosDoneAll,
  IoMdClose,
  IoMdDoneAll,
} from "react-icons/io";
import { FaEdit } from "react-icons/fa";

export default function OrderManage({ data }) {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate

  const [filteredOrders, setFilteredOrders] = useState(data);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [typeSelect, setTypeSelect] = useState(3);
  const [stateSelect, setStateSelect] = useState(5);
  const [inputValue, setInputValue] = useState("");
  const [isDetail, setIsDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isATM, setIsATM] = useState(false);

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

  const renderStatusActions = (status) => {
    switch (status) {
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
    console.log(`Status updated to: ${newStatus}`);
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

  const handleCloseOrderDetail = () => {
    setIsDetail(false);
  };

  return (
    <div className="ordermanage__container">
      <div className="ordermanage__content">
        <div className="ordermanage__navbar">
          <div className="ordermanage__search">
            <div className="ordermanage__search_item">
              <div className="search__title">ID, name,...</div>
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
                <div
                  onClick={() => setTypeSelect(2)}
                  className={`search__content_option ${
                    typeSelect === 2 ? `search__content_option_active` : ``
                  }`}
                >
                  Custom Service
                </div>
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
                  className="search__content_btn clear"
                  onClick={handleReset}
                >
                  Clear
                </div>
                <div
                  className="search__content_btn search"
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
                      onClick={() => {
                        setIsDetail(true);
                        setSelectedOrder(item);
                      }}
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
              {getOrderStatus(selectedOrder?.status)}
              {renderStatusActions(selectedOrder?.status)}
            </div>
            <div className="detail__item_break_vertical"></div>
            <>
              <div className="detail__item email">
                Send Email <MdEmail />
              </div>
              {selectedOrder?.ratingState === 0 ? (
                <></>
              ) : (
                <div className="detail__item rating">
                  <FaStar />
                </div>
              )}
            </>
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
                    {selectedOrder?.comepleted.time}
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
            <div className="detail__item_break_vertical"></div>
            {/* Payment option */}
            <div className="detail__item background">
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
            </div>
          </div>
          <div className="detail__item_break"></div>
          {/* Working time */}
          <div className="detail__box">
            <div className="detail__working_list">
              {selectedOrder?.workingTime.map((working, index) => (
                <div className="working__item" key={index}>
                  <div className="working__item_box">
                    <div className="item__title">Start date</div>
                    <div className="item__value">{working.selectedDate}</div>
                  </div>
                  <div className="working__item_box">
                    <div className="item__title">Working time</div>
                    <div className="item__value">
                      {working.startTime}:00 -{" "}
                      {working.startTime + working.duration}:00 (
                      {working.duration}hrs)
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
          </div>
          <div className="detail__item_break"></div>
          <div className="detail__box">
            {/* describe */}
            <div className="detail__item_info border">
              <div className="detail__item_title">Describe</div>
              {selectedOrder?.describe !== "" ? (
                <div className="detail__item_value">
                  {selectedOrder?.describe}
                </div>
              ) : (
                <div className="detail__item_value">...</div>
              )}
            </div>
            {/* User Name */}
            <div className="detail__item_info half__width border">
              <div className="detail__item_value">
                {selectedOrder?.user.userFirstName}{" "}
                {selectedOrder?.user.userLastName}
              </div>
              <div className="detail__item_value">
                {selectedOrder?.user.userEmail}
              </div>
              <div className="detail__item_value">
                {selectedOrder?.user.userPhone}
              </div>
              <div className="detail__item_value">
                {selectedOrder?.user.userAddress}
              </div>
            </div>
          </div>
          {/* Belong to */}
          <div className="detail__box more__on_top">
            <div className="detail__item half__width">
              {selectedOrder?.belongTo.empId !== "" ? (
                <>
                  <div className="detail__item_value">
                    {selectedOrder?.belongTo.empId}
                  </div>
                  <div className="detail__item_value">
                    {selectedOrder?.belongTo.empName}
                  </div>
                </>
              ) : (
                <div className="detail__item_value">
                  Not assigned to any staff yet!
                </div>
              )}
            </div>
            <div className="detail__btn_container">
              <div className="btn delete">Delete this order</div>
              <div className="btn close" onClick={handleCloseOrderDetail}>
                Close
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
