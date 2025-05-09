import React, { useState, useEffect } from "react";
import "./History.css";

const History = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
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

  return (
    <div className="history-container">
      <h1 className="outlined-text">Transaction History</h1>
      <ul className="transaction-history-list">
        {transactions.map((transaction, index) => (
          <li key={index} className={`transaction-item ${transaction.type.toLowerCase()}`}>
            <span className="transaction-amount">
              {transaction.type === "Income" ? "+" : "-"}${transaction.amount}
            </span>
            <span className="transaction-type">{transaction.type}</span>
            <span className="transaction-date">{transaction.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
