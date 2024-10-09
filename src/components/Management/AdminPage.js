import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/management/manageShareStyle.scss";
import "../../assets/sass/management/adminStyle.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, dbTimeSheet } from "../../firebase";
import { IoMdLogOut } from "react-icons/io";
import sampleData from "../../sampleData.json";
import { LuPackageSearch } from "react-icons/lu";
import { MdOutlineDashboardCustomize, MdOutlineDiscount } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import OrderManage from "./OrderManage";
import DiscountManage from "./DiscountManage";
import CustomServiceManage from "./CustomServiceManage";
import ReviewManage from "./ReviewManage";

export default function AdminPage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate
  const now = new Date();
  const date = now.toLocaleDateString(); // e.g., '8/5/2024'

  const [isLogout, setIsLogout] = useState(false);
  const [sideBarState, setSideBarState] = useState(0);
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    getOrderList();
  }, []);

  const getOrderList = async () => {
    try {
      const data = await getDocs(collection(db, "orderList"));
      const ordersData = data.docs.map((doc) => {
        const orderData = doc.data();
        return {
          id: doc.id,
          ...orderData,
        };
      });

      setOrderList(ordersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="admin__container">
      <div className="admin__content">
        <div className="admin__side_container">
          <div className="side__headline">Today is {date}</div>
          <div className="side__navbar">
            <div className="side__navbar_content">
              <div
                onClick={() => setSideBarState(0)}
                className={`navbar__item ${
                  sideBarState === 0 ? "navbar__item_active" : ""
                }`}
              >
                <LuPackageSearch className="navbar__item_icon" />
                <div className="navbar__item_title">Orders</div>
              </div>
              <div
                onClick={() => setSideBarState(1)}
                className={`navbar__item ${
                  sideBarState === 1 ? "navbar__item_active" : ""
                }`}
              >
                <MdOutlineDiscount className="navbar__item_icon" />
                <div className="navbar__item_title">Discount</div>
              </div>
              <div
                onClick={() => setSideBarState(2)}
                className={`navbar__item ${
                  sideBarState === 2 ? "navbar__item_active" : ""
                }`}
              >
                <MdOutlineDashboardCustomize className="navbar__item_icon" />
                <div className="navbar__item_title">Custom Services</div>
              </div>
              <div
                onClick={() => setSideBarState(3)}
                className={`navbar__item ${
                  sideBarState === 3 ? "navbar__item_active" : ""
                }`}
              >
                <FaRegStar className="navbar__item_icon" />
                <div className="navbar__item_title">Reviews</div>
              </div>
            </div>
          </div>
          <div className="side__logout" onClick={() => setIsLogout(true)}>
            logout
            <IoMdLogOut className="side__logout_icon" />
          </div>
        </div>
        <div className="admin__manage">
          <div className="for__navbar"></div>
          <div className="manage__content">
            {sideBarState === 0 ? (
              <OrderManage data={sampleData} />
            ) : sideBarState === 1 ? (
              <DiscountManage />
            ) : sideBarState === 2 ? (
              <CustomServiceManage />
            ) : (
              <ReviewManage />
            )}
          </div>
        </div>
      </div>
      {isLogout && (
        <div className="manage__logout_alert">
          <div className="logout__alert">
            <div className="logout__alert_title">Do you want to log out ?</div>
            <div className="logout__alert_btn">
              <div className="btn cancel" onClick={() => setIsLogout(false)}>
                cancel
              </div>
              <div
                className="btn logout"
                onClick={() => navigateToPage("/loginPage")}
              >
                ok
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}