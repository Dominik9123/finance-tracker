import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaHome, FaUtensils, FaCar, FaTheaterMasks, FaShoppingCart, FaBriefcaseMedical, FaPlane, FaChartLine, FaBook, FaMoneyBillWave, FaFolderOpen } from "react-icons/fa";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const categories = [
  { name: "Housing", icon: <FaHome /> },
  { name: "Food", icon: <FaUtensils /> },
  { name: "Transport", icon: <FaCar /> },
  { name: "Entertainment", icon: <FaTheaterMasks /> },
  { name: "Shopping", icon: <FaShoppingCart /> },
  { name: "HealthCare", icon: <FaBriefcaseMedical /> },
  { name: "Travel", icon: <FaPlane /> },
  { name: "Savings", icon: <FaChartLine /> },
  { name: "Education", icon: <FaBook /> },
  { name: "Debt's", icon: <FaMoneyBillWave /> },
];

const Dashboard = () => {
  const [salary, setSalary] = useState("");
  const [date, setDate] = useState("");
  const [salaries, setSalaries] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [currency, setCurrency] = useState("USD ($)");

  const [expenses, setExpenses] = useState({});
  const [expenseList, setExpenseList] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);

 useEffect(() => {
    // Pobieranie zapisanych kategorii użytkownika
    const savedCustomCategories = JSON.parse(localStorage.getItem("customCategories") || "[]");
    setCustomCategories(savedCustomCategories);

    // Pobieranie zapisanej waluty
    const savedCurrency = localStorage.getItem("currency") || "USD ($)";
    setCurrency(savedCurrency);

    // Pobieranie danych finansowych
    const savedSalaries = JSON.parse(localStorage.getItem("salaries") || "[]");
    const savedExpenses = JSON.parse(localStorage.getItem("expenses") || "[]");

    setSalaries(savedSalaries);
    setExpenseList(savedExpenses);

}, []); // Uruchamiamy tylko raz po załadowaniu komponentu

useEffect(() => {
    const totalIncome = salaries.reduce((sum, s) => sum + s.amount, 0);
    const totalExpenses = expenseList.reduce((sum, e) => sum + e.amount, 0);

    // Aktualizujemy saldo tylko jeśli wartość faktycznie się zmieniła
    setTotalBalance(prevBalance => {
        const newBalance = totalIncome - totalExpenses;
        return prevBalance !== newBalance ? newBalance : prevBalance;
    });
}, [salaries, expenseList]); // Aktualizujemy tylko gdy zmienia się salaries lub expenseList


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!salary || !date) return;

    const newSalary = { amount: Number(salary), date };
    const updatedSalaries = [...salaries, newSalary];

    localStorage.setItem("salaries", JSON.stringify(updatedSalaries));
    setSalaries(updatedSalaries);

    const updatedTotal = updatedSalaries.reduce((sum, s) => sum + s.amount, 0);
    setTotalBalance(updatedTotal);

    setSalary("");
    setDate("");
  };

  const handleExpenseChange = (category, amount) => {
    setExpenses(prevExpenses => ({
      ...prevExpenses,
      [category]: amount,
    }));
  };

  const handleExpenseSubmit = () => {
    const newExpenses = Object.entries(expenses)
      .filter(([_, amount]) => amount) // Filtrujemy tylko wpisane wartości
      .map(([category, amount]) => ({
        category,
        amount: Number(amount),
        date: new Date().toISOString().split("T")[0],
      }));

    const updatedExpenseList = [...expenseList, ...newExpenses];

    localStorage.setItem("expenses", JSON.stringify(updatedExpenseList));
    setExpenseList(updatedExpenseList);
    setExpenses({});
  };

  const colors = ["#c26f02", "#0277c2"];
  const visibleSalaries = salaries.slice(-5);

  const data = {
  labels: visibleSalaries.length > 0 ? visibleSalaries.map(s => s.date) : ["No Data"],
  datasets: [
    {
      label: `Income (${currency})`, // Uwzględniamy walutę
      data: visibleSalaries.length > 0 ? visibleSalaries.map(s => s.amount) : [0],
      backgroundColor: visibleSalaries.map((_, index) => colors[index % colors.length]), 
      borderColor: "#a55b00",
      borderWidth: 1,
    },
  ],
};

  const expenseData = {
  labels: expenseList.map(exp => `${exp.category}: ${currency} ${exp.amount}`),
  datasets: [
    {
      data: expenseList.map(exp => exp.amount),
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9C27B0", "#FF9800", "#E91E63", "#3F51B5", "#00BCD4", "#8BC34A"],
    },
  ],
};
  return (
    <div className="dashboard">
      <h1 className="outlined-text">Dashboard</h1> 

      <form onSubmit={handleSubmit}>
        <label className="label-text">Salary Amount:</label>
        <input 
          type="number" 
          value={salary} 
          onChange={(e) => setSalary(e.target.value)} 
          placeholder="Enter Amount:" 
          required 
          min="0"
        />

        <label className="label-text">Date:</label>
        <input 
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
        />
        <button type="submit" className="button-payout">Add Payout</button>
        <p className="label-text">Clicking on "Income" hides the chart</p>
      </form>

      <div className="balance-wrapper">

        <div className="balance-container">
        <h3>Total Balance 💵</h3>
        <p>{currency} {totalBalance.toFixed(2)}</p>
        </div>
        

      </div>

      <div className="chart-container">
        <Bar key={JSON.stringify(salaries)} data={data} />
      </div>

      <h2 className="outlined-text expense-title">Add Expense</h2>
      <div className="expense-grid">
        {categories.concat(customCategories).map(({ name, icon }) => (
        <div key={name} className="expense-tile">
          <div className="expense-icon">{icon ? icon : <FaFolderOpen />}</div>
          <span>{name}</span>
          <input
            type="number"
            value={expenses[name] || ""}
            onChange={(e) => handleExpenseChange(name, e.target.value)}
            placeholder="Amount :"
            min="0"
            />
          </div>
        ))}
      </div>

      <button className="expense-submit-button" onClick={handleExpenseSubmit}>
        Add Expense
      </button>
      <p className="label-text">Clicking on "Category" hides the part from the chart</p>
      
      <div className="chart-container">
      <Pie key={JSON.stringify(expenseList)} data={expenseData} />
      </div>

    </div>
  );
};

export default Dashboard;
