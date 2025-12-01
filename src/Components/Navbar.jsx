import React from "react";
import './Navbar.css';
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../contexts/ThemeContext.jsx';
import { Button, Tooltip } from 'antd';
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Navbar = ({ onFocusModeToggle, focusMode }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">TodoList</div>
        <div className="navbar-actions">
          <Tooltip title={focusMode ? 'Exit Focus Mode' : 'Focus Mode'}>
            <Button
              type={focusMode ? 'primary' : 'text'}
              shape="circle"
              icon={<SparklesIcon className="h-5 w-5" />}
              onClick={() => { 
                navigate('/todolist'); 
                onFocusModeToggle(); 
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