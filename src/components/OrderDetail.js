import React, { useState } from "react";
import "../assets/sass/shareStyle.scss";
import "../assets/sass/orderDetailStyle.scss";
import { FaAngleLeft } from "react-icons/fa";

import usePageNavigation from "../uesPageNavigation";
import { deleteDoc, doc, getDoc, or, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function OrderDetail() {
  const { state, navigateToPage } = usePageNavigation();
  const orderDetail = state?.orderDetail;

  const [order, setOrder] = useState(orderDetail);
  console.log(order);

  const handleGoBack = () => {
    navigateToPage("/");
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteDoc(doc(db, "orderList", orderDetail.firestoreId));
      navigateToPage("/");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      // Reference to the Firestore document
      const orderRef = doc(db, "orderList", orderDetail.firestoreId);

      // Update the order status in Firestore
      await updateDoc(orderRef, { status: newStatus });

      //   Update the local state for the single order item
      setOrder((prevOrder) => ({
        ...prevOrder,
        status: newStatus,
      }));
      console.log(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="container">
      <div className="content">
        <div className="order__detail_container">
          <div className="order_detail_header">
            <div onClick={handleGoBack} className="header__goback">
              <FaAngleLeft />
            </div>
            <div className="header__order_id">#{order.id}</div>
          </div>
          <div className="order__detail_content">
            <div className="order__detail">
              <div className="order__column">
                <div className="order__box">
                  <div className="box__title small__text">Status</div>
                  <div className="box__info">
                    {order.status === 0 ? (
                      <div className="box__value small__text pending">
                        Pending
                      </div>
                    ) : order.status == 1 ? (
                      <div className="box__value small__text confirm">
                        Confirmed
                      </div>
                    ) : order.status === 2 ? (
                      <div className="box__value small__text confirm">
                        Working
                      </div>
                    ) : order.status === 3 ? (
                      <div className="box__value small__text done">Done</div>
                    ) : (
                      <div className="box__value small__text cancel">
                        Cancel
                      </div>
                    )}
                    <div className="box__state">
                      {order.status === 0 && (
                        <>
                          <div
                            className="state_btn small__text confirm"
                            onClick={() => handleUpdateStatus(1)}
                          >
                            Confirm
                          </div>
                          <div
                            className="state__btn small__text cancel"
                            onClick={() => handleUpdateStatus(4)}
                          >
                            Cancel
                          </div>
                        </>
                      )}
                      {order.status === 1 && (
                        <>
                          <div
                            className="state_btn small__text confirm"
                            onClick={() => handleUpdateStatus(2)}
                          >
                            Working
                          </div>
                          <div
                            className="state__btn  small__text cancel"
                            onClick={() => handleUpdateStatus(4)}
                          >
                            Cancel
                          </div>
                        </>
                      )}
                      {order.status === 2 && (
                        <>
                          <div
                            className="state_btn small__text done"
                            onClick={() => handleUpdateStatus(3)}
                          >
                            Done
                          </div>
                          <div
                            className="state__btn small__text cancel"
                            onClick={() => handleUpdateStatus(4)}
                          >
                            Cancel
                          </div>
                        </>
                      )}
                      {order.status === 3 && (
                        <>
                          {/* <button disabled>Order Completed</button> */}
                          <div
                            className="state__btn cancel"
                            onClick={() => handleUpdateStatus(4)}
                          >
                            Cancel
                          </div>
                        </>
                      )}
                      {order.status === 4 && <div disabled>Order Canceled</div>}
                    </div>
                  </div>
                </div>
                <div className="order__box">
                  <div className="box__title small__text">Service</div>
                  <div className="box__info">
                    {order.type === 0 ? (
                      <div className="box__value small__text">
                        Hire in Hours
                      </div>
                    ) : order.type === 1 ? (
                      <div className="box__value small__text">Hire in Days</div>
                    ) : (
                      <div className="box__value small__text">
                        Hire with Custom
                      </div>
                    )}
                  </div>
                </div>
                <div className="order__box">
                  <div className="box__title small__text">Name</div>
                  <div className="box__info small__text">
                    {order.userFirstName} {order.userLastName}
                  </div>
                </div>
                <div className="order__box">
                  <div className="box__title small__text">Address</div>
                  <div className="box__info small__text">
                    {order.userAddress}
                  </div>
                </div>
              </div>
              <div className="order__column">
                <div className="box__title">Working</div>
                <div className="box__list">
                  {order.workingTime.map((working, index) => (
                    <div key={index} className="item">
                      <div className="item__box">
                        <div className="item__box_title">Date</div>
                        <div className="item__box_value">
                          {working.selectedDate}
                        </div>
                      </div>
                      <div className="item__box">
                        <div className="item__box_title">Duration</div>
                        <div className="item__box_value">
                          {working.duration} hours
                        </div>
                      </div>
                      <div className="item__box">
                        <div className="item__box_title">Start time</div>
                        <div className="item__box_value">
                          {working.startTime}:00
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="order__detail_delete" onClick={handleDeleteOrder}>
            delete this order
          </div>
        </div>
      </div>
    </div>
  );
}
