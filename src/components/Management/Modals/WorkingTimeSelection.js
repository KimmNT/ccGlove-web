import React, { useState } from "react";
import "../../../assets/sass/management/manageItemStyle.scss";

export default function WorkingTimeSelection({ workingTimeData }) {
  const [workingTitle, setWorkingTitle] = useState("");
  const [workingDescribe, setWorkingDescribe] = useState("");

  const updateItemById = (array, id, newValues) => {
    const item = array.find((item) => item.id === id);
    if (item) {
      Object.assign(item, newValues); // Update item with new values
      console.log(`Updated item:`, item);
    } else {
      console.log(`Item with id ${id} not found`);
    }
  };

  return (
    <div className="order__edit_container">
      <div className="edit__content">jessir</div>
    </div>
  );
}
