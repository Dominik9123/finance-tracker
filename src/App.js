import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import LoginModel from "./components/LoginModel";

const App = () => {
  return (
    <Router basename="/finance-tracker">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
           <Route path="/login" element={<LoginModel />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
