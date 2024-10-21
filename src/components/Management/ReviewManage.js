import React, { useEffect, useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import { FaArrowRightLong, FaMagnifyingGlass, FaStar } from "react-icons/fa6";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuPackage2 } from "react-icons/lu";
import { MdDone, MdOutlineCleaningServices } from "react-icons/md";
import { IoMdClose, IoMdDoneAll } from "react-icons/io";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export default function ReviewManage({ data, refresh }) {
  const [filteredItems, setFilteredItems] = useState(data);
  const [inputValue, setInputValue] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewState, setReviewState] = useState(0);

  const [stateSelected, setStateSelected] = useState(2);

  useEffect(() => {
    setFilteredItems(data);
  }, [data]);

  const handlePassInItem = (item) => {
    setSelectedItem(item);
    setReviewState(item.state);
    setIsEdit(true);
  };

  // Filter functions
  const filterByInput = (data, input) => {
    return data.filter(
      (item) =>
        item.userName.toLowerCase().includes(input.toLowerCase()) ||
        item.orderId.toLowerCase().includes(input.toLowerCase())
    );
  };
  const filterByStatus = (data, status) => {
    return data.filter((item) => item.state === parseInt(status));
  };

  // Combined filter function
  const handleFilter = () => {
    let result = data;

    if (inputValue) {
      result = filterByInput(result, inputValue);
    }

    if (stateSelected !== 2) {
      console.log(stateSelected);
      result = filterByStatus(result, stateSelected);
    }
    setFilteredItems(result);
  };

  const handleReset = () => {
    setInputValue("");
    setStateSelected(2);
    setFilteredItems(data);
  };

  const handleCloseModalCreate = () => {
    setIsEdit(false);
  };

  const handleUpdateItem = async () => {
    const itemRef = doc(db, "reviewsList", selectedItem?.idFireBase);
    await updateDoc(itemRef, {
      state: reviewState,
    });
    refresh();
    setIsEdit(false);
  };

  const handleDeleteItem = async () => {
    try {
      await deleteDoc(doc(db, "reviewsList", selectedItem?.idFireBase));
      refresh();
      setIsDelete(false);
      setIsEdit(false);
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
              <div className="search__title">ID, name</div>
              <div className="search__content input">
                <input
                  type="text"
                  className="search__input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <FaMagnifyingGlass className="search__btn" />
              </div>
            </div>
            <div className="ordermanage__search_item">
              <div className="search__title">Show/Hide reviews</div>
              <div className="search__content">
                <div
                  onClick={() => setStateSelected(2)}
                  className={`search__content_option ${
                    stateSelected === 2 ? `search__content_option_active` : ``
                  }`}
                >
                  All
                </div>
                <div
                  onClick={() => setStateSelected(1)}
                  className={`search__content_option ${
                    stateSelected === 1 ? `search__content_option_active` : ``
                  }`}
                >
                  Show
                </div>
                <div
                  onClick={() => setStateSelected(0)}
                  className={`search__content_option ${
                    stateSelected === 0 ? `search__content_option_active` : ``
                  }`}
                >
                  Hide
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
              {filteredItems.length > 0 ? (
                <>
                  {filteredItems.map((item, index) => (
                    <div
                      key={index}
                      className="data__item"
                      onClick={() => handlePassInItem(item)}
                    >
                      <div className="data__item_group">
                        <div className="data__item_title">Order ID: </div>
                        <div className="data__item_value">#{item.orderId}</div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">User name: </div>
                        <div className="data__item_value">{item.userName}</div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">Service rate: </div>
                        <div className="data__item_value">
                          {item.rateService}/4
                        </div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">Booking rate: </div>
                        <div className="data__item_value">
                          {item.rateBooking}/4
                        </div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">Staff rate: </div>
                        <div className="data__item_value">
                          {item.rateStaff}/4
                        </div>
                      </div>
                      <div className="data__item_group">
                        <div className="data__item_title">State: </div>
                        <div className="data__item_value">
                          {item.state === 0 ? `Hide` : `Show`}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="data__item_no_matching">
                  No results match your filter
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isEdit && (
        <div className="serivce__create_container">
          <div className="service__content">
            <div className="service__headline">Edit review</div>
            <div className="service__input_list">
              <div className="input__item">
                <div className="input__title">Order ID</div>
                <div className="input__title highlight">
                  #{selectedItem?.orderId}
                </div>
              </div>
              <div className="input__item_break"></div>
              <div className="input__item">
                <div className="input__title">User name</div>
                <div className="input__title highlight">
                  {selectedItem?.userName}
                </div>
              </div>
              <div className="input__item_break"></div>

              <div className="input__item">
                <div className="input__title">Service rate</div>
                <div className="input__title highlight">
                  {selectedItem?.rateService}/4
                </div>
              </div>
              <div className="input__item_break"></div>

              <div className="input__item">
                <div className="input__title">Booking rate</div>
                <div className="input__title highlight">
                  {selectedItem?.rateBooking}/4
                </div>
              </div>
              <div className="input__item_break"></div>

              <div className="input__item">
                <div className="input__title">Staff rate</div>
                <div className="input__title highlight">
                  {selectedItem?.rateStaff}/4
                </div>
              </div>
              <div className="input__item_break"></div>

              <div className="input__item">
                <div className="input__title">More feedback</div>
                <div className="input__title highlight">
                  {selectedItem?.rateFeedback}
                </div>
              </div>
              <div className="input__item_break"></div>

              <div className="input__item">
                <div className="input__title">State</div>
                <div className="input__title">
                  <div
                    onClick={() => setReviewState(0)}
                    className={`review__state ${
                      reviewState === 0 ? `active` : ``
                    }`}
                  >
                    Hide
                  </div>
                  <div
                    onClick={() => setReviewState(1)}
                    className={`review__state ${
                      reviewState === 1 ? `active` : ``
                    }`}
                  >
                    Show
                  </div>
                </div>
              </div>
            </div>
            <div className="service__btn_container">
              {isEdit ? (
                <div
                  className="service__btn btn delete"
                  onClick={() => setIsDelete(true)}
                >
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
                <div
                  className="service__btn btn create"
                  onClick={handleUpdateItem}
                >
                  update
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isDelete && (
        <div className="serivce__create_container">
          <div className="service__content remove__width">
            <div className="service__headline delete__title">
              Do you want to delete this review
            </div>
            {/* <div className="service__item">
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
            </div> */}
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
