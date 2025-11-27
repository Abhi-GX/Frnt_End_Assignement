import React from "react";
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onFocusModeToggle, focusMode }) => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        
        <div className="navbar-brand" >TodoList</div>

        <div
          onClick={() => { navigate('/todolist');onFocusModeToggle();  }}
          className="navbar-button"
        >
          {focusMode ? "Exit Focus Mode" : "Focus Mode"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
