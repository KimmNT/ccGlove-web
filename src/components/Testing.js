import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export default function Testing() {
  const form = useRef();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [orderID, setOrderID] = useState("");
  const [orderCreated, setOrderCreated] = useState("");
  const [orderType, setOrderType] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);
  const [userAddress, setUserAddress] = useState("");

  // Function to send email
  const sendEmail = (e) => {
    e.preventDefault();

    // Template parameters to be sent via EmailJS
    const templateParams = {
      user_name: userName,
      user_email: userEmail,
      order_id: orderID,
      order__created: orderCreated,
      order__type: orderType,
      order__total: orderTotal,
      user__address: userAddress,
    };

    emailjs
      .send(
        "service_0ow7j3l",
        "template_62uq3kh",
        templateParams,
        "UCOII6_f0u6pockwH"
      )
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };

  return (
    <form ref={form} onSubmit={sendEmail}>
      <label>Name</label>
      <input
        type="text"
        name="user_name"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <label>Email</label>
      <input
        type="email"
        name="user_email"
        value={userEmail}
        onChange={(e) => setUserEmail(e.target.value)}
      />
      <label>OrderID</label>
      <input
        type="text"
        name="orderID"
        value={orderID}
        onChange={(e) => setOrderID(e.target.value)}
      />
      <label>Order created</label>
      <input
        type="text"
        name="order created"
        value={orderCreated}
        onChange={(e) => setOrderCreated(e.target.value)}
      />
      <label>Order type</label>
      <input
        type="text"
        name="order type"
        value={orderType}
        onChange={(e) => setOrderType(e.target.value)}
      />
      <label>Order total</label>
      <input
        type="text"
        name="order total"
        value={orderTotal}
        onChange={(e) => setOrderTotal(e.target.value)}
      />
      <label>User Address</label>
      <input
        type="text"
        name="user address"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <input type="submit" value="Send" />
    </form>
  );
}
