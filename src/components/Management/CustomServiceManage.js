import React, { useEffect, useRef, useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, dbTimeSheet } from "../../firebase";
import { FaPlus } from "react-icons/fa";
import { MdArrowOutward } from "react-icons/md";

export default function CustomServiceManage({ data, refresh }) {
  const textareaRef = useRef(null);

  const [customeServiceList, setCustomServiceList] = useState([]);
  const [filterService, setFilterService] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [selectedType, setSelectedType] = useState("all");

  const [serviceID, setServiceID] = useState("");
  const [serviceNewName, setServiceNewName] = useState("");
  const [serviceNewDetail, setServiceNewDetail] = useState("");
  const [serviceNewType, setServiceNewType] = useState("");
  const [serviceNewLink, setServiceNewLink] = useState("");

  const [typeInput, setTypeInput] = useState("");

  const [isCreate, setIsCreate] = useState(false);
  const [isCreateType, setIsCreateType] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    getServicesList();
    getTypeList();
  }, []);

  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
    }
  };

  const getServicesList = async () => {
    try {
      const data = await getDocs(collection(db, "servicesList"));
      const dataList = data.docs.map((doc) => {
        const eachData = doc.data();
        return {
          idFireBase: doc.id,
          ...eachData,
        };
      });
      setFilterService(dataList);
      setCustomServiceList(dataList);
      // setServiceType([...new Set(dataList.map((data) => data.type))]);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error as needed
    }
  };
  const getTypeList = async () => {
    try {
      const data = await getDocs(collection(db, "servicesTypeList"));
      const dataList = data.docs.map((doc) => {
        const eachData = doc.data();
        return {
          idFireBase: doc.id,
          ...eachData,
        };
      });
      setServiceType([...new Set(dataList.map((data) => data.typeName))]);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSortService = (type) => {
    setSelectedType(type);
    if (type === "all") {
      setFilterService(customeServiceList);
    } else {
      const sorted = customeServiceList.filter(
        (service) => service.type === type
      );
      setFilterService(sorted);
    }
  };

  const handleCloseServiceModal = () => {
    setIsCreate(false);
    setIsEdit(false);
    setIsDelete(false);
    setServiceNewDetail("");
    setServiceNewName("");
    setServiceNewType("");
  };

  const handleCreateService = async () => {
    await addDoc(collection(db, "servicesList"), {
      detail: serviceNewDetail,
      name: serviceNewName,
      type: serviceNewType,
    });
    getServicesList();
    setIsCreate(false);
    setSelectedType("all");
  };

  const handlePassInServiceInfo = (service) => {
    setIsEdit(true);
    setIsCreate(true);
    setServiceID(service.idFireBase);
    setServiceNewDetail(service.detail);
    setServiceNewName(service.name);
    setServiceNewType(service.type);
  };

  const handleUpdateService = async () => {
    const serviceRef = doc(db, "servicesList", serviceID);
    await updateDoc(serviceRef, {
      detail: serviceNewDetail,
      name: serviceNewName,
      type: serviceNewType,
    });
    getServicesList();
    setIsCreate(false);
  };

  const handleDeleteService = async () => {
    try {
      await deleteDoc(doc(db, "servicesList", serviceID));
      handleCloseServiceModal();
      getServicesList();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateNewType = async () => {
    if (typeInput === "") {
      setIsCreateType(false);
      setTypeInput("");
    } else {
      await addDoc(collection(db, "servicesTypeList"), {
        typeName: typeInput,
      });
      setIsCreateType(false);
      setTypeInput("");
      getTypeList();
    }
  };

  return (
    <div className="ordermanage__container">
      <div className="ordermanage__content">
        <div className="ordermanage__navbar">
          <div className="ordermanage__search">
            <div className="ordermanage__search_item">
              <div className="search__title">Service Type List</div>
              <div className="search__content">
                <div
                  onClick={() => handleSortService("all")}
                  className={`search__content_state smaller ${
                    selectedType === "all" ? "all__active" : ""
                  }`}
                >
                  All
                </div>
                {serviceType.map((service, index) => (
                  <div
                    key={index}
                    onClick={() => handleSortService(service)}
                    className={`search__content_state smaller ${
                      selectedType === service ? "all__active" : ""
                    }`}
                  >
                    {service}
                  </div>
                ))}
                {isCreateType ? (
                  <div className="create__new_type">
                    <input
                      placeholder="Enter new type"
                      value={typeInput}
                      onChange={(e) => setTypeInput(e.target.value)}
                    />
                    <div
                      onClick={handleCreateNewType}
                      className="create__new_type_btn"
                    >
                      submit
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsCreateType(true)}
                    className="search__content_btn fullwidth btn create"
                  >
                    <FaPlus />
                  </div>
                )}
              </div>
              <div className="ordermanage__search_break"></div>
              <div className="search__title">Create new serivce</div>
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
        </div>
        <div className="ordermanage__navbar notAbsolute"></div>
        <div className="ordermanage__data">
          <div className="data__content">
            <div className="data__list">
              {filterService.map((item, index) => (
                <div
                  key={index}
                  className="data__item"
                  onClick={() => handlePassInServiceInfo(item)}
                >
                  <div className="data__item_headline smaller">{item.name}</div>
                  <div className="data__item_group">
                    <div className="data__item_title">Service type: </div>
                    <div className="data__item_value">{item.type}</div>
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
            <div className="service__headline">
              {isEdit ? `Update service blog` : `Create new service blog`}
            </div>
            <div className="service__input_list">
              <div className="input__item">
                <div className="input__title">Service name</div>
                <input
                  value={serviceNewName}
                  onChange={(e) => setServiceNewName(e.target.value)}
                />
              </div>
              <div className="input__item">
                <div className="input__title">Service detail</div>
                <textarea
                  ref={textareaRef}
                  value={serviceNewDetail}
                  rows={3}
                  onChange={(e) => {
                    setServiceNewDetail(e.target.value);
                    handleResize(); // Auto-resize on content change
                  }}
                  className="input__textarea"
                ></textarea>
              </div>
              <div className="input__item">
                <div className="input__title">Service link</div>
                <div className="input__link">
                  <input
                    value={serviceNewLink}
                    onChange={(e) => setServiceNewLink(e.target.value)}
                  />
                  {serviceNewLink !== "" ? (
                    <a href={serviceNewLink} target="_blank">
                      <MdArrowOutward />
                    </a>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="input__item">
                <div className="input__title">Service type</div>
                <div className="input__list">
                  {serviceType.map((service, index) => (
                    <div
                      className={`input__list_item ${
                        serviceNewType === service ? `active` : ``
                      }`}
                      onClick={() => setServiceNewType(service)}
                      key={index}
                    >
                      {service}
                    </div>
                  ))}
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
                  onClick={handleCloseServiceModal}
                >
                  close
                </div>
                {isEdit ? (
                  <div
                    className="service__btn btn create"
                    onClick={handleUpdateService}
                  >
                    update
                  </div>
                ) : (
                  <div
                    className="service__btn btn create"
                    onClick={handleCreateService}
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
          <div className="service__content remove__width">
            <div className="service__headline delete__title">
              Do you want to delete service <br />
              <span className="service__headline">{serviceNewName}</span>
            </div>
            <div className="service__btn_container">
              <div></div>
              <div className="service__btn_group">
                <div
                  className="service__btn btn close"
                  onClick={handleCloseServiceModal}
                >
                  close
                </div>
                <div
                  className="service__btn btn delete"
                  onClick={handleDeleteService}
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
