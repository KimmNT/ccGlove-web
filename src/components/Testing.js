import { addDoc, collection } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";

export default function Testing() {
  const handleCreate = async () => {
    await addDoc(collection(db, "orderList"), {
      id: "123123123",
      type: 1,
      user: {
        userFirstName: "asd",
        userLastName: "adsda",
        userEmail: "kimnhatthien140220@gmail.com",
        userPhone: "phone",
        userAddress: ``,
        userPostCode: "postCode",
      },
      status: 0,
      payment: {
        paymentOption: 1,
        paymentNumer: 0,
        paymentCVV: 0,
        paymentDate: 0,
      },
      workingTime: [],
      total: 41244,
      created: {
        date: "12/24/2025",
        time: "13:13:13",
      },
      working: {
        date: "",
        time: "",
      },
      completed: {
        date: "",
        time: "",
      },
      ratingState: 0,
      belongTo: {
        empId: "",
        empName: "",
      },
      describe: "",
    });
  };
  return (
    <div className="content">
      Testing
      <button onClick={handleCreate}>submit</button>
    </div>
  );
}
