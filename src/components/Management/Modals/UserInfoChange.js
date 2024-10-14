import React, { useEffect, useState, useRef } from "react";
import "../../../assets/sass/management/manageItemStyle.scss";

export default function UserInfoChange({
  closeModal,
  changeContent,
  currentContent,
}) {
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setuserLastName] = useState("");
  const [userPostCode, setUserPostCode] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserFirstName(currentContent.userFirstName);
    setuserLastName(currentContent.userLastName);
    setUserPostCode(currentContent.userPostCode);
    setUserAddress(currentContent.userAddress);
    setUserPhone(currentContent.userPhone);
    setUserEmail(currentContent.userEmail);
  }, [currentContent]);

  const handleChangeUserInfo = () => {
    changeContent({
      userAddress: userAddress,
      userEmail: userEmail,
      userFirstName: userFirstName,
      userLastName: userLastName,
      userPhone: userPhone,
      userPostCode: userPostCode,
    });
    closeModal();
  };
  return (
    <div className="order__edit_container">
      <div className="edit__content input">
        <div className="edit__user">
          <div className="edit__user_item">
            <div className="user__item_title">First name</div>
            <input
              value={userFirstName}
              onChange={(e) => setUserFirstName(e.target.value)}
            />
          </div>
          <div className="edit__user_item">
            <div className="user__item_title">Last name</div>
            <input
              value={userLastName}
              onChange={(e) => setuserLastName(e.target.value)}
            />
          </div>
          <div className="edit__user_item">
            <div className="user__item_title">Email</div>
            <input
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>
          <div className="edit__user_item">
            <div className="user__item_title">Phone number</div>
            <input
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
            />
          </div>
          <div className="edit__user_item">
            <div className="user__item_title">Address</div>
            <textarea
              className="textarea"
              value={userAddress}
              rows={3}
              onChange={(e) => setUserAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="edit__user_item">
            <div className="user__item_title">Postcode</div>
            <input
              value={userPostCode}
              onChange={(e) => setUserPostCode(e.target.value)}
            />
          </div>
        </div>
        <div className="edit__btn_container">
          <div className="edit__btn btn close" onClick={closeModal}>
            Close
          </div>
          <div
            className="edit__btn btn selected"
            onClick={handleChangeUserInfo}
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
}
