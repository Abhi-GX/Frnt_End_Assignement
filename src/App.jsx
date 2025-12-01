import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import ListPage from "./Components/ListPage.jsx";
import Navbar from "./Components/Navbar.jsx";
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
function App() {
  const [focusMode, setFocusMode] = useState(false);
  /* Note: lot of UI part like CSS and styles is generated using AI ,
   just made some changes for the alignment ,
   Concentrated more on React scripts*/


  //  navigate to todolist from the focus Mode in Navbar

  return (
    <>
        <Router>
          <ThemeProvider>
          <Navbar focusMode={focusMode} onFocusModeToggle={() => setFocusMode(!focusMode)} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/todolist" element={<ListPage focus={focusMode} />} />
            </Routes>
          </ThemeProvider>
        </Router>
    </>
  )
}

export default App















