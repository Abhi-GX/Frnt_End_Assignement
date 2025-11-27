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
function App() {
  const [focusMode, setFocusMode] = useState(false);
  return (
    <>
        <Router>
          <Navbar focusMode={focusMode} onFocusModeToggle={() => setFocusMode(!focusMode)} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/todolist" element={<ListPage focus={focusMode} />} />
            </Routes>
        </Router>
    </>
  )
}

export default App















