import React, { useState, useEffect } from "react";
import "./Settings.css";

const currencyOptions = ["USD ($)", "EUR (€)", "PLN (zł)", "GBP (£)", "JPY (¥)"];

const Settings = () => {
  const [currency, setCurrency] = useState("USD ($)");
  const [selectedCurrency, setSelectedCurrency] = useState("USD ($)");
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleConfirmCurrency = () => {
    setCurrency(selectedCurrency);
    localStorage.setItem("currency", selectedCurrency);
    setConfirmationMessage(`Currency changed to ${selectedCurrency}! ✅`);
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <p>Customize your experience and preferences</p>

      <label className="settings-label">Choose Currency:</label>
      <select className="currency-select" value={selectedCurrency} onChange={handleCurrencyChange}>
        {currencyOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}

      <div className="button-container">
      <button className="confirm-button" onClick={handleConfirmCurrency}>Confirm Currency ✅</button>
      <button className="reset-button" onClick={handleResetData}>Reset Data 🔄</button>
    </div>
    </div>
  );
};

export default Settings;
