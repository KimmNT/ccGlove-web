import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import useAuth from "../../useAuth";
import "../../assets/sass/management/manageShareStyle.scss";
import "../../assets/sass/management/staffStyle.scss";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { IoMdLogOut } from "react-icons/io";
import { FaSearch, FaTimes } from "react-icons/fa";
import { MdDone, MdOutlineCleaningServices } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";

export default function StaffPage() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const { logout } = useAuth();

  const now = new Date();
  const date = now.toLocaleDateString();

  const [staffOrders, setStaffOrders] = useState([]);
  const [filterStaffOrders, setFilterStaffOrders] = useState([]);
  const [btnManageState, setBtnManageState] = useState(0);
  const [orderStateFilter, setOrderStateFilter] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [orderStatus, setOrderStatus] = useState(0);
  const [orderDescribe, setOrderDescribe] = useState("");

  const [isLogout, setIsLogout] = useState(false);
  const [isDetail, setIsDetail] = useState(false);
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    handleGetOrdersByUserID();
  }, []);

  const handleGetOrdersByUserID = async () => {
    try {
      const itemRef = collection(db, "orderList");
      const itemQuery = query(
        itemRef,
        where("belongTo.empID", "==", state.userId)
      );
      const querySnapshot = await getDocs(itemQuery);

      if (querySnapshot.empty) {
        console.log("There is no order yet!");
        return;
      }

      // Map querySnapshot to an array of document data
      const orders = querySnapshot.docs.map((doc) => ({
        idFireBase: doc.id,
        ...doc.data(),
      }));

      setFilterStaffOrders(orders);
      setStaffOrders(orders);
    } catch (error) {
      // Handle any errors that occur during the login process
      console.error("Error during login: ", error);
    }
  };
  // Displays the current order status
  const getOrderStatus = (status) => {
    switch (status) {
      case 1:
        return (
          <>
            <div className="btn confirmed">
              Confirmed <MdDone />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="btn working">
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
              Cancelled <FaTimes />
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
    }
  };
  const renderStatusActions = (orderStatus) => {
    switch (orderStatus) {
      case 1: // Confirmed
        return (
          <>
            <div onClick={() => handleStatusUpdate(2)} className="btn working">
              Working <MdOutlineCleaningServices />
            </div>
          </>
        );
      case 2: // Working
        return (
          <>
            <div onClick={() => handleStatusUpdate(3)} className="btn done">
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
  // Combined filter function
  const handleFilter = (orderState, inputString) => {
    setOrderStateFilter(orderState);
    let result = staffOrders;

    if (inputString !== "") {
      result = filterByInput(result, inputString);
    } else {
      setInputValue("");
    }

    if (orderState !== 0) {
      result = filterByStatus(result, orderState);
    }
    setFilterStaffOrders(result);
  };

  const handleGetOrderDetail = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order?.status);
    setIsDetail(true);
  };
  const handleSave = async () => {
    const now = new Date();
    const date = now.toLocaleDateString(); // e.g., '8/5/2024'
    const time = now.toLocaleTimeString(); // e.g., '3:45:30 PM'
    const orderRef = doc(db, "orderList", selectedOrder?.idFireBase);
    await updateDoc(orderRef, {
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
      describe: orderDescribe,
      status: orderStatus,
      working: {
        date: orderStatus === 2 ? date : selectedOrder?.working.date,
        time: orderStatus === 2 ? time : selectedOrder?.working.time,
      },
    });
    handleGetOrdersByUserID();
    setIsDetail(false);
    setIsSave(false);
  };

  return (
    <div className="staff__container">
      <div className="staff__content">
        <div className="staff__headline">
          <div className="staff__headline_content">
            <div className="staff__headline_item highlight">
              Today is: {date}
            </div>
            <div
              className="staff__headline_logout"
              onClick={() => setIsLogout(true)}
            >
              logout
              <IoMdLogOut className="staff__headline_logout_icon" />
            </div>
          </div>
        </div>
        <div className="staff__headline not_absolute"></div>
        <div className="staff__order_search">
          <div className="staff__search_input">
            <input
              placeholder="Enter Order ID or Customer name"
              value={inputValue.toUpperCase()}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <FaSearch
              className="btn staff__search_btn"
              onClick={() => handleFilter(0, inputValue)}
            />
          </div>
          <div className="staff__order_list">
            {filterStaffOrders.map((order, index) => (
              <div
                key={index}
                className="staff__order_item"
                onClick={() => handleGetOrderDetail(order)}
              >
                <div className="staff__order_box center">
                  <div className="staff__order_value">#{order.id}</div>
                </div>
                <div className="staff__order_box">
                  <div className="staff__order_title">Customer</div>
                  <div className="staff__order_value">
                    {order.user.userFirstName} {order.user.userLastName}
                  </div>
                </div>
                <div className="staff__order_box">
                  <div className="staff__order_title">Service</div>
                  <div className="staff__order_value">
                    {getServiceType(order.type)}
                  </div>
                </div>
                <div className="staff__order_box">
                  <div className="staff__order_title">Date</div>
                  {order.workingTime.slice(0, 1).map((working, index) => (
                    <div key={index} className="staff__order_value daily">
                      {working.selectedDate} <br />
                      {order.type === 1 ? (
                        <div className="adding">
                          + {order.workingTime.length - 1}
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ))}
                </div>
                <div className="staff__order_box center">
                  <div className="staff__order_value">
                    {getOrderStatus(order.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="staff__manage_container">
        <div className="staff__manage_content">
          {btnManageState === 0 && (
            <div className="staff__manage_order__content">
              <div
                className={`staff__manage_order_btn ${
                  orderStateFilter === 0 ? `all` : ``
                }`}
                onClick={() => handleFilter(0, "")}
              >
                All
              </div>
              <div
                className={`staff__manage_order_btn ${
                  orderStateFilter === 1 ? `confirmed` : ``
                }`}
                onClick={() => handleFilter(1, "")}
              >
                Confirmed
              </div>
              <div
                className={`staff__manage_order_btn ${
                  orderStateFilter === 2 ? `working` : ``
                }`}
                onClick={() => handleFilter(2, "")}
              >
                Working
              </div>
              <div
                className={`staff__manage_order_btn ${
                  orderStateFilter === 3 ? `done` : ``
                }`}
                onClick={() => handleFilter(3, "")}
              >
                Done
              </div>
              <div
                className={`staff__manage_order_btn ${
                  orderStateFilter === 4 ? `cancel` : ``
                }`}
                onClick={() => handleFilter(4, "")}
              >
                Cancelled
              </div>
            </div>
          )}
        </div>
      </div>
      {isLogout && (
        <div className="manage__logout_alert">
          <div className="logout__alert">
            <div className="logout__alert_title">Do you want to log out ?</div>
            <div className="logout__alert_btn">
              <div
                className="btn logout_cancel"
                onClick={() => setIsLogout(false)}
              >
                cancel
              </div>
              <div
                className="btn logout"
                onClick={() => {
                  logout();
                  navigateToPage("/loginPage");
                }}
              >
                ok
              </div>
            </div>
          </div>
        </div>
      )}
      {isDetail && (
        <div className="staff__order_detail">
          <div className="staff__detail_content">
            <div className="staff__detail_item">
              <div className="staff__detail_item_value highlight">
                #{selectedOrder?.id}
              </div>
            </div>
            <div className="staff__detail_item_content">
              <div className="staff__detail_item_break"></div>
              <div className="staff__detail_item">
                <div className="staff__detail_item_title">Service</div>
                <div className="staff__detail_item_value">
                  {getServiceType(selectedOrder?.type)}
                </div>
              </div>
              <div className="staff__detail_item_break"></div>
              <div className="staff__detail_item">
                <div className="staff__detail_item_title">Customer</div>
                <div className="staff__detail_item_list one__line">
                  <div className="staff__detail_item_value">
                    Name: {selectedOrder?.user.userFirstName}{" "}
                    {selectedOrder?.user.userLastName}
                  </div>
                  <div className="staff__detail_item_value">
                    Email: {selectedOrder?.user.userEmail}
                  </div>
                  <div className="staff__detail_item_value">
                    Phone number: {selectedOrder?.user.userPhone}
                  </div>
                  <div className="staff__detail_item_value">
                    Postcode: {selectedOrder?.user.userPostCode}
                  </div>
                  <div className="staff__detail_item_value">
                    Address: {selectedOrder?.user.userAddress}
                  </div>
                </div>
              </div>
              <div className="staff__detail_item_break"></div>
              <div className="staff__detail_item">
                <div className="staff__detail_item_title">Working</div>
                <div className="staff__detail_item_list">
                  {selectedOrder?.workingTime.map((working, index) => (
                    <div key={index} className="staff__detail_item_list_item">
                      <div className="staff__detail_list_box">
                        <div className="staff__detail_list_box_title">Date</div>
                        <div className="staff__detail_list_box_value">
                          {working.selectedDate}
                        </div>
                      </div>
                      <div className="staff__detail_list_box">
                        <div className="staff__detail_list_box_title">
                          Start time
                        </div>
                        <div className="staff__detail_list_box_value">
                          {working.startTime}:00 -{" "}
                          {working.startTime + working.duration}
                          :00{" "}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="staff__detail_item_break"></div>
              {orderStatus === 3 && (
                <div className="staff__detail_item">
                  <div className="staff__detail_item_title">Describe</div>
                  <textarea
                    placeholder="Give a note about this order"
                    value={
                      selectedOrder?.describe !== ""
                        ? selectedOrder?.describe
                        : orderDescribe
                    }
                    onChange={(e) => setOrderDescribe(e.target.value)}
                    className="staff__detail_item_textarea"
                    rows={3}
                  ></textarea>
                </div>
              )}
            </div>
            <div className="staff__detail_item_btn_container">
              {orderStatus === 3 ? (
                <div></div>
              ) : (
                <>
                  {orderStatus === 4 ? (
                    <div className="btn cancel">
                      Cancelled <FaTimes />
                    </div>
                  ) : (
                    <div className="staff__detail_item_btn">
                      {getOrderStatus(orderStatus)}
                      <FaArrowRightLong className="staff__detail_item_icon" />
                      {renderStatusActions(orderStatus)}
                    </div>
                  )}
                </>
              )}
              <div className="staff__detail_item_btn">
                <div
                  className="btn close"
                  onClick={() => {
                    setIsDetail(false);
                  }}
                >
                  close
                </div>
                <div className="btn save" onClick={handleSave}>
                  save
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
