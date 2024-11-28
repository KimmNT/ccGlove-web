import axios from "axios";
import React, { useState } from "react";

export default function Testing() {
  // https://api.translate-japanese-address.com/zip/assist/2310062

  const [address, setAddress] = useState({});
  const [postCodeInput, setPostCodeInput] = useState("");
  const [loading, setLoading] = useState(false);

  const getAddress = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `https://api.translate-japanese-address.com/zip/assist/${postCodeInput}`
      );
      setAddress(result.data.address);
    } catch (error) {
      console.error("Error fetching address:", error);
      alert("Failed to fetch address. Please check the postal code.");
    } finally {
      setLoading(false);
    }
  };

  const isValidPostCode = (postCode) => /^[0-9]{7}$/.test(postCode);

  const handleGetAddress = () => {
    if (isValidPostCode(postCodeInput)) {
      getAddress();
    } else {
      alert("Please enter a valid 7-digit postal code.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      getAddress();
    }
  };

  const handleSplitAddress = (addressString) => {
    const splitedAddress = addressString.split(",");
    console.log(splitedAddress);
  };

  return (
    <div>
      <input
        value={postCodeInput}
        onChange={(e) => setPostCodeInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter 7-digit postal code"
      />
      <button onClick={handleGetAddress} disabled={loading}>
        {loading ? "Loading..." : "GET ADDRESS"}
      </button>
      <button onClick={() => handleSplitAddress(address)}>SPLIT IT</button>
      {address && (
        <div>
          <h3>Address Details:</h3>
          <p>{address}</p>
        </div>
      )}
    </div>
  );
}
