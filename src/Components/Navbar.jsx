import React from "react";
import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../contexts/ThemeContext.jsx';
import { Button, Tooltip } from 'antd';
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';
import copartLogo from '/Copart_logo.svg';

// Simple inline car icon (keeps dependency-free and matches heroicons style)
const CarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 13.5V11a2 2 0 0 1 2-2h1l1.5-3h8L18 9h1a2 2 0 0 1 2 2v2.5" />
    <circle cx="7.5" cy="16.5" r="1" />
    <circle cx="17.5" cy="16.5" r="1" />
  </svg>
);

const Navbar = ({ onFocusModeToggle, focusMode }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  const [brand, setBrand] = React.useState('Assignment-Entry-Point');
  const OnFocusToggle=()=>{
    onFocusModeToggle();
    if(!focusMode){
      navigate('/todolist');
      setBrand('To-Do List');
    }else{
      navigate('/');
      setBrand('Assignment-Entry-Point');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div>
            {brand === 'Car Inventory' && (
              <img
                src={copartLogo}
                width={129}
                height={45}
                alt="Car Inventory"
                style={{ verticalAlign: 'middle', marginRight: 8 }}
              />
            )}
            <span>{brand}</span>
          </div>
        </div>
        <div className="navbar-actions">
          {/* Cars navigation icon */}
          <Tooltip title="Cars">
            <Button
              type="text"
              shape="circle"
              icon={<CarIcon className="h-5 w-5" />}
              onClick={() => { navigate('/cars'); setBrand('Car Inventory'); }}
            />
          </Tooltip>

          {/* Focus Mode toggle */}
          <Tooltip title={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}>
            <Button
              type={focusMode ? 'primary' : 'text'}
              shape="circle"
              icon={<SparklesIcon className="h-5 w-5" />}
              onClick={() => { 
                OnFocusToggle(); 
              }}
              aria-pressed={!!focusMode}
            />
          </Tooltip>
          
          <Tooltip title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <Button
              type="text"
              shape="circle"
              icon={
                theme === 'light' ? (
                  <MoonIcon className="h-5 w-5" />
                ) : (
                  <SunIcon className="h-5 w-5" />
                )
              }
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
            />
          </Tooltip>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;