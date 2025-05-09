import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend } from "chart.js";
import { FaHome, FaUtensils, FaCar, FaTheaterMasks, FaShoppingCart, FaBriefcaseMedical, FaPlane, FaChartLine, FaBook, FaMoneyBillWave  } from "react-icons/fa";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const categories = [
  { name: "Housing", icon: <FaHome /> },
  { name: "Food", icon: <FaUtensils /> },
  { name: "Transport", icon: <FaCar /> },
  { name: "Entertainment", icon: <FaTheaterMasks /> },
  { name: "Shopping", icon: <FaShoppingCart /> },
  { name: "HealthCare", icon: <FaBriefcaseMedical />},
  { name: "Travel", icon: <FaPlane />},
  { name: "Savings", icon: <FaChartLine />},
  { name: "Education", icon: <FaBook />},
  { name: "Debt's", icon: <FaMoneyBillWave  />},
];

const Dashboard = () => {
  const [salary, setSalary] = useState("");
  const [date, setDate] = useState("");
  const [salaries, setSalaries] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  
  const [expenses, setExpenses] = useState({});
  const [expenseList, setExpenseList] = useState([]);

  useEffect(() => {
    const savedSalaries = localStorage.getItem("salaries");
    const savedExpenses = localStorage.getItem("expenses");

    try {
      const parsedSalaries = savedSalaries ? JSON.parse(savedSalaries) : [];
      const parsedExpenses = savedExpenses ? JSON.parse(savedExpenses) : [];

      setSalaries(parsedSalaries);
      setExpenseList(parsedExpenses);
      
      const total = parsedSalaries.reduce((sum, s) => sum + s.amount, 0);
      setTotalBalance(total);
    } catch (error) {
      console.error("Błąd odczytu danych z localStorage", error);
      setSalaries([]);
      setExpenseList([]);
      setTotalBalance(0);
    }
  }, []);

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
        label: "Income",
        data: visibleSalaries.length > 0 ? visibleSalaries.map(s => s.amount) : [0],
        backgroundColor: visibleSalaries.map((_, index) => colors[index % colors.length]), 
        borderColor: "#a55b00",
        borderWidth: 1,
      },
    ],
  };

  const expenseData = {
    labels: expenseList.map(exp => `${exp.category}: $${exp.amount}`), // Dodany symbol dolara do etykiet
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
        <button type="submit">Add Payout</button>
        <p className="label-text">Clicking on "Income" hides the chart</p>
      </form>

      <div className="balance-container">
        <h3>Total Balance 💵</h3>
        <p>${totalBalance}</p>
      </div>

      <div className="chart-container">
        <Bar key={JSON.stringify(salaries)} data={data} />
      </div>

      <h2 className="outlined-text expense-title">Add Expense</h2>
      <div className="expense-grid">
        {categories.map(({ name, icon }) => (
          <div key={name} className="expense-tile">
            <div className="expense-icon">{icon}</div>
            <span>{name}</span>
            <input
              type="number"
              value={`$${expenses[name] || ""}`}
              onChange={(e) => handleExpenseChange(name, e.target.value.replace(/\$/g, ""))}
              placeholder="Amount :"
              min="0"
            />
          </div>
        ))}
      </div>

      <button className="expense-submit-button" onClick={handleExpenseSubmit}>
        Submit
      </button>
      <p className="label-text">Clicking on category hides the part from the chart</p>
      
      <div className="chart-container">
      <Pie key={JSON.stringify(expenseList)} data={expenseData} />
      </div>

    </div>
  );
};

export default Dashboard;
