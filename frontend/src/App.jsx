import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import GuideView from './pages/GuideView';
import UploadGuide from './pages/UploadGuide';
import Login from './pages/Login';
import { setToken } from './api';

export default function App(){
  const [token, setTok] = useState(localStorage.getItem('token'));
  useEffect(()=> setToken(token), [token]);
  return (
    <div>
      <header className="topbar">
        <Link to="/">Car DIY</Link>
        <nav>
          <Link to="/upload">Upload</Link>
          {token ? <button onClick={()=>{setTok(null); localStorage.removeItem('token'); setToken(null); window.location.href='/'}}>Logout</button>
                 : <Link to="/login">Login</Link>}
        </nav>
      </header>
      <main style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/g/:slug" element={<GuideView/>} />
          <Route path="/upload" element={<UploadGuide/>} />
          <Route path="/login" element={<Login setToken={(t)=>{localStorage.setItem('token', t); setTok(t); setToken(t);}}/>} />
        </Routes>
      </main>
    </div>
  );
}
