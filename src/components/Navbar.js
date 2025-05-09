import React, { useState } from "react";
import { Link } from "react-router-dom";  // Zmiana na Link z react-router-dom
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCompareArrows, MdSpaceDashboard } from "react-icons/md";
import "./Navbar.css";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <nav className="navbar">
        <div className="logo">Finance Tracker</div>
        
        <div className="burger-menu" onClick={() => setIsOpen(!isOpen)}>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
        </div>
  
        <ul className={`nav-links ${isOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <span className="icon-wrapper">
                <MdSpaceDashboard size={24} />
              </span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/history" onClick={() => setIsOpen(false)}>
              <span className="icon-wrapper">
                <MdOutlineCompareArrows size={24} />
              </span>
              <span>Expense History</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={() => setIsOpen(false)}>
              <span className="icon-wrapper">
                <IoSettingsOutline size={24} />
              </span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    );
};

export default Navbar;
