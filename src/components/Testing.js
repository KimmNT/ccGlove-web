<<<<<<< HEAD
import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Use QRCodeCanvas or QRCodeSVG

const BankQRCode = () => {
  const [bankInfo, setBankInfo] = useState({
    bankName: "HOKKAIDO SHINKIN BANK", //Jucho (kc)  : HOKKAIDO SHINKIN BANK
    branchName: "108", //058 - 〇五八 (Kanji) - ゼロゴハチ (Katakana) : 108
    accountType: "Current", //(Futsuu) current/general :
    accountNumber: "4204429", //81712551 : 4204429
    accountHolder: "イエペツクス", // キム　チ (Katakana) - KIM CHI : イエペツクス
  });

  // Format the bank information for the QR code
  const bankInfoText = `
    Bank Name: ${bankInfo.bankName}
    Branch Name: ${bankInfo.branchName}
    Account Type: ${bankInfo.accountType}
    Account Number: ${bankInfo.accountNumber}
    Account Holder Name: ${bankInfo.accountHolder}
  `;

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Bank Account QR Code</h2>
      <QRCodeCanvas value={bankInfoText.trim()} size={200} />
      {/* Alternatively, use <QRCodeSVG value={bankInfoText.trim()} size={200} /> */}
      <p>Scan to get bank details</p>
    </div>
  );
};

export default BankQRCode;
=======
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function Testing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle login
  const loginUser = () => {
    // For example purposes, assume token is '12345abcde'
    const token = "12345abcde";
    Cookies.set("urs_login_token_key", token, { expires: 1, path: "/" });
  };

  // Function to handle logout
  const logoutUser = () => {
    Cookies.remove("urs_login_token_key");
  };

  // Check if user is authenticated when component mounts
  useEffect(() => {
    const token = Cookies.get("urs_login_token_key");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div>
      <h1>{isAuthenticated ? "Welcome, User!" : "Please log in"}</h1>
      {!isAuthenticated ? (
        <button onClick={loginUser}>Login</button>
      ) : (
        <button onClick={logoutUser}>Logout</button>
      )}
    </div>
  );
}
>>>>>>> d575be95c60d813898905f0287416ac1e568a54a
