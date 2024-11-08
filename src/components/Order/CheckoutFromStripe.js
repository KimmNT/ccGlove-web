import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "../../assets/sass/CheckoutFromStripe.scss"; // Optional CSS file for custom styles
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import usePageNavigation from "../../uesPageNavigation"; // Corrected import path

export default function CheckoutFromStripe({ clientSecret, stateValue }) {
  const { navigateToPage, state } = usePageNavigation(); // Custom hook to navigate
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      setPaymentStatus(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentStatus("Payment succeeded!");
      handleNavigate();
    }
    setIsProcessing(false);
  };

  const handleNavigate = async () => {
    const now = new Date();
    const date = now.toLocaleDateString(); // e.g., '8/5/2024'
    const time = now.toLocaleTimeString(); // e.g., '3:45:30 PM'

    await addDoc(collection(db, "orderList"), {
      id: stateValue.orderID,
      type: stateValue.orderType,
      user: {
        userFirstName: stateValue.userInfo.firstName,
        userLastName: stateValue.userInfo.lastName,
        userEmail: stateValue.userInfo.email,
        userPhone: stateValue.userInfo.phone,
        userAddress: `${stateValue.userInfo.addDetail}, ${stateValue.userInfo.district}, ${stateValue.userInfo.city}, ${stateValue.userInfo.prefecture}`,
        userPostCode: stateValue.userInfo.postCode,
      },
      status: 0,
      payment: {
        paymentOption: 1,
        paymentNumer: 0,
        paymentCVV: 0,
        paymentDate: 0,
      },
      workingTime: stateValue.workingTime,
      total: stateValue.paymentCount,
      created: {
        date: date,
        time: time,
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
    if (
      stateValue.discountInfo.discountID !== "" &&
      stateValue.discountInfo.discountReuse === 0
    ) {
      //Remove discount code
      await deleteDoc(
        doc(db, "discountList", stateValue.discountInfo.discountID)
      );
    }
    navigateToPage("/completed", {
      orderID: state.orderID,
      from: "paymentOrder",
    });
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <CardElement options={cardElementOptions} className="card-element" />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="pay-button"
      >
        {isProcessing ? "Processing..." : "Finish your order"}
      </button>
      {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
    </form>
  );
}
