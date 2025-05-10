import React, { useState, useEffect } from "react";
import "./History.css";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState("USD ($)");

  useEffect(() => {
    
     const savedCurrency = localStorage.getItem("currency") || "USD ($)";
      setCurrency(savedCurrency);

    const savedExpenses = localStorage.getItem("expenses");
    const savedIncomes = localStorage.getItem("salaries");

    try {
      const parsedExpenses = savedExpenses ? JSON.parse(savedExpenses).map(exp => ({
        ...exp,
        type: "Expense"
      })) : [];

      const parsedIncomes = savedIncomes ? JSON.parse(savedIncomes).map(inc => ({
        ...inc,
        type: "Income"
      })) : [];

      const allTransactions = [...parsedExpenses, ...parsedIncomes].sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
    } catch (error) {
      console.log("Błąd odczytu histori", error);
      setTransactions([]);
    }
  }, []);

 const getCategoryIcon = (category) => {
   if (!category) return "💵 Income";

  const icons = {
    "Housing": "🏠",
    "Food": "🍔",
    "Transport": "🚗",
    "Entertainment": "🎉",
    "Shopping": "🛒",
    "HealthCare": "💊",
    "Travel": "✈️",
    "Savings": "📈",
    "Education": "📚",
    "Debt's": "💳",
    "Income": "💵 Income",
  };
  return icons[category?.trim()] || "❓ Unknown";
 };


  return (
    <div className="history-container">
      <h1 className="outlined-text">Transaction History</h1>
      <ul className="transaction-history-list">
        {transactions.map((transaction, index) => (
          <li key={index} className={`transaction-item ${transaction.type.toLowerCase()}`}>
            <span className="transaction-amount">
            {transaction.type === "Income" ? "+" : "-"} {currency} {transaction.amount.toFixed(2)}
            </span>
            <span className="transaction-category">
              {getCategoryIcon(transaction.category)} {transaction.category}
            </span>
            <span className="transaction-date">{transaction.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
