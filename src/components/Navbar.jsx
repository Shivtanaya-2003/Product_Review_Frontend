import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user && !(isHomePage || isLoginPage || isRegisterPage)) 
  {
    return null;
  }

  return (
    <nav className="navbar navbar-dark bg-dark px-4 custom-navbar">

      <div className="logo text-white fw-bold">Product Review App</div>

      {user ? (
        <div className="dropdown">

          <button className="btn btn-light rounded-circle user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}><i className="bi bi-person-fill"></i></button>

          {userMenuOpen && (
            <div className="dropdown-menu dropdown-menu-end show mt-2">

             <button className="dropdown-item" onClick={() => navigate("/")}>Home</button>

              <button className="dropdown-item" onClick={() => navigate("/products")}>Products</button>

              <button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button>

              <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {isHomePage && (<Link to="/login" className="btn btn-outline-light btn-sm nav-btn">Login</Link>)}

          {(isLoginPage || isRegisterPage) && (<Link to="/" className="btn btn-outline-light btn-sm nav-btn">Home</Link>)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
