import React, { useEffect, useState, useRef } from "react";
import "../../../assets/sass/management/manageItemStyle.scss";

export default function DescribeChange({
  closeModal,
  changeContent,
  currentContent,
}) {
  const [newDescribe, setNewDescribe] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    setNewDescribe(currentContent);
  }, [currentContent]);

  // Function to handle auto-resize of textarea
  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
    }
  };

  const handleChangeNewDescribe = () => {
    changeContent(newDescribe);
    closeModal();
  };

  return (
    <div className="order__edit_container">
      <div className="edit__content input">
        <div className="edit__item">
          <textarea
            ref={textareaRef}
            value={newDescribe}
            onChange={(e) => {
              setNewDescribe(e.target.value);
              handleResize(); // Auto-resize on content change
            }}
            rows={5} // Initial rows
            className="edit__textarea"
          />
        </div>
        <div className="edit__btn_container">
          <div className="edit__btn btn close" onClick={closeModal}>
            Close
          </div>
          <div
            className="edit__btn btn selected"
            onClick={handleChangeNewDescribe}
          >
            Save
          </div>
        </div>
      </div>
    </div>
  );
}
