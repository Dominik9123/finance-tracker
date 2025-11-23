import React from "react";
import "./LoginModel.css"; 

function LoginModel() {
  return (
    <div className="overlay">
      <div className="modal">
        <h2>Finance Tracker</h2>
        <p>Login To <span class="logintext">Continue</span></p>
        <p>Or</p>
        <p><span class="logintext">Create</span> New Account</p>
        <div className="inputs">
          <input type="text" placeholder="E-Mail" disabled />
          <input type="password" placeholder="Password" disabled />
        </div>
        <button class="loginbutton">Login</button>
        <button class="registerbutton">Register</button>
      </div>
    </div>
  );
}

export default LoginModel;
