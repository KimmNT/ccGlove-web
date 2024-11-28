import React, { useEffect, useState } from "react";
import "../../assets/sass/management/manageItemStyle.scss";
import "react-datepicker/dist/react-datepicker.css";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { TbRefresh } from "react-icons/tb";

export default function AreaManage({ data, refresh }) {
  const [areaList, setAreaList] = useState([]);
  const [isCreate, setIsCreate] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [areaFee, setAreaFee] = useState(0);

  useEffect(() => {
    setAreaList(data);
  }, []);

  const handleCreateArea = async () => {
    await addDoc(collection(db, "areaList"), {
      areaName: areaName,
      areaFee: areaFee,
    });
    refresh();
  };

  return (
    <div>
      <div>
        <input value={areaName} onChange={(e) => setAreaName(e.target.value)} />
        <input value={areaFee} onChange={(e) => setAreaFee(e.target.value)} />
        <button onClick={handleCreateArea}>Submit</button>
      </div>
      <div className="ordermanage__get_latest" onClick={refresh}>
        <TbRefresh className="ordermanage__get_latest_icon" />
      </div>
    </div>
  );
}
