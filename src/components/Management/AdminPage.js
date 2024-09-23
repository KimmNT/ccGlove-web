import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/management/manageShareStyle.scss";
import "../../assets/sass/management/adminStyle.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbTimeSheet } from "../../firebase";
import { IoMdLogOut } from "react-icons/io";

export default function AdminPage() {
  const { navigateToPage } = usePageNavigation(); // Custom hook to navigate

  const [isLogout, setIsLogout] = useState(false);
  return (
    <div className="manage__container">
      <div className="manage__content"></div>
      <div className="manage__logout" onClick={() => setIsLogout(true)}>
        logout
        <IoMdLogOut className="manage__logout_icon" />
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
