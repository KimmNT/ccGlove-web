import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51PxUfQRppoFEICbDuJs0UimX2Fo5mR0ZvIMlEkH1PTC1FJpySFQoAdxT7SLCFCbgFIECqrFlPktTwqH2KtDmOaUf000fsvrLrb"
);

export default function Testing() {
  const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState("");

    const handleSubmit = async (event) => {
      event.preventDefault();

      if (!stripe || !elements) {
        return; // Stripe.js has not loaded yet
      }

      const cardElement = elements.getElement(CardElement);

      // Confirm the payment with Stripe using the clientSecret
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
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
        <p>{paymentStatus}</p>
      </form>
    );
  };

  const [clientSecret, setClientSecret] = useState("");
  const [orderValue, setOrderValue] = useState(0);

  const handleCreateTransaction = (amount) => {
    fetch(
      "https://ccglove-web-api.onrender.com/api/payments/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // Only need to send amount
      }
    )
      .then((response) => response.json())
      .then((data) => setClientSecret(data.clientSecret));
  };

  return (
    <Elements stripe={stripePromise}>
      <div>
        <input
          value={orderValue}
          onChange={(e) => setOrderValue(e.target.value)}
        />
        <button onClick={() => handleCreateTransaction(orderValue)}>
          Submit now
        </button>
      </div>
      {clientSecret && <CheckoutForm clientSecret={clientSecret} />}
    </Elements>
  );
}
