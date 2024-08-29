import { useEffect, useState } from "react";
import usePageNavigation from "../uesPageNavigation"; // Corrected import path
import "../assets/sass/shareStyle.scss";
import "../assets/sass/homeStyle.scss";
import { FaDownload, FaHome } from "react-icons/fa";
import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import LogoPage from "./LogoPage";

export default function Testing() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate
  const [orderList, setOrderList] = useState([]);

  // useEffect(() => {
  //   getOrders(); // Fetch services when component mounts
  // }, []);

  // const handlePassValue = () => {
  //   navigateToPage("/about", { value: "123123123" });
  // };
  // const getOrders = async () => {
  //   try {
  //     const data = await getDocs(collection(db, "orderList")); // Fetch all documents from the "orderList" collection

  //     const orderData = data.docs.map((doc) => ({
  //       firestoreId: doc.id, // Firestore-generated document ID
  //       ...doc.data(), // All other data fields in the document, including your custom 'id'
  //     }));

  //     setOrderList(orderData); // Update state or do whatever you need with the retrieved data

  //     console.log(orderData); // Log to see the fetched orders with both IDs
  //   } catch (error) {
  //     console.error("Error fetching services:", error);
  //     alert("Failed to fetch services. Please try again later."); // Basic error handling
  //   }
  // };
  // const handleToOrderDetail = async (order) => {
  //   try {
  //     navigateToPage(`/orderDetail/${order.id}`, { orderDetail: order });
  //   } catch (error) {
  //     console.error("Error fetching order details:", error);
  //   }
  // };
  return (
    <div className="container">
      <div className="content">
        <div className="home__container">
          <div className="order__container">
            <div className="order__content">
              {orderList.map((order, index) => (
                <div
                  key={index}
                  onClick={() => handleToOrderDetail(order)}
                  className="order__item"
                >
                  <div className="order__item_box">
                    <div className="box__title small__text">Order ID</div>
                    <div className="box__value small__text">#{order.id}</div>
                  </div>
                  <div className="order__item_box">
                    <div className="box__title small__text">Service</div>
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
                  <div className="order__item_box">
                    <div className="box__title small__text">User name</div>
                    <div className="box__value small__text">
                      {order.userFirstName} {order.userLastName}
                    </div>
                  </div>
                  <div className="order__item_box">
                    <div className="box__title small__text">Created Date</div>
                    <div className="box__value small__text">
                      {order.created.date}
                    </div>
                  </div>
                  <div className="order__item_box">
                    <div className="box__title small__text">Order status</div>
                    {order.status === 0 ? (
                      <div className="box__value small__text status pending">
                        Pending
                      </div>
                    ) : order.status === 1 ? (
                      <div className="box__value small__text status confirmed">
                        Confirmed
                      </div>
                    ) : order.status === 2 ? (
                      <div className="box__value small__text status working">
                        Working
                      </div>
                    ) : order.status === 3 ? (
                      <div className="box__value small__text status done">
                        Done
                      </div>
                    ) : (
                      <div className="box__value small__text status cancel">
                        Cancel
                      </div>
                    )}
                  </div>
                  {/* <div onClick={() => handleDetele(order)}>delete</div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
