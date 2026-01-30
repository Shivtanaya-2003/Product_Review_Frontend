import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

 const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/users?username=${username}&password=${password}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length) 
          {
          login(data[0]);
          navigate("/products");
        } 
        else 
        {
          alert("Invalid credentials");
        }
      });
  };


  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input  type="text" placeholder="Username"  value={username}  onChange={(e) => setUsername(e.target.value)}  required />

        <div className="password-wrapper">

          <input type={showPassword ? "text" : "password"}  placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>

          <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "👁️" : "🙈"}</span>

        </div>

        <button type="submit">Login</button>

        <p className="register-text">New user? <Link to="/register">Register Here</Link></p>

      </form>
    </div>
  );
};

export default Login;
