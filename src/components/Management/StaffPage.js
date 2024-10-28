import { useEffect, useState } from "react";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path
import "../../assets/sass/management/manageShareStyle.scss";
import "../../assets/sass/management/staffStyle.scss";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, dbTimeSheet } from "../../firebase";
import { IoMdLogOut } from "react-icons/io";
import { LuPackageSearch } from "react-icons/lu";
import { MdOutlineDashboardCustomize, MdOutlineDiscount } from "react-icons/md";
import { LuCalendarHeart } from "react-icons/lu";
import { FaRegImage, FaRegStar } from "react-icons/fa";

export default function StaffPage() {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate

  return (
    <div className="staff__container">
      <div className="staff__content">StaffPage</div>
    </div>
  );
}
