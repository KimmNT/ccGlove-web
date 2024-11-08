// import React, { useEffect, useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import CryptoJS from "crypto-js";
// import CheckoutFromStripe from "./Order/CheckoutFromStripe";

// export default function Testing() {
//   const [isStripePromise, setIsStripePromise] = useState(null);
//   const [clientSecret, setClientSecret] = useState("");
//   const [orderValue, setOrderValue] = useState(0);

//   useEffect(() => {
//     fetchAndDecryptKey();
//   }, []);

//   const decryptKey = (encryptedKey) => {
//     const bytes = CryptoJS.AES.decrypt(
//       encryptedKey,
//       "egx8c9rbtz5q73klfdmn4w10hvoip6"
//     );
//     return bytes.toString(CryptoJS.enc.Utf8);
//   };

//   const fetchAndDecryptKey = async () => {
//     const response = await fetch("http://localhost:8080/api/get-publish-key");
//     const data = await response.json();
//     const stripePromise = loadStripe(decryptKey(data.encryptedKey));
//     setIsStripePromise(stripePromise);
//   };

//   const CheckoutForm = ({ clientSecret }) => {
//     const stripe = useStripe();
//     const elements = useElements();
//     const [paymentStatus, setPaymentStatus] = useState("");

//     const handleSubmit = async (event) => {
//       event.preventDefault();

//       if (!stripe || !elements) {
//         return; // Stripe.js has not loaded yet
//       }

//       const cardElement = elements.getElement(CardElement);

//       const { paymentIntent, error } = await stripe.confirmCardPayment(
//         clientSecret,
//         {
//           payment_method: {
//             card: cardElement,
//           },
//         }
//       );

//       if (error) {
//         setPaymentStatus(`Payment failed: ${error.message}`);
//       } else if (paymentIntent.status === "succeeded") {
//         setPaymentStatus("Payment succeeded!");
//       }
//     };

//     const cardElementOptions = {
//       style: {
//         base: {
//           color: "#32325d",
//           fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//           fontSize: "16px",
//           "::placeholder": {
//             color: "#aab7c4",
//           },
//           padding: "10px",
//         },
//         invalid: {
//           color: "#fa755a",
//           iconColor: "#fa755a",
//         },
//       },
//     };

//     return (
//       <form onSubmit={handleSubmit}>
//         <CardElement options={cardElementOptions} />
//         <button type="submit" disabled={!stripe}>
//           Pay
//         </button>
//         <p>{paymentStatus}</p>
//       </form>
//     );
//   };

//   const handleCreateTransaction = (amount) => {
//     fetch(`http://localhost:8080/api/payments/create-payment-intent`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount }),
//     })
//       .then((response) => response.json())
//       .then((data) => setClientSecret(data.clientSecret));
//   };

//   return (
//     <Elements stripe={isStripePromise}>
//       <div>
//         <input
//           type="number"
//           value={orderValue}
//           onChange={(e) => setOrderValue(e.target.value)}
//         />
//         <button onClick={() => handleCreateTransaction(orderValue)}>
//           Submit now
//         </button>
//       </div>
//       {clientSecret && <CheckoutFromStripe clientSecret={clientSecret} />}
//     </Elements>
//   );
// }
