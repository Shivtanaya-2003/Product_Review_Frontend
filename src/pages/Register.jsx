import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    username: "",
    password: "",
  });

  const navigate = useNavigate();

 const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://product-review-backend-ibw8.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
     .then((res) => {
      if (!res.ok) {
        throw new Error("Registration failed");
      }
      return res.json();
    })
    .then(() => {
      toast.success("Registration successful! Please login 🎉");
      navigate("/login");
    })
    .catch(() => {
      toast.error("Registration failed. Please try again ❌");
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange}required/>

        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required/>

        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="other">Other</option>
        </select>

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>

        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange}required/>

<div className="password-wrapper">

  <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange}required/>
  
  <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}> {showPassword ? "👁️" : "🙈"}</span>
</div>


        <button type="submit">Register</button>

        <p className="login-text"> Already have an account? <Link to="/login">Login</Link></p>

      </form>
    </div>
  );
};

export default Register;
