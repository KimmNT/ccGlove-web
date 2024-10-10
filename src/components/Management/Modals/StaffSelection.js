import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, dbTimeSheet } from "../../../firebase";
import "../../../assets/sass/management/manageItemStyle.scss";

export default function StaffSelection({ closeModal, selectedItem }) {
  //   const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const staffList = [
    { id: "IeX2HTlRHX", userName: "user_1" },
    { id: "QhsyXdaVYM", userName: "user_2" },
    { id: "HUn7R7AhGg", userName: "user_3" },
    { id: "GUI1koq5wi", userName: "user_4" },
    { id: "BsoC9XbGDR", userName: "user_5" },
  ];

  useEffect(() => {
    // getStaffList();
  }, []);

  //   const getStaffList = async () => {
  //     try {
  //       const data = await getDocs(collection(dbTimeSheet, "users"));
  //       const dataList = data.docs.map((doc) => {
  //         const eachData = doc.data();
  //         return {
  //           id: doc.id,
  //           ...eachData,
  //         };
  //       });

  //       setStaffList(dataList);
  //     } catch (error) {
  //       console.error("Error fetching users:", error);
  //       // Handle error as needed
  //     }
  //   };

  const handleSelectedStaff = () => {
    selectedItem(selectedStaff);
    closeModal();
  };

  return (
    <div className="order__edit_container">
      <div className="edit__content">
        <div className="edit__list">
          {staffList.map((staff, index) => (
            <div
              key={index}
              onClick={() => setSelectedStaff(staff)}
              className={`edit__list_item ${
                selectedStaff && selectedStaff.userName === staff.userName
                  ? `edit__list_item_active`
                  : ``
              }`}
            >
              <div className="edit__list_item_title">{staff.userName}</div>
            </div>
          ))}
        </div>
        <div className="edit__btn_container">
          <div className="edit__btn close" onClick={closeModal}>
            close
          </div>
          <div className="edit__btn selected" onClick={handleSelectedStaff}>
            assign this staff
          </div>
        </div>
      </div>
    </div>
  );
}
