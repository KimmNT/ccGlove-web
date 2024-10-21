import React, { useEffect, useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import { FaArrowRightLong, FaMagnifyingGlass, FaStar } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuPackage2 } from "react-icons/lu";
import { MdDone, MdOutlineCleaningServices } from "react-icons/md";
import { IoMdClose, IoMdDoneAll } from "react-icons/io";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

export default function DiscountManage({ data, refresh }) {
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountReuse, setDiscountReuse] = useState(0);
  const [alertContent, setAlertContent] = useState("");

  const handlePassInItem = (item) => {
    setSelectedItem(item);
    setIsDelete(true);
  };

  const getExpiredDate = (date) => {
    const currentDate = new Date(date); // Your starting date
    const sixMonthsLater = new Date(
      currentDate.setMonth(currentDate.getMonth() + 6)
    );
    // Extract the month, day, and year
    const month = (sixMonthsLater.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so we add 1
    const day = sixMonthsLater.getDate().toString().padStart(2, "0");
    const year = sixMonthsLater.getFullYear();

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  };

  const handleCloseModalCreate = () => {
    setDiscountCode("");
    setDiscountValue(0);
    setIsCreate(false);
  };

  const handleCreateItem = async () => {
    if (discountValue === 0 && discountCode === "") {
      setAlertContent("*Please fill in all requiered fields");
      setDiscountValue(0);
      setDiscountCode("");
    } else {
      const now = new Date();
      const date = now.toLocaleDateString();
      await addDoc(collection(db, "discountList"), {
        discountCode: discountCode,
        discountCreatedDate: date,
        discountValue: discountValue,
        discountReuse: discountReuse,
      });
      setDiscountValue(0);
      setDiscountCode("");
      refresh();
      setIsCreate(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteDoc(doc(db, "discountList", selectedItem?.idFireBase));
      refresh();
      setIsDelete(false);
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
              <div className="search__content">
                <div
                  className="search__content_btn fullwidth btn create"
                  onClick={() => setIsCreate(true)}
                >
                  create new
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ordermanage__navbar notAbsolute"></div>
        <div className="ordermanage__data">
          <div className="data__content">
            <div className="data__list">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="data__item"
                  onClick={() => handlePassInItem(item)}
                >
                  <div className="data__item_headline">
                    #{item.discountCode}
                  </div>
                  <div className="data__item_group">
                    <div className="data__item_title">Discount value: </div>
                    <div className="data__item_value">
                      {item.discountValue}%
                    </div>
                  </div>
                  <div className="data__item_group">
                    <div className="data__item_title">Created date: </div>
                    <div className="data__item_value">
                      {item.discountCreatedDate}
                    </div>
                  </div>
                  <div className="data__item_group">
                    <div className="data__item_title">Expired date: </div>
                    <div className="data__item_value">
                      {getExpiredDate(item.discountCreatedDate)}
                    </div>
                  </div>
                  <div className="data__item_group">
                    <div className="data__item_title">Reuse: </div>
                    <div className="data__item_value">
                      {item.discountReuse === 0 ? `Not reuse` : `Reuse`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isCreate && (
        <div className="serivce__create_container">
          <div className="service__content">
            <div className="service__headline">Create new discount</div>
            <div className="service__input_list">
              <div className="input__item">
                <div className="input__title">Discount Code</div>
                <input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                />
              </div>
              <div className="input__item">
                <div className="input__title">Discount Value</div>
                <input
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                />
              </div>
              <div className="input__item">
                <div className="input__title">Discount reuse</div>
                <div className="input__title">
                  <div
                    onClick={() => setDiscountReuse(0)}
                    className={`review__state ${
                      discountReuse === 0 ? `active` : ``
                    }`}
                  >
                    Not reuse
                  </div>
                  <div
                    onClick={() => setDiscountReuse(1)}
                    className={`review__state ${
                      discountReuse === 1 ? `active` : ``
                    }`}
                  >
                    Reuse
                  </div>
                </div>
              </div>
              <div className="input__item_alert">{alertContent}</div>
            </div>
            <div className="service__btn_container">
              {isEdit ? (
                <div className="service__btn btn delete">
                  delete this service
                </div>
              ) : (
                <div></div>
              )}
              <div className="service__btn_group">
                <div
                  className="service__btn btn close"
                  onClick={handleCloseModalCreate}
                >
                  close
                </div>
                {isEdit ? (
                  <div className="service__btn btn create">update</div>
                ) : (
                  <div
                    className="service__btn btn create"
                    onClick={handleCreateItem}
                  >
                    submit
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isDelete && (
        <div className="serivce__create_container">
          <div className="service__content">
            <div className="service__headline delete__title">
              Do you want to delete this discount
            </div>
            <div className="service__item">
              <div className="service__item_box">
                <div className="service__item_title">Discount Code</div>
                <div className="service__item_value">
                  #{selectedItem.discountCode}
                </div>{" "}
              </div>
              <div className="service__item_box">
                <div className="service__item_title">Discount Value</div>
                <div className="service__item_value">
                  {selectedItem.discountValue}%
                </div>{" "}
              </div>
              <div className="service__item_box">
                <div className="service__item_title">Discount Created Date</div>
                <div className="service__item_value">
                  {selectedItem.discountCreatedDate}
                </div>{" "}
              </div>
              <div className="service__item_box">
                <div className="service__item_title">Discount Expired Date</div>
                <div className="service__item_value">
                  {getExpiredDate(selectedItem.discountCreatedDate)}
                </div>{" "}
              </div>
              <div className="service__item_box">
                <div className="service__item_title">Discount Reuse</div>
                <div className="service__item_value">
                  {selectedItem.discountReuse === 0 ? `Not reuse` : `Reuse`}
                </div>{" "}
              </div>
            </div>
            <div className="service__btn_container">
              <div></div>
              <div className="service__btn_group">
                <div
                  className="service__btn btn close"
                  onClick={() => setIsDelete(false)}
                >
                  close
                </div>
                <div
                  className="service__btn btn delete"
                  onClick={handleDeleteItem}
                >
                  delete
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
